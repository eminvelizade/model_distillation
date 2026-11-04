"""CPU: the `speed` stage (no training, no dataset needed) and fine-tuning / evaluating RF-DETR at a non-native size."""

import json
import subprocess
import sys

from conftest import ROOT

RECIPE = """
name: sizes
dataset: tiny
seed: 3
stages:
  - {name: s_nano, type: speed, model: rfdetr/nano, image_size: 320}
  - {name: s_lt, type: speed, model: ltdetr/dinov3-vitt16-test, image_size: 448}
  - {name: ft, type: finetune, model: rfdetr/nano, image_size: 320, batch_size: 2, budget: {epochs: 1}}
  - {name: ev, type: eval, model: {from: ft}, split: valid, latency: false}
  - {name: lt, type: finetune, model: ltdetr/dinov3-vitt16-test, image_size: 256, batch_size: 2, budget: {epochs: 1}}
"""


def test_speed_stage_and_rfdetr_at_another_size(lab):
    from modellab import engine, recipe, store

    stages, errs, _ = recipe.validate(recipe.load_text("name: x\nstages:\n  - {name: s, type: speed, model: rfdetr/nano}\n"))
    assert not errs and stages[0]["image_size"] == 384 and stages[0]["dataset"] is None  # no dataset needed
    _, errs, _ = recipe.validate(recipe.load_text("name: x\nstages:\n  - {name: s, type: speed, model: rfdetr/nano, image_size: 300}\n"))
    assert "multiple of 32" in errs[0]

    rid = engine.submit(RECIPE)[0]
    r = subprocess.run([sys.executable, "-m", "modellab.runner", rid], cwd=ROOT, capture_output=True, text=True, timeout=1800)
    assert r.returncode == 0, r.stdout[-3000:] + r.stderr[-3000:]
    res = {s: json.loads((store.stage_dir(rid, s) / "result.json").read_text()) for s in ("s_nano", "s_lt", "ft", "ev")}
    for s, size in (("s_nano", 320), ("s_lt", 448)):
        m = res[s]["metrics"]
        assert "error" not in m, m
        assert m["input_size"] == size and m["latency_ms"] > 0 and m["params_m"] > 1 and "1x3x%dx%d" % (size, size) in m["latency_device"]
    assert res["ft"]["outputs"]["image_size"] == 320
    assert res["ev"]["metrics"]["input_size"] == 320 and res["ev"]["metrics"]["split"] == "valid"


def _export_and_infer(rid, stage, image):
    from modellab import store

    r = subprocess.run([sys.executable, "-m", "modellab.export", rid, stage], cwd=ROOT, capture_output=True, text=True, timeout=1800)
    assert r.returncode == 0, r.stdout[-3000:] + r.stderr[-3000:]
    res = json.loads(next(ln for ln in r.stdout.splitlines() if ln.startswith("EXPORT_RESULT ")).split(" ", 1)[1])
    out = store.run_dir(rid) / "export" / stage
    for f in ("model.onnx", "preprocess.json", "infer_onnx.py", "model_card.md", "model_card.json"):
        assert (out / f).is_file(), f
    assert "not installed" in res["tensorrt"]  # no trtexec in the test environment: ONNX only, said plainly
    inf = subprocess.run([sys.executable, str(out / "infer_onnx.py"), str(image), "0"], capture_output=True, text=True, timeout=600)
    assert inf.returncode == 0, inf.stderr[-3000:]
    rows = [ln.split("\t") for ln in inf.stdout.strip().splitlines()]
    assert rows and all(len(x) == 6 for x in rows)  # class, score, x1, y1, x2, y2
    return res, rows


def test_export_both_families_and_run_the_example(lab, tiny_dataset):
    """Runs after the test above in the same session? No: its own small run (export needs a finished fine-tune)."""
    from modellab import engine

    rid = engine.submit(RECIPE.replace("name: sizes", "name: exp"))[0]
    r = subprocess.run([sys.executable, "-m", "modellab.runner", rid], cwd=ROOT, capture_output=True, text=True, timeout=1800)
    assert r.returncode == 0, r.stdout[-3000:] + r.stderr[-3000:]
    image = next((tiny_dataset / "valid").glob("*.jpg"))
    res, rows = _export_and_infer(rid, "ft", image)
    assert res["input_size"] == 320 and res["model"] == "rfdetr/nano" and res["metrics"]["split"] == "valid"
    assert {x[0] for x in rows} <= set(res["classes"])
    res, rows = _export_and_infer(rid, "lt", image)
    assert res["input_size"] == 256 and res["family"] == "ltdetr"
    bad = subprocess.run([sys.executable, "-m", "modellab.export", rid, "ev"], cwd=ROOT, capture_output=True, text=True)
    assert bad.returncode == 1 and "only fine-tune stages" in bad.stdout
