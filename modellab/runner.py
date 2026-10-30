"""Runs one run: stage by stage, each in its own subprocess. `python -m modellab.runner <run_id>`.

Started by the worker in a new session (own process group), so cancel = kill the group, and the run keeps going
if the worker or the web app restarts. Stages that already finished (result.json present, status done) are
skipped, which makes a re-queued interrupted run resume at its first unfinished stage.
"""

import offline_guard  # noqa: F401  (must be first)

import json
import os
import subprocess
import sys
import time

from modellab import ROOT, datasets, envinfo, store


def log(msg: str) -> None:
    print(f"[runner {time.strftime('%H:%M:%S')}] {msg}", flush=True)


def stage_env() -> dict:
    env = dict(os.environ)
    env["PYTHONPATH"] = str(ROOT) + (os.pathsep + env["PYTHONPATH"] if env.get("PYTHONPATH") else "")
    env.setdefault("PYTHONUNBUFFERED", "1")
    return env


def main(run_id: str) -> int:
    rd = store.run_dir(run_id)
    resolved = json.loads((rd / "resolved.json").read_text())
    store.update_run(run_id, pid=os.getpid(), status="running")
    env = envinfo.capture(resolved.get("seed"))
    (rd / "env.json").write_text(json.dumps(env, indent=2))
    with open(rd / "env_history.jsonl", "a") as f:
        f.write(json.dumps({"time": time.time(), **env}) + "\n")

    # Dataset fingerprints at run time (the eval stage hashes its own split again for the result row).
    ds_info = {}
    for name in sorted({s["dataset"] for s in resolved["stages"]}):
        try:
            ds_info[name] = datasets.info(name)
        except Exception as e:  # noqa: BLE001
            store.update_run(run_id, status="failed", finished=time.time(), error_tail=f"dataset {name}: {e}")
            log(f"dataset {name}: {e}")
            return 1
    (rd / "datasets.json").write_text(json.dumps(ds_info, indent=2))

    db_stages = {s["name"]: s for s in store.get_run(run_id)["stages"]}
    metrics = {}
    for st in resolved["stages"]:
        name, sd = st["name"], store.stage_dir(run_id, st["name"])
        if db_stages[name]["status"] == "done" and (sd / "result.json").is_file():
            log(f"stage {name}: already done, skipping")
            metrics[name] = json.loads((sd / "result.json").read_text()).get("metrics")
            continue
        sd.mkdir(parents=True, exist_ok=True)
        (sd / "result.json").unlink(missing_ok=True)
        (sd / "progress.json").unlink(missing_ok=True)
        store.update_stage(run_id, name, status="running", started=time.time(), finished=None, error=None)
        store.update_run(run_id, current_stage=name)
        log(f"stage {name} ({st['type']}) starting")
        with open(sd / "log.txt", "a") as lf:
            lf.write(f"\n===== {time.strftime('%Y-%m-%d %H:%M:%S')} stage {name} ({st['type']}) =====\n")
            lf.flush()
            rc = subprocess.call([sys.executable, "-m", "modellab.stages", run_id, name], cwd=ROOT, env=stage_env(),
                                 stdout=lf, stderr=subprocess.STDOUT)
        if rc != 0 or not (sd / "result.json").is_file():
            err = store.tail(sd / "log.txt", 40)
            store.update_stage(run_id, name, status="failed", finished=time.time(), error=err[-4000:])
            store.update_run(run_id, status="failed", finished=time.time(), current_stage=name,
                             error_tail=f"stage {name} failed (exit code {rc})\n{err}")
            log(f"stage {name} FAILED (exit {rc})")
            return 1
        res = json.loads((sd / "result.json").read_text())
        metrics[name] = res.get("metrics")
        if st["type"] == "eval":
            store.save_result(run_id, name, res["metrics"])
        store.update_stage(run_id, name, status="done", finished=time.time())
        log(f"stage {name} done")
    (rd / "metrics.json").write_text(json.dumps(metrics, indent=2, default=str))
    store.update_run(run_id, status="done", finished=time.time(), current_stage=None)
    log("run done")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
