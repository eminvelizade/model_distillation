"""What ModelLab can run: detector models, distillation teachers, and the weight files they need.

Everything here was checked against lightly-train 0.17.0 / rfdetr 1.5.2 (docs/MODELLAB_VERIFICATION.md).
Weight files carry an MD5 or SHA-256 so `modellab weights fetch` can verify them and the offline PC can check them.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import offline_guard

S3 = "https://lightly-train-checkpoints.s3.us-east-1.amazonaws.com"
RFDETR_GCS = "https://storage.googleapis.com/rfdetr"
FB_DINOV2 = "https://dl.fbaipublicfiles.com/dinov2"


@dataclass(frozen=True)
class WeightFile:
    key: str  # catalog id
    dest: str  # path relative to the project root
    url: str
    md5: str | None = None
    sha256: str | None = None
    size: int | None = None
    note: str = ""


@dataclass(frozen=True)
class Detector:
    id: str
    family: str  # "rfdetr" | "ltdetr"
    label: str
    resolution: int  # native input size (square)
    divisor: int  # input size must be a multiple of this
    weights: tuple[str, ...] = ()  # WeightFile keys needed to build it with stock weights
    rfdetr_class: str | None = None  # rfdetr
    lightly_name: str | None = None  # ltdetr: LightlyTrain model name
    dinov3_arch: str | None = None  # ltdetr ViT backbone usable as distillation teacher (teacher name)
    backbone: str = ""
    hidden: bool = False  # test-only entries are not shown in the UI


@dataclass(frozen=True)
class Teacher:
    id: str
    label: str
    dim: int
    patch: int
    weights: tuple[str, ...] = ()
    params_m: float = 0.0
    hidden: bool = False
    tags: tuple[str, ...] = field(default_factory=tuple)


def _dinov3_file(arch: str, md5: str, size: int | None = None) -> WeightFile:
    f = f"dinov3_{arch}_lvd1689m.pth"
    return WeightFile(f"dinov3/{arch}", f"cache/lightly-train/models/{f}", f"{S3}/dinov3/{f}", md5=md5, size=size)


def _dinov2_file(arch: str, md5: str, size: int) -> WeightFile:
    f = f"dinov2_{arch}_reg4_pretrain.pth"
    return WeightFile(f"dinov2/{arch}", f"cache/lightly-train/models/{f}", f"{FB_DINOV2}/dinov2_{arch}/{f}", md5=md5, size=size,
                      note="md5 computed from a full download whose S3 multipart ETag matched")


_TG = offline_guard.TEACHERS  # dinov3 teacher MD5s already used by distill.py / download_weights.sh
WEIGHTS: dict[str, WeightFile] = {w.key: w for w in [
    # RF-DETR COCO detectors (MD5s from rfdetr 1.5.2's ModelWeights registry, also GCS x-goog-hash).
    WeightFile("rfdetr/nano", "weights/rf-detr-nano.pth", f"{RFDETR_GCS}/nano_coco/checkpoint_best_regular.pth",
               md5="fb6504cce7fbdc783f7a46991f07639f"),
    WeightFile("rfdetr/small", "weights/rf-detr-small.pth", f"{RFDETR_GCS}/small_coco/checkpoint_best_regular.pth",
               md5="fb37061c1af7bace359c91b723a8d5c1", size=386045550),
    WeightFile("rfdetr/medium", "weights/rf-detr-medium.pth", f"{RFDETR_GCS}/medium_coco/checkpoint_best_regular.pth",
               md5="7223f764a87b863f02eb8d52bf0ce2ee", size=404992918),
    WeightFile("rfdetr/large", "weights/rf-detr-large-2026.pth", f"{RFDETR_GCS}/rf-detr-large-2026.pth",
               md5="5cb72153541cbcb9aa6efa26222acc75", size=135954129),
    # DINOv3 backbones / teachers (S3 single-part ETag = MD5, or computed, see offline_guard).
    _dinov3_file("vits16", "56187a1b9ae31e9e57272381c5fd5812", 86531063),
    _dinov3_file("vitb16", "3843a030991de9939ee2c15f68f4f834", 342860279),
    _dinov3_file("vitl16", _TG["dinov3/vitl16"][2], 1213050671),
    _dinov3_file("vith16plus", _TG["dinov3/vith16plus"][2], 3363232567),
    _dinov3_file("vit7b16", _TG["dinov3/vit7b16"][2], 26864407683),
    WeightFile("dinov3/vitt16", "cache/lightly-train/models/dinov3_vitt16_distillationv2.pth",
               f"{S3}/dinov3/dinov3_vitt16_distillationv2.pth", md5="8e303d6deea88a26fa1f19c58ecc64ca", size=22061011,
               note="LightlyTrain's distilled ViT-T backbone (used by the tiny LT-DETRs); md5 computed, size matches S3"),
    # DINOv2 teachers (with registers).
    _dinov2_file("vits14", "2a50c5e0f06dad446c6a2932b8e07d33", 88291785),
    _dinov2_file("vitb14", "13d13c7ba67434c75e9f06b5cf2e4ac9", 346393545),
    _dinov2_file("vitl14", "8b6364823d00998f119cf5ad0d6c0847", 1217607321),
    _dinov2_file("vitg14", "9e99cc4b71b360ad1083c3f04858bf68", 4546140349),
]}


def _ltdetr_ckpt(lightly_name: str) -> WeightFile:
    """COCO-pretrained LT-DETR checkpoint: file name + SHA-256 come from LightlyTrain's own registry."""
    from lightly_train._task_models.task_model_helpers import DOWNLOADABLE_MODEL_URL_AND_HASH

    fname, sha = DOWNLOADABLE_MODEL_URL_AND_HASH[lightly_name]
    return WeightFile(f"ltdetr-ckpt/{lightly_name}", f"cache/lightly-train/models/{fname}", f"{S3}/{fname}", sha256=sha)


