"""Hub: accounts, sessions, pairing, isolation between users and machines, commands, runs, logs, files, releases,
security headers and the installer. Runs without torch (the hub never imports it)."""

import base64
import json
import time

import pytest
import sqlalchemy as sa

from conftest import ADMIN, H, RECIPE, client, login, pair, report


# ---------------------------------------------------------------- accounts

def test_login_logout_and_csrf_header(hub):
    c = client(hub)
    assert c.get("/api/auth/me").json() == {"mode": "hub", "user": None, "public_url": "http://testserver"}
    assert c.get("/api/machines").status_code == 401
    assert c.post("/api/auth/login", json={"username": ADMIN[0], "password": ADMIN[1]}).status_code == 403  # no X-ModelLab
    assert c.post("/api/auth/login", json={"username": ADMIN[0], "password": "wrong"}, headers=H).status_code == 401
    assert c.post("/api/auth/login", json={"username": "nobody", "password": "whatever1"}, headers=H).status_code == 401
    r = c.post("/api/auth/login", json={"username": "ADMIN ", "password": ADMIN[1]}, headers=H)
    assert r.status_code == 200 and r.json()["user"]["is_admin"]
    cookie = r.headers["set-cookie"].lower()
    assert "httponly" in cookie and "samesite=lax" in cookie
    assert c.get("/api/auth/me").json()["user"]["username"] == "admin"
    assert c.post("/api/auth/logout", headers=H).status_code == 200
    assert c.get("/api/auth/me").json()["user"] is None


def test_login_throttle(hub):
    c = client(hub)
    for _ in range(5):
        assert c.post("/api/auth/login", json={"username": "admin", "password": "nope-nope"}, headers=H).status_code == 401
    r = c.post("/api/auth/login", json={"username": "admin", "password": ADMIN[1]}, headers=H)
    assert r.status_code == 429  # even the right password waits now


def test_users_admin_only_temp_password_and_disable(hub):
    admin = login(hub)
    r = admin.post("/api/users", json={"username": "Aysel", "display_name": "Aysel"})
    assert r.status_code == 200
    pw = r.json()["password"]
    assert r.json()["user"]["username"] == "aysel" and r.json()["user"]["must_change_password"]
    assert admin.post("/api/users", json={"username": "aysel"}).status_code == 409
    u = login(hub, "aysel", pw)
    assert u.get("/api/users").status_code == 403
    assert u.get("/api/auth/me").json()["user"]["must_change_password"]
    assert u.post("/api/auth/password", json={"current": pw, "new": "short"}).status_code == 422
    assert u.post("/api/auth/password", json={"current": pw, "new": "a-better-password"}).status_code == 200
    assert not u.get("/api/auth/me").json()["user"]["must_change_password"]
    uid = u.get("/api/auth/me").json()["user"]["id"]
    me_id = admin.get("/api/auth/me").json()["user"]["id"]
    assert admin.patch(f"/api/users/{me_id}", json={"disabled": True}).status_code == 409  # never lock yourself out
    assert admin.patch(f"/api/users/{uid}", json={"disabled": True}).status_code == 200
    assert u.get("/api/auth/me").json()["user"] is None  # sessions revoked
    assert client(hub).post("/api/auth/login", json={"username": "aysel", "password": "a-better-password"}, headers=H).status_code == 401
    new_pw = admin.post(f"/api/users/{uid}/reset-password").json()["password"]
    admin.patch(f"/api/users/{uid}", json={"disabled": False})
    assert login(hub, "aysel", new_pw).get("/api/auth/me").json()["user"]["must_change_password"]


# ---------------------------------------------------------------- machines

