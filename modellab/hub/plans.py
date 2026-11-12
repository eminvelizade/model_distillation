"""Plans: several steps the user approved once, carried out on the hub.

A plan is a list of typed steps. Each one is a registered action (system1/actions.py) with its values checked
against the user's own machines, datasets and runs, or a step that only reads results:

    run      queue one training run (the recipe the New experiment form writes)       run.queue
    search   start a Find best model search                                          search.start
    pick     choose the best of earlier steps by a metric                            (reads results)
    export   export the model of a run, or of the run a pick chose                   run.export

Claude writes a plan with the propose_plan tool, which changes nothing: the plan is stored as "proposed" and shown
as a card in the chat. Approval is the user's own authenticated POST (/api/plans/{id}/approve), never a tool call.
What they approve is an envelope: these machines and datasets, this much GPU time, this many tries per step. The
executor refuses anything outside it, and a revision that goes beyond it waits for the user again.

Steps run on the hub (model.submit and friends), so a plan goes on with no page open. It moves forward the way a
search does: when one of its runs finishes (agent events: its runs carry the tag plan:<id>) and whenever the web
app reads it. advance() writes only if the row's rev is unchanged.

Each step's state is written from what happened to its run, not from what anyone said. A failed run goes to the
failure catalogue (system1/failures.py). When the fix is one a plan may make on its own (half the batch after an
out-of-memory error, half the learning rate after a NaN, a re-queue after an interruption), and the approved GPU
time allows it, the step is tried again with that change, at most TRIES times, and the thread says so. Anything
else stops the plan and says what is missing.
"""

from __future__ import annotations

import re
import sys
import time

import sqlalchemy as sa
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from modellab import catalog, recipe
from modellab.hub import auth, db, model, notebook, search
from modellab.hub.system1 import failures

router = APIRouter(prefix="/api")

TAG = "plan:"
KINDS = ("run", "search", "pick", "export")
MAX_STEPS = 12
TRIES = 3                                  # tries per run step, the first included
AUTO_FIX = ("oom", "nan", "interrupted")   # the known failures a plan may fix on its own
BUDGET_MARGIN, SLACK_S = 1.5, 600          # the approved GPU time: the estimate times this, plus this
METRICS = {"map": ("mAP 50-95", True), "map50": ("mAP 50", True), "latency_ms": ("latency", False)}  # label, higher is better
TIE = 0.003                                # an mAP gap under 0.3 points is called a tie (seed noise is about that)
NAME_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{0,39}$")
STEP_ID = re.compile(r"^s[0-9]{1,2}$")
NUMBERS = {"epochs": (1, 2000), "batch_size": (1, 512), "image_size": (64, 2048), "grad_accum": (1, 64),
           "distill_epochs": (1, 2000), "seed": (0, 2**31 - 1)}
RUN_KEYS = {"machine_id", "dataset", "model", "epochs", "batch_size", "image_size", "lr", "grad_accum", "teacher",
            "distill_epochs", "seed", "name"}
OPEN = ("proposed", "running", "waiting")  # not finished


def safe(text: str) -> str:
    """Text the hub puts inside a fenced block of a turn (<plans>, <event>, <page>): it can't close the fence or open
    another, whatever a run's error, a title or a note says."""
    return text.replace("<", "‹").replace(">", "›")


class PlanError(Exception):
    """A plan the hub won't store or change: what is wrong with it, for whoever wrote it."""


class Conflict(Exception):
    """Another advance() changed the plan meanwhile: this one's writes are rolled back."""


# ---------------------------------------------------------------- recipes

def run_recipe(spec: dict) -> dict:
    """The recipe of one run step: what the New experiment form writes for the same settings."""
    stages = []
    ft: dict = {"name": "finetune", "type": "finetune", "model": spec["model"], "batch_size": spec.get("batch_size", 16),
                "budget": {"epochs": spec["epochs"]}}
    if spec.get("teacher"):
        stages.append({"name": "distill", "type": "distill", "student": spec["model"], "teacher": spec["teacher"],
                       "batch_size": 32, "budget": {"epochs": spec.get("distill_epochs", 30)}})
        ft["init"] = {"from": "distill"}
    for k in ("image_size", "lr", "grad_accum"):
        if spec.get(k):
            ft[k] = spec[k]
    stages += [ft, {"name": "eval", "type": "eval", "model": {"from": "finetune"}}]
    return {"name": spec["name"], "dataset": spec["dataset"], "seed": spec.get("seed", 42), "tags": [], "stages": stages}


def main_stage(stages: list[dict]) -> dict | None:
    """The stage "the epochs" or "the batch size" mean: the last one that trains (as in the web app)."""
    for t in ("finetune", "distill"):
        st = next((s for s in reversed(stages) if s.get("type") == t), None)
        if st:
            return st
    return None


def with_changes(rec: dict, ch: dict) -> dict:
    """A recipe with its main stage's settings changed, as Clone & edit does."""
    out = {**rec, "stages": [dict(s) for s in rec.get("stages") or []]}
    st = main_stage(out["stages"])
    if st is None:
        raise PlanError("that run has no training stage to change")
    num = lambda v: float(v) if isinstance(v, str) else v  # noqa: E731
    if ch.get("epochs"):
        st["budget"] = {**(st.get("budget") or {}), "epochs": int(num(ch["epochs"]))}
    for k in ("batch_size", "grad_accum", "image_size"):
        if ch.get(k):
            st[k] = int(num(ch[k]))
    if ch.get("lr"):
        st["lr"] = float(num(ch["lr"]))
    if ch.get("model") and st.get("type") == "finetune" and st.get("model") != ch["model"]:
        st["model"] = ch["model"]
        st.pop("init", None)
    for k in ("name", "dataset", "seed"):
        if ch.get(k) is not None:
            out[k] = ch[k]
    return out


# ---------------------------------------------------------------- checking a plan

def _labels() -> dict[str, str]:
    return {d.id: d.label for d in catalog.DETECTORS.values()}


def _detail(spec: dict, machine: str, base: str | None) -> str:
    parts = [_labels().get(spec["model"], spec["model"]) if spec.get("model") else f"the model {base} picks",
             f"{spec['epochs']} epoch{'' if spec['epochs'] == 1 else 's'}"]
    if spec.get("batch_size"):
        parts.append(f"batch {spec['batch_size']}")
    if spec.get("image_size"):
        parts.append(f"{spec['image_size']} px")
    if spec.get("lr"):
        parts.append(f"lr {spec['lr']:g}")
    if spec.get("teacher"):
        parts.append(f"distilled from {spec['teacher']}")
    return " · ".join(parts) + f" · {spec['dataset']} on {machine}"


