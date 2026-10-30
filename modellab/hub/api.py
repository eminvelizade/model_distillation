"""Hub user API (/api/...): the local app's endpoints, scoped to the logged-in user and a machine, plus accounts,
machines and releases. The UI (modellab/web) talks to this or to the local server with the same calls.
"""

from __future__ import annotations

import asyncio
import base64
import hmac
import json
import re
import time

import sqlalchemy as sa
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from modellab import recipe
from modellab.hub import auth, db, model

router = APIRouter(prefix="/api")
ANSI = re.compile(r"\x1b\[[0-9;?]*[A-Za-z]")


def _engine(request: Request) -> sa.Engine:
    return request.app.state.engine


def _cfg(request: Request):
    return request.app.state.cfg


def public_url(request: Request) -> str:
    cfg = _cfg(request)
    return cfg.public_url or str(request.base_url).rstrip("/")


# ---------------------------------------------------------------- auth

class LoginIn(BaseModel):
    username: str
    password: str


@router.post("/auth/login")
def login(body: LoginIn, request: Request, response: Response):
    cfg = _cfg(request)
    username = body.username.strip().lower()[:64]
    ip = auth.client_ip(request)
    wait = max(auth.LOGIN_USER.blocked(username), auth.LOGIN_IP.blocked(ip))
    if wait:
        raise HTTPException(429, f"too many failed logins, try again in {int(wait // 60) + 1} min")
    with _engine(request).begin() as c:
        u = c.execute(sa.select(db.users).where(db.users.c.username == username)).mappings().first()
        if u is None:
            auth.burn_time(body.password)
        ok = u is not None and auth.verify_password(body.password, u["password_hash"]) and not u["disabled"]
        if not ok:
            auth.LOGIN_USER.fail(username)
            auth.LOGIN_IP.fail(ip)
            raise HTTPException(401, "wrong username or password")
        auth.LOGIN_USER.reset(username)
        token = auth.create_session(c, u["id"], request, cfg.session_days)
        c.execute(db.users.update().where(db.users.c.id == u["id"]).values(last_login=time.time()))
    response.set_cookie(auth.COOKIE, token, max_age=int(cfg.session_days * 86400), httponly=True,
                        secure=cfg.secure_cookies, samesite="lax", path="/")
    return {"user": auth.public_user(u)}


@router.post("/auth/logout")
def logout(request: Request, response: Response):
    tok = request.cookies.get(auth.COOKIE)
    if tok:
        with _engine(request).begin() as c:
            c.execute(db.sessions.delete().where(db.sessions.c.token_hash == auth.token_hash(tok)))
    response.delete_cookie(auth.COOKIE, path="/")
    return {"result": "logged out"}


@router.get("/auth/me")
def me(request: Request):
    """Never 401: the UI asks this first to learn the mode and whether to show the login page."""
    with _engine(request).begin() as c:
        user = auth.session_user(c, request.cookies.get(auth.COOKIE))
    return {"mode": "hub", "user": auth.public_user(user) if user else None, "public_url": public_url(request)}


class PasswordIn(BaseModel):
    current: str
    new: str


@router.post("/auth/password")
def change_password(body: PasswordIn, request: Request, user: dict = Depends(auth.current_user)):
    if not auth.verify_password(body.current, user["password_hash"]):
        raise HTTPException(403, "current password is wrong")
    auth.check_password_rules(body.new)
    if body.new == body.current:
        raise HTTPException(422, "the new password must differ from the current one")
    with _engine(request).begin() as c:
        c.execute(db.users.update().where(db.users.c.id == user["id"])
                  .values(password_hash=auth.hash_password(body.new), must_change_password=False))
        model.revoke_sessions(c, user["id"], keep_token=request.cookies.get(auth.COOKIE))
    return {"result": "password changed"}


# ---------------------------------------------------------------- users (admins)

class UserIn(BaseModel):
    username: str
    display_name: str = ""
    password: str | None = None
    is_admin: bool = False


class UserPatch(BaseModel):
    display_name: str | None = None
    is_admin: bool | None = None
    disabled: bool | None = None


@router.get("/users")
def users(request: Request, admin: dict = Depends(auth.require_admin)):
    with _engine(request).begin() as c:
        return model.list_users(c)


