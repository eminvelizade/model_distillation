"""Fast ModelLab tests (no training): recipes, eval metric code, dataset hashing, store, comparability, API."""

import json
import shutil
from pathlib import Path

import pytest

from conftest import ROOT

CHAIN = (ROOT / "tests/modellab/recipes/tiny_chain.yaml").read_text()


# ---------- recipes ----------

def test_templates_and_test_recipes_validate(lab):
    from modellab import datasets, recipe

    known = set(datasets._load())
    for f in [*sorted((ROOT / "recipes").glob("*.yaml")), *sorted((ROOT / "tests/modellab/recipes").glob("*.yaml"))]:
        plans, errors = recipe.plan(f.read_text(), known)
        assert not errors, (f.name, errors)
    plans, _ = recipe.plan((ROOT / "recipes/1_teacher_size_sweep.yaml").read_text(), known)
    assert [p.matrix_values["teacher"] for p in plans] == ["dinov3/vits16", "dinov3/vitb16", "dinov3/vitl16", "dinov3/vith16plus"]
    assert plans[1].stages[0]["teacher"] == "dinov3/vitb16" and "${" not in json.dumps(plans[1].recipe)


@pytest.mark.parametrize("stages, needle", [
    ([{"name": "e", "type": "eval", "model": {"from": "nope"}}], "is not an earlier stage"),
    ([{"name": "e", "type": "eval", "model": "rfdetr/nano"}, {"name": "f", "type": "finetune", "model": "rfdetr/nano", "init": {"from": "e"}}], "produces metrics"),
    ([{"name": "d", "type": "distill", "student": "rfdetr/nano", "teacher": {"from": "f"}}], "is not an earlier stage"),
    ([{"name": "f", "type": "finetune", "model": "rfdetr/nano"}, {"name": "d", "type": "distill", "student": "rfdetr/nano", "teacher": {"from": "f"}}], "produces rfdetr_ckpt"),
    ([{"name": "f", "type": "finetune", "model": "ltdetr/dinov3-convnext-tiny-coco"}, {"name": "d", "type": "distill", "teacher": {"from": "f"}}], "no DINOv3 ViT backbone"),
    ([{"name": "d", "type": "distill", "teacher": "dinov2/vitb14", "image_size": 384}], "multiple of 224"),
    ([{"name": "f", "type": "finetune", "model": "rfdetr/small"}, {"name": "d", "type": "distill", "student": "rfdetr/nano", "init": {"from": "f"}, "teacher": "dinov3/vitl16"}], "is rfdetr/small, student is rfdetr/nano"),
    ([{"name": "a", "type": "eval", "model": "rfdetr/nano"}, {"name": "a", "type": "eval", "model": "rfdetr/nano"}], "duplicate"),
    ([{"name": "x", "type": "train"}], "type must be one of"),
    ([{"name": "f", "type": "finetune", "model": "rfdetr/nano", "budget": {"hours": 2}}], "budget must be"),
])
def test_recipe_errors(lab, stages, needle):
    from modellab import recipe

    _, errors = recipe.plan({"name": "t", "dataset": "tiny", "stages": stages}, {"tiny"})
    assert any(needle in e for e in errors), errors


def test_recipe_defaults(lab):
    from modellab import recipe

    plans, errors = recipe.plan({"name": "t", "dataset": "tiny", "stages": [
        {"name": "d", "type": "distill", "teacher": "dinov2/vits14"},
        {"name": "d2", "type": "distill", "student": "rfdetr/medium", "teacher": "dinov3/vitl16", "budget": {"minutes": 5}},
        {"name": "f", "type": "finetune", "model": "ltdetr/dinov3-vits16-coco"}]}, {"tiny"})
    assert not errors
    d, d2, f = plans[0].stages
    assert d["image_size"] == 448 and d2["image_size"] == 576 and f["image_size"] == 384
    assert d2["budget"] == {"epochs": 30, "minutes": 5, "epochs_given": False}
    assert any("minutes-only" in w for w in plans[0].warnings)
    _, errors = recipe.plan({"name": "t", "dataset": "nope", "stages": [{"name": "e", "type": "eval", "model": "rfdetr/nano"}]}, {"tiny"})
    assert any("unknown dataset" in e for e in errors)


# ---------- eval metric code ----------

def _gt():
    return {"images": [{"id": i, "width": 100, "height": 100} for i in range(3)],
            "categories": [{"id": 1, "name": "car"}, {"id": 2, "name": "bus"}],
            "annotations": [{"id": 0, "image_id": 0, "category_id": 1, "bbox": [10, 10, 30, 30]},
                            {"id": 1, "image_id": 1, "category_id": 2, "bbox": [50, 50, 40, 40]},
                            {"id": 2, "image_id": 2, "category_id": 1, "bbox": [5, 5, 80, 80]}]}


