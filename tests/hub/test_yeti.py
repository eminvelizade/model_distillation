"""Yeti: the evidence builders, the read-only tools, the chat loop (the real Claude SDK against a mocked API), the
encrypted key, and the MCP server behind OAuth."""

import base64
import hashlib
import json
import secrets
import time
from urllib.parse import parse_qs, urlsplit

import anthropic
import httpx2
import sqlalchemy as sa
from conftest import H, RECIPE, client, hub, login, pair, report  # noqa: F401
from test_search import play, report as search_report

KEY = "sk-ant-api03-" + "x" * 40


# ---------------------------------------------------------------- helpers

def png(w=8, h=8) -> bytes:
    import struct
    import zlib

    raw = b"".join(b"\x00" + b"\x80\xa0\xc0" * w for _ in range(h))
    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)) + \
        chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b"")


def user_row(app, username="admin") -> dict:
    from modellab.hub import db

    with app.state.engine.begin() as c:
        return dict(c.execute(sa.select(db.users).where(db.users.c.username == username)).mappings().first())


def finished_search(app):
    """A search played to the end by two simulated agents (as in test_search)."""
    u = login(app)
    a, ma = pair(app, u, "fast")
    b, mb = pair(app, u, "second")
    search_report(a), search_report(b)
    body = {"name": "find nano", "dataset": "tiny", "machines": [ma, mb], "target_machine": ma, "speed_ms": 5,
            "models": ["rfdetr/nano", "rfdetr/small", "ltdetr/dinov3-vitt16-coco"], "image_sizes": {"rfdetr/nano": [320, 384]},
            "teachers": ["dinov2/vits14"], "epochs": 9, "rungs": 3, "eta": 3, "seeds": 1}
    sid = u.post("/api/searches", json=body).json()["id"]
    seen = []
    for _ in range(50):
        if not (play(a, seen) | play(b, seen)):
            break
    assert u.get(f"/api/searches/{sid}").json()["status"] == "done"
    return u, sid


FEATS_RECIPE = RECIPE + """  - {name: feat, type: features, models: [{from: f}, rfdetr/nano]}
"""


def finished_run(app, u, agent, with_figure=True):
    r = u.post("/api/runs", json={"yaml": FEATS_RECIPE, "machine_id": u.get("/api/machines").json()[0]["id"]})
    assert r.status_code == 200, r.text
    rid = r.json()["run_ids"][0]
    assert agent.post("/agent/v1/claim").json()["run"]["id"] == rid
    row = {"label": "nano ft", "model": "rfdetr/nano", "family": "rfdetr", "dataset": "tiny", "split": "test",
           "dataset_hash": "h1", "eval_version": "1+x", "map": 0.4123, "map50": 0.6, "latency_ms": 2.5, "latency_device": "RTX 5090 fp16",
           "params_m": 30.5, "per_class": {"car": 0.5, "bus": 0.3245}, "input_size": 384, "images": 50}
    feats = {"split": "valid", "images": 20, "objects": 80, "size": 384, "classes": {"car": 50, "bus": 30},
             "probes": {"stock rfdetr/nano": {"knn_acc": 0.7, "linear_acc": 0.75}, "f": {"knn_acc": 0.8, "linear_acc": 0.83}},
             "cka": {"f vs stock rfdetr/nano": {"objects": 0.61, "tokens": 0.55}},
             "attention": {"f": {"images": 16, "object_focus": 0.62, "box_area": 0.2, "lift": 3.1, "cls_object_focus": 0.5,
                                 "entropy": 0.81, "similarity_to_teacher": 0.7}}}
    stages = [{"name": "f", "status": "done", "result": {"metrics": {"train_images": 100}}},
              {"name": "e", "status": "done", "result": {"metrics": {"map": 0.4123}}},
              {"name": "feat", "status": "done", "result": {"metrics": feats},
               "artifacts": [{"path": "stages/feat/pca.png", "size": 10, "kind": "file"}] if with_figure else []}]
    if with_figure:
        assert agent.put(f"/agent/v1/runs/{rid}/files/stages/feat/pca.png", content=png(), headers={"Content-Type": "image/png"}).status_code == 200
    now = time.time()
    r = agent.post(f"/agent/v1/runs/{rid}/events", json={"run": {"status": "done", "started": now - 300, "finished": now},
                                                          "stages": stages, "results": [{"stage": "e", "row": row}]})
    assert r.status_code == 200, r.text
    return rid


