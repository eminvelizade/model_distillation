"""Single-GPU queue worker: one run at a time, independent of the browser / web app.

    modellab worker            # forever (python app.py starts one in the background if none is running)
    modellab worker --once     # until the queue is empty (used by `modellab run` when no worker is running)

- Exactly one worker per runs/ directory (flock on runs/worker.lock).
- Each run is executed by `python -m modellab.runner <id>` in a NEW SESSION: it survives a worker/app restart.
- On start the worker recovers: a run marked 'running' whose runner is still alive is adopted (watched until it
  ends); otherwise it is marked 'interrupted' (re-queue resumes at its first unfinished stage).
- Cancel: the API/CLI sets cancel_requested; the worker kills the runner's process group (SIGTERM, then SIGKILL).
"""

from __future__ import annotations

import fcntl
import json
import os
import signal
import subprocess
import sys
import time

from modellab import ROOT, runs_dir, store

POLL_S = float(os.environ.get("MODELLAB_POLL_S", "2"))
KILL_GRACE_S = 15


def lock_path():
    return runs_dir() / "worker.lock"


def info() -> dict:
    """Worker status for the UI: alive?, pid, heartbeat."""
    f = runs_dir() / "worker.json"
    try:
        d = json.loads(f.read_text())
    except (OSError, ValueError):
        return {"alive": False}
    d["alive"] = store.pid_alive(d.get("pid"), "modellab") and time.time() - d.get("heartbeat", 0) < 60
    return d


def is_running() -> bool:
    runs_dir().mkdir(parents=True, exist_ok=True)
    with open(lock_path(), "a+") as f:
        try:
            fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return True
        fcntl.flock(f, fcntl.LOCK_UN)
        return False


def start_background() -> int | None:
    """Start a detached worker if none is running. Returns its pid (None if one was already running)."""
    if os.environ.get("MODELLAB_NO_AUTOSTART") or is_running():  # tests drive the worker themselves
        return None
    env = dict(os.environ, PYTHONPATH=str(ROOT))
    log = open(runs_dir() / "worker.log", "a")
    p = subprocess.Popen([sys.executable, "-m", "modellab", "worker"], cwd=ROOT, env=env, stdout=log,
                         stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL, start_new_session=True)
    return p.pid


def _log(msg: str) -> None:
    print(f"[worker {time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}", flush=True)


