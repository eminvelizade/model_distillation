"""Agents: the assistants a user talks to, and their threads, kept on the hub.

An agent is a name, a look (a built-in mascot or a make-your-own one) and a role in the user's words. Each has one
thread: what the user and the agent said, the cards the agent offered and what became of them, plan cards, and the
hub's own reports of what happened to a plan while nobody was looking (events). The thread lives here, not in the
browser, so a plan can report into it with no page open, and the chat tab and the corner panel show the same thing.

A turn is one POST that streams server-sent events while the hub runs Claude's tool loop (yeti.run_chat) and writes
the turn into the thread as it goes: the user's message with the context it was sent with (the page, the plans),
the agent's answer, its cards. Claude reads the thread back as text: a card or a plan card as a one-line record, an
event inside <event> tags. What it is told about a plan is always the hub's own state of it.

Notes are what the agents keep in mind about the user between conversations: corrections and standing preferences,
a sentence each. Claude writes them with the remember tool; the user can read, change and delete them, and they go
into every turn.
"""

from __future__ import annotations

import secrets
import time
from typing import Iterator

import sqlalchemy as sa
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from modellab.hub import auth, db, plans, yeti

router = APIRouter(prefix="/api")

MAX_AGENTS = 8
MAX_NOTES = 40
NOTE_LEN = 300
HISTORY_ROWS = 80          # thread rows replayed to Claude
PAGE = 60                  # thread rows the web app loads at a time

# a make-your-own look, in words (the keys mirror web/src/components/yeti/mascots.ts)
SHAPES = {"pom": "ball", "bean": "bean", "drop": "drop", "gumdrop": "gumdrop", "cub": "bear cub", "frog": "frog",
          "tofu": "cube of tofu", "kitten": "kitten"}
COLOURS = {"ice": "ice-blue", "sky": "sky-blue", "teal": "teal", "mint": "mint-green", "lime": "lime-green", "sun": "yellow",
           "tangerine": "orange", "coral": "coral", "cherry": "red", "cobalt": "cobalt-blue", "snow": "white", "ink": "charcoal"}
EYES = {"bean": "oval black eyes", "round": "round black eyes", "bead": "tiny bead eyes", "googly": "big googly eyes",
        "sparkle": "sparkling eyes", "smile": "smiling, closed eyes"}
GLASSES = {"none": None, "round": "round glasses", "shades": "sunglasses"}
EXTRAS = {"none": None, "headphones": "headphones", "beanie": "a knitted beanie with a pom", "sprout": "a little sprout on top",
          "antenna": "a small antenna", "scarf": "a scarf", "cap": "a graduation cap", "tuft": "a tuft of long fur on top"}
# what a make-your-own agent is made of, in words ({colour} and {shape} are filled in)
MATERIALS = {"plush": "a small {colour} plush {shape} with a short, soft pile",
             "cotton": "a small {colour} {shape} sewn from smooth cotton",
             "boucle": "a small {colour} {shape} in curly, nubby boucle cloth",
             "elastane": "a small {colour} {shape} in sleek stretch fabric with a satin sheen",
             "sugar": "a small {colour} jelly {shape} coated in sparkling sugar",
             "ice": "a small {shape} carved from clear ice with a {colour} tint",
             "glass": "a small {shape} of clear {colour} glass",
             "chrome": "a small {shape} of mirror-polished {colour} chrome",
             "ceramic": "a small {shape} of glossy {colour} glazed ceramic",
             "clay": "a small {shape} modelled in {colour} clay, fingerprints and all"}
DEFAULT_LOOK = {"base": "bloom"}
RETIRED = ("mochi", "bop", "twinkle", "pip", "rime")   # built-in mascots that were removed: a look that names one is Bloom