# ---------------------------------------------------------------- evidence and tools

def test_explain_search_evidence(hub):  # noqa: F811
    from modellab.hub import yeti_tools

    u, sid = finished_search(hub)
    out = yeti_tools.call(hub.state.engine, user_row(hub), "explain_search", {"search_id": sid})
    assert not out.error, out.data
    ev = out.data
    assert out.href == f"/search/{sid}" and "find nano" in out.label
    assert ev["speed"]["dropped_as_too_slow"] == ["rfdetr/small@512"]
    small = next(x for x in ev["speed"]["candidates"] if x["candidate"] == "rfdetr/small@512")
    assert small["over_budget_ms"] == 1.0 and small["fits_budget"] is False
    rec = ev["recommendation"]
    assert rec["config"] == "rfdetr/nano@384 distilled from dinov2/vits14" and rec["headroom_ms"] == 2.0
    assert rec["map_valid_mean"] is not None and "runner_up" in rec and rec["runner_up"]["verdict"]
    assert rec["too_slow_for_the_budget"][0]["candidate"] == "rfdetr/small@512"
    r1 = ev["rounds"][0]
    assert r1["epochs"] == 1 and r1["trained"] == 5 and r1["cutoff"]["margin_pts"] >= 0
    comp = r1["comparisons"]
    sizes = next(g for g in comp["input_size"] if g["model"] == "RF-DETR Nano" and not g.get("teacher"))
    assert sizes["best_size"] == 384 and sizes["steps"][0]["gain_pts"] == 4.0
    assert all(d["gain_pts"] == 5.0 for d in comp["distillation"])
    assert ev["full_budget"]["finalists"][0]["config"] == rec["config"]
    assert any("Round 1" in c for c in ev["caveats"])
    assert "percentage points" in ev["units"]
    lst = yeti_tools.call(hub.state.engine, user_row(hub), "list_searches", {})
    assert lst.data["searches"][0]["recommendation"] == rec["config"]


