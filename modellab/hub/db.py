"""Hub database: SQLAlchemy Core tables. Postgres on Railway (DATABASE_URL), SQLite for development and tests.

Times are epoch seconds (float) and JSON values are stored as text, as in the local run store (modellab/store.py),
so both stores read the same way.
"""

from __future__ import annotations

import json
import re
import secrets
import time

import sqlalchemy as sa
from sqlalchemy import Boolean, Column, Float, Index, Integer, LargeBinary, String, Text, UniqueConstraint

SCHEMA_VERSION = "1"
md = sa.MetaData()

users = sa.Table(
    "users", md,
    Column("id", String(32), primary_key=True),
    Column("username", String(64), nullable=False, unique=True),
    Column("display_name", String(128), nullable=False, default=""),
    Column("password_hash", Text, nullable=False),
    Column("is_admin", Boolean, nullable=False, default=False),
    Column("disabled", Boolean, nullable=False, default=False),
    Column("must_change_password", Boolean, nullable=False, default=False),
    Column("created", Float), Column("last_login", Float),
)

sessions = sa.Table(
    "sessions", md,
    Column("token_hash", String(64), primary_key=True),
    Column("user_id", String(32), nullable=False, index=True),
    Column("created", Float), Column("expires", Float), Column("last_seen", Float),
    Column("ip", String(64)), Column("user_agent", String(256)),
)

pairing_codes = sa.Table(
    "pairing_codes", md,
    Column("id", String(32), primary_key=True),  # what the UI polls; the code itself is only stored hashed
    Column("code_hash", String(64), nullable=False, unique=True),
    Column("user_id", String(32), nullable=False),
    Column("name", String(64), nullable=False),
    Column("created", Float), Column("expires", Float), Column("used", Float), Column("machine_id", String(32)),
)

machines = sa.Table(
    "machines", md,
    Column("id", String(32), primary_key=True),
    Column("owner_id", String(32), nullable=False, index=True),
    Column("name", String(64), nullable=False),
    Column("token_hash", String(64), nullable=False, unique=True),
    Column("created", Float), Column("last_seen", Float), Column("revoked", Boolean, nullable=False, default=False),
    Column("hostname", String(255)), Column("agent_version", String(64)), Column("release", String(128)),
    Column("state", String(32)),  # idle | running | preparing | updating | command (from the heartbeat)
    Column("current_run", String(80)),
    Column("report", Text), Column("report_time", Float),  # doctor report: hardware, checks, datasets, weights
    Column("live", Text),  # latest live telemetry (GPU util/VRAM/temperature/power, CPU, RAM)
    Column("update_status", Text),  # last update attempt {version, ok, error, time}
)

commands = sa.Table(
    "commands", md,
    Column("id", String(32), primary_key=True),
    Column("machine_id", String(32), nullable=False, index=True),
    Column("user_id", String(32), nullable=False),
    Column("type", String(32), nullable=False),
    Column("args", Text), Column("status", String(16), nullable=False),  # pending | sent | running | done | failed
    Column("result", Text), Column("error", Text), Column("log", Text),
    Column("created", Float), Column("started", Float), Column("finished", Float),
)

runs = sa.Table(
    "runs", md,
    Column("id", String(80), primary_key=True),
    Column("owner_id", String(32), nullable=False, index=True),
    Column("machine_id", String(32), nullable=False, index=True),
    Column("name", Text), Column("recipe_name", Text), Column("group_id", String(64)),
    Column("status", String(16), nullable=False), Column("status_message", Text),
    Column("created", Float), Column("started", Float), Column("finished", Float), Column("updated", Float),
    Column("dataset", Text), Column("cancel_requested", Boolean, nullable=False, default=False),
    Column("error_tail", Text), Column("tags", Text, default="[]"), Column("notes", Text, default=""),
    Column("current_stage", Text), Column("queue_pos", Float),
    Column("recipe_yaml", Text), Column("resolved", Text), Column("env", Text), Column("datasets_info", Text),
    Column("metrics", Text),
)
Index("runs_machine_status", runs.c.machine_id, runs.c.status)

stages = sa.Table(
    "stages", md,
    Column("run_id", String(80), primary_key=True), Column("name", String(64), primary_key=True),
    Column("type", String(16)), Column("idx", Integer), Column("status", String(16)),
    Column("started", Float), Column("finished", Float), Column("error", Text),
    Column("progress", Text), Column("result", Text), Column("artifacts", Text),
)

RESULT_COLS = ["label", "model", "family", "dataset", "split", "dataset_hash", "eval_version", "map", "map50", "ap_small",
               "ap_medium", "ap_large", "latency_ms", "latency_p95_ms", "latency_device", "params_m", "peak_vram_mb"]
