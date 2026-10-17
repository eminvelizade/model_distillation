"""Test fixture: build an HF-format DINOv3 ViT-L/16 folder from the native (LightlyTrain/Meta) checkpoint.

The real HF repo (facebook/dinov3-vitl16-pretrain-lvd1689m) is gated, so convert_hf_dinov3.py is
tested on this stand-in. The mapping below is written independently of convert_hf_dinov3.py and
loaded with strict=True by transformers' own DINOv3ViTModel, so the key names are transformers'.

python tests/make_fake_hf_dinov3.py --native cache/lightly-train/models/dinov3_vitl16_lvd1689m.pth --out /tmp/hf_vitl16
"""

import argparse
import json
from pathlib import Path

import torch
from transformers import DINOv3ViTConfig, DINOv3ViTModel


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--native", type=Path, required=True)
    p.add_argument("--out", type=Path, required=True)
    a = p.parse_args()
    nat = torch.load(a.native, map_location="cpu", weights_only=True)
    D, L = 1024, 24
    hf = {
        "embeddings.cls_token": nat["cls_token"],
        "embeddings.mask_token": nat["mask_token"][None],
        "embeddings.register_tokens": nat["storage_tokens"],
        "embeddings.patch_embeddings.weight": nat["patch_embed.proj.weight"],
        "embeddings.patch_embeddings.bias": nat["patch_embed.proj.bias"],
        "norm.weight": nat["norm.weight"],
        "norm.bias": nat["norm.bias"],
    }
    for i in range(L):
        b = f"blocks.{i}."
        q, k, v = nat[b + "attn.qkv.weight"].split(D)
        bias = nat[b + "attn.qkv.bias"] * nat[b + "attn.qkv.bias_mask"]
        hf.update({
            f"layer.{i}.attention.q_proj.weight": q, f"layer.{i}.attention.k_proj.weight": k,
            f"layer.{i}.attention.v_proj.weight": v,
            f"layer.{i}.attention.q_proj.bias": bias[:D], f"layer.{i}.attention.v_proj.bias": bias[2 * D:],
            f"layer.{i}.attention.o_proj.weight": nat[b + "attn.proj.weight"],
            f"layer.{i}.attention.o_proj.bias": nat[b + "attn.proj.bias"],
            f"layer.{i}.norm1.weight": nat[b + "norm1.weight"], f"layer.{i}.norm1.bias": nat[b + "norm1.bias"],
            f"layer.{i}.norm2.weight": nat[b + "norm2.weight"], f"layer.{i}.norm2.bias": nat[b + "norm2.bias"],
            f"layer.{i}.mlp.up_proj.weight": nat[b + "mlp.fc1.weight"], f"layer.{i}.mlp.up_proj.bias": nat[b + "mlp.fc1.bias"],
            f"layer.{i}.mlp.down_proj.weight": nat[b + "mlp.fc2.weight"], f"layer.{i}.mlp.down_proj.bias": nat[b + "mlp.fc2.bias"],
            f"layer.{i}.layer_scale1.lambda1": nat[b + "ls1.gamma"], f"layer.{i}.layer_scale2.lambda1": nat[b + "ls2.gamma"],
        })
    cfg = DINOv3ViTConfig(hidden_size=D, intermediate_size=4 * D, num_hidden_layers=L, num_attention_heads=16,
                          num_register_tokens=4, patch_size=16, layerscale_value=1e-5, rope_theta=100.0)
    model = DINOv3ViTModel(cfg)
    model.load_state_dict(hf, strict=True)
    model.save_pretrained(a.out, safe_serialization=True)
    (a.out / "preprocessor_config.json").write_text(json.dumps({
        "image_processor_type": "DINOv3ViTImageProcessorFast", "do_resize": True, "size": {"height": 224, "width": 224},
        "do_rescale": True, "rescale_factor": 1 / 255, "do_normalize": True,
        "image_mean": [0.485, 0.456, 0.406], "image_std": [0.229, 0.224, 0.225]}, indent=2))
    print(f"wrote {sorted(x.name for x in a.out.iterdir())} to {a.out}")


if __name__ == "__main__":
    main()
