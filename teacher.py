"""DINOv3 teacher in bf16, shared by distill.py, compare_features.py and check_offline.py.

The teacher is frozen, so its weights are stored in bf16 (half the memory of fp32: ViT-7B ~13.4 GB
instead of ~27 GB on the GPU). RoPE periods keep their checkpoint dtype (the sin/cos tables are
computed in the model's RoPE dtype and applied to q/k in that dtype anyway). A pre-hook on the patch
embedding casts the input to bf16, so the teacher also runs without autocast (e.g. 32-true on CPU);
callers cast the outputs back to fp32.
"""

from __future__ import annotations

import offline_guard


def to_bf16(model):
    """In-place: DinoVisionTransformer (or a LightlyTrain wrapper of one) -> bf16 weights, bf16 input."""
    import torch

    vit = model.get_model() if hasattr(model, "get_model") else model
    periods = vit.rope_embed.periods.detach().clone()
    model.to(torch.bfloat16)
    vit.rope_embed.periods = periods.to(vit.rope_embed.periods.device)
    vit.patch_embed.register_forward_pre_hook(lambda _m, args: (args[0].to(torch.bfloat16), *args[1:]))
    return model


def build(name: str, weights=None):
    """Teacher by LightlyTrain name ('dinov3/vitl16', ...) from the project cache, or an
    architecture with weights from a state-dict file (converted HF checkpoint). Returns it in bf16, eval."""
    import torch
    from lightly_train._models.dinov3.dinov3_package import DINOV3_PACKAGE

    arch = name.removeprefix("dinov3/")
    if weights is None or weights == offline_guard.teacher_cache_file(name):
        offline_guard.require_file(offline_guard.teacher_cache_file(name))
        net = DINOV3_PACKAGE.get_model(arch)  # load_weights=True -> reads the cache file, no download
    else:
        net = DINOV3_PACKAGE.get_model(arch, load_weights=False)
        net.load_state_dict(torch.load(weights, map_location="cpu", weights_only=True), strict=True)
    return to_bf16(net).eval()
