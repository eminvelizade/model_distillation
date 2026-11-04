"""Explainable results: the evidence Yeti (and Claude through MCP) explains from.

Each builder turns what the hub already stores (a search's state, a run's stages and results, the leaderboard) into a
compact, deterministic summary with the comparisons pre-computed: which candidates the speed budget dropped and by how
much, how each round ranked, how far the winner is ahead of the runner-up compared with the spread between seeds, where
a bigger model or a bigger input stopped paying off, what distillation or the learning rate changed. Claude adds the
reasoning in words; the numbers come from here, so they never depend on the model doing arithmetic.

mAP values are COCO mAP50:95 in percentage points (45.7 = 0.457). Latency is ms per image (batch 1; fp16 on a GPU).
"""

from __future__ import annotations

import math
import statistics

from modellab import catalog

UNITS = ("mAP values are COCO mAP50:95 in percentage points (45.7 means 0.457). Latency is milliseconds per image, "
         "batch 1, fp16 on a GPU (fp32 on CPU), network forward only.")
# a step that adds less than this many mAP points is not worth its cost
SMALL_GAIN_PTS = 0.5


def pct(x: float | None) -> float | None:
    return None if x is None else round(100.0 * float(x), 2)


def r2(x: float | None) -> float | None:
    return None if x is None else round(float(x), 2)


def model_label(model_id: str | None) -> str | None:
    det = catalog.DETECTORS.get(model_id or "")
    return det.label if det else model_id


def family(model_id: str | None) -> str | None:
    det = catalog.DETECTORS.get(model_id or "")
    return det.family if det else None


def teacher_label(tid: str | None) -> str | None:
    t = catalog.TEACHERS.get(tid or "")
    return t.label if t else tid


def _mean(xs: list[float]) -> float | None:
    return statistics.fmean(xs) if xs else None


def _std(xs: list[float]) -> float | None:
    return statistics.stdev(xs) if len(xs) > 1 else None


def _drop_none(d: dict) -> dict:
    return {k: v for k, v in d.items() if v is not None and v != [] and v != {}}


# ---------------------------------------------------------------- searches

def _frontier(points: list[dict], x: str, y: str) -> list[dict]:
    """Points no other point beats on both axes (lower x, higher y), sorted by x."""
    pts = sorted((p for p in points if p.get(x) is not None and p.get(y) is not None), key=lambda p: (p[x], -p[y]))
    out, best = [], -math.inf
    for p in pts:
        if p[y] > best:
            out.append(p)
            best = p[y]
    return out


def _steps(front: list[dict], name: str, x: str, y: str) -> list[dict]:
    """Marginal gain of each step along a frontier: how many mAP points the extra milliseconds bought."""
    steps = []
    for a, b in zip(front, front[1:]):
        dx, dy = b[x] - a[x], b[y] - a[y]
        steps.append(_drop_none({
            "from": a[name], "to": b[name], "extra_ms": r2(dx), "gain_pts": r2(dy),
            "pts_per_ms": r2(dy / dx) if dx > 1e-9 else None,
            "small_gain": dy < SMALL_GAIN_PTS,
        }))
    if len(steps) >= 2 and steps[0].get("pts_per_ms"):
        first = steps[0]["pts_per_ms"]
        for s in steps[1:]:
            if s.get("pts_per_ms") is not None and s["pts_per_ms"] < 0.25 * first:
                s["diminishing"] = True
    return steps


def _round_points(rnd: dict, cfg_by_key: dict, arch_by_key: dict) -> list[dict]:
    pts = []
    for t in rnd.get("trials", []):
        cfg = cfg_by_key.get(t["config"])
        if cfg is None or t.get("map_valid") is None:
            continue
        a = arch_by_key.get(f"{cfg['model']}@{cfg['size']}", {})
        pts.append({"config": t["config"], "model": cfg["model"], "size": cfg["size"], "lr": cfg.get("lr"),
                    "teacher": cfg.get("teacher"), "family": family(cfg["model"]), "map": pct(t["map_valid"]),
                    "latency_ms": a.get("latency_ms"), "params_m": a.get("params_m")})
    return pts