def clean_look(look) -> dict:
    """A look the web app can draw: the built-in mascot, or a shape, material, colour and eyes (422 otherwise)."""
    if not isinstance(look, dict):
        raise HTTPException(422, "look must be an object")
    base = look.get("base")
    if base in yeti.MASCOTS or base in RETIRED:   # (a tab left open from before may still send a retired one)
        return {"base": base if base in yeti.MASCOTS else "bloom"}
    if base != "fuzzy":
        raise HTTPException(422, f"look.base must be fuzzy or one of {', '.join(yeti.MASCOTS)}")
    out = {"base": "fuzzy"}
    for key, options, default in (("shape", SHAPES, None), ("material", MATERIALS, "plush"), ("colour", COLOURS, None),
                                  ("accent", COLOURS, "ice"), ("eyes", EYES, "bean"), ("glasses", GLASSES, "none"),
                                  ("extra", EXTRAS, "none")):
        v = look.get(key, default)
        if v not in options:
            raise HTTPException(422, f"look.{key} must be one of {', '.join(options)}")
        out[key] = v
    return out


def stored_look(raw) -> dict:
    """An agent's look as it was saved, made drawable today: a retired mascot (or anything unreadable) is Bloom, and a
    make-your-own look from before materials existed is plush."""
    look = db.loads(raw, None)
    try:
        return clean_look(look)
    except HTTPException:
        return dict(DEFAULT_LOOK)


def look_words(look: dict) -> str:
    """What an agent looks like, for its own prompt."""
    if look.get("base") in yeti.MASCOTS:
        return yeti.MASCOTS[look["base"]][1]
    wears = [w for w in (GLASSES.get(look.get("glasses", "none")), EXTRAS.get(look.get("extra", "none"))) if w]
    body = MATERIALS.get(look.get("material", "plush"), MATERIALS["plush"]).format(
        colour=COLOURS.get(look.get("colour"), "green"), shape=SHAPES.get(look.get("shape"), "ball"))
    return f"{body} and {EYES.get(look.get('eyes'), 'oval black eyes')}" + (f", wearing {' and '.join(wears)}" if wears else "")


# ---------------------------------------------------------------- agents

def _agent(c: sa.Connection, user: dict, aid: str) -> dict:
    r = c.execute(sa.select(db.agents).where(db.agents.c.id == aid, db.agents.c.owner_id == user["id"])).mappings().first()
    if r is None:
        raise HTTPException(404, "no such agent")
    d = dict(r)
    d["look"] = stored_look(d["look"])
    return d


def ensure(c: sa.Connection, user: dict, mascot: str | None = None) -> None:
    """Everyone starts with one agent: Bloom."""
    if c.execute(sa.select(db.agents.c.id).where(db.agents.c.owner_id == user["id"]).limit(1)).first():
        return
    base = mascot if mascot in yeti.MASCOTS else "bloom"
    now = time.time()
    c.execute(db.agents.insert().values(id=db.new_id(), owner_id=user["id"], name=yeti.MASCOTS[base][0], look=db.dumps({"base": base}),
                                        role="", position=0, read_upto=now, created=now, updated=now))


def _summary(c: sa.Connection, a: dict) -> dict:
    M = db.agent_messages
    last = c.execute(sa.select(M.c.role, M.c.kind, M.c.text, M.c.created).where(M.c.agent_id == a["id"])
                     .order_by(M.c.created.desc()).limit(1)).mappings().first()
    unread = c.execute(sa.select(sa.func.count()).select_from(M).where(M.c.agent_id == a["id"], M.c.role != "user",
                                                                        M.c.created > (a["read_upto"] or 0))).scalar() or 0
    plan = c.execute(sa.select(db.plans.c.id, db.plans.c.title, db.plans.c.status)
                     .where(db.plans.c.agent_id == a["id"], db.plans.c.status.in_(("running", "waiting")))
                     .order_by(db.plans.c.updated.desc()).limit(1)).mappings().first()
    return {"id": a["id"], "name": a["name"], "look": a["look"], "role": a["role"] or "", "unread": int(unread),
            "last": {"role": last["role"], "kind": last["kind"], "text": (last["text"] or "")[:160], "created": last["created"]} if last else None,
            "plan": dict(plan) if plan else None, "created": a["created"]}


