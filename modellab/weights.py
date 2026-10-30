"""Weight files: status (present / verified) and fetching with MD5/SHA-256 verification (online PC only).

    modellab weights list
    modellab weights fetch rfdetr/small dinov3/vitb16 ltdetr/dinov3-vits16-coco   # model ids expand to their files
    modellab weights verify                                                       # hash every present file

Downloads use curl (resumable, like download_weights.sh). A file is only moved into place after its hash matches.
"""

from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path

from modellab import ROOT, catalog

_VERIFIED_CACHE = ROOT / "cache" / "modellab_verified.json"  # path -> (size, mtime, ok) so `list` stays fast


def file_hash(path: Path, algo: str) -> str:
    h = hashlib.new(algo)
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 22), b""):
            h.update(block)
    return h.hexdigest()


def verify(w: catalog.WeightFile, path: Path | None = None) -> bool:
    path = path or ROOT / w.dest
    if w.md5:
        return file_hash(path, "md5") == w.md5
    if w.sha256:
        return file_hash(path, "sha256") == w.sha256
    return True


def _load_cache() -> dict:
    try:
        return json.loads(_VERIFIED_CACHE.read_text())
    except (OSError, ValueError):
        return {}


def status(key: str, check: bool = False) -> dict:
    """{key, dest, present, size, verified (True/False/None=unchecked)}"""
    w = catalog.weight_file(key)
    p = ROOT / w.dest
    out = {"key": key, "dest": w.dest, "present": p.is_file(), "size": p.stat().st_size if p.is_file() else None,
           "expected_size": w.size, "verified": None}
    if not p.is_file():
        return out
    cache = _load_cache()
    sig = [p.stat().st_size, p.stat().st_mtime]
    if cache.get(w.dest, [None])[:2] == sig:
        out["verified"] = cache[w.dest][2]
    elif check:
        out["verified"] = verify(w, p)
        cache[w.dest] = sig + [out["verified"]]
        _VERIFIED_CACHE.parent.mkdir(parents=True, exist_ok=True)
        _VERIFIED_CACHE.write_text(json.dumps(cache, indent=1))
    return out


def expand(ids: list[str]) -> list[str]:
    """Model / teacher ids -> weight-file keys (weight keys pass through)."""
    keys: list[str] = []
    for i in ids:
        if i in catalog.DETECTORS:
            new = list(catalog.DETECTORS[i].weights)
        elif i in catalog.TEACHERS:
            new = list(catalog.TEACHERS[i].weights)
        else:
            catalog.weight_file(i)  # raises for unknown ids
            new = [i]
        keys += [k for k in new if k not in keys]
    return keys


def required_for(model_ids: list[str]) -> list[str]:
    return expand([m for m in model_ids if m])


def missing(model_ids: list[str]) -> list[str]:
    return [k for k in required_for(model_ids) if not (ROOT / catalog.weight_file(k).dest).is_file()]


def fetch(key: str, log=print) -> Path:
    w = catalog.weight_file(key)
    dest = ROOT / w.dest
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.is_file() and verify(w, dest):
        log(f"[weights] ok (cached) {w.dest}")
        return dest
    part = dest.with_name(dest.name + ".part")
    for attempt in range(1, 4):
        subprocess.run(["curl", "-L", "--fail", "--retry", "5", "--retry-delay", "5", "-C", "-", "-o", str(part), w.url])
        if part.is_file() and verify(w, part):
            part.replace(dest)
            status(key, check=True)
            log(f"[weights] ok {w.dest}")
            return dest
        log(f"[weights] hash mismatch/incomplete on attempt {attempt}, restarting {w.dest}")
        part.unlink(missing_ok=True)
    raise RuntimeError(f"failed to fetch {w.url}")
