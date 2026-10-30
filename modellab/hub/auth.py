"""Accounts and sessions: scrypt password hashes, random session tokens stored hashed, login throttling.

There is no sign-up: an admin creates users (Team page or `python -m modellab.hub users add`). Session cookies are
HttpOnly + Secure + SameSite=Lax; state-changing /api requests must also carry the X-ModelLab header (app.py), which a
cross-site form cannot send.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import re
import secrets
import threading
import time
from collections import defaultdict, deque

import sqlalchemy as sa
from fastapi import HTTPException, Request

from modellab.hub import db

COOKIE = "modellab_session"
USERNAME_RE = re.compile(r"^[a-z0-9][a-z0-9_.-]{1,31}$")
_N, _R, _P = 2**15, 8, 1


def _b64(b: bytes) -> str:
    return base64.b64encode(b).decode()


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    h = hashlib.scrypt(password.encode(), salt=salt, n=_N, r=_R, p=_P, maxmem=64 * 2**20, dklen=32)
    return f"scrypt${_N}${_R}${_P}${_b64(salt)}${_b64(h)}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algo, n, r, p, salt, h = stored.split("$")
        if algo != "scrypt":
            return False
        got = hashlib.scrypt(password.encode(), salt=base64.b64decode(salt), n=int(n), r=int(r), p=int(p),
                             maxmem=64 * 2**20, dklen=32)
        return hmac.compare_digest(got, base64.b64decode(h))
    except (ValueError, TypeError):
        return False


_DUMMY: list[str] = []


def burn_time(password: str) -> None:
    """Same work as a real check, so a missing username doesn't answer faster than a wrong password."""
    if not _DUMMY:
        _DUMMY.append(hash_password(secrets.token_hex(8)))
    verify_password(password, _DUMMY[0])


def check_password_rules(password: str) -> None:
    if not 8 <= len(password) <= 256:
        raise HTTPException(422, "password must be 8-256 characters")


def check_username(username: str) -> str:
    u = username.strip().lower()
    if not USERNAME_RE.match(u):
        raise HTTPException(422, "username: 2-32 characters, lowercase letters, digits, '.', '_' or '-'")
    return u


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def temp_password() -> str:
    alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    return "-".join("".join(secrets.choice(alphabet) for _ in range(4)) for _ in range(4))


class Throttle:
    """At most `limit` failures per key within `window` seconds (in memory: the hub runs as one process)."""

    def __init__(self, limit: int, window: float):
        self.limit, self.window = limit, window
        self._hits: dict[str, deque] = defaultdict(deque)
        self._lock = threading.Lock()

    def _trim(self, key: str, now: float) -> deque:
        q = self._hits[key]
        while q and now - q[0] > self.window:
            q.popleft()
        return q

    def blocked(self, key: str) -> float:
        """Seconds until the key may try again (0 = allowed)."""
        now = time.time()
        with self._lock:
            q = self._trim(key, now)
            return max(0.0, self.window - (now - q[0])) if len(q) >= self.limit else 0.0

    def fail(self, key: str) -> None:
        with self._lock:
            self._trim(key, time.time()).append(time.time())

    def reset(self, key: str) -> None:
        with self._lock:
            self._hits.pop(key, None)


LOGIN_USER = Throttle(limit=5, window=15 * 60)
LOGIN_IP = Throttle(limit=30, window=15 * 60)
PAIR_IP = Throttle(limit=20, window=10 * 60)


def client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")  # Railway's proxy; the first entry is the client
    return (fwd.split(",")[0].strip() if fwd else (request.client.host if request.client else "?"))[:64]


def create_session(conn: sa.Connection, user_id: str, request: Request, days: float) -> str:
    token = secrets.token_urlsafe(32)
    now = time.time()
    conn.execute(db.sessions.insert().values(token_hash=token_hash(token), user_id=user_id, created=now,
                                             expires=now + days * 86400, last_seen=now, ip=client_ip(request),
                                             user_agent=(request.headers.get("user-agent") or "")[:256]))
    conn.execute(db.sessions.delete().where(db.sessions.c.expires < now))
    return token


def public_user(u) -> dict:
    return {"id": u["id"], "username": u["username"], "display_name": u["display_name"] or u["username"],
            "is_admin": bool(u["is_admin"]), "must_change_password": bool(u["must_change_password"])}


def session_user(conn: sa.Connection, token: str | None) -> dict | None:
    if not token:
        return None
    th = token_hash(token)
    row = conn.execute(sa.select(db.users, db.sessions.c.expires, db.sessions.c.last_seen)
                       .join(db.sessions, db.sessions.c.user_id == db.users.c.id)
                       .where(db.sessions.c.token_hash == th)).mappings().first()
    now = time.time()
    if row is None or row["expires"] < now or row["disabled"]:
        return None
    if now - (row["last_seen"] or 0) > 60:
        conn.execute(db.sessions.update().where(db.sessions.c.token_hash == th).values(last_seen=now))
    return dict(row)


def current_user(request: Request) -> dict:
    with request.app.state.engine.begin() as c:
        u = session_user(c, request.cookies.get(COOKIE))
    if u is None:
        raise HTTPException(401, "not logged in")
    return u


def require_admin(request: Request) -> dict:
    u = current_user(request)
    if not u["is_admin"]:
        raise HTTPException(403, "admins only")
    return u
