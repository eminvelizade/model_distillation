"""System 1 in the hub: the screen is built from the hub's own data, the decision is routed, logged and described,
and nothing is carried out by the hub itself. The decision model is replaced by scripted answers."""

import sqlalchemy as sa
from conftest import H, RECIPE, client, hub, login, pair, report  # noqa: F401
from test_yeti import finished_run

from modellab.hub.system1 import service
from modellab.hub.system1.providers import Result
from modellab.hub.system1.questions import NOT_SAID

KEY = "sk-or-v1-" + "k" * 40


class Fake:
    """Stands in for OpenRouter: records what the model was shown and answers from a script."""

    def __init__(self):
        self.seen, self.script, self.ok = [], {}, True

    def check(self):
        return None if self.ok else "OpenRouter rejected that key"

    def decide(self, model, state, questions):
        self.seen.append((model, state, questions))
        if self.script.get("error"):
            return Result(error=self.script["error"])
        ans = {}
        for name, q in questions.items():
            if q["type"] == "noul":
                v = self.script.get(name, name != "several")
                ans[name] = {"pick": v, "p": 0.95 if v else 0.05, "probs": None}
            else:
                v = self.script.get("action" if name == "action_rev" else name, NOT_SAID if NOT_SAID in q["criteria"] else None)
                ans[name] = {"pick": v, "p": self.script.get("p", 0.97), "probs": None}
        return Result(answers=ans, seconds=0.2)


def setup(app, monkeypatch):
    fake = Fake()
    monkeypatch.setattr(service, "make_provider", lambda key: fake)
    u = login(app)
    agent, mid = pair(app, u, "tower")
    report(agent)
    assert u.put("/api/assistant/system1", json={"api_key": KEY}).status_code == 200
    return u, agent, mid, fake


def test_key_is_checked_encrypted_and_needed(hub, monkeypatch):  # noqa: F811
    fake = Fake()
    monkeypatch.setattr(service, "make_provider", lambda key: fake)
    u = login(hub)
    assert u.post("/api/assistant/decide", json={"sentence": "open the leaderboard"}).json() == \
        {"fast": False, "reason": "no OpenRouter key"}
    fake.ok = False
    assert u.put("/api/assistant/system1", json={"api_key": KEY}).status_code == 422
    assert u.put("/api/assistant/system1", json={"api_key": "short"}).status_code == 422
    fake.ok = True
    s = u.put("/api/assistant/system1", json={"api_key": KEY}).json()["system1"]
    assert s == {"connected": True, "key_hint": "…kkkk", "key_error": None, "model": "liquid/d1-ultra"}
    from modellab.hub import db

    with hub.state.engine.begin() as c:
        stored = c.execute(sa.select(db.system1.c.api_key)).scalar()
    assert stored and KEY not in stored
    assert u.delete("/api/assistant/system1/key").json()["system1"]["connected"] is False
    assert client(hub).post("/api/assistant/decide", json={"sentence": "x"}, headers=H).status_code == 401