def test_pairing_codes_and_tokens(hub):
    admin = login(hub)
    p = admin.post("/api/machines/pair", json={"name": "5090 office"}).json()
    assert p["command"] == f"curl -fsSL http://testserver/install.sh | bash -s -- --pair {p['code']}"
    a = client(hub)
    r = a.post("/agent/v1/pair", json={"code": p["code"].lower().replace("-", " "), "hostname": "pc"})  # forgiving format
    assert r.status_code == 200 and r.json()["token"].startswith("mlm_")
    assert a.post("/agent/v1/pair", json={"code": p["code"]}).status_code == 403  # one-time
    assert admin.get(f"/api/machines/pairing/{p['pairing_id']}").json()["used"]
    p2 = admin.post("/api/machines/pair", json={"name": "late"}).json()
    from modellab.hub import db
    with hub.state.engine.begin() as c:
        c.execute(db.pairing_codes.update().where(db.pairing_codes.c.id == p2["pairing_id"]).values(expires=time.time() - 1))
    assert a.post("/agent/v1/pair", json={"code": p2["code"]}).status_code == 403  # expired
    assert admin.get(f"/api/machines/pairing/{p2['pairing_id']}").json()["expired"]
    assert a.post("/agent/v1/heartbeat", json={}, headers={"Authorization": "Bearer mlm_nope"}).json()["detail"] == "unknown machine token"
    assert admin.post("/api/machines/pair", json={"name": ""}).status_code == 422


def test_isolation_between_users_and_machines(hub):
    admin = login(hub)
    admin.post("/api/users", json={"username": "other"})
    agent, mid = pair(hub, admin)
    report(agent)
    rid = admin.post("/api/runs", json={"yaml": RECIPE, "machine_id": mid}).json()["run_ids"][0]
    agent.post("/agent/v1/claim")
    agent.put(f"/agent/v1/runs/{rid}/files/stages/e/pca.png", content=b"png", headers={"Content-Type": "image/png"})
    with hub.state.engine.begin() as c:
        from modellab.hub import db
        uid = c.execute(sa.select(db.users.c.id).where(db.users.c.username == "other")).scalar()
    pw = admin.post(f"/api/users/{uid}/reset-password").json()["password"]
    other = login(hub, "other", pw)
    assert other.get("/api/machines").json() == []
    assert other.get(f"/api/machines/{mid}").status_code == 404
    assert other.post(f"/api/machines/{mid}/commands", json={"type": "selfcheck"}).status_code == 404
    assert other.get("/api/runs").json() == []
    assert other.get(f"/api/runs/{rid}").status_code == 404
    assert other.get(f"/api/runs/{rid}/file/stages/e/pca.png").status_code == 404
    assert other.post(f"/api/runs/{rid}/cancel").status_code == 404
    assert other.post("/api/runs", json={"yaml": RECIPE, "machine_id": mid}).status_code == 404
    assert other.get("/api/results").json()["rows"] == []
    agent2, _ = pair(hub, other, "theirs")
    assert agent2.post(f"/agent/v1/runs/{rid}/events", json={"run": {"status": "failed"}}).status_code == 404
    assert agent2.put(f"/agent/v1/runs/{rid}/files/stages/e/x.png", content=b"x").status_code == 404
    assert agent2.post("/agent/v1/claim").json() == {"run": None}


def test_commands_are_validated_and_delivered_once(hub):
    admin = login(hub)
    agent, mid = pair(hub, admin)
    bad = [("dataset_add", {"name": "x", "path": "relative/dir"}), ("dataset_add", {"name": "Bad Name", "path": "/d"}),
           ("shell", {"cmd": "rm -rf /"}), ("weights_fetch", {"ids": ["nope/model"]}), ("run_delete_files", {"run_id": "../../etc"}),
           ("dataset_import", {"name": "x", "format": "zip", "coco_json": "/a.json"})]
    for t, a in bad:
        assert admin.post(f"/api/machines/{mid}/commands", json={"type": t, "args": a}).status_code == 422, t
    cmd = admin.post(f"/api/machines/{mid}/commands", json={"type": "dataset_add", "args": {"name": "traffic", "path": "/data/traffic"}}).json()
    hb = agent.post("/agent/v1/heartbeat", json={"state": "idle"}).json()
    assert [c["id"] for c in hb["commands"]] == [cmd["id"]] and hb["commands"][0]["args"]["path"] == "/data/traffic"
    assert agent.post("/agent/v1/heartbeat", json={"state": "idle"}).json()["commands"] == []
    assert agent.post(f"/agent/v1/commands/{cmd['id']}", json={"status": "done", "result": {"ok": 1}}).status_code == 200
    got = admin.get(f"/api/machines/{mid}/commands").json()[0]
    assert got["status"] == "done" and got["result"] == {"ok": 1}


