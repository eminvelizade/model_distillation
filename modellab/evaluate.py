"""Identical evaluation for every detector (RF-DETR and LT-DETR).

Accuracy: each model runs its own preprocessing (resize to its input size, ImageNet normalisation) on every image of
the split, one image at a time, score threshold 0, top-100 detections by score (COCO maxDets). Predicted classes are
mapped to the dataset's categories BY NAME, so COCO-pretrained (stock) models can be scored on coco-vehicles; classes
the dataset doesn't have are dropped. pycocotools COCOeval (bbox) gives mAP50:95, mAP50, AP small/medium/large and
per-class AP (area=all, maxDets=100).

Latency: network forward only (no pre/post-processing) on one random 1x3xHxW tensor at the model's own input size,
fp16 on CUDA (fp32 on CPU, reported as such), 25 warm-up + 200 timed iterations with cuda.synchronize; median and
p95 in ms. Peak VRAM: torch.cuda.max_memory_allocated over the accuracy pass + latency (batch 1).

EVAL_VERSION + a hash of this file identify the eval code; results with different values are "not comparable".
"""

from __future__ import annotations

import copy
import hashlib
import json
import statistics
import time
from pathlib import Path

import numpy as np

from modellab import ROOT, catalog

EVAL_VERSION = "1"
MAX_DETS = 100
WARMUP, ITERS = 25, 200


def eval_version() -> str:
    return f"{EVAL_VERSION}+{hashlib.sha256(Path(__file__).read_bytes()).hexdigest()[:10]}"


class Adapter:
    family = ""
    resolution = 0
    names: dict[int, str] = {}

    def predict(self, img):  # PIL RGB -> (boxes xyxy [N,4], scores [N], class names [N])
        raise NotImplementedError

    def latency_module(self, device, dtype):  # -> (callable running one forward, input description)
        raise NotImplementedError

    def num_params(self) -> int:
        raise NotImplementedError


class RFDETRAdapter(Adapter):
    family = "rfdetr"

    def __init__(self, det: catalog.Detector, weights: Path, device: str, label_names: list[str] | None = None):
        import rfdetr

        self.rf = getattr(rfdetr, det.rfdetr_class)(pretrain_weights=str(weights), device=device)
        self.resolution = self.rf.model.resolution
        self.device = device
        # Label index -> class name. rfdetr trains Roboflow/COCO-layout datasets with label = position of the category
        # in the annotation file's categories sorted by id (cat2label, 0-based), but RFDETR.class_names is 1-based,
        # so it can't be used as-is. Fine-tune stages store that exact list (classes.json); a checkpoint trained by
        # rfdetr elsewhere falls back to its args.class_names (0-based); COCO-pretrained heads use COCO category ids.
        trained = getattr(self.rf.model, "class_names", None)
        if label_names:
            self.names = dict(enumerate(label_names))
        elif trained:
            self.names = dict(enumerate(trained))
        else:
            self.names = dict(self.rf.class_names)  # COCO_CLASSES, keyed by COCO category id

    def predict(self, img):
        d = self.rf.predict(img, threshold=0.0)
        order = np.argsort(-d.confidence)[:MAX_DETS]
        return d.xyxy[order], d.confidence[order], [self.names.get(int(c)) for c in d.class_id[order]]

    def latency_module(self, device, dtype):
        import torch

        m = copy.deepcopy(self.rf.model.model).eval()
        m.export()  # same as rfdetr's optimize_for_inference (export-mode forward, no aux outputs)
        m = m.to(device=device, dtype=dtype)
        x = torch.randn(1, 3, self.resolution, self.resolution, device=device, dtype=dtype)
        return (lambda: m(x)), f"1x3x{self.resolution}x{self.resolution}"

    def num_params(self) -> int:
        return sum(p.numel() for p in self.rf.model.model.parameters())


class LTDETRAdapter(Adapter):
    family = "ltdetr"

    def __init__(self, weights: Path, device: str):
        import lightly_train

        self.m = lightly_train.load_model(str(weights), device=device).eval()
        self.names = {int(k): v for k, v in self.m.classes.items()}
        self.resolution = int(self.m.image_size[0])
        self.size = tuple(int(s) for s in self.m.image_size)

    def predict(self, img):
        r = self.m.predict(img, threshold=0.0)
        scores = r["scores"].float().cpu().numpy()
        order = np.argsort(-scores)[:MAX_DETS]
        labels = r["labels"].cpu().numpy()[order]
        return r["bboxes"].float().cpu().numpy()[order], scores[order], [self.names.get(int(c)) for c in labels]

    def latency_module(self, device, dtype):
        import torch

        m = copy.deepcopy(self.m).deploy().to(device=device, dtype=dtype)
        x = torch.randn(1, 3, *self.size, device=device, dtype=dtype)
        return (lambda: m(x)), f"1x3x{self.size[0]}x{self.size[1]}"

    def num_params(self) -> int:
        return sum(p.numel() for p in self.m.parameters())


def label_names(train_annotations: Path) -> list[str]:
    """rfdetr's training label order for a COCO-layout dataset (categories sorted by id, cat2label)."""
    cats = json.loads(Path(train_annotations).read_text())["categories"]
    return [c["name"] for c in sorted(cats, key=lambda c: c["id"])]


