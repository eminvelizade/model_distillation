"""Hub logic behind the HTTP layer: users, pairing, machines, commands, runs, results, releases.

Every user-facing function takes the logged-in user and only touches that user's machines and runs (phase 1: no
sharing). Every agent-facing function takes the authenticated machine and only touches that machine's runs.
"""

from __future__ import annotations

import hashlib
import json
import re
import secrets
import time
from pathlib import Path

import sqlalchemy as sa
from fastapi import HTTPException

from modellab import ROOT, catalog, recipe, release, weights
from modellab.hub import Config, auth, db

LOG_CAP = 8 * 2**20  # per run and stream; the oldest chunks are dropped beyond this
FILE_CAP = 10 * 2**20  # one artifact
RUN_FILES_CAP = 100 * 2**20  # all artifacts of a run
CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
NAME_RE = re.compile(r"^[^\x00-\x1f]{1,64}$")
DATASET_RE = re.compile(r"^[a-z0-9][a-z0-9_.-]{0,63}$")
FINAL = ("done", "failed", "cancelled", "interrupted")


def eval_version() -> str:
    """Same value as modellab.evaluate.eval_version(), without importing it (it needs numpy; the hub doesn't)."""
    src = (ROOT / "modellab" / "evaluate.py").read_bytes()
    m = re.search(rb'^EVAL_VERSION = "([^"]+)"', src, re.M)
    return f"{m.group(1).decode() if m else '?'}+{hashlib.sha256(src).hexdigest()[:10]}"


def _404(what: str = "not found"):
    return HTTPException(404, what)


# ---------------------------------------------------------------- users

def create_user(c: sa.Connection, username: str, password: str, display_name: str = "", is_admin: bool = False,
                must_change: bool = False) -> dict:
    username = auth.check_username(username)
    auth.check_password_rules(password)
    if c.execute(sa.select(db.users.c.id).where(db.users.c.username == username)).first():
        raise HTTPException(409, f"user {username!r} already exists")
    uid = db.new_id()
    c.execute(db.users.insert().values(id=uid, username=username, display_name=display_name.strip()[:128] or username,
                                       password_hash=auth.hash_password(password), is_admin=is_admin, disabled=False,
                                       must_change_password=must_change, created=time.time()))
    return get_user(c, uid)


def get_user(c: sa.Connection, uid: str) -> dict:
    row = c.execute(sa.select(db.users).where(db.users.c.id == uid)).mappings().first()
    if row is None:
        raise _404("no such user")
    return dict(row)


def list_users(c: sa.Connection) -> list[dict]:
    counts = dict(c.execute(sa.select(db.machines.c.owner_id, sa.func.count()).where(db.machines.c.revoked.is_(False))
                            .group_by(db.machines.c.owner_id)).all())
    return [{**auth.public_user(u), "disabled": bool(u["disabled"]), "created": u["created"], "last_login": u["last_login"],
             "machines": counts.get(u["id"], 0)}
            for u in c.execute(sa.select(db.users).order_by(db.users.c.created)).mappings()]


def revoke_sessions(c: sa.Connection, uid: str, keep_token: str | None = None) -> None:
    q = db.sessions.delete().where(db.sessions.c.user_id == uid)
    if keep_token:
        q = q.where(db.sessions.c.token_hash != auth.token_hash(keep_token))
    c.execute(q)


def bootstrap_admin(engine: sa.Engine, cfg: Config) -> str | None:
    """Create the first admin from MODELLAB_ADMIN_USER / _PASSWORD when the hub has no users yet."""
    with engine.begin() as c:
        if c.execute(sa.select(sa.func.count()).select_from(db.users)).scalar():
            return None
        if not (cfg.admin_user and cfg.admin_password):
            return None
        return create_user(c, cfg.admin_user, cfg.admin_password, is_admin=True)["username"]


# ---------------------------------------------------------------- machines + pairing

def _norm_code(code: str) -> str:
    return re.sub(r"[^A-Z0-9]", "", code.upper())


def create_pairing(c: sa.Connection, user: dict, name: str, cfg: Config) -> dict:
    name = name.strip()
    if not NAME_RE.match(name):
        raise HTTPException(422, "machine name: 1-64 characters")
    code = "".join(secrets.choice(CODE_ALPHABET) for _ in range(8))
    now = time.time()
    pid = db.new_id()
    c.execute(db.pairing_codes.insert().values(id=pid, code_hash=auth.token_hash(code), user_id=user["id"], name=name,
                                               created=now, expires=now + cfg.pairing_minutes * 60))
    c.execute(db.pairing_codes.delete().where(db.pairing_codes.c.expires < now - 86400))
    return {"pairing_id": pid, "code": f"{code[:4]}-{code[4:]}", "expires": now + cfg.pairing_minutes * 60}


def pairing_status(c: sa.Connection, user: dict, pairing_id: str) -> dict:
    r = c.execute(sa.select(db.pairing_codes).where(db.pairing_codes.c.id == pairing_id,
                                                    db.pairing_codes.c.user_id == user["id"])).mappings().first()
    if r is None:
        raise _404("no such pairing")
    return {"used": bool(r["used"]), "machine_id": r["machine_id"], "expired": not r["used"] and r["expires"] < time.time(),
            "expires": r["expires"]}


