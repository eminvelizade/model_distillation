"""Searches ("find my best model"): the most accurate detector that fits a speed budget, found automatically.

1. Speed: one run on the target machine times every candidate architecture (model x input size) with the `speed`
   stage, before any training. Candidates over the budget are dropped.
2. Rounds (successive halving): every remaining configuration (architecture x learning rate x distillation teacher)
   trains briefly and is scored on the validation split; the best 1/eta move on with eta times the epochs. The last
   round trains with the full budget and also evaluates on the test split (with latency).
3. Seeds: the best two configurations of the last round run again with other seeds, so the result shows the spread.
4. The recommendation: the configuration with the best mean validation mAP. Its test mAP is reported, never used to
   choose (choosing on test would overstate it).

Trials are ordinary runs (tag `search:<id>`): same queue, logs, evaluation, leaderboard and comparability flags. The
state lives in the `searches` table and only moves forward in `advance()`, which runs when a trial run finishes (agent
events), and whenever the web app reads searches. `advance()` writes only if the row's `rev` is unchanged, so two
concurrent calls can't both start the next round.
"""

from __future__ import annotations

import math
import statistics
import sys
import time

import sqlalchemy as sa
from fastapi import HTTPException

from modellab import catalog, recipe
from modellab.hub import db, model

MAX_MACHINES = 8
MAX_ARCHS = 40
MAX_CONFIGS = 60
TRIAL_STAGE, VALID_STAGE, TEST_STAGE = "ft", "ev_valid", "ev_test"
TOP_FOR_SEEDS = 2


class Conflict(Exception):
    """Another advance() changed the search meanwhile: this one's writes are rolled back."""


# ---------------------------------------------------------------- spec

def _num(body: dict, key: str, kind, lo, hi, default=None, required: bool = False):
    v = body.get(key, default)
    if v is None:
        if required:
            raise HTTPException(422, f"{key} is required")
        return None
    if isinstance(v, bool) or not isinstance(v, (int, float)) or (kind is int and int(v) != v) or not lo <= v <= hi:
        raise HTTPException(422, f"{key} must be {'an integer' if kind is int else 'a number'} between {lo} and {hi}")
    return kind(v)


def _list(body: dict, key: str, maxlen: int) -> list:
    v = body.get(key) or []
    if not isinstance(v, list) or len(v) > maxlen:
        raise HTTPException(422, f"{key} must be a list of at most {maxlen} items")
    return v


def arch_key(model_id: str, size: int) -> str:
    return f"{model_id}@{size}"


def config_key(cfg: dict) -> str:
    k = arch_key(cfg["model"], cfg["size"])
    if cfg.get("lr"):
        k += f" lr={cfg['lr']:g}"
    if cfg.get("teacher"):
        k += f" distilled from {cfg['teacher']}"
    return k


def rung_schedule(spec: dict) -> list[dict]:
    """Epochs per round: the last round gets the full budget, each earlier one 1/eta of the next."""
    n, eta = spec["rungs"], spec["eta"]
    out = []
    for r in range(n):
        f = eta ** (n - 1 - r)
        out.append({"epochs": max(1, round(spec["epochs"] / f)), "distill_epochs": max(1, round(spec["distill_epochs"] / f))})
    return out


def archs(spec: dict) -> list[dict]:
    return [{"key": arch_key(m, s), "model": m, "size": s} for m in spec["models"] for s in spec["image_sizes"][m]]


def configs_for(spec: dict, arch_list: list[dict]) -> list[dict]:
    out = []
    for a in arch_list:
        det = catalog.DETECTORS[a["model"]]
        teachers = [None] + (spec["teachers"] if det.family == "rfdetr" else [])
        for lr in spec["lrs"] or [None]:
            for t in teachers:
                cfg = {"model": a["model"], "size": a["size"], "lr": lr, "teacher": t}
                out.append({**cfg, "key": config_key(cfg)})
    return out


