"""Mirror a local run to the hub: run and stage status, progress, log lines, eval rows, env/dataset hashes, small
artifacts and the checkpoint list (checkpoints stay on the PC; the hub only learns their path and size).

Only changes are sent. What was sent and the log offsets live in runs/<id>/.hubsync.json, so an agent restart
resumes without duplicating log lines. Log chunks end at a line break (the rest waits for the next push) unless the
run is over.
"""

from __future__ import annotations

import hashlib
import json
import mimetypes
import os
import time
from pathlib import Path

from modellab import store
from modellab.agent.client import HubClient, HubError

UPLOAD_SUFFIXES = {".png", ".jpg", ".jpeg", ".json", ".txt", ".yaml", ".csv"}
CHECKPOINT_SUFFIXES = {".pth", ".pt", ".ckpt", ".safetensors"}
SKIP_NAMES = {"log.txt", "progress.json", "progress.tmp"}
UPLOAD_CAP = 10 * 2**20
LOG_CHUNK = 256 * 1024
MAX_ARTIFACTS = 200
FINAL = store.FINAL


def _sig(p: Path) -> str | None:
    try:
        st = p.stat()
    except OSError:
        return None
    return f"{st.st_size}:{st.st_mtime_ns}"


def _json(p: Path):
    try:
        return json.loads(p.read_text())
    except (OSError, ValueError):
        return None


def _digest(v) -> str:
    return hashlib.sha1(json.dumps(v, sort_keys=True, default=str).encode()).hexdigest()


def artifacts(run_id: str, stage: str) -> list[dict]:
    """Files of a stage the UI lists: small viewable files (uploaded) and checkpoints (path + size only)."""
    sd = store.stage_dir(run_id, stage)
    rd = store.run_dir(run_id)
    if not sd.is_dir():
        return []
    out = []
    for p in sorted(sd.rglob("*")):
        rel = p.relative_to(sd)
        if not p.is_file() or rel.parts[0] == "lightly" or p.name in SKIP_NAMES or p.name.startswith("."):
            continue
        suf = p.suffix.lower()
        if suf in CHECKPOINT_SUFFIXES:
            kind = "checkpoint"
        elif suf in UPLOAD_SUFFIXES:
            kind = "file"
        else:
            continue
        st = p.stat()
        out.append({"path": str(p.relative_to(rd)), "size": st.st_size, "kind": kind, "mtime": st.st_mtime,
                    "local_path": str(p.resolve())})
        if len(out) >= MAX_ARTIFACTS:
            break
    return out


