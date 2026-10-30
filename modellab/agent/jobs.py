"""Work the agent does in its background thread, one item at a time: commands from the web app, preparing a claimed
run (re-validate the recipe with this machine's code, download missing weights), self-checks and updates.

Commands are a fixed list; arguments are re-checked here. Nothing from the hub is ever run as a shell command.
"""

from __future__ import annotations

import queue
import re
import threading
import time
import traceback
from pathlib import Path

from modellab import catalog, datasets, recipe, store, weights
from modellab.agent import doctor, log
from modellab.agent.client import HubClient, HubError, Revoked

RUN_ID_RE = re.compile(r"^[0-9]{8}-[0-9]{6}-[a-z0-9-]{1,40}-[0-9a-f]{4,6}$")
DATASET_RE = re.compile(r"^[a-z0-9][a-z0-9_.-]{0,63}$")


class Cancelled(Exception):
    pass


def _model_ids(stages: list[dict]) -> list[str]:
    ids = [s.get("student") or s.get("model_id") or (s.get("model") if isinstance(s.get("model"), str) else None) for s in stages]
    ids += [s["teacher"] for s in stages if isinstance(s.get("teacher"), str)]
    ids += [x for s in stages for x in (s.get("models") or []) if isinstance(x, str)]
    return [i for i in ids if i]


def _path(args: dict, key: str, required: bool = True) -> Path | None:
    v = args.get(key)
    if not v:
        if required:
            raise ValueError(f"{key} is required")
        return None
    if not isinstance(v, str) or not v.startswith(("/", "~")) or "\x00" in v:
        raise ValueError(f"{key} must be an absolute path")
    p = Path(v).expanduser()
    if not p.is_absolute():
        raise ValueError(f"{key} must be an absolute path")
    return p


def _name(args: dict) -> str:
    n = args.get("name")
    if not isinstance(n, str) or not DATASET_RE.match(n):
        raise ValueError("bad dataset name")
    return n


def _ds_summary(info: dict) -> dict:
    return {k: info.get(k) for k in ("name", "path", "train", "valid", "test", "classes", "hash")}


