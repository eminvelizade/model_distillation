"""Distill a DINOv3 ViT teacher into the RF-DETR Nano backbone with LightlyTrain (method="distillation" = v3).

Reads ONLY <data>/train (from make_splits.py) and refuses to run if any train image also
appears in valid/test (by path or md5).

    python distill.py --data data/ds --out runs/distill --smoke          # 1 epoch, 16 images (one batch)
    python distill.py --data data/ds --out runs/distill --epochs 100 --batch-size 64
    python distill.py ... --teacher-model dinov3/vith16plus   # or dinov3/vit7b16 (default dinov3/vitl16)
    python distill.py ... --teacher hf    # teacher from weights/dinov3-vitl16 (run convert_hf_dinov3.py first)

The teacher is held in bf16 (see teacher.py); the student trains with --precision (bf16-mixed on GPU).

Output: <out>/exported_models/exported_last.pt  ({"model": LWDETR state_dict}, loadable via
RFDETRNano(pretrain_weights=...)) and a copy at <out>/rf-detr-nano-distilled.pth.
"""

import offline_guard  # noqa: F401  (must be first)

import argparse
import json
import shutil
from pathlib import Path

IMAGENET_MEAN = (0.485, 0.456, 0.406)
IMAGENET_STD = (0.229, 0.224, 0.225)


def train_images(data: Path) -> list[str]:
    def split_paths(split: str) -> list[Path]:
        d = data / split
        js = json.loads((d / "_annotations.coco.json").read_text())
        return [d / im["file_name"] for im in js["images"]]

    train = split_paths("train")
    held = split_paths("valid") + split_paths("test")
    real = lambda ps: {p.resolve() for p in ps}  # noqa: E731
    overlap = real(train) & real(held)
    manifest = data / "split_manifest.json"
    if manifest.is_file():
        m = json.loads(manifest.read_text())["md5"]
        overlap |= set(m["train"]) & (set(m["valid"]) | set(m["test"]))
    if overlap:
        raise SystemExit(f"train overlaps held-out splits ({len(overlap)} items), refusing to distill")
    missing = [p for p in train if not p.is_file()]
    if missing:
        raise SystemExit(f"{len(missing)} train images missing, e.g. {missing[0]}")
    return [str(p) for p in train]


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--data", type=Path, required=True, help="output dir of make_splits.py")
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--teacher-model", choices=list(offline_guard.TEACHERS), default=offline_guard.TEACHER_NAME,
                   help="DINOv3 teacher (fetch it first: download_weights.sh --teacher-model ...)")
    p.add_argument("--teacher", choices=["name", "hf"], default="name",
                   help="name: --teacher-model from LightlyTrain cache; hf: converted local HF folder (vitl16 only)")
    p.add_argument("--epochs", type=int, default=100)
    p.add_argument("--batch-size", type=int, default=64)
    p.add_argument("--num-workers", default="auto")
    p.add_argument("--image-size", type=int, default=None, help="default: RF-DETR Nano resolution (384)")
    p.add_argument("--precision", default=None, help="default: bf16-mixed on GPU, 32-true on CPU")
    p.add_argument("--accelerator", default="auto")
    p.add_argument("--lr", type=float, default=None, help="AdamW lr before sqrt batch scaling (default 5e-4)")
    p.add_argument("--smoke", action="store_true", help="1 epoch on --smoke-images images")
    p.add_argument("--smoke-images", type=int, default=16)
    p.add_argument("--overwrite", action="store_true")
    a = p.parse_args()

    import torch
    import lightly_train
    from lightly_train._methods.distillationv3 import distillationv3
    from rfdetr import RFDETRNano

    import teacher

    images = train_images(a.data)
    if a.smoke:  # on GPU use e.g. --smoke-images 256 --batch-size 64 to test real memory use
        images = images[: a.smoke_images]
        a.epochs = 1
        a.batch_size = min(a.batch_size, len(images))
    print(f"[distill] {len(images)} train images, held-out splits excluded")

    gpu = torch.cuda.is_available() and a.accelerator in ("auto", "gpu", "cuda")
    device = "cuda" if gpu else "cpu"
    precision = a.precision or ("bf16-mixed" if gpu else "32-true")

    student = RFDETRNano(pretrain_weights=str(offline_guard.require_file(offline_guard.NANO_WEIGHTS)), device=device)
    size = a.image_size or student.model_config.resolution
    patch, windows = student.model_config.patch_size, student.model_config.num_windows
    if size % (patch * windows):
        raise SystemExit(f"image size {size} must be divisible by patch*num_windows={patch * windows}")

    method_args = {"teacher": a.teacher_model}
    if a.teacher == "name":
        offline_guard.require_file(offline_guard.teacher_cache_file(a.teacher_model))
    else:
        if a.teacher_model != "dinov3/vitl16":
            raise SystemExit("--teacher hf is only available for dinov3/vitl16 (convert_hf_dinov3.py is ViT-L/16 only)")
        # load_weights=False path: architecture from name, weights from the converted HF checkpoint.
        method_args["teacher_weights"] = str(offline_guard.require_file(offline_guard.HF_TEACHER_CONVERTED))

    # LightlyTrain builds the teacher in fp32; hold it in bf16 and hand fp32 features to the loss.
    get_teacher = distillationv3.get_teacher

    def get_bf16_teacher(*args, **kwargs):
        wrapped = teacher.to_bf16(get_teacher(*args, **kwargs))
        forward_features = wrapped.forward_features
        wrapped.forward_features = lambda *a_, **k_: {k: v.float() for k, v in forward_features(*a_, **k_).items()}
        print(f"[distill] teacher {a.teacher_model} ({a.teacher}) in {next(wrapped.parameters()).dtype}")
        return wrapped

    distillationv3.get_teacher = get_bf16_teacher

    lightly_train.pretrain(
        out=str(a.out),
        data=images,
        model=student,
        method="distillation",
        method_args=method_args,
        epochs=a.epochs,
        batch_size=a.batch_size,
        num_workers=a.num_workers if a.num_workers == "auto" else int(a.num_workers),
        devices=1,
        accelerator=a.accelerator,
        precision=precision,
        optim_args={"lr": a.lr} if a.lr else None,
        transform_args={
            "image_size": (size, size),
            "normalize": {"mean": IMAGENET_MEAN, "std": IMAGENET_STD},
        },
        overwrite=a.overwrite or a.smoke,
    )

    exported = a.out / "exported_models" / "exported_last.pt"
    final = a.out / "rf-detr-nano-distilled.pth"
    shutil.copy2(exported, final)
    print(f"[distill] done -> {final}")
    offline_guard.assert_no_network_attempts()


if __name__ == "__main__":
    main()