@router.post("/users")
def add_user(body: UserIn, request: Request, admin: dict = Depends(auth.require_admin)):
    pw = body.password or auth.temp_password()
    with _engine(request).begin() as c:
        u = model.create_user(c, body.username, pw, body.display_name, body.is_admin, must_change=True)
    return {"user": auth.public_user(u), "password": None if body.password else pw}


@router.patch("/users/{uid}")
def patch_user(uid: str, body: UserPatch, request: Request, admin: dict = Depends(auth.require_admin)):
    vals = {k: v for k, v in body.model_dump().items() if v is not None}
    if uid == admin["id"] and (vals.get("disabled") or vals.get("is_admin") is False):
        raise HTTPException(409, "you cannot disable or demote yourself")
    if "display_name" in vals:
        vals["display_name"] = vals["display_name"].strip()[:128]
    with _engine(request).begin() as c:
        model.get_user(c, uid)
        if vals:
            c.execute(db.users.update().where(db.users.c.id == uid).values(**vals))
        if vals.get("disabled"):
            model.revoke_sessions(c, uid)
        return auth.public_user(model.get_user(c, uid)) | {"disabled": bool(model.get_user(c, uid)["disabled"])}


@router.post("/users/{uid}/reset-password")
def reset_password(uid: str, request: Request, admin: dict = Depends(auth.require_admin)):
    pw = auth.temp_password()
    with _engine(request).begin() as c:
        model.get_user(c, uid)
        c.execute(db.users.update().where(db.users.c.id == uid)
                  .values(password_hash=auth.hash_password(pw), must_change_password=True))
        model.revoke_sessions(c, uid)
    return {"password": pw}


# ---------------------------------------------------------------- machines

class PairIn(BaseModel):
    name: str


