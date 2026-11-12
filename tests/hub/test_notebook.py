"""The notebook: entries, their links to runs and searches, the entries searches write for themselves, and the
training-time estimate from past runs."""

import time

import sqlalchemy as sa
from conftest import H, RECIPE, client, hub, login, pair, report  # noqa: F401
from test_yeti import finished_run, finished_search


def test_entries_are_private_editable_and_searchable(hub):  # noqa: F811
    u = login(hub)
    e = u.post("/api/notebook", json={"title": "Distill into Nano", "question": "Does a DINOv3 teacher help the Nano?"}).json()
    assert e["status"] == "open" and e["author"] == "user" and e["linked_runs"] == [] and not e["all_finished"]
    eid = e["id"]
    u.post("/api/notebook", json={"title": "Input size", "question": "Is 512 px worth it over 384 on forklifts?"})
    assert [x["title"] for x in u.get("/api/notebook", params={"q": "dinov3 nano"}).json()] == ["Distill into Nano"]
    assert len(u.get("/api/notebook").json()) == 2
    p = u.patch(f"/api/notebook/{eid}", json={"plan": "Two runs, same seed.", "answer": "No: 0.3 points, within noise.",
                                             "status": "answered"}).json()
    assert p["status"] == "answered" and p["plan"] == "Two runs, same seed." and p["updated_by"] == "user"
    assert [x["id"] for x in u.get("/api/notebook", params={"status": "answered"}).json()] == [eid]
    assert u.patch(f"/api/notebook/{eid}", json={"status": "dropped"}).status_code == 422  # a dropped idea says why
    d = u.patch(f"/api/notebook/{eid}", json={"status": "dropped", "status_reason": "the teacher doesn't fit in 16 GB"}).json()
    assert d["status"] == "dropped" and d["status_reason"].startswith("the teacher")
    assert u.patch(f"/api/notebook/{eid}", json={"status": "open"}).json()["status_reason"] is None
    assert u.patch(f"/api/notebook/{eid}", json={"title": "  "}).status_code == 422
    assert u.post("/api/notebook", json={"title": "x", "question": " "}).status_code == 422
    # another user sees nothing of it
    u.post("/api/users", json={"username": "bob", "display_name": "Bob", "is_admin": False})
    from modellab.hub import db

    with hub.state.engine.begin() as c:
        from modellab.hub import notebook

        bob = dict(c.execute(sa.select(db.users).where(db.users.c.username == "bob")).mappings().first())
        assert notebook.list_entries(c, bob) == []
        try:
            notebook.detail(c, bob, eid)
            raise AssertionError("Bob read someone else's entry")
        except Exception as ex:  # noqa: BLE001
            assert getattr(ex, "status_code", None) == 404
    assert u.delete(f"/api/notebook/{eid}").json() == {"result": "deleted"}
    assert u.get(f"/api/notebook/{eid}").status_code == 404
    assert client(hub).get("/api/notebook").status_code == 401


def test_runs_queued_for_an_entry_join_it(hub):  # noqa: F811
    u = login(hub)
    agent, mid = pair(hub, u, "tower")
    report(agent)
    eid = u.post("/api/notebook", json={"title": "Quick test", "question": "Does the pipeline work on tiny?"}).json()["id"]
    tagged = RECIPE.replace("name: t", f"name: t\ntags: ['nb:{eid}']")
    rid = u.post("/api/runs", json={"yaml": tagged, "machine_id": mid}).json()["run_ids"][0]
    e = u.get(f"/api/notebook/{eid}").json()
    assert [r["id"] for r in e["linked_runs"]] == [rid] and e["runs"] == 1 and not e["all_finished"]
    assert [x["id"] for x in u.get("/api/notebook", params={"run": rid}).json()] == [eid]
    # the run finishes: its best result shows on the entry, which is now ready for its answer
    assert agent.post("/agent/v1/claim").json()["run"]["id"] == rid
    row = {"label": "nano", "model": "rfdetr/nano", "family": "rfdetr", "dataset": "tiny", "split": "test", "map": 0.41,
           "latency_ms": 2.5, "eval_version": "1+x", "dataset_hash": "h"}
    agent.post(f"/agent/v1/runs/{rid}/events", json={"run": {"status": "done"}, "results": [{"stage": "e", "row": row}]})
    e = u.get(f"/api/notebook/{eid}").json()
    assert e["linked_runs"][0]["best"]["map"] == 0.41 and e["all_finished"]
    # someone else's entry id in a tag links nothing; unlinking and linking by hand work
    other = RECIPE.replace("name: t", "name: t2\ntags: ['nb:0123456789abcdef']")
    rid2 = u.post("/api/runs", json={"yaml": other, "machine_id": mid}).json()["run_ids"][0]
    assert len(u.get(f"/api/notebook/{eid}").json()["linked_runs"]) == 1
    assert len(u.post(f"/api/notebook/{eid}/links", json={"kind": "run", "id": rid2}).json()["linked_runs"]) == 2
    assert len(u.delete(f"/api/notebook/{eid}/links/run/{rid2}").json()["linked_runs"]) == 1
    assert u.post(f"/api/notebook/{eid}/links", json={"kind": "run", "id": "nope"}).status_code == 404