def test_run_tools_figures_logs_and_scoping(hub):  # noqa: F811
    from modellab.hub import yeti_tools

    u = login(hub)
    agent, mid = pair(hub, u)
    report(agent)
    rid = finished_run(hub, u, agent)
    agent.post(f"/agent/v1/runs/{rid}/events", json={"logs": [{"stream": "runner", "offset": 0, "text": "\x1b[32mepoch 1\x1b[0m loss 1.2\nepoch 2 loss 0.9\n"}]})
    me = user_row(hub)
    eng = hub.state.engine
    run = yeti_tools.call(eng, me, "get_run", {"run_id": rid})
    assert not run.error, run.data
    res = run.data["results"][0]
    assert res["map"] == 41.23 and res["per_class"] == {"car": 50.0, "bus": 32.45} and res["standing"]["rank"] == 1
    assert run.data["features"]["feat"]["probes"]["f"]["knn_acc"] == 80.0
    att = run.data["features"]["feat"]["attention"]["f"]
    assert att["object_focus_pct"] == 62.0 and att["box_area_pct"] == 20.0 and att["lift"] == 3.1 and att["similarity_to_teacher"] == 0.7
    figs = yeti_tools.call(eng, me, "view_figures", {"run_id": rid})
    assert not figs.error and len(figs.images) == 1 and figs.images[0][0].startswith(b"\x89PNG")
    assert figs.data["figures_shown_in_order"][0]["figure"] == "stages/feat/pca.png" and "PCA" in figs.label
    logs = yeti_tools.call(eng, me, "get_run_logs", {"run_id": rid})
    assert logs.data["lines"][-2:] == ["epoch 1 loss 1.2", "epoch 2 loss 0.9"]
    assert yeti_tools.call(eng, me, "get_run_logs", {"run_id": rid, "stage": "nope"}).error
    lb = yeti_tools.call(eng, me, "leaderboard", {})
    assert lb.data["groups"][0]["ranking"][0]["map"] == 41.23
    runs = yeti_tools.call(eng, me, "list_runs", {"query": "t"})
    assert runs.data["runs"][0]["id"] == rid
    m = yeti_tools.call(eng, me, "get_machine", {"machine_id": mid})
    assert not m.error and m.data["datasets"][0]["name"] == "tiny"
    assert yeti_tools.call(eng, me, "list_machines", {}).data["machines"][0]["name"] == "box"
    g = yeti_tools.call(eng, me, "read_guide", {"section": "find best"})
    assert g.data["section"] == "Find best model" and "successive halving" in g.data["text"].lower()
    # validation: unknown or mistyped arguments come back as errors Claude can read
    assert yeti_tools.call(eng, me, "get_run", {"run_id": 5}).error
    assert yeti_tools.call(eng, me, "get_run", {"run_id": rid, "x": 1}).error
    assert yeti_tools.call(eng, me, "get_run", {}).error
    assert yeti_tools.call(eng, me, "nope", {}).error
    # another user sees nothing of it
    u.post("/api/users", json={"username": "bob", "password": "bob-pass-12"})
    bob = user_row(hub, "bob")
    for name, args in (("get_run", {"run_id": rid}), ("view_figures", {"run_id": rid}), ("get_machine", {"machine_id": mid})):
        out = yeti_tools.call(eng, bob, name, args)
        assert out.error and "no such" in out.text(), (name, out.data)
    assert yeti_tools.call(eng, bob, "list_runs", {}).data["runs"] == []


# ---------------------------------------------------------------- the chat loop against a mocked Claude API

def sse_message(blocks, stop, model="claude-opus-5-5"):
    ev = [{"type": "message_start", "message": {"id": "msg_" + secrets.token_hex(4), "type": "message", "role": "assistant",
           "model": model, "content": [], "stop_reason": None, "stop_sequence": None,
           "usage": {"input_tokens": 120, "output_tokens": 1, "cache_read_input_tokens": 4000, "cache_creation_input_tokens": 0}}}]
    for i, b in enumerate(blocks):
        if b["type"] == "text":
            ev.append({"type": "content_block_start", "index": i, "content_block": {"type": "text", "text": ""}})
            for k in range(0, len(b["text"]), 7):
                ev.append({"type": "content_block_delta", "index": i, "delta": {"type": "text_delta", "text": b["text"][k:k + 7]}})
        elif b["type"] == "thinking":
            ev.append({"type": "content_block_start", "index": i, "content_block": {"type": "thinking", "thinking": "", "signature": ""}})
            ev.append({"type": "content_block_delta", "index": i, "delta": {"type": "thinking_delta", "thinking": b["thinking"]}})
            ev.append({"type": "content_block_delta", "index": i, "delta": {"type": "signature_delta", "signature": "c2ln"}})
        elif b["type"] == "tool_use":
            ev.append({"type": "content_block_start", "index": i, "content_block": {"type": "tool_use", "id": b["id"], "name": b["name"], "input": {}}})
            ev.append({"type": "content_block_delta", "index": i, "delta": {"type": "input_json_delta", "partial_json": json.dumps(b["input"])}})
        ev.append({"type": "content_block_stop", "index": i})
    ev.append({"type": "message_delta", "delta": {"stop_reason": stop, "stop_sequence": None}, "usage": {"output_tokens": 30}})
    ev.append({"type": "message_stop"})
    return "".join(f"event: {e['type']}\ndata: {json.dumps(e)}\n\n" for e in ev).encode()