def redeem_pairing(c: sa.Connection, code: str, hostname: str, agent_version: str) -> tuple[dict, str]:
    now = time.time()
    r = c.execute(sa.select(db.pairing_codes).where(db.pairing_codes.c.code_hash == auth.token_hash(_norm_code(code)))
                  ).mappings().first()
    if r is None or r["used"] or r["expires"] < now:
        raise HTTPException(403, "pairing code is invalid, already used or expired: create a new one in the web app")
    owner = c.execute(sa.select(db.users.c.disabled).where(db.users.c.id == r["user_id"])).first()
    if owner is None or owner[0]:
        raise HTTPException(403, "the user who created this pairing code is disabled")
    token = "mlm_" + secrets.token_urlsafe(32)
    mid = db.new_id()
    done = c.execute(db.pairing_codes.update().where(db.pairing_codes.c.id == r["id"], db.pairing_codes.c.used.is_(None))
                     .values(used=now, machine_id=mid))
    if done.rowcount != 1:
        raise HTTPException(403, "pairing code was just used")
    c.execute(db.machines.insert().values(id=mid, owner_id=r["user_id"], name=r["name"], token_hash=auth.token_hash(token),
                                          created=now, last_seen=now, revoked=False, hostname=hostname[:255],
                                          agent_version=agent_version[:64], state="idle"))
    return {"id": mid, "name": r["name"]}, token


def machine_by_token(c: sa.Connection, token: str) -> dict | None:
    r = c.execute(sa.select(db.machines).where(db.machines.c.token_hash == auth.token_hash(token))).mappings().first()
    return dict(r) if r else None


def get_machine(c: sa.Connection, user: dict, mid: str) -> dict:
    r = c.execute(sa.select(db.machines).where(db.machines.c.id == mid, db.machines.c.owner_id == user["id"],
                                               db.machines.c.revoked.is_(False))).mappings().first()
    if r is None:
        raise _404("no such machine")
    return dict(r)


def _check_counts(report: dict) -> dict:
    out = {"ok": 0, "warn": 0, "fail": 0}
    for ch in report.get("checks", []):
        out[ch.get("status", "ok")] = out.get(ch.get("status", "ok"), 0) + 1
    out["fail"] += sum(1 for d in report.get("datasets", []) if d.get("error"))
    return out


def machine_summary(m: dict, cfg: Config) -> dict:
    rep = db.loads(m["report"], {}) or {}
    hw = rep.get("hardware", {})
    online = bool(m["last_seen"]) and time.time() - m["last_seen"] < cfg.online_after_s
    return {"id": m["id"], "name": m["name"], "online": online, "last_seen": m["last_seen"], "created": m["created"],
            "hostname": m["hostname"], "agent_version": m["agent_version"], "release": m["release"],
            "state": m["state"] if online else "offline", "current_run": m["current_run"],
            "gpus": hw.get("gpus", []), "driver": hw.get("driver"), "checks": _check_counts(rep),
            "report_time": m["report_time"], "live": db.loads(m["live"], None),
            "update_status": db.loads(m["update_status"], None)}


def machine_detail(c: sa.Connection, m: dict, cfg: Config) -> dict:
    cur = current_release(c)
    return {**machine_summary(m, cfg), "report": db.loads(m["report"], {}) or {},
            "commands": list_commands(c, m["id"]),
            "current_release": cur["version"] if cur else None}


def list_machines(c: sa.Connection, user: dict, cfg: Config) -> list[dict]:
    rows = c.execute(sa.select(db.machines).where(db.machines.c.owner_id == user["id"], db.machines.c.revoked.is_(False))
                     .order_by(db.machines.c.created)).mappings()
    return [machine_summary(dict(m), cfg) for m in rows]


def revoke_machine(c: sa.Connection, user: dict | None, mid: str) -> None:
    """Remove a machine: by its owner in the web app, or by the agent itself (uninstall; user=None)."""
    if user is not None:
        get_machine(c, user, mid)
    now = time.time()
    c.execute(db.machines.update().where(db.machines.c.id == mid).values(revoked=True, current_run=None))
    c.execute(db.runs.update().where(db.runs.c.machine_id == mid, db.runs.c.status == "queued")
              .values(status="cancelled", finished=now, error_tail="machine removed"))
    c.execute(db.runs.update().where(db.runs.c.machine_id == mid, db.runs.c.status == "running")
              .values(status="interrupted", finished=now, error_tail="machine removed while this run was running"))
    c.execute(db.commands.update().where(db.commands.c.machine_id == mid, db.commands.c.status.in_(("pending", "sent")))
              .values(status="failed", error="machine removed", finished=now))


def machine_datasets(m: dict) -> list[dict]:
    return (db.loads(m["report"], {}) or {}).get("datasets", [])


def machine_weights(m: dict) -> dict:
    return (db.loads(m["report"], {}) or {}).get("weights", {})


# ---------------------------------------------------------------- commands

