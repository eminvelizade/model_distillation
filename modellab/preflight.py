"""Guards against silent library failures that would make results meaningless.

rfdetr 1.5.2 builds its resize/augmentation pipeline with albumentations, using BboxParams(clip=...), an argument
that only exists in albumentations >= 1.4.8. With the pinned albumentations 1.3.1 rfdetr catches the TypeError, logs
ONE warning ("Failed to initialize ... Skipping") and silently drops EVERY transform: images then reach the model at
native size, without resize or augmentation. Training "works" if the images' sides happen to be multiples of 32 and
crashes ("Backbone requires input shape to be divisible by 32") on real photos such as 640x427.

The albumentations versions don't allow a clean fix by pinning (checked on CPU with this repo's pipelines):
  1.3.1   LightlyTrain OK; rfdetr transforms dropped (clip), and its train crop can exceed the image (RandomSizedCrop)
  1.4.24  rfdetr OK; LightlyTrain LT-DETR crashes (ScaleJitter has no `always_apply`; its metadata excludes 1.4.*)
  2.0.8   rfdetr val OK, rfdetr train transforms dropped (RandomSizedCrop needs `size`; rfdetr requires < 2.0)
So the environment keeps 1.3.1 for LightlyTrain and the rfdetr training process uses a vendored 1.4.24 (modellab.compat).
"""

from __future__ import annotations

import subprocess
import sys


def check_rfdetr_transforms() -> None:
    """Raise RuntimeError if rfdetr cannot build its resize and augmentation transforms in THIS process."""
    import albumentations
    from rfdetr.datasets.aug_config import AUG_CONFIG
    from rfdetr.datasets.transforms import AlbumentationsWrapper

    resize = AlbumentationsWrapper.from_config([{"Resize": {"height": 64, "width": 64}}])
    augs = AlbumentationsWrapper.from_config(AUG_CONFIG)
    if len(resize) != 1 or len(augs) != len(AUG_CONFIG):
        raise RuntimeError(
            f"rfdetr could not build its image transforms with albumentations {albumentations.__version__} "
            f"(resize built: {len(resize)}/1, augmentations built: {len(augs)}/{len(AUG_CONFIG)}). It would train and "
            "validate on native-size, un-augmented images. See modellab/preflight.py for the version analysis.")


def ensure_rfdetr_transforms() -> str:
    """For a process that is about to train with rfdetr, BEFORE it imports rfdetr: select the albumentations that works
    (modellab.compat), then verify the transforms build. Returns the albumentations version."""
    from modellab import compat

    version = compat.use_rfdetr_albumentations()
    check_rfdetr_transforms()
    return version


def check_in_subprocess() -> str:
    """Same check from a process that has already imported albumentations (check_offline.py, setup_env.sh)."""
    from modellab import ROOT

    code = "import offline_guard; from modellab import preflight; print(preflight.ensure_rfdetr_transforms())"
    r = subprocess.run([sys.executable, "-c", code], cwd=ROOT, capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr.strip().splitlines()[-1] if r.stderr.strip() else "rfdetr transform check failed")
    return r.stdout.strip().splitlines()[-1]