class FakeClaude:
    """Answers Messages API calls from a script; records every request."""

    def __init__(self, script, models_status=200):
        self.script, self.requests, self.models_status = list(script), [], models_status

    def handler(self, req):
        body = json.loads(req.content) if req.content else None
        self.requests.append({"path": req.url.path, "headers": dict(req.headers), "body": body})
        if req.url.path.startswith("/v1/models/"):
            if self.models_status != 200:
                return httpx2.Response(self.models_status, json={"type": "error", "error": {"type": "authentication_error", "message": "invalid x-api-key"}})
            return httpx2.Response(200, json={"id": req.url.path.rsplit("/", 1)[-1], "type": "model", "display_name": "x",
                                              "created_at": "2026-01-01T00:00:00Z"})
        step = self.script.pop(0)
        if isinstance(step, int):
            return httpx2.Response(step, json={"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}})
        return httpx2.Response(200, headers={"content-type": "text/event-stream"}, content=step(body) if callable(step) else step)

    def client(self, api_key):
        return anthropic.Anthropic(api_key=api_key, max_retries=0,
                                   http_client=anthropic.DefaultHttpxClient(transport=httpx2.MockTransport(self.handler)))


def events(resp) -> list[dict]:
    assert resp.status_code == 200, resp.text
    return [json.loads(line[6:]) for line in resp.text.splitlines() if line.startswith("data: ")]


def test_settings_key_is_validated_and_encrypted(hub, monkeypatch):  # noqa: F811
    from modellab.hub import db, yeti

    u = login(hub)
    assert u.get("/api/assistant").json()["connected"] is False
    r = u.post("/api/assistant/chat", json={"messages": [{"role": "user", "text": "hi"}]})
    assert r.status_code == 409 and "Connect Yeti" in r.json()["detail"]
    bad = FakeClaude([], models_status=401)
    monkeypatch.setattr(yeti, "make_client", bad.client)
    r = u.put("/api/assistant", json={"api_key": KEY})
    assert r.status_code == 422 and "rejected" in r.json()["detail"]
    assert u.put("/api/assistant", json={"api_key": "short"}).status_code == 422
    good = FakeClaude([])
    monkeypatch.setattr(yeti, "make_client", good.client)
    r = u.put("/api/assistant", json={"api_key": KEY, "model": "claude-sonnet-5-5", "effort": "high"})
    assert r.status_code == 200, r.text
    s = r.json()
    assert s["connected"] and s["key_hint"] == "…xxxx" and s["model"] == "claude-sonnet-5-5" and s["effort"] == "high"
    assert KEY not in json.dumps(s) and good.requests[0]["path"] == "/v1/models/claude-sonnet-5-5"
    with hub.state.engine.begin() as c:
        stored = c.execute(sa.select(db.assistant.c.api_key)).scalar()
    assert stored and KEY not in stored  # encrypted at rest
    assert u.put("/api/assistant", json={"model": "gpt-5"}).status_code == 422
    assert u.put("/api/assistant", json={"effort": "max"}).status_code == 422
    assert u.delete("/api/assistant/key").json()["connected"] is False


def test_chat_runs_tools_and_streams(hub, monkeypatch):  # noqa: F811
    from modellab.hub import yeti

    u, sid = finished_search(hub)

    def second(body):
        # the tool result went back with the evidence, after the assistant turn that asked for it
        assert body["messages"][-2]["role"] == "assistant"
        res = body["messages"][-1]["content"][0]
        assert res["type"] == "tool_result" and res["tool_use_id"] == "toolu_1" and not res.get("is_error")
        ev = json.loads(res["content"][0]["text"])
        assert ev["recommendation"]["config"].startswith("rfdetr/nano@384")
        return sse_message([{"type": "text", "text": "It won because it fits with 2 ms to spare."}], "end_turn")

    fake = FakeClaude([
        sse_message([{"type": "thinking", "thinking": "Checking the search rounds."},
                     {"type": "tool_use", "id": "toolu_1", "name": "explain_search", "input": {"search_id": sid}}], "tool_use"),
        second,
    ])
    monkeypatch.setattr(yeti, "make_client", fake.client)
    u.put("/api/assistant", json={"api_key": KEY})
    hist = [{"role": "user", "text": "earlier question", "note": "The user is on the leaderboard page."},
            {"role": "assistant", "text": "earlier answer"},
            {"role": "user", "text": "Why did this model win?"}]
    ev = events(u.post("/api/assistant/chat", json={"messages": hist, "page": {"path": f"/search/{sid}", "kind": "search", "id": sid,
                                                                             "focus": "recommendation"}}))
    kinds = [e["type"] for e in ev]
    assert kinds[0] == "start" and kinds[-1] == "done", kinds
    assert "find nano" in ev[0]["note"] and "recommendation" in ev[0]["note"]
    assert {"type": "note", "text": "Checking the search rounds."} in ev
    tool = next(e for e in ev if e["type"] == "tool")
    done = next(e for e in ev if e["type"] == "tool_done")
    assert tool["name"] == "explain_search" and done["ok"] and done["href"] == f"/search/{sid}"
    final = ev[-1]
    assert final["text"] == "It won because it fits with 2 ms to spare." == "".join(e["text"] for e in ev if e["type"] == "text")
    assert final["usage"]["cache_read"] == 8000 and final["model_label"] == "Claude Opus 5.5"
    first = fake.requests[1]  # [0] is the key check
    b = first["body"]
    assert b["model"] == "claude-opus-5-5" and b["output_config"] == {"effort": "medium"} and b["fallbacks"] == "default"
    assert b["thinking"] == {"type": "adaptive", "display": "updates"} and b["cache_control"] == {"type": "ephemeral"}
    assert b["system"][0]["cache_control"] == {"type": "ephemeral"} and "You are Yeti" in b["system"][0]["text"]
    assert all(t["eager_input_streaming"] for t in b["tools"]) and "temperature" not in b
    betas = first["headers"]["anthropic-beta"]
    assert "server-side-fallback-2026-07-01" in betas and "thinking-display-updates-2026-08-18" in betas
    msgs = b["messages"]
    assert msgs[0] == {"role": "user", "content": "<page>The user is on the leaderboard page.</page>\n\nearlier question"}
    assert msgs[1] == {"role": "assistant", "content": "earlier answer"}
    assert msgs[2]["content"].startswith("<page>") and msgs[2]["content"].endswith("Why did this model win?")
    # the second call replays the first answer exactly (thinking block included) before the tool result
    second_body = fake.requests[2]["body"]
    assert second_body["messages"][:3] == msgs[:3]
    assert [blk["type"] for blk in second_body["messages"][3]["content"]] == ["thinking", "tool_use"]
    assert second_body["system"] == b["system"] and second_body["tools"] == b["tools"]


def test_chat_speaks_as_the_chosen_mascot(hub, monkeypatch):  # noqa: F811
    from modellab.hub import yeti

    u, _ = finished_search(hub)
    fake = FakeClaude([sse_message([{"type": "text", "text": "Hello from the lab!"}], "end_turn")])
    monkeypatch.setattr(yeti, "make_client", fake.client)
    u.put("/api/assistant", json={"api_key": KEY})
    ev = events(u.post("/api/assistant/chat", json={"messages": [{"role": "user", "text": "who are you?"}], "mascot": "mochi"}))
    assert ev[-1]["type"] == "done"
    system = fake.requests[1]["body"]["system"][0]["text"]
    assert system.startswith("You are Dr. Mochi,") and "lab coat" in system and "You are Yeti" not in system
    assert "{" not in system.split("# The ModelLab guide")[0]  # every placeholder filled in
    assert u.post("/api/assistant/chat", json={"messages": [{"role": "user", "text": "hi"}], "mascot": "clippy"}).status_code == 422


def test_each_mascot_has_its_own_voice():
    from modellab.hub import yeti

    for key, (name, _, _) in yeti.MASCOTS.items():
        head = yeti.system_prompt(key).split("# The ModelLab guide")[0]
        assert head.startswith(f"You are {name},") and "{" not in head
    # the plush ones are warm and light; Rime, the snow golem, is calm and never gushes
    assert "- Be warm and light. A touch of snowy personality is welcome; clarity comes first." in yeti.system_prompt("yeti")
    rime = yeti.system_prompt("rime").split("# The ModelLab guide")[0]
    assert "warm and light" not in rime and "no exclamation marks" in rime and "fully helpful" in rime


def test_chat_errors_and_haiku_settings(hub, monkeypatch):  # noqa: F811
    from modellab.hub import yeti

    u = login(hub)
    fake = FakeClaude([529, sse_message([{"type": "text", "text": "Hi!"}], "end_turn", model="claude-haiku-5-5")])
    monkeypatch.setattr(yeti, "make_client", fake.client)
    u.put("/api/assistant", json={"api_key": KEY, "model": "claude-haiku-5-5", "effort": "low"})
    ev = events(u.post("/api/assistant/chat", json={"messages": [{"role": "user", "text": "hello"}]}))
    assert ev[-1]["type"] == "error" and ev[-1]["code"] == "overloaded"
    ev = events(u.post("/api/assistant/chat", json={"messages": [{"role": "user", "text": "hello"}]}))
    assert ev[-1]["type"] == "done" and ev[-1]["text"] == "Hi!"
    b = fake.requests[-1]["body"]
    assert "fallbacks" not in b and "thinking" not in b and b["output_config"] == {"effort": "low"}
    assert "anthropic-beta" not in fake.requests[-1]["headers"]
    # malformed history is refused before anything is sent
    assert u.post("/api/assistant/chat", json={"messages": [{"role": "assistant", "text": "x"}]}).status_code == 422
    assert u.post("/api/assistant/chat", json={"messages": []}).status_code == 422
    # someone else's page can't be named in the context
    u.post("/api/users", json={"username": "bob", "password": "bob-pass-12"})
    from modellab.hub import yeti as y

    with hub.state.engine.begin() as c:
        note = y.page_note(c, user_row(hub, "bob"), {"kind": "run", "id": "20260101-000000-x-abc123", "path": "/runs/<script>"})
    assert note == "Path: /runs/script"


# ---------------------------------------------------------------- MCP + OAuth

def pkce():
    v = secrets.token_urlsafe(48)
    return v, base64.urlsafe_b64encode(hashlib.sha256(v.encode()).digest()).rstrip(b"=").decode()


def test_mcp_behind_oauth(hub):  # noqa: F811
    from modellab.hub import oauth

    oauth.REGISTER_IP._hits.clear()
    oauth.TOKEN_FAIL_IP._hits.clear()
    anon = client(hub)
    r = anon.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}})
    assert r.status_code == 401 and "resource_metadata=" in r.headers["www-authenticate"]
    meta = anon.get("/.well-known/oauth-protected-resource").json()
    asm = anon.get("/.well-known/oauth-authorization-server").json()
    assert meta["resource"].endswith("/mcp") and asm["code_challenge_methods_supported"] == ["S256"]
    # dynamic client registration
    assert anon.post("/oauth/register", json={"redirect_uris": ["http://evil.example/cb"]}).status_code == 400
    reg = anon.post("/oauth/register", json={"client_name": "Claude", "redirect_uris": ["https://claude.ai/api/mcp/auth_callback"],
                                             "token_endpoint_auth_method": "none"})
    assert reg.status_code == 201, reg.text
    cid = reg.json()["client_id"]
    verifier, challenge = pkce()
    q = {"response_type": "code", "client_id": cid, "redirect_uri": "https://claude.ai/api/mcp/auth_callback", "state": "st8",
         "code_challenge": challenge, "code_challenge_method": "S256", "scope": "modellab.read", "resource": meta["resource"]}
    # not signed in: off to the login page, which comes back here
    r = anon.get("/oauth/authorize", params=q, follow_redirects=False)
    assert r.status_code == 302 and r.headers["location"].startswith("/?login_next=%2Foauth%2Fauthorize")
    # a redirect URI the client didn't register is refused on the page, never redirected to
    assert anon.get("/oauth/authorize", params={**q, "redirect_uri": "https://evil.example/cb"}).status_code == 400
    u = login(hub)
    page = u.get("/oauth/authorize", params=q)
    assert page.status_code == 200 and "Connect <b>Claude</b> to ModelLab" in page.text
    assert "form-action 'self' https://claude.ai" in page.headers["content-security-policy"]
    csrf = page.text.split('name=csrf value="')[1].split('"')[0]
    form = {**q, "csrf": csrf, "action": "allow"}
    bad = u.post("/oauth/authorize", data={**form, "csrf": "0" * 64}, follow_redirects=False)
    assert bad.status_code == 403
    r = u.post("/oauth/authorize", data=form, follow_redirects=False)
    assert r.status_code == 302
    loc = urlsplit(r.headers["location"])
    got = parse_qs(loc.query)
    assert loc.netloc == "claude.ai" and got["state"] == ["st8"] and got["iss"]
    code = got["code"][0]
    # the token: wrong verifier burns the code
    tok = {"grant_type": "authorization_code", "code": code, "client_id": cid, "redirect_uri": q["redirect_uri"]}
    assert anon.post("/oauth/token", data={**tok, "code_verifier": pkce()[0]}).json()["error"] == "invalid_grant"
    assert anon.post("/oauth/token", data={**tok, "code_verifier": verifier}).json()["error"] == "invalid_grant"
    # again, properly
    page = u.get("/oauth/authorize", params=q)
    csrf = page.text.split('name=csrf value="')[1].split('"')[0]
    code = parse_qs(urlsplit(u.post("/oauth/authorize", data={**q, "csrf": csrf, "action": "allow"},
                                    follow_redirects=False).headers["location"]).query)["code"][0]
    t = anon.post("/oauth/token", data={**tok, "code": code, "code_verifier": verifier})
    assert t.status_code == 200, t.text
    t = t.json()
    assert t["token_type"] == "Bearer" and t["access_token"].startswith("mla_") and t["refresh_token"].startswith("mlr_")
    assert t["scope"] == "modellab.read"
    assert anon.post("/oauth/token", data={**tok, "code": code, "code_verifier": verifier}).status_code == 400  # single use
    mcp = client(hub)
    mcp.headers["Authorization"] = f"Bearer {t['access_token']}"

    def rpc(method, params=None, id_=1):
        r = mcp.post("/mcp", json={"jsonrpc": "2.0", "id": id_, "method": method, "params": params or {}})
        assert r.status_code == 200, r.text
        return r.json()

    init = rpc("initialize", {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "t", "version": "1"}})
    assert init["result"]["protocolVersion"] == "2025-06-18" and init["result"]["serverInfo"]["name"] == "modellab"
    assert mcp.post("/mcp", json={"jsonrpc": "2.0", "method": "notifications/initialized"}).status_code == 202
    tools = rpc("tools/list")["result"]["tools"]
    assert {x["name"] for x in tools} >= {"explain_search", "get_run", "view_figures", "read_guide"}
    assert all(x["annotations"]["readOnlyHint"] for x in tools)
    res = rpc("tools/call", {"name": "read_guide", "arguments": {"section": "Export"}})["result"]
    assert not res["isError"] and "model.onnx" in res["content"][0]["text"]
    assert rpc("tools/call", {"name": "get_run", "arguments": {"run_id": "nope"}})["result"]["isError"]
    assert rpc("nope")["error"]["code"] == -32601
    assert mcp.post("/mcp", content=b"{", headers={"content-type": "application/json"}).json()["error"]["code"] == -32700
    assert mcp.post("/mcp", json=[{"jsonrpc": "2.0", "id": 1, "method": "ping"}]).status_code == 400
    assert mcp.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "ping"}, headers={"Origin": "https://evil.example"}).status_code == 403
    assert mcp.get("/mcp").status_code == 405
    # settings list the app; refresh rotates; reusing an old refresh token ends the grant
    apps = u.get("/api/assistant").json()["connector"]["apps"]
    assert apps[0]["client_id"] == cid and apps[0]["name"] == "Claude"
    t2 = anon.post("/oauth/token", data={"grant_type": "refresh_token", "refresh_token": t["refresh_token"], "client_id": cid}).json()
    assert t2["access_token"] != t["access_token"]
    replay = anon.post("/oauth/token", data={"grant_type": "refresh_token", "refresh_token": t["refresh_token"], "client_id": cid})
    assert replay.json()["error"] == "invalid_grant"
    mcp.headers["Authorization"] = f"Bearer {t2['access_token']}"
    assert mcp.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "ping"}).status_code == 401  # whole family revoked
    # a fresh grant, then disconnect from Yeti's settings
    page = u.get("/oauth/authorize", params=q)
    csrf = page.text.split('name=csrf value="')[1].split('"')[0]
    code = parse_qs(urlsplit(u.post("/oauth/authorize", data={**q, "csrf": csrf, "action": "allow"},
                                    follow_redirects=False).headers["location"]).query)["code"][0]
    t3 = anon.post("/oauth/token", data={**tok, "code": code, "code_verifier": verifier}).json()
    mcp.headers["Authorization"] = f"Bearer {t3['access_token']}"
    assert mcp.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "ping"}).status_code == 200
    assert u.delete(f"/api/assistant/apps/{cid}").json()["apps"] == []
    assert mcp.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "ping"}).status_code == 401
    # denying sends the app an error, no code
    page = u.get("/oauth/authorize", params=q)
    csrf = page.text.split('name=csrf value="')[1].split('"')[0]
    r = u.post("/oauth/authorize", data={**q, "csrf": csrf, "action": "deny"}, follow_redirects=False)
    assert parse_qs(urlsplit(r.headers["location"]).query)["error"] == ["access_denied"]


