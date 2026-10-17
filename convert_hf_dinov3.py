"""Fallback teacher: convert a local HF DINOv3 folder to LightlyTrain's native ViT-L/16 state dict.

LightlyTrain's `teacher_weights` must be a torch state dict for its own DINOv3 implementation
(loaded strictly), not an HF folder. This converts
    weights/dinov3-vitl16/{config.json, model.safetensors, preprocessor_config.json}
into weights/dinov3_vitl16_from_hf.pt and then self-checks:
  * config is ViT-L/16 (1024 dim, 24 layers, 16 heads, 4 registers) and preprocessing is ImageNet mean/std,
  * strict load into LightlyTrain's dinov3/vitl16 architecture,
  * forward pass matches transformers' DINOv3ViTModel on the same input (CLS + patch tokens).

    python convert_hf_dinov3.py                     # default paths
    python distill.py --data data/ds --out runs/distill --teacher hf

RoPE note: Meta's original checkpoint (= LightlyTrain's dinov3/vitl16 download) stores RoPE periods
in bf16; HF recomputes them in fp32. By default the saved file uses the bf16-rounded periods so the
converted teacher is the same model as the by-name teacher. The forward check runs with fp32
periods (exactly HF's math) to validate the weight mapping, and also reports the bf16 deviation.
"""

import offline_guard  # noqa: F401  (must be first)

import argparse
import json
from pathlib import Path

IMAGENET_MEAN = (0.485, 0.456, 0.406)
IMAGENET_STD = (0.229, 0.224, 0.225)
EXPECTED = {"hidden_size": 1024, "num_hidden_layers": 24, "num_attention_heads": 16, "patch_size": 16,
            "num_register_tokens": 4, "intermediate_size": 4096, "use_gated_mlp": False, "key_bias": False}


def hf_to_native(hf: dict, n_layers: int) -> dict:
    import torch

    hf = {k.removeprefix("model."): v for k, v in hf.items() if not k.startswith("rope_embeddings.")}
    take = hf.pop  # every HF tensor must be consumed exactly once
    d = hf["embeddings.cls_token"].shape[-1]
    zeros = torch.zeros(d)
    out = {
        "cls_token": take("embeddings.cls_token"),
        "storage_tokens": take("embeddings.register_tokens"),
        "mask_token": take("embeddings.mask_token").reshape(1, d),
        "patch_embed.proj.weight": take("embeddings.patch_embeddings.weight"),
        "patch_embed.proj.bias": take("embeddings.patch_embeddings.bias"),
        "norm.weight": take("norm.weight"),
        "norm.bias": take("norm.bias"),
    }
    for i in range(n_layers):
        h, n = f"layer.{i}.", f"blocks.{i}."
        a = h + "attention."
        out[n + "attn.qkv.weight"] = torch.cat([take(a + "q_proj.weight"), take(a + "k_proj.weight"), take(a + "v_proj.weight")])
        qb, vb = take(a + "q_proj.bias", zeros), take(a + "v_proj.bias", zeros)
        out[n + "attn.qkv.bias"] = torch.cat([qb.float(), zeros, vb.float()])
        out[n + "attn.qkv.bias_mask"] = torch.cat([torch.ones(d), zeros, torch.ones(d)])  # HF k_proj has no bias
        out[n + "attn.proj.weight"] = take(a + "o_proj.weight")
        out[n + "attn.proj.bias"] = take(a + "o_proj.bias")
        for nat, hfn in (("norm1", "norm1"), ("norm2", "norm2"), ("mlp.fc1", "mlp.up_proj"), ("mlp.fc2", "mlp.down_proj")):
            out[f"{n}{nat}.weight"] = take(f"{h}{hfn}.weight")
            out[f"{n}{nat}.bias"] = take(f"{h}{hfn}.bias")
        out[n + "ls1.gamma"] = take(h + "layer_scale1.lambda1")
        out[n + "ls2.gamma"] = take(h + "layer_scale2.lambda1")
    assert not hf, f"unmapped HF tensors: {sorted(hf)[:10]}"
    return {k: v.float().contiguous() for k, v in out.items()}


def native_model(load_weights: bool = False):
    from lightly_train._models.dinov3.dinov3_package import DINOV3_PACKAGE

    return DINOV3_PACKAGE.get_model("vitl16", load_weights=load_weights)


def compare(hf_dir: Path, native, size: int = 384) -> dict:
    import torch
    import torch.nn.functional as F
    from transformers import DINOv3ViTModel

    hf_model = DINOv3ViTModel.from_pretrained(str(hf_dir), local_files_only=True, dtype=torch.float32).eval()
    native.eval()
    x = torch.randn(2, 3, size, size, generator=torch.Generator().manual_seed(0))
    with torch.no_grad():
        h = hf_model(pixel_values=x).last_hidden_state
        r = native.forward_features(x)
    n_reg = native.n_storage_tokens
    pairs = {"cls": (h[:, 0], r["x_norm_clstoken"]), "patch": (h[:, 1 + n_reg:], r["x_norm_patchtokens"])}
    return {k: {"max_abs": (a - b).abs().max().item(),
                "min_cos": F.cosine_similarity(a.flatten(0, -2), b.flatten(0, -2), dim=-1).min().item()}
            for k, (a, b) in pairs.items()}


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--hf-dir", type=Path, default=offline_guard.HF_TEACHER_DIR)
    p.add_argument("--out", type=Path, default=offline_guard.HF_TEACHER_CONVERTED)
    p.add_argument("--rope-periods", choices=["bf16", "fp32"], default="bf16")
    p.add_argument("--atol", type=float, default=1e-3)
    a = p.parse_args()

    import torch
    from safetensors.torch import load_file

    cfg = json.loads((a.hf_dir / "config.json").read_text())
    assert cfg.get("model_type") == "dinov3_vit", f"model_type={cfg.get('model_type')}"
    bad = {k: (cfg.get(k), v) for k, v in EXPECTED.items() if cfg.get(k, v) != v}
    assert not bad, f"not a DINOv3 ViT-L/16 config (got, expected): {bad}"
    pre = json.loads((a.hf_dir / "preprocessor_config.json").read_text())
    for key, ref in (("image_mean", IMAGENET_MEAN), ("image_std", IMAGENET_STD)):
        assert all(abs(x - y) < 1e-6 for x, y in zip(pre[key], ref)), f"{key}={pre[key]} is not ImageNet {ref}"

    sd = hf_to_native(load_file(str(a.hf_dir / "model.safetensors")), cfg["num_hidden_layers"])
    model = native_model()
    sd["rope_embed.periods"] = model.state_dict()["rope_embed.periods"].clone()  # fp32 = HF's inv_freq math
    res = model.load_state_dict(sd, strict=True)
    assert not res.missing_keys and not res.unexpected_keys, res

    diff = compare(a.hf_dir, model)
    print(f"[convert] native vs HF (fp32 RoPE): {diff}")
    for k, v in diff.items():
        assert v["max_abs"] < a.atol and v["min_cos"] > 0.9999, f"{k} tokens differ from HF model: {v}"

    if a.rope_periods == "bf16":
        sd["rope_embed.periods"] = sd["rope_embed.periods"].to(torch.bfloat16).float()
        model.load_state_dict(sd, strict=True)
        print(f"[convert] native(bf16 RoPE, as Meta checkpoint) vs HF: {compare(a.hf_dir, model)}")

    a.out.parent.mkdir(parents=True, exist_ok=True)
    torch.save(sd, a.out)
    print(f"[convert] OK -> {a.out} ({len(sd)} tensors)")
    offline_guard.assert_no_network_attempts()


if __name__ == "__main__":
    main()
