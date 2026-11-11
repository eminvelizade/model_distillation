"""System 1 in the hub: one sentence from the web app → one decision.

    GET    /api/actions                    the action registry, for ⌘K and the web app's targets
    PUT    /api/assistant/system1          save the user's OpenRouter key (encrypted, like the Claude key)
    DELETE /api/assistant/system1/key
    POST   /api/assistant/decide           {sentence, page} → a decision the web app carries out, or a hand-over
    POST   /api/assistant/actions/{id}     what became of a decision: approved, declined, done or failed
    GET    /api/assistant/actions          the user's recent decisions (the action log)

The web app says which page the user is on and which rows it shows; every name, status and number the model reads
is looked up here, from the hub's own data. The decision names an action and its values and is never carried out
by the hub: the web app does that, through the same API its buttons call, after whatever approval the action's tier
needs.
"""

from __future__ import annotations

import hashlib
import re
import time

import sqlalchemy as sa
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from modellab import catalog
from modellab.hub import auth, db, model, search

from . import actions as A
from . import questions
from .providers import OpenRouter
from .route import Decision, route

# The decision model and its gate, chosen by the evaluation in docs/SYSTEM1_EVAL.md. A new model or version reruns
# the evaluation before this changes.
MODEL = "liquid/d1-ultra-20261015"
GATE = {"threshold": 0.7, "max_several": 0.5}
MAX_SENTENCE = 300  # longer than this is not a one-action request: it goes to Claude
NEEDS = {"look": "none", "draft": "none", "act": "tap", "careful": "confirm"}
LABELS = {"batch_size": "Batch size", "epochs": "Epochs", "image_size": "Image size", "lr": "Learning rate",
          "speed_budget_ms": "Speed budget", "gpu_hours": "GPU-hour cap", "machine": "Machine", "dataset": "Dataset",
          "model": "Model", "page": "Page", "run": "Run", "run_b": "Compared with", "search": "Search"}
UNITS = {"image_size": " px", "speed_budget_ms": " ms", "gpu_hours": " h"}
ID_RE = re.compile(r"^[A-Za-z0-9_.:/-]{1,100}$")
router = APIRouter(prefix="/api")
_clients: dict[str, OpenRouter] = {}


def make_provider(key: str) -> OpenRouter:
    """A warm OpenRouter client per key: the connection is kept open between sentences (tests replace this)."""
    h = hashlib.sha256(key.encode()).hexdigest()
    if h not in _clients:
        if len(_clients) >= 8:
            _clients.pop(next(iter(_clients))).close()
        _clients[h] = OpenRouter(key, timeout=8.0, retries=0, provider={"data_collection": "deny"})
    return _clients[h]


# ---------------------------------------------------------------- the user's OpenRouter key

def _fernet(c, cfg):
    from modellab.hub import yeti

    return yeti._fernet(c, cfg)


def load_key(c: sa.Connection, uid: str, cfg) -> dict:
    from cryptography.fernet import InvalidToken

    row = c.execute(sa.select(db.system1).where(db.system1.c.user_id == uid)).mappings().first()
    out = {"api_key": None, "key_hint": None, "key_error": None}
    if row and row["api_key"]:
        try:
            out.update(api_key=_fernet(c, cfg).decrypt(row["api_key"].encode()).decode(), key_hint=row["key_hint"])
        except (InvalidToken, ValueError):
            out["key_error"] = "the saved OpenRouter key can't be decrypted (MODELLAB_SECRET_KEY changed?): paste it again"
    return out


def settings_view(c: sa.Connection, uid: str, cfg) -> dict:
    st = load_key(c, uid, cfg)
    return {"connected": bool(st["api_key"]), "key_hint": st["key_hint"], "key_error": st["key_error"],
            "model": MODEL.rsplit("-", 1)[0]}


def _save_key(c: sa.Connection, uid: str, cfg, key: str | None) -> None:
    db.upsert(c, db.system1, {"user_id": uid, "api_key": _fernet(c, cfg).encrypt(key.encode()).decode() if key else None,
                              "key_hint": ("…" + key[-4:]) if key else None, "updated": time.time()}, ["user_id"])


