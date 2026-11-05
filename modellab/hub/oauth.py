"""OAuth 2.1 for the MCP connector: a Claude app (claude.ai, Claude Desktop, Claude mobile, Claude Code) reads one
user's ModelLab data through the MCP server (modellab/hub/mcp.py) after that user approves it once, signed in to the
hub as usual. Claude then runs on the user's own Claude subscription.

    Claude app ── GET /mcp (401, WWW-Authenticate) ──▶ /.well-known/oauth-protected-resource ──▶ authorization server
               ── POST /oauth/register (dynamic client registration, RFC 7591)
               ── browser: GET /oauth/authorize ─▶ sign in ─▶ consent page ─▶ POST ─▶ redirect with a one-time code
               ── POST /oauth/token (code + PKCE verifier) ─▶ access token (1 h) + refresh token (30 days, rotated)

PKCE with S256 is required, redirect URIs must match the registered ones exactly (any port for loopback http, as
RFC 8252 allows), codes are single-use, and every token is stored hashed. Reusing a refresh token that was already
rotated revokes the whole grant. Yeti's settings list the connected apps and revoke them.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import html
import json
import secrets
import time
from pathlib import Path
from urllib.parse import parse_qs, quote, urlencode, urlsplit

import sqlalchemy as sa
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse

from modellab.hub import auth, db

router = APIRouter()
SCOPE = "modellab.read"
CODE_TTL, ACCESS_TTL, REFRESH_TTL = 600, 3600, 30 * 86400
MAX_CLIENTS = 500
REGISTER_IP = auth.Throttle(limit=30, window=3600)
TOKEN_FAIL_IP = auth.Throttle(limit=30, window=600)
AUTH_METHODS = ("none", "client_secret_post", "client_secret_basic")


def issuer(request: Request) -> str:
    from modellab.hub import api

    return api.public_url(request)


def resource_url(request: Request) -> str:
    return issuer(request) + "/mcp"


def _hash(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()


def _eng(request: Request) -> sa.Engine:
    return request.app.state.engine


def _no_store(resp):
    resp.headers["Cache-Control"] = "no-store"
    resp.headers["Pragma"] = "no-cache"
    return resp


def _oauth_error(error: str, desc: str, status: int = 400, headers: dict | None = None) -> JSONResponse:
    return _no_store(JSONResponse({"error": error, "error_description": desc}, status_code=status, headers=headers))


# ---------------------------------------------------------------- discovery

@router.get("/.well-known/oauth-protected-resource", include_in_schema=False)
@router.get("/.well-known/oauth-protected-resource/mcp", include_in_schema=False)
def protected_resource(request: Request):
    return {"resource": resource_url(request), "authorization_servers": [issuer(request)], "scopes_supported": [SCOPE],
            "bearer_methods_supported": ["header"], "resource_name": "ModelLab"}


@router.get("/.well-known/oauth-authorization-server", include_in_schema=False)
@router.get("/.well-known/oauth-authorization-server/mcp", include_in_schema=False)
def authorization_server(request: Request):
    base = issuer(request)
    return {"issuer": base, "authorization_endpoint": f"{base}/oauth/authorize", "token_endpoint": f"{base}/oauth/token",
            "registration_endpoint": f"{base}/oauth/register", "revocation_endpoint": f"{base}/oauth/revoke",
            "scopes_supported": [SCOPE], "response_types_supported": ["code"], "response_modes_supported": ["query"],
            "grant_types_supported": ["authorization_code", "refresh_token"], "code_challenge_methods_supported": ["S256"],
            "token_endpoint_auth_methods_supported": list(AUTH_METHODS),
            "revocation_endpoint_auth_methods_supported": list(AUTH_METHODS),
            "authorization_response_iss_parameter_supported": True}


# ---------------------------------------------------------------- client registration (RFC 7591)

def redirect_ok(uri: str) -> bool:
    """https anywhere, or http on the loopback interface (native apps such as Claude Code); no fragments."""
    if not isinstance(uri, str) or not 8 <= len(uri) <= 500 or any(ch.isspace() for ch in uri):
        return False
    try:
        u = urlsplit(uri)
        _ = u.port
    except ValueError:
        return False
    if u.fragment or not u.hostname:
        return False
    if u.scheme == "https":
        return True
    return u.scheme == "http" and u.hostname in ("localhost", "127.0.0.1", "::1")


def _loopback(u) -> bool:
    return u.scheme == "http" and u.hostname in ("localhost", "127.0.0.1", "::1")


def redirect_matches(registered: list[str], uri: str) -> bool:
    if uri in registered:
        return True
    try:
        u = urlsplit(uri)
        if not _loopback(u):
            return False
        for r in registered:  # RFC 8252 7.3: loopback redirects may use any port
            v = urlsplit(r)
            if _loopback(v) and v.hostname == u.hostname and v.path == u.path and v.query == u.query:
                return True
    except ValueError:
        return False
    return False


@router.post("/oauth/register", include_in_schema=False)
async def register(request: Request):
    ip = auth.client_ip(request)
    if REGISTER_IP.blocked(ip):
        return _oauth_error("invalid_request", "too many registrations from this address, try again later", 429)
    try:
        body = json.loads(await request.body() or b"{}")
    except ValueError:
        return _oauth_error("invalid_client_metadata", "the body must be JSON")
    if not isinstance(body, dict):
        return _oauth_error("invalid_client_metadata", "the body must be a JSON object")
    uris = body.get("redirect_uris")
    if not isinstance(uris, list) or not 1 <= len(uris) <= 10 or not all(redirect_ok(u) for u in uris):
        return _oauth_error("invalid_redirect_uri", "redirect_uris: 1-10 https URLs (or http on localhost), without fragments")
    method = body.get("token_endpoint_auth_method") or "none"
    if method not in AUTH_METHODS:
        return _oauth_error("invalid_client_metadata", f"token_endpoint_auth_method must be one of {', '.join(AUTH_METHODS)}")
    grants = body.get("grant_types") or ["authorization_code", "refresh_token"]
    if not isinstance(grants, list) or "authorization_code" not in grants or not set(grants) <= {"authorization_code", "refresh_token"}:
        return _oauth_error("invalid_client_metadata", "grant_types: authorization_code (and refresh_token)")
    if (body.get("response_types") or ["code"]) != ["code"]:
        return _oauth_error("invalid_client_metadata", "response_types: code")
    name = str(body.get("client_name") or "an MCP client").strip()[:200] or "an MCP client"
    REGISTER_IP.fail(ip)  # counts every registration, not just failures
    cid = "mlc_" + secrets.token_hex(12)
    secret = "mls_" + secrets.token_urlsafe(32) if method != "none" else None
    now = time.time()
    with _eng(request).begin() as c:
        n = c.execute(sa.select(sa.func.count()).select_from(db.oauth_clients)).scalar() or 0
        if n >= MAX_CLIENTS:  # drop the oldest registrations nobody ever used
            used = sa.select(db.oauth_tokens.c.client_id).distinct()
            old = c.execute(sa.select(db.oauth_clients.c.id).where(db.oauth_clients.c.id.not_in(used))
                            .order_by(db.oauth_clients.c.created).limit(n - MAX_CLIENTS + 1)).scalars().all()
            if not old:
                return _oauth_error("invalid_request", "too many registered clients", 503)
            c.execute(db.oauth_clients.delete().where(db.oauth_clients.c.id.in_(old)))
        c.execute(db.oauth_clients.insert().values(id=cid, name=name, redirect_uris=json.dumps(uris), auth_method=method,
                                                   secret_hash=_hash(secret) if secret else None, created=now, ip=ip[:64]))
    out = {"client_id": cid, "client_id_issued_at": int(now), "client_name": name, "redirect_uris": uris,
           "grant_types": ["authorization_code", "refresh_token"], "response_types": ["code"],
           "token_endpoint_auth_method": method, "scope": SCOPE}
    if secret:
        out.update(client_secret=secret, client_secret_expires_at=0)
    return _no_store(JSONResponse(out, status_code=201))


def _client(c: sa.Connection, cid: str | None) -> dict | None:
    if not cid or not isinstance(cid, str) or len(cid) > 64:
        return None
    r = c.execute(sa.select(db.oauth_clients).where(db.oauth_clients.c.id == cid)).mappings().first()
    if r is None:
        return None
    d = dict(r)
    d["redirect_uris"] = db.loads(d["redirect_uris"], [])
    return d


# ---------------------------------------------------------------- authorization (browser)

def _csrf_key(c: sa.Connection) -> bytes:
    k = db.get_setting(c, "oauth_csrf_key")
    if not k:
        db.upsert(c, db.settings, {"key": "oauth_csrf_key", "value": secrets.token_hex(32)}, ["key"])
        k = db.get_setting(c, "oauth_csrf_key")
    return bytes.fromhex(k)


def _csrf(key: bytes, session_token: str, p: dict) -> str:
    msg = "|".join([auth.token_hash(session_token), p["client_id"], p["redirect_uri"], p["code_challenge"], p.get("state") or ""])
    return hmac.new(key, msg.encode(), hashlib.sha256).hexdigest()


def _back(redirect_uri: str, request: Request, **params) -> RedirectResponse:
    sep = "&" if urlsplit(redirect_uri).query else "?"
    params = {k: v for k, v in params.items() if v is not None}
    params["iss"] = issuer(request)
    return RedirectResponse(redirect_uri + sep + urlencode(params), status_code=302)


def _page(title: str, body: str, status: int = 200, form_targets: str = "") -> HTMLResponse:
    resp = HTMLResponse(PAGE.replace("{{TITLE}}", html.escape(title)).replace("{{BODY}}", body), status_code=status)
    resp.headers["Content-Security-Policy"] = (
        "default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; frame-ancestors 'none'; "
        f"form-action 'self'{(' ' + form_targets) if form_targets else ''}")
    resp.headers["Cache-Control"] = "no-store"
    return resp


def _problem(msg: str, status: int = 400) -> HTMLResponse:
    return _page("Can't connect", f"<h1>Can't connect this app</h1><p class=muted>{html.escape(msg)}</p>", status)


def _params(src) -> dict:
    keys = ("response_type", "client_id", "redirect_uri", "state", "code_challenge", "code_challenge_method", "scope", "resource")
    out = {}
    for k in keys:
        v = src.get(k)
        if isinstance(v, list):
            v = v[0] if v else None
        out[k] = v if isinstance(v, str) and len(v) <= 2000 else None
    return out


def _check(request: Request, c: sa.Connection, p: dict):
    """-> (client, error response). Problems with the client or redirect are shown here; the rest go back to the app."""
    client = _client(c, p["client_id"])
    if client is None:
        return None, _problem("This app isn't registered with ModelLab (unknown client_id). Remove the connector in your "
                              "Claude app and add it again.")
    if not p["redirect_uri"] and len(client["redirect_uris"]) == 1:
        p["redirect_uri"] = client["redirect_uris"][0]
    if not p["redirect_uri"] or not redirect_matches(client["redirect_uris"], p["redirect_uri"]):
        return None, _problem("The app asked to return to an address it didn't register (redirect_uri).")
    if p["response_type"] != "code":
        return None, _back(p["redirect_uri"], request, error="unsupported_response_type", state=p["state"])
    if not p["code_challenge"] or p["code_challenge_method"] != "S256" or not 43 <= len(p["code_challenge"]) <= 128:
        return None, _back(p["redirect_uri"], request, error="invalid_request",
                           error_description="PKCE with code_challenge_method=S256 is required", state=p["state"])
    if p["resource"] and p["resource"].rstrip("/") != resource_url(request):
        return None, _back(p["redirect_uri"], request, error="invalid_target",
                           error_description=f"the resource must be {resource_url(request)}", state=p["state"])
    return client, None


@router.get("/oauth/authorize", include_in_schema=False)
def authorize(request: Request):
    p = _params(request.query_params)
    with _eng(request).begin() as c:
        client, err = _check(request, c, p)
        if err is not None:
            return err
        token = request.cookies.get(auth.COOKIE)
        user = auth.session_user(c, token)
        if user is None:
            here = "/oauth/authorize?" + urlencode({k: v for k, v in p.items() if v is not None})
            return RedirectResponse("/?login_next=" + quote(here, safe=""), status_code=302)
        csrf = _csrf(_csrf_key(c), token, p)
    target = urlsplit(p["redirect_uri"])
    host = target.hostname + (f":{target.port}" if target.port else "")
    origin = f"{target.scheme}://{host}"
    hidden = "".join(f'<input type=hidden name="{k}" value="{html.escape(v)}">' for k, v in p.items() if v is not None)
    name = html.escape(client["name"] or "an MCP client")
    who = html.escape(user["display_name"] or user["username"])
    body = f"""