class Jobs(threading.Thread):
    def __init__(self, agent):
        super().__init__(name="modellab-jobs", daemon=True)
        self.agent = agent
        self.client = HubClient(agent.cfg["hub_url"], agent.cfg["token"])
        self.q: queue.Queue = queue.Queue()
        self.busy: str | None = None  # what is running now ("command dataset_add", "prepare <run>", ...)

    def submit(self, kind: str, payload=None) -> None:
        self.q.put((kind, payload))

    def pending(self) -> bool:
        return self.busy is not None or not self.q.empty()

    def run(self) -> None:
        while True:
            kind, payload = self.q.get()
            self.busy = f"{kind} {payload.get('type', payload.get('id', '')) if isinstance(payload, dict) else ''}".strip()
            try:
                if kind == "command":
                    self.command(payload)
                elif kind == "prepare":
                    self.prepare(payload)
                elif kind == "report":
                    self.report(probe=payload is not False)
                elif kind == "update":
                    self.agent.do_update(self.client, payload)
            except Revoked:
                self.agent.revoked = True
            except Exception:  # noqa: BLE001  (never let the thread die)
                log.exception(f"job {kind} failed")
            finally:
                self.busy = None

    # ------------------------------------------------------------ self-check

    def report(self, probe: bool = True) -> dict:
        probe = probe and not self.agent.training()  # no CUDA probe while a run trains: reuse the last one
        rep = doctor.report(with_probe=probe, last_probe=self.agent.last_probe, skip_gpu=self.agent.cfg.get("cpu_only", False))
        if probe:
            self.agent.last_probe = rep["probe"]
        self.client.post("/agent/v1/report", rep)
        return rep

    # ------------------------------------------------------------ commands

    def _cmd_status(self, cid: str, status: str, **kw) -> None:
        try:
            self.client.post(f"/agent/v1/commands/{cid}", {"status": status, **kw})
        except HubError as e:
            if isinstance(e, Revoked):
                raise
            log.warning(f"could not report command {cid}: {e}")

    def command(self, cmd: dict) -> None:
        cid, ctype, args = cmd["id"], cmd["type"], cmd.get("args") or {}
        log.info(f"command {ctype} {args}")
        self._cmd_status(cid, "running")
        lines: list[str] = []

        def say(msg: str) -> None:
            lines.append(str(msg))
            log.info(msg)

        try:
            result = self._execute(ctype, args, say)
            self._cmd_status(cid, "done", result=result, log="\n".join(lines[-200:]))
        except Exception as e:  # noqa: BLE001
            log.warning(f"command {ctype} failed: {e}")
            self._cmd_status(cid, "failed", error=f"{e}"[-4000:] or type(e).__name__,
                             log="\n".join(lines[-200:] + traceback.format_exc().splitlines()[-8:]))
        if ctype != "selfcheck":
            try:
                self.report(probe=False)  # datasets / weights changed: refresh the Machines page
            except HubError as e:
                log.warning(f"report after command failed: {e}")

    def _execute(self, ctype: str, a: dict, say) -> dict:
        if ctype == "selfcheck":
            rep = self.report(probe=True)
            return {s: sum(c["status"] == s for c in rep["checks"]) for s in ("ok", "warn", "fail")}
        if ctype == "dataset_add":
            name, path = _name(a), _path(a, "path")
            say(f"checking {path} and hashing every image (can take a while for big datasets) ...")
            info = datasets.add(name, path, str(a.get("description") or ""))
            doctor.remember_hash(name, info)
            return _ds_summary(info)
        if ctype == "dataset_import":
            name = _name(a)
            if a.get("format") == "coco":
                say("converting with make_splits.py (COCO) ...")
                info = datasets.import_coco(name, _path(a, "coco_json"), _path(a, "images_dir", False),
                                            description=str(a.get("description") or ""))
            elif a.get("format") == "yolo":
                say("converting with make_splits.py (YOLO) ...")
                info = datasets.import_yolo(name, _path(a, "yolo_dir"), bool(a.get("keep_splits")),
                                            description=str(a.get("description") or ""))
            else:
                raise ValueError("format must be coco or yolo")
            doctor.remember_hash(name, info)
            return _ds_summary(info)
        if ctype == "dataset_verify":
            name = _name(a)
            before = (doctor.dataset_hashes().get(name) or {}).get("hash")
            say("re-reading every image and annotation ...")
            info = datasets.info(name, with_hash=True, fresh=True)
            doctor.remember_hash(name, info)
            changed = bool(before) and before.get("all") != info["hash"]["all"]
            say("unchanged" if before and not changed else "changed since the last check" if changed else "hashed")
            return {**_ds_summary(info), "changed": changed, "previous": before}
        if ctype == "dataset_remove":
            name = _name(a)
            try:
                datasets.remove(name)
            except KeyError:
                say(f"{name} was not registered (already removed)")
            doctor.forget_hash(name)
            return {"removed": name}
        if ctype == "weights_fetch":
            keys = weights.expand(list(a.get("ids") or []))
            for k in keys:
                say(f"fetching {k} ...")
                weights.fetch(k, log=say)
            return {"fetched": keys}
        if ctype == "weights_verify":
            bad = []
            for k in catalog.all_weight_keys():
                s = weights.status(k, check=True)
                if s["present"] and not s["verified"]:
                    bad.append(k)
            return {"mismatch": bad}
        if ctype == "run_delete_files":
            rid = a.get("run_id")
            if not isinstance(rid, str) or not RUN_ID_RE.match(rid):
                raise ValueError("bad run id")
            r = store.get_run(rid)
            if r and r["status"] in ("running", "queued"):
                raise ValueError("the run is still active on this machine")
            store.delete_run(rid)
            return {"deleted": rid}
        if ctype == "update":
            self.agent.update_now = True
            return {"result": "update check scheduled"}
        raise ValueError(f"unknown command {ctype!r}")

    # ------------------------------------------------------------ runs

    def _events(self, rid: str, run: dict) -> dict:
        return self.client.post(f"/agent/v1/runs/{rid}/events", {"run": run})

    def prepare(self, run: dict) -> None:
        rid = run["id"]
        if not RUN_ID_RE.match(rid):
            raise ValueError(f"bad run id from hub: {rid!r}")
        self.agent.preparing = rid
        try:
            self._prepare(run)
        except Cancelled:
            self._events(rid, {"status": "cancelled", "finished": time.time(), "status_message": None})
        except Exception as e:  # noqa: BLE001
            log.warning(f"run {rid} could not start: {e}")
            self._events(rid, {"status": "failed", "finished": time.time(), "status_message": None,
                               "error_tail": f"could not start on this machine: {e}"[-4000:]})
        finally:
            self.agent.preparing = None

    def _check_cancel(self, rid: str) -> None:
        if rid in self.agent.cancels:
            raise Cancelled()

    def _prepare(self, run: dict) -> None:
        rid = run["id"]
        plans, errors = recipe.plan(run["recipe_yaml"], known_datasets=set(datasets._load()))
        if errors or len(plans) != 1:
            raise ValueError("recipe rejected by this machine: " + ("; ".join(errors) or f"{len(plans)} runs, expected 1"))
        p = plans[0]
        for ds in sorted({s["dataset"] for s in p.stages}):
            try:
                datasets.validate_layout(datasets.path_of(ds))
            except Exception as e:  # noqa: BLE001
                raise ValueError(f"dataset {ds}: {e}") from e
        missing = weights.missing(_model_ids(p.stages))
        for i, k in enumerate(missing):
            self._check_cancel(rid)
            msg = f"downloading weights {k} ({i + 1}/{len(missing)})"
            log.info(f"run {rid}: {msg}")
            self._events(rid, {"status_message": msg})
            weights.fetch(k, log=log.info)
        self._check_cancel(rid)
        existing = store.get_run(rid)
        if existing and existing["status"] in store.FINAL:
            store.requeue(rid)  # finished stages are kept: the run resumes at its first unfinished stage
        elif existing is None:
            resolved = {"name": run["name"], "recipe_name": p.recipe.get("name"), "description": p.recipe.get("description", ""),
                        "dataset": p.recipe.get("dataset"), "seed": p.recipe.get("seed", 42), "matrix": p.matrix_values,
                        "warnings": p.warnings, "stages": p.stages}
            store.create_run(run["name"], p.recipe.get("name", ""), recipe.to_yaml(p.recipe), resolved, None,
                             run.get("tags") or [], rid=rid)
        self._events(rid, {"status_message": None})
        self.agent.track(rid)
        log.info(f"run {rid} handed to the worker")
