"""Folder listings for the web app's dataset picker (the hub side is modellab/hub/browse.py).

Only names leave the PC: sub-folders, plus .json files when the picker wants an annotation file, and a count of the
images in the folder. Never file contents. Hidden entries are left out; folders that already look like a dataset
(Roboflow train/valid/test, YOLO) are marked.
"""

from __future__ import annotations

import getpass
import os
import threading
import time
from pathlib import Path

from modellab.agent import data_dir, log
from modellab.agent.client import HubClient, HubError, Revoked

IMAGE_EXT = {".jpg", ".jpeg", ".png", ".bmp", ".webp", ".tif", ".tiff"}
MAX_ENTRIES = 1000
MAX_HINTS = 300  # folders checked for a dataset layout (a few stat calls each)
POLL_TIMEOUT_S = 60.0  # the hub holds a poll for up to 25 s


def layout(p: Path) -> str | None:
    try:
        if all((p / s / "_annotations.coco.json").is_file() for s in ("train", "valid", "test")):
            return "roboflow"
        if (p / "data.yaml").is_file() or ((p / "images").is_dir() and (p / "labels").is_dir()):
            return "yolo"
    except OSError:
        pass
    return None


def places() -> list[dict]:
    """Shortcuts shown above the listing: home, the usual data mounts that exist here, and /."""
    out = [{"label": "Home", "path": str(Path.home())}]
    try:
        user = getpass.getuser()
    except (KeyError, OSError):
        user = ""
    for c in ("/data", "/datasets", "/mnt", f"/media/{user}" if user else "", "/srv", "/scratch"):
        if c and os.path.isdir(c):
            out.append({"label": c, "path": c})
    if (data_dir() / "datasets").is_dir():
        out.append({"label": "ModelLab", "path": str(data_dir() / "datasets")})
    out.append({"label": "/", "path": "/"})
    return out


def listing(path: str | None, want: str = "dir") -> dict:
    p = Path(os.path.normpath(Path(path).expanduser())) if path else Path.home()
    if not p.is_absolute():
        raise ValueError("path must be absolute")
    if want == "json" and p.is_file():
        p = p.parent
    if not p.is_dir():
        raise FileNotFoundError(f"{p} is not a folder on this machine")
    dirs: list[str] = []
    files: list[tuple[str, int]] = []
    images = 0
    try:
        with os.scandir(p) as it:
            for e in it:
                if e.name.startswith("."):
                    continue
                try:
                    if e.is_dir():
                        dirs.append(e.name)
                        continue
                    ext = os.path.splitext(e.name)[1].lower()
                    if ext in IMAGE_EXT:
                        images += 1
                    elif want == "json" and ext == ".json" and e.is_file():
                        files.append((e.name, e.stat().st_size))
                except OSError:
                    continue
    except PermissionError:
        raise PermissionError(f"no permission to read {p}") from None
    dirs.sort(key=str.lower)
    files.sort(key=lambda f: f[0].lower())
    entries = [{"name": d, "type": "dir", "layout": layout(p / d) if i < MAX_HINTS else None}
               for i, d in enumerate(dirs[:MAX_ENTRIES])]
    entries += [{"name": n, "type": "file", "size": s} for n, s in files[:max(0, MAX_ENTRIES - len(entries))]]
    return {"path": str(p), "parent": str(p.parent) if p.parent != p else None, "entries": entries, "images": images,
            "truncated": len(dirs) + len(files) > len(entries), "layout": layout(p), "places": places()}


def answer(req: dict) -> dict:
    rid = req.get("id")
    try:
        path, want = req.get("path"), req.get("want", "dir")
        if want not in ("dir", "json") or (path is not None and (not isinstance(path, str) or "\x00" in path)):
            raise ValueError("bad folder request")
        return {"id": rid, "result": listing(path, want)}
    except Exception as e:  # noqa: BLE001  (the answer carries the error to the web app)
        return {"id": rid, "error": str(e) or type(e).__name__}


class Browser(threading.Thread):
    """Keeps a long-poll open to the hub and answers the dataset picker's folder requests."""

    def __init__(self, agent):
        super().__init__(name="modellab-browse", daemon=True)
        self.agent = agent
        self.client = HubClient(agent.cfg["hub_url"], agent.cfg["token"], timeout=POLL_TIMEOUT_S)

    def done(self) -> bool:
        return self.agent.stop or self.agent.revoked or self.agent.restart

    def run(self) -> None:
        answers: list[dict] = []
        while not self.done():
            t0 = time.time()
            try:
                reqs = self.client.post("/agent/v1/fs/poll", {"answers": answers}).get("requests") or []
            except Revoked:
                return
            except HubError as e:
                answers = []
                # hub down: retry soon; a hub without the folder browser (no such route): rarely
                time.sleep(600 if e.status in (404, 405) else 10)
                continue
            for r in reqs:
                if isinstance(r, dict):
                    log.info(f"dataset picker: listing {r.get('path') or '~'}")
            answers = [answer(r) for r in reqs if isinstance(r, dict)]
            if not reqs and time.time() - t0 < 1:
                time.sleep(1)  # never spin if the hub answers at once
