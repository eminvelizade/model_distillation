"""Progress reporting + wall-clock budgets for the three training loops ModelLab drives.

- LightlyTrain pretrain (distill): PyTorch Lightning Trainer -> we add a progress callback and Lightning's Timer
  (stops gracefully; LightlyTrain still exports the last model).
- LightlyTrain train_object_detection (LT-DETR): a manual Fabric step loop `for step in range(start, config.steps)`.
  We wrap that `range` (module global lookup) so that at the deadline the current step becomes the last one
  (config.steps = step + 1): LightlyTrain then saves/exports/validates as on a normal last step. Checked against
  lightly-train 0.17.0 only; other versions fall back to epoch budgets with a warning.
- rfdetr training: on_train_batch_start callback; at the deadline request_early_stop() -> stops after the epoch.
"""

from __future__ import annotations

import builtins
import json
import math
import os
import sys
import time
from datetime import timedelta
from pathlib import Path


class Progress:
    """Writes stage progress to progress.json (atomic, at most ~1/s)."""

    def __init__(self, stage_dir: Path, deadline: float | None = None):
        self.path = stage_dir / "progress.json"
        self.deadline = deadline
        self.t0 = time.time()
        self._last = 0.0

    def update(self, frac: float, msg: str = "", force: bool = False) -> None:
        now = time.time()
        if not force and now - self._last < 1.0:
            return
        self._last = now
        frac = max(0.0, min(1.0, frac))
        if self.deadline:  # wall-clock budget: progress is the larger of work done and time used
            frac = max(frac, (now - self.t0) / max(1.0, self.deadline - self.t0))
        tmp = self.path.with_suffix(".tmp")
        tmp.write_text(json.dumps({"fraction": round(min(frac, 1.0), 4), "message": msg, "elapsed_s": round(now - self.t0, 1),
                                   "updated": now}))
        os.replace(tmp, self.path)

    def expired(self) -> bool:
        return self.deadline is not None and time.time() >= self.deadline


def lightning(progress: Progress, minutes: float | None) -> None:
    """Patch pytorch_lightning.Trainer so every Trainer built in this process gets our callbacks."""
    import pytorch_lightning as pl
    from pytorch_lightning.callbacks import Callback, Timer

    class _ProgressCB(Callback):
        def on_train_batch_end(self, trainer, *args, **kwargs):
            total = trainer.estimated_stepping_batches or 1
            progress.update(trainer.global_step / total if math.isfinite(total) else 0.0,
                            f"epoch {trainer.current_epoch + 1}/{trainer.max_epochs} step {trainer.global_step}")

    orig = pl.Trainer.__init__
    if getattr(orig, "_modellab", False):
        return

    def init(self, *args, **kwargs):
        cbs = list(kwargs.get("callbacks") or [])
        cbs.append(_ProgressCB())
        if minutes:
            cbs.append(Timer(duration=timedelta(minutes=float(minutes)), interval="step"))
        kwargs["callbacks"] = cbs
        orig(self, *args, **kwargs)

    init._modellab = True
    pl.Trainer.__init__ = init


def lightly_task_loop(progress: Progress) -> bool:
    """Wrap the LT-DETR step loop. Returns False if the LightlyTrain version is not the verified one."""
    import lightly_train
    from lightly_train._commands import train_task

    if lightly_train.__version__ != "0.17.0":
        print(f"[modellab] WARNING: wall-clock budget hook verified on lightly-train 0.17.0 only "
              f"(found {lightly_train.__version__}); using the step budget only", file=sys.stderr)
        return False

    def deadline_range(*args):
        caller = sys._getframe(1)
        cfg = caller.f_locals.get("config")
        if caller.f_code.co_name != "_train_task_from_config" or cfg is None or len(args) != 2 or args[1] != getattr(cfg, "steps", None):
            return builtins.range(*args)

        def gen():
            start, stop = args
            for step in builtins.range(start, stop):
                progress.update((step + 1) / stop, f"step {step + 1}/{stop}")
                if progress.expired() and cfg.steps != step + 1:
                    print(f"[modellab] wall-clock budget reached at step {step + 1}/{stop}: finishing this step as the last one",
                          flush=True)
                    cfg.steps = step + 1  # makes is_last_step true -> save/export/validate
                    yield step
                    return
                yield step

        return gen()

    train_task.range = deadline_range
    return True


def rfdetr_callbacks(rf, progress: Progress, epochs: int, steps_per_epoch: int) -> None:
    """rfdetr: RFDETR instance has .callbacks; rf.model (rfdetr.main.Model) has request_early_stop()."""
    state = {"stop_requested": False}
    total = max(1, epochs * steps_per_epoch)

    def on_batch(d: dict) -> None:
        progress.update((d["step"] + 1) / total, f"epoch {d['epoch'] + 1}/{epochs}")
        if progress.expired() and not state["stop_requested"]:
            state["stop_requested"] = True
            print("[modellab] wall-clock budget reached: stopping after this epoch", flush=True)
            rf.model.request_early_stop()

    rf.callbacks["on_train_batch_start"].append(on_batch)
