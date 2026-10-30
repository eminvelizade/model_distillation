"""Agent API (/agent/v1/...): what the agent on a GPU PC calls, authenticated with its machine token.

The agent opens every connection (no ports on the PC). A token only reaches its own machine's runs and commands.
A revoked token gets 401 {"detail": "revoked"}: the agent then cancels its local run and stops its service.
"""

from __future__ import annotations

import asyncio

import sqlalchemy as sa
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel

from modellab.hub import auth, db, model

router = APIRouter(prefix="/agent/v1")


def _engine(request: Request) -> sa.Engine:
    return request.app.state.engine


def current_machine(request: Request) -> dict:
    tok = (request.headers.get("authorization") or "").removeprefix("Bearer ").strip()
    if not tok:
        raise HTTPException(401, "missing machine token")
    with _engine(request).begin() as c:
        m = model.machine_by_token(c, tok)
        if m is not None and not m["revoked"]:
            owner = c.execute(sa.select(db.users.c.disabled).where(db.users.c.id == m["owner_id"])).first()
            if owner is None or owner[0]:
                raise HTTPException(403, "the owner of this machine is disabled")
    if m is None:
        raise HTTPException(401, "unknown machine token")
    if m["revoked"]:
        raise HTTPException(401, "revoked")
    return m


class PairIn(BaseModel):
    code: str
    hostname: str = ""
    agent_version: str = ""


@router.post("/pair")
def pair(body: PairIn, request: Request):
    ip = auth.client_ip(request)
    if auth.PAIR_IP.blocked(ip):
        raise HTTPException(429, "too many pairing attempts from this address, wait a few minutes")
    with _engine(request).begin() as c:
        try:
            m, token = model.redeem_pairing(c, body.code, body.hostname, body.agent_version)
        except HTTPException:
            auth.PAIR_IP.fail(ip)
            raise
    return {"machine_id": m["id"], "name": m["name"], "token": token}


@router.post("/unpair")
def unpair(request: Request, m: dict = Depends(current_machine)):
    """The agent is being uninstalled: remove the machine (same as removing it in the web app)."""
    with _engine(request).begin() as c:
        model.revoke_machine(c, None, m["id"])
    return {"result": "removed"}


@router.post("/heartbeat")
def heartbeat(body: dict, request: Request, m: dict = Depends(current_machine)):
    with _engine(request).begin() as c:
        return model.heartbeat(c, m, body)


@router.post("/report")
def report(body: dict, request: Request, m: dict = Depends(current_machine)):
    with _engine(request).begin() as c:
        model.store_report(c, m, body)
    return {"result": "stored"}


@router.post("/claim")
def claim(request: Request, m: dict = Depends(current_machine)):
    with _engine(request).begin() as c:
        return {"run": model.claim(c, m)}


@router.post("/runs/{rid}/events")
def events(rid: str, body: dict, request: Request, m: dict = Depends(current_machine)):
    with _engine(request).begin() as c:
        return model.apply_events(c, m, rid, body)


@router.put("/runs/{rid}/files/{path:path}")
async def upload_file(rid: str, path: str, request: Request, m: dict = Depends(current_machine)):
    size = int(request.headers.get("content-length") or 0)
    if size > model.FILE_CAP:
        raise HTTPException(413, "artifact too large")
    data = await request.body()
    mtime = request.headers.get("x-mtime")
    with _engine(request).begin() as c:
        model.save_file(c, m, rid, path, data, request.headers.get("content-type") or "application/octet-stream",
                        float(mtime) if mtime else None)
    return {"result": "stored", "size": len(data)}


class FsPollIn(BaseModel):
    answers: list[dict] = []


@router.post("/fs/poll")
async def fs_poll(body: FsPollIn, request: Request, m: dict = Depends(current_machine)):
    """Long-poll for folder listings the web app wants (dataset picker); answers ride on the next poll."""
    gone = asyncio.Event()

    async def watch() -> None:
        # request.is_disconnected() never sees a hang-up behind the http middleware; waiting on receive() does
        while (await request.receive())["type"] != "http.disconnect":
            pass
        gone.set()

    watcher = asyncio.create_task(watch())
    try:
        return {"requests": await request.app.state.browse.poll(m["id"], body.answers[:16], gone=gone)}
    finally:
        watcher.cancel()


@router.post("/commands/{cid}")
def command_update(cid: str, body: dict, request: Request, m: dict = Depends(current_machine)):
    with _engine(request).begin() as c:
        return model.update_command(c, m, cid, body)


def _release_meta(c: sa.Connection, version: str | None) -> dict:
    r = model.current_release(c) if version is None else c.execute(
        sa.select(db.releases.c.version, db.releases.c.manifest, db.releases.c.signature)
        .where(db.releases.c.version == version)).mappings().first()
    if r is None:
        raise HTTPException(404, "no release published on this hub yet")
    return {"version": r["version"], "manifest": r["manifest"], "signature": r["signature"]}


@router.get("/releases/current")
def release_current(request: Request, m: dict = Depends(current_machine)):
    with _engine(request).begin() as c:
        return _release_meta(c, None)


@router.get("/releases/{version}")
def release_meta(version: str, request: Request, m: dict = Depends(current_machine)):
    with _engine(request).begin() as c:
        return _release_meta(c, version)


@router.get("/releases/{version}/tarball")
def release_tarball(version: str, request: Request, m: dict = Depends(current_machine)):
    with _engine(request).begin() as c:
        data = model.release_tarball(c, version)
    return Response(data, media_type="application/gzip")