def _run_step(c: sa.Connection, user: dict, raw: dict, sid: str, earlier: dict[str, dict]) -> dict:
    spec = raw.get("run")
    if not isinstance(spec, dict):
        raise PlanError(f"{sid}: a run step needs \"run\": the settings of the run")
    unknown = set(spec) - RUN_KEYS
    if unknown:
        raise PlanError(f"{sid}: unknown run setting(s): {', '.join(sorted(unknown))}")
    spec = {k: v for k, v in spec.items() if v is not None}
    base = raw.get("base")
    if base is not None and (base not in earlier or earlier[base]["kind"] not in ("pick", "search")):
        raise PlanError(f"{sid}: base must be an earlier pick or search step")
    for k in ("machine_id", "dataset", "epochs"):
        if k not in spec:
            raise PlanError(f"{sid}: run.{k} is required")
    if not base and "model" not in spec:
        raise PlanError(f"{sid}: run.model is required (or base: the pick step whose winner it trains)")
    for k, (lo, hi) in NUMBERS.items():
        if k in spec and (isinstance(spec[k], bool) or not isinstance(spec[k], int) or not lo <= spec[k] <= hi):
            raise PlanError(f"{sid}: run.{k} must be a whole number from {lo} to {hi}")
    if "lr" in spec and (isinstance(spec["lr"], bool) or not isinstance(spec["lr"], (int, float)) or not 0 < spec["lr"] <= 1):
        raise PlanError(f"{sid}: run.lr must be a number above 0, at most 1")
    if spec.get("image_size", 32) % 32:
        raise PlanError(f"{sid}: run.image_size must be a multiple of 32")
    try:
        m = model.get_machine(c, user, str(spec["machine_id"]))
    except HTTPException as e:
        raise PlanError(f"{sid}: no machine {spec['machine_id']!r} among this user's (list_machines has the ids)") from e
    names = [d.get("name") for d in model.machine_datasets(m)]
    if spec["dataset"] not in names:
        raise PlanError(f"{sid}: {m['name']} has no dataset {spec['dataset']!r}; it has: {', '.join(n for n in names if n) or 'none'}")
    dets = {d.id for d in catalog.DETECTORS.values() if not getattr(d, "hidden", False)}
    if spec.get("model") and spec["model"] not in dets:
        raise PlanError(f"{sid}: unknown model {spec['model']!r}; the catalog has: {', '.join(sorted(dets))}")
    if spec.get("teacher"):
        teachers = {t.id for t in catalog.TEACHERS.values() if not t.hidden}
        if spec["teacher"] not in teachers:
            raise PlanError(f"{sid}: unknown teacher {spec['teacher']!r}; the catalog has: {', '.join(sorted(teachers))}")
        if base or not spec["model"].startswith("rfdetr/"):
            raise PlanError(f"{sid}: distillation (teacher) is for RF-DETR models named in the step")
    spec.setdefault("name", re.sub(r"[^a-z0-9]+", "-", f"{(spec.get('model') or 'pick').split('/')[-1]}-{spec['epochs']}ep".lower()).strip("-")[:40])
    if not isinstance(spec["name"], str) or not NAME_RE.match(spec["name"]):
        raise PlanError(f"{sid}: run.name: lowercase letters, digits, '-' or '_', at most 40 characters")
    est, missing = None, []
    if spec.get("model"):
        pv = model.preview(m, recipe.to_yaml(run_recipe(spec)))
        if not pv["ok"]:
            raise PlanError(f"{sid}: {m['name']} would refuse this run: {'; '.join(pv['errors'])}")
        missing = [w for r in pv["runs"] for w in r.get("missing_weights") or []]
        if missing:
            raise PlanError(f"{sid}: {m['name']} is missing the weights {', '.join(missing)}: offer weights.fetch for "
                            "that machine first (propose_action), and plan the run once they are there")
        models = [spec["model"]]
    else:  # trains whatever the pick chooses: estimate from the slowest candidate
        models = [earlier[o]["run"]["model"] for o in earlier[base].get("of", []) if earlier.get(o, {}).get("kind") == "run"
                  and earlier[o]["run"].get("model")]
    ests = [notebook.estimate(c, user, m["id"], spec["dataset"], mid, spec["epochs"])["seconds"] for mid in models]
    if ests and all(e is not None for e in ests):
        est = float(max(ests))
    after = list(dict.fromkeys([*([base] if base else []), *_after(raw, sid, earlier)]))
    return {"id": sid, "kind": "run", "title": _title(raw, f"Train {spec['name']}"), "status": "pending", "after": after,
            "run": spec, "base": base, "machine": {"id": m["id"], "name": m["name"]}, "detail": _detail(spec, m["name"], base),
            "est_s": est, "attempts": [], "run_id": None, "result": None, "note": None}


def _after(raw: dict, sid: str, earlier: dict[str, dict]) -> list[str]:
    after = raw.get("after") or []
    if not isinstance(after, list) or any(a not in earlier for a in after):
        raise PlanError(f"{sid}: after must list earlier steps' ids")
    return list(after)


def _title(raw: dict, default: str) -> str:
    t = raw.get("title")
    return t.strip()[:120] if isinstance(t, str) and t.strip() else default


def _search_step(c: sa.Connection, user: dict, raw: dict, sid: str, earlier: dict[str, dict]) -> dict:
    a = raw.get("search")
    if not isinstance(a, dict):
        raise PlanError(f"{sid}: a search step needs \"search\": the settings of the search")
    for k in ("dataset", "target_machine_id", "speed_budget_ms", "models", "epochs"):
        if k not in a:
            raise PlanError(f"{sid}: search.{k} is required")
    target = a["target_machine_id"]
    machines = list(dict.fromkeys([target, *(a.get("machine_ids") or [])]))
    body = {"name": a.get("name") or f"{a['dataset']} under {a['speed_budget_ms']:g} ms", "dataset": a["dataset"],
            "machines": machines, "target_machine": target, "speed_ms": a["speed_budget_ms"], "models": a["models"],
            "teachers": a.get("teachers") or [], "epochs": a["epochs"], **({"gpu_hours": a["gpu_hours"]} if a.get("gpu_hours") else {})}
    try:
        spec = search.check_spec(c, user, dict(body))
    except HTTPException as e:
        raise PlanError(f"{sid}: Find best model would refuse this: {e.detail}") from e
    pv = search.preview(spec)
    return {"id": sid, "kind": "search", "title": _title(raw, f"Find best model: {spec['name']}"), "status": "pending",
            "after": _after(raw, sid, earlier), "search": body, "machines": [{"id": i, "name": spec["machine_names"][i]} for i in machines],
            "detail": f"{len(spec['models'])} model(s) under {spec['speed_ms']:g} ms on {spec['machine_names'][target]}, "
                      f"up to {pv['max_trials']} runs of up to {spec['epochs']} epochs",
            "est_s": spec["gpu_hours"] * 3600.0 if spec.get("gpu_hours") else None, "search_id": None, "result": None, "note": None}


