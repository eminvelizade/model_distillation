"""Hub + agent test fixtures. SQLite by default; MODELLAB_TEST_POSTGRES=1 runs the same tests on a real PostgreSQL
(pip install pgserver), the database Railway uses.

    python -m pytest tests/hub -q                                  # hub + agent unit tests (no torch needed)
    MODELLAB_TEST_POSTGRES=1 python -m pytest tests/hub -q         # same on PostgreSQL
    python -m pytest tests/hub/test_e2e.py -q                      # hub + real agent + a tiny CPU run (needs the full env)
"""

import os
import secrets
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
os.environ.setdefault("ALLOW_NETWORK", "1")  # the hub is a server; training children of the agent still get the guard

H = {"X-ModelLab": "1"}
ADMIN = ("admin", "admin-pass-1")


@pytest.fixture(scope="session")
def pg_uri(tmp_path_factory):
    import pgserver

    srv = pgserver.get_server(str(tmp_path_factory.mktemp("pg")), cleanup_mode="stop")
    yield srv.get_uri()


@pytest.fixture()
def db_url(tmp_path, request):
    if os.environ.get("MODELLAB_TEST_POSTGRES") != "1":
        return f"sqlite:///{tmp_path}/hub.sqlite"
    import psycopg

    base = request.getfixturevalue("pg_uri")
    name = f"t_{secrets.token_hex(4)}"
    with psycopg.connect(base.replace("postgresql://", "postgresql://", 1), autocommit=True) as con:
        con.execute(f"CREATE DATABASE {name}")
    return base.replace("/postgres?", f"/{name}?", 1)


@pytest.fixture()
def hub(db_url):
    from modellab import release
    from modellab.hub import Config, auth
    from modellab.hub.app import create_app

    for t in (auth.LOGIN_USER, auth.LOGIN_IP, auth.PAIR_IP):
        t._hits.clear()
    priv, pub = release.keygen()
    cfg = Config(database_url=db_url, admin_user=ADMIN[0], admin_password=ADMIN[1], secure_cookies=False,
                 release_pubkey=pub, release_upload_token="up-token")
    app = create_app(cfg)
    app.state.signing_key = priv
    return app


def client(app):
    from fastapi.testclient import TestClient

    return TestClient(app)


def login(app, username=ADMIN[0], password=ADMIN[1]):
    c = client(app)
    r = c.post("/api/auth/login", json={"username": username, "password": password}, headers=H)
    assert r.status_code == 200, r.text
    c.headers.update(H)
    return c


def pair(app, user, name="box"):
    """-> (agent client with its machine token, machine id)."""
    p = user.post("/api/machines/pair", json={"name": name}).json()
    a = client(app)
    r = a.post("/agent/v1/pair", json={"code": p["code"], "hostname": "pc", "agent_version": "test"})
    assert r.status_code == 200, r.text
    a.headers["Authorization"] = f"Bearer {r.json()['token']}"
    return a, r.json()["machine_id"]


def report(agent, datasets=("tiny",), weights=("rfdetr/nano",)):
    rep = {"hardware": {"gpus": [{"index": 0, "name": "RTX 5090", "memory_gb": 31.4}], "driver": "575.64"},
           "checks": [{"id": "driver", "label": "NVIDIA driver", "status": "ok", "value": "575.64", "detail": ""}],
           "datasets": [{"name": d, "path": f"/data/{d}", "built": True, "classes": ["car"]} for d in datasets],
           "weights": {k: {"present": True, "verified": True, "size": 1} for k in weights}}
    r = agent.post("/agent/v1/report", json=rep)
    assert r.status_code == 200, r.text


RECIPE = """name: t
dataset: tiny
stages:
  - {name: f, type: finetune, model: rfdetr/nano, budget: {epochs: 1}}
  - {name: e, type: eval, model: {from: f}}
"""
