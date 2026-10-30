"""Dataset registry: name -> Roboflow-layout directory (train/valid/test + _annotations.coco.json).

datasets.json (gitignored, per machine) maps names to paths; paths may be relative to the project root.
Every dataset gets a content hash per split. The hash covers the canonical annotations (boxes, classes)
and the MD5 of every image's bytes, never file paths, so the same split hashes identically on the online
and the offline PC. Runs store these hashes; eval comparability is decided on the evaluated split's hash.

    modellab dataset add mydata /data/mydata_roboflow              # already in Roboflow layout
    modellab dataset import mydata --coco-json a.json --images-dir imgs/   # via make_splits.py (70/15/15)
    modellab dataset build-coco-vehicles --coco-root /data/coco2017       # see coco_vehicles.py
"""

from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from pathlib import Path

from modellab import ROOT, datasets_file

SPLITS = ("train", "valid", "test")
COCO_VEHICLES = "coco-vehicles"
COCO_VEHICLES_DIR = "data/coco-vehicles"


def _raw() -> dict:
    f = datasets_file()
    return json.loads(f.read_text()) if f.is_file() else {}


def _placeholder(name: str, entry: dict) -> bool:
    """The never-built coco-vehicles entry older versions put in every registry (it showed up on every machine as
    "not built" and could not be removed). Hidden; building the set registers it for real."""
    return name == COCO_VEHICLES and entry.get("path") == COCO_VEHICLES_DIR and not (ROOT / COCO_VEHICLES_DIR).is_dir()


def _load() -> dict:
    return {k: v for k, v in _raw().items() if not _placeholder(k, v)}


def _save(reg: dict) -> None:
    f = datasets_file()
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(json.dumps(reg, indent=2))


def path_of(name: str) -> Path:
    reg = _load()
    if name not in reg:
        raise KeyError(f"unknown dataset {name!r}; registered: {sorted(reg)}")
    p = Path(reg[name]["path"])
    return (p if p.is_absolute() else ROOT / p).resolve()


def validate_layout(path: Path) -> dict:
    """-> {split: {"images": n, "boxes": n}, "classes": [...]}; raises if not a usable Roboflow layout."""
    info: dict = {}
    classes = None
    for s in SPLITS:
        ann = path / s / "_annotations.coco.json"
        if not ann.is_file():
            raise FileNotFoundError(f"{ann} missing (expected Roboflow layout train/valid/test)")
        d = json.loads(ann.read_text())
        used = {a["category_id"] for a in d["annotations"]}
        if s == "train":
            classes = [c["name"] for c in sorted(d["categories"], key=lambda c: c["id"]) if c["id"] in used]
        missing = [im["file_name"] for im in d["images"][:50] if not (path / s / im["file_name"]).exists()]
        if missing:
            raise FileNotFoundError(f"{s}: images missing, e.g. {missing[0]}")
        info[s] = {"images": len(d["images"]), "boxes": len(d["annotations"])}
    info["classes"] = classes
    return info


def _md5(path: Path) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def split_hash(path: Path, split: str, fresh: bool = False) -> str:
    """sha256 over canonical annotations (per image: md5 of bytes, size, sorted (class name, bbox)) .
    `fresh`: ignore the cache (which only notices changed annotation files) and re-read every image."""
    ann_file = path / split / "_annotations.coco.json"
    d = json.loads(ann_file.read_text())
    cache_f = path / ".modellab_hash.json"
    try:
        cache = json.loads(cache_f.read_text())
    except (OSError, ValueError):
        cache = {}
    st = ann_file.stat()
    key = f"{split}:{st.st_size}:{st.st_mtime_ns}"
    if key in cache and not fresh:
        return cache[key]
    names = {c["id"]: c["name"] for c in d["categories"]}
    boxes: dict[int, list] = {}
    for a in d["annotations"]:
        boxes.setdefault(a["image_id"], []).append([names[a["category_id"]], [round(float(v), 2) for v in a["bbox"]],
                                                    int(a.get("iscrowd", 0))])
    rows = sorted([_md5(path / split / im["file_name"]), im["width"], im["height"], sorted(boxes.get(im["id"], []))]
                  for im in d["images"])
    h = hashlib.sha256(json.dumps(rows, separators=(",", ":")).encode()).hexdigest()
    cache = {k: v for k, v in cache.items() if not k.startswith(f"{split}:")}
    cache[key] = h
    try:
        cache_f.write_text(json.dumps(cache))
    except OSError:
        pass  # read-only dataset dir: just recompute next time
    return h


def info(name: str, with_hash: bool = True, fresh: bool = False) -> dict:
    p = path_of(name)
    out = {"name": name, "path": str(p), "description": _load()[name].get("description", ""), "built": p.is_dir()}
    if not p.is_dir():
        return out
    out.update(validate_layout(p))
    if with_hash:
        out["hash"] = {s: split_hash(p, s, fresh) for s in SPLITS}
        out["hash"]["all"] = hashlib.sha256("".join(out["hash"][s] for s in SPLITS).encode()).hexdigest()
    return out


def list_all() -> list[dict]:
    out = []
    for name in sorted(_load()):
        try:
            out.append(info(name, with_hash=False))
        except Exception as e:  # noqa: BLE001  (a broken entry must not break the listing)
            out.append({"name": name, "error": str(e)})
    return out


def add(name: str, path: Path, description: str = "") -> dict:
    path = path.resolve()
    validate_layout(path)
    reg = _load()  # drops a legacy placeholder for good
    try:
        rel = path.relative_to(ROOT)
        stored = str(rel)
    except ValueError:
        stored = str(path)
    reg[name] = {"path": stored, "description": description}
    _save(reg)
    return info(name)


def _make_splits(args: list[str]) -> None:
    r = subprocess.run([sys.executable, str(ROOT / "make_splits.py"), *args], cwd=ROOT, capture_output=True, text=True)
    if r.stdout:
        print(r.stdout, end="")
    if r.returncode:
        tail = "\n".join((r.stderr or r.stdout).strip().splitlines()[-15:])
        raise RuntimeError(f"make_splits.py failed (exit {r.returncode}):\n{tail}")


def import_coco(name: str, coco_json: Path, images_dir: Path | None, out: Path | None = None, extra: list[str] = (),
                description: str = "") -> dict:
    """Normalize any COCO json (+images) through make_splits.py into data/<name>, then register it."""
    out = out or ROOT / "data" / name
    _make_splits(["--format", "coco", "--coco-json", str(coco_json), "--out", str(out),
                  *(["--images-dir", str(images_dir)] if images_dir else []), *extra])
    return add(name, out, description)


def import_yolo(name: str, yolo_dir: Path, keep_splits: bool = False, out: Path | None = None, description: str = "") -> dict:
    """A YOLO dataset (images/ + labels/ + data.yaml) through make_splits.py into data/<name>, then register it."""
    out = out or ROOT / "data" / name
    _make_splits(["--format", "yolo", "--yolo-dir", str(yolo_dir), "--out", str(out), *(["--keep-splits"] if keep_splits else [])])
    return add(name, out, description)


def remove(name: str) -> None:
    """Forget a dataset (its files stay where they are)."""
    reg = _raw()
    if name not in reg:
        raise KeyError(f"unknown dataset {name!r}")
    del reg[name]
    _save(reg)