<div class=yeti>{YETI_IMG}</div>
<h1>Connect <b>{name}</b> to ModelLab?</h1>
<p class=muted>Signed in as <b>{who}</b>. You'll go back to <b>{html.escape(host)}</b>.</p>
<ul>
  <li><span class=ok>✓</span> Read your runs, searches, results, machines and logs</li>
  <li><span class=ok>✓</span> Look at the PCA and attention figures of your runs</li>
  <li><span class=no>✕</span> Start, change or delete anything</li>
  <li><span class=no>✕</span> See datasets, images or checkpoints (they never leave your PCs)</li>
</ul>
<form method=post action="/oauth/authorize">{hidden}<input type=hidden name=csrf value="{csrf}">
  <div class=row><button name=action value=deny class=secondary>Cancel</button>
  <button name=action value=allow class=primary autofocus>Allow</button></div>
</form>
<p class=fine>You can disconnect it any time in Yeti's settings.</p>"""
    return _page("Connect to ModelLab", body, form_targets=origin)


@router.post("/oauth/authorize", include_in_schema=False)
async def authorize_post(request: Request):
    form = parse_qs((await request.body()).decode("utf-8", "replace"), keep_blank_values=True)
    p = _params(form)
    action = (form.get("action") or [""])[0]
    csrf = (form.get("csrf") or [""])[0]
    with _eng(request).begin() as c:
        client, err = _check(request, c, p)
        if err is not None:
            return err
        token = request.cookies.get(auth.COOKIE)
        user = auth.session_user(c, token)
        if user is None:
            return _problem("Your ModelLab session ended. Start the connection again from your Claude app.", 401)
        if not hmac.compare_digest(csrf, _csrf(_csrf_key(c), token, p)):
            return _problem("This approval form expired or didn't come from ModelLab. Start again from your Claude app.", 403)
        if action != "allow":
            return _back(p["redirect_uri"], request, error="access_denied", error_description="the user declined",
                         state=p["state"])
        code = secrets.token_urlsafe(32)
        now = time.time()
        c.execute(db.oauth_codes.delete().where(db.oauth_codes.c.expires < now))
        c.execute(db.oauth_codes.insert().values(code_hash=_hash(code), client_id=client["id"], user_id=user["id"],
                                                 redirect_uri=p["redirect_uri"], challenge=p["code_challenge"], scope=SCOPE,
                                                 resource=resource_url(request), created=now, expires=now + CODE_TTL, used=False))
    return _back(p["redirect_uri"], request, code=code, state=p["state"])