def test_coco_eval_perfect_empty_and_wrong():
    from modellab.evaluate import coco_eval

    gt = _gt()
    perfect = [{"image_id": a["image_id"], "category_id": a["category_id"], "bbox": a["bbox"], "score": 0.9} for a in gt["annotations"]]
    r = coco_eval(gt, perfect)
    assert r["map"] == pytest.approx(1.0) and r["map50"] == pytest.approx(1.0) and r["per_class"] == pytest.approx({"car": 1.0, "bus": 1.0})
    assert coco_eval(gt, [])["map"] == 0.0
    wrong_cls = [dict(d, category_id=3 - d["category_id"]) for d in perfect]
    assert coco_eval(gt, wrong_cls)["map"] == 0.0
    shifted = [dict(d, bbox=[d["bbox"][0] + d["bbox"][2] * 0.3, d["bbox"][1], d["bbox"][2], d["bbox"][3]]) for d in perfect]
    r = coco_eval(gt, shifted)
    assert 0 < r["map"] < 1 and r["map50"] == pytest.approx(1.0)  # IoU ~0.54: counted at .5, not at .75


def test_eval_version_tracks_source():
    from modellab import evaluate

    v = evaluate.eval_version()
    assert v.startswith(evaluate.EVAL_VERSION + "+") and len(v.split("+")[1]) == 10


# ---------- datasets ----------

def test_split_hash_ignores_paths_but_sees_content(lab, tiny_dataset, tmp_path):
    from modellab import datasets

    h = datasets.split_hash(tiny_dataset, "test")
    moved = tmp_path / "moved"
    shutil.copytree(tiny_dataset, moved)
    (moved / ".modellab_hash.json").unlink(missing_ok=True)
    assert datasets.split_hash(moved, "test") == h  # same content elsewhere -> same hash
    f = moved / "test" / "_annotations.coco.json"
    d = json.loads(f.read_text())
    d["annotations"][0]["bbox"][0] += 5
    f.write_text(json.dumps(d))
    assert datasets.split_hash(moved, "test") != h
    info = datasets.info("tiny")
    assert info["classes"] == ["car", "truck", "bus"] and set(info["hash"]) == {"train", "valid", "test", "all"}


def test_dataset_add_rejects_bad_layout(lab, tmp_path):
    from modellab import datasets

    (tmp_path / "bad" / "train").mkdir(parents=True)
    with pytest.raises(FileNotFoundError):
        datasets.add("bad", tmp_path / "bad")


# ---------- store / queue state ----------

def test_store_queue_requeue_cancel(lab):
    from modellab import engine, store

    a, = engine.submit(CHAIN)
    b, = engine.submit(CHAIN)
    assert [r["id"] for r in store.queue()] == [a, b]
    got = store.claim_next()
    assert got["id"] == a and store.get_run(a)["status"] == "running"
    store.update_stage(a, "teacher_ft", status="done")
    store.update_stage(a, "distill", status="failed")
    store.update_run(a, status="failed")
    store.requeue(a)
    st = {s["name"]: s["status"] for s in store.get_run(a)["stages"]}
    assert store.get_run(a)["status"] == "queued" and st["teacher_ft"] == "done" and st["distill"] == "pending"
    assert store.request_cancel(b) == "cancelled" and store.get_run(b)["status"] == "cancelled"
    rd = store.run_dir(a)
    assert (rd / "recipe.yaml").is_file() and json.loads((rd / "resolved.json").read_text())["stages"][0]["name"] == "teacher_ft"


# ---------- API ----------

@pytest.fixture()
def client(lab):
    from fastapi.testclient import TestClient

    from modellab.server import app

    return TestClient(app)


def _fake_result(run_id, stage, **kw):
    from modellab import store

    base = {"label": stage, "model": "rfdetr/nano", "family": "rfdetr", "dataset": "tiny", "split": "test",
            "dataset_hash": "h1", "eval_version": "1+aaaa", "map": 0.5, "map50": 0.7, "latency_ms": 2.0,
            "latency_device": "GPU fp16", "per_class": {"car": 0.5}}
    store.save_result(run_id, stage, {**base, **kw})