def _axes(pts: list[dict]) -> dict:
    """Fair comparisons inside one round (same epochs): input size, model size, distillation, learning rate."""
    out: dict[str, list] = {"input_size": [], "model_size": [], "distillation": [], "learning_rate": []}
    groups: dict[tuple, list[dict]] = {}
    for p in pts:  # input size: same model, rate and teacher
        groups.setdefault((p["model"], p["lr"], p["teacher"]), []).append(p)
    for (m, lr, t), g in groups.items():
        if len({p["size"] for p in g}) < 2:
            continue
        g = sorted(g, key=lambda p: p["size"])
        front = _frontier(g, "latency_ms", "map")
        out["input_size"].append(_drop_none({
            "model": model_label(m), "lr": lr, "teacher": teacher_label(t),
            "points": [_drop_none({"input_size": p["size"], "map_valid": p["map"], "latency_ms": r2(p["latency_ms"])}) for p in g],
            "best_size": max(g, key=lambda p: p["map"])["size"],
            "steps": _steps(front, "size", "latency_ms", "map"),
            "not_worth_it": [p["size"] for p in g if p not in front],
        }))
    groups = {}
    for p in pts:  # model size: same family, rate and teacher (each model at the sizes it was tried)
        groups.setdefault((p["family"], p["lr"], p["teacher"]), []).append(p)
    for (fam, lr, t), g in groups.items():
        if len({p["model"] for p in g}) < 2:
            continue
        front = _frontier(g, "latency_ms", "map")
        out["model_size"].append(_drop_none({
            "family": fam, "lr": lr, "teacher": teacher_label(t),
            "points": [_drop_none({"config": p["config"], "map_valid": p["map"], "latency_ms": r2(p["latency_ms"]),
                                   "params_m": r2(p["params_m"])}) for p in sorted(g, key=lambda p: p["latency_ms"] or 0)],
            "frontier_steps": _steps(front, "config", "latency_ms", "map"),
            "dominated": [p["config"] for p in g if p not in front],
        }))
    plain = {(p["model"], p["size"], p["lr"]): p for p in pts if not p["teacher"]}
    for p in pts:  # distillation: the same model, size and rate with and without a teacher
        base = plain.get((p["model"], p["size"], p["lr"])) if p["teacher"] else None
        if base is not None:
            out["distillation"].append({"model": model_label(p["model"]), "input_size": p["size"], "teacher": teacher_label(p["teacher"]),
                                        "map_without": base["map"], "map_with": p["map"], "gain_pts": r2(p["map"] - base["map"])})
    groups = {}
    for p in pts:  # learning rate: same model, size and teacher
        if p["lr"] is not None:
            groups.setdefault((p["model"], p["size"], p["teacher"]), []).append(p)
    for (m, s, t), g in groups.items():
        if len(g) < 2:
            continue
        g = sorted(g, key=lambda p: p["lr"])
        best = max(g, key=lambda p: p["map"])
        out["learning_rate"].append(_drop_none({
            "model": model_label(m), "input_size": s, "teacher": teacher_label(t),
            "map_by_lr": {f"{p['lr']:g}": p["map"] for p in g}, "best_lr": best["lr"],
            "spread_pts": r2(max(p["map"] for p in g) - min(p["map"] for p in g)),
        }))
    return {k: v for k, v in out.items() if v}


def _final_groups(state: dict) -> dict[str, list[dict]]:
    """Full-budget runs per configuration: the last round plus the seed repeats."""
    rounds = state.get("rounds") or []
    if not rounds or not rounds[-1].get("final"):
        return {}
    groups: dict[str, list[dict]] = {}
    for t in rounds[-1]["trials"] + (state.get("seed_trials") or []):
        if t.get("map_valid") is not None:
            groups.setdefault(t["config"], []).append(t)
    return groups


