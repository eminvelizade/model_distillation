"""ModelLab Hub: the hosted web app (Railway) that users log into. GPU work runs on each user's own PCs, in the agent
(modellab/agent). See docs/HUB.md.

Configuration (environment variables):
  DATABASE_URL                    Postgres URL (Railway sets it from the Postgres service); default: SQLite hub.sqlite
  MODELLAB_PUBLIC_URL             https://... address agents and the install command use; default: https://$RAILWAY_PUBLIC_DOMAIN
  MODELLAB_ADMIN_USER / _PASSWORD first admin, created on start when there are no users yet
  MODELLAB_RELEASE_PUBKEY         Ed25519 public key (base64) that agent releases are signed with
  MODELLAB_RELEASE_UPLOAD_TOKEN   bearer token CI uses to upload signed releases
  MODELLAB_INSECURE_COOKIES=1     allow login over plain http (local development only)
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field

# The hub is a network service: it must not get offline_guard's socket block (imported via modellab.catalog).
os.environ.setdefault("ALLOW_NETWORK", "1")

from modellab import ROOT  # noqa: E402


@dataclass
class Config:
    database_url: str = field(default_factory=lambda: f"sqlite:///{ROOT / 'hub.sqlite'}")
    public_url: str | None = None
    secure_cookies: bool = True
    admin_user: str | None = None
    admin_password: str | None = None
    release_pubkey: str | None = None
    release_upload_token: str | None = None
    session_days: float = 30.0
    online_after_s: float = 30.0  # a machine counts as online if its last heartbeat is this recent
    pairing_minutes: float = 10.0


def load_config() -> Config:
    e = os.environ
    public = e.get("MODELLAB_PUBLIC_URL") or (f"https://{e['RAILWAY_PUBLIC_DOMAIN']}" if e.get("RAILWAY_PUBLIC_DOMAIN") else None)
    return Config(
        database_url=e.get("DATABASE_URL") or f"sqlite:///{ROOT / 'hub.sqlite'}",
        public_url=public.rstrip("/") if public else None,
        secure_cookies=e.get("MODELLAB_INSECURE_COOKIES") != "1",
        admin_user=e.get("MODELLAB_ADMIN_USER") or None,
        admin_password=e.get("MODELLAB_ADMIN_PASSWORD") or None,
        release_pubkey=e.get("MODELLAB_RELEASE_PUBKEY") or None,
        release_upload_token=e.get("MODELLAB_RELEASE_UPLOAD_TOKEN") or None,
    )