def check(c: sa.Connection, user: dict, raw: list, kept: list[dict] | None = None) -> list[dict]:
    """Typed steps from what was asked for: every id, machine, dataset, model and run looked up as this user.
    `kept` are steps of the plan that already started (a revision keeps them, and new steps may build on them)."""
    kept = kept or []
    if not isinstance(raw, list) or not raw:
        raise PlanError("a plan needs at least one step")
    if len(raw) + len(kept) > MAX_STEPS:
        raise PlanError(f"a plan has at most {MAX_STEPS} steps")
    earlier = {s["id"]: s for s in kept}
    out = []
    for i, r in enumerate(raw):
        if not isinstance(r, dict):
            raise PlanError("each step is an object")
        sid = r.get("id")
        if sid is None:  # ids are s1, s2, ...: the next free one
            n = len(earlier) + 1
            while f"s{n}" in earlier:
                n += 1
            sid = f"s{n}"
        elif not isinstance(sid, str) or not STEP_ID.match(sid):
            raise PlanError(f"step ids look like s1, s2, ...: not {sid!r}")
        elif sid in earlier:
            raise PlanError(f"step id {sid!r} is used twice")
        kind = r.get("kind")
        if kind == "run":
            st = _run_step(c, user, r, sid, earlier)
        elif kind == "search":
            st = _search_step(c, user, r, sid, earlier)
        elif kind == "pick":
            of = r.get("of")
            if not isinstance(of, list) or len(of) < 2 or any(o not in earlier or earlier[o]["kind"] not in ("run", "search") for o in of):
                raise PlanError(f"{sid}: pick needs \"of\": two or more earlier run or search steps")
            metric = r.get("metric", "map")
            if metric not in METRICS:
                raise PlanError(f"{sid}: metric must be one of {', '.join(METRICS)}")
            st = {"id": sid, "kind": "pick", "title": _title(r, f"Pick the best by {METRICS[metric][0]}"), "status": "pending",
                  "after": list(dict.fromkeys(of)), "of": list(dict.fromkeys(of)), "metric": metric,
                  "detail": f"the {'highest' if METRICS[metric][1] else 'lowest'} {METRICS[metric][0]} of {', '.join(dict.fromkeys(of))}",
                  "result": None, "note": None}
        elif kind == "export":
            src, rid = r.get("from"), r.get("run_id")
            if src is not None:
                if src not in earlier or earlier[src]["kind"] == "export":
                    raise PlanError(f"{sid}: from must be an earlier run, pick or search step")
                st = {"id": sid, "kind": "export", "title": _title(r, "Export the model"), "status": "pending", "after": [src],
                      "from": src, "detail": f"the model of {src}, to ONNX and TensorRT on its machine", "result": None, "note": None}
            elif isinstance(rid, str):
                try:
                    run = model.get_run(c, user, rid)
                except HTTPException as e:
                    raise PlanError(f"{sid}: no run {rid!r} among this user's") from e
                st = {"id": sid, "kind": "export", "title": _title(r, f"Export {run['name']}"), "status": "pending",
                      "after": _after(r, sid, earlier), "run_id": rid, "detail": f"{run['name']}, to ONNX and TensorRT on its machine",
                      "result": None, "note": None}
            else:
                raise PlanError(f"{sid}: export needs \"from\" (an earlier step) or \"run_id\" (a finished run)")
        else:
            raise PlanError(f"{sid}: kind must be one of {', '.join(KINDS)}")
        earlier[sid] = st
        out.append(st)
    return out


def _px(spec: dict) -> int:
    """A run's input size: what it sets, or its model's own."""
    d = catalog.DETECTORS.get(spec.get("model") or "")
    return int(spec.get("image_size") or (d.resolution if d else 0) or 0)


def _epochs(steps: list[dict]) -> int:
    return sum(s["run"]["epochs"] + (s["run"].get("distill_epochs", 30) if s["run"].get("teacher") else 0)
               for s in steps if s["kind"] == "run")


def envelope_of(steps: list[dict]) -> dict:
    """What approving these steps covers: machines, datasets, the kinds of step, and how much work. The work is GPU
    time when it can be estimated; when it can't (no past runs to go by), it is the number of runs, their epochs in
    all, their models and their largest input."""
    machines, datasets, ests = set(), set(), []
    for s in steps:
        if s["kind"] == "run":
            machines.add(s["machine"]["id"])
            datasets.add(s["run"]["dataset"])
            ests.append(s["est_s"])
        elif s["kind"] == "search":
            machines.update(m["id"] for m in s["machines"])
            datasets.add(s["search"]["dataset"])
            ests.append(s["est_s"])
    known = bool(ests) and all(e is not None for e in ests)
    runs = [s["run"] for s in steps if s["kind"] == "run"]
    return {"machines": sorted(machines), "datasets": sorted(datasets), "tries": TRIES,
            "kinds": sorted({s["kind"] for s in steps}),
            "runs": sum(s["kind"] in ("run", "search") for s in steps), "epochs": _epochs(steps),
            "models": sorted({r["model"] for r in runs if r.get("model")}), "max_px": max([_px(r) for r in runs], default=0),
            "est_s": sum(ests) if known else None, "gpu_s": round(sum(ests) * BUDGET_MARGIN + SLACK_S) if known else None}