def search_evidence(s: dict) -> dict:
    """Everything that decided a search, with the comparisons that explain the recommendation."""
    spec, state, rec = s.get("spec") or {}, s.get("state") or {}, s.get("recommendation")
    budget = spec.get("speed_ms")
    names = spec.get("machine_names") or {}
    target = names.get(spec.get("target_machine"), spec.get("target_machine"))
    archs = state.get("archs") or []
    arch_by_key = {a["key"]: a for a in archs}
    cfg_by_key = {c["key"]: c for c in state.get("configs") or []}
    rounds = state.get("rounds") or []

    out: dict = {
        "search": _drop_none({
            "id": s.get("id"), "name": s.get("name"), "status": s.get("status"), "phase": s.get("phase"),
            "message": s.get("message"), "dataset": spec.get("dataset"), "link": f"/search/{s.get('id')}",
            "speed_budget_ms": budget, "speed_machine": target,
            "training_machines": [names.get(m, m) for m in spec.get("machines") or []],
            "models": [model_label(m) for m in spec.get("models") or []],
            "input_sizes": spec.get("image_sizes"), "learning_rates": spec.get("lrs") or None,
            "teachers": [teacher_label(t) for t in spec.get("teachers") or []] or None,
            "full_epochs": spec.get("epochs"), "distill_epochs": spec.get("distill_epochs") if spec.get("teachers") else None,
            "rounds_planned": spec.get("rungs"), "keep_fraction": f"1/{spec.get('eta')}" if spec.get("eta") else None,
            "seed_repeats": spec.get("seeds"), "gpu_hours_used": r2((state.get("spent_s") or 0) / 3600),
            "gpu_hour_cap": spec.get("gpu_hours"),
        }),
        "units": UNITS,
        "how_it_decides": ("1) time every candidate (model x input size) on the speed machine and drop those over the "
                           "budget; 2) successive halving: every remaining configuration trains briefly, the best "
                           f"1/{spec.get('eta', 3)} by validation mAP move on with {spec.get('eta', 3)}x the epochs, "
                           "the last round uses the full epochs and also evaluates on test; 3) the best two repeat with "
                           "other seeds; 4) recommend the best MEAN validation mAP. Test mAP is reported, never used to choose."),
    }

    # 1. speed
    timed = [a for a in archs if a.get("latency_ms") is not None]
    rows = []
    for a in sorted(archs, key=lambda a: (a.get("latency_ms") is None, a.get("latency_ms") or 0)):
        lat = a.get("latency_ms")
        rows.append(_drop_none({
            "candidate": a["key"], "model": model_label(a["model"]), "input_size": a["size"], "latency_ms": r2(lat),
            "latency_p95_ms": r2(a.get("latency_p95_ms")), "params_m": r2(a.get("params_m")),
            "fits_budget": a.get("fits"), "over_budget_ms": r2(lat - budget) if lat is not None and budget and lat > budget else None,
            "error": a.get("error"),
        }))
    device = next((a.get("latency_device") for a in timed if a.get("latency_device")), None)
    out["speed"] = _drop_none({
        "device": device, "candidates": rows, "timed": len(timed), "fit": sum(1 for a in archs if a.get("fits")),
        "dropped_as_too_slow": [a["key"] for a in timed if not a.get("fits")],
        "could_not_time": [a["key"] for a in archs if a.get("latency_ms") is None],
    })

    # 2. rounds
    planned = spec.get("rungs") or len(rounds)
    ranks: dict[str, list] = {}
    rounds_out = []
    for i, rnd in enumerate(rounds):
        ranked = sorted((t for t in rnd["trials"] if t.get("map_valid") is not None), key=lambda t: -t["map_valid"])
        nxt = set(rounds[i + 1]["configs"]) if i + 1 < len(rounds) else set()
        res = []
        for k, t in enumerate(ranked):
            ranks.setdefault(t["config"], []).append((rnd["index"] + 1, k + 1))
            res.append(_drop_none({"rank": k + 1, "config": t["config"], "map_valid": pct(t["map_valid"]),
                                   "map_test": pct(t.get("map_test")) if rnd.get("final") else None,
                                   "moved_on": (t["config"] in nxt) if nxt else None,
                                   "minutes": r2((t.get("seconds") or 0) / 60) if t.get("seconds") else None,
                                   "machine": names.get(t.get("machine_id"))}))
        cutoff = None
        if nxt:
            kept = [t for t in ranked if t["config"] in nxt]
            dropped = [t for t in ranked if t["config"] not in nxt]
            if kept and dropped:
                cutoff = {"last_kept": kept[-1]["config"], "last_kept_map": pct(kept[-1]["map_valid"]),
                          "best_dropped": dropped[0]["config"], "best_dropped_map": pct(dropped[0]["map_valid"]),
                          "margin_pts": r2(pct(kept[-1]["map_valid"]) - pct(dropped[0]["map_valid"]))}
        failed = [_drop_none({"config": t["config"], "status": t.get("status"), "error": t.get("error")})
                  for t in rnd["trials"] if t.get("map_valid") is None]
        pts = _round_points(rnd, cfg_by_key, arch_by_key)
        rounds_out.append(_drop_none({
            "round": f"{rnd['index'] + 1} of {planned}", "epochs": rnd.get("epochs"),
            "distill_epochs": rnd.get("distill_epochs") if any(cfg_by_key.get(c, {}).get("teacher") for c in rnd["configs"]) else None,
            "final": rnd.get("final"), "trained": len(rnd["trials"]), "results": res, "failed": failed, "cutoff": cutoff,
            "comparisons": _axes(pts) if len(pts) >= 2 else None,
        }))
    out["rounds"] = rounds_out
    moves = []
    for cfg, rs in ranks.items():
        for (ra, ka), (rb, kb) in zip(rs, rs[1:]):
            if abs(ka - kb) >= 2:
                moves.append({"config": cfg, "from_round": ra, "rank_before": ka, "to_round": rb, "rank_after": kb,
                              "kind": "climbed with more epochs" if kb < ka else "fell back with more epochs"})
    if moves:
        out["rank_changes"] = moves

    # 3. full-budget runs and seeds
    groups = _final_groups(state)
    finalists = []
    for cfg, ts in groups.items():
        vals = [pct(t["map_valid"]) for t in ts]
        tests = [pct(t["map_test"]) for t in ts if t.get("map_test") is not None]
        c = cfg_by_key.get(cfg, {})
        a = arch_by_key.get(f"{c.get('model')}@{c.get('size')}", {})
        finalists.append(_drop_none({
            "config": cfg, "runs": len(vals), "map_valid_runs": vals, "map_valid_mean": r2(_mean(vals)),
            "map_valid_std": r2(_std(vals)), "map_test_mean": r2(_mean(tests)), "map_test_std": r2(_std(tests)),
            "latency_ms": r2(a.get("latency_ms")), "run_ids": [t["run_id"] for t in ts if t.get("run_id")],
        }))
    finalists.sort(key=lambda f: -(f.get("map_valid_mean") or 0))
    variances = [f["map_valid_std"] ** 2 for f in finalists if f.get("map_valid_std") is not None]
    noise = r2(math.sqrt(statistics.fmean(variances))) if variances else None
    if finalists:
        out["full_budget"] = _drop_none({"finalists": finalists, "seed_noise_pts": noise,
                                         "note": None if noise is not None else "only one run per configuration: the noise between seeds is unknown"})

    # 4. the recommendation and why
    if rec:
        arch = arch_by_key.get(f"{rec['model']}@{rec['image_size']}", {})
        lat = rec.get("latency_ms")
        why: dict = _drop_none({
            "config": rec.get("config"), "model": model_label(rec.get("model")), "input_size": rec.get("image_size"),
            "learning_rate": rec.get("lr"), "distilled_from": teacher_label(rec.get("teacher")),
            "latency_ms": r2(lat), "latency_device": rec.get("latency_device"), "budget_ms": budget,
            "headroom_ms": r2(budget - lat) if lat is not None and budget else None,
            "headroom_pct": r2(100 * (budget - lat) / budget) if lat is not None and budget else None,
            "params_m": r2(rec.get("params_m") or arch.get("params_m")), "peak_vram_mb": r2(arch.get("peak_vram_mb")),
            "map_valid_mean": pct(rec.get("map_valid_mean")), "runs": rec.get("runs"),
            "map_test_mean": pct(rec.get("map_test_mean")), "map_test_std": pct(rec.get("map_test_std")),
            "test_minus_valid_pts": r2(pct(rec["map_test_mean"]) - pct(rec["map_valid_mean"]))
            if rec.get("map_test_mean") is not None and rec.get("map_valid_mean") is not None else None,
            "stopped_early": rec.get("early") or None,
            "best_run": f"/runs/{rec['best_run_id']}" if rec.get("best_run_id") else None,
        })
        if len(finalists) >= 2 and finalists[0]["config"] == rec.get("config"):
            ru, w = finalists[1], finalists[0]
            margin = r2(w["map_valid_mean"] - ru["map_valid_mean"])
            if noise is None:
                verdict = "unknown: one run per configuration, so the noise between seeds is unknown"
            elif margin <= noise:
                verdict = "within seed noise: treat the two as tied"
            elif margin <= 2 * noise:
                verdict = "small: between one and two times the seed noise"
            else:
                verdict = "clear: more than twice the seed noise"
            why["runner_up"] = _drop_none({"config": ru["config"], "map_valid_mean": ru.get("map_valid_mean"),
                                           "latency_ms": ru.get("latency_ms"), "margin_pts": margin, "verdict": verdict})
        else:
            # only the winner trained with the full budget: its last head-to-head was in an earlier, shorter round
            prev = next((r for r in reversed(rounds) if len([t for t in r["trials"] if t.get("map_valid") is not None]) >= 2), None)
            if prev is not None:
                ranked = sorted((t for t in prev["trials"] if t.get("map_valid") is not None), key=lambda t: -t["map_valid"])
                me = next((t for t in ranked if t["config"] == rec.get("config")), None)
                other = next((t for t in ranked if t["config"] != rec.get("config")), None)
                if me and other:
                    why["runner_up"] = _drop_none({
                        "config": other["config"], "round": prev["index"] + 1, "epochs": prev.get("epochs"),
                        "map_valid_winner": pct(me["map_valid"]), "map_valid_runner_up": pct(other["map_valid"]),
                        "margin_pts": r2(pct(me["map_valid"]) - pct(other["map_valid"])),
                        "verdict": (f"compared in round {prev['index'] + 1} at {prev.get('epochs')} epoch(s); only the "
                                    "winner trained with the full budget, so there is no full-budget head-to-head"),
                    })
        if lat is not None:
            faster = [f for f in finalists if f.get("latency_ms") is not None and f["latency_ms"] < lat
                      and f["config"] != rec.get("config")]
            if faster:
                why["faster_finalists"] = [{"config": f["config"], "saves_ms": r2(lat - f["latency_ms"]),
                                            "costs_pts": r2((pct(rec.get("map_valid_mean")) or 0) - f["map_valid_mean"])} for f in faster]
        slow = sorted((a for a in timed if not a.get("fits")), key=lambda a: a["latency_ms"])
        if slow:
            why["too_slow_for_the_budget"] = [{"candidate": a["key"], "latency_ms": r2(a["latency_ms"]),
                                               "over_budget_ms": r2(a["latency_ms"] - budget)} for a in slow[:4]]
        why["chosen_by"] = ("best mean validation mAP over the full-budget runs (last round + seed repeats); test mAP is "
                            "reported, never used to choose")
        out["recommendation"] = why

    # 5. caveats worth saying out loud
    cav = []
    if len(rounds) > 1:
        cav.append(f"Round 1 ranks configurations after only {rounds[0].get('epochs')} epoch(s): models that learn "
                   "slowly (bigger models, distilled students, low learning rates) can be dropped before they catch up.")
    if any(r.get("failed") for r in rounds_out):
        cav.append("Some trials failed (see rounds[].failed): they were ranked as if absent.")
    if rec and rec.get("early"):
        cav.append("The search stopped early (GPU-hour cap): the recommendation comes from a shorter round.")
    if noise is None and finalists:
        cav.append("No seed repeats: a difference of about one mAP point between single runs is often noise.")
    if s.get("status") == "running":
        cav.append("The search is still running: everything here can change.")
    if cav:
        out["caveats"] = cav
    return out