def _str(args: dict, key: str, required: bool = True, maxlen: int = 1024) -> str | None:
    v = args.get(key)
    if v is None or v == "":
        if required:
            raise HTTPException(422, f"{key} is required")
        return None
    if not isinstance(v, str) or len(v) > maxlen or "\x00" in v:
        raise HTTPException(422, f"{key} must be a string of at most {maxlen} characters")
    return v.strip()


def _abs_path(args: dict, key: str, required: bool = True) -> str | None:
    v = _str(args, key, required)
    if v is not None and not v.startswith("/"):
        raise HTTPException(422, f"{key} must be an absolute path on the machine (starts with /)")
    return v


def _dataset_name(args: dict) -> str:
    v = _str(args, "name", maxlen=64)
    if not DATASET_RE.match(v):
        raise HTTPException(422, "dataset name: lowercase letters, digits, '.', '_' or '-' (max 64)")
    return v


def validate_command(ctype: str, args: dict) -> dict:
    if not isinstance(args, dict):
        raise HTTPException(422, "args must be an object")
    if ctype in ("selfcheck", "weights_verify", "update"):
        return {}
    if ctype == "dataset_add":
        return {"name": _dataset_name(args), "path": _abs_path(args, "path"),
                "description": _str(args, "description", required=False, maxlen=500) or ""}
    if ctype == "dataset_import":
        fmt = args.get("format")
        if fmt == "coco":
            out = {"format": "coco", "coco_json": _abs_path(args, "coco_json"), "images_dir": _abs_path(args, "images_dir", False)}
        elif fmt == "yolo":
            out = {"format": "yolo", "yolo_dir": _abs_path(args, "yolo_dir")}
        else:
            raise HTTPException(422, "format must be coco or yolo")
        return {"name": _dataset_name(args), **out, "keep_splits": bool(args.get("keep_splits")),
                "description": _str(args, "description", required=False, maxlen=500) or ""}
    if ctype in ("dataset_verify", "dataset_remove"):
        return {"name": _dataset_name(args)}
    if ctype == "weights_fetch":
        ids = args.get("ids")
        if not isinstance(ids, list) or not ids or not all(isinstance(i, str) for i in ids):
            raise HTTPException(422, "ids must be a non-empty list of model / teacher ids")
        try:
            weights.expand(ids)
        except KeyError as e:
            raise HTTPException(422, str(e)) from e
        return {"ids": ids}
    if ctype == "run_delete_files":
        rid = _str(args, "run_id", maxlen=80)
        if not db.RUN_ID_RE.match(rid):
            raise HTTPException(422, "bad run id")
        return {"run_id": rid}
    raise HTTPException(422, f"unknown command {ctype!r}")


def create_command(c: sa.Connection, user: dict, m: dict, ctype: str, args: dict) -> dict:
    args = validate_command(ctype, args or {})
    cid = db.new_id()
    c.execute(db.commands.insert().values(id=cid, machine_id=m["id"], user_id=user["id"], type=ctype, args=db.dumps(args),
                                          status="pending", created=time.time()))
    return command_row(c, cid)


def command_row(c: sa.Connection, cid: str) -> dict:
    r = c.execute(sa.select(db.commands).where(db.commands.c.id == cid)).mappings().first()
    d = dict(r)
    d["args"], d["result"] = db.loads(d["args"], {}), db.loads(d["result"], None)
    return d


def list_commands(c: sa.Connection, mid: str, limit: int = 30) -> list[dict]:
    ids = c.execute(sa.select(db.commands.c.id).where(db.commands.c.machine_id == mid)
                    .order_by(db.commands.c.created.desc()).limit(limit)).scalars().all()
    return [command_row(c, i) for i in ids]


def update_command(c: sa.Connection, m: dict, cid: str, body: dict) -> dict:
    r = c.execute(sa.select(db.commands.c.status).where(db.commands.c.id == cid, db.commands.c.machine_id == m["id"])).first()
    if r is None:
        raise _404("no such command")
    status = body.get("status")
    if status not in ("running", "done", "failed"):
        raise HTTPException(422, "status must be running, done or failed")
    now = time.time()
    vals = {"status": status, **({"started": now} if status == "running" else {"finished": now})}
    if "result" in body:
        vals["result"] = db.dumps(body["result"])
    if body.get("error") is not None:
        vals["error"] = str(body["error"])[-8000:]
    if body.get("log") is not None:
        vals["log"] = str(body["log"])[-20000:]
    c.execute(db.commands.update().where(db.commands.c.id == cid).values(**vals))
    return command_row(c, cid)


# ---------------------------------------------------------------- agent heartbeat / report

def current_release(c: sa.Connection) -> dict | None:
    v = db.get_setting(c, "current_release")
    q = sa.select(db.releases.c.version, db.releases.c.manifest, db.releases.c.signature, db.releases.c.created)
    q = q.where(db.releases.c.version == v) if v else q.order_by(db.releases.c.created.desc()).limit(1)
    r = c.execute(q).mappings().first()
    return dict(r) if r else None