class KeyIn(BaseModel):
    api_key: str = Field(max_length=400)


def _full_settings(request: Request, user: dict) -> dict:
    from modellab.hub import yeti

    with request.app.state.engine.begin() as c:
        return yeti.settings_view(c, user, request.app.state.cfg, yeti._public_url(request))


@router.put("/assistant/system1")
def put_key(body: KeyIn, request: Request, user: dict = Depends(auth.current_user)):
    key = body.api_key.strip()
    if not 20 <= len(key) <= 400 or any(ch.isspace() for ch in key):
        raise HTTPException(422, "that doesn't look like an OpenRouter key (openrouter.ai → Keys)")
    err = make_provider(key).check()
    if err:
        _clients.pop(hashlib.sha256(key.encode()).hexdigest(), None)
        raise HTTPException(422, err)
    with request.app.state.engine.begin() as c:
        _save_key(c, user["id"], request.app.state.cfg, key)
    return _full_settings(request, user)


@router.delete("/assistant/system1/key")
def forget_key(request: Request, user: dict = Depends(auth.current_user)):
    with request.app.state.engine.begin() as c:
        _save_key(c, user["id"], request.app.state.cfg, None)
    return _full_settings(request, user)


# ---------------------------------------------------------------- the registry, for the web app

@router.get("/actions")
def list_actions(user: dict = Depends(auth.current_user)):
    return {"actions": [{"id": a.id, "title": a.title, "description": a.description, "tier": a.tier,
                         "pages": list(a.pages), "needs": NEEDS[a.tier],
                         "params": [{"name": p.name, "kind": p.kind, "required": p.required} for p in a.params]}
                        for a in A.ACTIONS],
            "pages": A.PAGES}


# ---------------------------------------------------------------- what is on screen, from the hub's own data

def _machine_row(m: dict) -> dict:
    gpus = ", ".join(f"{g.get('name', 'GPU')} {round(g['memory_gb'])} GB" if g.get("memory_gb") else g.get("name", "GPU")
                     for g in m.get("gpus") or [])
    return {"id": m["id"], "name": m["name"], "status": "online" if m.get("online") else "offline", "gpu": gpus or None}


def _run_row(s: dict) -> dict:
    status = {"done": "finished"}.get(s["status"], s["status"])
    if s["status"] == "failed" and s.get("error_tail"):
        last = [ln.strip() for ln in s["error_tail"].splitlines() if ln.strip()]
        if last:
            status += ": " + last[-1][:90]
    detail = [f"mAP {100 * s['best']['map']:.1f}"] if s.get("best") else []
    if s.get("machine_name"):
        detail.append(f"on {s['machine_name']}")
    return {"id": s["id"], "name": s["name"], "status": status, "detail": ", ".join(detail) or None,
            "current": {"machine": s.get("machine_id")}}


def _dataset_row(d: dict) -> dict:
    bits = []
    if d.get("classes"):
        bits.append(f"{len(d['classes'])} classes")
    n = sum((d.get(k) or {}).get("images", 0) for k in ("train", "valid", "test"))
    if n:
        bits.append(f"{n} images")
    chk = d.get("check") or {}
    if chk.get("errors"):
        bits.append(f"{len(chk['errors'])} errors")
    elif chk.get("warnings"):
        bits.append(f"{len(chk['warnings'])} warning: {chk['warnings'][0][:60]}")
    if d.get("error"):
        bits.append("missing")
    return {"id": d["name"], "name": d["name"], "detail": ", ".join(bits) or None}


def _search_row(s: dict) -> dict:
    status = {"done": "finished"}.get(s["status"], s["status"])
    rec = s.get("recommendation")
    if rec:
        status += f", recommends {rec.get('model')} at {rec.get('image_size')} px"
    elif s["status"] == "running" and s.get("phase"):
        status += f", phase {s['phase']}"
    return {"id": s["id"], "name": s["name"], "status": status}


