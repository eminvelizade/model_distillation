"""Worker / queue integration tests on CPU (real subprocesses, real training on the tiny dataset; a few minutes).

- cancel kills the running job's whole process group and marks it cancelled
- a worker that dies while a run is in progress: the run keeps going, a new worker adopts it
- a run whose runner died while no worker was alive: marked interrupted; re-queue resumes at the first unfinished stage
"""

import os
import signal
import subprocess
import sys
import time

from conftest import ROOT

# stage 1 finishes fast; stage 2 is long enough to be interrupted / cancelled
SLOW = """
name: slow
dataset: tiny
seed: 1
stages:
  - {name: quick_eval, type: eval, model: rfdetr/nano, latency: false, max_images: 2}
  - {name: long_ft, type: finetune, model: rfdetr/nano, batch_size: 2, budget: {epochs: 60}}
"""


def start_worker(lab):
    log = open(lab / "worker_test.log", "a")
    return subprocess.Popen([sys.executable, "-m", "modellab", "worker"], cwd=ROOT, stdout=log, stderr=subprocess.STDOUT,
                            env=dict(os.environ), start_new_session=True)


def wait_for(cond, timeout, what):
    t0 = time.time()
    while time.time() - t0 < timeout:
        v = cond()
        if v:
            return v
        time.sleep(1)
    raise AssertionError(f"timed out waiting for {what}")


def stage_status(rid, name):
    from modellab import store

    return {s["name"]: s["status"] for s in store.get_run(rid)["stages"]}[name]


def alive(pid):
    from modellab import store

    return store.pid_alive(pid)


def test_cancel_kills_process_group(lab):
    from modellab import engine, store

    rid, = engine.submit(SLOW)
    w = start_worker(lab)
    try:
        wait_for(lambda: stage_status(rid, "long_ft") == "running", 240, "long_ft to start")
        time.sleep(5)
        runner_pid = store.get_run(rid)["pid"]
        assert alive(runner_pid)
        store.request_cancel(rid)
        wait_for(lambda: store.get_run(rid)["status"] == "cancelled", 60, "cancelled")
        assert stage_status(rid, "long_ft") == "cancelled" and stage_status(rid, "quick_eval") == "done"
        wait_for(lambda: not alive(runner_pid), 20, "runner gone")
        out = subprocess.run(["pgrep", "-f", f"modellab.stages {rid}"], capture_output=True, text=True).stdout
        assert not out.strip(), f"stage process survived cancel: {out}"
    finally:
        w.terminate()
        w.wait(30)


def test_worker_crash_adopt_then_interrupt_and_resume(lab):
    from modellab import engine, store

    rid, = engine.submit(SLOW)
    w = start_worker(lab)
    wait_for(lambda: stage_status(rid, "long_ft") == "running", 240, "long_ft to start")
    runner_pid = store.get_run(rid)["pid"]

    # 1) the worker dies hard: the run must keep going (own session) and a new worker adopts it
    os.kill(w.pid, signal.SIGKILL)
    w.wait()
    time.sleep(3)
    assert alive(runner_pid) and store.get_run(rid)["status"] == "running"
    w2 = start_worker(lab)
    wait_for(lambda: "adopting still-running run" in (lab / "worker_test.log").read_text(), 30, "adoption")
    assert store.get_run(rid)["status"] == "running"

    # 2) worker gone AND the runner dies (machine/app crash): next worker marks the run interrupted
    os.kill(w2.pid, signal.SIGKILL)
    w2.wait()
    os.killpg(runner_pid, signal.SIGKILL)
    wait_for(lambda: not alive(runner_pid), 20, "runner killed")
    w3 = start_worker(lab)
    try:
        wait_for(lambda: store.get_run(rid)["status"] == "interrupted", 30, "interrupted")
        r = store.get_run(rid)
        assert "Re-queue to resume" in r["error_tail"] and stage_status(rid, "long_ft") == "interrupted"

        # 3) re-queue: the finished stage is skipped, the unfinished one runs again
        store.requeue(rid)
        wait_for(lambda: stage_status(rid, "long_ft") == "running", 120, "resumed long_ft")
        log = (store.run_dir(rid) / "runner.log").read_text()
        assert "stage quick_eval: already done, skipping" in log
        store.request_cancel(rid)
        wait_for(lambda: store.get_run(rid)["status"] == "cancelled", 60, "cancelled")
    finally:
        w3.terminate()
        w3.wait(30)


def test_second_worker_refuses_to_start(lab):
    w = start_worker(lab)
    try:
        time.sleep(3)
        r = subprocess.run([sys.executable, "-m", "modellab", "worker", "--once"], cwd=ROOT, capture_output=True, text=True,
                           env=dict(os.environ), timeout=60)
        assert r.returncode == 1 and "another worker is already running" in r.stdout
    finally:
        w.terminate()
        w.wait(30)