def search_summary(s: dict) -> dict:
    rec = s.get("recommendation") or {}
    return _drop_none({
        "id": s.get("id"), "name": s.get("name"), "status": s.get("status"), "phase": s.get("phase"),
        "message": s.get("message"), "dataset": (s.get("spec") or {}).get("dataset"),
        "speed_budget_ms": (s.get("spec") or {}).get("speed_ms"), "trials": s.get("trials"),
        "recommendation": rec.get("config"), "map_valid_mean": pct(rec.get("map_valid_mean")),
        "map_test_mean": pct(rec.get("map_test_mean")), "latency_ms": r2(rec.get("latency_ms")),
        "link": f"/search/{s.get('id')}",
    })


# ---------------------------------------------------------------- results, runs, features

def result_row(r: dict, per_class: bool = True) -> dict:
    m = r.get("metrics") or {}
    out = _drop_none({
        "label": r.get("label"), "run_id": r.get("run_id"), "stage": r.get("stage"), "model": model_label(r.get("model")),
        "dataset": r.get("dataset"), "split": r.get("split"), "map": pct(r.get("map")), "map50": pct(r.get("map50")),
        "ap_small": pct(r.get("ap_small")), "ap_medium": pct(r.get("ap_medium")), "ap_large": pct(r.get("ap_large")),
        "latency_ms": r2(r.get("latency_ms")), "latency_p95_ms": r2(r.get("latency_p95_ms")),
        "latency_device": r.get("latency_device"), "params_m": r2(r.get("params_m")), "peak_vram_mb": r2(r.get("peak_vram_mb")),
        "input_size": m.get("input_size"), "images": m.get("images"), "warning": m.get("warning"),
    })
    pc = m.get("per_class") or {}
    if per_class and pc:
        vals = sorted(((k, v) for k, v in pc.items() if isinstance(v, (int, float)) and v >= 0), key=lambda kv: -kv[1])
        if len(vals) > 12:
            out["per_class_best"] = {k: pct(v) for k, v in vals[:5]}
            out["per_class_worst"] = {k: pct(v) for k, v in vals[-5:]}
            out["classes"] = len(vals)
        elif vals:
            out["per_class"] = {k: pct(v) for k, v in vals}
        if len(vals) >= 2:
            out["per_class_spread_pts"] = r2(pct(vals[0][1]) - pct(vals[-1][1]))
    return out


