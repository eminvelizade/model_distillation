"""HTTP client for the hub's agent API (/agent/v1). Uses HTTPS_PROXY / NO_PROXY from the environment like curl."""

from __future__ import annotations

import socket

import httpx

from modellab.agent import AGENT_VERSION


class HubError(RuntimeError):
    def __init__(self, status: int | None, detail: str):
        super().__init__(f"hub {status or 'unreachable'}: {detail}")
        self.status, self.detail = status, detail


class Revoked(HubError):
    """This machine was removed in the web app (or its token is unknown)."""


class HubClient:
    def __init__(self, hub_url: str, token: str | None = None, timeout: float = 30.0):
        headers = {"User-Agent": f"modellab-agent/{AGENT_VERSION} ({socket.gethostname()})"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        self.url = hub_url.rstrip("/")
        self.http = httpx.Client(base_url=self.url, headers=headers, timeout=timeout, follow_redirects=False)

    def _check(self, r: httpx.Response) -> httpx.Response:
        if r.status_code < 400:
            return r
        try:
            detail = r.json().get("detail", r.text)
        except ValueError:
            detail = r.text[:300]
        if r.status_code == 401:
            raise Revoked(401, str(detail))
        raise HubError(r.status_code, str(detail))

    def _do(self, method: str, path: str, **kw) -> httpx.Response:
        try:
            return self._check(self.http.request(method, path, **kw))
        except httpx.HTTPError as e:
            raise HubError(None, f"{type(e).__name__}: {e}") from e

    def post(self, path: str, body: dict | None = None) -> dict:
        return self._do("POST", path, json=body or {}).json()

    def get(self, path: str) -> dict:
        return self._do("GET", path).json()

    def get_bytes(self, path: str, timeout: float = 600.0) -> bytes:
        return self._do("GET", path, timeout=timeout).content

    def put_bytes(self, path: str, data: bytes, content_type: str, mtime: float | None = None) -> dict:
        headers = {"Content-Type": content_type, **({"X-Mtime": str(mtime)} if mtime else {})}
        return self._do("PUT", path, content=data, headers=headers, timeout=120.0).json()

    def close(self) -> None:
        self.http.close()
