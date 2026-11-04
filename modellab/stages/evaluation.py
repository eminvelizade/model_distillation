"""eval: modellab.evaluate on the dataset's test (or valid) split. Writes metrics into result.json; the runner
copies them into the SQLite index (leaderboard)."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


def run(ctx):
    import torch

    from modellab import catalog, datasets, evaluate

    torch.backends.cudnn.benchmark = False
    torch.backends.cudnn.deterministic = True
    st = ctx.st
    det = catalog.detector(st["model_id"])
    names, size = None, None
    if isinstance(st["model"], dict):
        src = ctx.input(st["model"])
        size = src.get("image_size")
        weights, origin = src["checkpoint"], f"stage {st['model']['from']}"
        if src.get("classes"):
            names = json.loads(Path(src["classes"]).read_text())
    else:
        weights, origin = ctx.stock_weights(det.id), "stock weights"
    ds = ctx.dataset()
    ctx.log(f"evaluating {det.id} ({origin}) on {st['dataset']}/{st['split']}")
    if det.family == "rfdetr" and size and int(size) != det.resolution:
        adapter = _rfdetr_at(det, weights, ctx.device, names, int(size))  # fine-tuned at a non-native resolution
    else:
        adapter = evaluate.load(det.id, weights, ctx.device, names)
    res = evaluate.evaluate(adapter, ds / st["split"], ctx.device, latency=st.get("latency", True),
                            max_images=st.get("max_images"), progress=ctx.progress)
    h = datasets.split_hash(ds, st["split"])
    if st.get("max_images"):  # a subset is a different eval set
        h = hashlib.sha256(f"{h}:first{st['max_images']}".encode()).hexdigest()
    res.update(label=st["label"], model=det.id, family=det.family, dataset=st["dataset"], split=st["split"],
               dataset_hash=h, weights_origin=origin)
    ctx.log(f"mAP50:95={res['map']:.4f} mAP50={res['map50']:.4f}"
            + (f" latency={res['latency_ms']:.2f}ms ({res['latency_device']})" if res.get("latency_ms") else ""))
    return {"model": det.id}, res


def _rfdetr_at(det, weights, device: str, names: list[str] | None, size: int):
    """evaluate.RFDETRAdapter for a checkpoint trained at another resolution: same evaluation, the model just runs at
    the size it was trained at (predict() resizes to the model's resolution)."""
    from modellab import evaluate

    class RFAtSize(evaluate.RFDETRAdapter):
        def __init__(self):  # noqa: D107
            import rfdetr

            self.rf = getattr(rfdetr, det.rfdetr_class)(pretrain_weights=str(weights), device=device, resolution=size)
            self.resolution, self.device = self.rf.model.resolution, device
            trained = getattr(self.rf.model, "class_names", None)
            self.names = dict(enumerate(names)) if names else dict(enumerate(trained)) if trained else dict(self.rf.class_names)

    return RFAtSize()