def _ids(page: dict, key: str, limit: int = 30) -> list[str]:
    v = page.get(key)
    return [x for x in v[:limit] if isinstance(x, str) and ID_RE.match(x)] if isinstance(v, list) else []


def _runs(c, user, ids: list[str]) -> list[dict]:
    out = []
    for rid in dict.fromkeys(ids):
        try:
            out.append(_run_row(model.run_summary(c, model.get_run(c, user, rid))))
        except HTTPException:
            pass  # not this user's run: it is not on their screen
    return out


def _form(page: dict, models: dict, machines: list[dict], datasets: list[dict]) -> tuple[dict, dict]:
    """(what the model reads, the current values by id) from the form values the page reports; only values that
    are a number or a known id are kept."""
    raw = page.get("form") if isinstance(page.get("form"), dict) else {}
    shown, cur = {}, {}
    for k in ("epochs", "batch_size", "image_size", "lr", "speed_budget_ms", "gpu_hours"):
        v = raw.get(k)
        if isinstance(v, (int, float)) and not isinstance(v, bool):
            shown[k] = v
            cur[k] = f"{v:g}"
    known = {"model": models, "machine": {m["id"]: m["name"] for m in machines},
             "dataset": {d["id"]: d["name"] for d in datasets}}
    for k, names in known.items():
        v = raw.get(k)
        if isinstance(v, str) and v in names:
            shown[k], cur[k] = names[v], v
    return shown, cur


def screen_for(c: sa.Connection, user: dict, cfg, page: dict | None) -> dict:
    page = page if isinstance(page, dict) else {}
    kind = page.get("kind") if page.get("kind") in A.PAGES or page.get("kind") in ("run", "search", "machine") else "other"
    ident = page.get("id") if isinstance(page.get("id"), str) and ID_RE.match(page["id"]) else None
    all_machines = model.list_machines(c, user, cfg)
    machines = [_machine_row(m) for m in all_machines]
    scr: dict = {"page": kind, "title": A.PAGES.get(kind, "ModelLab").split(":")[0]}

    def datasets_of(mid: str | None) -> list[dict]:
        try:
            return [_dataset_row(d) for d in model.machine_datasets(model.get_machine(c, user, mid))] if mid else []
        except HTTPException:
            return []

    selected = page.get("machine") if isinstance(page.get("machine"), str) else None
    if kind == "run" and ident:
        try:
            row = _run_row(model.run_summary(c, model.get_run(c, user, ident)))
        except HTTPException:
            return scr | {"page": "other"}
        scr.update(title=f'Run "{row["name"]}": {row["status"]}' + (f', {row["detail"]}' if row["detail"] else ""),
                   subject={"kind": "run", "id": ident}, runs=[row], machines=machines)
    elif kind == "queue":
        ids = _ids(page, "rows") or [r["id"] for r in model.list_runs(c, user, limit=12)]
        scr.update(runs=_runs(c, user, ids), machines=machines)
    elif kind == "leaderboard":
        ids = _ids(page, "rows")
        if not ids:
            rows = sorted((r for r in model.results(c, user) if r["map"] is not None), key=lambda r: -r["map"])
            ids = list(dict.fromkeys(r["run_id"] for r in rows))[:10]
        scr.update(runs=_runs(c, user, ids), machines=machines, title="Leaderboard, in the order shown")
    elif kind == "compare":
        scr.update(runs=_runs(c, user, [x.split(":")[0] for x in _ids(page, "items", 4)]))
    elif kind in ("new", "searches"):
        models = {d.id: d.label for d in catalog.DETECTORS.values() if not getattr(d, "hidden", False)}
        ds = datasets_of(selected)
        shown, cur = _form(page, models, machines, ds)
        scr.update(machines=machines, datasets=ds, models=models, form=shown or None, current=cur)
        if kind == "searches":
            scr["searches"] = [_search_row(s) for s in search.list_searches(c, user)[:10]]
    elif kind == "search" and ident:
        try:
            s = search.get(c, user, ident)
        except HTTPException:
            return scr | {"page": "other"}
        row = _search_row(s)
        rec = s.get("recommendation")
        runs = _runs(c, user, [rec["best_run_id"]]) if rec and rec.get("best_run_id") else []
        for r in runs:
            r["detail"] = "the recommended model" + (f", {r['detail']}" if r["detail"] else "")
        scr.update(title=f'Search "{row["name"]}": {row["status"]}', subject={"kind": "search", "id": ident},
                   searches=[row], runs=runs)
    elif kind == "machines":
        scr.update(machines=machines)
    elif kind == "machine" and ident:
        m = next((x for x in machines if x["id"] == ident), None)
        if m is None:
            return scr | {"page": "other"}
        scr.update(title=f'Machine "{m["name"]}": {m["gpu"] or "no GPU reported"}, {m["status"]}',
                   subject={"kind": "machine", "id": ident}, machines=[m], datasets=datasets_of(ident))
    return {k: v for k, v in scr.items() if v not in (None, [], {})}


