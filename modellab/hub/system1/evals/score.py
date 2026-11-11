"""Score the raw answers of an eval run and write the report.

    python -m modellab.hub.system1.evals.score runs/system1-eval [--reference anthropic/claude-sonnet-5.5]

Every model is scored twice: against the golden set's own expected decisions (the ground truth, known by
construction) and against the reference model's decisions (agreement). What decides whether a model may act on
its own is the first: the fast path's precision and how much of the work it covers at that precision.

Words used in the report:
  decision   the action, and every value the action needs, both right
  fast path  taken when the router (route.py) would act without Claude: one action, both option orders agree, the
             required values found, and the least certain answer at or above the threshold
  precision  of the fast paths taken, how many were right and were meant to be fast; the rest are confident mistakes
  coverage   of the cases meant for the fast path, how many it took and got right
"""

from __future__ import annotations

import argparse
import json
import statistics
from pathlib import Path

from .. import actions as A
from ..route import route
from . import golden
from .run import slug

THRESHOLDS = (0.0, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.93, 0.95, 0.97, 0.98, 0.99, 0.995)
GATE = 0.98  # look and draft actions: the fast path must be right this often


def _same(action: str, got: dict, want: dict) -> bool:
    if action == "results.compare":
        return {got.get("run"), got.get("run_b")} == {want.get("run"), want.get("run_b")} and len(got) == len(want)
    return got == want


def judge(case: dict, answers: dict | None) -> dict:
    """One case, one model: what it decided and whether that was right."""
    screen = golden.SCREENS[case["screen"]]
    if not answers:
        return {"answered": False, "action_ok": False, "decision_ok": False, "intent_ok": False, "gate": False,
                "conf": None, "agree": False, "complete": None, "action": None, "values": {}, "p_action": None}
    d = route(answers, screen, threshold=0.0)
    want = case["action"]
    action_ok = want is None or d.action == want
    decision_ok = action_ok and (want in (None, A.NONE) or _same(want, d.values, case["values"]))
    return {"answered": True, "action": d.action, "values": d.values, "action_ok": action_ok,
            "decision_ok": decision_ok, "intent_ok": d.intent in case["intent"], "gate": d.fast, "conf": d.confidence,
            "agree": (answers.get("action_rev") or {}).get("pick") == (answers.get("action") or {}).get("pick"),
            "complete": (answers.get("complete") or {}).get("pick"), "p_action": (answers.get("action") or {}).get("p")}


def fast_path(cases, judged, threshold, need_complete=False):
    """(taken, right, coverage, precision) of the fast path at a threshold."""
    taken = right = 0
    meant = sum(c["fast"] for c in cases)
    for c, j in zip(cases, judged):
        if not j["gate"] or (j["conf"] is not None and j["conf"] < threshold):
            continue
        if need_complete and j["complete"] is False:
            continue
        taken += 1
        right += c["fast"] and j["decision_ok"]
    return taken, right, right / meant if meant else 0.0, right / taken if taken else 1.0


def _pct(xs, q):
    xs = sorted(xs)
    return xs[min(len(xs) - 1, int(q * len(xs)))] if xs else None


def ece(judged, bins=10):
    rows = [(j["p_action"], j["action_ok"]) for j in judged if j["answered"] and j["p_action"] is not None]
    if not rows:
        return None
    total = 0.0
    for b in range(bins):
        inb = [(p, ok) for p, ok in rows if (b / bins <= p < (b + 1) / bins) or (b == bins - 1 and p == 1.0)]
        if inb:
            total += len(inb) / len(rows) * abs(sum(p for p, _ in inb) / len(inb) - sum(ok for _, ok in inb) / len(inb))
    return total


