"""Searches on the hub, with simulated agents: timing -> rounds (successive halving) -> seed repeats -> recommendation."""

import time

import yaml
from conftest import client, hub, login, pair  # noqa: F401

SPEED = {"rfdetr/nano@320": 2.0, "rfdetr/nano@384": 3.0, "rfdetr/small@512": 6.0, "ltdetr/dinov3-vitt16-coco@384": 4.0}


def report(agent, h="h1", check=None):
    d = {"name": "tiny", "path": "/data/tiny", "built": True, "classes": ["car"], "hash": {"all": h}}
    if check is not None:
        d["check"] = check
    r = agent.post("/agent/v1/report", json={"hardware": {}, "checks": [], "datasets": [d], "weights": {}})
    assert r.status_code == 200, r.text


def score(cfg_key: str, seed: int) -> float:
    """Fake validation mAP: distilled > plain, bigger input > smaller, LT-DETR in between; seeds wiggle a little."""
    base = {"rfdetr/nano@320": 0.30, "rfdetr/nano@384": 0.34, "ltdetr/dinov3-vitt16-coco@384": 0.32}[cfg_key.split(" ")[0]]
    return base + (0.05 if "distilled" in cfg_key else 0) + (seed % 3) * 0.002


def play(agent, seen: list):
    """Claim the next queued run on this agent's machine and finish it with plausible results."""
    run = agent.post("/agent/v1/claim").json()["run"]
    if run is None:
        return False
    rid, rec = run["id"], yaml.safe_load(run["recipe_yaml"])
    seen.append(rec)
    now = time.time()
    stages, results = [], []
    for st in rec["stages"]:
        res = {"outputs": {}, "metrics": {}}
        if st["type"] == "speed":
            key = f"{st['model']}@{st['image_size']}"
            res["metrics"] = {"latency_ms": SPEED[key], "latency_device": "RTX 5090 fp16", "params_m": 30.0}
        stages.append({"name": st["name"], "status": "done", "result": res})
    desc = rec["description"].split(": ", 1)[1]
    for st in rec["stages"]:
        if st["type"] == "eval":
            m = score(desc, rec["seed"]) - (0.01 if st["split"] == "test" else 0)
            results.append({"stage": st["name"], "row": {"label": st["label"], "model": "x", "split": st["split"], "map": m,
                                                         "dataset": "tiny", "dataset_hash": "d", "eval_version": "1"}})
    r = agent.post(f"/agent/v1/runs/{rid}/events", json={"run": {"status": "done", "started": now - 60, "finished": now},
                                                         "stages": stages, "results": results})
    assert r.status_code == 200, r.text
    return True


def test_search_runs_rounds_seeds_and_recommends(hub):  # noqa: F811
    u = login(hub)
    a, ma = pair(hub, u, "fast")
    b, mb = pair(hub, u, "second")
    report(a), report(b)
    body = {"name": "find nano", "dataset": "tiny", "machines": [ma, mb], "target_machine": ma, "speed_ms": 5,
            "models": ["rfdetr/nano", "rfdetr/small", "ltdetr/dinov3-vitt16-coco"], "image_sizes": {"rfdetr/nano": [320, 384]},
            "teachers": ["dinov2/vits14"], "epochs": 9, "rungs": 3, "eta": 3, "seeds": 1}
    p = u.post("/api/searches/preview", json=body)
    assert p.status_code == 200, p.text
    assert p.json()["archs"] == 4 and p.json()["configs"] == 7  # nano 2 sizes x (plain, distilled) + small x 2 + lt
    s = u.post("/api/searches", json=body)
    assert s.status_code == 200, s.text
    sid = s.json()["id"]
    assert s.json()["phase"] == "speed"
    assert b.post("/agent/v1/claim").json()["run"] is None  # timing runs on the target machine only
    seen = []
    assert play(a, seen)
    d = u.get(f"/api/searches/{sid}").json()
    assert d["phase"] == "rungs", d["message"]
    fits = {x["key"]: x["fits"] for x in d["state"]["archs"]}
    assert fits == {"rfdetr/nano@320": True, "rfdetr/nano@384": True, "rfdetr/small@512": False,
                    "ltdetr/dinov3-vitt16-coco@384": True}
    assert len(d["state"]["rounds"][0]["trials"]) == 5
    assert {t["machine_id"] for t in d["state"]["rounds"][0]["trials"]} == {ma, mb}  # spread over both machines

    for _ in range(40):  # both agents work through the queue; the hub starts each next round by itself
        if not (play(a, seen) | play(b, seen)):
            break
    d = u.get(f"/api/searches/{sid}").json()
    assert d["status"] == "done", d["message"]
    rounds = d["state"]["rounds"]
    assert [r["epochs"] for r in rounds] == [1, 3, 9] and [len(r["trials"]) for r in rounds] == [5, 2, 1]
    assert len(d["state"]["seed_trials"]) == 1
    rec = d["recommendation"]
    assert rec["config"] == "rfdetr/nano@384 distilled from dinov2/vits14" and rec["runs"] == 2
    assert rec["latency_ms"] == 3.0 and rec["map_test_mean"] is not None and rec["map_test_std"] is not None
    # the trial recipes: distillation first for the distilled configs, test evaluation only in the last round
    trial = [r for r in seen if "distilled" in r["description"] and "round 3/3" in r["name"]][0]
    assert [st["name"] for st in trial["stages"]] == ["distill", "ft", "ev_valid", "ev_test"]
    assert trial["stages"][1]["image_size"] == 384 and trial["stages"][1]["budget"] == {"epochs": 9}
    first = [r for r in seen if "round 1/3" in r["name"]]
    assert all(st["name"] != "ev_test" for r in first for st in r["stages"])
    lst = u.get("/api/searches").json()
    assert lst[0]["id"] == sid and lst[0]["trials"]["total"] == 9


