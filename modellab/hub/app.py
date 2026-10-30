"""The hub web app: user API, agent API, installer and the prebuilt UI, with security headers and a CSRF check.

    python -m modellab.hub serve          # Railway runs this (see Dockerfile)
"""

from __future__ import annotations

import base64
import hashlib
import re

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse

from modellab import ROOT
from modellab.hub import Config, agent_api, api, browse, db, load_config, model

WEB_DIST = ROOT / "modellab" / "web" / "dist"
INSTALLER = ROOT / "modellab" / "hub" / "install.sh"
MUTATING = {"POST", "PUT", "PATCH", "DELETE"}
MAX_BODY = 16 * 2**20
MAX_RELEASE_BODY = 96 * 2**20


def _csp() -> str:
    """Scripts only from the bundle, plus the inline theme script of index.html (allowed by its hash)."""
    hashes = []
    index = WEB_DIST / "index.html"
    if index.is_file():
        for body in re.findall(r"<script>(.*?)</script>", index.read_text(), re.S):
            hashes.append("'sha256-" + base64.b64encode(hashlib.sha256(body.encode()).digest()).decode() + "'")
    return ("default-src 'self'; script-src 'self' " + " ".join(hashes) + "; style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; "
            "base-uri 'self'; form-action 'self'; object-src 'none'")


def create_app(cfg: Config | None = None) -> FastAPI:
    cfg = cfg or load_config()
    engine = db.make_engine(cfg.database_url)
    db.init(engine)
    admin = model.bootstrap_admin(engine, cfg)
    if admin:
        print(f"[hub] created the first admin user {admin!r} from MODELLAB_ADMIN_USER", flush=True)

    app = FastAPI(title="ModelLab Hub", docs_url=None, redoc_url=None, openapi_url=None)
    app.state.cfg, app.state.engine = cfg, engine
    app.state.browse = browse.Broker()
    csp = _csp()

    @app.middleware("http")
    async def guard(request: Request, call_next):
        path = request.url.path
        size = int(request.headers.get("content-length") or 0)
        if size > (MAX_RELEASE_BODY if path == "/api/releases/upload" else MAX_BODY):
            return JSONResponse({"detail": "request body too large"}, status_code=413)
        # CSRF: state-changing browser calls must carry a header that cross-site forms cannot set
        if path.startswith("/api/") and request.method in MUTATING and request.headers.get("x-modellab") != "1":
            return JSONResponse({"detail": "missing X-ModelLab header"}, status_code=403)
        resp = await call_next(request)
        resp.headers.setdefault("X-Content-Type-Options", "nosniff")
        resp.headers.setdefault("X-Frame-Options", "DENY")
        resp.headers.setdefault("Referrer-Policy", "same-origin")
        resp.headers.setdefault("Content-Security-Policy", csp)
        if cfg.secure_cookies:
            resp.headers.setdefault("Strict-Transport-Security", "max-age=31536000")
        if path.startswith("/api/") or path.startswith("/agent/"):
            resp.headers.setdefault("Cache-Control", "no-store")
        return resp

    app.include_router(api.router)
    app.include_router(agent_api.router)

    @app.get("/healthz", include_in_schema=False)
    def healthz():
        with engine.connect() as c:
            c.exec_driver_sql("SELECT 1")
        return {"ok": True}

    @app.get("/install.sh", include_in_schema=False)
    def install_sh(request: Request):
        text = INSTALLER.read_text()
        text = text.replace("__HUB_URL__", api.public_url(request)).replace("__RELEASE_PUBKEY__", cfg.release_pubkey or "")
        return PlainTextResponse(text, media_type="text/x-shellscript")

    @app.get("/{path:path}", include_in_schema=False)
    def ui(path: str):
        if path.startswith(("api/", "agent/")):
            return JSONResponse({"detail": "not found"}, status_code=404)
        f = (WEB_DIST / path).resolve()
        if path and WEB_DIST.resolve() in f.parents and f.is_file():
            cache = "public, max-age=31536000, immutable" if path.startswith("assets/") else "no-cache"
            return FileResponse(f, headers={"Cache-Control": cache})
        index = WEB_DIST / "index.html"
        if not index.is_file():
            return JSONResponse({"detail": "UI not built: cd modellab/web && npm ci && npm run build"}, status_code=503)
        return FileResponse(index, headers={"Cache-Control": "no-cache"})

    return app
