"""ModelLab as an MCP server (Streamable HTTP, JSON responses): Claude apps connect at https://<hub>/mcp with OAuth
(modellab/hub/oauth.py) and get Yeti's read-only tools (modellab/hub/yeti_tools.py), acting as the user who approved
the connection.

    claude.ai / Claude Desktop / mobile: Settings → Connectors → Add custom connector → https://<hub>/mcp
    Claude Code:                         claude mcp add --transport http modellab https://<hub>/mcp   (then /mcp to sign in)

Stateless: every POST carries one JSON-RPC message and gets one JSON answer (no server-initiated stream, so GET is 405).
"""

from __future__ import annotations

import base64
import json

from fastapi import APIRouter, Request, Response
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse

from modellab.hub import oauth, yeti_tools

router = APIRouter()
VERSIONS = ("2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05")
SERVER_INFO = {"name": "modellab", "title": "ModelLab", "version": "0.2.0"}
INSTRUCTIONS = (
    "ModelLab is the user's personal lab for training, distilling and benchmarking object detectors on their own GPU "
    "machines. These tools read their runs, searches (Find best model), leaderboard, machines, logs and feature figures; "
    "they cannot change anything. For how-to questions call read_guide. To explain results, fetch the evidence first: "
    "explain_search for why a search recommended a model (it pre-computes speed headroom, round rankings, marginal "
    "gains per model/input size, seed noise and the margin over the runner-up), get_run for a run, view_figures for PCA "
    "and attention figures, compare_results for differences between runs, leaderboard for context. mAP values are "
    "percentage points of COCO mAP50:95. Quote the numbers you use, and treat gaps smaller than the seed noise as ties. "
    "Pages of the web app: /runs/<id>, /search/<id>, /machines/<id>, /leaderboard on the hub's address.")


def _rpc(id_, result=None, error: tuple[int, str] | None = None) -> dict:
    if error:
        return {"jsonrpc": "2.0", "id": id_, "error": {"code": error[0], "message": error[1]}}
    return {"jsonrpc": "2.0", "id": id_, "result": result}


def dispatch(engine, user: dict, msg: dict) -> dict:
    method, params, id_ = msg.get("method"), msg.get("params") or {}, msg.get("id")
    if not isinstance(params, dict):
        return _rpc(id_, error=(-32602, "params must be an object"))
    if method == "initialize":
        want = params.get("protocolVersion")
        return _rpc(id_, {"protocolVersion": want if want in VERSIONS else VERSIONS[0],
                          "capabilities": {"tools": {"listChanged": False}}, "serverInfo": SERVER_INFO,
                          "instructions": INSTRUCTIONS})
    if method == "ping":
        return _rpc(id_, {})
    if method == "tools/list":
        return _rpc(id_, {"tools": yeti_tools.mcp_tools()})
    if method == "tools/call":
        name, args = params.get("name"), params.get("arguments") or {}
        if name not in yeti_tools.BY_NAME:
            return _rpc(id_, error=(-32602, f"unknown tool {name!r}"))
        out = yeti_tools.call(engine, user, name, args)
        content = [{"type": "text", "text": out.text()}]
        content += [{"type": "image", "data": base64.standard_b64encode(data).decode(), "mimeType": mt} for data, mt in out.images]
        return _rpc(id_, {"content": content, "isError": out.error})
    if method == "resources/list":
        return _rpc(id_, {"resources": []})
    if method == "resources/templates/list":
        return _rpc(id_, {"resourceTemplates": []})
    if method == "prompts/list":
        return _rpc(id_, {"prompts": []})
    return _rpc(id_, error=(-32601, f"method not found: {method}"))


@router.post("/mcp", include_in_schema=False)
async def mcp(request: Request):
    origin = request.headers.get("origin")
    if origin and origin.rstrip("/") != oauth.issuer(request):
        return JSONResponse(_rpc(None, error=(-32600, "cross-origin requests are not allowed")), status_code=403)
    user = await run_in_threadpool(oauth.bearer_user, request)
    try:
        msg = json.loads(await request.body() or b"null")
    except ValueError:
        return JSONResponse(_rpc(None, error=(-32700, "parse error")), status_code=400)
    if isinstance(msg, list):
        return JSONResponse(_rpc(None, error=(-32600, "batches are not supported")), status_code=400)
    if not isinstance(msg, dict) or msg.get("jsonrpc") != "2.0":
        return JSONResponse(_rpc(None, error=(-32600, "invalid request")), status_code=400)
    if "method" not in msg or "id" not in msg:  # a notification or a response: accepted, nothing to answer
        return Response(status_code=202)
    out = await run_in_threadpool(dispatch, request.app.state.engine, user, msg)
    return JSONResponse(out)


@router.get("/mcp", include_in_schema=False)
@router.delete("/mcp", include_in_schema=False)
def mcp_other():
    return Response(status_code=405, headers={"Allow": "POST"})
