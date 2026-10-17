#!/usr/bin/env bash
# OFFLINE PC. Unpack the bundle from pack_env.sh, fix env paths (conda-unpack), place weights/caches,
# write an activate script with the offline env vars, and run the offline preflight check.
#   bash unpack_offline.sh <bundle_dir> <target_dir>
# Result:
#   <target>/env/                  unpacked conda env
#   <target>/project/              code + weights/ + cache/ (LightlyTrain/HF/torch caches point here)
#   <target>/activate.sh           source this before running anything
set -euo pipefail
BUNDLE=$(realpath "${1:?bundle dir}")
TARGET=$(realpath -m "${2:?target dir}")

(cd "$BUNDLE" && sha256sum -c SHA256SUMS)
mkdir -p "$TARGET/env" "$TARGET/project"
tar -xzf "$BUNDLE/env.tar.gz" -C "$TARGET/env"
tar -xf "$BUNDLE/project.tar" -C "$TARGET/project"

# conda-unpack rewrites the build-machine prefix in scripts/text files to the new location.
set +u  # conda-pack's activate script reads unset variables
# shellcheck disable=SC1091
source "$TARGET/env/bin/activate"
set -u
conda-unpack

cat > "$TARGET/activate.sh" <<EOF
# source $TARGET/activate.sh
source "$TARGET/env/bin/activate"
export HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 HF_DATASETS_OFFLINE=1 HF_HUB_DISABLE_TELEMETRY=1
export LIGHTLY_TRAIN_EVENTS_DISABLED=1 LIGHTLY_DID_VERSION_CHECK=True NO_ALBUMENTATIONS_UPDATE=1 WANDB_MODE=disabled
export LIGHTLY_TRAIN_CACHE_DIR="$TARGET/project/cache/lightly-train"
export HF_HOME="$TARGET/project/cache/huggingface" TORCH_HOME="$TARGET/project/cache/torch"
export MPLCONFIGDIR="$TARGET/project/cache/matplotlib"
cd "$TARGET/project"
EOF

set +u
# shellcheck disable=SC1091
source "$TARGET/activate.sh"
set -u
python check_offline.py
echo "[unpack] OK. Use: source $TARGET/activate.sh"