def heartbeat(c: sa.Connection, m: dict, body: dict) -> dict:
    now = time.time()
    vals = {"last_seen": now, "state": str(body.get("state") or "idle")[:32],
            "current_run": body.get("current_run") if isinstance(body.get("current_run"), str) else None}
    if isinstance(body.get("live"), dict):
        vals["live"] = db.dumps(body["live"])
    for k in ("agent_version", "release", "hostname"):
        if isinstance(body.get(k), str):
            vals[k] = body[k][:128]
    if isinstance(body.get("update_status"), dict):
        vals["update_status"] = db.dumps(body["update_status"])
    c.execute(db.machines.update().where(db.machines.c.id == m["id"]).values(**vals))
    # commands sent but never started (agent restarted in between) are given up after 15 minutes
    c.execute(db.commands.update().where(db.commands.c.machine_id == m["id"], db.commands.c.status == "sent",
                                         db.commands.c.created < now - 900)
              .values(status="failed", finished=now, error="the agent did not pick this command up"))
    pending = c.execute(sa.select(db.commands.c.id, db.commands.c.type, db.commands.c.args)
                        .where(db.commands.c.machine_id == m["id"], db.commands.c.status == "pending")
                        .order_by(db.commands.c.created)).mappings().all()
    if pending:
        c.execute(db.commands.update().where(db.commands.c.id.in_([p["id"] for p in pending])).values(status="sent"))
    running = c.execute(sa.select(db.runs.c.id, db.runs.c.cancel_requested)
                        .where(db.runs.c.machine_id == m["id"], db.runs.c.status == "running")).all()
    cancel = [rid for rid, cr in running if cr]
    cur = current_release(c)
    update = None
    if cur and body.get("release") and body["release"] != cur["version"]:
        update = {"version": cur["version"]}
    return {"commands": [{"id": p["id"], "type": p["type"], "args": db.loads(p["args"], {})} for p in pending],
            "cancel": cancel, "running": [rid for rid, _ in running], "update": update, "server_time": now}


def store_report(c: sa.Connection, m: dict, report: dict) -> None:
    raw = json.dumps(report, default=str)
    if len(raw) > 2 * 2**20:
        raise HTTPException(413, "report too large")
    c.execute(db.machines.update().where(db.machines.c.id == m["id"]).values(report=raw, report_time=time.time(),
                                                                              last_seen=time.time()))


# ---------------------------------------------------------------- recipes / runs (user side)

def _dataset_problems(m: dict) -> tuple[set[str], dict[str, str]]:
    names, problems = set(), {}
    for d in machine_datasets(m):
        names.add(d["name"])
        if d.get("error"):
            problems[d["name"]] = d["error"]
        elif not d.get("built", True):
            problems[d["name"]] = "registered but not built yet"
    return names, problems


def _plan(text: str, m: dict):
    names, problems = _dataset_problems(m)
    plans, errors = recipe.plan(text, known_datasets=names)
    used = {s["dataset"] for p in plans for s in p.stages if s.get("dataset")}
    errors += [f"dataset {n!r} on {m['name']}: {problems[n]}" for n in sorted(used & set(problems))]
    return plans, errors


def _model_ids(stages: list[dict]) -> list[str]:
    ids = [s.get("student") or s.get("model_id") or (s.get("model") if isinstance(s.get("model"), str) else None)
           for s in stages]
    ids += [s["teacher"] for s in stages if isinstance(s.get("teacher"), str)]
    ids += [x for s in stages for x in (s.get("models") or []) if isinstance(x, str)]
    return [i for i in ids if i]


def missing_weights(m: dict, stages: list[dict]) -> list[str]:
    have = machine_weights(m)
    try:
        need = weights.required_for(_model_ids(stages))
    except KeyError:
        return []
    return [k for k in need if not (have.get(k) or {}).get("present")]


def preview(m: dict, text: str) -> dict:
    try:
        plans, errors = _plan(text, m)
    except recipe.RecipeError as e:
        return {"ok": False, "errors": [str(e)], "warnings": [], "runs": []}
    runs = [{"name": p.name, "stages": [{"name": s["name"], "type": s["type"]} for s in p.stages],
             "missing_weights": missing_weights(m, p.stages), "matrix": p.matrix_values} for p in plans]
    return {"ok": not errors, "errors": errors, "warnings": [w for p in plans for w in p.warnings], "runs": runs,
            "machine": {"id": m["id"], "name": m["name"]}}


def submit(c: sa.Connection, user: dict, m: dict, text: str, tags: list[str], position: str) -> list[str]:
    plans, errors = _plan(text, m)
    if errors:
        raise HTTPException(422, "; ".join(errors))
    group = f"g{time.strftime('%Y%m%d%H%M%S')}{secrets.token_hex(2)}" if len(plans) > 1 else None
    now = time.time()
    if position == "front":
        low = c.execute(sa.select(sa.func.min(db.runs.c.queue_pos)).where(db.runs.c.machine_id == m["id"],
                                                                          db.runs.c.status == "queued")).scalar()
        base = (low if low is not None else now) - len(plans)
    else:
        base = now
    ids = []
    for i, p in enumerate(plans):
        resolved = {"name": p.name, "recipe_name": p.recipe.get("name"), "description": p.recipe.get("description", ""),
                    "dataset": p.recipe.get("dataset"), "seed": p.recipe.get("seed", 42), "matrix": p.matrix_values,
                    "warnings": p.warnings, "stages": p.stages}
        all_tags = list(dict.fromkeys([*(p.recipe.get("tags") or []), *tags]))
        rid = db.run_id(p.name)
        c.execute(db.runs.insert().values(
            id=rid, owner_id=user["id"], machine_id=m["id"], name=p.name, recipe_name=p.recipe.get("name", ""),
            group_id=group, status="queued", created=now, updated=now, dataset=resolved["dataset"], cancel_requested=False,
            tags=json.dumps(all_tags), notes="", queue_pos=base + i * 1e-3, recipe_yaml=recipe.to_yaml(p.recipe),
            resolved=json.dumps(resolved)))
        for j, st in enumerate(p.stages):
            c.execute(db.stages.insert().values(run_id=rid, name=st["name"], type=st["type"], idx=j, status="pending"))
        ids.append(rid)
    return ids