def list_agents(c: sa.Connection, user: dict) -> list[dict]:
    rows = c.execute(sa.select(db.agents).where(db.agents.c.owner_id == user["id"]).order_by(db.agents.c.position, db.agents.c.created)).mappings()
    return [_summary(c, {**dict(r), "look": stored_look(r["look"])}) for r in rows]


def _name(name) -> str:
    n = " ".join(str(name or "").split())
    if not 1 <= len(n) <= 24:
        raise HTTPException(422, "a name has 1 to 24 characters")
    return n


# ---------------------------------------------------------------- the thread

def add(c: sa.Connection, owner_id: str, agent_id: str, role: str, kind: str, text: str, data: dict | None = None,
        created: float | None = None) -> dict:
    row = {"id": db.new_id(), "agent_id": agent_id, "owner_id": owner_id, "role": role, "kind": kind, "text": text,
           "data": db.dumps(data or {}), "created": created or time.time()}
    c.execute(db.agent_messages.insert().values(**row))
    return row


def post_event(c: sa.Connection, owner_id: str, agent_id: str, text: str, data: dict | None = None) -> None:
    """The hub's own report of what happened (a plan retried a step, stopped, finished)."""
    if c.execute(sa.select(db.agents.c.id).where(db.agents.c.id == agent_id, db.agents.c.owner_id == owner_id)).first():
        add(c, owner_id, agent_id, "event", "text", text, data)


def _public(r: dict) -> dict:
    d = db.loads(r["data"], {}) or {}
    out = {"id": r["id"], "role": r["role"], "kind": r["kind"], "text": r["text"] or "", "created": r["created"]}
    for k in ("about", "tools", "model", "usage", "error", "d", "state", "note", "plan"):
        if d.get(k) is not None:
            out[k] = d[k]
    return out


def thread(c: sa.Connection, user: dict, aid: str, before: float | None = None, after: float | None = None, limit: int = PAGE) -> dict:
    a = _agent(c, user, aid)
    plans.advance_open(c, user)
    M = db.agent_messages
    q = sa.select(M).where(M.c.agent_id == aid)
    if before:
        q = q.where(M.c.created < before)
    if after:
        q = q.where(M.c.created > after)
    rows = [dict(r) for r in c.execute(q.order_by(M.c.created.desc()).limit(max(1, min(limit, 200)))).mappings()][::-1]
    msgs = [_public(r) for r in rows]
    pids = {m["plan"] for m in msgs if m.get("plan")}
    shown = {}
    for pid in pids:
        try:
            shown[pid] = plans.public(c, plans._row(c, user, pid))
        except HTTPException:
            pass
    return {"agent": _summary(c, a), "messages": msgs, "plans": shown, "more": len(rows) >= limit and not after,
            "wake": _wants_reply(c, aid) is not None}


def _plan_card(c: sa.Connection, owner_id: str, aid: str, plan: dict) -> str:
    """A plan has one card in the thread. When the plan is changed, its card comes down to where the talk is now."""
    M = db.agent_messages
    for r in c.execute(sa.select(M.c.id, M.c.data).where(M.c.agent_id == aid, M.c.kind == "plan")).mappings():
        if (db.loads(r["data"], {}) or {}).get("plan") == plan["id"]:
            c.execute(M.update().where(M.c.id == r["id"]).values(created=time.time(), text=plan["title"]))
            return r["id"]
    return add(c, owner_id, aid, "agent", "plan", plan["title"], {"plan": plan["id"]})["id"]


def _wants_reply(c: sa.Connection, aid: str) -> dict | None:
    """The newest message, when it is an event that asks for the agent's follow-up (and nothing came after it)."""
    M = db.agent_messages
    r = c.execute(sa.select(M).where(M.c.agent_id == aid).order_by(M.c.created.desc()).limit(1)).mappings().first()
    if r is None or r["role"] != "event" or not (db.loads(r["data"], {}) or {}).get("wants_reply"):
        return None
    return dict(r)


def card_record(text: str, d: dict) -> str:
    """What Claude reads in later turns about a card: what it was and what became of it."""
    s = d.get("state")
    outcome = ("done" if s == "done" else "still waiting for the user's tap, so it has not happened" if s in ("pending", "working")
               else "the user declined it" if s == "declined" else "shown on the page, not carried out" if s == "shown"
               else f"it failed: {d.get('note') or ''}")
    return f"(Card: {text}. Outcome: {outcome}.)"