def score_model(cases, rows: dict, ref: dict | None, timings: list[float] | None) -> dict:
    judged = [judge(c, (rows.get(c["id"]) or {}).get("answers")) for c in cases]
    n = len(cases)
    with_action = [j for c, j in zip(cases, judged) if c["action"] is not None]
    secs = timings or [r["seconds"] for r in rows.values()]
    costs = [r["cost"] for r in rows.values() if r.get("cost") is not None]
    out = {
        "answered": sum(j["answered"] for j in judged) / n,
        "action": sum(j["action_ok"] for j in with_action) / len(with_action),
        "decision": sum(j["decision_ok"] for j in with_action) / len(with_action),
        "intent": sum(j["intent_ok"] for j in judged) / n,
        "order_disagree": sum(not j["agree"] for j in judged if j["answered"]) / max(1, sum(j["answered"] for j in judged)),
        "probabilities": any(j["conf"] is not None for j in judged),
        "ece": ece(judged),
        "p50": _pct(secs, 0.5), "p95": _pct(secs, 0.95), "timed_alone": bool(timings),
        "cost": statistics.mean(costs) if costs else None,
        "served_by": next((r.get("served_by") for r in rows.values() if r.get("served_by")), None),
        "by_cat": {},
    }
    sweep = {}
    for t in THRESHOLDS if out["probabilities"] else (0.0,):
        for nc in (False, True):
            taken, right, cov, prec = fast_path(cases, judged, t, nc)
            sweep[(t, nc)] = {"threshold": t, "need_complete": nc, "taken": taken, "mistakes": taken - right,
                              "coverage": cov, "precision": prec}
    out["plain"] = sweep[(0.0, False)]
    ok = [s for s in sweep.values() if s["precision"] >= GATE and s["taken"]]
    out["best"] = max(ok, key=lambda s: (s["coverage"], -s["threshold"])) if ok else None
    out["sweep"] = [s for (t, nc), s in sweep.items() if not nc]
    for cat in sorted({c["cat"] for c in cases}):
        idx = [i for i, c in enumerate(cases) if c["cat"] == cat]
        fast_meant = [i for i in idx if cases[i]["fast"]]
        out["by_cat"][cat] = {
            "n": len(idx),
            "decision": sum(judged[i]["decision_ok"] for i in idx) / len(idx),
            "wrongly_fast": sum(judged[i]["gate"] and not (cases[i]["fast"] and judged[i]["decision_ok"]) for i in idx),
            "fast_meant": len(fast_meant)}
    if ref is not None:
        same = both = 0
        for c, j in zip(cases, judged):
            r = ref.get(c["id"])
            if r and j["answered"]:
                both += 1
                same += j["action"] == r["action"] and (j["action"] == A.NONE or _same(j["action"], j["values"], r["values"]))
        out["agree_ref"] = same / both if both else None
    out["judged"] = judged
    return out


def load(out: Path, model: str) -> dict:
    p = out / "raw" / f"{slug(model)}.jsonl"
    return {r["id"]: r for r in map(json.loads, p.read_text().splitlines())} if p.exists() else {}


def f(x, digits=1, pct=True):
    if x is None:
        return "n/a"
    return f"{100 * x:.{digits}f} %" if pct else f"{x:.{digits}f}"


def ms(x):
    return "n/a" if x is None else f"{1000 * x:.0f} ms"


