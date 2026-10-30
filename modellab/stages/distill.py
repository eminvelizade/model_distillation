"""distill: LightlyTrain DistillationV3, teacher (bf16) -> RF-DETR encoder. Reuses distill.py's leakage-checked
train split and teacher.py's bf16 teacher. Output: checkpoint.pth = {"model": LWDETR state_dict} (stock decoder,
distilled encoder), loadable with RFDETR<Size>(pretrain_weights=...)."""

from __future__ import annotations

import shutil


def run(ctx):
    import lightly_train
    import rfdetr

    import teacher as teacher_lib
    from distill import IMAGENET_MEAN, IMAGENET_STD, train_images
    from modellab import catalog, hooks

    st = ctx.st
    det = catalog.detector(st["student"])
    images = train_images(ctx.dataset())
    ctx.log(f"{len(images)} train images (held-out splits excluded)")

    src = ctx.input(st["init"]) if isinstance(st["init"], dict) else {}
    init = src.get("checkpoint") or ctx.stock_weights(det.id)
    student = getattr(rfdetr, det.rfdetr_class)(pretrain_weights=str(init), device=ctx.device)

    if isinstance(st["teacher"], dict):  # fine-tuned DINOv3 backbone from an earlier LT-DETR stage
        method_args = {"teacher": st["teacher_arch"], "teacher_weights": ctx.input(st["teacher"])["backbone"]}
    else:
        ctx.require_teacher(st["teacher"])
        method_args = {"teacher": st["teacher"]}
    ctx.log(f"student {det.id} init={init}; teacher {method_args}; image_size {st['image_size']}")

    teacher_lib.patch_lightly_get_teacher(ctx.log)
    budget = st["budget"]
    hooks.lightning(ctx.progress, budget.get("minutes"))
    gpu = ctx.device == "cuda"
    out = ctx.dir / "lightly"
    lightly_train.pretrain(
        out=str(out), data=images, model=student, method="distillation", method_args=method_args,
        epochs=budget["epochs"], batch_size=min(st["batch_size"], len(images)), num_workers=ctx.num_workers(),
        devices=1, accelerator="gpu" if gpu else "cpu", precision="bf16-mixed" if gpu else "32-true",
        seed=st["seed"], optim_args={"lr": st["lr"]} if st.get("lr") else None,
        transform_args={"image_size": (st["image_size"], st["image_size"]),
                        "normalize": {"mean": IMAGENET_MEAN, "std": IMAGENET_STD}},
        overwrite=True,
    )
    shutil.move(out / "exported_models" / "exported_last.pt", ctx.dir / "checkpoint.pth")
    if not st.get("keep_lightly_checkpoints"):
        shutil.rmtree(out / "checkpoints", ignore_errors=True)  # last.ckpt also holds the teacher: GBs
    outputs = {"checkpoint": "checkpoint.pth", "model": det.id}
    if src.get("classes"):  # distillation keeps the decoder: the init's class head (and label names) carry over
        shutil.copy2(src["classes"], ctx.dir / "classes.json")
        outputs["classes"] = "classes.json"
    return outputs, {"train_images": len(images), "stopped_by_time_budget": ctx.progress.expired()}
