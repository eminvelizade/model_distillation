"""Agent pieces without a hub or GPU: run sync payloads and log offsets, release verification and unpacking, the
network guard for training processes, command argument checks, and doctor verdicts."""

import io
import json
import os
import tarfile
import time
from pathlib import Path

import pytest


@pytest.fixture()
def home(tmp_path, monkeypatch):
    monkeypatch.setenv("MODELLAB_HOME", str(tmp_path / "home"))
    monkeypatch.setenv("MODELLAB_RUNS_DIR", str(tmp_path / "home" / "data" / "runs"))
    monkeypatch.setenv("MODELLAB_DATASETS", str(tmp_path / "home" / "data" / "datasets.json"))
    return tmp_path / "home"


class FakeHub:
    def __init__(self):
        self.events, self.files = [], {}

    def post(self, path, body=None):
        self.events.append((path, json.loads(json.dumps(body))))
        return {"status": "running", "cancel_requested": False}

    def put_bytes(self, path, data, content_type, mtime=None):
        self.files[path] = data
        return {"result": "stored"}


def _run(home):
    from modellab import store

    resolved = {"name": "t", "stages": [{"name": "f", "type": "finetune"}, {"name": "e", "type": "eval"}]}
    rid = store.create_run("t", "t", "name: t\n", resolved, None, ["x"], rid="20261030-120000-t-abcdef")
    return rid, store.run_dir(rid)


def test_sync_sends_changes_once_and_whole_lines(home):
    from modellab import store
    from modellab.agent.sync import RunSync

    rid, rd = _run(home)
    store.update_run(rid, status="running", started=1.0, current_stage="f")
    store.update_stage(rid, "f", status="running", started=1.0)
    fdir = rd / "stages" / "f"
    fdir.mkdir(parents=True)
    (rd / "runner.log").write_text("[runner] stage f starting\n")
    (fdir / "log.txt").write_text("epoch 1\nepoch 2 partial")
    (fdir / "progress.json").write_text(json.dumps({"fraction": 0.5, "message": "epoch 2"}))
    (rd / "env.json").write_text(json.dumps({"gpu": {"cuda_available": False}}))
    hub = FakeHub()
    s = RunSync(hub, rid)
    s.push()
    body = hub.events[-1][1]
    assert body["run"]["status"] == "running" and body["run"]["env"] == {"gpu": {"cuda_available": False}}
    assert {x["stream"]: x["text"] for x in body["logs"]} == {"runner": "[runner] stage f starting\n", "f": "epoch 1\n"}
    assert body["stages"][0]["progress"]["fraction"] == 0.5
    n = len(hub.events)
    s.push()
    assert len(hub.events) == n  # nothing changed: nothing sent
    with open(fdir / "log.txt", "a") as f:
        f.write(" done\nepoch 3\n")
    s.push()
    assert hub.events[-1][1]["logs"] == [{"stream": "f", "offset": 8, "text": "epoch 2 partial done\nepoch 3\n"}]
    # stage + run finish: results, artifacts (checkpoint listed, never uploaded; small files uploaded once)
    (fdir / "checkpoint.pth").write_bytes(b"\0" * 10)
    (fdir / "result.json").write_text(json.dumps({"outputs": {"checkpoint": "checkpoint.pth"}, "metrics": {}}))
    (fdir / "rfdetr").mkdir()
    (fdir / "rfdetr" / "metrics_plot.png").write_bytes(b"png")
    (fdir / "lightly").mkdir()
    (fdir / "lightly" / "skip.png").write_bytes(b"no")
    store.update_stage(rid, "f", status="done", finished=2.0)
    store.save_result(rid, "e", {"label": "f", "map": 0.5, "dataset": "tiny", "split": "test"})
    with open(fdir / "log.txt", "a") as f:
        f.write("tail without newline")
    store.update_run(rid, status="done", finished=3.0)
    s.push()
    body = hub.events[-1][1]
    arts = {a["path"]: a["kind"] for st in body["stages"] for a in st.get("artifacts", [])}
    assert arts == {"stages/f/checkpoint.pth": "checkpoint", "stages/f/result.json": "file", "stages/f/rfdetr/metrics_plot.png": "file"}
    assert body["results"] == [{"stage": "e", "row": {"label": "f", "map": 0.5, "dataset": "tiny", "split": "test"}}]
    assert body["logs"][-1]["text"].endswith("tail without newline")  # run over: the partial line goes too
    assert set(hub.files) == {f"/agent/v1/runs/{rid}/files/stages/f/result.json", f"/agent/v1/runs/{rid}/files/stages/f/rfdetr/metrics_plot.png"}
    assert not s.complete
    s.push()  # a quiet push after the final state: done
    assert s.complete
    again = RunSync(FakeHub(), rid)  # after an agent restart: state and offsets come from disk
    assert again.complete and again.state["offsets"]["f"] == (fdir / "log.txt").stat().st_size


