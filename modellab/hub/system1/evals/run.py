"""Ask every model the golden set, and keep the raw answers.

    OPENROUTER_API_KEY=... python -m modellab.hub.system1.evals.run --out runs/system1-eval
    python -m modellab.hub.system1.evals.score runs/system1-eval          # the report

Decision models come from OpenRouter's own list (output modality "decisions", pinned ids only); chat models are
named with --chat and answer the same questions through structured outputs. Answers are written one JSON line per
case to <out>/raw/<model>.jsonl; a second run asks only for what is missing, so it can be resumed.

Latency is measured here, around each request on a warm connection, so it includes the network between this
computer and OpenRouter. --sequential N adds a pass of N cases, one request at a time, for cleaner timings.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from .. import questions
from ..providers import OpenRouter
from . import golden

CHAT = ("anthropic/claude-sonnet-5.5", "anthropic/claude-haiku-5.5")


def decision_models(client: OpenRouter) -> list[dict]:
    r = client.http.get("/api/v1/models", params={"output_modalities": "decisions"})
    r.raise_for_status()
    rows = [m for m in r.json()["data"] if "decisions" in (m.get("architecture") or {}).get("output_modalities", [])]
    return sorted((m for m in rows if not m["id"].startswith("~")), key=lambda m: m["id"])


def slug(model: str) -> str:
    return model.replace("/", "__").replace(":", "_")


class Pace:
    """At most `rpm` requests a minute, across threads (OpenRouter caps some models for new accounts)."""

    def __init__(self, rpm: float | None):
        self.gap, self.next, self.lock = (60.0 / rpm if rpm else 0.0), 0.0, threading.Lock()

    def wait(self) -> None:
        if not self.gap:
            return
        with self.lock:
            now = time.monotonic()
            due = max(now, self.next)
            self.next = due + self.gap
        time.sleep(max(0.0, due - now))


PACE = Pace(None)


def ask(client: OpenRouter, model: str, chat: bool, case: dict) -> dict:
    PACE.wait()
    state, q = questions.build(case["sentence"], golden.SCREENS[case["screen"]])
    r = (client.decide_chat if chat else client.decide)(model, state, q)
    return {"id": case["id"], "answers": r.answers, "seconds": round(r.seconds, 4), "cost": r.cost,
            "input_tokens": r.input_tokens, "output_tokens": r.output_tokens, "served_by": r.served_by,
            "error": r.error}


def run_model(client: OpenRouter, model: str, chat: bool, cases: list[dict], out: Path, workers: int) -> dict:
    path = out / "raw" / f"{slug(model)}.jsonl"
    path.parent.mkdir(parents=True, exist_ok=True)
    have = {}
    if path.exists():
        for line in path.read_text().splitlines():
            row = json.loads(line)
            if not row.get("error"):
                have[row["id"]] = row
    todo = [c for c in cases if c["id"] not in have]
    if todo:
        first = ask(client, model, chat, todo[0])  # one request first: a model that can't take our questions fails once
        rows = [first]
        if first["error"] and len(todo) > 1:
            second = ask(client, model, chat, todo[1])
            rows.append(second)
            rest = [] if second["error"] else todo[2:]
        else:
            rest = todo[1:]
        with ThreadPoolExecutor(workers) as pool:
            rows += list(pool.map(lambda c: ask(client, model, chat, c), rest))
        for row in rows:
            if not row["error"]:
                have[row["id"]] = row
        errors = [r for r in rows if r["error"]]
        path.write_text("".join(json.dumps(have[c["id"]]) + "\n" for c in cases if c["id"] in have))
        if errors:
            (out / "raw" / f"{slug(model)}.errors.json").write_text(json.dumps(errors[:20], indent=1))
        return {"model": model, "answered": len(have), "errors": len(todo) - len(rows) + len(errors),
                "first_error": errors[0]["error"] if errors else None}
    return {"model": model, "answered": len(have), "errors": 0, "first_error": None}


def sequential(client: OpenRouter, model: str, chat: bool, cases: list[dict], out: Path) -> None:
    ask(client, model, chat, cases[0])  # warm the connection
    rows = [ask(client, model, chat, c) for c in cases]
    path = out / "latency" / f"{slug(model)}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps([r["seconds"] for r in rows if not r["error"]]))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--out", default="runs/system1-eval")
    ap.add_argument("--models", help="comma-separated decision models (default: every pinned one on OpenRouter)")
    ap.add_argument("--chat", default=",".join(CHAT), help="comma-separated chat models, the reference first")
    ap.add_argument("--limit", type=int, help="only the first N cases")
    ap.add_argument("--workers", type=int, default=6, help="requests in flight per model")
    ap.add_argument("--parallel", type=int, default=3, help="models asked at the same time")
    ap.add_argument("--sequential", type=int, default=0, help="also time N cases one request at a time")
    ap.add_argument("--rpm", type=float, help="at most this many requests a minute, over all models in this run")
    ap.add_argument("--no-retention", action="store_true", help="only providers that don't keep or train on data")
    a = ap.parse_args(argv)
    key = os.environ.get("OPENROUTER_API_KEY")
    if not key:
        print("set OPENROUTER_API_KEY", file=sys.stderr)
        return 2
    global PACE
    PACE = Pace(a.rpm)
    out = Path(a.out)
    client = OpenRouter(key, provider={"data_collection": "deny"} if a.no_retention else None)
    cases = golden.cases()[: a.limit] if a.limit else golden.cases()
    listed = decision_models(client)
    (out / "raw").mkdir(parents=True, exist_ok=True)
    (out / "models.json").write_text(json.dumps(
        {m["id"]: {"name": m.get("name"), "price_in": m["pricing"].get("prompt"), "context": m.get("context_length"),
                   "dated": m.get("canonical_slug")} for m in listed}, indent=1))
    models = [(m, False) for m in ([m["id"] for m in listed] if a.models is None else a.models.split(",")) if m]
    models += [(m, True) for m in a.chat.split(",") if m]
    (out / "meta.json").write_text(json.dumps({"cases": len(cases), "chat": [m for m, c in models if c],
                                              "when": time.strftime("%Y-%m-%d %H:%M UTC", time.gmtime())}))
    with ThreadPoolExecutor(a.parallel) as pool:
        for res in pool.map(lambda mc: run_model(client, mc[0], mc[1], cases, out, a.workers), models):
            note = f"  first error: {res['first_error'][:140]}" if res["first_error"] else ""
            print(f"{res['model']:44} answered {res['answered']:4}  errors {res['errors']:4}{note}", flush=True)
    if a.sequential:
        step = max(1, len(cases) // a.sequential)
        sample = cases[::step][: a.sequential]
        for m, chat in models:
            if (out / "raw" / f"{slug(m)}.jsonl").exists() and (out / "raw" / f"{slug(m)}.jsonl").stat().st_size:
                sequential(client, m, chat, sample, out)
                print(f"timed {m}", flush=True)
    client.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