def report(out: Path, reference: str) -> str:
    meta = json.loads((out / "meta.json").read_text())
    listed = json.loads((out / "models.json").read_text())
    cases = golden.cases()[: meta["cases"]]
    models = [(m, False) for m in listed] + [(m, True) for m in meta["chat"]]
    ref_rows = load(out, reference)
    ref = {c["id"]: judge(c, (ref_rows.get(c["id"]) or {}).get("answers")) for c in cases} if ref_rows else None
    scores, skipped = {}, []
    for m, chat in models:
        rows = load(out, m)
        if len(rows) < 0.5 * len(cases):
            errs = out / "raw" / f"{slug(m)}.errors.json"
            why = json.loads(errs.read_text())[0]["error"][:110] if errs.exists() else "no answers"
            skipped.append((m, len(rows), why))
            continue
        lat = out / "latency" / f"{slug(m)}.json"
        s = score_model(cases, rows, ref, json.loads(lat.read_text()) if lat.exists() else None)
        s["chat"] = chat
        s["price_in"] = (listed.get(m) or {}).get("price_in")
        scores[m] = s

    def rank(item):
        s = item[1]
        return (-(s["best"]["coverage"] if s["best"] else -1), -s["decision"], s["p50"] or 9)

    order = sorted(scores.items(), key=rank)
    n_fast = sum(c["fast"] for c in cases)
    L = [f"# System 1 evaluation, {meta['when']}", "",
         f"{len(cases)} golden cases ({n_fast} meant for the fast path, {len(cases) - n_fast} meant to be handed "
         f"over), {len(scores)} models through OpenRouter. Reference: `{reference}`.", "",
         "## Ranking", "",
         f"Sorted by how much of the fast-path work a model covers while its fast path stays at least "
         f"{100 * GATE:.0f} % right. \"never\" means no threshold reaches {100 * GATE:.0f} %.", "",
         "| model | decision right | fast path: coverage at the gate | threshold | confident mistakes there | "
         "agrees with the reference | median | 95th pct | cost per request |",
         "|---|---|---|---|---|---|---|---|---|"]
    for m, s in order:
        b = s["best"]
        cov = f(b["coverage"]) if b else "never"
        thr = ("n/a" if not b else "none needed" if b["threshold"] == 0 else f"{b['threshold']:g}"
               ) + (" + complete" if b and b["need_complete"] else "")
        cost = "n/a" if s["cost"] is None else f"${s['cost']:.6f}"
        L.append(f"| `{m}`{' (chat)' if s['chat'] else ''} | {f(s['decision'])} | {cov} | {thr} | "
                 f"{b['mistakes'] if b else 'n/a'} of {b['taken'] if b else 'n/a'} | {f(s.get('agree_ref'))} | "
                 f"{ms(s['p50'])} | {ms(s['p95'])} | {cost} |")
    L += ["", "## Without a threshold", "",
          "What each model does when every structurally valid answer is acted on. Mistakes here are fast paths "
          "taken that were wrong or should have been handed over.", "",
          "| model | answered | action right | decision right | intent right | fast paths taken | mistakes | "
          "precision | option orders disagree | calibration error |", "|---|---|---|---|---|---|---|---|---|---|"]
    for m, s in order:
        p = s["plain"]
        L.append(f"| `{m}` | {f(s['answered'], 0)} | {f(s['action'])} | {f(s['decision'])} | {f(s['intent'])} | "
                 f"{p['taken']} | {p['mistakes']} | {f(p['precision'])} | {f(s['order_disagree'])} | "
                 f"{f(s['ece'], 3, False) if s['ece'] is not None else 'no probabilities'} |")
    cats = sorted({c["cat"] for c in cases}, key=lambda k: -sum(c["cat"] == k for c in cases))
    top = [m for m, _ in order[:8]]
    if reference in scores and reference not in top:
        top.append(reference)
    L += ["", "## By kind of sentence", "", "Decisions right, for the leading models.", "",
          "| kind | cases | " + " | ".join(f"`{m.split('/')[-1]}`" for m in top) + " |", "|---|---|" + "---|" * len(top)]
    for cat in cats:
        L.append(f"| {cat} | {scores[top[0]]['by_cat'][cat]['n']} | "
                 + " | ".join(f(scores[m]["by_cat"][cat]["decision"], 0) for m in top) + " |")
    L += ["", "Fast paths wrongly taken, by kind (no threshold):", "",
          "| kind | " + " | ".join(f"`{m.split('/')[-1]}`" for m in top) + " |", "|---|" + "---|" * len(top)]
    for cat in cats:
        L.append(f"| {cat} | " + " | ".join(str(scores[m]["by_cat"][cat]["wrongly_fast"]) for m in top) + " |")
    if skipped:
        L += ["", "## Not scored", "", "| model | answered | why |", "|---|---|---|"]
        L += [f"| `{m}` | {n} | {why.replace('|', '/')} |" for m, n, why in skipped]
    (out / "scores.json").write_text(json.dumps(
        {m: {k: v for k, v in s.items() if k != "judged"} for m, s in scores.items()}, indent=1, default=str))
    (out / "judged.json").write_text(json.dumps({m: s["judged"] for m, s in scores.items()}))
    text = "\n".join(L) + "\n"
    (out / "REPORT.md").write_text(text)
    return text


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("out")
    ap.add_argument("--reference", default="anthropic/claude-sonnet-5.5")
    a = ap.parse_args(argv)
    print(report(Path(a.out), a.reference))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