def test_remove_machine_revokes_token_and_cancels_queue(hub):
    admin = login(hub)
    agent, mid = pair(hub, admin)
    report(agent)
    rid = admin.post("/api/runs", json={"yaml": RECIPE, "machine_id": mid}).json()["run_ids"][0]
    assert admin.delete(f"/api/machines/{mid}").status_code == 200
    r = agent.post("/agent/v1/heartbeat", json={})
    assert r.status_code == 401 and r.json()["detail"] == "revoked"
    assert admin.get(f"/api/runs/{rid}").json()["status"] == "cancelled"
    assert admin.get("/api/machines").json() == []
    assert admin.post(f"/api/runs/{rid}/requeue").status_code == 409


# ---------------------------------------------------------------- runs

def test_preview_uses_the_machines_datasets_and_weights(hub):
    admin = login(hub)
    agent, mid = pair(hub, admin)
    agent.post("/agent/v1/report", json={"datasets": [{"name": "tiny", "path": "/d", "built": True},
                                                       {"name": "broken", "path": "/x", "error": "train/_annotations.coco.json missing"}],
                                         "weights": {}})
    p = admin.post("/api/recipes/preview", json={"yaml": RECIPE, "machine_id": mid}).json()
    assert p["ok"] and p["runs"][0]["missing_weights"] == ["rfdetr/nano"]
    p = admin.post("/api/recipes/preview", json={"yaml": RECIPE.replace("tiny", "nope"), "machine_id": mid}).json()
    assert not p["ok"] and any("unknown dataset" in e for e in p["errors"])
    p = admin.post("/api/recipes/preview", json={"yaml": RECIPE.replace("tiny", "broken"), "machine_id": mid}).json()
    assert not p["ok"] and any("missing" in e for e in p["errors"])
    assert not admin.post("/api/recipes/preview", json={"yaml": RECIPE}).json()["ok"]  # no machine picked
    assert admin.post("/api/runs", json={"yaml": RECIPE.replace("tiny", "nope"), "machine_id": mid}).status_code == 422