def beyond(env: dict, steps: list[dict], kept: list[dict], spent_s: float) -> list[str]:
    """Why these steps go beyond what was approved (empty: they don't). `kept` are the plan's steps that have
    started: what they still need counts too. `spent_s` is the GPU time of the runs that have finished."""
    new = envelope_of(steps)
    why = []
    names = {m["id"]: m["name"] for s in steps for m in ([s["machine"]] if s["kind"] == "run" else s.get("machines", []))}
    extra_m = [names.get(i, i) for i in new["machines"] if i not in env["machines"]]
    if extra_m:
        why.append(f"it uses {', '.join(extra_m)}, which the approval didn't cover")
    extra_d = [d for d in new["datasets"] if d not in env["datasets"]]
    if extra_d:
        why.append(f"it uses the dataset {', '.join(extra_d)}, which the approval didn't cover")
    extra_k = [k for k in new["kinds"] if k != "pick" and k not in env.get("kinds", KINDS)]  # (a pick only reads results)
    if extra_k:
        why.append(f"it adds a kind of step the approved plan didn't have ({', '.join(extra_k)})")
    going = [s for s in kept if s["status"] == "running" and s["kind"] in ("run", "search")]
    if env.get("gpu_s") is not None:
        if (new["est_s"] is None and new["runs"]) or any(s.get("est_s") is None for s in going):
            why.append("its GPU time can't be estimated, so it can't be checked against the approved time")
        else:
            total = spent_s + sum(s["est_s"] for s in going) + (new["est_s"] or 0)
            if total > env["gpu_s"]:
                why.append(f"it needs about {notebook.fmt_duration(total).removeprefix('about ')} of GPU time in all; "
                           f"{notebook.fmt_duration(env['gpu_s']).removeprefix('about ')} was approved")
        return why
    # no estimate to go by: the work may not grow in any way that can be counted
    started = [s for s in kept if s["kind"] in ("run", "search") and s["status"] != "skipped"]
    if len(started) + new["runs"] > env.get("runs", 0):
        why.append(f"it has more runs than the {env.get('runs', 0)} that were approved")
    if _epochs(started) + new["epochs"] > env.get("epochs", 0):
        why.append(f"it trains for {_epochs(started) + new['epochs']} epochs in all; {env.get('epochs', 0)} were approved "
                   "(there is no time estimate to go by, so the epochs are what was approved)")
    extra_models = [m for m in new["models"] if m not in env.get("models", [])]
    if extra_models:
        why.append(f"it trains {', '.join(_labels().get(m, m) for m in extra_models)}, which wasn't in the approved plan")
    if new["max_px"] > env.get("max_px", 0):
        why.append(f"it trains at {new['max_px']} px; the approved plan went up to {env.get('max_px', 0)} px")
    return why


# ---------------------------------------------------------------- rows

def _row(c: sa.Connection, user: dict, pid: str) -> dict:
    r = c.execute(sa.select(db.plans).where(db.plans.c.id == pid, db.plans.c.owner_id == user["id"])).mappings().first()
    if r is None:
        raise HTTPException(404, "no such plan")
    return dict(r)


def _run(c: sa.Connection, owner_id: str, rid: str | None) -> dict | None:
    if not rid:
        return None
    r = c.execute(sa.select(db.runs).where(db.runs.c.id == rid, db.runs.c.owner_id == owner_id)).mappings().first()
    return dict(r) if r else None


def public(c: sa.Connection, r: dict) -> dict:
    """A plan as the web app shows it: each step with the state of its run."""
    steps = db.loads(r["steps"], [])
    env = db.loads(r["envelope"], {})
    out_steps = []
    for s in steps:
        o = {k: s.get(k) for k in ("id", "kind", "title", "status", "detail", "after", "note", "result", "run_id", "search_id", "est_s")}
        o["tries"] = len(s.get("attempts") or [])
        o["fixes"] = [{"what": a.get("change"), "why": a.get("why")} for a in s.get("attempts") or [] if a.get("fix")]
        run = _run(c, r["owner_id"], s.get("run_id")) if s["kind"] == "run" and s["status"] == "running" else None
        if run:
            sm = model.run_summary(c, run)
            o["run"] = {"status": sm["status"], "progress": sm["progress"], "stage": sm["current_stage"], "name": sm["name"]}
        out_steps.append(o)
    names = dict(c.execute(sa.select(db.machines.c.id, db.machines.c.name).where(db.machines.c.id.in_(env.get("machines") or [""]))).all())
    pend = db.loads(r["pending"])
    return {"id": r["id"], "agent_id": r["agent_id"], "title": r["title"], "goal": r["goal"], "status": r["status"],
            "message": r["message"], "steps": out_steps, "notebook_entry": r["notebook_entry"],
            "machines": [names.get(i, i) for i in env.get("machines") or []], "datasets": env.get("datasets") or [],
            "est_s": env.get("est_s"), "gpu_s": env.get("gpu_s"), "spent_s": round(r["spent_s"] or 0), "tries": env.get("tries", TRIES),
            "pending": {"why": pend.get("why"), "reasons": pend.get("reasons"), "est_s": pend.get("envelope", {}).get("est_s"),
                        "steps": [{k: s.get(k) for k in ("id", "kind", "title", "detail")} for s in pend["steps"]]} if pend else None,
            "created": r["created"], "updated": r["updated"], "approved": r["approved"], "finished": r["finished"]}


def list_plans(c: sa.Connection, user: dict, only_open: bool = False, limit: int = 30) -> list[dict]:
    q = sa.select(db.plans).where(db.plans.c.owner_id == user["id"])
    if only_open:
        q = q.where(db.plans.c.status.in_(OPEN))
    return [public(c, dict(r)) for r in c.execute(q.order_by(db.plans.c.updated.desc()).limit(limit)).mappings()]


def _pct(v: float | None) -> str:
    return "n/a" if v is None else f"{v * 100:.1f}"


def _result_text(s: dict) -> str:
    r = s.get("result") or {}
    if s["kind"] in ("run", "search") and r.get("map") is not None:
        lat = f", {r['latency_ms']:.1f} ms" if r.get("latency_ms") else ""
        return f"mAP {_pct(r['map'])}{lat}"
    if s["kind"] == "pick" and r.get("winner"):
        return f"picked {r['winner']} ({r.get('name')}), {r.get('why')}"
    return ""


def state_text(c: sa.Connection, user: dict, agent_id: str | None = None) -> str | None:
    """The user's open and just-finished plans, for the <plans> block of a turn: each step's real state."""
    since = time.time() - 36 * 3600
    q = sa.select(db.plans).where(db.plans.c.owner_id == user["id"],
                                  sa.or_(db.plans.c.status.in_(OPEN), db.plans.c.updated >= since))
    rows = [dict(r) for r in c.execute(q.order_by(db.plans.c.updated.desc()).limit(6)).mappings()]
    if not rows:
        return None
    out = []
    for r in rows:
        env = db.loads(r["envelope"], {})
        head = f'plan_id {r["id"]} "{r["title"]}": {r["status"]}'
        if r["status"] == "proposed":
            head += " (a card in the chat; it has NOT started: it waits for the user's Start)"
        if r["message"]:
            head += f". {r['message']}"
        if env.get("gpu_s"):
            head += f" GPU time: {notebook.fmt_duration(r['spent_s'] or 0)} used of {notebook.fmt_duration(env['gpu_s'])} approved."
        if r["notebook_entry"]:
            head += f" Notebook entry {r['notebook_entry']}."
        lines = [head]
        for s in db.loads(r["steps"], []):
            bits = [f"  {s['id']} {s['kind']} [{s['status']}] {s['title']}: {s.get('detail') or ''}"]
            if s.get("run_id"):
                bits.append(f"run_id {s['run_id']}")
            if s.get("search_id"):
                bits.append(f"search_id {s['search_id']}")
            if _result_text(s):
                bits.append(_result_text(s))
            for a in s.get("attempts") or []:
                if a.get("fix"):
                    bits.append(f"retried after {a.get('why')}: {a.get('change')}")
            if s.get("note"):
                bits.append(str(s["note"]))
            lines.append("; ".join(bits))
        if r["pending"]:
            lines.append("  A revision that goes beyond the approval waits for the user's OK.")
        out.append("\n".join(lines))
    return safe("\n".join(out))   # (a step's note carries its run's error, which is anybody's text)