def test_release_check_and_safe_extract(tmp_path):
    from modellab import release

    priv, pub = release.keygen()
    manifest, tarball = release.build(version="1.2.3-test")
    text = release.canonical(manifest).decode()
    sig = release.sign(text.encode(), priv)
    assert release.check(text, sig, tarball, pub)["version"] == "1.2.3-test"
    with pytest.raises(release.ReleaseError, match="signature"):
        release.check(text, sig, tarball, release.keygen()[1])
    with pytest.raises(release.ReleaseError, match="does not match"):
        release.check(text, sig, tarball + b"x", pub)
    with pytest.raises(release.ReleaseError, match="canonical"):
        release.check(json.dumps(manifest, indent=1), sig, tarball, pub)
    names = tarfile.open(fileobj=io.BytesIO(tarball)).getnames()
    assert "modellab/agent/service.py" in names and "offline_guard.py" in names and "RELEASE.json" in names
    assert not any(n.startswith("modellab/web") for n in names)
    assert release.build(version="1.2.3-test")[1] == tarball  # deterministic
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w:gz") as t:
        ti = tarfile.TarInfo("../evil.sh")
        ti.size = 2
        t.addfile(ti, io.BytesIO(b"hi"))
    with pytest.raises(release.ReleaseError, match="unsafe"):
        release.extract(buf.getvalue(), tmp_path / "x")


def test_unpack_link_switch_prune(home):
    from modellab import release
    from modellab.agent import update

    priv, pub = release.keygen()
    envs = []
    for v in ("1.0.0-a", "1.0.0-b", "1.0.0-c"):
        manifest, tarball = release.build(version=v)
        text = release.canonical(manifest).decode()
        rel, m = update.unpack(v, text, release.sign(text.encode(), priv), tarball, pub)
        env = home / "envs" / f"lock-{v}"
        (env / "vendor").mkdir(parents=True)
        update.link_release(rel, env)
        update.switch(rel)
        envs.append(env)
        time.sleep(0.01)
    cur = home / "current"
    assert cur.resolve() == home / "releases" / "1.0.0-c" and (cur / "ENV").read_text().strip() == str(envs[-1])
    for link in ("weights", "cache", "data", "runs"):
        assert (cur / link).is_symlink() and (cur / link).resolve().parent == home / "data"
    assert (cur / ".verified").is_file()
    with pytest.raises(update.UpdateError, match="signature"):
        update.unpack("1.0.0-d", text, release.sign(text.encode(), release.keygen()[0]), tarball, pub)
    with pytest.raises(update.UpdateError, match="version"):
        update.unpack("../../x", text, release.sign(text.encode(), priv), tarball, pub)
    update.prune(log=lambda *_: None)
    assert sorted(p.name for p in (home / "releases").iterdir()) == ["1.0.0-b", "1.0.0-c"]
    assert not envs[0].exists() and envs[1].exists()


def test_training_processes_keep_the_network_guard(home, monkeypatch):
    import subprocess

    from modellab import store, worker

    captured = {}

    class P:
        pid = 4242

        def __init__(self, cmd, env=None, **kw):
            captured["env"] = env

    monkeypatch.setattr(subprocess, "Popen", P)
    rid, _ = _run(home)
    run = store.get_run(rid)
    monkeypatch.setenv("ALLOW_NETWORK", "1")
    monkeypatch.setenv("MODELLAB_GUARD_CHILDREN", "1")
    worker.Worker()._spawn(run)
    assert "ALLOW_NETWORK" not in captured["env"]
    monkeypatch.delenv("MODELLAB_GUARD_CHILDREN")
    worker.Worker()._spawn(run)
    assert captured["env"]["ALLOW_NETWORK"] == "1"  # local app: someone set it on purpose


def test_commands_recheck_their_arguments(home):
    from modellab import store
    from modellab.agent.jobs import Jobs

    j = Jobs.__new__(Jobs)  # no hub needed for argument checks
    say = lambda *_: None  # noqa: E731
    for t, a, msg in [("dataset_add", {"name": "ok", "path": "rel/dir"}, "absolute"), ("dataset_add", {"name": "Bad!", "path": "/d"}, "name"),
                      ("run_delete_files", {"run_id": "../../home"}, "bad run id"), ("nope", {}, "unknown")]:
        with pytest.raises(ValueError, match=msg):
            j._execute(t, a, say)
    rid, rd = _run(home)
    with pytest.raises(ValueError, match="still active"):
        j._execute("run_delete_files", {"run_id": rid}, say)
    store.update_run(rid, status="done")
    assert j._execute("run_delete_files", {"run_id": rid}, say) == {"deleted": rid} and not rd.exists()


