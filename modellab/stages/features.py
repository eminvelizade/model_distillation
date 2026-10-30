"""features: feature probe + PCA (compare_features.py's metrics) for RF-DETR backbones and optionally a teacher.

Per object: roi_align-pooled last-stage features inside each GT box; kNN + linear probe on the object class
(grouped by image). Linear CKA of every model vs the first one (reference) and vs the teacher. PCA(3)->RGB images.
"""

from __future__ import annotations


class _RFExtractor:
    """RF-DETR encoder last stage (B, C, H/16, W/16)."""

    def __init__(self, model_id: str, weights, device: str):
        import rfdetr

        from modellab import catalog

        det = catalog.detector(model_id)
        rf = getattr(rfdetr, det.rfdetr_class)(pretrain_weights=str(weights), device=device)
        self.net, self.device = rf.model.model.backbone[0].encoder.eval(), device

    def __call__(self, x):
        return self.net(x)[-1]


def run(ctx):
    import numpy as np
    import torch

    from compare_features import Extractor, extract, linear_cka, load_split, pca_plot, probes

    st = ctx.st
    items, names = load_split(ctx.dataset(), st["split"])
    items = items[: st["max_images"]] if st.get("max_images") else items
    exts: dict[str, tuple] = {}
    for m, mid in zip(st["models"], st["model_ids"]):
        if isinstance(m, dict):
            exts[m["from"]] = ("rf", mid, ctx.input(m)["checkpoint"])
        else:
            exts[f"stock {mid}"] = ("rf", mid, ctx.stock_weights(mid))
    if st.get("teacher"):
        ctx.require_teacher(st["teacher"])
        exts[f"teacher {st['teacher']}"] = ("teacher", st["teacher"], None)
    feats = {}
    for i, (label, (kind, mid, w)) in enumerate(exts.items()):
        ext = _RFExtractor(mid, w, ctx.device) if kind == "rf" else Extractor(mid, None, ctx.device)
        feats[label] = extract(ext, items, st["size"], int(st.get("batch_size", 8)), int(st.get("tokens_per_image", 64)),
                               st["seed"])
        del ext
        if ctx.device == "cuda":
            torch.cuda.empty_cache()
        ctx.progress.update((i + 1) / (len(exts) + 1), f"extracted {label}")
    labels, groups = next(iter(feats.values()))[1], next(iter(feats.values()))[2]
    res = {"split": st["split"], "images": len(items), "objects": int(len(labels)), "size": st["size"],
           "classes": {names[c]: int((labels == c).sum()) for c in np.unique(labels)}, "probes": {}, "cka": {}}
    for label, f in feats.items():
        res["probes"][label] = probes(f[0], labels, groups, int(st.get("k", 20)), st["seed"])
    ref = next(iter(feats))
    teacher_label = next((k for k in feats if k.startswith("teacher ")), None)
    for label, f in feats.items():
        for other in {ref, teacher_label} - {None, label}:
            res["cka"][f"{label} vs {other}"] = {"objects": linear_cka(f[0], feats[other][0]),
                                                 "tokens": linear_cka(f[3], feats[other][3])}
    outputs = {}
    if st.get("pca", True):
        pca_plot(ctx.dir / "pca.png", items, {k: f[4] for k, f in feats.items()}, st["size"])
        outputs["pca"] = "pca.png"
    ctx.log(f"probes: { {k: round(v.get('knn_acc', float('nan')), 3) for k, v in res['probes'].items()} }")
    return outputs, res