def load(model_id: str, weights: Path | None, device: str, label_names: list[str] | None = None) -> Adapter:
    """weights=None -> the model's stock weights from the catalog."""
    det = catalog.detector(model_id)
    if weights is None:
        weights = ROOT / catalog.weight_file(det.weights[0]).dest
    if det.family == "rfdetr":
        return RFDETRAdapter(det, Path(weights), device, label_names)
    return LTDETRAdapter(Path(weights), device)


def coco_eval(gt: dict, dets: list[dict]) -> dict:
    """gt: COCO dict; dets: [{image_id, category_id, bbox [x,y,w,h], score}] -> metrics."""
    import contextlib
    import io

    from pycocotools.coco import COCO
    from pycocotools.cocoeval import COCOeval

    gt = copy.deepcopy(gt)
    for i, a in enumerate(gt["annotations"]):
        a["id"] = i + 1  # pycocotools treats a matched GT with id 0 as unmatched (make_splits used to start at 0)
        a.setdefault("area", a["bbox"][2] * a["bbox"][3])
        a.setdefault("iscrowd", 0)
    coco = COCO()
    coco.dataset = gt
    with contextlib.redirect_stdout(io.StringIO()):
        coco.createIndex()
        cats = sorted(c["id"] for c in gt["categories"])
        if not dets:
            return {"map": 0.0, "map50": 0.0, "ap_small": 0.0, "ap_medium": 0.0, "ap_large": 0.0,
                    "per_class": {c["name"]: 0.0 for c in gt["categories"]}, "num_detections": 0}
        cdt = coco.loadRes(dets)
        ev = COCOeval(coco, cdt, "bbox")
        ev.params.catIds = cats
        ev.evaluate()
        ev.accumulate()
        ev.summarize()
    s = ev.stats

    def nz(v: float):  # COCO uses -1 for "no GT in this area range"
        return None if v < 0 else float(v)

    prec = ev.eval["precision"]  # [T, R, K, A, M]
    per_class = {}
    for k, cid in enumerate(cats):
        p = prec[:, :, k, 0, -1]
        p = p[p > -1]
        per_class[next(c["name"] for c in gt["categories"] if c["id"] == cid)] = float(p.mean()) if p.size else None
    return {"map": nz(s[0]), "map50": nz(s[1]), "ap_small": nz(s[3]), "ap_medium": nz(s[4]), "ap_large": nz(s[5]),
            "per_class": per_class, "num_detections": len(dets)}


def measure_latency(adapter: Adapter, device: str) -> dict:
    import torch

    dtype = torch.float16 if device == "cuda" else torch.float32
    fn, shape = adapter.latency_module(device, dtype)
    times = []
    with torch.inference_mode():
        for i in range(WARMUP + ITERS):
            if device == "cuda":
                torch.cuda.synchronize()
            t = time.perf_counter()
            fn()
            if device == "cuda":
                torch.cuda.synchronize()
            if i >= WARMUP:
                times.append((time.perf_counter() - t) * 1000)
    times.sort()
    dev = torch.cuda.get_device_name(0) if device == "cuda" else "cpu"
    return {"latency_ms": statistics.median(times), "latency_p95_ms": times[int(0.95 * (len(times) - 1))],
            "latency_device": f"{dev} {'fp16' if device == 'cuda' else 'fp32'} bs1 {shape}",
            "latency_iters": ITERS, "latency_warmup": WARMUP}


def evaluate(adapter: Adapter, split_dir: Path, device: str, latency: bool = True, max_images: int | None = None,
             progress=None) -> dict:
    import torch
    from PIL import Image

    gt = json.loads((split_dir / "_annotations.coco.json").read_text())
    if max_images:
        keep = {im["id"] for im in gt["images"][:max_images]}
        gt["images"] = [im for im in gt["images"] if im["id"] in keep]
        gt["annotations"] = [a for a in gt["annotations"] if a["image_id"] in keep]
    name_to_id = {c["name"]: c["id"] for c in gt["categories"]}
    overlap = sorted(set(adapter.names.values()) & set(name_to_id))
    if device == "cuda":
        torch.cuda.reset_peak_memory_stats()
    dets, dropped = [], 0
    t0 = time.time()
    for i, im in enumerate(gt["images"]):
        with Image.open(split_dir / im["file_name"]) as pil:
            boxes, scores, names = adapter.predict(pil.convert("RGB"))
        for b, s, n in zip(boxes, scores, names):
            if n not in name_to_id:
                dropped += 1
                continue
            x1, y1, x2, y2 = (float(v) for v in b)
            dets.append({"image_id": im["id"], "category_id": name_to_id[n], "bbox": [x1, y1, x2 - x1, y2 - y1],
                         "score": float(s)})
        if progress:
            progress.update((i + 1) / len(gt["images"]) * (0.8 if latency else 1.0), f"image {i + 1}/{len(gt['images'])}")
    res = coco_eval(gt, dets)
    res.update({"images": len(gt["images"]), "seconds_accuracy_pass": round(time.time() - t0, 1),
                "class_overlap": overlap, "dropped_detections_other_classes": dropped,
                "params_m": adapter.num_params() / 1e6, "input_size": adapter.resolution, "family": adapter.family,
                "eval_version": eval_version(), "max_dets": MAX_DETS})
    if not overlap:
        res["warning"] = "model and dataset share no class names; mAP is 0 by construction"
    if latency:
        res.update(measure_latency(adapter, device))
    res["peak_vram_mb"] = torch.cuda.max_memory_allocated() / 2**20 if device == "cuda" else None
    return res
