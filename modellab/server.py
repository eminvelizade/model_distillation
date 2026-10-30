"""ModelLab web API (FastAPI) + the prebuilt UI (modellab/web/dist). Started by `python app.py`.

The API only reads the run store and calls the engine (submit / cancel / requeue); runs are executed by the worker
process, so closing the browser or restarting the app never stops a run.
"""

from __future__ import annotations

import asyncio
import json
import re
import time
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from pydantic import BaseModel

from modellab import ROOT, catalog, datasets, engine, evaluate, recipe, store, weights, worker

WEB_DIST = ROOT / "modellab" / "web" / "dist"
ANSI = re.compile(r"\x1b\[[0-9;?]*[A-Za-z]")
app = FastAPI(title="ModelLab", docs_url="/api/docs", openapi_url="/api/openapi.json")


# ---------- helpers ----------

def _progress(run_id: str, stage: str | None) -> dict | None:
    if not stage:
        return None
    try:
        return json.loads((store.stage_dir(run_id, stage) / "progress.json").read_text())
    except (OSError, ValueError):
        return None


def _run_summary(r: dict) -> dict:
    full = store.get_run(r["id"])
    stages = full["stages"]
    done = sum(s["status"] == "done" for s in stages)
    cur = _progress(r["id"], r.get("current_stage")) if r["status"] == "running" else None
    overall = (done + (cur["fraction"] if cur else 0)) / max(1, len(stages))
    best = max((x for x in full["results"] if x["map"] is not None), key=lambda x: x["map"], default=None)
    return {**{k: r[k] for k in ("id", "name", "recipe_name", "group_id", "status", "created", "started", "finished",
                                 "dataset", "current_stage", "tags", "notes", "error_tail", "cancel_requested")},
            "stages": [{"name": s["name"], "type": s["type"], "status": s["status"], "started": s["started"],
                        "finished": s["finished"]} for s in stages],
            "progress": round(overall, 4), "stage_progress": cur,
            "best": {"map": best["map"], "label": best["label"], "stage": best["stage"]} if best else None}


def _read_json(p: Path):
    try:
        return json.loads(p.read_text())
    except (OSError, ValueError):
        return None


def _flatten(d, prefix="") -> dict:
    out = {}
    if isinstance(d, dict):
        for k, v in d.items():
            out.update(_flatten(v, f"{prefix}.{k}" if prefix else str(k)))
    elif isinstance(d, list) and d and all(isinstance(x, dict) and "name" in x for x in d):
        for x in d:  # stages: key by stage name
            out.update(_flatten({k: v for k, v in x.items() if k != "name"}, f"{prefix}[{x['name']}]"))
    else:
        out[prefix] = d
    return out


# ---------- mode (the UI also talks to the hub, modellab/hub, which has logins and machines) ----------

@app.get("/api/auth/me")
def me():
    return {"mode": "local", "user": None}


# ---------- catalog / datasets / templates ----------

@app.get("/api/catalog")
def get_catalog():
    return {**catalog.public_catalog(), "stage_types": list(recipe.STAGE_TYPES), "default_epochs": recipe.DEFAULT_EPOCHS,
            "datasets": datasets.list_all(), "templates": recipe.templates(), "eval_version": evaluate.eval_version()}


@app.get("/api/weights")
def get_weights():
    return [weights.status(k) for k in catalog.all_weight_keys()]


@app.get("/api/datasets")
def get_datasets():
    return datasets.list_all()


# ---------- recipes / runs ----------

class RecipeIn(BaseModel):
    yaml: str | None = None
    recipe: dict | None = None
    tags: list[str] = []
    position: str = "end"  # "end" = add to queue, "front" = run next


def _recipe_text(body: RecipeIn) -> str:
    if body.yaml is not None:
        return body.yaml
    if body.recipe is not None:
        return recipe.to_yaml(body.recipe)
    raise HTTPException(400, "give yaml or recipe")


@app.post("/api/recipes/preview")
def preview(body: RecipeIn):
    text = _recipe_text(body)
    return {"yaml": text, **engine.preview(text)}


@app.post("/api/recipes/parse")
def parse(body: RecipeIn):
    """YAML -> recipe object for the builder (422 if it isn't a mapping the builder can show)."""
    try:
        r = recipe.load_text(_recipe_text(body))
    except recipe.RecipeError as e:
        raise HTTPException(422, str(e)) from e
    if not isinstance(r.get("stages"), list) or not all(isinstance(s, dict) for s in r["stages"]):
        raise HTTPException(422, "stages must be a list of mappings")
    return {"recipe": r}


@app.post("/api/runs")
def create_runs(body: RecipeIn):
    text = _recipe_text(body)
    try:
        ids = engine.submit(text, tags=body.tags)
    except recipe.RecipeError as e:
        raise HTTPException(422, str(e)) from e
    if body.position == "front":
        with store.db() as con:
            low = con.execute("SELECT MIN(queue_pos) FROM runs WHERE status='queued'").fetchone()[0] or time.time()
        for i, rid in enumerate(ids):
            store.update_run(rid, queue_pos=low - len(ids) + i)
    started = worker.start_background()
    return {"run_ids": ids, "worker_started": started}