def eval_key(r: dict) -> str:
    return f"{r.get('eval_version')}|{r.get('dataset')}|{r.get('split')}|{r.get('dataset_hash')}"


def standing(row: dict, all_rows: list[dict]) -> dict | None:
    """Where one result stands among the results it is comparable with (same eval code, data and split)."""
    if row.get("map") is None:
        return None
    peers = [r for r in all_rows if r.get("map") is not None and eval_key(r) == eval_key(row)]
    peers.sort(key=lambda r: -r["map"])
    rank = next((i + 1 for i, r in enumerate(peers) if r["run_id"] == row["run_id"] and r["stage"] == row["stage"]), None)
    best = peers[0]
    out = {"rank": rank, "of": len(peers), "comparable_on": f"{row.get('dataset')} / {row.get('split')}"}
    if best is not row and not (best["run_id"] == row["run_id"] and best["stage"] == row["stage"]):
        out["best"] = _drop_none({"label": best.get("label"), "map": pct(best["map"]), "latency_ms": r2(best.get("latency_ms")),
                                  "link": f"/runs/{best['run_id']}", "gap_pts": r2(pct(best["map"]) - pct(row["map"]))})
    return out


def _stage_config(st: dict | None) -> dict:
    if not st:
        return {}
    keep = ("model", "student", "teacher", "init", "image_size", "lr", "lr_encoder", "batch_size", "grad_accum", "budget",
            "split", "latency", "models", "size", "max_images", "label")
    return {k: st[k] for k in keep if k in st and st[k] not in (None, "", [], {})}


