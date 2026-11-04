"""speed: how fast a model architecture runs at an input size, before any training.

Builds the model (RF-DETR from its stock weights at the requested resolution; LT-DETR from its config, no weights:
speed doesn't depend on the weights) and times it with modellab.evaluate.measure_latency, the same measurement the eval
stage reports. Searches use it to drop candidates over the speed budget without training them.

A model that can't be built or run (e.g. out of GPU memory) records the error in the metrics instead of failing the
run, so one bad candidate doesn't stop the others.
"""

from __future__ import annotations

import json
import traceback


def _rf(det, weights, size: int, device: str):
    from modellab import evaluate

    class RFAtSize(evaluate.RFDETRAdapter):
        def __init__(self):  # noqa: D107  (stock weights at another resolution; names are not needed for timing)
            import rfdetr

            self.rf = getattr(rfdetr, det.rfdetr_class)(pretrain_weights=str(weights), device=device, resolution=size)
            self.resolution, self.device, self.names = size, device, {}

    return RFAtSize()


def _lt(det, size: int, num_classes: int):
    from lightly_train._task_models.ltdetr_object_detection.task_model import LTDETRObjectDetection

    from modellab import evaluate

    class LTAtSize(evaluate.LTDETRAdapter):
        def __init__(self):  # noqa: D107  (architecture only: load_weights=False)
            self.m = LTDETRObjectDetection(model_name=det.lightly_name, classes={i: f"class{i}" for i in range(num_classes)},
                                           image_size=(size, size), load_weights=False).eval()
            self.names, self.resolution, self.size = {}, size, (size, size)

    return LTAtSize()


def run(ctx):
    import torch

    from modellab import catalog, evaluate

    st = ctx.st
    det = catalog.detector(st["model"])
    size = int(st["image_size"])
    num_classes = 80
    if st.get("dataset"):
        ds = ctx.dataset()
        num_classes = len(json.loads((ds / "train" / "_annotations.coco.json").read_text())["categories"]) or 80
    out = {"model": det.id, "family": det.family, "input_size": size, "label": f"{det.id} @ {size}"}
    ctx.log(f"timing {det.id} at {size}x{size} on {ctx.device}")
    try:
        adapter = _rf(det, ctx.stock_weights(det.id), size, ctx.device) if det.family == "rfdetr" else _lt(det, size, num_classes)
        ctx.progress.update(0.3, "built")
        out["params_m"] = adapter.num_params() / 1e6
        if ctx.device == "cuda":
            torch.cuda.reset_peak_memory_stats()
        out.update(evaluate.measure_latency(adapter, ctx.device))
        out["peak_vram_mb"] = torch.cuda.max_memory_allocated() / 2**20 if ctx.device == "cuda" else None
        out["eval_version"] = evaluate.eval_version()
        ctx.log(f"{det.id} @ {size}: {out['latency_ms']:.2f} ms ({out['latency_device']}), {out['params_m']:.1f}M params")
    except Exception as e:  # noqa: BLE001  (recorded: one bad candidate must not stop the others)
        traceback.print_exc()
        out["error"] = f"{type(e).__name__}: {e}"[:2000]
        if ctx.device == "cuda":
            torch.cuda.empty_cache()
    return {"model": det.id}, out