_safe = plans.safe   # text inside a fence can't close it


def history(c: sa.Connection, aid: str) -> list[dict]:
    """The thread as API messages: text only, oldest first, starting with a user turn."""
    M = db.agent_messages
    rows = [dict(r) for r in c.execute(sa.select(M).where(M.c.agent_id == aid).order_by(M.c.created.desc()).limit(HISTORY_ROWS)).mappings()][::-1]
    out: list[dict] = []
    for r in rows:
        d = db.loads(r["data"], {}) or {}
        text = (r["text"] or "").strip()
        if r["role"] == "user":
            role, content = "user", (f"{d['ctx']}\n\n" if d.get("ctx") else "") + (text or "(empty message)")
        elif r["role"] == "event":
            role, content = "user", (f"{d['ctx']}\n\n" if d.get("ctx") else "") + f"<event>{_safe(text)}</event>"
        elif r["kind"] == "card":
            role, content = "assistant", card_record(text, d)
        elif r["kind"] == "plan":
            role, content = "assistant", f"(Plan card: \"{text}\", plan_id {d.get('plan')}. Its state now is in the <plans> block of the newest message.)"
        elif d.get("error") and not text:
            continue  # a turn that failed before it said anything
        else:
            role, content = "assistant", text
        if not content:
            continue
        if out and out[-1]["role"] == role:
            out[-1]["content"] += "\n\n" + content
        else:
            out.append({"role": role, "content": content})
    while len(out) > 1 and sum(len(m["content"]) for m in out) > yeti.MAX_HISTORY_CHARS:
        out.pop(0)
    while out and out[0]["role"] != "user":
        out.pop(0)
    return out


# ---------------------------------------------------------------- notes

def notes(c: sa.Connection, user: dict) -> list[dict]:
    N = db.agent_notes
    return [dict(r) for r in c.execute(sa.select(N).where(N.c.owner_id == user["id"]).order_by(N.c.created)).mappings()]


def notes_text(c: sa.Connection, user: dict) -> str | None:
    rows = notes(c, user)
    if not rows:
        return None
    return ("# What you keep in mind about this user\n\nNotes saved in earlier conversations (by you, another agent or the user). "
            "Follow them; when the user says one no longer holds, replace it with remember.\n\n"
            + "\n".join(f"- [{r['id']}] {r['text']}" for r in rows))


def remember(c: sa.Connection, user: dict, text: str, by: str, replaces: str | None = None) -> dict:
    t = " ".join(str(text or "").split())[:NOTE_LEN]
    if len(t) < 3:
        raise HTTPException(422, "a note is a sentence")
    N, now = db.agent_notes, time.time()
    if replaces:
        done = c.execute(N.update().where(N.c.id == replaces, N.c.owner_id == user["id"]).values(text=t, by=by, updated=now))
        if done.rowcount:
            return {"id": replaces, "text": t, "by": by}
    same = c.execute(sa.select(N.c.id).where(N.c.owner_id == user["id"], N.c.text == t)).scalar()
    if same:
        return {"id": same, "text": t, "by": by}
    if c.execute(sa.select(sa.func.count()).select_from(N).where(N.c.owner_id == user["id"])).scalar() >= MAX_NOTES:
        raise HTTPException(409, f"there are already {MAX_NOTES} notes: replace one instead of adding another")
    nid = db.new_id()
    c.execute(N.insert().values(id=nid, owner_id=user["id"], text=t, by=by, created=now, updated=now))
    return {"id": nid, "text": t, "by": by}


# ---------------------------------------------------------------- a turn

def _ctx(c: sa.Connection, user: dict, page) -> tuple[str | None, str | None]:
    """(the context blocks a turn is sent with, the page note alone)."""
    note = yeti.page_note(c, user, page)
    state = plans.state_text(c, user)
    blocks = ([f"<page>{_safe(note)}</page>"] if note else []) + ([f"<plans>\n{state}\n</plans>"] if state else [])
    return "\n".join(blocks) or None, note


