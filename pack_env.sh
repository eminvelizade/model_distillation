#!/usr/bin/env bash
# ONLINE PC. Bundle everything the offline PC needs into one directory:
#   <out>/env.tar.gz      conda-pack of the env (python + all pip wheels incl. CUDA runtime)
#   <out>/project.tar     this repo: code + prebuilt ModelLab UI + weights/ + cache/ (no runs/, data/, .git, node_modules)
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

[ -d vendor/albumentations14 ] || { echo "[pack] vendor/albumentations14 missing -> re-run setup_env.sh (rfdetr needs it)"; exit 1; }
# ModelLab: the prebuilt UI (modellab/web/dist) ships, Node and node_modules do not (not needed at runtime).
[ -f modellab/web/dist/index.html ] || { echo "[pack] modellab/web/dist missing -> cd modellab/web && npm ci && npm run build"; exit 1; }
git rev-parse HEAD > GIT_COMMIT 2>/dev/null || true   # env.json records it on the offline PC (no .git there)
tar --exclude=./runs --exclude=./data --exclude=./bundle --exclude=./.git --exclude='*.part' \
    --exclude='__pycache__' --exclude=./modellab/web/node_modules --exclude=./datasets.json \
    -cf "$OUT/project.tar" .
cp unpack_offline.sh "$OUT/"
(cd "$OUT" && sha256sum env.tar.gz project.tar > SHA256SUMS)
du -sh "$OUT"/*
echo "[pack] OK -> $OUT. Copy it to the offline PC and run: bash unpack_offline.sh <bundle_dir> <target_dir>"