class RunSync:
    def __init__(self, client: HubClient, run_id: str):
        self.client, self.rid = client, run_id
        self.dir = store.run_dir(run_id)
        self.state_file = self.dir / ".hubsync.json"
        self.state = _json(self.state_file) or {"sent": {}, "offsets": {}, "uploaded": {}, "complete": False}
        self.message: str | None = None  # agent-side status line (e.g. "downloading weights")

    @property
    def complete(self) -> bool:
        return bool(self.state.get("complete"))

    def _save(self) -> None:
        tmp = self.state_file.with_suffix(".tmp")
        tmp.write_text(json.dumps(self.state))
        os.replace(tmp, self.state_file)

    def _streams(self, run: dict) -> dict[str, Path]:
        out = {"runner": self.dir / "runner.log"}
        for s in run["stages"]:
            out[s["name"]] = store.stage_dir(self.rid, s["name"]) / "log.txt"
        return out

    def collect(self, run: dict) -> tuple[dict, dict, dict, bool]:
        """-> (payload, sent updates, new log offsets, all logs sent to EOF)."""
        sent, upd = self.state["sent"], {}
        final = run["status"] in FINAL
        rv = {k: run.get(k) for k in ("status", "current_stage", "started", "finished", "error_tail")}
        rv["status_message"] = self.message
        if rv["status"] == "queued":  # handed to the local worker but not started yet: the hub already says running
            rv.pop("status")
        run_out = {k: v for k, v in rv.items() if sent.get(f"run.{k}", "\0") != v}
        upd.update({f"run.{k}": v for k, v in run_out.items()})
        for key, fname in (("env", "env.json"), ("datasets_info", "datasets.json"), ("metrics", "metrics.json")):
            p = self.dir / fname
            sig = _sig(p)
            if sig and sent.get(f"file.{key}") != sig:
                val = _json(p)
                if val is not None:
                    run_out[key] = val
                    upd[f"file.{key}"] = sig
        stages = []
        for s in run["stages"]:
            name, sd = s["name"], store.stage_dir(self.rid, s["name"])
            e = {k: s[k] for k in ("status", "started", "finished", "error") if sent.get(f"stage.{name}.{k}", "\0") != s[k]}
            upd.update({f"stage.{name}.{k}": v for k, v in e.items()})
            for key, fname in (("progress", "progress.json"), ("result", "result.json")):
                sig = _sig(sd / fname)
                if sig and sent.get(f"stage.{name}.{key}") != sig:
                    val = _json(sd / fname)
                    if val is not None:
                        e[key] = val
                        upd[f"stage.{name}.{key}"] = sig
            arts = artifacts(self.rid, name)
            dg = _digest([(a["path"], a["size"]) for a in arts])
            if sent.get(f"stage.{name}.artifacts") != dg:
                e["artifacts"] = [{k: a[k] for k in ("path", "size", "kind", "local_path")} for a in arts]
                upd[f"stage.{name}.artifacts"] = dg
            if e:
                stages.append({"name": name, **e})
        results = []
        for r in run["results"]:
            dg = _digest(r["metrics"])
            if sent.get(f"result.{r['stage']}") != dg:
                results.append({"stage": r["stage"], "row": r["metrics"]})
                upd[f"result.{r['stage']}"] = dg
        logs, offsets, eof = [], {}, True
        for stream, path in self._streams(run).items():
            off = int(self.state["offsets"].get(stream, 0))
            try:
                size = path.stat().st_size
            except OSError:
                continue
            if size < off:  # file was rewritten (re-queued stage): start over
                off = 0
            if size == off:
                continue
            with open(path, "rb") as f:
                f.seek(off)
                data = f.read(LOG_CHUNK)
            if not final:
                cut = max(data.rfind(b"\n"), data.rfind(b"\r"))
                if cut >= 0:
                    data = data[:cut + 1]
                elif len(data) < LOG_CHUNK:
                    data = b""  # a partial line: wait for the rest
            if off + len(data) < size:
                eof = False
            if data:
                logs.append({"stream": stream, "offset": off, "text": data.decode(errors="replace")})
                offsets[stream] = off + len(data)
        payload = {}
        if run_out:
            payload["run"] = run_out
        if stages:
            payload["stages"] = stages
        if results:
            payload["results"] = results
        if logs:
            payload["logs"] = logs
        return payload, upd, offsets, eof

    def upload_files(self, run: dict) -> bool:
        """Upload small artifacts of finished stages once. Returns True when nothing is left to upload."""
        done = True
        for s in run["stages"]:
            if s["status"] not in ("done", "failed", "cancelled", "interrupted"):
                continue
            for a in artifacts(self.rid, s["name"]):
                if a["kind"] != "file" or a["size"] > UPLOAD_CAP:
                    continue
                key = f"{a['path']}|{a['size']}|{a['mtime']}"
                if self.state["uploaded"].get(a["path"]) == key:
                    continue
                p = self.dir / a["path"]
                ctype = mimetypes.guess_type(p.name)[0] or "application/octet-stream"
                try:
                    self.client.put_bytes(f"/agent/v1/runs/{self.rid}/files/{a['path']}", p.read_bytes(), ctype, a["mtime"])
                    self.state["uploaded"][a["path"]] = key
                except HubError as e:
                    if e.status == 413:  # over the hub's per-run volume: skip it for good
                        self.state["uploaded"][a["path"]] = key
                    else:
                        done = False
                        raise
        return done

    def push(self) -> dict | None:
        """Send what changed. Returns the hub's reply ({status, cancel_requested}) or None if there was nothing to send.
        Raises HubError (status 404 = the run was deleted on the hub)."""
        run = store.get_run(self.rid)
        if run is None:
            self.state["complete"] = True
            return None
        payload, upd, offsets, eof = self.collect(run)
        reply = None
        if payload:
            reply = self.client.post(f"/agent/v1/runs/{self.rid}/events", payload)
            self.state["sent"].update(upd)
            self.state["offsets"].update(offsets)
            self.state["last_push"] = time.time()
            self._save()
        uploaded = self.upload_files(run)
        if run["status"] in FINAL and eof and uploaded and not payload:
            self.state["complete"] = True
        self._save()
        return reply