def test_search_checks_dataset_and_cancels(hub):  # noqa: F811
    u = login(hub)
    a, ma = pair(hub, u, "one")
    b, mb = pair(hub, u, "two")
    report(a, "h1"), report(b, "h2")
    body = {"name": "x", "dataset": "tiny", "machines": [ma, mb], "speed_ms": 5, "models": ["rfdetr/nano"], "epochs": 3}
    r = u.post("/api/searches", json=body)
    assert r.status_code == 422 and "differs between" in r.json()["detail"]
    report(b, "h1", check={"errors": ["3 boxes lie outside their image"], "warnings": []})
    r = u.post("/api/searches", json=body)
    assert r.status_code == 422 and "boxes lie outside" in r.json()["detail"]
    r = u.post("/api/searches", json={**body, "machines": [ma], "image_sizes": {"rfdetr/nano": [300]}})
    assert r.status_code == 422 and "multiples of 32" in r.json()["detail"]
    s = u.post("/api/searches", json={**body, "machines": [ma]}).json()
    assert u.delete(f"/api/searches/{s['id']}").status_code == 409  # running: cancel first
    c = u.post(f"/api/searches/{s['id']}/cancel").json()
    assert c["status"] == "cancelled"
    runs = u.get("/api/runs").json()
    assert runs[0]["status"] == "cancelled" and "search" in runs[0]["tags"]
    assert u.delete(f"/api/searches/{s['id']}").status_code == 200
    # another user can't see or touch it
    u.post("/api/users", json={"username": "bob", "password": "bob-pass-12345"})
    bob = login(hub, "bob", "bob-pass-12345")
    assert bob.get("/api/searches").json() == []
    assert bob.post("/api/searches", json={**body, "machines": [ma]}).status_code == 404


def test_search_says_why_the_timing_run_failed(hub):  # noqa: F811
    """A timing run that fails before any model is timed: the search shows the run's own error, not a placeholder."""
    u = login(hub)
    a, ma = pair(hub, u, "solo")
    report(a)
    body = {"name": "fails", "dataset": "tiny", "machines": [ma], "speed_ms": 5, "models": ["rfdetr/nano"], "epochs": 3}
    sid = u.post("/api/searches", json=body).json()["id"]
    rid = a.post("/agent/v1/claim").json()["run"]["id"]
    tail = ("stage s01 failed (exit code 1)\n[modellab:s01] type=speed device=cuda seed=42\nTraceback (most recent call last):\n"
            '  File "/x/modellab/stages/__init__.py", line 99, in main\n    outputs, metrics = fn(ctx)\n'
            "torch.OutOfMemoryError: CUDA out of memory. Tried to allocate 2.00 GiB")
    r = a.post(f"/agent/v1/runs/{rid}/events", json={"run": {"status": "failed", "finished": time.time(), "error_tail": tail}})
    assert r.status_code == 200, r.text
    d = u.get(f"/api/searches/{sid}").json()
    assert d["status"] == "failed"
    assert "not timed" not in d["message"], d["message"]
    assert d["message"].startswith("no candidate could be timed: the timing run failed: stage s01 failed"), d["message"]
    assert "torch.OutOfMemoryError: CUDA out of memory" in d["message"], d["message"]

    # a run that couldn't even start (e.g. a weight download failed): its one-line reason
    sid = u.post("/api/searches", json={**body, "name": "no start"}).json()["id"]
    rid = a.post("/agent/v1/claim").json()["run"]["id"]
    a.post(f"/agent/v1/runs/{rid}/events", json={"run": {"status": "failed", "finished": time.time(),
                                                        "error_tail": "could not start on this machine: curl failed"}})
    d = u.get(f"/api/searches/{sid}").json()
    assert d["message"] == "no candidate could be timed: the timing run failed: could not start on this machine: curl failed"