_RESULT_TYPES = {"map": Float, "map50": Float, "ap_small": Float, "ap_medium": Float, "ap_large": Float,
                 "latency_ms": Float, "latency_p95_ms": Float, "params_m": Float, "peak_vram_mb": Float}
results = sa.Table(
    "results", md,
    Column("run_id", String(80), primary_key=True), Column("stage", String(64), primary_key=True),
    Column("owner_id", String(32), nullable=False, index=True), Column("machine_id", String(32)),
    *[Column(c, _RESULT_TYPES.get(c, Text)()) for c in RESULT_COLS],
    Column("metrics", Text), Column("created", Float),
)

logs = sa.Table(
    "logs", md,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("run_id", String(80), nullable=False), Column("stream", String(64), nullable=False),
    Column("offset", Integer, nullable=False),  # byte offset in the agent's log file (dedupes resent chunks)
    Column("size", Integer, nullable=False), Column("text", Text, nullable=False), Column("created", Float),
    UniqueConstraint("run_id", "stream", "offset", name="logs_chunk"),
)
Index("logs_run_stream", logs.c.run_id, logs.c.stream, logs.c.id)

files = sa.Table(
    "files", md,
    Column("run_id", String(80), primary_key=True), Column("path", String(512), primary_key=True),
    Column("content", LargeBinary, nullable=False), Column("size", Integer), Column("content_type", String(128)),
    Column("mtime", Float), Column("created", Float),
)

releases = sa.Table(
    "releases", md,
    Column("version", String(128), primary_key=True),
    Column("manifest", Text, nullable=False),  # canonical JSON: exactly the signed bytes
    Column("signature", Text, nullable=False),
    Column("tarball", LargeBinary, nullable=False),
    Column("created", Float), Column("published_by", String(64)),
)

settings = sa.Table(
    "settings", md,
    Column("key", String(64), primary_key=True), Column("value", Text),
)


def make_engine(url: str) -> sa.Engine:
    """postgres:// and postgresql:// URLs (Railway's DATABASE_URL) use psycopg 3."""
    url = re.sub(r"^postgres(ql)?://", "postgresql+psycopg://", url)
    if url.startswith("sqlite"):
        eng = sa.create_engine(url, connect_args={"check_same_thread": False, "timeout": 30})

        @sa.event.listens_for(eng, "connect")
        def _pragmas(con, _rec):  # noqa: ANN001
            con.execute("PRAGMA journal_mode=WAL")
            con.execute("PRAGMA busy_timeout=30000")
            con.execute("PRAGMA foreign_keys=OFF")

        return eng
    return sa.create_engine(url, pool_pre_ping=True, pool_size=5, max_overflow=10)


def init(engine: sa.Engine) -> None:
    md.create_all(engine)
    with engine.begin() as c:
        upsert(c, settings, {"key": "schema_version", "value": SCHEMA_VERSION}, ["key"])


def upsert(conn: sa.Connection, table: sa.Table, values: dict, keys: list[str]) -> None:
    if conn.dialect.name == "postgresql":
        from sqlalchemy.dialects.postgresql import insert
    else:
        from sqlalchemy.dialects.sqlite import insert
    stmt = insert(table).values(**values)
    update = {k: stmt.excluded[k] for k in values if k not in keys}
    conn.execute(stmt.on_conflict_do_update(index_elements=keys, set_=update) if update else stmt.on_conflict_do_nothing())


def get_setting(conn: sa.Connection, key: str) -> str | None:
    return conn.execute(sa.select(settings.c.value).where(settings.c.key == key)).scalar()


def set_setting(conn: sa.Connection, key: str, value: str | None) -> None:
    if value is None:
        conn.execute(settings.delete().where(settings.c.key == key))
    else:
        upsert(conn, settings, {"key": key, "value": value}, ["key"])


def dumps(v) -> str | None:
    return None if v is None else json.dumps(v, default=str)


def loads(s: str | None, default=None):
    if s is None or s == "":
        return default
    try:
        return json.loads(s)
    except ValueError:
        return default


def new_id() -> str:
    return secrets.token_hex(8)


def run_id(name: str) -> str:
    """Same shape as the local store's ids (modellab.store.new_id), which agents use as their local run ids."""
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:40] or "run"
    return f"{time.strftime('%Y%m%d-%H%M%S')}-{slug}-{secrets.token_hex(3)}"


RUN_ID_RE = re.compile(r"^[0-9]{8}-[0-9]{6}-[a-z0-9-]{1,40}-[0-9a-f]{4,6}$")
