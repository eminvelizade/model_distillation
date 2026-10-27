"""DINOv3 / DINOv2 teacher in bf16, shared by distill.py, compare_features.py, check_offline.py and ModelLab.

The teacher is frozen, so its weights are stored in bf16 (half the memory of fp32: ViT-7B ~13.4 GB
instead of ~27 GB on the GPU). RoPE periods keep their checkpoint dtype (the sin/cos tables are
computed in the model's RoPE dtype and applied to q/k in that dtype anyway; DINOv2 has no RoPE). A pre-hook on the patch
embedding casts the input to bf16, so the teacher also runs without autocast (e.g. 32-true on CPU);
callers cast the outputs back to fp32.
"""

from __future__ import annotations

import offline_guard


def to_bf16(model):
    """In-place: DINOv3/DINOv2 ViT (or a LightlyTrain wrapper of one) -> bf16 weights, bf16 input."""
    import torch

    vit = model.get_model() if hasattr(model, "get_model") else model
    rope = getattr(vit, "rope_embed", None)  # DINOv3 only
    periods = rope.periods.detach().clone() if rope is not None else None
    model.to(torch.bfloat16)
    if rope is not None:
        rope.periods = periods.to(rope.periods.device)
    vit.patch_embed.register_forward_pre_hook(lambda _m, args: (args[0].to(torch.bfloat16), *args[1:]))
    return model


def _package(name: str):
    if name.startswith("dinov3/"):
        from lightly_train._models.dinov3.dinov3_package import DINOV3_PACKAGE

        return DINOV3_PACKAGE
    if name.startswith("dinov2/"):
        from lightly_train._models.dinov2_vit.dinov2_vit_package import DINOV2_VIT_PACKAGE

        return DINOV2_VIT_PACKAGE
    raise ValueError(f"not a DINOv2/DINOv3 teacher: {name}")


def build(name: str, weights=None):
    """Teacher by LightlyTrain name ('dinov3/vitl16', 'dinov2/vitb14', ...) from the project cache, or an
    architecture with weights from a state-dict file (converted HF checkpoint, fine-tuned backbone).
    Returns it in bf16, eval."""
    import torch

    pkg, arch = _package(name), name.split("/", 1)[1]
    if name in offline_guard.TEACHERS and (weights is None or weights == offline_guard.teacher_cache_file(name)):
        offline_guard.require_file(offline_guard.teacher_cache_file(name))
        net = pkg.get_model(arch)  # load_weights=True -> reads the cache file, no download
    elif weights is None:
        net = pkg.get_model(arch)  # dinov2 (LightlyTrain's model cache) or random-init test teachers
    else:
        net = pkg.get_model(arch, load_weights=False)
        net.load_state_dict(torch.load(weights, map_location="cpu", weights_only=True), strict=True)
    return to_bf16(net).eval()


def patch_lightly_get_teacher(log=print) -> None:
    """LightlyTrain's DistillationV3 builds the teacher in fp32; hold it in bf16 and hand fp32 features to the loss."""
    from lightly_train._methods.distillationv3 import distillationv3

    if getattr(distillationv3.get_teacher, "_bf16", False):
        return
    get_teacher = distillationv3.get_teacher

    def get_bf16_teacher(*args, **kwargs):
        wrapped = to_bf16(get_teacher(*args, **kwargs))
        forward_features = wrapped.forward_features
        wrapped.forward_features = lambda *a_, **k_: {k: v.float() for k, v in forward_features(*a_, **k_).items()}
        log(f"[teacher] {kwargs.get('teacher', args[0] if args else '?')} in {next(wrapped.parameters()).dtype}")
        return wrapped

    get_bf16_teacher._bf16 = True
    distillationv3.get_teacher = get_bf16_teacher
