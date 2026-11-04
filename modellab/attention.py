"""Where a vision transformer looks: attention maps from the last global self-attention layer of a backbone.

Used by the `features` stage so Yeti (and you) can see how distillation or fine-tuning changed what a backbone
attends to. Works on the RF-DETR backbones (DINOv2 with windowed attention: the last layer that attends across the
whole image) and on the DINOv2 / DINOv3 teachers. Nothing is changed in the models: a hook reads the layer's input and
recomputes its attention probabilities, averaged over heads.

Per image and model:
  received[j]  attention patch j receives from all patch tokens (each query's row renormalised over patch keys, then
               averaged over queries): which regions the rest of the image "reads from". Sums to 1.
  cls[j]       attention from the class token(s) to patch j (renormalised over patches; RF-DETR has one class token
               per window, averaged).

Metrics (averaged over images; box masks mark patches that overlap a ground-truth box):
  object_focus           share of `received` inside boxes
  lift                   object_focus / the boxes' share of the image (1 = no preference for objects)
  cls_object_focus       the same share for the class-token attention
  entropy                normalised entropy of `received` (0 = one patch, 1 = uniform)
  similarity_to_teacher  Pearson correlation of `received` with the teacher's map (resized to a common grid)
"""

from __future__ import annotations

import math
from contextlib import contextmanager

import numpy as np


# ---------------------------------------------------------------- finding and hooking the layer

def _rf_inner(net):
    """RF-DETR: the HF-style windowed DINOv2 backbone inside rfdetr's DinoV2 wrapper."""
    inner = getattr(net, "encoder", None)
    return inner if inner is not None and hasattr(inner, "config") and hasattr(inner, "encoder") else None


