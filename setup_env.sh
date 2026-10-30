#!/usr/bin/env bash
# ONLINE PC. Create the pinned conda env from environment.yml.
#   bash setup_env.sh                 # env name rfdetr-distill
#   ENV_NAME=foo bash setup_env.sh
set -euo pipefail
cd "$(dirname "$0")"
ENV_NAME=${ENV_NAME:-rfdetr-distill}
CONDA=${CONDA_EXE:-$(command -v conda || command -v mamba)}

if "$CONDA" env list | awk '{print $1}' | grep -qx "$ENV_NAME"; then
  echo "[setup_env] env '$ENV_NAME' exists -> updating to environment.yml (--prune)"
  "$CONDA" env update -n "$ENV_NAME" -f environment.yml --prune
else
  "$CONDA" env create -n "$ENV_NAME" -f environment.yml
fi

# rfdetr's training pipeline needs albumentations 1.4.x, LightlyTrain needs 1.3.1 (pip's resolution; 1.4.* crashes it).
# The env keeps 1.3.1; 1.4.24 goes into vendor/albumentations14, used only by processes that train with rfdetr
# (modellab.compat). Without it rfdetr silently skips ALL image transforms. See modellab/preflight.py.
"$CONDA" run -n "$ENV_NAME" pip install --no-deps --upgrade --target vendor/albumentations14 \
  albumentations==1.4.24 albucore==0.0.23 simsimd==6.5.16 stringzilla==5.3.2

# Note: `conda run` does not forward stdin, so no heredoc here.
"$CONDA" run -n "$ENV_NAME" python -c '
import sys, torch, torchvision, transformers, lightly_train
from importlib.metadata import version
print("python", sys.version.split()[0], "| torch", torch.__version__, "(CUDA runtime", torch.version.cuda + ")",
      "| torchvision", torchvision.__version__, "| transformers", transformers.__version__,
      "| lightly-train", lightly_train.__version__, "| rfdetr", version("rfdetr"))
assert sys.version_info[:2] == (3, 11), "Python must be 3.11"
'
"$CONDA" run -n "$ENV_NAME" python -c "import offline_guard; from modellab import preflight; print('rfdetr image transforms OK with albumentations', preflight.check_in_subprocess())"
echo "[setup_env] OK. Next: conda activate $ENV_NAME && bash download_weights.sh"