# ---------------------------------------------------------------- the thread

def _say(c: sa.Connection, plan: dict, text: str, wants_reply: bool = False) -> None:
    """The hub's own report in the agent's thread (an event, not something the agent said)."""
    if not plan.get("agent_id"):
        return
    from modellab.hub import agents  # (agents imports this module)

    agents.post_event(c, plan["owner_id"], plan["agent_id"], text, {"plan": plan["id"], "wants_reply": wants_reply})


# ---------------------------------------------------------------- carrying it out

def _result_of(c: sa.Connection, run: dict) -> dict:
    """What a finished run measured: its last eval that has an mAP, and the stage that trained the model."""
    stages = (db.loads(run["resolved"], {}) or {}).get("stages") or []
    order = {s.get("name"): i for i, s in enumerate(stages)}
    rows = [r for r in model._result_rows(c, run["id"]) if r.get("map") is not None]
    rows.sort(key=lambda r: order.get(r["stage"], 99))
    ft = next((s.get("name") for s in reversed(stages) if s.get("type") == "finetune"), None)
    if not rows:
        return {"run_id": run["id"], "name": run["name"], "stage": ft}
    r = rows[-1]
    return {"run_id": run["id"], "name": run["name"], "stage": ft, "eval": r["stage"], "split": r.get("split"), "map": r["map"],
            "map50": r.get("map50"), "latency_ms": r.get("latency_ms"), "label": r.get("label")}


def _submit(c: sa.Connection, owner: dict, plan: dict, env: dict, machine_id: str, rec: dict, extra: list[str]) -> str:
    if machine_id not in env.get("machines", []) or rec.get("dataset") not in env.get("datasets", []):
        raise PlanError("that machine or dataset isn't in what was approved")
    m = model.get_machine(c, owner, machine_id)
    tags = [TAG + plan["id"], *([notebook.TAG + plan["notebook_entry"]] if plan.get("notebook_entry") else []), *extra]
    return model.submit(c, owner, m, recipe.to_yaml(rec), tags, "end")[0]


def _source_run(step: dict, by_id: dict[str, dict]) -> tuple[str | None, str | None]:
    """(run id, the stage that trained its model) behind a run, pick or search step."""
    r = step.get("result") or {}
    return r.get("run_id"), r.get("stage")


def _start(c: sa.Connection, owner: dict, plan: dict, st: dict, by_id: dict[str, dict], env: dict) -> None:
    now = time.time()
    st["started"] = now
    try:
        if st["kind"] == "run":
            spec = dict(st["run"])
            if st.get("base"):
                rid, _ = _source_run(by_id[st["base"]], by_id)
                src = _run(c, owner["id"], rid)
                if src is None:
                    raise PlanError(f"{st['base']} picked no run to build on")
                over = {k: spec[k] for k in ("epochs", "batch_size", "image_size", "lr", "grad_accum", "model", "seed") if k in spec}
                rec = with_changes(recipe.load_text(src["recipe_yaml"]), {**over, "name": spec["name"], "dataset": spec["dataset"]})
                rec["tags"] = []
            else:
                rec = run_recipe(spec)
            rid = _submit(c, owner, plan, env, spec["machine_id"], rec, [])
            st.update(status="running", run_id=rid, attempts=[{"run_id": rid, "at": now}])
        elif st["kind"] == "search":
            for mid in st["search"]["machines"]:
                if mid not in env.get("machines", []):
                    raise PlanError("that machine isn't in what was approved")
            s = search.create(c, owner, dict(st["search"]))
            notebook.for_new_search(c, owner, s, plan.get("notebook_entry"))
            st.update(status="running", search_id=s["id"])
        elif st["kind"] == "pick":
            _pick(st, by_id)
        elif st["kind"] == "export":
            rid, stage = (st["run_id"], None) if st.get("run_id") and not st.get("from") else _source_run(by_id[st["from"]], by_id)
            run = _run(c, owner["id"], rid)
            if run is None:
                raise PlanError("there is no run to export")
            stage = stage or _result_of(c, run)["stage"]
            if not stage:
                raise PlanError(f"{run['name']} has no fine-tune stage to export")
            cmd = model.export_run(c, owner, rid, stage)
            st.update(status="done", finished=now, run_id=rid, result={"run_id": rid, "name": run["name"], "stage": stage, "command": cmd.get("id")},
                      note=f"Exporting {run['name']} to ONNX and TensorRT on its machine")
    except (PlanError, recipe.RecipeError) as e:
        st.update(status="failed", finished=now, note=str(e))
    except HTTPException as e:
        st.update(status="failed", finished=now, note=str(e.detail))


def _pick(st: dict, by_id: dict[str, dict]) -> None:
    label, higher = METRICS[st["metric"]]
    cands = []
    for o in st["of"]:
        r = (by_id[o].get("result") or {}) if by_id[o]["status"] == "done" else {}
        if r.get(st["metric"]) is not None:
            cands.append((r[st["metric"]], o, r))
    if not cands:
        st.update(status="failed", finished=time.time(), note=f"none of {', '.join(st['of'])} has a {label} to compare")
        return
    cands.sort(key=lambda x: x[0], reverse=higher)
    val, winner, r = cands[0]
    fmt = (lambda v: f"{v * 100:.1f}") if st["metric"] != "latency_ms" else (lambda v: f"{v:.1f} ms")
    why = f"{label} {fmt(val)}"
    tie = False
    if len(cands) > 1:
        gap = abs(val - cands[1][0])
        tie = st["metric"] != "latency_ms" and gap < TIE
        why += f" against {fmt(cands[1][0])} for {cands[1][1]}" + (" (a gap this small is inside seed noise: a tie)" if tie else "")
    missing = [o for o in st["of"] if o not in [x[1] for x in cands]]
    st.update(status="done", finished=time.time(), note=(f"{', '.join(missing)} had no result and was left out" if missing else None),
              result={"winner": winner, "run_id": r.get("run_id"), "name": r.get("name"), "stage": r.get("stage"),
                      "value": val, "metric": st["metric"], "why": why, "tie": tie,
                      "table": [{"step": o, "value": v, "name": x.get("name")} for v, o, x in cands]})


