"""ModelLab CLI.

    modellab run recipes/baseline_stock_vs_finetuned.yaml     # queue it; runs here (foreground) if no worker is up
    modellab run recipe.yaml --detach                          # queue + make sure a background worker runs it
    modellab queue                                             # running + waiting
    modellab list [--status done] [--results]                  # runs / leaderboard rows
    modellab show <run_id> | cancel <run_id> | requeue <run_id> | delete <run_id>
    modellab validate recipe.yaml | templates
    modellab worker [--once]
    modellab weights list|fetch|verify ...  ;  modellab dataset list|add|import|build-coco-vehicles|info ...
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path


def _fmt_t(t):
    return time.strftime("%m-%d %H:%M", time.localtime(t)) if t else "-"


def _progress(run: dict) -> str:
    from modellab import store

    if run["status"] != "running" or not run.get("current_stage"):
        return ""
    try:
        p = json.loads((store.stage_dir(run["id"], run["current_stage"]) / "progress.json").read_text())
        return f"{run['current_stage']} {100 * p['fraction']:.0f}% {p.get('message', '')}"
    except (OSError, ValueError):
        return run["current_stage"]


def cmd_run(a) -> int:
    from modellab import engine, recipe, worker

    text = Path(a.recipe).read_text()
    try:
        ids = engine.submit(text, tags=a.tag or [])
    except recipe.RecipeError as e:
        print(f"recipe invalid: {e}", file=sys.stderr)
        return 2
    for i in ids:
        print(f"queued {i}")
    if worker.is_running():
        print("a worker is running; it will pick these up (see `modellab queue`)")
        return 0
    if a.detach:
        print(f"started background worker pid {worker.start_background()}")
        return 0
    print("no worker running: running the queue in the foreground (Ctrl-C stops the worker; a started run continues)")
    return worker.Worker().loop(once=True)


def cmd_queue(a) -> int:
    from modellab import store, worker

    w = worker.info()
    print(f"worker: {'alive pid ' + str(w.get('pid')) if w.get('alive') else 'not running'}")
    q = store.queue()
    if not q:
        print("queue empty")
    for r in q:
        print(f"{r['status']:<8} {r['id']:<55} {_progress(r)}")
    return 0


def cmd_list(a) -> int:
    from modellab import store

    if a.results:
        rows = store.results()
        print(f"{'run':<52} {'stage':<12} {'label':<28} {'mAP':>6} {'mAP50':>6} {'lat ms':>7}  comparable-key")
        for r in rows:
            lat = f"{r['latency_ms']:.2f}" if r["latency_ms"] is not None else "-"
            key = f"{r['eval_version']}/{(r['dataset_hash'] or '')[:8]}"
            print(f"{r['run_id']:<52} {r['stage']:<12} {r['label'][:28]:<28} {r['map'] or 0:6.3f} {r['map50'] or 0:6.3f} {lat:>7}  {key}")
        return 0
    for r in store.list_runs(status=a.status):
        res = store.get_run(r["id"])["results"]
        best = max((x["map"] or 0 for x in res), default=None)
        print(f"{r['status']:<11} {r['id']:<55} {_fmt_t(r['created'])}  "
              + (f"best mAP {best:.3f}" if best is not None else "") + f"  {_progress(r)}")
    return 0


def cmd_show(a) -> int:
    from modellab import store

    r = store.get_run(a.run_id)
    if not r:
        print("no such run", file=sys.stderr)
        return 1
    print(json.dumps({k: v for k, v in r.items() if k != "results"}, indent=2, default=str))
    for x in r["results"]:
        print(f"result {x['stage']}: mAP={x['map']} mAP50={x['map50']} latency={x['latency_ms']} ({x['latency_device']})")
    return 0


def cmd_simple(a) -> int:
    from modellab import store

    if a.cmd == "cancel":
        print(store.request_cancel(a.run_id))
    elif a.cmd == "requeue":
        store.requeue(a.run_id)
        print("queued (finished stages are kept)")
    elif a.cmd == "delete":
        store.delete_run(a.run_id)
        print("deleted")
    return 0


def cmd_validate(a) -> int:
    from modellab import engine

    res = engine.preview(Path(a.recipe).read_text())
    print(json.dumps(res, indent=2))
    return 0 if res["ok"] else 2


def cmd_templates(a) -> int:
    from modellab import recipe

    for t in recipe.templates():
        print(f"{t['id']:<32} {t['description'].strip().splitlines()[0] if t['description'] else ''}")
    return 0


def cmd_worker(a) -> int:
    from modellab import worker

    return worker.Worker().loop(once=a.once)


def cmd_weights(a) -> int:
    from modellab import catalog, weights

    if a.action == "list":
        for k in catalog.all_weight_keys():
            s = weights.status(k, check=a.check)
            v = {True: "verified", False: "HASH MISMATCH", None: "present" if s["present"] else "missing"}[s["verified"]]
            print(f"{k:<45} {v:<14} {s['dest']}")
        return 0
    if a.action == "verify":
        bad = 0
        for k in catalog.all_weight_keys():
            s = weights.status(k, check=True)
            if s["present"]:
                print(f"{k:<45} {'ok' if s['verified'] else 'MISMATCH'}")
                bad += not s["verified"]
        return 1 if bad else 0
    for k in weights.expand(a.ids):
        weights.fetch(k)
    return 0


def cmd_dataset(a) -> int:
    from modellab import coco_vehicles, datasets

    if a.action == "list":
        for d in datasets.list_all():
            state = "error: " + d["error"] if "error" in d else ("ready" if d.get("built") else "not built")
            print(f"{d['name']:<20} {state:<10} {d.get('path', '')}")
    elif a.action == "info":
        print(json.dumps(datasets.info(a.name), indent=2))
    elif a.action == "add":
        print(json.dumps(datasets.add(a.name, Path(a.path), a.description or ""), indent=2))
    elif a.action == "import":
        print(json.dumps(datasets.import_coco(a.name, Path(a.coco_json), Path(a.images_dir) if a.images_dir else None), indent=2))
    elif a.action == "build-coco-vehicles":
        coco_vehicles.build(Path(a.coco_root) if a.coco_root else None, a.download, Path(a.out) if a.out else None,
                            a.max_train, a.max_valid, a.max_test, a.seed, a.copy)
    return 0


def main(argv=None) -> int:
    p = argparse.ArgumentParser(prog="modellab", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("run", help="queue a recipe (and run it if no worker is up)")
    r.add_argument("recipe")
    r.add_argument("--detach", action="store_true", help="start a background worker instead of running in the foreground")
    r.add_argument("--tag", action="append")
    r.set_defaults(fn=cmd_run)
    sub.add_parser("queue").set_defaults(fn=cmd_queue)
    l_ = sub.add_parser("list")
    l_.add_argument("--status")
    l_.add_argument("--results", action="store_true", help="leaderboard rows (one per eval stage)")
    l_.set_defaults(fn=cmd_list)
    s = sub.add_parser("show")
    s.add_argument("run_id")
    s.set_defaults(fn=cmd_show)
    for c in ("cancel", "requeue", "delete"):
        x = sub.add_parser(c)
        x.add_argument("run_id")
        x.set_defaults(fn=cmd_simple)
    v = sub.add_parser("validate")
    v.add_argument("recipe")
    v.set_defaults(fn=cmd_validate)
    sub.add_parser("templates").set_defaults(fn=cmd_templates)
    w = sub.add_parser("worker")
    w.add_argument("--once", action="store_true")
    w.set_defaults(fn=cmd_worker)
    wt = sub.add_parser("weights")
    wt.add_argument("action", choices=["list", "fetch", "verify"])
    wt.add_argument("ids", nargs="*", help="model / teacher ids or weight keys (fetch)")
    wt.add_argument("--check", action="store_true", help="list: hash files not verified yet")
    wt.set_defaults(fn=cmd_weights)
    d = sub.add_parser("dataset")
    d.add_argument("action", choices=["list", "info", "add", "import", "build-coco-vehicles"])
    d.add_argument("name", nargs="?")
    d.add_argument("path", nargs="?")
    d.add_argument("--description")
    d.add_argument("--coco-json")
    d.add_argument("--images-dir")
    d.add_argument("--coco-root")
    d.add_argument("--download", action="store_true")
    d.add_argument("--out")
    d.add_argument("--max-train", type=int, default=6000)
    d.add_argument("--max-valid", type=int, default=800)
    d.add_argument("--max-test", type=int, default=1500)
    d.add_argument("--seed", type=int, default=0)
    d.add_argument("--copy", action="store_true")
    d.set_defaults(fn=cmd_dataset)
    a = p.parse_args(argv)
    return a.fn(a)