def run_turn(engine: sa.Engine, cfg, user: dict, aid: str, st: dict, *, text: str | None = None, page=None,
             about: str | None = None, wake: bool = False, retry: bool = False) -> Iterator[dict]:
    """One turn, written into the thread as it goes. Yields the events for the browser."""
    M = db.agent_messages
    with engine.begin() as c:
        agent = _agent(c, user, aid)
        plans.advance_open(c, user)
        ctx, note = _ctx(c, user, page)
        if wake:
            ev = _wants_reply(c, aid)
            if ev is None:
                yield {"type": "idle"}
                return
            d = {**(db.loads(ev["data"], {}) or {}), "wants_reply": False, "ctx": ctx}
            claimed = c.execute(M.update().where(M.c.id == ev["id"], M.c.data == ev["data"]).values(data=db.dumps(d)))
            if claimed.rowcount != 1:  # another tab took it
                yield {"type": "idle"}
                return
            user_mid = ev["id"]
        elif retry:
            last = c.execute(sa.select(M).where(M.c.agent_id == aid).order_by(M.c.created.desc()).limit(1)).mappings().first()
            if last is not None and last["role"] == "agent" and (db.loads(last["data"], {}) or {}).get("error"):
                c.execute(M.delete().where(M.c.id == last["id"]))
            user_mid = None
        else:
            user_mid = add(c, user["id"], aid, "user", "text", (text or "").strip(), {"ctx": ctx, "about": about})["id"]
        msgs = history(c, aid)
        system = yeti.system_blocks(agent["name"], look_words(agent["look"]), agent["look"].get("base"), agent["role"], notes_text(c, user))
    if not msgs:
        yield {"type": "error", "code": "empty", "message": "There is nothing to answer yet."}
        return
    turn, t0 = secrets.token_hex(4), time.time()
    said: list[str] = []
    tools: dict[str, dict] = {}
    meta: dict = {}
    error = None
    client = yeti.make_client(st["api_key"])
    try:
        yield {"type": "start", "turn": turn, "note": note, "mid": user_mid, "model": st["model"],
               "model_label": yeti.MODELS[st["model"]]["label"]}
        for ev in yeti.run_chat(client, engine, user, st["model"], st["effort"], msgs, system=system, agent=agent):
            t = ev["type"]
            if t == "text":
                said.append(ev["text"])
            elif t == "rewind":
                joined = "".join(said)
                said = [joined[: max(0, len(joined) - ev["chars"])]]
            elif t == "tool":
                tools[ev["id"]] = {"id": ev["id"], "label": ev["label"], "done": False}
            elif t == "tool_done" and ev["id"] in tools:
                tools[ev["id"]].update(label=ev["label"], href=ev.get("href"), ok=ev["ok"], done=True)
            elif t == "action":  # a card: kept in the thread with what becomes of it
                d = ev["decision"]
                with engine.begin() as c:
                    ev = {**ev, "mid": add(c, user["id"], aid, "agent", "card", yeti.action_text(d),
                                           {"d": d, "state": "pending" if d.get("needs") != "none" else "working"})["id"]}
            elif t == "plan":
                with engine.begin() as c:
                    ev = {**ev, "mid": _plan_card(c, user["id"], aid, ev["plan"])}
            elif t == "done":
                said = [ev["text"]]
                meta = {"model": ev.get("model_label"), "usage": ev.get("usage")}
            elif t == "error":
                error = {"code": ev["code"], "message": ev["message"]}
            yield ev
    except Exception as e:  # noqa: BLE001 - every failure becomes a readable event
        code, msg = yeti._api_error(e)
        error = {"code": code, "message": msg}
        yield {"type": "error", "code": code, "message": msg}
    finally:
        client.close()
        body = "".join(said).strip()
        if body or tools or error:
            with engine.begin() as c:  # (created at the turn's start: the answer sits before the cards it led to)
                add(c, user["id"], aid, "agent", "text", body, {"tools": list(tools.values()) or None, "error": error, **meta}, created=t0)


