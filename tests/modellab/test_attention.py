"""Attention maps (modellab/attention.py): token -> patch mapping, box masks and metrics, and the features stage on CPU
with the real RF-DETR Nano backbone and a (random-weight) DINOv3 teacher."""

import json
import subprocess
import sys

import numpy as np
import torch
from conftest import ROOT


def test_rfdetr_windows_map_back_to_the_image_grid():
    from modellab import attention

    # 2x2 windows of 3x3 patches, one class token per window, no registers: 4 * (1 + 9) = 40 tokens.
    nw, ph, per = 2, 3, 10
    layout = {"kind": "rfdetr", "windows": nw, "registers": 0, "patch": 16}
    target_grid = (4, 1)  # row 4, col 1: window (wy=1, wx=0), patch (1, 1) inside it
    wy, wx, py, px = 1, 0, 1, 1
    target_tok = (wy * nw + wx) * per + 1 + py * ph + px
    a = torch.full((1, 40, 40), 1e-6)
    a[0, :, target_tok] = 1.0  # every query attends to one patch
    a[0, [w * per for w in range(4)], :] = 1e-6
    a[0, [w * per for w in range(4)], target_tok - 1] = 1.0  # class tokens look one patch to the left
    a = a / a.sum(-1, keepdim=True)
    m = attention.to_maps(a, layout, (6, 6))[0]
    assert np.unravel_index(m["received"].argmax(), (6, 6)) == target_grid
    assert np.unravel_index(m["cls"].argmax(), (6, 6)) == (4, 0)
    assert abs(m["received"].sum() - 1) < 1e-5 and abs(m["cls"].sum() - 1) < 1e-5
    # plain ViT: class token + 4 register tokens first
    v = torch.softmax(torch.randn(1, 5 + 16, 5 + 16), -1)
    mv = attention.to_maps(v, {"kind": "vit", "prefix": 5, "patch": 14}, (4, 4))[0]
    assert mv["received"].shape == (4, 4) and abs(mv["received"].sum() - 1) < 1e-5


def test_box_mask_and_metrics():
    from modellab import attention

    # a 100x50 image resized to 64x64 (scale 0.64 x 1.28), 4x4 grid of 16 px patches; box covers the top-left quarter
    mask = attention.box_mask([(0, 0, 50, 25)], (0.64, 1.28), 64, (4, 4))
    assert mask.tolist() == [[True, True, False, False], [True, True, False, False], [False] * 4, [False] * 4]
    focused = np.zeros((4, 4)); focused[:2, :2] = 0.25
    uniform = np.full((4, 4), 1 / 16)
    m = attention.metrics([{"received": focused, "cls": focused}], [mask], teacher=[{"received": focused, "cls": focused}])
    assert m["object_focus"] == 1.0 and m["box_area"] == 0.25 and m["lift"] == 4.0 and m["similarity_to_teacher"] == 1.0
    u = attention.metrics([{"received": uniform, "cls": uniform}], [mask])
    assert u["lift"] == 1.0 and u["entropy"] == 1.0 and "similarity_to_teacher" not in u


FEATURES = """
name: attention
dataset: tiny
seed: 1
stages:
  - {name: feat, type: features, models: [rfdetr/nano], teacher: dinov3/vitt16-notpretrained, split: valid,
     batch_size: 4, attention_images: 3}
"""


def test_features_stage_writes_attention(lab):
    from modellab import engine, recipe, store

    stages, errs, _ = recipe.validate(recipe.load_text(FEATURES))
    assert not errs and stages[0]["attention"] is True and stages[0]["attention_images"] == 3
    _, errs, _ = recipe.validate(recipe.load_text(FEATURES.replace("attention_images: 3", "attention_images: 0")))
    assert any("attention_images" in e for e in errs)
    rid = engine.submit(FEATURES)[0]
    r = subprocess.run([sys.executable, "-m", "modellab.runner", rid], cwd=ROOT, capture_output=True, text=True, timeout=1800)
    assert r.returncode == 0, r.stdout[-3000:] + r.stderr[-3000:]
    d = store.stage_dir(rid, "feat")
    res = json.loads((d / "result.json").read_text())
    att = res["metrics"]["attention"]
    assert set(att) == {"stock rfdetr/nano", "teacher dinov3/vitt16-notpretrained"}, att
    nano = att["stock rfdetr/nano"]
    assert nano["images"] == 3 and 0 < nano["object_focus"] < 1 and nano["lift"] > 0 and 0 < nano["entropy"] <= 1
    assert -1 <= nano["similarity_to_teacher"] <= 1
    assert "similarity_to_teacher" not in att["teacher dinov3/vitt16-notpretrained"]
    assert res["outputs"]["attention"] == "attention.png" and (d / "attention.png").stat().st_size > 1000
    assert (d / "pca.png").is_file() and "attention_errors" not in res["metrics"]