# ---------------------------------------------------------------- one sentence → one decision

def _name(screen: dict, kind: str, ident: str) -> str:
    rows = screen.get(questions.PLURAL[kind]) or []
    return next((r["name"] for r in rows if r["id"] == ident), ident)


def describe(d: Decision, screen: dict) -> dict:
    """The decision in words the web app can show: the action, what it is about, and what it changes."""
    act = A.BY_ID[d.action]
    # what the action is about: the entity its page or row belongs to, else the thing it opens or checks
    about = [act.subject] if act.subject in d.values else []
    about += [n for n in ("dataset", "run", "search", "page", "machine") if n in d.values]
    about = about[0] if about and not (about[0] == "machine" and act.id not in ("nav.open_machine", "machine.selfcheck",
                                                                              "weights.fetch", "dataset.fill_add")) else None
    if act.id in ("experiment.fill", "search.fill"):
        about = None  # a form: everything it sets is a change
    target, changes = None, []
    for p in act.params:
        if p.name not in d.values:
            continue
        v = d.values[p.name]
        if p.kind in questions.ENTITY_KINDS:
            shown = _name(screen, p.kind, v)
        elif p.kind == "page":
            shown = A.PAGES[v].split(":")[0]
        elif p.kind == "model":
            shown = (screen.get("models") or questions.MODELS).get(v, v)
        else:
            shown = f"{v}{UNITS.get(p.name, '')}"
        if p.name == about:
            target = shown
        else:
            changes.append({"name": p.name, "label": LABELS.get(p.name, p.name), "value": shown})
    return {"title": act.title, "target": target, "changes": changes}


def enrich(c: sa.Connection, user: dict, d: Decision, screen: dict) -> tuple[dict, str | None]:
    """What the web app needs beyond the picks to call the button's API, or why the action can't be carried out."""
    v = d.values
    subject = screen.get("subject") or {}
    if A.BY_ID[d.action].subject == "machine" and "machine" not in v and subject.get("kind") == "machine":
        base = {"machine": subject["id"]}  # the machine whose page this is
    else:
        base = {}
    if d.action == "results.compare":
        items = []
        for rid in (v.get("run"), v.get("run_b")):
            best = model.run_summary(c, model.get_run(c, user, rid)).get("best")
            if not best:
                return {}, f"{_name(screen, 'run', rid)} has no result to compare yet"
            items.append(f"{rid}:{best['stage']}")
        return {"items": items}, None
    if d.action == "run.export":
        stages = [s for s in model._stage_rows(c, v["run"]) if s["type"] == "finetune" and s["status"] == "done"]
        if not stages:
            return {}, f"{_name(screen, 'run', v['run'])} has no finished fine-tune stage to export"
        return {"stage": stages[-1]["name"]}, None
    if d.action == "weights.fetch":
        mid = v.get("machine") or base.get("machine")
        if not mid:
            return {}, "which machine?"
        missing = [k for k, w in model.machine_weights(model.get_machine(c, user, mid)).items() if not w.get("present")]
        if not missing:
            return {}, "every weight file is already on this machine"
        return base | {"ids": missing}, None
    return base, None