def test_api_catalog_preview_submit_and_compare(client):
    cat = client.get("/api/catalog").json()
    assert {t["id"] for t in cat["templates"]} >= {"1_teacher_size_sweep", "4_baseline_stock_vs_finetuned"}
    assert "rfdetr/nano" in cat["students"] and any(t["id"] == "dinov3/vitl16" for t in cat["teachers"])
    assert not any(t["id"].endswith("notpretrained") for t in cat["teachers"])  # test-only entries hidden
    p = client.post("/api/recipes/preview", json={"yaml": CHAIN}).json()
    assert p["ok"] and p["runs"][0]["stages"][1]["name"] == "distill"
    bad = client.post("/api/recipes/preview", json={"yaml": "name: x\nstages: []"}).json()
    assert not bad["ok"]
    assert client.post("/api/recipes/parse", json={"yaml": CHAIN}).json()["recipe"]["name"] == "tiny-chain"
    assert client.post("/api/runs", json={"yaml": "name: x\nstages: []"}).status_code == 422
    ids = client.post("/api/runs", json={"yaml": CHAIN}).json()["run_ids"]
    front = client.post("/api/runs", json={"yaml": CHAIN, "position": "front"}).json()["run_ids"]
    q = client.get("/api/queue").json()["runs"]
    assert [r["id"] for r in q] == front + ids  # "Run next" jumps the queue

    a, b = ids[0], front[0]
    _fake_result(a, "eval")
    _fake_result(b, "eval", map=0.6)
    c = client.get(f"/api/compare?items={a}:eval,{b}:eval").json()
    assert c["comparable"] and not c["warnings"]
    _fake_result(b, "eval", eval_version="2+bbbb")
    c = client.get(f"/api/compare?items={a}:eval,{b}:eval").json()
    assert not c["comparable"] and any("eval code" in w for w in c["warnings"])
    _fake_result(b, "eval", dataset_hash="h2")
    c = client.get(f"/api/compare?items={a}:eval,{b}:eval").json()
    assert any("different data" in w for w in c["warnings"])
    rows = client.get("/api/results").json()["rows"]
    assert {r["eval_key"] for r in rows} == {"1+aaaa|tiny|test|h1", "1+aaaa|tiny|test|h2"}

    assert client.patch(f"/api/runs/{a}", json={"tags": ["x"], "notes": "hello"}).json()["notes"] == "hello"
    assert client.post(f"/api/runs/{a}/cancel").json()["result"] == "cancelled"
    assert client.post(f"/api/runs/{a}/requeue").json()["result"] == "queued"
    assert client.get(f"/api/runs/{a}").json()["recipe_yaml"].startswith("name: tiny-chain")
    assert client.get("/api/runs/x/file/../../etc/passwd").status_code == 404
    assert client.get("/api/gpu").json()["available"] in (True, False)


def test_ui_is_served_without_external_assets(client):
    html = client.get("/").text
    assert '<div id="root">' in html and "http" not in html.replace("http-equiv", "")
    js = next((ROOT / "modellab/web/dist/assets").glob("*.js")).read_text()
    assert "fonts.googleapis" not in js and "cdn." not in js
    assert client.get("/leaderboard").status_code == 200  # SPA fallback


# ---------- rfdetr input pipeline (regression: transforms were silently dropped -> native-size images) ----------

CHECK_PIPELINE = r"""
import json, sys
import offline_guard
from modellab import preflight
version = preflight.ensure_rfdetr_transforms()   # selects vendored albumentations BEFORE importing rfdetr
from pathlib import Path
from rfdetr.datasets.coco import CocoDetection, make_coco_transforms_square_div_64
root = Path(sys.argv[1]); out = {"albumentations": version}
for split, kind in (("valid", "val"), ("train", "train")):
    t = make_coco_transforms_square_div_64(kind, 384, multi_scale=True, expanded_scales=True, skip_random_resize=True,
                                           patch_size=16, num_windows=2)
    ds = CocoDetection(root / split, root / split / "_annotations.coco.json", transforms=t, remap_category_ids=True)
    samples = [ds[i] for i in range(len(ds))]
    out[kind] = sorted({tuple(s[0].shape) for s in samples})
    out[kind + "_boxes_ok"] = all(((s[1]["boxes"] >= 0) & (s[1]["boxes"] <= 1)).all().item() for s in samples if len(s[1]["boxes"]))
print("RESULT " + json.dumps(out))
"""


def test_rfdetr_transforms_build_and_resize_non_aligned_images(lab, tiny_dataset):
    """The tiny dataset has COCO-like sizes (640x612, 500x375, ...: NOT multiples of 32). In a process that selects the
    rfdetr-compatible albumentations, every val/train sample must come out as a square multiple of 32."""
    import subprocess
    import sys

    sizes = {(im["width"], im["height"]) for im in json.loads((tiny_dataset / "valid" / "_annotations.coco.json").read_text())["images"]}
    assert any(w % 32 or h % 32 for w, h in sizes), sizes  # the fixture must really contain unaligned images
    r = subprocess.run([sys.executable, "-c", CHECK_PIPELINE, str(tiny_dataset)], cwd=ROOT, capture_output=True, text=True)
    assert r.returncode == 0, r.stderr[-2000:]
    out = json.loads(next(l for l in r.stdout.splitlines() if l.startswith("RESULT ")).removeprefix("RESULT "))
    assert out["albumentations"].startswith("1.4.")
    assert out["val"] == [[3, 384, 384]] and out["train"] == [[3, 544, 544]], out
    assert out["val_boxes_ok"] and out["train_boxes_ok"]


def test_environment_albumentations_for_lightlytrain_is_unchanged():
    """LightlyTrain stages must keep the pip-resolved 1.3.1 (1.4.* crashes LT-DETR); only rfdetr training uses vendor/."""
    import albumentations

    assert albumentations.__version__ == "1.3.1", albumentations.__version__


def test_compat_refuses_when_albumentations_already_imported(lab):
    """In a process where albumentations 1.3.1 is already loaded, selecting 1.4.x is impossible: must fail loudly."""
    from modellab import compat

    with pytest.raises(RuntimeError, match="rfdetr needs albumentations"):
        compat.use_rfdetr_albumentations()