@app.get("/api/runs")
def list_runs(status: str | None = None):
    return [_run_summary(r) for r in store.list_runs(status=status)]


@app.get("/api/runs/{run_id}")
def run_detail(run_id: str):
    r = store.get_run(run_id)
    if not r:
        raise HTTPException(404, "no such run")
    rd = store.run_dir(run_id)
    stages = []
    for s in r["stages"]:
        sd = store.stage_dir(run_id, s["name"])
        res = _read_json(sd / "result.json")
        files = sorted(str(p.relative_to(rd)) for p in sd.rglob("*") if p.is_file() and p.suffix in (".png", ".jpg", ".json", ".txt", ".pth", ".pt")
                       and "lightly/" not in str(p.relative_to(sd))) if sd.is_dir() else []
        stages.append({**s, "progress": _progress(run_id, s["name"]), "result": res,
                       "artifacts": [{"path": f, "size": (rd / f).stat().st_size} for f in files]})
    return {**_run_summary(r), "stages": stages, "results": r["results"],
            "recipe_yaml": (rd / "recipe.yaml").read_text() if (rd / "recipe.yaml").is_file() else "",
            "resolved": _read_json(rd / "resolved.json"), "env": _read_json(rd / "env.json"),
            "datasets": _read_json(rd / "datasets.json"), "pid": r["pid"]}


@app.get("/api/runs/{run_id}/file/{path:path}")
def run_file(run_id: str, path: str):
    rd = store.run_dir(run_id).resolve()
    p = (rd / path).resolve()
    if rd not in p.parents or not p.is_file():
        raise HTTPException(404, "not found")
    return FileResponse(p)


class RunPatch(BaseModel):
    tags: list[str] | None = None
    notes: str | None = None


@app.patch("/api/runs/{run_id}")
def patch_run(run_id: str, body: RunPatch):
    fields = {k: v for k, v in body.model_dump().items() if v is not None}
    if fields:
        store.update_run(run_id, **fields)
    return _run_summary(store.get_run(run_id))


@app.post("/api/runs/{run_id}/cancel")
def cancel(run_id: str):
    try:
        return {"result": store.request_cancel(run_id)}
    except KeyError as e:
        raise HTTPException(404, "no such run") from e


@app.post("/api/runs/{run_id}/requeue")
def requeue(run_id: str):
    r = store.get_run(run_id)
    if not r or r["status"] not in ("failed", "cancelled", "interrupted", "done"):
        raise HTTPException(409, "only finished runs can be re-queued")
    store.requeue(run_id)
    worker.start_background()
    return {"result": "queued"}


@app.delete("/api/runs/{run_id}")
def delete(run_id: str):
    r = store.get_run(run_id)
    if r and r["status"] == "running":
        raise HTTPException(409, "cancel the run first")
    store.delete_run(run_id)
    return {"result": "deleted"}


@app.get("/api/runs/{run_id}/logs")
async def logs(run_id: str, request: Request, stage: str | None = None, follow: bool = True, lines: int = 400):
    """Server-sent events: the last `lines` lines, then new lines as they are written."""
    rd = store.run_dir(run_id)
    path = rd / "runner.log" if not stage or stage == "runner" else store.stage_dir(run_id, stage) / "log.txt"

    async def gen():
        pos = 0
        if path.is_file():
            text = path.read_bytes()
            pos = len(text)
            for ln in ANSI.sub("", text.decode(errors="replace")).replace("\r", "\n").splitlines()[-lines:]:
                if ln.strip():
                    yield f"data: {json.dumps(ln)}\n\n"
        yield "event: caught-up\ndata: {}\n\n"
        idle = 0
        while follow and not await request.is_disconnected():
            await asyncio.sleep(0.5)
            if path.is_file() and path.stat().st_size > pos:
                with open(path, "rb") as f:
                    f.seek(pos)
                    chunk = f.read()
                pos += len(chunk)
                for ln in ANSI.sub("", chunk.decode(errors="replace")).replace("\r", "\n").splitlines():
                    if ln.strip():
                        yield f"data: {json.dumps(ln)}\n\n"
                idle = 0
            else:
                idle += 1
                if idle % 30 == 0:  # keep-alive + run status every 15 s
                    r = store.get_run(run_id)
                    yield f"event: status\ndata: {json.dumps({'status': r['status'] if r else None})}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


# ---------- queue / gpu ----------

@app.get("/api/queue")
def get_queue():
    return {"worker": worker.info(), "runs": [_run_summary(r) for r in store.queue()]}


@app.post("/api/worker/start")
def start_worker():
    return {"pid": worker.start_background(), "worker": worker.info()}