@contextmanager
def recording(net):
    """Record head-averaged attention probabilities (B, N, N) of the backbone's last global attention layer while
    `net` runs. Yields (records, layout) where layout tells how tokens map to patches."""
    import torch

    records: list = []
    inner = _rf_inner(net)
    if inner is not None:  # RF-DETR: Dinov2WithRegisters(Sdpa)SelfAttention with query/key Linear layers
        cfg = inner.config
        win = set(getattr(cfg, "window_block_indexes", []) or [])
        last = int(cfg.out_features[-1][5:]) - 1  # "stageK" is the output of layer K-1; later layers never run
        idx = max(i for i in range(last + 1) if i not in win)
        mod = inner.encoder.layer[idx].attention.attention
        layout = {"kind": "rfdetr", "windows": int(getattr(cfg, "num_windows", 1) or 1),
                  "registers": int(getattr(cfg, "num_register_tokens", 0) or 0), "patch": int(cfg.patch_size), "layer": idx}

        def lin(layer, h):  # in fp32, without touching the module's own weights
            return torch.nn.functional.linear(h, layer.weight.float(), None if layer.bias is None else layer.bias.float())

        def hook(m, args, _out):
            h = args[0].detach().float()
            b, n, _ = h.shape
            heads, d = m.num_attention_heads, m.attention_head_size
            q = lin(m.query, h).view(b, n, heads, d).transpose(1, 2)
            k = lin(m.key, h).view(b, n, heads, d).transpose(1, 2)
            records.append(torch.softmax(q @ k.transpose(-1, -2) / math.sqrt(d), dim=-1).mean(1).cpu())

        handle = mod.register_forward_hook(hook)
        try:
            yield records, layout
        finally:
            handle.remove()
        return

    blocks = getattr(net, "blocks", None)
    if blocks is None:
        raise ValueError(f"don't know where the attention of {type(net).__name__} is")
    attn = blocks[-1].attn
    prefix = 1 + int(getattr(net, "n_storage_tokens", 0) or getattr(net, "num_register_tokens", 0) or 0)
    layout = {"kind": "vit", "prefix": prefix, "patch": int(net.patch_size), "layer": len(blocks) - 1}
    if hasattr(attn, "compute_attention"):  # DINOv3: qkv (+ RoPE) go through compute_attention, from forward or forward_list
        orig = attn.compute_attention

        def wrapped(qkv, attn_bias=None, rope=None):
            b, n, _ = qkv.shape
            c = attn.qkv.in_features
            t = qkv.detach().reshape(b, n, 3, attn.num_heads, c // attn.num_heads)
            q, k = t[:, :, 0].transpose(1, 2), t[:, :, 1].transpose(1, 2)
            if rope is not None:
                q, k = attn.apply_rope(q, k, rope)
            records.append(torch.softmax((q.float() @ k.float().transpose(-1, -2)) * attn.scale, dim=-1).mean(1).cpu())
            return orig(qkv, attn_bias=attn_bias, rope=rope)

        attn.compute_attention = wrapped
        try:
            yield records, layout
        finally:
            del attn.compute_attention  # back to the class method
        return

    def hook(m, args, _out):  # DINOv2: Attention / MemEffAttention with a fused qkv Linear
        x = args[0].detach()
        b, n, c = x.shape
        t = m.qkv(x).reshape(b, n, 3, m.num_heads, c // m.num_heads).permute(2, 0, 3, 1, 4)
        q, k = t[0].float() * m.scale, t[1].float()
        records.append(torch.softmax(q @ k.transpose(-1, -2), dim=-1).mean(1).cpu())

    handle = attn.register_forward_hook(hook)
    try:
        yield records, layout
    finally:
        handle.remove()


# ---------------------------------------------------------------- tokens -> patch grids

def to_maps(probs, layout: dict, grid: tuple[int, int]) -> list[dict]:
    """(B, N, N) head-averaged attention -> per image {"received": (gh, gw), "cls": (gh, gw)} numpy maps."""
    gh, gw = grid
    out = []
    for a in probs.numpy():
        if layout["kind"] == "rfdetr":
            nw, r = layout["windows"], layout["registers"]
            ph, pw = gh // nw, gw // nw
            per = 1 + r + ph * pw
            if a.shape[0] != nw * nw * per:
                raise ValueError(f"unexpected token count {a.shape[0]} for {nw}x{nw} windows of {ph}x{pw} patches")
            pos = np.empty((gh, gw), dtype=np.int64)
            for wy in range(nw):
                for wx in range(nw):
                    base = (wy * nw + wx) * per + 1 + r
                    pos[wy * ph:(wy + 1) * ph, wx * pw:(wx + 1) * pw] = base + np.arange(ph * pw).reshape(ph, pw)
            cls_rows = [w * per for w in range(nw * nw)]
        else:
            p = layout["prefix"]
            if a.shape[0] != p + gh * gw:
                raise ValueError(f"unexpected token count {a.shape[0]} for {p} prefix tokens and a {gh}x{gw} grid")
            pos = p + np.arange(gh * gw).reshape(gh, gw)
            cls_rows = [0]
        idx = pos.reshape(-1)
        pp = a[np.ix_(idx, idx)]
        pp = pp / pp.sum(1, keepdims=True)
        received = pp.mean(0)
        cls = a[np.ix_(cls_rows, idx)].mean(0)
        cls = cls / cls.sum()
        out.append({"received": received.reshape(gh, gw), "cls": cls.reshape(gh, gw)})
    return out


def box_mask(boxes, scale, size: int, grid: tuple[int, int]) -> np.ndarray:
    """Patches that overlap any ground-truth box. boxes: [(x, y, w, h), ...] in original image pixels."""
    gh, gw = grid
    m = np.zeros((gh, gw), dtype=bool)
    sx, sy = float(scale[0]), float(scale[1])
    for x, y, w, h in boxes:
        x0, y0, x1, y1 = x * sx, y * sy, (x + w) * sx, (y + h) * sy
        c0, r0 = max(0, int(x0 / size * gw)), max(0, int(y0 / size * gh))
        c1, r1 = min(gw - 1, int(math.ceil(x1 / size * gw)) - 1), min(gh - 1, int(math.ceil(y1 / size * gh)) - 1)
        if c1 >= c0 and r1 >= r0:
            m[r0:r1 + 1, c0:c1 + 1] = True
    return m


def maps_for(ext, items, size: int, n_images: int) -> tuple[list[dict], list[np.ndarray]]:
    """Run `ext` (a features extractor with .net and .device) on the first images, one at a time."""
    import torch

    from compare_features import preprocess

    maps, masks = [], []
    with recording(ext.net) as (rec, layout):
        for path, _im, bxs in items[:n_images]:
            x, scale = preprocess(path, size)
            rec.clear()
            with torch.no_grad():
                ext(x[None].to(ext.device))
            if not rec:
                raise RuntimeError("the attention hook saw no forward pass")
            grid = (size // layout["patch"], size // layout["patch"])
            maps += to_maps(rec[-1], layout, grid)
            masks.append(box_mask([b for b, _ in bxs], scale, size, grid))
    return maps, masks


# ---------------------------------------------------------------- numbers and the figure

def _resize(m: np.ndarray, shape: tuple[int, int]) -> np.ndarray:
    if m.shape == shape:
        return m
    import torch

    return torch.nn.functional.interpolate(torch.from_numpy(m)[None, None].float(), size=shape, mode="bilinear",
                                           align_corners=False)[0, 0].numpy()


def metrics(maps: list[dict], masks: list[np.ndarray], teacher: list[dict] | None = None) -> dict:
    focus, cls_focus, area, ent, sim = [], [], [], [], []
    for i, (m, mask) in enumerate(zip(maps, masks)):
        r = m["received"]
        ent.append(float(-(r * np.log(r + 1e-12)).sum() / math.log(r.size)))
        if mask.any():
            focus.append(float(r[mask].sum()))
            cls_focus.append(float(m["cls"][mask].sum()))
            area.append(float(mask.mean()))
        if teacher is not None and i < len(teacher):
            t = teacher[i]["received"]
            shape = min(r.shape, t.shape)
            a, b = _resize(r, shape).ravel(), _resize(t, shape).ravel()
            if a.std() > 0 and b.std() > 0:
                sim.append(float(np.corrcoef(a, b)[0, 1]))
    out = {"images": len(maps), "entropy": round(float(np.mean(ent)), 4) if ent else None}
    if focus:
        f, a = float(np.mean(focus)), float(np.mean(area))
        out.update(object_focus=round(f, 4), box_area=round(a, 4), lift=round(f / a, 3) if a else None,
                   cls_object_focus=round(float(np.mean(cls_focus)), 4))
    if sim:
        out["similarity_to_teacher"] = round(float(np.mean(sim)), 4)
    return {k: v for k, v in out.items() if v is not None}


def plot(path, maps_by_model: dict[str, list[dict]], n: int = 4) -> None:
    """One row per image, one column per model: where each model's last global attention layer looks."""
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    rows = min(n, min(len(v) for v in maps_by_model.values()))
    cols = len(maps_by_model)
    fig, axes = plt.subplots(rows, cols, figsize=(3 * cols, 3 * rows), squeeze=False)
    for c, (name, maps) in enumerate(maps_by_model.items()):
        for r in range(rows):
            ax = axes[r, c]
            ax.imshow(maps[r]["received"], cmap="Blues", interpolation="nearest")
            ax.set_title(name if r == 0 else "", fontsize=9)
            ax.axis("off")
    fig.tight_layout()
    fig.savefig(path, dpi=100)
    plt.close(fig)