_RF = [("nano", "RFDETRNano", 384, "Nano"), ("small", "RFDETRSmall", 512, "Small"),
       ("medium", "RFDETRMedium", 576, "Medium"), ("large", "RFDETRLarge", 704, "Large (2026)")]
DETECTORS: dict[str, Detector] = {}
for _k, _cls, _res, _lab in _RF:
    DETECTORS[f"rfdetr/{_k}"] = Detector(f"rfdetr/{_k}", "rfdetr", f"RF-DETR {_lab}", _res, 32, (f"rfdetr/{_k}",),
                                         rfdetr_class=_cls, backbone="DINOv2-S windowed")
for _id, _name, _arch, _w, _lab, _hidden in [
    # COCO-pretrained LT-DETRs (detector checkpoint downloaded by name; backbone weights come from it).
    ("ltdetr/dinov3-vitt16-coco", "dinov3/vitt16-ltdetr-coco", "dinov3/vitt16", ("ltdetr-ckpt/dinov3/vitt16-ltdetr-coco", "dinov3/vitt16"), "LT-DETR DINOv3 ViT-T/16 (COCO)", False),
    ("ltdetr/dinov3-vits16-coco", "dinov3/vits16-ltdetr-coco", "dinov3/vits16", ("ltdetr-ckpt/dinov3/vits16-ltdetr-coco", "dinov3/vits16"), "LT-DETR DINOv3 ViT-S/16 (COCO)", False),
    ("ltdetr/dinov3-convnext-tiny-coco", "dinov3/convnext-tiny-ltdetr-coco", None, ("ltdetr-ckpt/dinov3/convnext-tiny-ltdetr-coco",), "LT-DETR DINOv3 ConvNeXt-T (COCO)", False),
    # DINOv3 backbone (LVD-1689M), detection head trained from scratch on your data.
    ("ltdetr/dinov3-vitb16", "dinov3/vitb16-ltdetr", "dinov3/vitb16", ("dinov3/vitb16",), "LT-DETR DINOv3 ViT-B/16 (backbone only)", False),
    ("ltdetr/dinov3-vitl16", "dinov3/vitl16-ltdetr", "dinov3/vitl16", ("dinov3/vitl16",), "LT-DETR DINOv3 ViT-L/16 (backbone only)", False),
    # Tiny test model (CPU tests only).
    ("ltdetr/dinov3-vitt16-test", "dinov3/vitt16-notpretrained-ltdetr", "dinov3/vitt16-notpretrained", ("dinov3/vitt16",), "LT-DETR tiny (test)", True),
]:
    DETECTORS[_id] = Detector(_id, "ltdetr", _lab, 384, 32, _w, lightly_name=_name, dinov3_arch=_arch,
                              backbone=(_arch or "dinov3/convnext-tiny"), hidden=_hidden)