def test_every_search_has_an_entry_answered_from_its_recommendation(hub):  # noqa: F811
    u, sid = finished_search(hub)  # created without an entry: it gets one of its own
    entries = u.get("/api/notebook", params={"search": sid}).json()
    assert len(entries) == 1
    e = u.get(f"/api/notebook/{entries[0]['id']}").json()
    assert e["author"] == "loop" and e["title"] == "find nano" and "within 5 ms" in e["question"]
    assert e["status"] == "answered" and e["answer"].startswith("Recommended **") and f"/search/{sid}" in e["answer"]
    assert e["linked_searches"][0]["id"] == sid and e["linked_searches"][0]["status"] == "done"


def test_a_search_started_for_an_entry_links_to_it_and_leaves_its_answer_alone(hub):  # noqa: F811
    from test_search import report as search_report

    u = login(hub)
    a, ma = pair(hub, u, "fast")
    search_report(a)
    eid = u.post("/api/notebook", json={"title": "Nano or Small", "question": "Which is better under 5 ms?"}).json()["id"]
    body = {"name": "nano vs small", "dataset": "tiny", "machines": [ma], "target_machine": ma, "speed_ms": 5,
            "models": ["rfdetr/nano"], "epochs": 3, "rungs": 1, "seeds": 0, "notebook": eid}
    s = u.post("/api/searches", json=body).json()
    assert s["notebook"] == eid and u.get(f"/api/notebook/{eid}").json()["linked_searches"][0]["id"] == s["id"]
    assert len(u.get("/api/notebook").json()) == 1  # no second entry
    assert u.post("/api/searches", json=body | {"notebook": "0123456789abcdef"}).status_code == 404
    from modellab.hub import db, notebook

    with hub.state.engine.begin() as c:
        c.execute(db.searches.update().where(db.searches.c.id == s["id"]).values(
            status="done", recommendation=db.dumps({"model": "rfdetr/nano", "image_size": 384, "map_valid_mean": 0.4,
                                                    "runs": 1, "best_run_id": "r", "latency_ms": 2.0})))
        notebook.on_search_final(c, s["id"])
    e = u.get(f"/api/notebook/{eid}").json()
    assert e["answer"] is None and e["status"] == "open"  # the user's entry: their answer to write


def test_training_time_is_estimated_from_past_runs(hub):  # noqa: F811
    u = login(hub)
    agent, mid = pair(hub, u, "tower")
    rep = {"hardware": {}, "checks": [], "weights": {}, "datasets": [
        {"name": "tiny", "path": "/data/tiny", "built": True, "classes": ["car"], "train": {"images": 400, "boxes": 900}},
        {"name": "other", "path": "/data/other", "built": True, "classes": ["car"]}]}
    assert agent.post("/agent/v1/report", json=rep).status_code == 200
    from modellab.hub import db, notebook

    with hub.state.engine.begin() as c:
        me = dict(c.execute(sa.select(db.users).where(db.users.c.username == "admin")).mappings().first())
        none = notebook.estimate(c, me, mid, "tiny", "rfdetr/nano", 10)
        assert none["seconds"] is None and "no finished fine-tune" in none["note"]
    rid = u.post("/api/runs", json={"yaml": RECIPE, "machine_id": mid}).json()["run_ids"][0]  # 1 epoch of rfdetr/nano
    agent.post("/agent/v1/claim")
    now = time.time()
    agent.post(f"/agent/v1/runs/{rid}/events", json={"run": {"status": "done"}, "stages": [
        {"name": "f", "status": "done", "started": now - 200, "finished": now, "result": {"metrics": {"train_images": 100}}}]})
    with hub.state.engine.begin() as c:
        est = notebook.estimate(c, me, mid, "tiny", "rfdetr/nano", 10)  # 200 s for 1 epoch of 100 images: 2 s per image
        assert est["based_on_runs"] == 1 and est["same_machine"] and est["seconds"] == 2 * 10 * 400
        assert notebook.fmt_duration(est["seconds"]) == "about 2.2 h"
        unknown = notebook.estimate(c, me, mid, "other", "rfdetr/nano", 10)  # images unknown, no past run on it
        assert unknown["seconds"] is None and "isn't known" in unknown["note"]
        assert notebook.estimate(c, me, mid, "tiny", "rfdetr/small", 10)["seconds"] is None
