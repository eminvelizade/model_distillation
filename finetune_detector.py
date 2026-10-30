"""(Optional) Fine-tune RF-DETR Nano from the stock and the distilled backbone with the same recipe; compare mAP.

Both runs use identical seed / epochs / lr / batch / resolution; only `pretrain_weights` differs.
The distilled checkpoint has the stock decoder + distilled encoder (see load_backbone.py), so the
only difference between the two runs is the backbone. Checkpoint selection uses `valid`; the
reported numbers are rfdetr's evaluation of the selected checkpoint on `test`.

    python finetune_detector.py --data data/ds --distilled runs/distill/rf-detr-nano-distilled.pth --epochs 50
    python finetune_detector.py ... --smoke     # 1 epoch, CPU-friendly
"""

import offline_guard  # noqa: F401  (must be first)

import argparse
import json
from pathlib import Path


def summarize(results_json: Path, split: str) -> dict:
    res = json.loads(results_json.read_text())
    rows = res["class_map"][split]
    allrow = next(r for r in rows if r["class"] == "all")
    return {"map50_95": allrow["map@50:95"], "map50": allrow["map@50"],
            "per_class_map50_95": {r["class"]: r["map@50:95"] for r in rows if r["class"] != "all"}}


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--data", type=Path, required=True, help="output dir of make_splits.py")
    p.add_argument("--distilled", type=Path, required=True)
    p.add_argument("--stock", type=Path, default=offline_guard.NANO_WEIGHTS)
    p.add_argument("--out", type=Path, default=Path("runs/finetune"))
    p.add_argument("--epochs", type=int, default=50)
    p.add_argument("--batch-size", type=int, default=16)
    p.add_argument("--grad-accum-steps", type=int, default=1)
    p.add_argument("--lr", type=float, default=1e-4)
    p.add_argument("--lr-encoder", type=float, default=1.5e-4)
    p.add_argument("--num-workers", type=int, default=4)
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--only", choices=["stock", "distilled"], default=None, help="run just one of the two")
    p.add_argument("--smoke", action="store_true")
    a = p.parse_args()

    from modellab import preflight

    # rfdetr silently drops resize/augmentation with albumentations 1.3.1: select 1.4.x BEFORE importing rfdetr
    print(f"[finetune] rfdetr image transforms OK with albumentations {preflight.ensure_rfdetr_transforms()}")
    import torch
    from rfdetr import RFDETRNano
    from modellab import compat

    print(f"[finetune] {compat.fix_dataloader_fd_sharing()}")

    if a.smoke:
        a.epochs, a.batch_size, a.grad_accum_steps, a.num_workers = 1, 2, 1, 0
    device = "cuda" if torch.cuda.is_available() else "cpu"
    recipe = dict(dataset_dir=str(a.data), epochs=a.epochs, batch_size=a.batch_size, grad_accum_steps=a.grad_accum_steps,
                  lr=a.lr, lr_encoder=a.lr_encoder, num_workers=a.num_workers, seed=a.seed, device=device,
                  run_test=True, tensorboard=False, wandb=False, early_stopping=False)
    summary = {"recipe": {k: v for k, v in recipe.items() if k != "dataset_dir"}}
    inits = {"stock": a.stock, "distilled": a.distilled}
    for name, weights in inits.items():
        if a.only and name != a.only:
            continue
        out = a.out / name
        model = RFDETRNano(pretrain_weights=str(offline_guard.require_file(weights)), device=device)
        model.train(output_dir=str(out), **recipe)
        summary[name] = {"weights": str(weights), "test": summarize(out / "results.json", "test"),
                         "valid": summarize(out / "results.json", "valid")}
        print(f"[finetune] {name}: test mAP50:95={summary[name]['test']['map50_95']:.4f} mAP50={summary[name]['test']['map50']:.4f}")

    a.out.mkdir(parents=True, exist_ok=True)
    (a.out / "summary.json").write_text(json.dumps(summary, indent=2))
    if "stock" in summary and "distilled" in summary:
        for m in ("map50_95", "map50"):
            s, d = summary["stock"]["test"][m], summary["distilled"]["test"][m]
            print(f"[finetune] test {m}: stock={s:.4f} distilled={d:.4f} delta={d - s:+.4f}")
    print(f"[finetune] -> {a.out / 'summary.json'}")
    offline_guard.assert_no_network_attempts()


if __name__ == "__main__":
    main()