def run_evidence(detail: dict, all_results: list[dict]) -> dict:
    """A run: what it did (stages and their settings), how it ended, its results and where they stand."""
    resolved = detail.get("resolved") or {}
    cfgs = {s.get("name"): s for s in resolved.get("stages") or [] if isinstance(s, dict)}
    stages = []
    for s in detail.get("stages") or []:
        res = s.get("result") or {}
        metrics = {k: v for k, v in (res.get("metrics") or {}).items() if k not in ("per_class", "probes", "cka", "attention", "classes")}
        dur = (s["finished"] - s["started"]) if s.get("finished") and s.get("started") else None
        stages.append(_drop_none({
            "name": s.get("name"), "type": s.get("type"), "status": s.get("status"),
            "minutes": r2(dur / 60) if dur else None, "settings": _stage_config(cfgs.get(s.get("name"))),
            "metrics": {k: v for k, v in metrics.items() if not isinstance(v, (dict, list))} or None,
            "error": (s.get("error") or "")[-600:] or None,
            "has_figures": [a["path"].rsplit("/", 1)[-1] for a in s.get("artifacts") or [] if a.get("stored")
                            and a["path"].endswith(".png")] or None,
        }))
    results = []
    for r in detail.get("results") or []:
        row = result_row(r)
        st = standing(r, all_results)
        if st:
            row["standing"] = st
        results.append(row)
    tags = detail.get("tags") or []
    sid = next((t.split(":", 1)[1] for t in tags if isinstance(t, str) and t.startswith("search:")), None)
    dur = (detail["finished"] - detail["started"]) if detail.get("finished") and detail.get("started") else None
    out = _drop_none({
        "run": _drop_none({"id": detail.get("id"), "name": detail.get("name"), "status": detail.get("status"),
                           "status_message": detail.get("status_message"), "machine": detail.get("machine_name"),
                           "dataset": detail.get("dataset"), "seed": resolved.get("seed"), "minutes": r2(dur / 60) if dur else None,
                           "tags": tags or None, "notes": (detail.get("notes") or "")[:1000] or None,
                           "link": f"/runs/{detail.get('id')}", "part_of_search": f"/search/{sid}" if sid else None}),
        "units": UNITS,
        "stages": stages,
        "results": results,
        "error_tail": (detail.get("error_tail") or "")[-2500:] if detail.get("status") in ("failed", "interrupted") else None,
        "dataset_fingerprints": {k: (v.get("hash") if isinstance(v, dict) else v)
                                 for k, v in (detail.get("datasets") or {}).items()} if isinstance(detail.get("datasets"), dict) else None,
    })
    feats = [s for s in detail.get("stages") or [] if s.get("type") == "features" and s.get("result")]
    if feats:
        out["features"] = {s["name"]: features_evidence((s.get("result") or {}).get("metrics") or {}) for s in feats}
    return out


