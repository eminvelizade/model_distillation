"""finetune: supervised detection fine-tuning on the dataset's train split (valid for checkpoint selection).

RF-DETR: rfdetr's own trainer (`RFDETR<Size>.train`), native resolution, best checkpoint on valid (EMA/regular,
"best_total"). LT-DETR: LightlyTrain `train_object_detection` on the same Roboflow-layout split with
gradient_accumulation_steps=1 and steps = epochs * ceil(n_train / batch_size), so one epoch means the same number of
images for both families. For a DINOv3 ViT LT-DETR the fine-tuned backbone is also saved as backbone.pt (state
dict of the DINOv3 ViT) so a later distill stage can use it as teacher (`teacher: {from: <this stage>}`).
"""

from __future__ import annotations

import json
import math
import shutil


def _n_train(ds) -> int:
    return len(json.loads((ds / "train" / "_annotations.coco.json").read_text())["images"])


def run(ctx):
    from modellab import catalog

    det = catalog.detector(ctx.st["model"])
    return (_rfdetr if det.family == "rfdetr" else _ltdetr)(ctx, det)


def _rfdetr(ctx, det):
    import rfdetr

    from modellab import hooks

    st, ds = ctx.st, ctx.dataset()
    init = ctx.input(st["init"])["checkpoint"] if isinstance(st["init"], dict) else ctx.stock_weights(det.id)
    rf = getattr(rfdetr, det.rfdetr_class)(pretrain_weights=str(init), device=ctx.device)
    n = _n_train(ds)
    bs, accum, epochs = int(st["batch_size"]), int(st.get("grad_accum", 1)), st["budget"]["epochs"]
    hooks.rfdetr_callbacks(rf, ctx.progress, epochs, math.ceil(n / bs))
    ctx.log(f"{det.id} init={init} train_images={n} epochs={epochs} batch={bs}x{accum}")
    out = ctx.dir / "rfdetr"
    kw = dict(dataset_dir=str(ds), output_dir=str(out), epochs=epochs, batch_size=bs, grad_accum_steps=accum,
              num_workers=ctx.num_workers(), seed=st["seed"], device=ctx.device, run_test=False, tensorboard=False,
              wandb=False, early_stopping=False)
    if st.get("lr"):
        kw["lr"] = st["lr"]
    if st.get("lr_encoder"):
        kw["lr_encoder"] = st["lr_encoder"]
    rf.train(**kw)
    best = out / "checkpoint_best_total.pth"
    shutil.move(best if best.is_file() else out / "checkpoint.pth", ctx.dir / "checkpoint.pth")
    for f in ("checkpoint.pth", "checkpoint_best_regular.pth", "checkpoint_best_ema.pth"):  # GBs of optimizer state
        if not st.get("keep_rfdetr_checkpoints"):
            (out / f).unlink(missing_ok=True)
    from modellab import evaluate

    (ctx.dir / "classes.json").write_text(json.dumps(evaluate.label_names(ds / "train" / "_annotations.coco.json")))
    return ({"checkpoint": "checkpoint.pth", "model": det.id, "classes": "classes.json"},
            {"train_images": n, "stopped_by_time_budget": ctx.progress.expired()})


def _ltdetr(ctx, det):
    import lightly_train
    import torch

    from modellab import hooks

    st, ds = ctx.st, ctx.dataset()
    n = _n_train(ds)
    bs = int(st["batch_size"])
    steps = st["budget"]["epochs"] * math.ceil(n / bs)
    init = ctx.input(st["init"])["checkpoint"] if isinstance(st["init"], dict) else None
    if init is None:
        for k in det.weights:  # offline: every needed file must already be in the cache
            from modellab import weights

            if weights.missing([k]):
                raise FileNotFoundError(f"weights {k} missing. Online: modellab weights fetch {det.id}")
    hooks.lightly_task_loop(ctx.progress)
    gpu = ctx.device == "cuda"
    out = ctx.dir / "lightly"
    ctx.log(f"{det.id} ({det.lightly_name}) init={init or 'stock'} train_images={n} steps={steps} batch={bs} "
            f"image_size={st['image_size']}")
    lightly_train.train_object_detection(
        out=str(out), model=init or det.lightly_name,
        data={"format": "coco", "train": {"annotations": str(ds / "train" / "_annotations.coco.json")},
              "val": {"annotations": str(ds / "valid" / "_annotations.coco.json")}},
        steps=steps, batch_size=bs, num_workers=ctx.num_workers(), devices=1, accelerator="gpu" if gpu else "cpu",
        precision="bf16-mixed" if gpu else "32-true", seed=st["seed"], gradient_accumulation_steps=1,
        transform_args={"image_size": (st["image_size"], st["image_size"])}, overwrite=True,
        **({"model_args": {"lr": st["lr"]}} if st.get("lr") else {}),
    )
    exp = out / "exported_models"
    src = exp / "exported_best.pt" if (exp / "exported_best.pt").is_file() else exp / "exported_last.pt"
    shutil.move(src, ctx.dir / "checkpoint.pt")
    outputs = {"checkpoint": "checkpoint.pt", "model": det.id}
    if det.dinov3_arch:
        m = lightly_train.load_model(str(ctx.dir / "checkpoint.pt"), device="cpu")
        vit = m.backbone._model_wrapper.get_model()
        torch.save({k: v.float() for k, v in vit.state_dict().items()}, ctx.dir / "backbone.pt")
        outputs.update(backbone="backbone.pt", teacher_arch=det.dinov3_arch)
        ctx.log(f"saved fine-tuned {det.dinov3_arch} backbone ({len(vit.state_dict())} tensors) as teacher candidate")
    if not st.get("keep_lightly_checkpoints"):
        shutil.rmtree(out / "checkpoints", ignore_errors=True)
        shutil.rmtree(exp, ignore_errors=True)  # the other exported model (best is kept as checkpoint.pt)
    return outputs, {"train_images": n, "steps": steps, "selected": src.name, "stopped_by_time_budget": ctx.progress.expired()}
