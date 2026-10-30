"""Hub command line.

    python -m modellab.hub serve [--host 0.0.0.0] [--port $PORT]      # the web app (Railway runs this)
    python -m modellab.hub users list | add NAME [--admin] [--password P] | passwd NAME | disable NAME | enable NAME
    python -m modellab.hub release keygen                             # once: signing key pair for agent releases
    python -m modellab.hub release build [--out DIR]                  # tarball + unsigned manifest
    python -m modellab.hub release publish --hub URL                  # build, sign, upload (CI or by hand)
        signing key:  MODELLAB_RELEASE_SIGNING_KEY or --key-file;  upload token: MODELLAB_RELEASE_UPLOAD_TOKEN or --token
    python -m modellab.hub release publish --db DATABASE_URL          # same, written straight into a hub database
"""

from __future__ import annotations

import os

os.environ.setdefault("ALLOW_NETWORK", "1")

import argparse  # noqa: E402
import base64  # noqa: E402
import json  # noqa: E402
import sys  # noqa: E402
import urllib.error  # noqa: E402
import urllib.request  # noqa: E402
from pathlib import Path  # noqa: E402


def cmd_serve(a) -> int:
    import uvicorn

    from modellab.hub.app import create_app

    # timeout_graceful_shutdown: agents' long-polls and open log streams must not hold up a stop or redeploy
    uvicorn.run(create_app(), host=a.host, port=a.port, proxy_headers=True, forwarded_allow_ips="*", log_level="info",
                timeout_graceful_shutdown=10)
    return 0


def _engine():
    from modellab.hub import db, load_config

    eng = db.make_engine(load_config().database_url)
    db.init(eng)
    return eng


def cmd_users(a) -> int:
    import sqlalchemy as sa

    from modellab.hub import auth, db, model

    eng = _engine()
    with eng.begin() as c:
        if a.action == "list":
            for u in model.list_users(c):
                flags = ",".join(f for f, on in (("admin", u["is_admin"]), ("disabled", u["disabled"])) if on)
                print(f"{u['username']:<24} {flags:<16} machines={u['machines']}")
            return 0
        if not a.name:
            print("give a username", file=sys.stderr)
            return 2
        name = a.name.strip().lower()
        if a.action == "add":
            pw = a.password or auth.temp_password()
            model.create_user(c, name, pw, a.display_name or "", a.admin, must_change=not a.password)
            print(f"created {name}" + ("" if a.password else f" with temporary password: {pw}"))
            return 0
        row = c.execute(sa.select(db.users.c.id).where(db.users.c.username == name)).first()
        if row is None:
            print(f"no user {name!r}", file=sys.stderr)
            return 1
        if a.action == "passwd":
            pw = a.password or auth.temp_password()
            c.execute(db.users.update().where(db.users.c.id == row[0])
                      .values(password_hash=auth.hash_password(pw), must_change_password=not a.password))
            model.revoke_sessions(c, row[0])
            print(f"password of {name} set" + ("" if a.password else f" to the temporary password: {pw}"))
        elif a.action in ("disable", "enable"):
            c.execute(db.users.update().where(db.users.c.id == row[0]).values(disabled=a.action == "disable"))
            if a.action == "disable":
                model.revoke_sessions(c, row[0])
            print(f"{a.action}d {name}")
    return 0


def _signing_key(a) -> str:
    if a.key_file:
        return Path(a.key_file).read_text().strip()
    k = os.environ.get("MODELLAB_RELEASE_SIGNING_KEY", "").strip()
    if not k:
        raise SystemExit("no signing key: set MODELLAB_RELEASE_SIGNING_KEY or pass --key-file")
    return k


def cmd_release(a) -> int:
    from modellab import release

    if a.action == "keygen":
        priv, pub = release.keygen()
        print("Private key (keep secret: GitHub Actions secret MODELLAB_RELEASE_SIGNING_KEY, never on Railway):")
        print(f"  {priv}")
        print("Public key (Railway variable MODELLAB_RELEASE_PUBKEY):")
        print(f"  {pub}")
        return 0
    manifest, tarball = release.build(version=a.version)
    text = release.canonical(manifest).decode()
    if a.action == "build":
        out = Path(a.out or ".")
        out.mkdir(parents=True, exist_ok=True)
        (out / f"modellab-{manifest['version']}.tar.gz").write_bytes(tarball)
        (out / f"modellab-{manifest['version']}.manifest.json").write_text(text)
        print(json.dumps(manifest, indent=2))
        return 0
    key = _signing_key(a)
    sig = release.sign(text.encode(), key)
    print(f"[release] {manifest['version']}: {manifest['files']} files, {len(tarball) / 2**20:.2f} MB, "
          f"lock {manifest['lock_hash']}, public key {release.public_key_of(key)}")
    if a.db:
        from modellab.hub import Config, db, model

        eng = db.make_engine(a.db)
        db.init(eng)
        with eng.begin() as c:
            model.publish_release(c, Config(database_url=a.db, release_pubkey=release.public_key_of(key)), text, sig, tarball,
                                  by="cli")
        print(f"[release] published {manifest['version']} into the database (now current)")
        return 0
    if not a.hub:
        raise SystemExit("give --hub URL or --db DATABASE_URL")
    token = a.token or os.environ.get("MODELLAB_RELEASE_UPLOAD_TOKEN", "")
    body = json.dumps({"manifest": text, "signature": sig, "tarball_b64": base64.b64encode(tarball).decode()}).encode()
    req = urllib.request.Request(a.hub.rstrip("/") + "/api/releases/upload", data=body, method="POST",
                                 headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}",
                                          "X-ModelLab": "1"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            print(f"[release] published: {json.loads(r.read())['version']} (now current on {a.hub})")
    except urllib.error.HTTPError as e:
        print(f"[release] upload failed: {e.code} {e.read().decode(errors='replace')[:500]}", file=sys.stderr)
        return 1
    return 0


def main(argv=None) -> int:
    p = argparse.ArgumentParser(prog="python -m modellab.hub", description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("serve")
    s.add_argument("--host", default="0.0.0.0")
    s.add_argument("--port", type=int, default=int(os.environ.get("PORT", "8080")))
    s.set_defaults(fn=cmd_serve)
    u = sub.add_parser("users")
    u.add_argument("action", choices=["list", "add", "passwd", "disable", "enable"])
    u.add_argument("name", nargs="?")
    u.add_argument("--admin", action="store_true")
    u.add_argument("--password")
    u.add_argument("--display-name")
    u.set_defaults(fn=cmd_users)
    r = sub.add_parser("release")
    r.add_argument("action", choices=["keygen", "build", "publish"])
    r.add_argument("--version")
    r.add_argument("--out")
    r.add_argument("--hub")
    r.add_argument("--db")
    r.add_argument("--token")
    r.add_argument("--key-file")
    r.set_defaults(fn=cmd_release)
    a = p.parse_args(argv)
    return a.fn(a)


if __name__ == "__main__":
    sys.exit(main())