def test_run_lifecycle_events_logs_files_results(hub, monkeypatch):
    from modellab.hub import model

    admin = login(hub)
    agent, mid = pair(hub, admin)
    report(agent)
    matrix = RECIPE.replace("dataset: tiny\n", "dataset: tiny\nmatrix: {bs: [2, 4]}\n").replace("budget: {epochs: 1}}", "batch_size: '${bs}', budget: {epochs: 1}}")
    ids = admin.post("/api/runs", json={"yaml": matrix, "machine_id": mid}).json()["run_ids"]
    first = admin.post("/api/runs", json={"yaml": RECIPE, "machine_id": mid, "position": "front"}).json()["run_ids"][0]
    assert len(ids) == 2
    claimed = agent.post("/agent/v1/claim").json()["run"]
    assert claimed["id"] == first and claimed["stages"] == {"f": "pending", "e": "pending"} and "finetune" in claimed["recipe_yaml"]
    assert agent.post("/agent/v1/heartbeat", json={"state": "running", "current_run": first}).json()["running"] == [first]
    chunk = {"stream": "f", "offset": 0, "text": "epoch 1 \x1b[32mloss\x1b[0m 3.2\r\nepoch 2 loss 3.1\n"}
    ev = {"run": {"status": "running", "current_stage": "f", "env": {"gpu": {"devices": [{"name": "RTX 5090"}]}}},
          "stages": [{"name": "f", "status": "running", "progress": {"fraction": 0.5, "message": "epoch 2/4"}}],
          "logs": [chunk, chunk]}
    assert agent.post(f"/agent/v1/runs/{first}/events", json=ev).json() == {"status": "running", "cancel_requested": False}
    s = admin.get(f"/api/runs/{first}").json()
    assert s["progress"] == 0.25 and s["stage_progress"]["message"] == "epoch 2/4" and s["machine_name"] == "box"
    with admin.stream("GET", f"/api/runs/{first}/logs?stage=f&follow=false") as r:
        lines = [x for x in r.iter_lines() if x.startswith("data: \"")]
    assert lines == ['data: "epoch 1 loss 3.2"', 'data: "epoch 2 loss 3.1"']  # duplicate chunk ignored, ANSI + \r handled
    assert agent.put(f"/agent/v1/runs/{first}/files/etc/passwd", content=b"x").status_code == 422
    monkeypatch.setattr(model, "FILE_CAP", 100)
    assert agent.put(f"/agent/v1/runs/{first}/files/stages/e/big.png", content=b"x" * 101).status_code == 413
    assert agent.put(f"/agent/v1/runs/{first}/files/stages/e/pca.png", content=b"PNG", headers={"Content-Type": "image/png"}).status_code == 200
    row = {"label": "f", "model": "rfdetr/nano", "family": "rfdetr", "dataset": "tiny", "split": "test", "dataset_hash": "h1",
           "eval_version": "1+x", "map": 0.61, "map50": 0.8, "latency_ms": 2.5, "latency_device": "cuda fp16", "per_class": {"car": 0.6}}
    agent.post(f"/agent/v1/runs/{first}/events", json={
        "run": {"status": "done", "finished": time.time(), "current_stage": None},
        "stages": [{"name": "f", "status": "done", "artifacts": [{"path": "stages/f/checkpoint.pth", "size": 9, "kind": "checkpoint", "local_path": "/pc/x.pth"}]},
                   {"name": "e", "status": "done", "artifacts": [{"path": "stages/e/pca.png", "size": 3, "kind": "file"}]}],
        "results": [{"stage": "e", "row": row}]})
    d = admin.get(f"/api/runs/{first}").json()
    arts = {a["path"]: a for s in d["stages"] for a in s["artifacts"]}
    assert d["status"] == "done" and d["best"]["map"] == 0.61
    assert not arts["stages/f/checkpoint.pth"]["stored"] and arts["stages/f/checkpoint.pth"]["local_path"] == "/pc/x.pth"
    assert arts["stages/e/pca.png"]["stored"] and admin.get(f"/api/runs/{first}/file/stages/e/pca.png").content == b"PNG"
    res = admin.get("/api/results").json()["rows"]
    assert res[0]["map"] == 0.61 and res[0]["per_class"] == {"car": 0.6} and res[0]["machine_name"] == "box"
    cmp = admin.get(f"/api/compare?items={first}:e").json()
    assert cmp["pca"][first] == ["stages/e/pca.png"] and cmp["rows"][0]["eval_key"] == "1+x|tiny|test|h1"
    # cancel: queued -> cancelled right away; running -> the agent is told
    assert admin.post(f"/api/runs/{ids[1]}/cancel").json()["result"] == "cancelled"
    second = agent.post("/agent/v1/claim").json()["run"]["id"]
    assert second == ids[0]
    assert admin.post(f"/api/runs/{second}/cancel").json()["result"] == "cancel requested"
    assert agent.post("/agent/v1/heartbeat", json={}).json()["cancel"] == [second]
    agent.post(f"/agent/v1/runs/{second}/events", json={"run": {"status": "cancelled", "finished": time.time()}})
    assert agent.post("/agent/v1/heartbeat", json={}).json()["cancel"] == []
    assert admin.post(f"/api/runs/{second}/requeue").json()["result"] == "queued"
    assert agent.post("/agent/v1/claim").json()["run"]["id"] == second
    assert admin.delete(f"/api/runs/{second}").status_code == 409  # running
    r = admin.delete(f"/api/runs/{first}?delete_files=true").json()
    assert r["command_id"] and admin.get(f"/api/runs/{first}").status_code == 404
    assert agent.post("/agent/v1/heartbeat", json={}).json()["commands"][0]["args"] == {"run_id": first}