# ---------------------------------------------------------------- API

def _engine(request: Request) -> sa.Engine:
    return request.app.state.engine


class AgentIn(BaseModel):
    name: str | None = None
    look: dict | None = None
    role: str | None = Field(None, max_length=600)


@router.get("/agents")
def get_agents(request: Request, mascot: str | None = None, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        ensure(c, user, mascot)
        return list_agents(c, user)


@router.post("/agents")
def post_agent(body: AgentIn, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        ensure(c, user)
        n = c.execute(sa.select(sa.func.count()).select_from(db.agents).where(db.agents.c.owner_id == user["id"])).scalar()
        if n >= MAX_AGENTS:
            raise HTTPException(409, f"a team has at most {MAX_AGENTS} agents")
        aid, now = db.new_id(), time.time()
        c.execute(db.agents.insert().values(id=aid, owner_id=user["id"], name=_name(body.name), look=db.dumps(clean_look(body.look or DEFAULT_LOOK)),
                                            role=(body.role or "").strip(), position=n, read_upto=now, created=now, updated=now))
        return _summary(c, _agent(c, user, aid))


@router.patch("/agents/{aid}")
def patch_agent(aid: str, body: AgentIn, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        _agent(c, user, aid)
        vals: dict = {"updated": time.time()}
        if body.name is not None:
            vals["name"] = _name(body.name)
        if body.look is not None:
            vals["look"] = db.dumps(clean_look(body.look))
        if body.role is not None:
            vals["role"] = body.role.strip()
        c.execute(db.agents.update().where(db.agents.c.id == aid).values(**vals))
        return _summary(c, _agent(c, user, aid))


@router.delete("/agents/{aid}")
def delete_agent(aid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        _agent(c, user, aid)
        if c.execute(sa.select(sa.func.count()).select_from(db.agents).where(db.agents.c.owner_id == user["id"])).scalar() <= 1:
            raise HTTPException(409, "the last agent stays: change its name or look instead")
        if c.execute(sa.select(db.plans.c.id).where(db.plans.c.agent_id == aid, db.plans.c.status.in_(("running", "waiting"))).limit(1)).first():
            raise HTTPException(409, "this agent has a plan under way: stop the plan first")
        c.execute(db.agent_messages.delete().where(db.agent_messages.c.agent_id == aid))
        c.execute(db.agents.delete().where(db.agents.c.id == aid))
    return {"result": "deleted"}


@router.get("/agents/{aid}/messages")
def get_messages(aid: str, request: Request, before: float | None = None, after: float | None = None, limit: int = PAGE,
                 user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return thread(c, user, aid, before, after, limit)


@router.delete("/agents/{aid}/messages")
def clear_messages(aid: str, request: Request, user: dict = Depends(auth.current_user)):
    """A fresh thread. Plans and notes stay: they aren't the conversation."""
    with _engine(request).begin() as c:
        _agent(c, user, aid)
        c.execute(db.agent_messages.delete().where(db.agent_messages.c.agent_id == aid))
    return {"result": "cleared"}


@router.post("/agents/{aid}/read")
def mark_read(aid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        _agent(c, user, aid)
        c.execute(db.agents.update().where(db.agents.c.id == aid).values(read_upto=time.time()))
    return {"result": "read"}


class SendIn(BaseModel):
    text: str = Field("", max_length=40_000)
    page: dict | None = None
    about: str | None = Field(None, max_length=200)
    retry: bool = False


def _stream(request: Request, user: dict, aid: str, **kw) -> StreamingResponse:
    engine, cfg = request.app.state.engine, request.app.state.cfg
    with engine.begin() as c:
        _agent(c, user, aid)
        st = yeti.load(c, user["id"], cfg)
    if not st["api_key"]:
        raise HTTPException(409, st["key_error"] or "Connect Claude first: open the assistant's settings and paste an API key.")

    def gen():
        for ev in run_turn(engine, cfg, user, aid, st, **kw):
            yield yeti.sse(ev)

    return StreamingResponse(gen(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@router.post("/agents/{aid}/messages")
def post_message(aid: str, body: SendIn, request: Request, user: dict = Depends(auth.current_user)):
    if not body.retry and not body.text.strip():
        raise HTTPException(422, "say something")
    return _stream(request, user, aid, text=body.text, page=body.page, about=body.about, retry=body.retry)


class WakeIn(BaseModel):
    page: dict | None = None


@router.post("/agents/{aid}/wake")
def post_wake(aid: str, body: WakeIn, request: Request, user: dict = Depends(auth.current_user)):
    """The agent's follow-up to something the hub reported while nobody was looking (a plan finished or got stuck)."""
    return _stream(request, user, aid, page=body.page, wake=True)


class RecordIn(BaseModel):
    text: str = Field(max_length=2000)
    about: str | None = Field(None, max_length=200)
    reply: str | None = Field(None, max_length=2000)   # a plain answer (no card)
    card: dict | None = None                           # {"d": the decision, "state", "note"}


@router.post("/agents/{aid}/record")
def post_record(aid: str, body: RecordIn, request: Request, user: dict = Depends(auth.current_user)):
    """A one-sentence action the decision model handled (no Claude): kept in the thread like any other turn."""
    if body.card is not None and len(db.dumps(body.card) or "") > 8000:
        raise HTTPException(413, "that card is too large")
    with _engine(request).begin() as c:
        _agent(c, user, aid)
        now = time.time()
        u = add(c, user["id"], aid, "user", "text", body.text.strip(), {"about": body.about}, created=now)
        out = {"user": u["id"], "agent": None}
        if body.card and isinstance(body.card.get("d"), dict):
            d = body.card["d"]
            state = body.card.get("state") if body.card.get("state") in ("shown", "pending", "working", "done", "declined", "failed") else "pending"
            out["agent"] = add(c, user["id"], aid, "agent", "card", yeti.action_text(d),
                               {"d": d, "state": state, "note": str(body.card.get("note") or "")[:500] or None}, created=now + 0.001)["id"]
        elif body.reply:
            out["agent"] = add(c, user["id"], aid, "agent", "text", body.reply.strip(), {}, created=now + 0.001)["id"]
        return out


class CardIn(BaseModel):
    state: str
    note: str | None = Field(None, max_length=500)


@router.post("/agents/{aid}/cards/{mid}")
def post_card(aid: str, mid: str, body: CardIn, request: Request, user: dict = Depends(auth.current_user)):
    """What became of a card (the web app carries the action out, then says so here)."""
    if body.state not in ("pending", "working", "done", "declined", "failed", "shown"):
        raise HTTPException(422, "bad state")
    M = db.agent_messages
    with _engine(request).begin() as c:
        _agent(c, user, aid)
        r = c.execute(sa.select(M).where(M.c.id == mid, M.c.agent_id == aid, M.c.kind == "card")).mappings().first()
        if r is None:
            raise HTTPException(404, "no such card")
        d = {**(db.loads(r["data"], {}) or {}), "state": body.state, "note": body.note}
        c.execute(M.update().where(M.c.id == mid).values(data=db.dumps(d)))
    return {"result": "saved"}


class NoteIn(BaseModel):
    text: str = Field(max_length=NOTE_LEN)


@router.get("/agent-notes")
def get_notes(request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return notes(c, user)


@router.post("/agent-notes")
def post_note(body: NoteIn, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return remember(c, user, body.text, "you")


@router.patch("/agent-notes/{nid}")
def patch_note(nid: str, body: NoteIn, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        if not c.execute(sa.select(db.agent_notes.c.id).where(db.agent_notes.c.id == nid, db.agent_notes.c.owner_id == user["id"])).first():
            raise HTTPException(404, "no such note")
        return remember(c, user, body.text, "you", replaces=nid)


@router.delete("/agent-notes/{nid}")
def delete_note(nid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        c.execute(db.agent_notes.delete().where(db.agent_notes.c.id == nid, db.agent_notes.c.owner_id == user["id"]))
    return {"result": "deleted"}
