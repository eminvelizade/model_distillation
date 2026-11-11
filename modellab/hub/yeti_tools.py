"""Yeti's tools: read-only views of one user's ModelLab data, shared by the in-app chat (modellab/hub/yeti.py) and the
MCP server for Claude apps (modellab/hub/mcp.py).

Every tool runs as the signed-in user (the same ownership checks as the web API), reads and never writes, and returns
JSON text plus, for figures, PNG images. The evidence comes from modellab/hub/xai.py.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable

import sqlalchemy as sa
from fastapi import HTTPException

from modellab import catalog
from modellab.hub import Config, db, model, search, xai

GUIDE_FILE = Path(__file__).with_name("yeti_guide.md")
ANSI = re.compile(r"\x1b\[[0-9;?]*[A-Za-z]")
MAX_TEXT = 90_000  # characters of JSON per tool result (a safety net; the builders keep results compact)
MAX_IMAGE_BYTES = 3_500_000
STATUSES = ("queued", "running", "done", "failed", "cancelled", "interrupted")


@dataclass
class Output:
    data: object
    images: list[tuple[bytes, str]] = field(default_factory=list)  # (bytes, media type)
    label: str = ""  # what the tool did, for the chat ("Read run “x”")
    href: str | None = None  # the page it looked at
    error: bool = False

    def text(self) -> str:
        if isinstance(self.data, str):
            s = self.data
        else:
            s = json.dumps(self.data, ensure_ascii=False, default=str, separators=(",", ":"))
        return s if len(s) <= MAX_TEXT else s[:MAX_TEXT] + " …(truncated)"


@dataclass
class Tool:
    name: str
    title: str
    description: str
    props: dict
    required: list[str]
    fn: Callable[[sa.Connection, dict, dict], Output]
    pending: Callable[[dict], str]

    def schema(self) -> dict:
        return {"type": "object", "properties": self.props, "required": self.required, "additionalProperties": False}


class ToolError(Exception):
    pass


# ---------------------------------------------------------------- guide

def guide_text() -> str:
    text = GUIDE_FILE.read_text()
    dets = "\n".join(f"- `{d.id}`: {d.label}, {d.resolution} px" for d in catalog.DETECTORS.values() if not d.hidden)
    teach = "\n".join(f"- `{t.id}`: {t.label}" for t in catalog.TEACHERS.values() if not t.hidden)
    return text.replace("{{DETECTORS}}", dets).replace("{{TEACHERS}}", teach)


def guide_sections() -> dict[str, str]:
    out, cur, buf = {}, None, []
    for line in guide_text().splitlines():
        if line.startswith("## "):
            if cur:
                out[cur] = "\n".join(buf).strip()
            cur, buf = line[3:].strip(), []
        elif cur:
            buf.append(line)
    if cur:
        out[cur] = "\n".join(buf).strip()
    return out


def _read_guide(c, user, a) -> Output:
    secs = guide_sections()
    want = (a.get("section") or "").strip().lower()
    if not want:
        return Output({"sections": list(secs), "overview": secs.get("Overview", "")}, label="Read the ModelLab guide")
    hit = next((k for k in secs if k.lower() == want), None) or next((k for k in secs if want in k.lower()), None)
    if hit is None:
        words = set(re.findall(r"[a-z0-9]+", want))
        scored = sorted(secs, key=lambda k: -len(words & set(re.findall(r"[a-z0-9]+", (k + " " + secs[k]).lower()))))
        hit = scored[0]
    return Output({"section": hit, "text": secs[hit], "other_sections": [k for k in secs if k != hit]},
                  label=f"Read the guide: {hit}")


# ---------------------------------------------------------------- runs

def _known_failure(r: dict) -> str | None:
    """The failure catalogue's name for this run's error, when a pattern matches (system1/failures.py)."""
    from modellab.hub.system1 import failures

    if r.get("status") == "interrupted":
        return failures.BY_ID["interrupted"].title
    sig = failures.match(r.get("error_tail")) if r.get("status") == "failed" else None
    return f"{sig.title}: {sig.explain}" if sig else None


def _run_row(r: dict) -> dict:
    best = r.get("best") or {}
    return xai._drop_none({
        "id": r["id"], "name": r.get("name"), "status": r.get("status"), "machine": r.get("machine_name"),
        "dataset": r.get("dataset"), "created": r.get("created"), "stages": [f"{s['name']}:{s['type']}" for s in r.get("stages") or []],
        "best_map": xai.pct(best.get("map")), "best_label": best.get("label"), "tags": r.get("tags") or None,
        "error": (r.get("error_tail") or "").strip().splitlines()[-1][:200] if r.get("status") in ("failed", "interrupted") and r.get("error_tail") else None,
        "known_failure": _known_failure(r),
        "link": f"/runs/{r['id']}",
    })


def _list_runs(c, user, a) -> Output:
    rows = model.list_runs(c, user, a.get("status"), None, limit=500)
    q = (a.get("query") or "").strip().lower()
    if q:
        rows = [r for r in rows if q in (r.get("name") or "").lower() or q in r["id"].lower()
                or any(q in str(t).lower() for t in r.get("tags") or []) or q in (r.get("dataset") or "").lower()]
    lim = a.get("limit") or 20
    return Output({"runs": [_run_row(r) for r in rows[:lim]], "total_matching": len(rows)},
                  label=f"Listed {min(lim, len(rows))} run(s)", href="/queue")


def _get_run(c, user, a) -> Output:
    d = model.run_detail(c, user, a["run_id"])
    ev = xai.run_evidence(d, model.results(c, user))
    return Output(ev, label=f"Read run “{d.get('name')}”", href=f"/runs/{d['id']}")


def _run_logs(c, user, a) -> Output:
    r = model.get_run(c, user, a["run_id"])
    stages = [s["name"] for s in model._stage_rows(c, r["id"])]
    stage = a.get("stage") or None
    if stage and stage not in stages:
        raise ToolError(f"run has no stage {stage!r}; stages: {', '.join(stages) or 'none'}")
    stream = stage or "runner"
    chunks = model.log_chunks(c, r["id"], stream, 0, 128 * 1024)
    lines = [ln for ln in ANSI.sub("", "".join(t for _, t in chunks)).replace("\r", "\n").splitlines() if ln.strip()]
    n = a.get("lines") or 80
    return Output({"run": r["name"], "status": r["status"], "log": stage or "runner (all stages)", "stages": stages,
                   "lines": [ln[:400] for ln in lines[-n:]], "total_lines": len(lines)},
                  label=f"Read the {stage or 'runner'} log of “{r['name']}”", href=f"/runs/{r['id']}")


def _figures(c, user, a) -> Output:
    d = model.run_detail(c, user, a["run_id"])
    want = a.get("stage")
    stages = [s for s in d["stages"] if not want or s["name"] == want]
    if want and not stages:
        raise ToolError(f"run has no stage {want!r}")
    images, shown, skipped = [], [], []
    for s in stages:
        for art in s.get("artifacts") or []:
            p = art.get("path", "")
            if not (art.get("stored") and p.lower().endswith(".png")):
                continue
            if len(images) >= 4:
                skipped.append(p)
                continue
            f = model.get_file(c, user, d["id"], p)
            data = bytes(f["content"])
            if not data.startswith(b"\x89PNG") or len(data) > MAX_IMAGE_BYTES:
                skipped.append(p)
                continue
            images.append((data, "image/png"))
            shown.append({"figure": p, "stage": s["name"]})
    feats = {s["name"]: xai.features_evidence((s.get("result") or {}).get("metrics") or {})
             for s in stages if s.get("type") == "features" and s.get("result")}
    if not images and not feats:
        raise ToolError("this run has no figures stored on the hub (figures come from a `features` stage)")
    data = xai._drop_none({"run": d.get("name"), "figures_shown_in_order": shown, "not_shown": skipped, "features": feats})
    what = "figures" if not feats else "the PCA and attention figures" if any("attention" in x["figure"] for x in shown) else "the PCA figure"
    return Output(data, images=images, label=f"Looked at {what} of “{d.get('name')}”", href=f"/runs/{d['id']}")


# ---------------------------------------------------------------- searches, leaderboard, compare

def _list_searches(c, user, a) -> Output:
    rows = search.list_searches(c, user)
    return Output({"searches": [xai.search_summary(s) for s in rows[:30]], "total": len(rows)},
                  label=f"Listed {len(rows)} search(es)", href="/search")


def _explain_search(c, user, a) -> Output:
    s = search.get(c, user, a["search_id"])
    return Output(xai.search_evidence(s), label=f"Analysed search “{s.get('name')}”", href=f"/search/{s['id']}")


def _leaderboard(c, user, a) -> Output:
    rows = model.results(c, user)
    ev = xai.leaderboard_evidence(rows, a.get("dataset"), a.get("split") or "test", a.get("limit") or 10)
    datasets = sorted({r["dataset"] for r in rows if r.get("dataset")})
    ev["datasets_with_results"] = datasets
    return Output(ev, label="Checked the leaderboard", href="/leaderboard")


def _compare(c, user, a) -> Output:
    items = a["results"]
    if not 2 <= len(items) <= 4:
        raise ToolError("give 2-4 results as run_id:stage")
    cmp = model.compare(c, user, ",".join(items))
    return Output(xai.compare_evidence(cmp), label=f"Compared {len(items)} results",
                  href="/compare?items=" + ",".join(items))


# ---------------------------------------------------------------- machines

def _machine_row(m: dict) -> dict:
    gpus = [f"{g.get('name')} ({g.get('memory_gb')} GB)" for g in m.get("gpus") or []]
    return xai._drop_none({"id": m["id"], "name": m["name"], "online": m["online"], "state": m.get("state"),
                           "gpus": gpus or None, "driver": m.get("driver"), "checks": m.get("checks"),
                           "agent_version": m.get("agent_version"), "current_run": m.get("current_run"),
                           "link": f"/machines/{m['id']}"})


def _list_machines(c, user, a) -> Output:
    rows = model.list_machines(c, user, Config())
    return Output({"machines": [_machine_row(m) for m in rows]}, label=f"Listed {len(rows)} machine(s)", href="/machines")


def _get_machine(c, user, a) -> Output:
    m = model.get_machine(c, user, a["machine_id"])
    d = model.machine_detail(c, m, Config())
    rep = d.get("report") or {}
    hw = rep.get("hardware") or {}
    checks = [xai._drop_none({"check": ch.get("label") or ch.get("id"), "status": ch.get("status"), "value": ch.get("value"),
                              "detail": ch.get("detail"), "fix": ch.get("fix")}) for ch in rep.get("checks") or []]
    datasets = []
    for ds in rep.get("datasets") or []:
        chk = ds.get("check") or {}
        datasets.append(xai._drop_none({
            "name": ds.get("name"), "path": ds.get("path"), "missing": (not ds.get("built", True)) or None,
            "error": ds.get("error"), "classes": len(ds.get("classes") or []) or None,
            "splits": {k: v.get("images") for k, v in (chk.get("splits") or {}).items() if isinstance(v, dict)} or None,
            "check_errors": chk.get("errors"), "check_warnings": chk.get("warnings"),
            "checked": bool(chk) or None,
            "fingerprint": ((ds.get("hash") or {}).get("all") or "")[:12] if isinstance(ds.get("hash"), dict) else None,
        }))
    weights = rep.get("weights") or {}
    return Output(xai._drop_none({
        "machine": _machine_row(d), "hardware": {k: v for k, v in hw.items() if k in (
            "os", "glibc", "cpu", "ram_gb", "ram_available_gb", "driver", "cuda_driver", "gpus", "shm_gb", "disk", "python",
            "torch", "torch_cuda", "service")} or None,
        "live": d.get("live"), "checks": checks, "datasets": datasets,
        "weights_present": sorted(k for k, v in weights.items() if isinstance(v, dict) and v.get("present")) or None,
        "recent_commands": [xai._drop_none({"type": x["type"], "status": x["status"], "error": (x.get("error") or "")[:300] or None})
                            for x in (d.get("commands") or [])[:8]],
        "update_status": d.get("update_status"), "agent_release": d.get("release"), "current_release": d.get("current_release"),
    }), label=f"Read machine “{m['name']}”", href=f"/machines/{m['id']}")


# ---------------------------------------------------------------- registry

def _id(desc: str) -> dict:
    return {"type": "string", "maxLength": 100, "description": desc}


TOOLS: list[Tool] = [
    Tool("read_guide", "Read the ModelLab guide",
         "How ModelLab works: pages, stages, datasets, machines and the agent, evaluation, Find best model, export, "
         "reading results and figures, troubleshooting. Call it for how-to questions and before explaining a "
         "feature you're unsure about. Without `section` it lists the sections.",
         {"section": {"type": "string", "maxLength": 80, "description": "section title or keywords, e.g. 'Find best model'"}},
         [], _read_guide, lambda a: "Reading the guide"),
    Tool("list_runs", "List runs",
         "The user's runs, newest first: status, machine, dataset, stages, best mAP. Use it to find a run by name, "
         "tag or dataset before calling get_run.",
         {"status": {"type": "string", "enum": list(STATUSES)},
          "query": {"type": "string", "maxLength": 80, "description": "matches run name, id, tag or dataset"},
          "limit": {"type": "integer", "minimum": 1, "maximum": 50}},
         [], _list_runs, lambda a: "Looking through your runs"),
    Tool("get_run", "Explain a run",
         "One run in depth: every stage with its settings, duration and metrics; the results (mAP, AP by object size, "
         "per-class AP, latency, params, VRAM) with where each stands among comparable results; the error tail if "
         "it failed; features-stage probes and CKA. Call it to explain a run's results or failure.",
         {"run_id": _id("run id, e.g. 20260101-120000-my-run-a1b2c3")}, ["run_id"], _get_run,
         lambda a: "Reading the run"),
    Tool("get_run_logs", "Read a run's log",
         "The last lines of a run's log (the runner's, or one stage's). Use it to diagnose failures, slow training or "
         "warnings after get_run.",
         {"run_id": _id("run id"), "stage": {"type": "string", "maxLength": 64, "description": "stage name; omit for the runner log"},
          "lines": {"type": "integer", "minimum": 10, "maximum": 200}},
         ["run_id"], _run_logs, lambda a: "Reading the log"),
    Tool("view_figures", "Look at a run's figures",
         "The figures a run stored on the hub (PCA and attention figures of `features` stages) as images, with the "
         "features metrics (probes, CKA, attention focus) and how to read them. Call it when asked about PCA, "
         "attention, features or what distillation changed inside the backbone.",
         {"run_id": _id("run id"), "stage": {"type": "string", "maxLength": 64, "description": "only this stage"}},
         ["run_id"], _figures, lambda a: "Looking at the figures"),
    Tool("list_searches", "List searches",
         "The user's Find-best-model searches: status, phase, recommendation, mAP and latency.",
         {}, [], _list_searches, lambda a: "Looking through your searches"),
    Tool("explain_search", "Explain a search",
         "Why a Find-best-model search recommended its model: the timing of every candidate against the speed budget, "
         "each round's ranking and cutoff, rank changes, fair comparisons inside each round (input size, model size, "
         "distillation, learning rate, with diminishing-returns flags), seed noise, the margin over the runner-up, "
         "faster alternatives and caveats. Call it before explaining any search result.",
         {"search_id": _id("search id")}, ["search_id"], _explain_search, lambda a: "Analysing the search"),
    Tool("leaderboard", "Check the leaderboard",
         "Results ranked within comparable groups (same evaluation code, dataset, split and data fingerprint), with "
         "speed-vs-accuracy frontier flags. Call it for 'what's my best model' or to place a result in context.",
         {"dataset": {"type": "string", "maxLength": 64}, "split": {"type": "string", "enum": ["valid", "test"]},
          "limit": {"type": "integer", "minimum": 1, "maximum": 30}},
         [], _leaderboard, lambda a: "Checking the leaderboard"),
    Tool("compare_results", "Compare results",
         "2-4 results side by side: metrics, best per metric, per-class AP, every config difference between their runs "
         "and comparability warnings. Results are given as run_id:stage (the eval stage).",
         {"results": {"type": "array", "items": {"type": "string", "maxLength": 170}, "minItems": 2, "maxItems": 4}},
         ["results"], _compare, lambda a: f"Comparing {len(a.get('results') or [])} results"),
    Tool("list_machines", "List machines",
         "The user's GPU machines: online state, GPUs, driver, self-check counts, agent version, current run.",
         {}, [], _list_machines, lambda a: "Looking at your machines"),
    Tool("get_machine", "Inspect a machine",
         "One machine in depth: hardware, the self-check (failures with their fix), datasets with their check errors "
         "and warnings, downloaded weights, recent commands and agent updates. Call it for setup or dataset problems.",
         {"machine_id": _id("machine id")}, ["machine_id"], _get_machine, lambda a: "Inspecting the machine"),
]
BY_NAME = {t.name: t for t in TOOLS}


def _check(schema: dict, v, path: str) -> None:
    t = schema.get("type")
    if t == "string":
        if not isinstance(v, str):
            raise ToolError(f"{path} must be a string")
        if len(v) > schema.get("maxLength", 10_000):
            raise ToolError(f"{path} is too long")
        if "enum" in schema and v not in schema["enum"]:
            raise ToolError(f"{path} must be one of {', '.join(schema['enum'])}")
    elif t == "integer":
        if isinstance(v, bool) or not isinstance(v, int):
            raise ToolError(f"{path} must be an integer")
        if not schema.get("minimum", -10**9) <= v <= schema.get("maximum", 10**9):
            raise ToolError(f"{path} must be between {schema.get('minimum')} and {schema.get('maximum')}")
    elif t == "array":
        if not isinstance(v, list) or not schema.get("minItems", 0) <= len(v) <= schema.get("maxItems", 1000):
            raise ToolError(f"{path} must be a list of {schema.get('minItems', 0)}-{schema.get('maxItems')} items")
        for i, x in enumerate(v):
            _check(schema["items"], x, f"{path}[{i}]")


def validate(tool: Tool, args) -> dict:
    if args is None:
        args = {}
    if not isinstance(args, dict):
        raise ToolError("arguments must be an object")
    extra = set(args) - set(tool.props)
    if extra:
        raise ToolError(f"unknown argument(s): {', '.join(sorted(extra))}")
    for k in tool.required:
        if args.get(k) in (None, ""):
            raise ToolError(f"{k} is required")
    out = {}
    for k, v in args.items():
        if v is None:
            continue
        _check(tool.props[k], v, k)
        out[k] = v
    return out


def call(engine: sa.Engine, user: dict, name: str, args) -> Output:
    """Run one tool as `user`. Never raises: problems come back as an error Output Claude can read."""
    tool = BY_NAME.get(name)
    if tool is None:
        return Output(f"unknown tool {name!r}", error=True, label=f"Unknown tool {name}")
    try:
        a = validate(tool, args)
        with engine.begin() as c:
            return tool.fn(c, user, a)
    except ToolError as e:
        return Output(str(e), error=True, label=tool.title)
    except HTTPException as e:
        return Output(str(e.detail), error=True, label=tool.title)
    except Exception as e:  # noqa: BLE001 - a broken tool must not end the conversation
        return Output(f"{type(e).__name__}: {e}", error=True, label=tool.title)


def pending_label(name: str, args) -> str:
    t = BY_NAME.get(name)
    try:
        return t.pending(args if isinstance(args, dict) else {}) if t else name
    except Exception:  # noqa: BLE001
        return t.title if t else name


def api_tools() -> list[dict]:
    """Tool definitions for the Messages API (streamed: inputs arrive eagerly and are validated here before running)."""
    return [{"name": t.name, "description": t.description, "input_schema": t.schema(), "eager_input_streaming": True}
            for t in TOOLS]


def mcp_tools() -> list[dict]:
    return [{"name": t.name, "title": t.title, "description": t.description, "inputSchema": t.schema(),
             "annotations": {"title": t.title, "readOnlyHint": True, "destructiveHint": False, "idempotentHint": True,
                             "openWorldHint": False}} for t in TOOLS]


def page_label(kind: str, ident: str, c: sa.Connection, user: dict) -> str | None:
    """A readable name for the page the user is on (used in the chat context), or None if it isn't theirs."""
    try:
        if kind == "run":
            return model.get_run(c, user, ident)["name"]
        if kind == "search":
            return search._row(c, user, ident)["name"]
        if kind == "machine":
            return model.get_machine(c, user, ident)["name"]
    except HTTPException:
        return None
    return None


def db_user(c: sa.Connection, uid: str) -> dict | None:
    u = c.execute(sa.select(db.users).where(db.users.c.id == uid)).mappings().first()
    return dict(u) if u and not u["disabled"] else None
