"""Compare stock vs distilled RF-DETR Nano backbone features on a held-out split.

Images are resized to 384x384 + ImageNet-normalized (same as RFDETR.predict). Features are the
encoder's last stage (B, 384, 24, 24) -- the map that was distilled. Per object, features are
roi_align-pooled inside each GT box, labelled with the box class.

Reported (results.json + printed table):
  * kNN (cosine, temperature-weighted vote) and linear probe (logistic regression) on object class,
    StratifiedGroupKFold by image so objects of one image are never in both train and test folds.
  * linear CKA stock<->distilled on object features and on patch tokens; mean token cosine.
  * --teacher: same probes for the DINOv3 teacher (--teacher-model, default dinov3/vitl16; run in bf16)
    plus CKA(stock, teacher) vs CKA(distilled, teacher).
  * --pca-plot: PCA(3)->RGB of patch tokens for a few images.

    python compare_features.py --data data/ds --split valid --distilled runs/distill/rf-detr-nano-distilled.pth --teacher --pca-plot
    python compare_features.py ... --teacher --teacher-model dinov3/vith16plus   # same teacher as distill.py
"""

import offline_guard  # noqa: F401  (must be first)

import argparse
import json
from pathlib import Path

import numpy as np

IMAGENET_MEAN = (0.485, 0.456, 0.406)
IMAGENET_STD = (0.229, 0.224, 0.225)


def load_split(data: Path, split: str):
    js = json.loads((data / split / "_annotations.coco.json").read_text())
    names = {c["id"]: c["name"] for c in js["categories"]}
    boxes = {im["id"]: [] for im in js["images"]}
    for a in js["annotations"]:
        boxes[a["image_id"]].append((a["bbox"], a["category_id"]))
    items = [(data / split / im["file_name"], im, boxes[im["id"]]) for im in js["images"]]
    return items, names


def preprocess(path: Path, size: int):
    import torch
    import torchvision.transforms.functional as TF
    from PIL import Image

    with Image.open(path) as im:
        im = im.convert("RGB")
        w, h = im.size
        x = TF.normalize(TF.to_tensor(im.resize((size, size), Image.BILINEAR)), IMAGENET_MEAN, IMAGENET_STD)
    return x, torch.tensor([size / w, size / h, size / w, size / h])


