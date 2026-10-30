"""The agent's main loop (`modellab-agent run`, started by the systemd user service).

Every second: drive the local worker (runs start, finish, get cancelled exactly as with `python app.py`), heartbeat
(2 s while busy, else 5 s), mirror active runs to the hub, and when idle claim the next queued run or install an
update. Commands, run preparation, self-checks and updates run in the jobs thread so the loop never blocks.
If the hub is unreachable, runs keep going locally and are synced when it comes back.

Exit codes (see the unit file): 0 stopped, 1 another agent uses this folder, 75 restart into a new release,
78 machine removed in the web app (systemd does not restart on 78).
"""

from __future__ import annotations

import json
import platform
import signal
import subprocess
import time
from collections import defaultdict

from modellab import store
from modellab.agent import AGENT_VERSION, SERVICE, home, log, release_info, telemetry, update
from modellab.agent.client import HubClient, HubError, Revoked
from modellab.agent.jobs import RUN_ID_RE, Jobs
from modellab.agent.sync import RunSync
from modellab.worker import Worker

REPORT_EVERY = 600
EXIT_RESTART, EXIT_REVOKED = 75, 78


def _load_json(p) -> dict | None:
    try:
        return json.loads(p.read_text())
    except (OSError, ValueError):
        return None


class Agent:
    def __init__(self, cfg: dict):
        self.cfg = cfg
        self.client = HubClient(cfg["hub_url"], cfg["token"])
        self.worker = Worker()
        self.jobs = Jobs(self)
        self.syncs: dict[str, RunSync] = {}
        self.cancels: set[str] = set()
        self.preparing: str | None = None
        self.last_probe: dict | None = None
        self.update_target: str | None = None
        self.update_now = False
        self.update_status: dict | None = _load_json(home() / "update.json")  # survives the restart into a release
        self.update_failed: dict[str, float] = {}
        self.revoked = self.restart = self.stop = False
        self.timers: dict[str, float] = defaultdict(float)
        self.hub_down_since: float | None = None

    # ------------------------------------------------------------ state

    def training(self) -> bool:
        return self.worker.current is not None

    def idle(self) -> bool:
        return not self.training() and self.preparing is None and not self.jobs.pending() and not store.queue()

    def state(self) -> str:
        busy = self.jobs.busy or ""
        if busy.startswith("update"):
            return "updating"
        if self.training():
            return "running"
        if self.preparing:
            return "preparing"
        return "command" if busy.startswith("command") else "idle"

    def track(self, rid: str) -> None:
        """Mirror this run to the hub from now on. A re-queued run starts with a clean slate (everything is sent
        again), keeping only the log offsets and the uploaded-files list."""
        s = self.syncs.get(rid) or RunSync(self.client, rid)
        s.state.update(complete=False, sent={})
        s._save()  # from now on discover() finds it, even if the agent stops before the first push
        self.syncs[rid] = s

    def discover(self) -> None:
        """Local runs whose final state never reached the hub (agent stopped or hub down)."""
        for r in store.list_runs():
            s = RunSync(self.client, r["id"])
            if s.state_file.is_file() and not s.complete:
                self.syncs[r["id"]] = s

    def cancel(self, rid: str) -> None:
        self.cancels.add(rid)
        local = store.get_run(rid)
        if local and local["status"] in ("running", "queued"):
            log.info(f"cancelling run {rid}")
            store.request_cancel(rid)  # the worker kills the run's process group

    # ------------------------------------------------------------ hub calls

    def heartbeat(self) -> None:
        rel = release_info()
        body = {"state": self.state(), "current_run": self.worker.current or self.preparing, "live": telemetry.live(),
                "agent_version": AGENT_VERSION, "release": rel.get("version"), "hostname": platform.node(),
                "update_status": self.update_status}
        r = self.client.post("/agent/v1/heartbeat", body)
        for cmd in r.get("commands", []):
            self.jobs.submit("command", cmd)
        for rid in r.get("cancel", []):
            self.cancel(rid)
        self.reconcile(r.get("running", []))
        self.update_target = (r.get("update") or {}).get("version")

    def reconcile(self, hub_running: list[str]) -> None:
        """Runs the hub believes are running here but nothing here is working on: send their real state."""
        for rid in hub_running:
            if rid in self.syncs or rid in (self.preparing, self.worker.current) or not RUN_ID_RE.match(rid):
                continue
            if store.get_run(rid) is not None:
                log.info(f"run {rid}: the hub still shows it running, re-sending its state")
                self.track(rid)
            else:
                log.warning(f"run {rid}: the hub shows it running here but this machine has no record of it")
                self.client.post(f"/agent/v1/runs/{rid}/events", {"run": {
                    "status": "interrupted", "finished": time.time(), "status_message": None,
                    "error_tail": "this machine has no record of the run (the agent restarted while taking it); re-queue it"}})

    def sync_all(self) -> None:
        for rid, s in list(self.syncs.items()):
            try:
                reply = s.push()
            except Revoked:
                raise
            except HubError as e:
                if e.status == 404:  # deleted in the web app
                    log.info(f"run {rid} was deleted on the hub")
                    self.cancel(rid)
                    s.state["complete"] = True
                    s._save()
                    del self.syncs[rid]
                    continue
                raise
            if reply and reply.get("cancel_requested"):
                self.cancel(rid)
            if s.complete:
                log.info(f"run {rid} fully synced ({store.get_run(rid)['status'] if store.get_run(rid) else 'gone'})")
                del self.syncs[rid]

    def claim(self) -> None:
        run = self.client.post("/agent/v1/claim").get("run")
        if run:
            log.info(f"claimed run {run['id']} ({run['name']})")
            self.preparing = run["id"]
            self.cancels.discard(run["id"])
            self.jobs.submit("prepare", run)

    def can_update(self, version: str) -> bool:
        if not release_info() or not self.cfg.get("release_pubkey"):
            return False  # running from a git checkout (development): never self-update
        failed = self.update_failed.get(version)
        return self.update_now or failed is None or time.time() - failed > 3600

    def _set_update_status(self, st: dict) -> None:
        self.update_status = st
        (home() / "update.json").write_text(json.dumps(st))

    def do_update(self, client: HubClient, version: str) -> None:
        """Jobs thread. On success the main loop exits with 75 and systemd starts the new release."""
        self.update_now = False
        self._set_update_status({"version": version, "state": "installing", "time": time.time()})
        log.info(f"updating to release {version}")
        try:
            update.install(client, self.cfg, version, log=log.info)
            self._set_update_status({"version": version, "ok": True, "time": time.time()})
            self.restart = True
        except Exception as e:  # noqa: BLE001
            log.error(f"update to {version} failed: {e}")
            self.update_failed[version] = time.time()
            self._set_update_status({"version": version, "ok": False, "error": str(e)[-2000:], "time": time.time()})

    # ------------------------------------------------------------ loop

    def _guard(self, name: str, fn) -> None:
        try:
            fn()
            if self.hub_down_since:
                log.info(f"hub reachable again after {time.time() - self.hub_down_since:.0f}s")
                self.hub_down_since = None
        except Revoked:
            self.revoked = True
        except HubError as e:
            if e.status is None:
                if self.hub_down_since is None:
                    self.hub_down_since = time.time()
                    log.warning(f"hub unreachable ({e.detail}); runs continue here and sync when it is back")
            else:
                log.warning(f"{name}: {e}")

    def step(self) -> None:
        self.worker.tick()
        now = time.time()
        backoff = 15 if self.hub_down_since else 0
        if now - self.timers["hb"] >= max(2 if (self.training() or self.preparing) else 5, backoff):
            self.timers["hb"] = now
            self._guard("heartbeat", self.heartbeat)
        if self.syncs and now - self.timers["sync"] >= max(2, backoff):
            self.timers["sync"] = now
            self._guard("sync", self.sync_all)
        if self.hub_down_since is None and self.idle() and now - self.timers["claim"] >= 3:
            self.timers["claim"] = now
            if self.update_target and self.can_update(self.update_target):
                self.jobs.submit("update", self.update_target)
            else:
                self._guard("claim", self.claim)
        if now - self.timers["report"] >= REPORT_EVERY:
            self.timers["report"] = now
            self.jobs.submit("report")

    def run(self) -> int:
        if not self.worker.start():
            log.error("another agent or worker is using this runs folder")
            return 1
        for sig in (signal.SIGTERM, signal.SIGINT):
            signal.signal(sig, lambda *_: setattr(self, "stop", True))
        log.info(f"agent {AGENT_VERSION} (release {release_info().get('version', 'dev')}) for {self.cfg['hub_url']}, "
                 f"machine {self.cfg.get('name')} ({self.cfg.get('machine_id')})")
        self.discover()
        self.jobs.start()
        self.jobs.submit("report")
        self.timers["report"] = time.time()
        while not (self.stop or self.revoked or self.restart):
            self.step()
            time.sleep(1)
        if self.revoked:
            return self.on_revoked()
        if self.restart:
            log.info("restarting into the new release")
            return EXIT_RESTART
        log.info("agent stopping" + (" (the current run continues on its own)" if self.training() else ""))
        return 0

    def on_revoked(self) -> int:
        log.warning("this machine was removed in the web app: cancelling local work and stopping the service")
        for r in store.queue():
            store.request_cancel(r["id"])
        for _ in range(20):  # let the worker stop the run's process group
            self.worker.tick()
            if not self.training():
                break
            time.sleep(1)
        try:
            subprocess.run(["systemctl", "--user", "disable", SERVICE], capture_output=True, timeout=20)
        except (OSError, subprocess.SubprocessError):
            pass
        return EXIT_REVOKED