def _lc(title: str) -> str:
    """A diagnosis inside a sentence: "Out of GPU memory" → "out of GPU memory"."""
    return title[:1].lower() + title[1:]


def _fix(c: sa.Connection, owner: dict, plan: dict, st: dict, run: dict, env: dict, spent: float) -> str | None:
    """Try the step again with the catalogue's fix. Returns None when it did, else why it can't."""
    error = (run.get("error_tail") or "").strip()
    sig = failures.BY_ID["interrupted"] if run["status"] == "interrupted" else failures.match(error)
    last = error.splitlines()[-1][:200] if error else "no error text"
    if sig is None:
        return f"an error the catalogue doesn't know ({last})"
    if sig.id not in AUTO_FIX:
        return f"{_lc(sig.title)}: {sig.explain} That needs a person"
    if len(st["attempts"]) >= env.get("tries", TRIES):
        return f"{_lc(sig.title)}, and it has been tried {len(st['attempts'])} times"
    stages = model._stage_rows(c, run["id"])
    ctx = {"run_id": run["id"], "run_name": run["name"], "resolved": db.loads(run["resolved"], {}), "error": error,
           "failed_stage": next((s["name"] for s in stages if s["status"] == "failed"), run.get("current_stage")),
           "machine_id": run.get("machine_id"), "dataset": run.get("dataset")}
    fix = sig.fix(ctx)
    if fix is None:
        return f"{_lc(sig.title)}, and there is nothing left to turn down"
    if env.get("gpu_s") is not None and spent + (st.get("est_s") or 0) > env["gpu_s"]:
        return f"{_lc(sig.title)}, and another try wouldn't fit in the GPU time that was approved"
    now = time.time()
    change = ", ".join(f"{x['label'].lower()} {x['value']}" for x in fix.get("changes") or []) or "re-queued as it was"
    st["attempts"][-1].update(failed=sig.id)
    if fix["action"] == "run.requeue":
        model.requeue_run(c, owner, run["id"])
        rid = run["id"]
    else:
        vals = {k: v for k, v in fix["values"].items() if k != "run"}
        rec = with_changes(recipe.load_text(run["recipe_yaml"]), vals)
        rec["tags"] = [t for t in rec.get("tags") or [] if not str(t).startswith((TAG, failures.FIX_TAG, notebook.TAG))]
        rid = _submit(c, owner, plan, env, run["machine_id"], rec, [failures.FIX_TAG + sig.id])
    st["attempts"].append({"run_id": rid, "at": now, "fix": sig.id, "why": _lc(sig.title), "change": change})
    st.update(run_id=rid, status="running")
    _say(c, plan, f"Step {st['id']} ({st['title']}) failed: {_lc(sig.title)}. Trying again with {change} "
                  f"(try {len(st['attempts'])} of {env.get('tries', TRIES)}).")
    return None


def _refresh(c: sa.Connection, owner: dict, plan: dict, st: dict, env: dict, spent: float) -> bool:
    """A running step, from what happened to its run or search. Returns whether it changed."""
    now = time.time()
    if st["kind"] == "search":
        try:
            search.advance_safe(c, st["search_id"])
            s = search.get(c, owner, st["search_id"])
        except HTTPException:
            st.update(status="failed", finished=now, note="the search was deleted")
            return True
        if s["status"] == "running":
            return False
        rec = s.get("recommendation") or {}
        if s["status"] == "done" and rec.get("best_run_id"):
            st.update(status="done", finished=now, result={"run_id": rec["best_run_id"], "stage": rec.get("stage"), "name": rec.get("config"),
                                                           "map": rec.get("map_test_mean") if rec.get("map_test_mean") is not None else rec.get("map_valid_mean"),
                                                           "latency_ms": rec.get("latency_ms"), "model": rec.get("model"),
                                                           "image_size": rec.get("image_size")})
        else:
            st.update(status="cancelled" if s["status"] == "cancelled" else "failed", finished=now,
                      note=s.get("message") or f"the search ended {s['status']} without a recommendation")
        return True
    run = _run(c, owner["id"], st.get("run_id"))
    if run is None:
        st.update(status="failed", finished=now, note="its run was deleted")
        return True
    if run["status"] in ("queued", "running"):
        return False
    if run["status"] == "done":
        st.update(status="done", finished=run.get("finished") or now, result=_result_of(c, run))
        if st["result"].get("map") is None:
            st["note"] = "it finished without an evaluation result"
        return True
    if run["status"] == "cancelled":
        st.update(status="cancelled", finished=now, note=f"{run['name']} was cancelled")
        return True
    try:
        why = _fix(c, owner, plan, st, run, env, spent)
    except (PlanError, recipe.RecipeError) as e:
        why = str(e)
    except HTTPException as e:
        why = str(e.detail)
    if why:
        st.update(status="failed", finished=now, note=why[0].upper() + why[1:])
    return True


def _spent(c: sa.Connection, owner_id: str, steps: list[dict], finished_only: bool = False) -> float:
    """The GPU time of a plan's runs so far (every try counts); `finished_only` leaves out what is still running."""
    ids = list({a["run_id"] for s in steps for a in s.get("attempts") or [] if a.get("run_id")})
    if not ids:
        return 0.0
    now, total = time.time(), 0.0
    for started, finished in c.execute(sa.select(db.runs.c.started, db.runs.c.finished)
                                       .where(db.runs.c.id.in_(ids), db.runs.c.owner_id == owner_id)).all():
        if started and (finished or not finished_only):
            total += max(0.0, (finished or now) - started)
    return total


def _summary(steps: list[dict]) -> str:
    lines = []
    for s in steps:
        if s["status"] == "skipped":
            lines.append(f"{s['title']}: skipped")
        elif s["kind"] == "export":
            lines.append(f"{s['title']}: {s.get('note') or 'started'}")
        else:
            lines.append(f"{s['title']}: {_result_text(s) or s['status']}")
    return "; ".join(lines)