class Worker:
    def __init__(self):
        self.lock_file = None
        self.proc: subprocess.Popen | None = None
        self.current: str | None = None
        self.current_pid: int | None = None
        self.kill_sent_at: float | None = None
        self.stop = False

    def acquire(self) -> bool:
        runs_dir().mkdir(parents=True, exist_ok=True)
        self.lock_file = open(lock_path(), "a+")
        try:
            fcntl.flock(self.lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return False
        return True

    def heartbeat(self) -> None:
        f = runs_dir() / "worker.json"
        tmp = f.with_suffix(".tmp")
        tmp.write_text(json.dumps({"pid": os.getpid(), "heartbeat": time.time(), "current": self.current}))
        os.replace(tmp, f)

    def recover(self) -> None:
        for r in store.list_runs(status="running"):
            if store.pid_alive(r["pid"], f"modellab.runner {r['id']}"):
                _log(f"adopting still-running run {r['id']} (pid {r['pid']})")
                self.current, self.current_pid, self.proc = r["id"], r["pid"], None
                return  # only one can be running
            _log(f"run {r['id']} was running but its runner is gone -> interrupted")
            self._mark_interrupted(r["id"], "worker/app restarted and the runner process is gone")

    def _mark_interrupted(self, run_id: str, why: str) -> None:
        for s in store.get_run(run_id)["stages"]:
            if s["status"] == "running":
                store.update_stage(run_id, s["name"], status="interrupted", finished=time.time())
        store.update_run(run_id, status="interrupted", finished=time.time(), pid=None,
                         error_tail=f"{why}. Re-queue to resume at the first unfinished stage.\n"
                                    + store.tail(store.run_dir(run_id) / "runner.log", 15))

    def _spawn(self, run: dict) -> None:
        rd = store.run_dir(run["id"])
        env = dict(os.environ, PYTHONPATH=str(ROOT), PYTHONUNBUFFERED="1")
        if env.get("MODELLAB_GUARD_CHILDREN") == "1":  # the agent talks to the hub; its training processes must not
            env.pop("ALLOW_NETWORK", None)
        out = open(rd / "runner.log", "a")
        self.proc = subprocess.Popen([sys.executable, "-m", "modellab.runner", run["id"]], cwd=ROOT, env=env, stdout=out,
                                     stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL, start_new_session=True)
        self.current, self.current_pid, self.kill_sent_at = run["id"], self.proc.pid, None
        store.update_run(run["id"], pid=self.proc.pid)
        _log(f"started run {run['id']} (pid {self.proc.pid})")

    def _alive(self) -> bool:
        if self.proc is not None:
            return self.proc.poll() is None
        return store.pid_alive(self.current_pid, f"modellab.runner {self.current}")

    def _check_current(self) -> None:
        rid = self.current
        r = store.get_run(rid)
        if self._alive():
            if r and r["cancel_requested"]:
                sig = signal.SIGTERM
                if self.kill_sent_at is None:
                    self.kill_sent_at = time.time()
                    _log(f"cancelling {rid}")
                elif time.time() - self.kill_sent_at > KILL_GRACE_S:
                    sig = signal.SIGKILL
                try:
                    os.killpg(self.current_pid, sig)
                except ProcessLookupError:
                    pass
            return
        # runner exited
        rc = self.proc.returncode if self.proc is not None else None
        self.proc, self.current, self.current_pid = None, None, None
        r = store.get_run(rid)
        if r["cancel_requested"]:
            for s in r["stages"]:
                if s["status"] == "running":
                    store.update_stage(rid, s["name"], status="cancelled", finished=time.time())
            store.update_run(rid, status="cancelled", finished=time.time(), pid=None, cancel_requested=0)
            _log(f"run {rid} cancelled")
        elif r["status"] == "running":  # died without setting a final state (OOM kill, crash, ...)
            for s in r["stages"]:
                if s["status"] == "running":
                    store.update_stage(rid, s["name"], status="failed", finished=time.time())
            stage_log = store.run_dir(rid) / "stages" / (r["current_stage"] or "") / "log.txt"
            store.update_run(rid, status="failed", finished=time.time(), pid=None,
                             error_tail=f"runner exited with code {rc} without finishing\n"
                                        + (store.tail(stage_log, 30) if stage_log.is_file() else "")
                                        + "\n" + store.tail(store.run_dir(rid) / "runner.log", 10))
            _log(f"run {rid} died (exit {rc})")
        else:
            _log(f"run {rid} finished: {r['status']}")

    def start(self) -> bool:
        """Take the runs/ lock and recover a run left behind by a previous worker. False if another worker runs."""
        if not self.acquire():
            _log("another worker is already running")
            return False
        _log(f"worker up (pid {os.getpid()}, runs in {runs_dir()})")
        self.recover()
        return True

    def tick(self) -> bool:
        """One round: watch the current run, or start the next queued one. Returns False when there was nothing to do."""
        self.heartbeat()
        if self.current:
            self._check_current()
        if not self.current:
            nxt = store.claim_next()
            if not nxt:
                return False
            self._spawn(nxt)
        return True

    def loop(self, once: bool = False) -> int:
        if not self.start():
            return 1
        signal.signal(signal.SIGTERM, lambda *_: setattr(self, "stop", True))
        while not self.stop:
            if not self.tick() and once:
                break
            time.sleep(POLL_S)
        _log("worker exiting" + (" (a run is still in progress and continues on its own)" if self.current else ""))
        return 0
