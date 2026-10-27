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
    names = None
    if isinstance(st["model"], dict):
        src = ctx.input(st["model"])
        weights, origin = src["checkpoint"], f"stage {st['model']['from']}"
        if src.get("classes"):
            names = json.loads(Path(src["classes"]).read_text())
    else:
        weights, origin = ctx.stock_weights(det.id), "stock weights"
    ds = ctx.dataset()
    ctx.log(f"evaluating {det.id} ({origin}) on {st['dataset']}/{st['split']}")
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