# ---------------------------------------------------------------- tokens

async def _token_form(request: Request) -> dict:
    raw = (await request.body()).decode("utf-8", "replace")
    if "json" in (request.headers.get("content-type") or ""):
        try:
            d = json.loads(raw or "{}")
            return {k: str(v) for k, v in d.items() if isinstance(v, (str, int))} if isinstance(d, dict) else {}
        except ValueError:
            return {}
    return {k: v[0] for k, v in parse_qs(raw, keep_blank_values=True).items() if v}


def _client_auth(request: Request, c: sa.Connection, f: dict) -> tuple[dict | None, str | None]:
    """-> (client, error). Public clients send only client_id; confidential ones authenticate as registered."""
    cid, secret = f.get("client_id"), f.get("client_secret")
    hdr = request.headers.get("authorization") or ""
    if hdr.lower().startswith("basic "):
        try:
            from urllib.parse import unquote

            a, _, b = base64.b64decode(hdr[6:]).decode().partition(":")
            cid, secret = unquote(a), unquote(b)
        except (ValueError, UnicodeDecodeError):
            return None, "malformed Basic authorization"
    client = _client(c, cid)
    if client is None:
        return None, "unknown client"
    if client["auth_method"] != "none":
        if not secret or not client["secret_hash"] or not hmac.compare_digest(_hash(secret), client["secret_hash"]):
            return None, "client authentication failed"
    return client, None