class DecideIn(BaseModel):
    sentence: str = Field(min_length=1, max_length=8000)
    page: dict | None = None


def _log(c, uid: str, body: DecideIn, kind: str, out: dict, ms: float) -> str:
    lid = db.new_id()
    c.execute(db.agent_log.insert().values(
        id=lid, user_id=uid, created=time.time(), sentence=body.sentence[:1000], page_kind=kind, model=MODEL,
        fast=bool(out.get("fast")), action=out.get("action"), tier=out.get("tier"), intent=out.get("intent"),
        values_json=db.dumps(out.get("values")), confidence=out.get("confidence"), reason=out.get("reason"), ms=ms))
    return lid


@router.post("/assistant/decide")
def decide(body: DecideIn, request: Request, user: dict = Depends(auth.current_user)):
    engine, cfg = request.app.state.engine, request.app.state.cfg
    sentence = body.sentence.strip()
    with engine.begin() as c:
        key = load_key(c, user["id"], cfg)["api_key"]
        if not key or len(sentence) > MAX_SENTENCE:
            return {"fast": False, "reason": "no OpenRouter key" if not key else "too long for one action"}
        screen = screen_for(c, user, cfg, body.page)
    state, q = questions.build(sentence, screen)
    t0 = time.perf_counter()
    res = make_provider(key).decide(MODEL, state, q)
    ms = round(1000 * (time.perf_counter() - t0))
    if res.error:
        out = {"fast": False, "reason": "the decision model didn't answer", "error": res.error[:200]}
    else:
        d = route(res.answers, screen, sentence=sentence, **GATE)
        out = {"fast": d.fast, "action": d.action, "intent": d.intent, "values": d.values, "reason": d.reason or None,
               "confidence": None if d.confidence is None else round(d.confidence, 3)}
        if d.action in A.BY_ID:
            act = A.BY_ID[d.action]
            out.update(tier=act.tier, needs=NEEDS[act.tier], show=d.intent == "show", **describe(d, screen))
            if d.fast and d.intent != "show":
                with engine.begin() as c:
                    extra, problem = enrich(c, user, d, screen)
                out["extra"] = extra
                if problem:
                    out.update(fast=False, reason=problem, tell=problem)
    out["ms"] = ms
    with engine.begin() as c:
        out["id"] = _log(c, user["id"], body, screen["page"], out, ms)
    return out


class OutcomeIn(BaseModel):
    outcome: str = Field(pattern="^(approved|declined|done|failed)$")
    note: str | None = Field(None, max_length=300)


@router.post("/assistant/actions/{lid}")
def outcome(lid: str, body: OutcomeIn, request: Request, user: dict = Depends(auth.current_user)):
    with request.app.state.engine.begin() as c:
        n = c.execute(db.agent_log.update().where(db.agent_log.c.id == lid, db.agent_log.c.user_id == user["id"])
                      .values(outcome=body.outcome, outcome_note=body.note, outcome_time=time.time())).rowcount
    if not n:
        raise HTTPException(404, "no such action")
    return {"result": body.outcome}


@router.get("/assistant/actions")
def recent(request: Request, limit: int = 30, user: dict = Depends(auth.current_user)):
    with request.app.state.engine.begin() as c:
        rows = c.execute(sa.select(db.agent_log).where(db.agent_log.c.user_id == user["id"])
                         .order_by(db.agent_log.c.created.desc()).limit(max(1, min(limit, 200)))).mappings().all()
    return {"actions": [{**{k: r[k] for k in ("id", "created", "sentence", "page_kind", "model", "fast", "action", "tier",
                                              "intent", "confidence", "reason", "ms", "outcome", "outcome_note")},
                         "values": db.loads(r["values_json"], {})} for r in rows]}