def _stage_rows(c: sa.Connection, rid: str) -> list[dict]:
    out = []
    for s in c.execute(sa.select(db.stages).where(db.stages.c.run_id == rid).order_by(db.stages.c.idx)).mappings():
        d = dict(s)
        d["progress"], d["result"], d["artifacts"] = db.loads(d["progress"]), db.loads(d["result"]), db.loads(d["artifacts"], [])
        out.append(d)
    return out


def _result_rows(c: sa.Connection, rid: str) -> list[dict]:
    rows = []
    for r in c.execute(sa.select(db.results).where(db.results.c.run_id == rid)).mappings():
        d = dict(r)
        d["metrics"] = db.loads(d["metrics"], {})
        rows.append(d)
    return rows


def run_summary(c: sa.Connection, r: dict, machines: dict[str, str] | None = None) -> dict:
    stages = _stage_rows(c, r["id"])
    done = sum(s["status"] == "done" for s in stages)
    cur = next((s["progress"] for s in stages if s["name"] == r["current_stage"]), None) if r["status"] == "running" else None
    overall = (done + (cur["fraction"] if cur else 0)) / max(1, len(stages))
    res = [x for x in _result_rows(c, r["id"]) if x["map"] is not None]
    best = max(res, key=lambda x: x["map"], default=None)
    if machines is None:
        machines = {r["machine_id"]: c.execute(sa.select(db.machines.c.name).where(db.machines.c.id == r["machine_id"])).scalar()}
    return {**{k: r[k] for k in ("id", "name", "recipe_name", "group_id", "status", "created", "started", "finished",
                                 "dataset", "current_stage", "notes", "error_tail", "status_message", "machine_id")},
            "tags": db.loads(r["tags"], []), "cancel_requested": int(bool(r["cancel_requested"])),
            "machine_name": machines.get(r["machine_id"]),
            "stages": [{k: s[k] for k in ("name", "type", "status", "started", "finished")} for s in stages],
            "progress": round(overall, 4), "stage_progress": cur,
            "best": {"map": best["map"], "label": best["label"], "stage": best["stage"]} if best else None}


def _machine_names(c: sa.Connection, user: dict) -> dict[str, str]:
    return dict(c.execute(sa.select(db.machines.c.id, db.machines.c.name).where(db.machines.c.owner_id == user["id"])).all())


def get_run(c: sa.Connection, user: dict, rid: str) -> dict:
    r = c.execute(sa.select(db.runs).where(db.runs.c.id == rid, db.runs.c.owner_id == user["id"])).mappings().first()
    if r is None:
        raise _404("no such run")
    return dict(r)


def list_runs(c: sa.Connection, user: dict, status: str | None = None, machine: str | None = None, limit: int = 500) -> list[dict]:
    q = sa.select(db.runs).where(db.runs.c.owner_id == user["id"])
    if status:
        q = q.where(db.runs.c.status.in_(status.split(",")))
    if machine:
        q = q.where(db.runs.c.machine_id == machine)
    names = _machine_names(c, user)
    return [run_summary(c, dict(r), names) for r in c.execute(q.order_by(db.runs.c.created.desc()).limit(limit)).mappings()]


def queue(c: sa.Connection, user: dict, machine: str | None) -> list[dict]:
    q = sa.select(db.runs).where(db.runs.c.owner_id == user["id"], db.runs.c.status.in_(("running", "queued")))
    if machine:
        q = q.where(db.runs.c.machine_id == machine)
    names = _machine_names(c, user)
    rows = [dict(r) for r in c.execute(q).mappings()]
    rows.sort(key=lambda r: (r["status"] != "running", r["queue_pos"] or 0))
    return [run_summary(c, r, names) for r in rows]


def run_detail(c: sa.Connection, user: dict, rid: str) -> dict:
    r = get_run(c, user, rid)
    stages = _stage_rows(c, rid)
    stored = {p for (p,) in c.execute(sa.select(db.files.c.path).where(db.files.c.run_id == rid))}
    out_stages = []
    for s in stages:
        arts = []
        for a in s["artifacts"] or []:
            arts.append({**a, "stored": a["path"] in stored})
        out_stages.append({**{k: s[k] for k in ("run_id", "name", "type", "idx", "status", "started", "finished", "error")},
                           "progress": s["progress"], "result": s["result"], "artifacts": arts})
    return {**run_summary(c, r), "stages": out_stages, "results": _result_rows(c, rid), "recipe_yaml": r["recipe_yaml"] or "",
            "resolved": db.loads(r["resolved"]), "env": db.loads(r["env"]), "datasets": db.loads(r["datasets_info"]),
            "pid": None}