def features_evidence(m: dict) -> dict:
    """The features stage: probes, CKA, attention, plus how to read each."""
    out: dict = _drop_none({"split": m.get("split"), "images": m.get("images"), "objects": m.get("objects"),
                            "input_size": m.get("size"), "objects_per_class": m.get("classes")})
    probes = m.get("probes") or {}
    if probes:
        out["probes"] = {k: _drop_none({"knn_acc": pct(v.get("knn_acc")), "knn_balanced_acc": pct(v.get("knn_bal_acc")),
                                        "linear_acc": pct(v.get("linear_acc")), "linear_balanced_acc": pct(v.get("linear_bal_acc")),
                                        "error": v.get("error")}) for k, v in probes.items()}
    cka = m.get("cka") or {}
    if cka:
        out["cka"] = {k: {"objects": r2(v.get("objects")), "tokens": r2(v.get("tokens"))} for k, v in cka.items() if isinstance(v, dict)}
    att = m.get("attention") or {}
    if att:
        out["attention"] = att
    out["how_to_read"] = {
        "probes": ("Accuracy (%) of predicting each object's class from the backbone's pooled features inside its box, "
                   "with a k-nearest-neighbour vote and with a linear classifier (cross-validated, grouped by image). Higher "
                   "means the features already separate the classes; a rise after distillation means the student took in "
                   "the teacher's semantics. Balanced accuracy weighs every class equally."),
        "cka": ("Linear CKA between two models' features (0..1; 1 = same geometry up to rotation and scale), on object "
                "features and on random patch tokens. 'X vs teacher' rising after distillation means the student's "
                "representation moved toward the teacher's."),
        "pca": ("pca.png: one row per image, one column per model. Each patch is coloured by the first three principal "
                "components of that model's feature map (PCA fitted jointly over the shown images). Coherent, object-shaped "
                "regions with consistent colours across images mean semantic features; speckled or grid-like colours mean "
                "local texture. No input images are shown, by design (they never leave the PC)."),
        "attention": ("attention.png and attention metrics, when present: where the backbone's last global self-attention "
                      "layer looks. object_focus = share of attention landing inside ground-truth boxes; lift = that share "
                      "divided by the boxes' share of the image (1 = no preference, 2 = twice as concentrated on objects); "
                      "entropy (0..1) = how spread out it is; similarity_to_teacher = correlation of the attention maps "
                      "with the teacher's."),
    }
    return out