def advance(c: sa.Connection, pid: str) -> None:
    """Move a plan forward as far as it can go now: refresh what is running, start what is ready."""
    r = c.execute(sa.select(db.plans).where(db.plans.c.id == pid)).mappings().first()
    if r is None or r["status"] not in ("running", "waiting"):
        return
    plan = dict(r)
    owner = model.get_user(c, plan["owner_id"])
    steps, env = db.loads(plan["steps"], []), db.loads(plan["envelope"], {})
    by_id = {s["id"]: s for s in steps}
    before = db.dumps(steps)
    spent = _spent(c, owner["id"], steps)
    for _ in range(len(steps) + 2):
        moved = False
        for st in steps:
            if st["status"] == "running":
                moved |= _refresh(c, owner, plan, st, env, spent)
            elif st["status"] == "pending" and plan["status"] == "running":
                deps = [by_id[a] for a in st.get("after") or []]
                usable = [d for d in deps if d["status"] == "done"] if st["kind"] == "pick" else deps
                if any(d["status"] in ("failed", "cancelled") for d in deps):
                    continue  # waits with the step that failed
                if st["kind"] == "pick" and deps and all(d["status"] in ("done", "skipped") for d in deps) and not usable:
                    st.update(status="skipped", note="nothing left to choose from")
                    moved = True
                elif any(d["status"] == "skipped" for d in deps) and st["kind"] != "pick":
                    st.update(status="skipped", note=f"skipped with {', '.join(d['id'] for d in deps if d['status'] == 'skipped')}")
                    moved = True
                elif all(d["status"] in ("done", "skipped") for d in deps):
                    _start(c, owner, plan, st, by_id, env)
                    moved = True
        if not moved:
            break
    spent = _spent(c, owner["id"], steps)
    vals: dict = {"spent_s": spent}
    stuck = [s for s in steps if s["status"] in ("failed", "cancelled")]
    if plan["status"] == "running" and stuck:
        s = stuck[0]
        vals.update(status="waiting", message=f"Step {s['id']} ({s['title']}) {'was cancelled' if s['status'] == 'cancelled' else 'failed'}: "
                                              f"{s.get('note') or 'no reason given'}.")
        _say(c, plan, vals["message"] + " The plan is waiting: retry the step, skip it, or stop the plan.", wants_reply=True)
    elif plan["status"] == "running" and all(s["status"] in ("done", "skipped") for s in steps):
        vals.update(status="done", finished=time.time(), message=None)
        _say(c, plan, f"Plan \"{plan['title']}\" finished. {_summary(steps)}.", wants_reply=True)
    if db.dumps(steps) == before and len(vals) == 1 and abs(spent - (plan["spent_s"] or 0)) < 30:
        return
    done = c.execute(db.plans.update().where(db.plans.c.id == pid, db.plans.c.rev == plan["rev"])
                     .values(steps=db.dumps(steps), rev=plan["rev"] + 1, updated=time.time(), **vals))
    if done.rowcount != 1:
        raise Conflict(pid)


def advance_safe(c: sa.Connection, pid: str) -> None:
    """advance() in a savepoint: a conflict or an error rolls back only the plan's own writes (runs it queued too)."""
    try:
        with c.begin_nested():
            advance(c, pid)
    except Conflict:
        pass
    except Exception as e:  # noqa: BLE001 - one broken plan must not break the page that reads it
        print(f"[hub] plan {pid}: advance failed: {type(e).__name__}: {e}", file=sys.stderr, flush=True)


def advance_open(c: sa.Connection, user: dict) -> None:
    for (pid,) in c.execute(sa.select(db.plans.c.id).where(db.plans.c.owner_id == user["id"],
                                                          db.plans.c.status.in_(("running", "waiting")))).all():
        advance_safe(c, pid)


def on_run_final(c: sa.Connection, tags: list[str]) -> None:
    """A run of a plan finished (agent events): its next step may start now, with no page open."""
    for t in tags or []:
        if isinstance(t, str) and t.startswith(TAG):
            advance_safe(c, t.removeprefix(TAG))
        elif isinstance(t, str) and t.startswith("search:"):  # a search that is a plan's step: its plan reads it
            sid = t.removeprefix("search:")
            for (pid,) in c.execute(sa.select(db.plans.c.id).where(db.plans.c.status == "running",
                                                                  db.plans.c.steps.like(f'%"search_id": "{sid}"%'))).all():
                advance_safe(c, pid)


# ---------------------------------------------------------------- writing, approving, changing

def propose(c: sa.Connection, user: dict, agent_id: str | None, a: dict) -> dict:
    """Store a plan as proposed. Nothing runs: it waits for the user's Start."""
    title = str(a.get("title") or "").strip()[:120]
    if not title:
        raise PlanError("a plan needs a short title")
    entry = a.get("notebook_entry")
    if entry:
        try:
            entry = notebook._row(c, user, entry)["id"]
        except HTTPException as e:
            raise PlanError("no such notebook entry among this user's") from e
    steps = check(c, user, a.get("steps"))
    env = envelope_of(steps)
    pid, now = db.new_id(), time.time()
    c.execute(db.plans.insert().values(id=pid, owner_id=user["id"], agent_id=agent_id, title=title,
                                       goal=str(a.get("goal") or "").strip()[:2000] or None, status="proposed",
                                       steps=db.dumps(steps), envelope=db.dumps(env), notebook_entry=entry or None,
                                       spent_s=0, rev=0, created=now, updated=now))
    return public(c, _row(c, user, pid))


def revise(c: sa.Connection, user: dict, pid: str, raw: list, why: str | None) -> tuple[dict, list[str]]:
    """Replace the steps that haven't started. Inside what was approved it takes effect now; beyond it, it waits for
    the user's OK. Returns (the plan, why it is beyond: empty when it took effect)."""
    r = _row(c, user, pid)
    if r["status"] not in OPEN:
        raise PlanError(f"that plan is {r['status']}: write a new plan instead")
    steps, env = db.loads(r["steps"], []), db.loads(r["envelope"], {})
    kept = [s for s in steps if s["status"] != "pending"]
    new = check(c, user, raw, kept)
    for s in kept:  # a step that failed is replaced by what the revision says instead
        if s["status"] in ("failed", "cancelled"):
            s.update(status="skipped", note=f"{s.get('note') or 'failed'} (replaced by a revision)")
    now = time.time()
    if r["status"] == "proposed":  # not approved yet: the card simply shows the new steps
        c.execute(db.plans.update().where(db.plans.c.id == pid).values(
            steps=db.dumps(new), envelope=db.dumps(envelope_of(new)), updated=now, rev=r["rev"] + 1))
        return public(c, _row(c, user, pid)), []
    reasons = beyond(env, new, kept, _spent(c, user["id"], steps, finished_only=True))
    if reasons:
        both = envelope_of([s for s in kept if s["status"] != "skipped"] + new)   # what the OK would cover: the plan as changed
        pend = {"steps": new, "why": (why or "").strip()[:600] or None, "reasons": reasons,
                "envelope": {**both, "machines": sorted(set(both["machines"]) | set(env["machines"])),
                             "datasets": sorted(set(both["datasets"]) | set(env["datasets"])),
                             "kinds": sorted(set(both["kinds"]) | set(env.get("kinds", []))),
                             "models": sorted(set(both["models"]) | set(env.get("models", []))),
                             "max_px": max(both["max_px"], env.get("max_px", 0))}}
        c.execute(db.plans.update().where(db.plans.c.id == pid).values(pending=db.dumps(pend), updated=now, rev=r["rev"] + 1))
        _say(c, r, f"A change to the plan \"{r['title']}\" goes beyond what was approved ({'; '.join(reasons)}). "
                   "It waits for your OK on the plan's card.")
        return public(c, _row(c, user, pid)), reasons
    c.execute(db.plans.update().where(db.plans.c.id == pid).values(
        steps=db.dumps(kept + new), status="running", message=None, pending=None, updated=now, rev=r["rev"] + 1))
    _say(c, r, f"The plan \"{r['title']}\" was changed" + (f": {why.strip()[:300]}" if why and why.strip() else "") + ".")
    advance_safe(c, pid)
    return public(c, _row(c, user, pid)), []


