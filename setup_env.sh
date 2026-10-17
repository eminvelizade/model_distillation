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

# Note: `conda run` does not forward stdin, so no heredoc here.
"$CONDA" run -n "$ENV_NAME" python -c '
import sys, torch, torchvision, transformers, lightly_train
from importlib.metadata import version
print("python", sys.version.split()[0], "| torch", torch.__version__, "(CUDA runtime", torch.version.cuda + ")",
      "| torchvision", torchvision.__version__, "| transformers", transformers.__version__,
      "| lightly-train", lightly_train.__version__, "| rfdetr", version("rfdetr"))
assert sys.version_info[:2] == (3, 11), "Python must be 3.11"
'
echo "[setup_env] OK. Next: conda activate $ENV_NAME && bash download_weights.sh"
