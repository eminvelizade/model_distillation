"""Run store: runs/<id>/ on disk (source of truth for artifacts) + runs/index.sqlite (fast listing / queue state).

runs/<id>/
  recipe.yaml       the (matrix-expanded) recipe of this run
  resolved.json     validated stages with defaults, dataset paths + hashes, weights used
  env.json          git commit, package versions, GPU, seed, host
  runner.log        orchestration log;  stages/<stage>/log.txt  per-stage log
  stages/<stage>/   result.json, progress.json, artifacts (checkpoints, pca.png, ...)
  metrics.json      all eval/features results of the run
Status: queued -> running -> done | failed | cancelled | interrupted.
"""

from __future__ import annotations

import json
import os
import re
import secrets
import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path

from modellab import db_path, runs_dir

FINAL = ("done", "failed", "cancelled", "interrupted")
SCHEMA = """
CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY, name TEXT, recipe_name TEXT, group_id TEXT, status TEXT, created REAL, started REAL,
  finished REAL, dataset TEXT, pid INTEGER, cancel_requested INTEGER DEFAULT 0, error_tail TEXT,
  tags TEXT DEFAULT '[]', notes TEXT DEFAULT '', current_stage TEXT, queue_pos REAL);
CREATE TABLE IF NOT EXISTS stages (
  run_id TEXT, name TEXT, type TEXT, idx INTEGER, status TEXT, started REAL, finished REAL, error TEXT,
  PRIMARY KEY (run_id, name));
CREATE TABLE IF NOT EXISTS results (
  run_id TEXT, stage TEXT, label TEXT, model TEXT, family TEXT, dataset TEXT, split TEXT, dataset_hash TEXT,
  eval_version TEXT, map REAL, map50 REAL, ap_small REAL, ap_medium REAL, ap_large REAL, latency_ms REAL,
  latency_p95_ms REAL, latency_device TEXT, params_m REAL, peak_vram_mb REAL, metrics TEXT, created REAL,
  PRIMARY KEY (run_id, stage));
CREATE INDEX IF NOT EXISTS runs_status ON runs(status);
"""


@contextmanager
def db():
    runs_dir().mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(db_path(), timeout=30, isolation_level=None)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA journal_mode=WAL")
    con.execute("PRAGMA busy_timeout=30000")
    con.executescript(SCHEMA)
    try:
        yield con
    finally:
        con.close()


def run_dir(run_id: str) -> Path:
    return runs_dir() / run_id


def stage_dir(run_id: str, stage: str) -> Path:
    return run_dir(run_id) / "stages" / stage


def new_id(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:40] or "run"
    return f"{time.strftime('%Y%m%d-%H%M%S')}-{slug}-{secrets.token_hex(2)}"


def create_run(name: str, recipe_name: str, recipe_yaml: str, resolved: dict, group_id: str | None,
               tags: list[str] = (), status: str = "queued", rid: str | None = None) -> str:
    """`rid`: use this id (the agent mirrors runs the hub created) instead of a new one."""
    rid = rid or new_id(name)
    d = run_dir(rid)
    (d / "stages").mkdir(parents=True)
    (d / "recipe.yaml").write_text(recipe_yaml)
    (d / "resolved.json").write_text(json.dumps(resolved, indent=2))
    now = time.time()
    with db() as con:
        con.execute("INSERT INTO runs (id, name, recipe_name, group_id, status, created, dataset, tags, queue_pos) "
                    "VALUES (?,?,?,?,?,?,?,?,?)",
                    (rid, name, recipe_name, group_id, status, now, resolved.get("dataset"), json.dumps(list(tags)), now))
        for i, st in enumerate(resolved["stages"]):
            con.execute("INSERT INTO stages (run_id, name, type, idx, status) VALUES (?,?,?,?,?)",
                        (rid, st["name"], st["type"], i, "pending"))
    return rid


def get_run(run_id: str) -> dict | None:
    with db() as con:
        r = con.execute("SELECT * FROM runs WHERE id=?", (run_id,)).fetchone()
        if r is None:
            return None
        out = dict(r)
        out["tags"] = json.loads(out["tags"] or "[]")
        out["stages"] = [dict(s) for s in con.execute("SELECT * FROM stages WHERE run_id=? ORDER BY idx", (run_id,))]
        out["results"] = [_result_row(x) for x in con.execute("SELECT * FROM results WHERE run_id=?", (run_id,))]
    return out


def list_runs(status: str | None = None, limit: int = 500) -> list[dict]:
    q, args = "SELECT * FROM runs", []
    if status:
        q += " WHERE status IN (%s)" % ",".join("?" * len(status.split(",")))
        args = status.split(",")
    q += " ORDER BY created DESC LIMIT ?"
    with db() as con:
        rows = [dict(r) for r in con.execute(q, (*args, limit))]
    for r in rows:
        r["tags"] = json.loads(r["tags"] or "[]")
    return rows