def cancel_run(c: sa.Connection, user: dict, rid: str) -> str:
    r = get_run(c, user, rid)
    if r["status"] == "queued":
        c.execute(db.runs.update().where(db.runs.c.id == rid).values(status="cancelled", finished=time.time()))
        return "cancelled"
    if r["status"] == "running":
        c.execute(db.runs.update().where(db.runs.c.id == rid).values(cancel_requested=True))
        return "cancel requested"
    return r["status"]


def requeue_run(c: sa.Connection, user: dict, rid: str) -> None:
    r = get_run(c, user, rid)
    if r["status"] not in FINAL:
        raise HTTPException(409, "only finished runs can be re-queued")
    m = c.execute(sa.select(db.machines.c.revoked).where(db.machines.c.id == r["machine_id"])).first()
    if m is None or m[0]:
        raise HTTPException(409, "the machine of this run was removed")
    c.execute(db.runs.update().where(db.runs.c.id == rid).values(status="queued", cancel_requested=False, error_tail=None,
                                                                 finished=None, status_message=None, queue_pos=time.time()))
    c.execute(db.stages.update().where(db.stages.c.run_id == rid, db.stages.c.status != "done")
              .values(status="pending", error=None))


def delete_run(c: sa.Connection, user: dict, rid: str) -> dict:
    r = get_run(c, user, rid)
    if r["status"] == "running":
        raise HTTPException(409, "cancel the run first")
    for t in (db.results, db.stages, db.files, db.logs):
        c.execute(t.delete().where(t.c.run_id == rid))
    c.execute(db.runs.delete().where(db.runs.c.id == rid))
    return r


def patch_run(c: sa.Connection, user: dict, rid: str, tags: list[str] | None, notes: str | None) -> None:
    get_run(c, user, rid)
    vals = {}
    if tags is not None:
        vals["tags"] = json.dumps([str(t)[:40] for t in tags][:30])
    if notes is not None:
        vals["notes"] = notes[:10000]
    if vals:
        c.execute(db.runs.update().where(db.runs.c.id == rid).values(**vals))


def get_file(c: sa.Connection, user: dict, rid: str, path: str) -> dict:
    get_run(c, user, rid)
    r = c.execute(sa.select(db.files).where(db.files.c.run_id == rid, db.files.c.path == path)).mappings().first()
    if r is None:
        raise _404("not stored on the hub")
    return dict(r)


# ---------------------------------------------------------------- runs (agent side)

def _agent_run(c: sa.Connection, m: dict, rid: str) -> dict:
    r = c.execute(sa.select(db.runs).where(db.runs.c.id == rid, db.runs.c.machine_id == m["id"])).mappings().first()
    if r is None:
        raise _404("no such run on this machine")
    return dict(r)


def claim(c: sa.Connection, m: dict) -> dict | None:
    q = (sa.select(db.runs.c.id).where(db.runs.c.machine_id == m["id"], db.runs.c.status == "queued")
         .order_by(db.runs.c.queue_pos).limit(1))
    if c.dialect.name == "postgresql":
        q = q.with_for_update(skip_locked=True)
    rid = c.execute(q).scalar()
    if rid is None:
        return None
    now = time.time()
    done = c.execute(db.runs.update().where(db.runs.c.id == rid, db.runs.c.status == "queued")
                     .values(status="running", started=now, finished=None, error_tail=None, cancel_requested=False,
                             status_message="starting", updated=now))
    if done.rowcount != 1:
        return None
    r = _agent_run(c, m, rid)
    return {"id": r["id"], "name": r["name"], "recipe_yaml": r["recipe_yaml"], "resolved": db.loads(r["resolved"]),
            "tags": db.loads(r["tags"], []), "stages": {s["name"]: s["status"] for s in _stage_rows(c, rid)}}


RUN_FIELDS = ("status", "current_stage", "started", "finished", "error_tail", "status_message")
RUN_JSON_FIELDS = {"env": "env", "datasets_info": "datasets_info", "metrics": "metrics"}
STAGE_FIELDS = ("status", "started", "finished", "error")
STAGE_JSON_FIELDS = ("progress", "result", "artifacts")
STATUSES = ("queued", "running", "done", "failed", "cancelled", "interrupted")


