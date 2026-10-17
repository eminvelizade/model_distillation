#!/usr/bin/env bash
# ONLINE PC (env active). Fetch RF-DETR Nano + DINOv3 ViT-L/16 into the project-local caches, verify MD5.
#   weights/rf-detr-nano.pth                                   (rfdetr would otherwise download it into $PWD)
#   cache/lightly-train/models/dinov3_vitl16_lvd1689m.pth      (exact file/path LightlyTrain looks for)
# No token needed: both are public URLs. torch.hub's downloader (used by LightlyTrain) does not check
# length/hash and keeps truncated files, so we download with curl (resumable) and verify MD5 here.
# If weights/dinov3-vitl16/ (HF folder) exists it is converted too (fallback teacher).
# Finally runs check_offline.py with the network guard on.
set -euo pipefail
cd "$(dirname "$0")"

fetch() {  # url dest md5
  local url=$1 dest=$2 md5=$3
  mkdir -p "$(dirname "$dest")"
  if [ -f "$dest" ] && [ "$(md5sum "$dest" | cut -d' ' -f1)" = "$md5" ]; then
    echo "[download] ok (cached) $dest"; return
  fi
  for attempt in 1 2 3; do
    curl -L --fail --retry 5 --retry-delay 5 -C - -o "$dest.part" "$url" || true
    if [ -f "$dest.part" ] && [ "$(md5sum "$dest.part" | cut -d' ' -f1)" = "$md5" ]; then
      mv "$dest.part" "$dest"; echo "[download] ok $dest"; return
    fi
    echo "[download] md5 mismatch/incomplete on attempt $attempt, restarting $dest"; rm -f "$dest.part"
  done
  echo "[download] FAILED $url"; exit 1
}

fetch https://storage.googleapis.com/rfdetr/nano_coco/checkpoint_best_regular.pth \
      weights/rf-detr-nano.pth fb6504cce7fbdc783f7a46991f07639f
fetch https://lightly-train-checkpoints.s3.us-east-1.amazonaws.com/dinov3/dinov3_vitl16_lvd1689m.pth \
      cache/lightly-train/models/dinov3_vitl16_lvd1689m.pth 07469a2d507f0e58a0a9e0675a289e57

if [ -f weights/dinov3-vitl16/config.json ]; then
  echo "[download] HF teacher folder found -> converting (fallback teacher)"
  python convert_hf_dinov3.py
fi

python check_offline.py