def check_spec(c: sa.Connection, user: dict, body: dict) -> dict:
    """Validate a new search: names, machines (the user's own, holding the same dataset), candidates, budgets."""
    if not isinstance(body, dict):
        raise HTTPException(422, "body must be an object")
    name = str(body.get("name") or "").strip()
    if not 1 <= len(name) <= 80 or any(ord(ch) < 32 for ch in name):
        raise HTTPException(422, "name: 1-80 characters")
    ds = body.get("dataset")
    if not isinstance(ds, str) or not model.DATASET_RE.match(ds):
        raise HTTPException(422, "pick a dataset")
    mids = list(dict.fromkeys(_list(body, "machines", MAX_MACHINES)))
    if not mids or not all(isinstance(x, str) for x in mids):
        raise HTTPException(422, "pick at least one machine")
    target = body.get("target_machine") or mids[0]
    if target not in mids:
        raise HTTPException(422, "the machine that sets the speed must be one of the search's machines")
    hashes, names = {}, {}
    for mid in mids:
        m = model.get_machine(c, user, mid)
        names[mid] = m["name"]
        d = next((x for x in model.machine_datasets(m) if x.get("name") == ds), None)
        if d is None:
            raise HTTPException(422, f"{m['name']} has no dataset {ds!r}: add it on that machine first")
        if d.get("error"):
            raise HTTPException(422, f"dataset {ds!r} on {m['name']}: {d['error']}")
        if not d.get("built", True):
            raise HTTPException(422, f"dataset {ds!r} on {m['name']}: its folder is missing ({d.get('path')})")
        errs = (d.get("check") or {}).get("errors") or []
        if errs:
            raise HTTPException(422, f"dataset {ds!r} on {m['name']} has problems to fix first: {errs[0]}")
        h = (d.get("hash") or {}).get("all") if isinstance(d.get("hash"), dict) else None
        if h:
            hashes[mid] = h
    if len(set(hashes.values())) > 1:
        a, b = list(hashes)[:2]
        raise HTTPException(422, f"dataset {ds!r} differs between {names[a]} and {names[b]} (content fingerprints differ): "
                                 "a search compares trials, so every machine must hold the same data")
    models = list(dict.fromkeys(_list(body, "models", 30)))
    if not models:
        raise HTTPException(422, "pick at least one model")
    for mid_ in models:
        if mid_ not in catalog.DETECTORS:
            raise HTTPException(422, f"unknown model {mid_!r}")
    sizes_in = body.get("image_sizes") or {}
    if not isinstance(sizes_in, dict):
        raise HTTPException(422, "image_sizes must map model ids to lists of sizes")
    sizes = {}
    for mid_ in models:
        det = catalog.DETECTORS[mid_]
        lst = sizes_in.get(mid_) or [det.resolution]
        if not isinstance(lst, list) or len(lst) > 6:
            raise HTTPException(422, f"image_sizes[{mid_}]: a list of at most 6 sizes")
        for s in lst:
            if isinstance(s, bool) or not isinstance(s, int) or s % det.divisor or not 64 <= s <= 2048:
                raise HTTPException(422, f"{det.label}: input sizes must be multiples of {det.divisor} between 64 and 2048")
        sizes[mid_] = sorted(set(lst))
    lrs = _list(body, "lrs", 4)
    for lr in lrs:
        if isinstance(lr, bool) or not isinstance(lr, (int, float)) or not 0 < lr < 1:
            raise HTTPException(422, "learning rates must be numbers between 0 and 1")
    teachers = list(dict.fromkeys(_list(body, "teachers", 4)))
    for t in teachers:
        if t not in catalog.TEACHERS:
            raise HTTPException(422, f"unknown teacher {t!r}")
    epochs = _num(body, "epochs", int, 1, 500, required=True)
    spec = {
        "name": name, "dataset": ds, "machines": mids, "target_machine": target, "machine_names": names,
        "speed_ms": _num(body, "speed_ms", float, 0.01, 100000, required=True),
        "models": models, "image_sizes": sizes, "lrs": [float(x) for x in lrs], "teachers": teachers,
        "epochs": epochs, "distill_epochs": _num(body, "distill_epochs", int, 1, 500, default=max(1, epochs // 2)),
        "rungs": _num(body, "rungs", int, 1, 4, default=3), "eta": _num(body, "eta", int, 2, 4, default=3),
        "seeds": _num(body, "seeds", int, 0, 3, default=2), "seed": _num(body, "seed", int, 0, 2**31 - 1, default=42),
        "batch_size": _num(body, "batch_size", int, 1, 512), "gpu_hours": _num(body, "gpu_hours", float, 0.01, 10000),
    }
    a = archs(spec)
    if len(a) > MAX_ARCHS:
        raise HTTPException(422, f"{len(a)} model/size combinations: at most {MAX_ARCHS}")
    n = len(configs_for(spec, a))
    if n > MAX_CONFIGS:
        raise HTTPException(422, f"up to {n} configurations to train: at most {MAX_CONFIGS} (fewer sizes, rates or teachers)")
    if teachers and not any(catalog.DETECTORS[x].family == "rfdetr" for x in models):
        raise HTTPException(422, "distillation teachers only apply to RF-DETR models: pick one, or no teachers")
    return spec


def preview(spec: dict) -> dict:
    """What a search would do, before it starts (the speed phase decides how many configurations remain)."""
    a = archs(spec)
    cfgs = configs_for(spec, a)
    sched = rung_schedule(spec)
    trials, n = 0, len(cfgs)
    for i in range(len(sched)):
        trials += n
        n = max(1, math.ceil(n / spec["eta"]))
    trials += min(TOP_FOR_SEEDS, n) * spec["seeds"]
    return {"archs": len(a), "configs": len(cfgs), "rounds": sched, "max_trials": trials}


# ---------------------------------------------------------------- recipes for the runs a search starts

def speed_recipe(spec: dict, sid: str, arch_list: list[dict]) -> str:
    stages = [{"name": f"s{i + 1:02d}", "type": "speed", "model": a["model"], "image_size": a["size"]}
              for i, a in enumerate(arch_list)]
    return recipe.to_yaml({"name": f"{spec['name']} · timing", "description": f"search {sid}: speed of every candidate",
                           "dataset": spec["dataset"], "seed": spec["seed"], "tags": ["search", f"search:{sid}"],
                           "stages": stages})


def trial_recipe(spec: dict, sid: str, cfg: dict, rnd: dict, seed: int, final: bool, label: str) -> str:
    stages = []
    if cfg.get("teacher"):
        stages.append({"name": "distill", "type": "distill", "student": cfg["model"], "teacher": cfg["teacher"],
                       "budget": {"epochs": rnd["distill_epochs"]}})
    ft = {"name": TRIAL_STAGE, "type": "finetune", "model": cfg["model"], "image_size": cfg["size"],
          "budget": {"epochs": rnd["epochs"]}}
    if cfg.get("teacher"):
        ft["init"] = {"from": "distill"}
    if cfg.get("lr"):
        ft["lr"] = cfg["lr"]
    if spec.get("batch_size"):
        ft["batch_size"] = spec["batch_size"]
    stages.append(ft)
    stages.append({"name": VALID_STAGE, "type": "eval", "model": {"from": TRIAL_STAGE}, "split": "valid", "latency": False,
                   "label": f"{cfg['key']} (valid)"})
    if final:
        stages.append({"name": TEST_STAGE, "type": "eval", "model": {"from": TRIAL_STAGE}, "split": "test", "latency": True,
                       "label": cfg["key"]})
    return recipe.to_yaml({"name": f"{spec['name']} · {label}", "description": f"search {sid}: {cfg['key']}",
                           "dataset": spec["dataset"], "seed": seed, "tags": ["search", f"search:{sid}"], "stages": stages})


# ---------------------------------------------------------------- create / read / cancel

def create(c: sa.Connection, user: dict, body: dict) -> dict:
    spec = check_spec(c, user, body)
    sid = db.new_id()
    arch_list = archs(spec)
    target = model.get_machine(c, user, spec["target_machine"])
    rid = model.submit(c, user, target, speed_recipe(spec, sid, arch_list), ["search", f"search:{sid}"], "end")[0]
    state = {"speed_run": rid, "archs": [{**a, "stage": f"s{i + 1:02d}"} for i, a in enumerate(arch_list)],
             "configs": [], "rounds": [], "seed_trials": [], "spent_s": 0.0}
    now = time.time()
    c.execute(db.searches.insert().values(id=sid, owner_id=user["id"], name=spec["name"], status="running", phase="speed",
                                          spec=db.dumps(spec), state=db.dumps(state), rev=0, created=now, updated=now,
                                          message=f"timing {len(arch_list)} candidate(s) on {target['name']}"))
    return get(c, user, sid)


def _row(c: sa.Connection, user: dict, sid: str) -> dict:
    r = c.execute(sa.select(db.searches).where(db.searches.c.id == sid, db.searches.c.owner_id == user["id"])).mappings().first()
    if r is None:
        raise HTTPException(404, "no such search")
    return dict(r)


def _public(r: dict) -> dict:
    spec, state = db.loads(r["spec"], {}), db.loads(r["state"], {})
    trials = [t for rnd in state.get("rounds", []) for t in rnd["trials"]] + state.get("seed_trials", [])
    return {"id": r["id"], "name": r["name"], "status": r["status"], "phase": r["phase"], "message": r["message"],
            "created": r["created"], "updated": r["updated"], "finished": r["finished"], "spec": spec,
            "recommendation": db.loads(r["recommendation"]),
            "trials": {"total": len(trials), "done": sum(t["status"] in model.FINAL for t in trials),
                       "failed": sum(t["status"] != "done" and t["status"] in model.FINAL for t in trials)},
            "spent_s": state.get("spent_s", 0.0)}


def get(c: sa.Connection, user: dict, sid: str) -> dict:
    r = _row(c, user, sid)
    return {**_public(r), "state": db.loads(r["state"], {}), "preview": preview(db.loads(r["spec"], {}))}


def list_searches(c: sa.Connection, user: dict) -> list[dict]:
    rows = c.execute(sa.select(db.searches).where(db.searches.c.owner_id == user["id"])
                     .order_by(db.searches.c.created.desc()).limit(200)).mappings()
    return [_public(dict(r)) for r in rows]


def _all_run_ids(state: dict) -> list[str]:
    ids = [state.get("speed_run")] + [t["run_id"] for rnd in state.get("rounds", []) for t in rnd["trials"]]
    ids += [t["run_id"] for t in state.get("seed_trials", [])]
    return [i for i in ids if i]


def cancel(c: sa.Connection, user: dict, sid: str) -> dict:
    r = _row(c, user, sid)
    if r["status"] != "running":
        return get(c, user, sid)
    for rid in _all_run_ids(db.loads(r["state"], {})):
        try:
            model.cancel_run(c, user, rid)
        except HTTPException:
            pass  # deleted meanwhile
    now = time.time()
    c.execute(db.searches.update().where(db.searches.c.id == sid).values(
        status="cancelled", phase="done", finished=now, updated=now, rev=r["rev"] + 1, message="cancelled"))
    return get(c, user, sid)


def delete(c: sa.Connection, user: dict, sid: str) -> None:
    r = _row(c, user, sid)
    if r["status"] == "running":
        raise HTTPException(409, "cancel the search first")
    c.execute(db.searches.delete().where(db.searches.c.id == sid))  # its runs stay (tagged search:<id>)


# ---------------------------------------------------------------- advancing

def _run_state(c: sa.Connection, rid: str) -> dict | None:
    r = c.execute(sa.select(db.runs.c.status, db.runs.c.started, db.runs.c.finished, db.runs.c.error_tail)
                  .where(db.runs.c.id == rid)).mappings().first()
    return dict(r) if r else None


def _refresh(c: sa.Connection, state: dict) -> None:
    """Trial statuses and metrics from the runs and results tables; GPU time spent so far."""
    spent = 0.0
    for t in [t for rnd in state["rounds"] for t in rnd["trials"]] + state["seed_trials"]:
        if not t.get("run_id"):
            continue
        r = _run_state(c, t["run_id"])
        if r is None:
            t.update(status="deleted", error="the run was deleted")
            continue
        t["status"] = r["status"]
        if r["started"] and r["status"] in model.FINAL and r["finished"]:
            t["seconds"] = max(0.0, r["finished"] - r["started"])
        if r["status"] in ("failed", "interrupted"):
            t["error"] = (r["error_tail"] or "").strip().splitlines()[0][:300] if r["error_tail"] else r["status"]
        res = {row.stage: row for row in c.execute(sa.select(db.results.c.stage, db.results.c.map, db.results.c.map50,
                                                             db.results.c.latency_ms, db.results.c.latency_device)
                                                   .where(db.results.c.run_id == t["run_id"]))}
        if VALID_STAGE in res:
            t["map_valid"], t["map50_valid"] = res[VALID_STAGE].map, res[VALID_STAGE].map50
        if TEST_STAGE in res:
            t["map_test"], t["map50_test"] = res[TEST_STAGE].map, res[TEST_STAGE].map50
            t["latency_test_ms"], t["latency_test_device"] = res[TEST_STAGE].latency_ms, res[TEST_STAGE].latency_device
        spent += t.get("seconds") or 0.0
    sr = _run_state(c, state["speed_run"]) if state.get("speed_run") else None
    if sr and sr["started"] and sr["finished"]:
        spent += max(0.0, sr["finished"] - sr["started"])
    state["spent_s"] = spent


def _active_counts(c: sa.Connection, mids: list[str]) -> dict[str, int]:
    rows = c.execute(sa.select(db.runs.c.machine_id, sa.func.count()).where(
        db.runs.c.machine_id.in_(mids), db.runs.c.status.in_(("queued", "running"))).group_by(db.runs.c.machine_id)).all()
    out = {m: 0 for m in mids}
    out.update(dict(rows))
    return out


def _launch(c: sa.Connection, owner: dict, spec: dict, sid: str, jobs: list[tuple[dict, dict, int, bool, str]]) -> list[dict]:
    """Queue trial runs, each on the search machine with the fewest active runs. jobs: (cfg, round, seed, final, label)."""
    load = _active_counts(c, spec["machines"])
    trials = []
    for cfg, rnd, seed, final, label in jobs:
        text = trial_recipe(spec, sid, cfg, rnd, seed, final, label)
        t = {"config": cfg["key"], "seed": seed, "run_id": None, "machine_id": None, "status": "failed", "error": None}
        errors = []
        for mid in sorted(spec["machines"], key=lambda m: load[m]):
            row = c.execute(sa.select(db.machines).where(db.machines.c.id == mid, db.machines.c.owner_id == owner["id"],
                                                         db.machines.c.revoked.is_(False))).mappings().first()
            if row is None:
                errors.append(f"{spec['machine_names'].get(mid, mid)} was removed")
                continue
            try:
                rid = model.submit(c, owner, dict(row), text, ["search", f"search:{sid}"], "end")[0]
            except HTTPException as e:
                errors.append(f"{row['name']}: {e.detail}")
                continue
            load[mid] += 1
            t.update(run_id=rid, machine_id=mid, status="queued")
            break
        if t["run_id"] is None:
            t["error"] = "; ".join(errors)[:500] or "no machine could take it"
        trials.append(t)
    return trials


def _rank(trials: list[dict]) -> list[dict]:
    return sorted((t for t in trials if t.get("map_valid") is not None), key=lambda t: -t["map_valid"])


def _start_round(c, owner, spec, sid, state, cfgs: list[dict], index: int) -> str:
    sched = rung_schedule(spec)
    final = index == len(sched) - 1
    rnd = {"index": index, "final": final, **sched[index], "configs": [x["key"] for x in cfgs]}
    label = f"round {index + 1}/{len(sched)}"
    rnd["trials"] = _launch(c, owner, spec, sid, [(cfg, rnd, spec["seed"], final, f"{label} {cfg['key']}") for cfg in cfgs])
    state["rounds"].append(rnd)
    return (f"round {index + 1} of {len(sched)}: training {len(cfgs)} configuration(s) for {rnd['epochs']} epoch(s)"
            + (" on the full budget, then evaluating on the test split" if final else ""))


def _cfg(state: dict, key: str) -> dict:
    return next(x for x in state["configs"] if x["key"] == key)


def _recommend(spec: dict, state: dict, early: bool) -> dict | None:
    """Best configuration by mean validation mAP over its full-budget runs (last round + seed repeats)."""
    if early:
        rnd = next((r for r in reversed(state["rounds"]) if _rank(r["trials"])), None)
        if rnd is None:
            return None
        best = _rank(rnd["trials"])[0]
        groups = {best["config"]: [best]}
    else:
        groups: dict[str, list[dict]] = {}
        for t in state["rounds"][-1]["trials"] + state["seed_trials"]:
            if t.get("map_valid") is not None:
                groups.setdefault(t["config"], []).append(t)
        if not groups:
            return None
    key = max(groups, key=lambda k: statistics.fmean(t["map_valid"] for t in groups[k]))
    ts = groups[key]
    cfg = _cfg(state, key)
    arch = next(a for a in state["archs"] if a["key"] == arch_key(cfg["model"], cfg["size"]))
    tests = [t["map_test"] for t in ts if t.get("map_test") is not None]
    best_run = max(ts, key=lambda t: t["map_valid"])
    return {"config": key, "model": cfg["model"], "image_size": cfg["size"], "lr": cfg.get("lr"), "teacher": cfg.get("teacher"),
            "latency_ms": arch.get("latency_ms"), "latency_device": arch.get("latency_device"), "params_m": arch.get("params_m"),
            "map_valid_mean": statistics.fmean(t["map_valid"] for t in ts),
            "map_test_mean": statistics.fmean(tests) if tests else None,
            "map_test_std": statistics.stdev(tests) if len(tests) > 1 else None, "runs": len(ts),
            "run_ids": [t["run_id"] for t in ts], "best_run_id": best_run["run_id"], "stage": TRIAL_STAGE,
            "early": early}


NOT_TIMED = "not timed (the timing run stopped before this model)"


def _error_line(tail: str) -> str:
    """The line of a run's error tail that says what went wrong: the exception at the bottom of a traceback, else the
    first line ("stage s01 failed (exit code 1)", "could not start on this machine: ...")."""
    lines = [x.strip() for x in tail.strip().splitlines() if x.strip()]
    if not lines:
        return ""
    exc = next((x for x in reversed(lines) if not x.startswith(("[", "File ", "^", "~")) and ":" in x
                and x.split(":", 1)[0].replace(".", "").replace("_", "").isalnum()), None)
    head = lines[0]
    return f"{head}: {exc}" if exc and exc != head and len(lines) > 1 else head


def _untimed_reason(state: dict, run: dict) -> str:
    """Why no candidate has a latency: a candidate's own error, else how the timing run ended (status and error)."""
    own = next((a["error"] for a in state["archs"] if a.get("error") and a["error"] != NOT_TIMED), None)
    if own:
        return own
    line = _error_line(run.get("error_tail") or "")
    status = run["status"]
    if status == "done":
        return "the timing run finished but reported no latency (is the machine's agent up to date?)"
    said = {"failed": "failed", "interrupted": "was interrupted"}.get(status, f"ended as {status}")
    return f"the timing run {said}" + (f": {line}" if line else " (no error reported: see the timing run's log)")


def _over_budget(spec: dict, state: dict, extra_s: float = 0.0) -> bool:
    return bool(spec.get("gpu_hours")) and state["spent_s"] + extra_s >= spec["gpu_hours"] * 3600


def _step(c: sa.Connection, row: dict, owner: dict, spec: dict, state: dict) -> dict:
    """One step forward. Returns the column values to write (status, phase, message, recommendation, finished)."""
    sid = row["id"]
    _refresh(c, state)
    phase = row["phase"]

    def finish(early: bool = False, message: str | None = None) -> dict:
        rec = _recommend(spec, state, early)
        if rec is None:
            return {"status": "failed", "phase": "done", "finished": time.time(), "message": message or "no trial finished"}
        msg = message or ("done" if not early else "stopped early")
        return {"status": "done", "phase": "done", "finished": time.time(), "message": msg, "recommendation": db.dumps(rec)}

    if phase == "speed":
        r = _run_state(c, state["speed_run"])
        if r is None:
            return {"status": "failed", "phase": "done", "finished": time.time(), "message": "the timing run was deleted"}
        if r["status"] not in model.FINAL:
            return {}
        results = {s.name: db.loads(s.result, {}) for s in c.execute(
            sa.select(db.stages.c.name, db.stages.c.result).where(db.stages.c.run_id == state["speed_run"]))}
        for a in state["archs"]:
            m = (results.get(a["stage"]) or {}).get("metrics") or {}
            for k in ("latency_ms", "latency_p95_ms", "latency_device", "params_m", "peak_vram_mb", "error"):
                if m.get(k) is not None:
                    a[k] = m[k]
            if a.get("latency_ms") is None and not a.get("error"):
                a["error"] = NOT_TIMED
            a["fits"] = a.get("latency_ms") is not None and a["latency_ms"] <= spec["speed_ms"]
        if r["status"] == "cancelled":
            return {"status": "cancelled", "phase": "done", "finished": time.time(), "message": "the timing run was cancelled"}
        fitting = [a for a in state["archs"] if a["fits"]]
        if not fitting:
            timed = [a for a in state["archs"] if a.get("latency_ms") is not None]
            if not timed:
                return {"status": "failed", "phase": "done", "finished": time.time(),
                        "message": "no candidate could be timed: " + _untimed_reason(state, r)[:300]}
            fastest = min(timed, key=lambda a: a["latency_ms"])
            return {"status": "done", "phase": "done", "finished": time.time(),
                    "message": f"no candidate fits {spec['speed_ms']:g} ms on {spec['machine_names'][spec['target_machine']]}: "
                               f"the fastest is {fastest['key']} at {fastest['latency_ms']:.2f} ms"}
        state["configs"] = configs_for(spec, fitting)
        last = len(rung_schedule(spec)) - 1
        msg = _start_round(c, owner, spec, sid, state, state["configs"], 0 if len(state["configs"]) > 1 else last)
        untimed = sum(a.get("latency_ms") is None for a in state["archs"])
        skipped = f" ({untimed} could not be timed)" if untimed else ""
        return {"phase": "rungs", "message": f"{len(fitting)} of {len(state['archs'])} fit the budget{skipped}; {msg}"}

    if phase == "rungs":
        rnd = state["rounds"][-1]
        if any(t["status"] not in model.FINAL and t["status"] != "deleted" for t in rnd["trials"]):
            return {}
        ranked = _rank(rnd["trials"])
        if not ranked:
            first = next((t.get("error") for t in rnd["trials"] if t.get("error")), "no result")
            return {"status": "failed", "phase": "done", "finished": time.time(),
                    "message": f"every trial of round {rnd['index'] + 1} failed: {first}"}
        if rnd["final"]:
            if spec["seeds"] and not _over_budget(spec, state):
                top = ranked[:TOP_FOR_SEEDS]
                jobs = [(_cfg(state, t["config"]), rnd, spec["seed"] + k, True, f"seed {spec['seed'] + k} {t['config']}")
                        for t in top for k in range(1, spec["seeds"] + 1)]
                state["seed_trials"] = _launch(c, owner, spec, sid, jobs)
                return {"phase": "seeds", "message": f"repeating the best {len(top)} with {spec['seeds']} more seed(s) each"}
            return finish(message="done" if not spec["seeds"] else "done (GPU-hour budget used up before the seed repeats)")
        keep = ranked[:max(1, math.ceil(len(ranked) / spec["eta"]))]
        sched = rung_schedule(spec)
        nxt = rnd["index"] + 1 if len(keep) > 1 else len(sched) - 1
        if spec.get("gpu_hours"):
            ratio = sched[nxt]["epochs"] / max(1, rnd["epochs"])
            while keep and _over_budget(spec, state, sum((t.get("seconds") or 0.0) * ratio for t in keep)):
                keep.pop()
            if not keep:
                return finish(early=True, message="stopped early: the GPU-hour budget can't fit another round")
            nxt = rnd["index"] + 1 if len(keep) > 1 else len(sched) - 1
        msg = _start_round(c, owner, spec, sid, state, [_cfg(state, t["config"]) for t in keep], nxt)
        return {"message": msg}

    if phase == "seeds":
        if any(t["status"] not in model.FINAL and t["status"] != "deleted" for t in state["seed_trials"]):
            return {}
        return finish()
    return {}


def advance(c: sa.Connection, sid: str) -> None:
    row = c.execute(sa.select(db.searches).where(db.searches.c.id == sid)).mappings().first()
    if row is None or row["status"] != "running":
        return
    row = dict(row)
    owner = c.execute(sa.select(db.users).where(db.users.c.id == row["owner_id"])).mappings().first()
    if owner is None:
        return
    spec, state = db.loads(row["spec"], {}), db.loads(row["state"], {})
    vals = _step(c, row, dict(owner), spec, state)
    vals.update(state=db.dumps(state), updated=time.time(), rev=row["rev"] + 1)
    done = c.execute(db.searches.update().where(db.searches.c.id == sid, db.searches.c.rev == row["rev"]).values(**vals))
    if done.rowcount != 1:
        raise Conflict()
    if vals.get("status") == "done":
        from modellab.hub import notebook  # its notebook entry gets the answer

        notebook.on_search_final(c, sid)


def advance_safe(c: sa.Connection, sid: str) -> None:
    """advance() in a savepoint: a conflict or an error rolls back only the search's own writes."""
    try:
        with c.begin_nested():
            advance(c, sid)
    except Conflict:
        pass
    except Exception as e:  # noqa: BLE001  (never break the agent's event call or a page load)
        print(f"[hub] search {sid}: advance failed: {type(e).__name__}: {e}", file=sys.stderr, flush=True)


def advance_running(c: sa.Connection, user: dict) -> None:
    for (sid,) in c.execute(sa.select(db.searches.c.id).where(db.searches.c.owner_id == user["id"],
                                                             db.searches.c.status == "running")).all():
        advance_safe(c, sid)


def on_run_final(c: sa.Connection, tags: list[str]) -> None:
    for t in tags or []:
        if isinstance(t, str) and t.startswith("search:"):
            advance_safe(c, t.removeprefix("search:"))