def approve(c: sa.Connection, user: dict, pid: str) -> dict:
    """The user's Start (or their OK to a revision that goes beyond what they approved before)."""
    r = _row(c, user, pid)
    now = time.time()
    pend = db.loads(r["pending"])
    if r["status"] == "proposed":
        c.execute(db.plans.update().where(db.plans.c.id == pid).values(status="running", approved=now, updated=now, rev=r["rev"] + 1))
    elif pend and r["status"] in ("running", "waiting"):
        steps = [s for s in db.loads(r["steps"], []) if s["status"] != "pending"]
        for s in steps:
            if s["status"] in ("failed", "cancelled"):
                s.update(status="skipped", note=f"{s.get('note') or 'failed'} (replaced by a revision)")
        # the plan went on while the change waited: a step that has started since stays as it started (not twice)
        started = {s["id"] for s in steps}
        new = [s for s in pend["steps"] if s["id"] not in started]
        env = {**db.loads(r["envelope"], {}), **{k: v for k, v in pend["envelope"].items() if k != "tries"}}
        c.execute(db.plans.update().where(db.plans.c.id == pid).values(
            steps=db.dumps(steps + new), envelope=db.dumps(env), pending=None, status="running", message=None,
            updated=now, rev=r["rev"] + 1))
    else:
        raise HTTPException(409, f"this plan is {r['status']}: there is nothing to approve")
    advance_safe(c, pid)
    return public(c, _row(c, user, pid))


def decline(c: sa.Connection, user: dict, pid: str) -> dict:
    r = _row(c, user, pid)
    now = time.time()
    if r["status"] == "proposed":
        c.execute(db.plans.update().where(db.plans.c.id == pid).values(status="declined", finished=now, updated=now, rev=r["rev"] + 1))
    elif r["pending"]:
        c.execute(db.plans.update().where(db.plans.c.id == pid).values(pending=None, updated=now, rev=r["rev"] + 1))
    else:
        raise HTTPException(409, f"this plan is {r['status']}: there is nothing to decline")
    return public(c, _row(c, user, pid))


def cancel(c: sa.Connection, user: dict, pid: str) -> dict:
    """Stop: cancel what the plan has queued or running, and start nothing more."""
    r = _row(c, user, pid)
    if r["status"] not in ("running", "waiting"):
        raise HTTPException(409, f"this plan is {r['status']}")
    steps = db.loads(r["steps"], [])
    for s in steps:
        if s["status"] == "running":
            try:
                if s["kind"] == "search":
                    search.cancel(c, user, s["search_id"])
                elif s.get("run_id"):
                    model.cancel_run(c, user, s["run_id"])
            except HTTPException:
                pass
            s.update(status="cancelled", note="stopped with the plan")
        elif s["status"] == "pending":
            s["status"] = "skipped"
    now = time.time()
    c.execute(db.plans.update().where(db.plans.c.id == pid).values(
        status="cancelled", steps=db.dumps(steps), pending=None, message="Stopped by you.", finished=now, updated=now, rev=r["rev"] + 1))
    return public(c, _row(c, user, pid))


def resume(c: sa.Connection, user: dict, pid: str, how: str) -> dict:
    """A waiting plan goes on: its failed step is tried again as it was, or skipped."""
    r = _row(c, user, pid)
    if r["status"] != "waiting":
        raise HTTPException(409, f"this plan is {r['status']}: it isn't waiting")
    steps = db.loads(r["steps"], [])
    for s in steps:
        if s["status"] not in ("failed", "cancelled"):
            continue
        if how == "skip":
            s.update(status="skipped", note=f"{s.get('note') or 'failed'} (skipped by you)")
            continue
        run = _run(c, user["id"], s.get("run_id")) if s["kind"] == "run" else None
        if run is not None and run["status"] in ("failed", "interrupted", "cancelled"):
            model.requeue_run(c, user, run["id"])  # stages that finished are kept
            s["attempts"].append({"run_id": run["id"], "at": time.time(), "by": "you"})
            s.update(status="running", note=None, finished=None)
        else:
            s.update(status="pending", note=None, finished=None)
    c.execute(db.plans.update().where(db.plans.c.id == pid).values(
        status="running", steps=db.dumps(steps), message=None, updated=time.time(), rev=r["rev"] + 1))
    advance_safe(c, pid)
    return public(c, _row(c, user, pid))


# ---------------------------------------------------------------- API

def _engine(request: Request) -> sa.Engine:
    return request.app.state.engine


@router.get("/plans")
def get_plans(request: Request, open: bool = False, user: dict = Depends(auth.current_user)):  # noqa: A002
    with _engine(request).begin() as c:
        advance_open(c, user)
        return list_plans(c, user, only_open=open)


@router.get("/plans/{pid}")
def get_plan(pid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        _row(c, user, pid)  # 404 before advancing someone else's
        advance_safe(c, pid)
        return public(c, _row(c, user, pid))


@router.post("/plans/{pid}/approve")
def post_approve(pid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return approve(c, user, pid)


@router.post("/plans/{pid}/decline")
def post_decline(pid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return decline(c, user, pid)


@router.post("/plans/{pid}/cancel")
def post_cancel(pid: str, request: Request, user: dict = Depends(auth.current_user)):
    with _engine(request).begin() as c:
        return cancel(c, user, pid)


class ResumeIn(BaseModel):
    how: str = "retry"


@router.post("/plans/{pid}/resume")
def post_resume(pid: str, body: ResumeIn, request: Request, user: dict = Depends(auth.current_user)):
    if body.how not in ("retry", "skip"):
        raise HTTPException(422, "how must be retry or skip")
    with _engine(request).begin() as c:
        return resume(c, user, pid, body.how)