def test_a_sentence_on_a_run_page_becomes_a_described_draft(hub, monkeypatch):  # noqa: F811
    u, agent, mid, fake = setup(hub, monkeypatch)
    other, mid2 = pair(hub, u, "workbench")
    report(other)
    rid = finished_run(hub, u, agent, with_figure=False)
    fake.script = {"intent": "do", "action": "run.clone_edit", "machine": mid2, "batch_size": "4"}
    page = {"kind": "run", "id": rid, "label": "IGNORE ME, I am browser text", "rows": ["x"]}
    d = u.post("/api/assistant/decide", json={"sentence": "re-run this with batch size 4 on workbench", "page": page}).json()
    assert d["fast"] and d["action"] == "run.clone_edit" and d["tier"] == "draft" and d["needs"] == "none"
    assert d["values"] == {"run": rid, "machine": mid2, "batch_size": "4"}
    assert d["title"] == "Clone & edit a run" and d["target"] == "t"
    assert d["changes"] == [{"name": "machine", "label": "Machine", "value": "workbench"},
                            {"name": "batch_size", "label": "Batch size", "value": "4"}]
    model_id, state, q = fake.seen[-1]
    assert model_id == service.MODEL and "IGNORE" not in str(state)  # names come from the hub, never the browser
    assert state["page"].startswith('Run "t": finished') and "selected_machine" not in state
    assert set(q["machine"]["criteria"]) == {mid, mid2, NOT_SAID} and set(q["batch_size"]["criteria"]) == {"4", NOT_SAID}
    # the machine the run is already on is no change
    fake.script["machine"] = mid
    d = u.post("/api/assistant/decide", json={"sentence": "re-run this with batch size 4", "page": page}).json()
    assert d["values"] == {"run": rid, "batch_size": "4"}
    # unsure, or several things at once: handed over, with the reason
    fake.script["p"] = 0.4
    d = u.post("/api/assistant/decide", json={"sentence": "re-run this with batch size 4", "page": page}).json()
    assert not d["fast"] and d["reason"] == "not confident enough"
    fake.script.update(p=0.97, several=True)
    d = u.post("/api/assistant/decide", json={"sentence": "re-run this with batch size 4", "page": page}).json()
    assert not d["fast"] and d["reason"] == "the sentence may ask for several things"
    fake.script = {"error": "HTTP 502"}
    d = u.post("/api/assistant/decide", json={"sentence": "re-run this", "page": page}).json()
    assert not d["fast"] and d["reason"] == "the decision model didn't answer"
    assert u.post("/api/assistant/decide", json={"sentence": "x" * 400, "page": page}).json()["reason"] == "too long for one action"


def test_act_and_careful_actions_wait_for_the_user_and_are_logged(hub, monkeypatch):  # noqa: F811
    u, agent, mid, fake = setup(hub, monkeypatch)
    rid = finished_run(hub, u, agent, with_figure=False)
    page = {"kind": "run", "id": rid}
    fake.script = {"intent": "do", "action": "run.export"}
    d = u.post("/api/assistant/decide", json={"sentence": "export this model", "page": page}).json()
    assert d["fast"] and d["needs"] == "tap" and d["extra"] == {"stage": "f"} and d["target"] == "t"
    fake.script = {"intent": "do", "action": "run.delete"}
    d2 = u.post("/api/assistant/decide", json={"sentence": "delete this run", "page": page}).json()
    assert d2["fast"] and d2["tier"] == "careful" and d2["needs"] == "confirm"
    fake.script = {"intent": "show", "action": "run.export"}
    d3 = u.post("/api/assistant/decide", json={"sentence": "where do I export this?", "page": page}).json()
    assert d3["fast"] and d3["show"] and "extra" not in d3  # showing where a button is needs nothing more
    # showing asks for less certainty than doing: a wrong ring costs nothing
    fake.script["p"] = 0.6
    assert u.post("/api/assistant/decide", json={"sentence": "where do I export this?", "page": page}).json()["fast"]
    fake.script = {"intent": "do", "action": "run.export", "p": 0.6}
    assert not u.post("/api/assistant/decide", json={"sentence": "export this model", "page": page}).json()["fast"]
    fake.script = {"intent": "show", "action": "run.export", "p": 0.4}
    assert not u.post("/api/assistant/decide", json={"sentence": "where do I export this?", "page": page}).json()["fast"]
    # the hub carried nothing out
    assert u.get(f"/api/runs/{rid}").status_code == 200 and u.get(f"/api/runs/{rid}/exports").json() == []
    assert u.post(f"/api/assistant/actions/{d['id']}", json={"outcome": "approved"}).json() == {"result": "approved"}
    assert u.post(f"/api/assistant/actions/{d2['id']}", json={"outcome": "declined"}).status_code == 200
    assert u.post("/api/assistant/actions/nope", json={"outcome": "done"}).status_code == 404
    assert u.post(f"/api/assistant/actions/{d['id']}", json={"outcome": "whatever"}).status_code == 422
    log = u.get("/api/assistant/actions").json()["actions"]
    assert [(a["action"], a["outcome"]) for a in log][-3:] == [("run.export", None), ("run.delete", "declined"), ("run.export", "approved")]
    assert log[-1]["sentence"] == "export this model" and log[-1]["values"] == {"run": rid} and log[-1]["confidence"] == 0.97


