#!/usr/bin/env bash
# ONLINE PC (env active). Fetch RF-DETR Nano + a DINOv3 teacher into the project-local caches, verify MD5.
#   bash download_weights.sh                                   # teacher dinov3/vitl16 (default)
#   bash download_weights.sh --teacher-model dinov3/vith16plus # or dinov3/vit7b16; repeat to fetch several
#   weights/rf-detr-nano.pth                                   (rfdetr would otherwise download it into $PWD)
#   cache/lightly-train/models/dinov3_<arch>_lvd1689m.pth      (exact file/path LightlyTrain looks for)
# Sizes: vitl16 1.2 GB, vith16plus 3.4 GB, vit7b16 26.9 GB.
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

TEACHERS=()
while [ $# -gt 0 ]; do
  case $1 in
    --teacher-model) TEACHERS+=("${2:?--teacher-model needs a value}"); shift 2 ;;
    --teacher-model=*) TEACHERS+=("${1#*=}"); shift ;;
    *) echo "usage: $0 [--teacher-model dinov3/vitl16|dinov3/vith16plus|dinov3/vit7b16]..."; exit 2 ;;
  esac
done
[ ${#TEACHERS[@]} -gt 0 ] || TEACHERS=(dinov3/vitl16)

# MD5s must match offline_guard.TEACHERS (vith16plus/vit7b16 are S3 multipart uploads: ETag is not an MD5).
teacher_md5() {
  case $1 in
    dinov3/vitl16)     echo 07469a2d507f0e58a0a9e0675a289e57 ;;
    dinov3/vith16plus) echo 9daf5fc59373a063e403d85443a769b9 ;;
    dinov3/vit7b16)    echo f3c39447f01f8ce96d1ebea5f3bb61a6 ;;
    *) echo "[download] unknown teacher '$1' (dinov3/vitl16, dinov3/vith16plus, dinov3/vit7b16)" >&2; exit 2 ;;
  esac
}
for t in "${TEACHERS[@]}"; do teacher_md5 "$t" > /dev/null; done  # validate names before downloading

fetch https://storage.googleapis.com/rfdetr/nano_coco/checkpoint_best_regular.pth \
      weights/rf-detr-nano.pth fb6504cce7fbdc783f7a46991f07639f
CHECK_ARGS=()
for t in "${TEACHERS[@]}"; do
  f="dinov3_${t#dinov3/}_lvd1689m.pth"
  fetch "https://lightly-train-checkpoints.s3.us-east-1.amazonaws.com/dinov3/$f" \
        "cache/lightly-train/models/$f" "$(teacher_md5 "$t")"
  CHECK_ARGS+=(--teacher-model "$t")
done

if [ -f weights/dinov3-vitl16/config.json ]; then
  echo "[download] HF teacher folder found -> converting (fallback teacher)"
  python convert_hf_dinov3.py
fi

python check_offline.py "${CHECK_ARGS[@]}"