def _issue(c: sa.Connection, client_id: str, user_id: str, resource: str | None, family: str | None = None) -> dict:
    now = time.time()
    family = family or secrets.token_hex(16)
    access, refresh = "mla_" + secrets.token_urlsafe(32), "mlr_" + secrets.token_urlsafe(32)
    for tok, kind, ttl in ((access, "access", ACCESS_TTL), (refresh, "refresh", REFRESH_TTL)):
        c.execute(db.oauth_tokens.insert().values(token_hash=_hash(tok), kind=kind, family=family, client_id=client_id,
                                                  user_id=user_id, scope=SCOPE, resource=resource, created=now,
                                                  expires=now + ttl, last_used=None, revoked=False))
    c.execute(db.oauth_tokens.delete().where(db.oauth_tokens.c.expires < now - 86400))
    return {"access_token": access, "token_type": "Bearer", "expires_in": ACCESS_TTL, "refresh_token": refresh, "scope": SCOPE}


@router.post("/oauth/token", include_in_schema=False)
async def token(request: Request):
    ip = auth.client_ip(request)
    if TOKEN_FAIL_IP.blocked(ip):
        return _oauth_error("invalid_request", "too many failed requests, try again later", 429)
    f = await _token_form(request)
    grant = f.get("grant_type")

    def fail(error: str, desc: str, status: int = 400):
        TOKEN_FAIL_IP.fail(ip)
        return _oauth_error(error, desc, status, {"WWW-Authenticate": "Basic"} if error == "invalid_client" else None)

    with _eng(request).begin() as c:
        client, err = _client_auth(request, c, f)
        if client is None:
            return fail("invalid_client", err, 401)
        now = time.time()
        if grant == "authorization_code":
            code, verifier = f.get("code") or "", f.get("code_verifier") or ""
            row = c.execute(sa.select(db.oauth_codes).where(db.oauth_codes.c.code_hash == _hash(code))).mappings().first()
            if row is None or row["used"] or row["expires"] < now or row["client_id"] != client["id"]:
                return fail("invalid_grant", "the code is invalid, expired or already used")
            c.execute(db.oauth_codes.update().where(db.oauth_codes.c.code_hash == row["code_hash"]).values(used=True))
            if f.get("redirect_uri") and f["redirect_uri"] != row["redirect_uri"]:
                return fail("invalid_grant", "redirect_uri doesn't match the authorization request")
            want = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()
            if not 43 <= len(verifier) <= 128 or not hmac.compare_digest(want, row["challenge"]):
                return fail("invalid_grant", "PKCE verification failed")
            if auth_user(c, row["user_id"]) is None:
                return fail("invalid_grant", "the account is disabled")
            return _no_store(JSONResponse(_issue(c, client["id"], row["user_id"], row["resource"])))
        if grant == "refresh_token":
            rt = f.get("refresh_token") or ""
            row = c.execute(sa.select(db.oauth_tokens).where(db.oauth_tokens.c.token_hash == _hash(rt),
                                                             db.oauth_tokens.c.kind == "refresh")).mappings().first()
            if row is None or row["client_id"] != client["id"] or row["expires"] < now:
                return fail("invalid_grant", "the refresh token is invalid or expired")
            if row["revoked"]:  # replayed after rotation: someone else may hold it, so end the whole grant
                c.execute(db.oauth_tokens.update().where(db.oauth_tokens.c.family == row["family"]).values(revoked=True))
                return fail("invalid_grant", "the refresh token was already used")
            if auth_user(c, row["user_id"]) is None:
                return fail("invalid_grant", "the account is disabled")
            c.execute(db.oauth_tokens.update().where(db.oauth_tokens.c.token_hash == row["token_hash"]).values(revoked=True))
            return _no_store(JSONResponse(_issue(c, client["id"], row["user_id"], row["resource"], row["family"])))
        return fail("unsupported_grant_type", "grant_type must be authorization_code or refresh_token")


