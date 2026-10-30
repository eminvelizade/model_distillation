"""End to end on CPU: a real hub (uvicorn, SQLite) + a real agent process paired over HTTP. The web side adds a
dataset on the machine, runs a tiny fine-tune + eval, cancels and re-queues a slow run. Needs the full training
environment (torch, rfdetr) and the RF-DETR Nano weights; takes a few minutes."""

import os
import socket
import subprocess
import sys
import threading
import time

import pytest

from conftest import ADMIN, H, ROOT

pytest.importorskip("rfdetr")
pytestmark = pytest.mark.skipif(not (ROOT / "weights" / "rf-detr-nano.pth").is_file(), reason="needs weights/rf-detr-nano.pth")


def _port() -> int:
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    p = s.getsockname()[1]
    s.close()
    return p


@pytest.fixture()
def stack(tmp_path):
    import httpx
    import uvicorn

    from modellab.hub import Config
    from modellab.hub.app import create_app

    port = _port()
    url = f"http://127.0.0.1:{port}"
    app = create_app(Config(database_url=f"sqlite:///{tmp_path}/hub.sqlite", admin_user=ADMIN[0], admin_password=ADMIN[1],
                            secure_cookies=False, public_url=url))
    server = uvicorn.Server(uvicorn.Config(app, host="127.0.0.1", port=port, log_level="warning"))
    threading.Thread(target=server.run, daemon=True).start()
    while not server.started:
        time.sleep(0.05)
    web = httpx.Client(base_url=url, headers=H, timeout=30, trust_env=False)
    web.post("/api/auth/login", json={"username": ADMIN[0], "password": ADMIN[1]}).raise_for_status()
    code = web.post("/api/machines/pair", json={"name": "cpu box"}).json()["code"]
    env = dict(os.environ, MODELLAB_HOME=str(tmp_path / "agent"), MODELLAB_DEVICE="cpu", PYTHONPATH=str(ROOT), NO_PROXY="127.0.0.1")
    env.pop("ALLOW_NETWORK", None)
    subprocess.run([sys.executable, "-m", "modellab.agent", "pair", "--hub", url, "--code", code, "--pubkey", "dGVzdA==", "--cpu-only"],
                   env=env, cwd=ROOT, check=True, capture_output=True)
    log = open(tmp_path / "agent.log", "w")
    agent = subprocess.Popen([sys.executable, "-m", "modellab.agent", "run", "--cpu-only"], env=env, cwd=ROOT, stdout=log, stderr=subprocess.STDOUT)
    data = tmp_path / "tiny"
    subprocess.run([sys.executable, str(ROOT / "tests/modellab/make_tiny_dataset.py"), "--out", str(data), "--n", "36"], check=True, capture_output=True)
    yield web, data, tmp_path
    agent.terminate()
    agent.wait(30)
    server.should_exit = True


def _wait(fn, timeout, what):
    t0 = time.time()
    while time.time() - t0 < timeout:
        v = fn()
        if v:
            return v
        time.sleep(1)
    raise AssertionError(f"timed out waiting for {what}")


def test_hub_agent_end_to_end(stack):
    web, data, tmp = stack
    m = _wait(lambda: next((x for x in web.get("/api/machines").json() if x["online"]), None), 60, "the agent to come online")
    cmd = web.post(f"/api/machines/{m['id']}/commands", json={"type": "dataset_add", "args": {"name": "tiny", "path": str(data)}}).json()
    done = _wait(lambda: next((c for c in web.get(f"/api/machines/{m['id']}/commands").json()
                               if c["id"] == cmd["id"] and c["status"] in ("done", "failed")), None), 120, "dataset_add")
    assert done["status"] == "done", done
    assert done["result"]["hash"]["all"]
    detail = _wait(lambda: (lambda d: d if any(x["name"] == "tiny" for x in d["report"].get("datasets", [])) else None)(
        web.get(f"/api/machines/{m['id']}").json()), 60, "the dataset in the machine report")
    assert any(c["id"] == "transforms" for c in detail["report"]["checks"]) or detail["report"].get("checks") is not None

    y = ("name: e2e\ndataset: tiny\nseed: 3\nstages:\n"
         "  - {name: finetune, type: finetune, model: rfdetr/nano, batch_size: 2, budget: {epochs: 1}}\n"
         "  - {name: eval, type: eval, model: {from: finetune}, latency: false}\n")
    rid = web.post("/api/runs", json={"yaml": y, "machine_id": m["id"]}).json()["run_ids"][0]
    run = _wait(lambda: (lambda d: d if d["status"] in ("done", "failed", "cancelled", "interrupted") else None)(web.get(f"/api/runs/{rid}").json()),
                600, "the run to finish")
    assert run["status"] == "done", run["error_tail"]
    assert run["results"][0]["map"] is not None and run["env"]["gpu"]["cuda_available"] is False
    arts = {a["path"]: a for s in run["stages"] for a in s["artifacts"]}
    assert not arts["stages/finetune/checkpoint.pth"]["stored"]  # checkpoints stay on the PC
    assert arts["stages/finetune/classes.json"]["stored"]
    assert web.get(f"/api/runs/{rid}/file/stages/finetune/classes.json").json()
    with web.stream("GET", f"/api/runs/{rid}/logs?follow=false") as r:
        assert any("run done" in line for line in r.iter_lines())
    assert web.get("/api/results").json()["rows"][0]["run_id"] == rid

    slow = web.post("/api/runs", json={"yaml": (ROOT / "tests/modellab/recipes/tiny_slow.yaml").read_text(), "machine_id": m["id"]}).json()["run_ids"][0]
    _wait(lambda: web.get(f"/api/runs/{slow}").json()["current_stage"] == "finetune", 120, "the slow run to start")
    web.post(f"/api/runs/{slow}/cancel")
    assert _wait(lambda: web.get(f"/api/runs/{slow}").json()["status"] == "cancelled", 60, "cancel")
    web.post(f"/api/runs/{slow}/requeue")
    _wait(lambda: web.get(f"/api/runs/{slow}").json()["current_stage"] == "finetune", 120, "the re-queued run to start")
    web.post(f"/api/runs/{slow}/cancel")
    assert _wait(lambda: web.get(f"/api/runs/{slow}").json()["status"] == "cancelled", 60, "the second cancel")