class Extractor:
    """Wraps a backbone so that __call__(x) returns a (B, C, H/16, W/16) feature map."""

    def __init__(self, kind: str, weights: Path, device: str, stage: int = -1):
        self.kind, self.device, self.stage = kind, device, stage
        if kind == "nano":
            from load_backbone import load_nano

            self.net = load_nano(weights, device).model.model.backbone[0].encoder
        else:  # kind = teacher name, e.g. "dinov3/vitl16"; bf16 weights
            import teacher

            self.net = teacher.build(kind, weights)
        self.net = self.net.to(device).eval()

    def __call__(self, x):
        if self.kind == "nano":
            return self.net(x)[self.stage]
        t = self.net.forward_features(x)["x_norm_patchtokens"]  # (B, N, C)
        ps = self.net.patch_size
        return t.transpose(1, 2).reshape(t.shape[0], t.shape[2], x.shape[-2] // ps, x.shape[-1] // ps)


def extract(ext: Extractor, items, size: int, batch: int, tokens_per_image: int, seed: int):
    """-> object feats (N_obj, C), object labels, object image ids, sampled patch tokens, first fmaps."""
    import torch
    from torchvision.ops import roi_align

    rng = np.random.default_rng(seed)
    objs, labels, groups, toks, first = [], [], [], [], []
    for i in range(0, len(items), batch):
        chunk = items[i:i + batch]
        xs, rois = [], []
        for path, im, bxs in chunk:
            x, scale = preprocess(path, size)
            xs.append(x)
            xyxy = torch.tensor([[b[0], b[1], b[0] + b[2], b[1] + b[3]] for b, _ in bxs], dtype=torch.float32).reshape(-1, 4)
            rois.append(xyxy * scale)
            labels += [c for _, c in bxs]
            groups += [im["id"]] * len(bxs)
        with torch.no_grad():
            f = ext(torch.stack(xs).to(ext.device)).float()
            pooled = roi_align(f, [r.to(f.device) for r in rois], output_size=(2, 2), spatial_scale=f.shape[-1] / size,
                               sampling_ratio=2, aligned=True).mean((2, 3))
        objs.append(pooled.cpu())
        flat = f.flatten(2).transpose(1, 2).cpu()  # (B, HW, C)
        idx = rng.choice(flat.shape[1], size=min(tokens_per_image, flat.shape[1]), replace=False)
        toks.append(flat[:, idx].reshape(-1, flat.shape[-1]))
        if not first:
            first = [f[j].cpu() for j in range(min(4, len(chunk)))]
    return (torch.cat(objs).numpy(), np.array(labels), np.array(groups), torch.cat(toks).numpy(), first)


def linear_cka(x: np.ndarray, y: np.ndarray) -> float:
    x = x.astype(np.float64) - x.mean(0)
    y = y.astype(np.float64) - y.mean(0)
    return float(np.linalg.norm(y.T @ x) ** 2 / (np.linalg.norm(x.T @ x) * np.linalg.norm(y.T @ y)))


def knn_predict(train_x, train_y, test_x, k: int, t: float = 0.07):
    a = train_x / np.linalg.norm(train_x, axis=1, keepdims=True)
    b = test_x / np.linalg.norm(test_x, axis=1, keepdims=True)
    sim = b @ a.T
    k = min(k, len(train_x))
    top = np.argsort(-sim, axis=1)[:, :k]
    classes = np.unique(train_y)
    votes = np.zeros((len(test_x), len(classes)))
    w = np.exp(np.take_along_axis(sim, top, 1) / t)
    for ci, c in enumerate(classes):
        votes[:, ci] = (w * (train_y[top] == c)).sum(1)
    return classes[votes.argmax(1)]


def probes(x, y, groups, k: int, seed: int) -> dict:
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import accuracy_score, balanced_accuracy_score
    from sklearn.model_selection import StratifiedGroupKFold
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import StandardScaler

    n_splits = min(5, len(np.unique(groups)))
    if n_splits < 2 or len(np.unique(y)) < 2:
        return {"error": "need >=2 images and >=2 classes"}
    pred_knn, pred_lin = np.empty_like(y), np.empty_like(y)
    for tr, te in StratifiedGroupKFold(n_splits=n_splits, shuffle=True, random_state=seed).split(x, y, groups):
        pred_knn[te] = knn_predict(x[tr], y[tr], x[te], k)
        if len(np.unique(y[tr])) < 2:
            pred_lin[te] = y[tr][0]
            continue
        clf = make_pipeline(StandardScaler(), LogisticRegression(max_iter=3000, C=1.0))
        pred_lin[te] = clf.fit(x[tr], y[tr]).predict(x[te])
    out = {}
    for name, p in (("knn", pred_knn), ("linear", pred_lin)):
        out[f"{name}_acc"] = float(accuracy_score(y, p))
        out[f"{name}_bal_acc"] = float(balanced_accuracy_score(y, p))
    return out


def pca_plot(path: Path, items, maps: dict, size: int) -> None:
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from PIL import Image

    n = len(next(iter(maps.values())))
    fig, axes = plt.subplots(n, 1 + len(maps), figsize=(3 * (1 + len(maps)), 3 * n), squeeze=False)
    for col, (name, fm) in enumerate(maps.items(), start=1):
        x = np.concatenate([f.flatten(1).T.numpy() for f in fm])  # joint PCA over shown images
        x = x - x.mean(0)
        _, _, vt = np.linalg.svd(x, full_matrices=False)
        proj = x @ vt[:3].T
        proj = (proj - proj.min(0)) / (proj.max(0) - proj.min(0) + 1e-8)
        hw = fm[0].shape[1] * fm[0].shape[2]
        for r in range(n):
            axes[r, col].imshow(proj[r * hw:(r + 1) * hw].reshape(fm[0].shape[1], fm[0].shape[2], 3), interpolation="nearest")
            axes[r, col].set_title(name if r == 0 else "")
    for r in range(n):
        with Image.open(items[r][0]) as im:
            axes[r, 0].imshow(im.convert("RGB").resize((size, size)))
    for ax in axes.flat:
        ax.axis("off")
    fig.tight_layout()
    fig.savefig(path, dpi=100)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--data", type=Path, required=True)
    p.add_argument("--split", default="valid", choices=["valid", "test"], help="held-out split (never distilled)")
    p.add_argument("--distilled", type=Path, required=True)
    p.add_argument("--stock", type=Path, default=offline_guard.NANO_WEIGHTS)
    p.add_argument("--teacher", action="store_true", help="also extract DINOv3 teacher features")
    p.add_argument("--teacher-model", choices=list(offline_guard.TEACHERS), default=offline_guard.TEACHER_NAME)
    p.add_argument("--teacher-weights", type=Path, default=None,
                   help="default: --teacher-model's cache .pth; or a converted HF .pt (vitl16)")
    p.add_argument("--stage", type=int, default=-1, help="encoder stage index (-1 = last, the distilled one)")
    p.add_argument("--size", type=int, default=384)
    p.add_argument("--batch-size", type=int, default=16)
    p.add_argument("--max-images", type=int, default=None)
    p.add_argument("--tokens-per-image", type=int, default=64)
    p.add_argument("--k", type=int, default=20)
    p.add_argument("--seed", type=int, default=0)
    p.add_argument("--pca-plot", action="store_true")
    p.add_argument("--out", type=Path, default=Path("runs/compare"))
    a = p.parse_args()

    import torch

    device = "cuda" if torch.cuda.is_available() else "cpu"
    items, names = load_split(a.data, a.split)
    items = items[: a.max_images] if a.max_images else items
    a.out.mkdir(parents=True, exist_ok=True)

    models = {"stock": ("nano", offline_guard.require_file(a.stock)), "distilled": ("nano", offline_guard.require_file(a.distilled))}
    if a.teacher:
        tw = a.teacher_weights or offline_guard.teacher_cache_file(a.teacher_model)
        models["teacher"] = (a.teacher_model, offline_guard.require_file(tw))
    feats = {}
    for name, (kind, w) in models.items():
        ext = Extractor(kind, w, device, a.stage)
        feats[name] = extract(ext, items, a.size, a.batch_size, a.tokens_per_image, a.seed)
        del ext
        if device == "cuda":
            torch.cuda.empty_cache()
    labels, groups = feats["stock"][1], feats["stock"][2]
    print(f"[compare] split={a.split} images={len(items)} objects={len(labels)} "
          f"classes={ {names[c]: int((labels == c).sum()) for c in np.unique(labels)} }")

    res = {"split": a.split, "images": len(items), "objects": int(len(labels)), "stage": a.stage,
           "teacher_model": a.teacher_model if a.teacher else None, "probes": {}, "similarity": {}}
    for name, (obj, *_rest) in feats.items():
        res["probes"][name] = probes(obj, labels, groups, a.k, a.seed)
    s_obj, s_tok = feats["stock"][0], feats["stock"][3]
    d_obj, d_tok = feats["distilled"][0], feats["distilled"][3]
    cos = (s_tok * d_tok).sum(1) / (np.linalg.norm(s_tok, axis=1) * np.linalg.norm(d_tok, axis=1) + 1e-8)
    res["similarity"]["stock_vs_distilled"] = {"cka_objects": linear_cka(s_obj, d_obj), "cka_tokens": linear_cka(s_tok, d_tok),
                                               "token_cosine_mean": float(cos.mean()), "token_cosine_p10": float(np.percentile(cos, 10))}
    if a.teacher:
        t_obj, t_tok = feats["teacher"][0], feats["teacher"][3]
        for name in ("stock", "distilled"):
            res["similarity"][f"{name}_vs_teacher"] = {"cka_objects": linear_cka(feats[name][0], t_obj),
                                                      "cka_tokens": linear_cka(feats[name][3], t_tok)}
    if a.pca_plot:
        pca_plot(a.out / "pca.png", items, {n: f[4] for n, f in feats.items()}, a.size)
        res["pca_plot"] = str(a.out / "pca.png")

    (a.out / "results.json").write_text(json.dumps(res, indent=2))
    print(f"{'model':<10} {'kNN acc':>8} {'kNN bal':>8} {'lin acc':>8} {'lin bal':>8}")
    for name, r in res["probes"].items():
        if "error" in r:
            print(f"{name:<10} {r['error']}")
        else:
            print(f"{name:<10} {r['knn_acc']:8.3f} {r['knn_bal_acc']:8.3f} {r['linear_acc']:8.3f} {r['linear_bal_acc']:8.3f}")
    for k, v in res["similarity"].items():
        print(f"{k:<22} " + "  ".join(f"{m}={x:.3f}" for m, x in v.items()))
    print(f"[compare] -> {a.out / 'results.json'}")
    offline_guard.assert_no_network_attempts()


if __name__ == "__main__":
    main()