def test_log_cap_keeps_the_newest(hub, monkeypatch):
    from modellab.hub import model

    monkeypatch.setattr(model, "LOG_CAP", 1000)
    admin = login(hub)
    agent, mid = pair(hub, admin)
    report(agent)
    rid = admin.post("/api/runs", json={"yaml": RECIPE, "machine_id": mid}).json()["run_ids"][0]
    agent.post("/agent/v1/claim")
    for i in range(30):
        agent.post(f"/agent/v1/runs/{rid}/events", json={"logs": [{"stream": "f", "offset": i * 100, "text": f"line {i:03d} " + "x" * 90 + "\n"}]})
    with admin.stream("GET", f"/api/runs/{rid}/logs?stage=f&follow=false&lines=1000") as r:
        lines = [x for x in r.iter_lines() if x.startswith("data: \"")]
    assert lines[-1].startswith('data: "line 029') and len(lines) <= 10


# ---------------------------------------------------------------- releases

def _signed(hub, version="9.9.9-test", key=None):
    from modellab import release

    manifest, tarball = release.build(version=version)
    text = release.canonical(manifest).decode()
    return {"manifest": text, "signature": release.sign(text.encode(), key or hub.state.signing_key),
            "tarball_b64": base64.b64encode(tarball).decode()}


def test_release_upload_verify_and_update_offer(hub):
    from modellab import release

    up = client(hub)
    body = _signed(hub)
    assert up.post("/api/releases/upload", json=body, headers={**H, "Authorization": "Bearer wrong"}).status_code == 401
    other_key = release.keygen()[0]
    r = up.post("/api/releases/upload", json=_signed(hub, key=other_key), headers={**H, "Authorization": "Bearer up-token"})
    assert r.status_code == 422 and "signature" in r.json()["detail"]
    tampered = dict(body, tarball_b64=base64.b64encode(base64.b64decode(body["tarball_b64"]) + b"x").decode())
    assert up.post("/api/releases/upload", json=tampered, headers={**H, "Authorization": "Bearer up-token"}).status_code == 422
    assert up.post("/api/releases/upload", json=body, headers={**H, "Authorization": "Bearer up-token"}).json()["version"] == "9.9.9-test"
    admin = login(hub)
    agent, _ = pair(hub, admin)
    assert agent.post("/agent/v1/heartbeat", json={"release": "0.0.1"}).json()["update"] == {"version": "9.9.9-test"}
    assert agent.post("/agent/v1/heartbeat", json={}).json()["update"] is None  # dev agents (no release) never update
    meta = agent.get("/agent/v1/releases/current").json()
    tar = agent.get("/agent/v1/releases/9.9.9-test/tarball").content
    assert release.check(meta["manifest"], meta["signature"], tar, hub.state.cfg.release_pubkey)["version"] == "9.9.9-test"
    assert client(hub).get("/agent/v1/releases/current").status_code == 401  # code only for paired machines
    assert admin.get("/api/releases").json()["current"] == "9.9.9-test"
    assert admin.post("/api/releases/current", json={"version": "nope"}).status_code == 404


# ---------------------------------------------------------------- headers / installer

def test_security_headers_and_installer(hub):
    c = client(hub)
    r = c.get("/")
    assert r.headers["x-frame-options"] == "DENY" and r.headers["x-content-type-options"] == "nosniff"
    csp = r.headers["content-security-policy"]
    assert "script-src 'self' 'sha256-" in csp and "frame-ancestors 'none'" in csp
    sh = c.get("/install.sh").text
    assert 'HUB_URL="http://testserver"' in sh and f'RELEASE_PUBKEY="{hub.state.cfg.release_pubkey}"' in sh
    assert "up-token" not in sh and "__HUB_URL__" not in sh
    assert c.get("/api/nope").status_code in (401, 404) and c.get("/healthz").json() == {"ok": True}
    big = c.post("/agent/v1/heartbeat", content=b"x", headers={"content-length": str(20 * 2**20)})
    assert big.status_code == 413


def test_eval_version_matches_the_engine():
    pytest.importorskip("numpy")
    from modellab import evaluate
    from modellab.hub import model

    assert model.eval_version() == evaluate.eval_version()


def test_hub_code_does_not_need_torch_or_numpy():
    from modellab.hub import agent_api, api, app, auth, db, model

    src = "".join(open(m.__file__).read() for m in (agent_api, api, app, auth, db, model))
    assert "import torch" not in src and "import numpy" not in src
    assert json.loads(json.dumps(model.catalog_for(None)))["eval_version"]
