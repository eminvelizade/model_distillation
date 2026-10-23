#!/usr/bin/env bash
# ONLINE PC. Bundle everything the offline PC needs into one directory:
#   <out>/env.tar.gz      conda-pack of the env (python + all pip wheels incl. CUDA runtime)
#   <out>/project.tar     this repo: code + weights/ + cache/ (no runs/, data/, .git)
#   <out>/SHA256SUMS
#   <out>/unpack_offline.sh
# Data is NOT included; copy your dataset separately.
#   bash pack_env.sh [out_dir=bundle]
set -euo pipefail
cd "$(dirname "$0")"
ENV_NAME=${ENV_NAME:-rfdetr-distill}
OUT=$(realpath -m "${1:-bundle}")
mkdir -p "$OUT"

[ -f weights/rf-detr-nano.pth ] || { echo "[pack] missing weights/rf-detr-nano.pth -> run download_weights.sh first"; exit 1; }
ls cache/lightly-train/models/dinov3_*_lvd1689m.pth >/dev/null 2>&1 \
  || { echo "[pack] no DINOv3 teacher in cache/lightly-train/models -> run download_weights.sh first"; exit 1; }

CONDA=${CONDA_EXE:-$(command -v conda || command -v mamba)}
PREFIX=$("$CONDA" run -n "$ENV_NAME" python -c "import sys; print(sys.prefix)")
rm -f "$OUT/env.tar.gz"
"$PREFIX/bin/conda-pack" -p "$PREFIX" -o "$OUT/env.tar.gz" --n-threads -1

tar --exclude=./runs --exclude=./data --exclude=./bundle --exclude=./.git --exclude='*.part' \
    --exclude='__pycache__' -cf "$OUT/project.tar" .
cp unpack_offline.sh "$OUT/"
(cd "$OUT" && sha256sum env.tar.gz project.tar > SHA256SUMS)
du -sh "$OUT"/*
echo "[pack] OK -> $OUT. Copy it to the offline PC and run: bash unpack_offline.sh <bundle_dir> <target_dir>"