@router.post("/oauth/revoke", include_in_schema=False)
async def revoke(request: Request):
    f = await _token_form(request)
    with _eng(request).begin() as c:
        client, _err = _client_auth(request, c, f)
        tok = f.get("token") or ""
        row = c.execute(sa.select(db.oauth_tokens).where(db.oauth_tokens.c.token_hash == _hash(tok))).mappings().first()
        if client is not None and row is not None and row["client_id"] == client["id"]:
            c.execute(db.oauth_tokens.update().where(db.oauth_tokens.c.family == row["family"]).values(revoked=True))
    return _no_store(JSONResponse({}))  # RFC 7009: the same answer whether or not the token existed


# ---------------------------------------------------------------- the MCP endpoint's check

def auth_user(c: sa.Connection, uid: str) -> dict | None:
    u = c.execute(sa.select(db.users).where(db.users.c.id == uid)).mappings().first()
    return dict(u) if u is not None and not u["disabled"] else None


def bearer_user(request: Request) -> dict:
    """The user an MCP request acts for, from its access token; 401 with the discovery pointer otherwise."""
    meta = issuer(request) + "/.well-known/oauth-protected-resource"
    hdr = request.headers.get("authorization") or ""
    if not hdr.lower().startswith("bearer "):
        raise HTTPException(401, "sign in: this MCP server uses OAuth",
                            headers={"WWW-Authenticate": f'Bearer resource_metadata="{meta}", scope="{SCOPE}"'})
    tok = hdr[7:].strip()
    now = time.time()
    with _eng(request).begin() as c:
        row = c.execute(sa.select(db.oauth_tokens).where(db.oauth_tokens.c.token_hash == _hash(tok),
                                                         db.oauth_tokens.c.kind == "access")).mappings().first()
        ok = row is not None and not row["revoked"] and row["expires"] > now
        if ok and row["resource"] and row["resource"].rstrip("/") != resource_url(request):
            ok = False
        user = auth_user(c, row["user_id"]) if ok else None
        if user is None:
            raise HTTPException(401, "the access token is invalid or expired",
                                headers={"WWW-Authenticate": f'Bearer error="invalid_token", resource_metadata="{meta}"'})
        if not row["last_used"] or now - row["last_used"] > 60:
            c.execute(db.oauth_tokens.update().where(db.oauth_tokens.c.family == row["family"],
                                                     db.oauth_tokens.c.kind == "access",
                                                     db.oauth_tokens.c.token_hash == row["token_hash"]).values(last_used=now))
    return user