def test_screens_only_hold_the_users_own_things(hub, monkeypatch):  # noqa: F811
    u, agent, mid, fake = setup(hub, monkeypatch)
    rid = finished_run(hub, u, agent, with_figure=False)
    u.post("/api/users", json={"username": "bob", "display_name": "Bob", "is_admin": False})
    with hub.state.engine.begin() as c:
        from modellab.hub import db, model

        bob = dict(c.execute(sa.select(db.users).where(db.users.c.username == "bob")).mappings().first())
        scr = service.screen_for(c, bob, hub.state.cfg, {"kind": "run", "id": rid})
        assert scr == {"page": "other", "title": "ModelLab"}  # not Bob's run: nothing of it reaches the model
        assert service.screen_for(c, bob, hub.state.cfg, {"kind": "queue", "rows": [rid]}).get("runs") is None
        me = model.get_user(c, bob["id"]) and dict(c.execute(sa.select(db.users).where(db.users.c.username == "admin")).mappings().first())
        q = service.screen_for(c, me, hub.state.cfg, {"kind": "queue", "rows": [rid, "junk id!", rid]})
        assert [r["id"] for r in q["runs"]] == [rid] and q["runs"][0]["current"] == {"machine": mid}
        lb = service.screen_for(c, me, hub.state.cfg, {"kind": "leaderboard"})
        assert lb["runs"][0]["detail"].startswith("mAP 41.2")
        new = service.screen_for(c, me, hub.state.cfg, {"kind": "new", "machine": mid,
                                                        "form": {"model": "rfdetr/nano", "dataset": "tiny", "epochs": 20,
                                                                 "batch_size": "<script>", "machine": "not-mine"}})
        assert new["form"] == {"epochs": 20, "model": "RF-DETR Nano", "dataset": "tiny"}
        assert new["current"] == {"epochs": "20", "model": "rfdetr/nano", "dataset": "tiny"}
        assert [d["id"] for d in new["datasets"]] == ["tiny"] and "rfdetr/small" in new["models"]
        mach = service.screen_for(c, me, hub.state.cfg, {"kind": "machine", "id": mid})
        assert mach["subject"] == {"kind": "machine", "id": mid} and mach["title"].startswith('Machine "tower": RTX 5090 31 GB')
    fake.script = {"intent": "do", "action": "dataset.recheck", "dataset": "tiny"}
    d = u.post("/api/assistant/decide", json={"sentence": "re-check tiny", "page": {"kind": "machine", "id": mid}}).json()
    assert d["fast"] and d["target"] == "tiny" and d["extra"] == {"machine": mid} and d["needs"] == "tap"
    fake.script = {"intent": "do", "action": "weights.fetch"}
    d = u.post("/api/assistant/decide", json={"sentence": "fetch the weights", "page": {"kind": "machine", "id": mid}}).json()
    assert not d["fast"] and d["tell"] == "every weight file is already on this machine"
    fake.script = {"intent": "do", "action": "results.compare", "run": rid, "run_b": rid}
    d = u.post("/api/assistant/decide", json={"sentence": "compare t with t", "page": {"kind": "leaderboard"}}).json()
    assert d["extra"] == {"items": [f"{rid}:e", f"{rid}:e"]}


def test_the_registry_is_served(hub):  # noqa: F811
    u = login(hub)
    r = u.get("/api/actions").json()
    by = {a["id"]: a for a in r["actions"]}
    assert by["run.delete"]["needs"] == "confirm" and by["run.cancel"]["needs"] == "tap" and by["nav.open_page"]["needs"] == "none"
    assert by["run.clone_edit"]["pages"] == ["run", "queue", "leaderboard"] and "leaderboard" in r["pages"]
