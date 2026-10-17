"""Load the distilled checkpoint into RF-DETR Nano and prove nothing was skipped.

rfdetr loads `pretrain_weights` with load_state_dict(strict=False), which silently ignores
missing/unexpected keys. This script therefore checks three things:
  1. strict key/shape match between the checkpoint and a fresh RFDETRNano model,
  2. after RFDETRNano(pretrain_weights=ckpt) every model tensor equals the checkpoint tensor
     (i.e. rfdetr's own loading path really applied every key),
  3. vs. stock Nano: backbone encoder tensors changed, everything else is identical.

    python load_backbone.py --ckpt runs/distill/rf-detr-nano-distilled.pth
"""

import offline_guard  # noqa: F401  (must be first)

import argparse
from pathlib import Path

ENCODER_PREFIX = "backbone.0.encoder."


def load_nano(weights: Path, device: str = "cpu"):
    from rfdetr import RFDETRNano

    return RFDETRNano(pretrain_weights=str(weights), device=device)


def lwdetr(rf):  # RFDETR wrapper -> LWDETR nn.Module
    return rf.model.model


def check(ckpt_path: Path, stock_path: Path, allow_unchanged: bool = False) -> dict:
    import torch

    ckpt = torch.load(ckpt_path, map_location="cpu", weights_only=False)
    sd = ckpt["model"] if "model" in ckpt else ckpt

    # 1. strict structural match against a fresh model built from the stock weights.
    stock = lwdetr(load_nano(stock_path))
    stock_sd = {k: v.clone() for k, v in stock.state_dict().items()}
    missing = sorted(set(stock_sd) - set(sd))
    unexpected = sorted(set(sd) - set(stock_sd))
    shape_mismatch = sorted(k for k in set(sd) & set(stock_sd) if sd[k].shape != stock_sd[k].shape)
    assert not missing, f"missing keys ({len(missing)}): {missing[:10]}"
    assert not unexpected, f"unexpected keys ({len(unexpected)}): {unexpected[:10]}"
    assert not shape_mismatch, f"shape mismatch: {[(k, tuple(sd[k].shape), tuple(stock_sd[k].shape)) for k in shape_mismatch[:10]]}"
    res = stock.load_state_dict(sd, strict=True)
    assert not res.missing_keys and not res.unexpected_keys, res

    # 2. rfdetr's real loading path (strict=False inside) must reproduce every tensor.
    loaded_sd = lwdetr(load_nano(ckpt_path)).state_dict()
    not_applied = [k for k, v in sd.items() if not torch.equal(loaded_sd[k].cpu(), v.cpu())]
    assert not not_applied, f"{len(not_applied)} tensors not applied by RFDETRNano(pretrain_weights=...): {not_applied[:10]}"

    # 3. only the encoder should differ from stock.
    enc = [k for k in sd if k.startswith(ENCODER_PREFIX)]
    changed_enc = [k for k in enc if not torch.equal(sd[k], stock_sd[k])]
    changed_other = [k for k in sd if not k.startswith(ENCODER_PREFIX) and not torch.equal(sd[k], stock_sd[k])]
    assert not changed_other, f"non-encoder tensors differ from stock: {changed_other[:10]}"
    if not allow_unchanged:
        assert changed_enc, "encoder identical to stock: distillation did not change the backbone"
    n_param = sum(sd[k].numel() for k in enc)
    return {"keys": len(sd), "encoder_keys": len(enc), "encoder_params": n_param,
            "encoder_keys_changed": len(changed_enc), "non_encoder_keys_changed": len(changed_other)}


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--ckpt", type=Path, required=True)
    p.add_argument("--stock", type=Path, default=offline_guard.NANO_WEIGHTS)
    p.add_argument("--allow-unchanged", action="store_true", help="for testing with the stock checkpoint")
    a = p.parse_args()
    info = check(a.ckpt, offline_guard.require_file(a.stock), a.allow_unchanged)
    print(f"[load_backbone] OK {a.ckpt}: {info}")
    offline_guard.assert_no_network_attempts()


if __name__ == "__main__":
    main()