def apply_events(c: sa.Connection, m: dict, rid: str, body: dict) -> dict:
    """Incremental state from the agent: run fields, stages, eval rows and log chunks."""
    r = _agent_run(c, m, rid)
    now = time.time()
    run_in = body.get("run") or {}
    vals = {"updated": now}
    for k in RUN_FIELDS:
        if k in run_in:
            vals[k] = run_in[k]
    if "status" in vals and vals["status"] not in STATUSES:
        raise HTTPException(422, "bad status")
    for k, col in RUN_JSON_FIELDS.items():
        if k in run_in:
            vals[col] = db.dumps(run_in[k])
    if vals.get("status") in FINAL:
        vals["cancel_requested"] = False
    if r["status"] in FINAL and r["status"] != "done" and vals.get("status") == "running":
        vals.pop("status")  # the user cancelled / the machine was removed meanwhile: don't resurrect the run
    c.execute(db.runs.update().where(db.runs.c.id == rid).values(**vals))
    for s in body.get("stages") or []:
        sv = {k: s[k] for k in STAGE_FIELDS if k in s}
        sv.update({k: db.dumps(s[k]) for k in STAGE_JSON_FIELDS if k in s})
        if sv:
            c.execute(db.stages.update().where(db.stages.c.run_id == rid, db.stages.c.name == s.get("name")).values(**sv))
    for res in body.get("results") or []:
        row = res.get("row") or {}
        vals_r = {"run_id": rid, "stage": res["stage"], "owner_id": r["owner_id"], "machine_id": m["id"],
                  **{k: row.get(k) for k in db.RESULT_COLS}, "metrics": json.dumps(row, default=str), "created": now}
        db.upsert(c, db.results, vals_r, ["run_id", "stage"])
    for chunk in body.get("logs") or []:
        append_log(c, rid, str(chunk["stream"])[:64], int(chunk["offset"]), str(chunk["text"]))
    r2 = _agent_run(c, m, rid)
    return {"status": r2["status"], "cancel_requested": bool(r2["cancel_requested"])}


def append_log(c: sa.Connection, rid: str, stream: str, offset: int, text: str) -> None:
    if not text:
        return
    exists = c.execute(sa.select(db.logs.c.id).where(db.logs.c.run_id == rid, db.logs.c.stream == stream,
                                                     db.logs.c.offset == offset)).first()
    if exists:
        return
    size = len(text.encode())
    c.execute(db.logs.insert().values(run_id=rid, stream=stream, offset=offset, size=size, text=text, created=time.time()))
    total = c.execute(sa.select(sa.func.coalesce(sa.func.sum(db.logs.c.size), 0))
                      .where(db.logs.c.run_id == rid, db.logs.c.stream == stream)).scalar()
    if total > LOG_CAP:
        drop, acc = [], 0
        for lid, sz in c.execute(sa.select(db.logs.c.id, db.logs.c.size).where(db.logs.c.run_id == rid, db.logs.c.stream == stream)
                                 .order_by(db.logs.c.id)):
            if total - acc <= LOG_CAP * 0.75:
                break
            drop.append(lid)
            acc += sz
        c.execute(db.logs.delete().where(db.logs.c.id.in_(drop)))


def log_chunks(c: sa.Connection, rid: str, stream: str, after_id: int = 0, tail_bytes: int | None = None) -> list[tuple[int, str]]:
    q = sa.select(db.logs.c.id, db.logs.c.text, db.logs.c.size).where(db.logs.c.run_id == rid, db.logs.c.stream == stream,
                                                                      db.logs.c.id > after_id)
    if tail_bytes is None:
        return [(i, t) for i, t, _ in c.execute(q.order_by(db.logs.c.id))]
    out, acc = [], 0
    for i, t, sz in c.execute(q.order_by(db.logs.c.id.desc())):
        out.append((i, t))
        acc += sz
        if acc >= tail_bytes:
            break
    return out[::-1]


def save_file(c: sa.Connection, m: dict, rid: str, path: str, data: bytes, content_type: str, mtime: float | None) -> None:
    _agent_run(c, m, rid)
    if not re.match(r"^stages/[a-z0-9][a-z0-9_-]{0,40}/[^\x00]{1,400}$", path) or ".." in Path(path).parts:
        raise HTTPException(422, "bad artifact path")
    if len(data) > FILE_CAP:
        raise HTTPException(413, f"artifact larger than {FILE_CAP // 2**20} MB")
    used = c.execute(sa.select(sa.func.coalesce(sa.func.sum(db.files.c.size), 0))
                     .where(db.files.c.run_id == rid, db.files.c.path != path)).scalar()
    if used + len(data) > RUN_FILES_CAP:
        raise HTTPException(413, "this run already stores the maximum artifact volume on the hub")
    db.upsert(c, db.files, {"run_id": rid, "path": path, "content": data, "size": len(data),
                            "content_type": content_type[:128], "mtime": mtime, "created": time.time()}, ["run_id", "path"])


# ---------------------------------------------------------------- results / compare

def _eval_key(r: dict) -> str:
    return f"{r['eval_version']}|{r['dataset']}|{r['split']}|{r['dataset_hash']}"


def results(c: sa.Connection, user: dict) -> list[dict]:
    names = _machine_names(c, user)
    q = (sa.select(db.results, db.runs.c.name.label("run_name"), db.runs.c.tags, db.runs.c.notes,
                   db.runs.c.status.label("run_status"), db.runs.c.group_id)
         .join(db.runs, db.runs.c.id == db.results.c.run_id)
         .where(db.results.c.owner_id == user["id"]).order_by(db.results.c.created.desc()).limit(2000))
    out = []
    for r in c.execute(q).mappings():
        d = dict(r)
        d["metrics"] = db.loads(d["metrics"], {})
        d["tags"] = db.loads(d["tags"], [])
        d["machine_name"] = names.get(d["machine_id"])
        out.append(d)
    return out