# ---------------------------------------------------------------- connected apps (Yeti's settings)

def connected_apps(c: sa.Connection, uid: str) -> list[dict]:
    now = time.time()
    rows = c.execute(sa.select(db.oauth_tokens.c.client_id, sa.func.min(db.oauth_tokens.c.created),
                               sa.func.max(db.oauth_tokens.c.last_used))
                     .where(db.oauth_tokens.c.user_id == uid, db.oauth_tokens.c.revoked.is_(False),
                            db.oauth_tokens.c.expires > now)
                     .group_by(db.oauth_tokens.c.client_id)).all()
    names = dict(c.execute(sa.select(db.oauth_clients.c.id, db.oauth_clients.c.name)
                           .where(db.oauth_clients.c.id.in_([r[0] for r in rows]))).all()) if rows else {}
    return [{"client_id": cid, "name": names.get(cid) or "an MCP client", "connected": first, "last_used": last}
            for cid, first, last in sorted(rows, key=lambda r: -(r[2] or r[1] or 0))]


@router.delete("/api/assistant/apps/{client_id}", include_in_schema=False)
def disconnect(client_id: str, request: Request, user: dict = Depends(auth.current_user)):
    with _eng(request).begin() as c:
        c.execute(db.oauth_tokens.update().where(db.oauth_tokens.c.user_id == user["id"],
                                                 db.oauth_tokens.c.client_id == client_id).values(revoked=True))
        return {"apps": connected_apps(c, user["id"])}


# ---------------------------------------------------------------- the consent page

# Yeti, the plush mascot (tools/mascot/export.py writes this 160 px copy next to this file)
YETI_IMG = ('<img src="data:image/webp;base64,' + base64.b64encode(Path(__file__).with_name("yeti.webp").read_bytes()).decode()
            + '" width="84" height="84" alt="">')

PAGE = """<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, \
initial-scale=1"><title>{{TITLE}} · ModelLab</title><style>
:root{--bg:#f5f8fc;--card:#fff;--line:#e1e8f1;--fg:#0e1622;--muted:#526074;--accent:#1a58ac;--soft:#e9f2fc}
@media (prefers-color-scheme:dark){:root{--bg:#070a10;--card:#0d1119;--line:#1f2734;--fg:#ebf1f9;--muted:#9aa7ba;\
--accent:#7eb0ee;--soft:#17263e}}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;\
background:var(--bg);color:var(--fg);font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:16px}
main{width:100%;max-width:420px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:28px;\
box-shadow:0 12px 40px -18px rgba(16,40,72,.35)}
.yeti{display:flex;justify-content:center;margin-bottom:8px}h1{font-size:19px;margin:0 0 6px;text-align:center;\
font-weight:600;letter-spacing:-.01em}.muted{color:var(--muted);text-align:center;margin:0 0 16px}
ul{list-style:none;padding:12px 14px;margin:0 0 18px;background:var(--soft);border-radius:12px}li{margin:4px 0}
.ok{color:#059669;font-weight:700;margin-right:6px}.no{color:var(--muted);margin-right:6px}
.row{display:flex;gap:10px}button{flex:1;height:40px;border-radius:10px;font:600 14px system-ui,sans-serif;cursor:pointer}
button:focus-visible{outline:2px solid #7eb0ee;outline-offset:2px}
.primary{background:linear-gradient(#3d82dc,#1a58ac);color:#fff;border:0}.secondary{background:var(--card);color:var(--fg);\
border:1px solid var(--line)}.fine{font-size:12px;color:var(--muted);text-align:center;margin:14px 0 0}
</style></head><body><main>{{BODY}}</main></body></html>"""