def compare_evidence(cmp: dict) -> dict:
    rows = [result_row(r, per_class=False) for r in cmp.get("rows") or []]
    best = {}
    for k, hi in (("map", True), ("map50", True), ("ap_small", True), ("latency_ms", False), ("params_m", False), ("peak_vram_mb", False)):
        vals = [(r[k], r["label"]) for r in rows if r.get(k) is not None]
        if len(vals) >= 2:
            v, lab = (max if hi else min)(vals)
            best[k] = {"best": lab, "value": v}
    pcs = {}
    for r in cmp.get("rows") or []:
        pc = (r.get("metrics") or {}).get("per_class") or {}
        for c, v in pc.items():
            if isinstance(v, (int, float)):
                pcs.setdefault(c, {})[r.get("label")] = pct(v)
    diff = cmp.get("config_diff") or []
    return _drop_none({
        "units": UNITS, "results": rows, "best_per_metric": best,
        "per_class": {c: v for c, v in list(pcs.items())[:40] if len(v) >= 2} or None,
        "config_differences": [{"key": d["key"], "values": d["values"]} for d in diff[:60]],
        "more_differences": len(diff) - 60 if len(diff) > 60 else None,
        "comparable": cmp.get("comparable"), "warnings": cmp.get("warnings"),
        "figures": cmp.get("pca") or None,
    })


def leaderboard_evidence(rows: list[dict], dataset: str | None, split: str | None, limit: int) -> dict:
    """Results ranked within each comparable group (same eval code, dataset, split and data fingerprint)."""
    rows = [r for r in rows if r.get("map") is not None and (not dataset or r.get("dataset") == dataset)
            and (not split or r.get("split") == split)]
    groups: dict[str, list[dict]] = {}
    for r in rows:
        groups.setdefault(eval_key(r), []).append(r)
    out = []
    for key, g in sorted(groups.items(), key=lambda kv: -len(kv[1])):
        g.sort(key=lambda r: -r["map"])
        pts = [{"id": f"{r['run_id']}:{r['stage']}", "latency_ms": r.get("latency_ms"), "map": r["map"]} for r in g]
        front = {p["id"] for p in _frontier(pts, "latency_ms", "map")}
        out.append({
            "dataset": g[0].get("dataset"), "split": g[0].get("split"), "results": len(g),
            "eval_version": g[0].get("eval_version"),
            "ranking": [_drop_none({**result_row(r, per_class=False), "rank": i + 1,
                                    "on_speed_accuracy_frontier": (f"{r['run_id']}:{r['stage']}" in front) or None,
                                    "run_name": r.get("run_name"), "machine": r.get("machine_name"),
                                    "link": f"/runs/{r['run_id']}"}) for i, r in enumerate(g[:limit])],
        })
    return {"units": UNITS, "groups": out[:6],
            "note": "Rows are only comparable inside a group (same evaluation code, dataset, split and data fingerprint). "
                    "on_speed_accuracy_frontier marks results no other result beats on both mAP and latency."}
