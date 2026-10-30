"""Per-process albumentations selection (rfdetr and LightlyTrain need different versions).

  rfdetr 1.5.2 training pipeline     needs albumentations 1.4.8 .. 1.4.x   (BboxParams(clip=), RandomSizedCrop clamping)
  LightlyTrain 0.17 (distill, LT-DETR) works with 1.3.1; crashes on 1.4.* (its ScaleJitter has no `always_apply`)
The pip environment keeps 1.3.1 (what pip resolves, and what LightlyTrain was verified on). setup_env.sh additionally
installs albumentations 1.4.24 into vendor/albumentations14/. A process that trains with rfdetr calls
`use_rfdetr_albumentations()` BEFORE importing rfdetr: it puts that directory first on sys.path. ModelLab runs every
stage in its own process, so the two never meet. See modellab/preflight.py for why rfdetr must not run on 1.3.1.
"""

from __future__ import annotations

import sys

from modellab import ROOT

VENDOR = ROOT / "vendor" / "albumentations14"
MIN_RFDETR = (1, 4, 8)


def _ver(v: str) -> tuple[int, ...]:
    return tuple(int(x) for x in v.split(".")[:3] if x.isdigit())


def use_rfdetr_albumentations() -> str:
    """Select an albumentations that rfdetr's training pipeline works with; returns its version. Call before
    importing rfdetr / lightly_train in this process. Raises RuntimeError with the fix if that isn't possible."""
    mod = sys.modules.get("albumentations")
    if mod is None and VENDOR.is_dir():
        sys.path.insert(0, str(VENDOR))
        import albumentations as mod
    elif mod is None:
        import albumentations as mod
    v = mod.__version__
    if not (MIN_RFDETR <= _ver(v) < (2, 0, 0)):
        why = ("albumentations was already imported in this process" if mod.__file__ and str(VENDOR) not in mod.__file__
               and VENDOR.is_dir() else "vendor/albumentations14 is missing")
        raise RuntimeError(
            f"rfdetr needs albumentations 1.4.8-1.4.x for its resize/augmentation transforms but this process has {v} "
            f"({why}). Without it rfdetr silently skips ALL transforms and trains on native-size images. "
            "Fix: re-run setup_env.sh (installs vendor/albumentations14), and import modellab.compat before rfdetr.")
    return v


def fix_dataloader_fd_sharing(min_fds: int = 65536) -> str:
    """Avoid `RuntimeError: received 0 items of ancdata` from DataLoader workers. Call in the main process before
    training. torch's default "file_descriptor" sharing keeps one open fd per tensor a worker hands over; batches with
    many annotations (hundreds of boxes per image) exhaust the usual 1024 open-file soft limit mid-epoch. Raises the
    soft limit up to the hard limit; if that is still below `min_fds`, switches to "file_system" sharing (/dev/shm
    files, no fd per tensor). Returns a one-line description for the log."""
    import resource

    import torch.multiprocessing as mp

    soft, hard = resource.getrlimit(resource.RLIMIT_NOFILE)
    want = min_fds if hard == resource.RLIM_INFINITY else min(min_fds, hard)
    if soft != resource.RLIM_INFINITY and soft < want:
        resource.setrlimit(resource.RLIMIT_NOFILE, (want, hard))
        soft = want
    if soft != resource.RLIM_INFINITY and soft < min_fds:
        mp.set_sharing_strategy("file_system")
    return f"open files limit {soft} (hard {hard}), tensor sharing {mp.get_sharing_strategy()}"