def queue() -> list[dict]:
    with db() as con:
        return [dict(r) for r in con.execute(
            "SELECT * FROM runs WHERE status IN ('running','queued') ORDER BY status='running' DESC, queue_pos ASC")]


def update_run(run_id: str, **fields) -> None:
    if "tags" in fields:
        fields["tags"] = json.dumps(fields["tags"])
    with db() as con:
        con.execute(f"UPDATE runs SET {', '.join(f'{k}=?' for k in fields)} WHERE id=?", (*fields.values(), run_id))


def update_stage(run_id: str, stage: str, **fields) -> None:
    with db() as con:
        con.execute(f"UPDATE stages SET {', '.join(f'{k}=?' for k in fields)} WHERE run_id=? AND name=?",
                    (*fields.values(), run_id, stage))


def claim_next() -> dict | None:
    """Atomically move the first queued run to 'running' (single worker, but be safe)."""
    with db() as con:
        con.execute("BEGIN IMMEDIATE")
        r = con.execute("SELECT id FROM runs WHERE status='queued' ORDER BY queue_pos ASC LIMIT 1").fetchone()
        if r is None:
            con.execute("COMMIT")
            return None
        con.execute("UPDATE runs SET status='running', started=?, finished=NULL, error_tail=NULL, cancel_requested=0 "
                    "WHERE id=?", (time.time(), r["id"]))
        con.execute("COMMIT")
    return get_run(r["id"])


def requeue(run_id: str) -> None:
    """Back into the queue; finished stages are kept and skipped (resume at the first unfinished stage)."""
    with db() as con:
        con.execute("UPDATE runs SET status='queued', pid=NULL, cancel_requested=0, error_tail=NULL, finished=NULL, "
                    "queue_pos=? WHERE id=?", (time.time(), run_id))
        con.execute("UPDATE stages SET status='pending', error=NULL WHERE run_id=? AND status!='done'", (run_id,))


def request_cancel(run_id: str) -> str:
    r = get_run(run_id)
    if r is None:
        raise KeyError(run_id)
    if r["status"] == "queued":
        update_run(run_id, status="cancelled", finished=time.time())
        return "cancelled"
    if r["status"] == "running":
        update_run(run_id, cancel_requested=1)
        return "cancel requested"
    return r["status"]


def _result_row(r) -> dict:
    d = dict(r)
    d["metrics"] = json.loads(d["metrics"] or "{}")
    return d


def save_result(run_id: str, stage: str, res: dict) -> None:
    cols = ["label", "model", "family", "dataset", "split", "dataset_hash", "eval_version", "map", "map50", "ap_small",
            "ap_medium", "ap_large", "latency_ms", "latency_p95_ms", "latency_device", "params_m", "peak_vram_mb"]
    with db() as con:
        con.execute(f"INSERT OR REPLACE INTO results (run_id, stage, {', '.join(cols)}, metrics, created) "
                    f"VALUES (?,?,{','.join('?' * len(cols))},?,?)",
                    (run_id, stage, *[res.get(c) for c in cols], json.dumps(res), time.time()))


def results(limit: int = 2000) -> list[dict]:
    with db() as con:
        rows = [_result_row(r) for r in con.execute(
            "SELECT results.*, runs.name AS run_name, runs.tags AS tags, runs.notes AS notes, runs.status AS run_status, "
            "runs.group_id AS group_id FROM results JOIN runs ON runs.id = results.run_id ORDER BY results.created DESC LIMIT ?",
            (limit,))]
    for r in rows:
        r["tags"] = json.loads(r["tags"] or "[]")
    return rows


def delete_run(run_id: str) -> None:
    import shutil

    with db() as con:
        for t in ("results", "stages"):
            con.execute(f"DELETE FROM {t} WHERE run_id=?", (run_id,))
        con.execute("DELETE FROM runs WHERE id=?", (run_id,))
    shutil.rmtree(run_dir(run_id), ignore_errors=True)


def pid_alive(pid: int | None, must_contain: str = "") -> bool:
    if not pid:
        return False
    try:
        os.kill(pid, 0)
    except (ProcessLookupError, PermissionError):
        return False
    try:
        cmd = Path(f"/proc/{pid}/cmdline").read_bytes().replace(b"\0", b" ").decode()
        stat = Path(f"/proc/{pid}/stat").read_text()
        if stat.split(") ")[-1].startswith("Z"):  # zombie
            return False
        return must_contain in cmd
    except OSError:
        return True  # no /proc (not Linux): trust kill(0)


def tail(path: Path, n: int = 40) -> str:
    try:
        with open(path, "rb") as f:
            f.seek(0, 2)
            size = f.tell()
            f.seek(max(0, size - 64 * 1024))
            text = re.sub(r"\x1b\[[0-9;?]*[A-Za-z]", "", f.read().decode(errors="replace"))
            lines = [ln for ln in text.replace("\r", "\n").splitlines() if ln.strip()]
        return "\n".join(lines[-n:])
    except OSError:
        return ""