TEACHERS: dict[str, Teacher] = {t.id: t for t in [
    Teacher("dinov3/vits16", "DINOv3 ViT-S/16", 384, 16, ("dinov3/vits16",), 21),
    Teacher("dinov3/vitb16", "DINOv3 ViT-B/16", 768, 16, ("dinov3/vitb16",), 86),
    Teacher("dinov3/vitl16", "DINOv3 ViT-L/16", 1024, 16, ("dinov3/vitl16",), 300),
    Teacher("dinov3/vith16plus", "DINOv3 ViT-H+/16", 1280, 16, ("dinov3/vith16plus",), 840),
    Teacher("dinov3/vit7b16", "DINOv3 ViT-7B/16", 4096, 16, ("dinov3/vit7b16",), 6716),
    Teacher("dinov2/vits14", "DINOv2 ViT-S/14 (reg)", 384, 14, ("dinov2/vits14",), 22),
    Teacher("dinov2/vitb14", "DINOv2 ViT-B/14 (reg)", 768, 14, ("dinov2/vitb14",), 86),
    Teacher("dinov2/vitl14", "DINOv2 ViT-L/14 (reg)", 1024, 14, ("dinov2/vitl14",), 300),
    Teacher("dinov2/vitg14", "DINOv2 ViT-g/14 (reg)", 1536, 14, ("dinov2/vitg14",), 1100),
    # Random-init tiny teachers for CPU tests (no weight file needed).
    Teacher("dinov3/vitt16-notpretrained", "DINOv3 ViT-T (random, test)", 192, 16, (), 6, hidden=True),
    Teacher("dinov2/vits14-notpretrained", "DINOv2 ViT-S (random, test)", 384, 14, (), 22, hidden=True),
]}


def weight_file(key: str) -> WeightFile:
    if key in WEIGHTS:
        return WEIGHTS[key]
    if key.startswith("ltdetr-ckpt/"):
        return _ltdetr_ckpt(key.removeprefix("ltdetr-ckpt/"))
    raise KeyError(f"unknown weight file {key!r}")


def all_weight_keys() -> list[str]:
    keys = list(WEIGHTS)
    for d in DETECTORS.values():
        keys += [k for k in d.weights if k not in keys]
    return keys


def detector(model_id: str) -> Detector:
    if model_id not in DETECTORS:
        raise KeyError(f"unknown model {model_id!r}; known: {', '.join(k for k, v in DETECTORS.items() if not v.hidden)}")
    return DETECTORS[model_id]


def teacher(teacher_id: str) -> Teacher:
    if teacher_id not in TEACHERS:
        raise KeyError(f"unknown teacher {teacher_id!r}; known: {', '.join(k for k, v in TEACHERS.items() if not v.hidden)}")
    return TEACHERS[teacher_id]


def public_catalog() -> dict:
    """For the UI dropdowns."""
    return {
        "detectors": [{"id": d.id, "family": d.family, "label": d.label, "resolution": d.resolution,
                       "backbone": d.backbone, "teacher_capable": bool(d.dinov3_arch), "hidden": d.hidden}
                      for d in DETECTORS.values()],  # hidden (test) entries: for lookups, not for menus
        "students": [d.id for d in DETECTORS.values() if d.family == "rfdetr"],
        "teachers": [{"id": t.id, "label": t.label, "dim": t.dim, "patch": t.patch, "params_m": t.params_m}
                     for t in TEACHERS.values() if not t.hidden],
    }