_nvml = {"init": None}


@app.get("/api/gpu")
def gpu():
    try:
        import pynvml

        if _nvml["init"] is None:
            pynvml.nvmlInit()
            _nvml["init"] = True
        out = []
        for i in range(pynvml.nvmlDeviceGetCount()):
            h = pynvml.nvmlDeviceGetHandleByIndex(i)
            name = pynvml.nvmlDeviceGetName(h)
            mem = pynvml.nvmlDeviceGetMemoryInfo(h)
            util = pynvml.nvmlDeviceGetUtilizationRates(h)
            try:
                power = pynvml.nvmlDeviceGetPowerUsage(h) / 1000
            except pynvml.NVMLError:
                power = None
            out.append({"index": i, "name": name.decode() if isinstance(name, bytes) else name, "util": util.gpu,
                        "mem_used_mb": mem.used / 2**20, "mem_total_mb": mem.total / 2**20,
                        "temp_c": pynvml.nvmlDeviceGetTemperature(h, pynvml.NVML_TEMPERATURE_GPU), "power_w": power})
        return {"available": True, "gpus": out}
    except Exception as e:  # noqa: BLE001  (no NVIDIA driver on this machine)
        _nvml["init"] = None
        return {"available": False, "reason": str(e)[:200], "gpus": []}


# ---------- leaderboard / compare ----------

def _eval_key(r: dict) -> str:
    return f"{r['eval_version']}|{r['dataset']}|{r['split']}|{r['dataset_hash']}"


@app.get("/api/results")
def results():
    rows = store.results()
    for r in rows:
        r["eval_key"] = _eval_key(r)
        r["per_class"] = r["metrics"].get("per_class", {})
        r["warning"] = r["metrics"].get("warning")
        r["input_size"] = r["metrics"].get("input_size")
        del r["metrics"]
    return {"rows": rows, "current_eval_version": evaluate.eval_version()}


@app.get("/api/compare")
def compare(items: str):
    """items = 'run_id:stage,run_id:stage' (2-4 eval results)."""
    keys = [tuple(x.split(":", 1)) for x in items.split(",") if ":" in x]
    if not 1 <= len(keys) <= 4:
        raise HTTPException(400, "pick 1-4 results")
    all_rows = {(r["run_id"], r["stage"]): r for r in store.results()}
    rows, configs, pcas = [], {}, {}
    for k in keys:
        if k not in all_rows:
            raise HTTPException(404, f"no result {k}")
        r = dict(all_rows[k])
        r["eval_key"] = _eval_key(r)
        rows.append(r)
        rid = r["run_id"]
        if rid not in configs:
            res = _read_json(store.run_dir(rid) / "resolved.json") or {}
            configs[rid] = _flatten({"stages": res.get("stages", []), "seed": res.get("seed"), "dataset": res.get("dataset")})
            env = _read_json(store.run_dir(rid) / "env.json") or {}
            configs[rid].update(_flatten({"env": {"git": env.get("git", {}).get("commit"), "packages": env.get("packages"),
                                                  "gpu": (env.get("gpu") or {}).get("devices")}}))
            pcas[rid] = sorted(str(p.relative_to(store.run_dir(rid))) for p in store.run_dir(rid).glob("stages/*/pca.png"))
    run_ids = list(configs)
    all_keys = sorted(set().union(*(c.keys() for c in configs.values())))
    diff = [{"key": k, "values": {rid: configs[rid].get(k) for rid in run_ids}} for k in all_keys
            if len({json.dumps(configs[rid].get(k), sort_keys=True, default=str) for rid in run_ids}) > 1]
    warnings = []
    if len({r["eval_version"] for r in rows}) > 1:
        warnings.append("eval code versions differ: " + ", ".join(sorted({r["eval_version"] or "?" for r in rows})))
    if len({(r["dataset"], r["split"], r["dataset_hash"]) for r in rows}) > 1:
        warnings.append("evaluated on different data (dataset / split / content hash differ)")
    if len({r["latency_device"] for r in rows if r["latency_device"]}) > 1:
        warnings.append("latency measured on different devices / settings")
    return {"rows": rows, "config_diff": diff, "pca": pcas, "warnings": warnings, "comparable": not warnings[:2],
            "current_eval_version": evaluate.eval_version()}


# ---------- UI ----------

@app.get("/{path:path}", include_in_schema=False)
def ui(path: str):
    if path.startswith("api/"):
        return JSONResponse({"detail": "not found"}, status_code=404)
    f = (WEB_DIST / path).resolve()
    if path and WEB_DIST.resolve() in f.parents and f.is_file():
        return FileResponse(f)
    index = WEB_DIST / "index.html"
    if not index.is_file():
        return JSONResponse({"detail": "UI not built: cd modellab/web && npm ci && npm run build"}, status_code=503)
    return FileResponse(index)
