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

searches = sa.Table(
    "searches", md,
    Column("id", String(32), primary_key=True),
    Column("owner_id", String(32), nullable=False, index=True),
    Column("name", Text), Column("status", String(16), nullable=False),  # running | done | failed | cancelled
    Column("phase", String(16)),  # speed | rungs | seeds | done
    Column("spec", Text), Column("state", Text), Column("recommendation", Text), Column("message", Text),
    Column("rev", Integer, nullable=False, default=0),  # optimistic lock: advance() only writes on the rev it read
    Column("created", Float), Column("updated", Float), Column("finished", Float),
)

assistant = sa.Table(
    "assistant", md,  # Yeti, per user: the Claude API key (encrypted, modellab/hub/yeti.py) and the chosen model
    Column("user_id", String(32), primary_key=True),
    Column("api_key", Text), Column("key_hint", String(16)),
    Column("model", String(64)), Column("effort", String(16)), Column("updated", Float),
)

system1 = sa.Table(
    "system1", md,  # per user: the OpenRouter key for the decision model (encrypted, modellab/hub/system1/service.py)
    Column("user_id", String(32), primary_key=True),
    Column("api_key", Text), Column("key_hint", String(16)), Column("updated", Float),
)

agent_log = sa.Table(
    "agent_log", md,  # every sentence System 1 decided on: the decision, how sure it was, and what became of it
    Column("id", String(32), primary_key=True),
    Column("user_id", String(32), nullable=False, index=True), Column("created", Float, index=True),
    Column("sentence", Text), Column("page_kind", String(16)), Column("model", String(64)),
    Column("fast", Boolean, nullable=False, default=False),  # acted on without Claude
    Column("action", String(40)), Column("tier", String(12)), Column("intent", String(12)),
    Column("values_json", Text), Column("confidence", Float), Column("reason", Text), Column("ms", Float),
    Column("outcome", String(12)),  # approved | declined | done | failed (set by the web app)
    Column("outcome_note", Text), Column("outcome_time", Float),
)

diagnoses = sa.Table(
    "diagnoses", md,  # what the decision model made of a failed run's error, asked once (system1/failures.py)
    Column("run_id", String(80), primary_key=True),
    Column("signature", String(32)),  # a catalogue id, or "none"
    Column("confidence", Float), Column("model", String(64)), Column("created", Float),
)

notebook = sa.Table(
    "notebook", md,  # the lab's memory: a question in the user's words, what tested it, the answer (hub/notebook.py)
    Column("id", String(32), primary_key=True),
    Column("owner_id", String(32), nullable=False, index=True),
    Column("title", Text), Column("question", Text), Column("plan", Text), Column("answer", Text),
    Column("status", String(12), nullable=False, default="open"),  # open | answered | dropped
    Column("status_reason", Text),  # why it was dropped
    Column("author", String(12)), Column("updated_by", String(12)),  # user | claude | loop
    Column("created", Float), Column("updated", Float, index=True),
)

notebook_links = sa.Table(
    "notebook_links", md,  # the runs and searches that tested an entry (links, not copies)
    Column("entry_id", String(32), primary_key=True), Column("kind", String(8), primary_key=True),  # run | search
    Column("ref_id", String(80), primary_key=True, index=True), Column("added", Float),
)

agents = sa.Table(
    "agents", md,  # the assistants a user talks to: a name, a look and a role; each has one thread (hub/agents.py)
    Column("id", String(32), primary_key=True),
    Column("owner_id", String(32), nullable=False, index=True),
    Column("name", String(40), nullable=False),
    Column("look", Text),  # JSON: {"base": "bloom"} for a built-in mascot, or a make-your-own look (shape, colour, eyes...)
    Column("role", Text),  # what it is for, in the user's words: it goes into the agent's prompt
    Column("position", Integer, default=0), Column("read_upto", Float, default=0),  # the user has seen its messages up to here
    Column("created", Float), Column("updated", Float),
)

agent_messages = sa.Table(
    "agent_messages", md,  # an agent's thread, kept on the hub so it can receive a result while no page is open
    Column("id", String(32), primary_key=True),
    Column("agent_id", String(32), nullable=False, index=True), Column("owner_id", String(32), nullable=False, index=True),
    Column("role", String(8), nullable=False),  # user | agent | event (the hub's own report of what happened to a plan)
    Column("kind", String(8), nullable=False),  # text | card (one action and what became of it) | plan
    Column("text", Text), Column("data", Text),  # data: JSON (the page context, tools used, a card's decision and state...)
    Column("created", Float, index=True),
)

agent_notes = sa.Table(
    "agent_notes", md,  # what the agents keep in mind about a user: corrections and standing preferences
    Column("id", String(32), primary_key=True),
    Column("owner_id", String(32), nullable=False, index=True),
    Column("text", Text, nullable=False), Column("by", String(40)),  # who wrote it: the user, or an agent's name
    Column("created", Float), Column("updated", Float),
)

plans = sa.Table(
    "plans", md,  # several typed steps the user approved once, carried out on the hub (hub/plans.py)
    Column("id", String(32), primary_key=True),
    Column("owner_id", String(32), nullable=False, index=True), Column("agent_id", String(32), index=True),
    Column("title", Text), Column("goal", Text),
    Column("status", String(12), nullable=False),  # proposed | running | waiting | done | cancelled | declined
    Column("steps", Text),  # JSON: the typed steps, each with its state (written from what happened to its run)
    Column("envelope", Text),  # JSON: what the approval covers (machines, datasets, GPU seconds, tries per step)
    Column("pending", Text),  # JSON: a revision that goes beyond the envelope and waits for the user's OK
    Column("message", Text), Column("notebook_entry", String(32)), Column("spent_s", Float, default=0),
    Column("rev", Integer, nullable=False, default=0),  # optimistic lock, as for searches
    Column("created", Float), Column("updated", Float, index=True), Column("approved", Float), Column("finished", Float),
)

oauth_clients = sa.Table(
    "oauth_clients", md,  # Claude apps registered for the MCP connector (OAuth dynamic client registration)
    Column("id", String(64), primary_key=True),
    Column("name", String(200)), Column("redirect_uris", Text, nullable=False),
    Column("auth_method", String(32), nullable=False, default="none"),  # none | client_secret_post | client_secret_basic
    Column("secret_hash", String(64)),
    Column("created", Float), Column("ip", String(64)),
)

oauth_codes = sa.Table(
    "oauth_codes", md,  # one-time authorization codes (stored hashed), 10 minutes
    Column("code_hash", String(64), primary_key=True),
    Column("client_id", String(64), nullable=False), Column("user_id", String(32), nullable=False),
    Column("redirect_uri", Text, nullable=False), Column("challenge", String(128), nullable=False),
    Column("scope", String(200)), Column("resource", Text),
    Column("created", Float), Column("expires", Float), Column("used", Boolean, nullable=False, default=False),
)

oauth_tokens = sa.Table(
    "oauth_tokens", md,  # access (1 h) and refresh (30 days, rotated) tokens, stored hashed
    Column("token_hash", String(64), primary_key=True),
    Column("kind", String(8), nullable=False),  # access | refresh
    Column("family", String(32), nullable=False),  # one grant: a reused refresh token revokes the whole family
    Column("client_id", String(64), nullable=False), Column("user_id", String(32), nullable=False, index=True),
    Column("scope", String(200)), Column("resource", Text),
    Column("created", Float), Column("expires", Float), Column("last_used", Float),
    Column("revoked", Boolean, nullable=False, default=False),
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