def test_oauth_loopback_and_confidential_clients(hub):  # noqa: F811
    from modellab.hub import oauth

    oauth.REGISTER_IP._hits.clear()
    oauth.TOKEN_FAIL_IP._hits.clear()
    anon = client(hub)
    reg = anon.post("/oauth/register", json={"client_name": "Claude Code", "redirect_uris": ["http://localhost:5555/callback"],
                                             "token_endpoint_auth_method": "client_secret_post"}).json()
    assert reg["client_secret"].startswith("mls_")
    verifier, challenge = pkce()
    q = {"response_type": "code", "client_id": reg["client_id"], "redirect_uri": "http://localhost:61234/callback",
         "code_challenge": challenge, "code_challenge_method": "S256"}
    u = login(hub)
    page = u.get("/oauth/authorize", params=q)  # loopback: any port
    assert page.status_code == 200
    # no PKCE: back to the app with an error
    r = u.get("/oauth/authorize", params={**q, "code_challenge": ""}, follow_redirects=False)
    assert r.status_code == 302 and "error=invalid_request" in r.headers["location"]
    csrf = page.text.split('name=csrf value="')[1].split('"')[0]
    code = parse_qs(urlsplit(u.post("/oauth/authorize", data={**q, "csrf": csrf, "action": "allow"},
                                    follow_redirects=False).headers["location"]).query)["code"][0]
    tok = {"grant_type": "authorization_code", "code": code, "client_id": reg["client_id"], "code_verifier": verifier}
    assert anon.post("/oauth/token", data=tok).status_code == 401  # the secret is required
    t = anon.post("/oauth/token", data={**tok, "client_secret": reg["client_secret"]})
    assert t.status_code == 200, t.text