def _flatten(d, prefix="") -> dict:
    out = {}
    if isinstance(d, dict):
        for k, v in d.items():
            out.update(_flatten(v, f"{prefix}.{k}" if prefix else str(k)))
    elif isinstance(d, list) and d and all(isinstance(x, dict) and "name" in x for x in d):
        for x in d:
            out.update(_flatten({k: v for k, v in x.items() if k != "name"}, f"{prefix}[{x['name']}]"))
    else:
        out[prefix] = d
    return out


def compare(c: sa.Connection, user: dict, items: str) -> dict:
    keys = [tuple(x.split(":", 1)) for x in items.split(",") if ":" in x]
    if not 1 <= len(keys) <= 4:
        raise HTTPException(400, "pick 1-4 results")
    all_rows = {(r["run_id"], r["stage"]): r for r in results(c, user)}
    rows, configs, pcas = [], {}, {}
    for k in keys:
        if k not in all_rows:
            raise _404(f"no result {k}")
        r = dict(all_rows[k])
        r["eval_key"] = _eval_key(r)
        rows.append(r)
        rid = r["run_id"]
        if rid not in configs:
            run = get_run(c, user, rid)
            res = db.loads(run["resolved"], {}) or {}
            configs[rid] = _flatten({"stages": res.get("stages", []), "seed": res.get("seed"), "dataset": res.get("dataset")})
            env = db.loads(run["env"], {}) or {}
            configs[rid].update(_flatten({"env": {"git": (env.get("git") or {}).get("commit"), "packages": env.get("packages"),
                                                  "gpu": (env.get("gpu") or {}).get("devices"),
                                                  "machine": r.get("machine_name")}}))
            pcas[rid] = sorted(p for (p,) in c.execute(sa.select(db.files.c.path).where(db.files.c.run_id == rid))
                               if re.match(r"^stages/[^/]+/pca\.png$", p))
    run_ids = list(configs)
    all_keys = sorted(set().union(*(cf.keys() for cf in configs.values())))
    diff = [{"key": k, "values": {rid: configs[rid].get(k) for rid in run_ids}} for k in all_keys
            if len({json.dumps(configs[rid].get(k), sort_keys=True, default=str) for rid in run_ids}) > 1]
    warnings = []
    if len({r["eval_version"] for r in rows}) > 1:
        warnings.append("eval code versions differ: " + ", ".join(sorted({r["eval_version"] or "?" for r in rows})))
    if len({(r["dataset"], r["split"], r["dataset_hash"]) for r in rows}) > 1:
        warnings.append("evaluated on different data (dataset / split / content hash differ)")
    if len({r["latency_device"] for r in rows if r["latency_device"]}) > 1:
        warnings.append("latency measured on different devices / settings")
    return {"rows": rows, "config_diff": diff, "pca": pcas, "warnings": warnings, "comparable": not warnings[:2],
            "current_eval_version": eval_version()}


# ---------------------------------------------------------------- releases

def publish_release(c: sa.Connection, cfg: Config, manifest_text: str, signature: str, tarball: bytes, by: str) -> dict:
    if not cfg.release_pubkey:
        raise HTTPException(409, "MODELLAB_RELEASE_PUBKEY is not set on the hub")
    try:
        manifest = release.check(manifest_text, signature, tarball, cfg.release_pubkey)
    except release.ReleaseError as e:
        raise HTTPException(422, str(e)) from e
    v = manifest["version"]
    if c.execute(sa.select(db.releases.c.version).where(db.releases.c.version == v)).first():
        raise HTTPException(409, f"release {v} already exists")
    c.execute(db.releases.insert().values(version=v, manifest=manifest_text, signature=signature, tarball=tarball,
                                          created=time.time(), published_by=by[:64]))
    db.set_setting(c, "current_release", v)
    return {"version": v, "manifest": manifest}


def list_releases(c: sa.Connection) -> dict:
    cur = current_release(c)
    rows = [{"version": v, "created": t, "published_by": b, "manifest": db.loads(mf, {})}
            for v, t, b, mf in c.execute(sa.select(db.releases.c.version, db.releases.c.created, db.releases.c.published_by,
                                                   db.releases.c.manifest).order_by(db.releases.c.created.desc()))]
    return {"current": cur["version"] if cur else None, "releases": rows}


def set_current_release(c: sa.Connection, version: str) -> None:
    if not c.execute(sa.select(db.releases.c.version).where(db.releases.c.version == version)).first():
        raise _404("no such release")
    db.set_setting(c, "current_release", version)


def release_tarball(c: sa.Connection, version: str) -> bytes:
    data = c.execute(sa.select(db.releases.c.tarball).where(db.releases.c.version == version)).scalar()
    if data is None:
        raise _404("no such release")
    return data


def catalog_for(m: dict | None) -> dict:
    return {**catalog.public_catalog(), "stage_types": list(recipe.STAGE_TYPES), "default_epochs": recipe.DEFAULT_EPOCHS,
            "datasets": machine_datasets(m) if m else [], "templates": recipe.templates(), "eval_version": eval_version()}