def test_doctor_verdicts():
    from modellab.agent import doctor

    f = {"os": "Ubuntu", "arch": "x86_64", "glibc": "glibc 2.35", "driver": "550.54.14", "cuda_driver": "12.4",
         "gpus": [{"index": 0, "name": "RTX A4000", "memory_gb": 16}], "disk": {"path": "/x", "free_gb": 5, "total_gb": 100},
         "ram_gb": 64, "shm_gb": 0.06, "nofile": {"soft": 1024, "hard": 4096}, "service": {"active": "active", "linger": False}}
    p = {"torch": "2.8.0+cu128", "torch_cuda": "12.8", "cuda_available": True, "albumentations_rfdetr": "1.4.24",
         "devices": [{"index": 0, "name": "RTX A4000", "capability": "8.6", "matmul_ok": False, "error": "no kernel image is available"}],
         "lock_mismatch": [{"package": "torch", "want": "2.8.0+cu128", "got": "2.7.0"}]}
    st = {c["id"]: c["status"] for c in doctor.checks(f, p)}
    assert st["driver"] == "fail" and st["cuda"] == "fail" and st["disk"] == "fail" and st["shm"] == "warn"
    assert st["nofile"] == "warn" and st["packages"] == "warn" and st["linger"] == "warn" and st["transforms"] == "ok"
    f.update(driver="575.64.03", disk={"path": "/x", "free_gb": 500, "total_gb": 1000}, shm_gb=31.0, nofile={"soft": 1024, "hard": 1048576},
             service={"active": "active", "linger": True})
    p["devices"][0].update(matmul_ok=True)
    p["lock_mismatch"] = []
    assert all(c["status"] == "ok" for c in doctor.checks(f, p))
    f.update(driver=None, gpus=[])
    st = {c["id"]: c["status"] for c in doctor.checks(f, None, skip_gpu=True)}
    assert st["driver"] == "warn" and "gpu" not in st
    assert {c["id"]: c["status"] for c in doctor.checks(f, None)}["driver"] == "fail"


def test_agent_config_is_private(home):
    from modellab.agent import load_config, save_config

    save_config({"hub_url": "https://hub", "token": "mlm_secret"})
    assert oct(os.stat(home / "agent.json").st_mode & 0o777) == "0o600" and load_config()["token"] == "mlm_secret"


def test_folder_listing_sends_only_names_and_marks_datasets(home, tmp_path):
    from modellab.agent.browse import answer, listing

    d = tmp_path / "data"
    for s in ("train", "valid", "test"):
        (d / "traffic" / s).mkdir(parents=True)
        (d / "traffic" / s / "_annotations.coco.json").write_text("{}")
    (d / "yolo" / "images").mkdir(parents=True)
    (d / "yolo" / "labels").mkdir()
    (d / ".cache").mkdir()
    (d / "Zeta").mkdir()
    for f in ("a.jpg", "b.PNG", "notes.txt", "annotations.json", ".secret.json"):
        (d / f).write_text("x")
    got = listing(str(d))
    assert got["path"] == str(d) and got["parent"] == str(tmp_path) and got["images"] == 2 and got["layout"] is None
    assert [(e["name"], e["type"], e.get("layout")) for e in got["entries"]] == [
        ("traffic", "dir", "roboflow"), ("yolo", "dir", "yolo"), ("Zeta", "dir", None)]  # no hidden, no files, by name
    got = listing(str(d / "traffic" / ".." / "."), want="json")
    assert got["path"] == str(d) and [e["name"] for e in got["entries"] if e["type"] == "file"] == ["annotations.json"]
    assert listing(str(d / "annotations.json"), want="json")["path"] == str(d)  # a file -> its folder
    assert listing(str(d / "traffic"))["layout"] == "roboflow"
    assert listing("/")["parent"] is None and listing(None)["path"] == str(Path.home())
    assert {p["label"] for p in got["places"]} >= {"Home", "/"}
    assert "not a folder" in answer({"id": "1", "path": str(d / "missing"), "want": "dir"})["error"]
    assert answer({"id": "2", "path": str(d), "want": "exe"})["error"] == "bad folder request"
    assert answer({"id": "3", "path": str(d), "want": "dir"})["result"]["images"] == 2