@router.get("/machines")
def machines(request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return model.list_machines(c, user, _cfg(request))


@router.post("/machines/pair")
def pair(body: PairIn, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        p = model.create_pairing(c, user, body.name, _cfg(request))
    url = public_url(request)
    return {**p, "command": f"curl -fsSL {url}/install.sh | bash -s -- --pair {p['code']}", "hub_url": url}


@router.get("/machines/pairing/{pairing_id}")
def pairing(pairing_id: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return model.pairing_status(c, user, pairing_id)


@router.get("/machines/{mid}")
def machine(mid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return model.machine_detail(c, model.get_machine(c, user, mid), _cfg(request))


class MachinePatch(BaseModel):
    name: str


@router.patch("/machines/{mid}")
def rename_machine(mid: str, body: MachinePatch, request: Request, user: dict = Depends(auth.current_user)):
    name = body.name.strip()
    if not model.NAME_RE.match(name):
        raise HTTPException(422, "machine name: 1-64 characters")
    with _engine(request).begin() as c:
        model.get_machine(c, user, mid)
        c.execute(db.machines.update().where(db.machines.c.id == mid).values(name=name))
        return model.machine_summary(model.get_machine(c, user, mid), _cfg(request))


@router.delete("/machines/{mid}")
def remove_machine(mid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        model.revoke_machine(c, user, mid)
    return {"result": "removed"}


class CommandIn(BaseModel):
    type: str
    args: dict = {}


@router.post("/machines/{mid}/commands")
def command(mid: str, body: CommandIn, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return model.create_command(c, user, model.get_machine(c, user, mid), body.type, body.args)


@router.get("/machines/{mid}/commands")
def commands(mid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        model.get_machine(c, user, mid)
        return model.list_commands(c, mid)


def _machine_param(c: sa.Connection, user: dict, machine: str | None, required: bool = True) -> dict | None:
    if machine:
        return model.get_machine(c, user, machine)
    if required:
        raise HTTPException(422, "pick a machine (add one on the Machines page first)")
    return None


# ---------------------------------------------------------------- catalog / recipes / runs

@router.get("/catalog")
def get_catalog(request: Request, machine: str | None = None, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return model.catalog_for(_machine_param(c, user, machine, required=False))


@router.get("/datasets")
def get_datasets(request: Request, machine: str, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return model.machine_datasets(model.get_machine(c, user, machine))


@router.get("/weights")
def get_weights(request: Request, machine: str, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return model.machine_weights(model.get_machine(c, user, machine))


class RecipeIn(BaseModel):
    yaml: str | None = None
    recipe: dict | None = None
    tags: list[str] = []
    position: str = "end"
    machine_id: str | None = None


def _recipe_text(body: RecipeIn) -> str:
    if body.yaml is not None:
        return body.yaml
    if body.recipe is not None:
        return recipe.to_yaml(body.recipe)
    raise HTTPException(400, "give yaml or recipe")


@router.post("/recipes/preview")
def preview(body: RecipeIn, request: Request, user: dict = Depends(auth.current_user)):
    text = _recipe_text(body)
    with _engine(request).begin() as c:
        m = _machine_param(c, user, body.machine_id, required=False)
    if m is None:
        return {"yaml": text, "ok": False, "errors": ["pick a machine to run on (add one on the Machines page)"],
                "warnings": [], "runs": []}
    return {"yaml": text, **model.preview(m, text)}


@router.post("/recipes/parse")
def parse(body: RecipeIn, user: dict = Depends(auth.current_user)):
    try:
        r = recipe.load_text(_recipe_text(body))
    except recipe.RecipeError as e:
        raise HTTPException(422, str(e)) from e
    if not isinstance(r.get("stages"), list) or not all(isinstance(s, dict) for s in r["stages"]):
        raise HTTPException(422, "stages must be a list of mappings")
    return {"recipe": r}


@router.post("/runs")
def create_runs(body: RecipeIn, request: Request, user: dict = Depends(auth.current_user)):
    text = _recipe_text(body)
    with _engine(request).begin() as c:
        m = _machine_param(c, user, body.machine_id)
        try:
            ids = model.submit(c, user, m, text, body.tags, body.position)
        except recipe.RecipeError as e:
            raise HTTPException(422, str(e)) from e
    return {"run_ids": ids, "machine_id": m["id"]}


@router.get("/runs")
def list_runs(request: Request, status: str | None = None, machine: str | None = None, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return model.list_runs(c, user, status, machine)


@router.get("/runs/{rid}")
def run_detail(rid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return model.run_detail(c, user, rid)


@router.get("/runs/{rid}/file/{path:path}")
def run_file(rid: str, path: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        f = model.get_file(c, user, rid, path)
    return Response(f["content"], media_type=f["content_type"] or "application/octet-stream",
                    headers={"Cache-Control": "private, max-age=3600"})


class RunPatch(BaseModel):
    tags: list[str] | None = None
    notes: str | None = None


@router.patch("/runs/{rid}")
def patch_run(rid: str, body: RunPatch, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        model.patch_run(c, user, rid, body.tags, body.notes)
        return model.run_summary(c, model.get_run(c, user, rid))


@router.post("/runs/{rid}/cancel")
def cancel(rid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return {"result": model.cancel_run(c, user, rid)}


@router.post("/runs/{rid}/requeue")
def requeue(rid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        model.requeue_run(c, user, rid)
    return {"result": "queued"}


@router.delete("/runs/{rid}")
def delete(rid: str, request: Request, delete_files: bool = False, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        r = model.delete_run(c, user, rid)
        cmd = None
        if delete_files:
            m = c.execute(sa.select(db.machines).where(db.machines.c.id == r["machine_id"], db.machines.c.revoked.is_(False))
                          ).mappings().first()
            if m is not None:
                cmd = model.create_command(c, user, dict(m), "run_delete_files", {"run_id": rid})["id"]
    return {"result": "deleted", "command_id": cmd}


@router.get("/runs/{rid}/logs")
async def logs(rid: str, request: Request, stage: str | None = None, follow: bool = True, lines: int = 400,
               user: dict = Depends(auth.current_user)):
    """Server-sent events, same protocol as the local app: the last `lines` lines, then new lines as they arrive."""
    eng = _engine(request)
    stream = stage if stage and stage != "runner" else "runner"
    with eng.begin() as c:
        model.get_run(c, user, rid)

    def fetch(after: int, tail: int | None):
        with eng.begin() as c:
            return model.log_chunks(c, rid, stream, after, tail)

    def status():
        with eng.begin() as c:
            return c.execute(sa.select(db.runs.c.status).where(db.runs.c.id == rid)).scalar()

    def split(text: str) -> list[str]:
        return [ln for ln in ANSI.sub("", text).replace("\r", "\n").splitlines() if ln.strip()]

    async def gen():
        chunks = await asyncio.to_thread(fetch, 0, 512 * 1024)
        last = chunks[-1][0] if chunks else 0
        for ln in split("".join(t for _, t in chunks))[-lines:]:
            yield f"data: {json.dumps(ln)}\n\n"
        yield "event: caught-up\ndata: {}\n\n"
        idle = 0
        while follow and not await request.is_disconnected():
            await asyncio.sleep(1.0)
            new = await asyncio.to_thread(fetch, last, None)
            if new:
                last = new[-1][0]
                for ln in split("".join(t for _, t in new)):
                    yield f"data: {json.dumps(ln)}\n\n"
                idle = 0
            else:
                idle += 1
                if idle % 15 == 0:
                    yield f"event: status\ndata: {json.dumps({'status': await asyncio.to_thread(status)})}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


# ---------------------------------------------------------------- queue / gpu / results

@router.get("/queue")
def get_queue(request: Request, machine: str | None = None, user: dict = Depends(auth.current_user)):
    cfg = _cfg(request)
    with _engine(request).begin() as c:
        ms = model.list_machines(c, user, cfg)
        if machine:
            model.get_machine(c, user, machine)
        runs = model.queue(c, user, machine)
    sel = next((m for m in ms if m["id"] == machine), None)
    alive = sel["online"] if sel else any(m["online"] for m in ms)
    return {"worker": {"alive": alive, "machine": sel}, "machines": ms, "runs": runs}


@router.get("/gpu")
def gpu(request: Request, machine: str | None = None, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        ms = model.list_machines(c, user, _cfg(request))
    m = next((x for x in ms if x["id"] == machine), None) if machine else next((x for x in ms if x["online"]), None)
    live = (m or {}).get("live") or {}
    if not m or not m["online"] or not live.get("gpus"):
        reason = "no machine" if not m else "machine offline" if not m["online"] else "no GPU telemetry from this machine"
        return {"available": False, "reason": reason, "gpus": []}
    return {"available": True, "gpus": live["gpus"], "machine_id": m["id"]}


@router.get("/results")
def results(request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        rows = model.results(c, user)
    for r in rows:
        r["eval_key"] = model._eval_key(r)
        r["per_class"] = r["metrics"].get("per_class", {})
        r["warning"] = r["metrics"].get("warning")
        r["input_size"] = r["metrics"].get("input_size")
        del r["metrics"]
    return {"rows": rows, "current_eval_version": model.eval_version()}


@router.get("/compare")
def compare(items: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return model.compare(c, user, items)


# ---------------------------------------------------------------- releases

class ReleaseIn(BaseModel):
    manifest: str
    signature: str
    tarball_b64: str


@router.post("/releases/upload")
def upload_release(body: ReleaseIn, request: Request):
    """CI (or an admin's machine) uploads a signed release with MODELLAB_RELEASE_UPLOAD_TOKEN."""
    cfg = _cfg(request)
    tok = (request.headers.get("authorization") or "").removeprefix("Bearer ").strip()
    if not cfg.release_upload_token or not tok or not hmac.compare_digest(tok, cfg.release_upload_token):
        raise HTTPException(401, "bad release upload token")
    try:
        tarball = base64.b64decode(body.tarball_b64, validate=True)
    except ValueError as e:
        raise HTTPException(422, "tarball_b64 is not base64") from e
    with _engine(request).begin() as c:
        return model.publish_release(c, cfg, body.manifest, body.signature, tarball, by="upload-token")


@router.get("/releases")
def releases(request: Request, admin: dict = Depends(auth.require_admin)):
    with _engine(request).begin() as c:
        return model.list_releases(c)


class CurrentIn(BaseModel):
    version: str


@router.post("/releases/current")
def set_current(body: CurrentIn, request: Request, admin: dict = Depends(auth.require_admin)):
    with _engine(request).begin() as c:
        model.set_current_release(c, body.version)
        return model.list_releases(c)
