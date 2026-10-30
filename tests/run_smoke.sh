#!/usr/bin/env bash
# Full pipeline on a tiny synthetic dataset (CPU or GPU, ~5-10 min on CPU), network guard on.
# Run on the online PC, and again on the offline PC after unpack_offline.sh.
# Strongest offline simulation on Linux (no network namespace, only loopback):
#   unshare -rn bash tests/run_smoke.sh
# Other teacher (must be downloaded): SMOKE_TEACHER_MODEL=dinov3/vith16plus bash tests/run_smoke.sh
set -euo pipefail
cd "$(dirname "$0")/.."
W=${SMOKE_DIR:-runs/smoke}
T=${SMOKE_TEACHER_MODEL:-dinov3/vitl16}
rm -rf "$W" && mkdir -p "$W"
step() { echo; echo "=== $* ==="; }

step "offline preflight";       python check_offline.py --no-md5 --teacher-model "$T"
step "guard positive controls"; bash tests/test_offline_guard.sh
step "synthetic data + splits"
python tests/make_synthetic_dataset.py --out "$W/raw" --n 60 --format coco
python tests/make_synthetic_dataset.py --out "$W/raw_yolo" --n 20 --format yolo --seed 1
python make_splits.py --format yolo --yolo-dir "$W/raw_yolo" --out "$W/ds_yolo"
python make_splits.py --format coco --coco-json "$W/raw/annotations.json" --images-dir "$W/raw/images" --out "$W/ds"
step "distill (smoke, teacher $T by name)"
python distill.py --data "$W/ds" --out "$W/distill" --smoke --batch-size 4 --num-workers 2 --teacher-model "$T"
if [ "$T" = dinov3/vitl16 ] && [ -f weights/dinov3_vitl16_from_hf.pt ]; then
  step "distill (smoke, converted HF teacher)"
  python distill.py --data "$W/ds" --out "$W/distill_hf" --smoke --batch-size 4 --teacher hf --num-workers 2
fi
step "load_backbone";           python load_backbone.py --ckpt "$W/distill/rf-detr-nano-distilled.pth"
step "negative tests";          python tests/test_negative.py --ckpt "$W/distill/rf-detr-nano-distilled.pth" --data "$W/ds" --tmp "$W/neg"
step "compare_features"
python compare_features.py --data "$W/ds" --split valid --distilled "$W/distill/rf-detr-nano-distilled.pth" \
  --teacher --teacher-model "$T" --pca-plot --out "$W/compare"
step "finetune_detector (smoke)"
python finetune_detector.py --data "$W/ds" --distilled "$W/distill/rf-detr-nano-distilled.pth" --out "$W/finetune" --smoke
echo; echo "SMOKE PASSED ($W)"
