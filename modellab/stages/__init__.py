"""Stage execution. Each stage runs in its own process: `python -m modellab.stages <run_id> <stage>`.

A stage reads runs/<id>/resolved.json, consumes earlier stages' outputs (stages/<ref>/result.json), writes its
artifacts into runs/<id>/stages/<stage>/ and finally result.json = {"outputs": {...}, "metrics": {...}}.
Output paths in result.json are relative to the stage dir, so a run directory can be moved between machines.
"""

import offline_guard  # noqa: F401  (must be first: offline env vars + network guard)

import json
import os
import random
import sys
import time
import traceback
from pathlib import Path

from modellab import catalog, datasets, store, weights
from modellab.hooks import Progress


class Ctx:
    def __init__(self, run_id: str, stage: str):
        self.run_id = run_id
        self.resolved = json.loads((store.run_dir(run_id) / "resolved.json").read_text())
        self.st = next(s for s in self.resolved["stages"] if s["name"] == stage)
        self.dir = store.stage_dir(run_id, stage)
        self.dir.mkdir(parents=True, exist_ok=True)
        import torch

        forced = os.environ.get("MODELLAB_DEVICE")
        self.device = forced or ("cuda" if torch.cuda.is_available() else "cpu")
        budget = self.st.get("budget") or {}
        minutes = budget.get("minutes")
        self.minutes = minutes
        self.progress = Progress(self.dir, time.time() + 60 * minutes if minutes else None)

    def log(self, msg: str) -> None:
        print(f"[modellab:{self.st['name']}] {msg}", flush=True)

    def input(self, ref: dict) -> dict:
        """Outputs of an earlier stage, with paths made absolute."""
        d = store.stage_dir(self.run_id, ref["from"])
        res = json.loads((d / "result.json").read_text())
        out = dict(res["outputs"])
        for k in ("checkpoint", "backbone", "classes"):
            if out.get(k):
                out[k] = str(d / out[k])
        return out

    def dataset(self, name: str | None = None) -> Path:
        p = datasets.path_of(name or self.st["dataset"])
        datasets.validate_layout(p)
        return p

    def stock_weights(self, model_id: str) -> Path:
        miss = weights.missing([model_id])
        if miss:
            raise FileNotFoundError(f"weights for {model_id} missing: {miss}. Online: modellab weights fetch {model_id}")
        return offline_guard.ROOT / catalog.weight_file(catalog.detector(model_id).weights[0]).dest

    def require_teacher(self, teacher_id: str) -> None:
        miss = weights.missing([teacher_id])
        if miss:
            raise FileNotFoundError(f"teacher weights missing: {miss}. Online: modellab weights fetch {teacher_id}")

    def num_workers(self) -> int:
        n = self.st.get("num_workers")
        return int(n) if n is not None else (0 if self.device == "cpu" else min(8, os.cpu_count() or 4))


def seed_everything(seed: int) -> None:
    import numpy as np
    import torch

    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)


def main(run_id: str, stage: str) -> int:
    from modellab.stages import distill, evaluation, features, finetune

    ctx = Ctx(run_id, stage)
    seed_everything(ctx.st["seed"])
    ctx.log(f"type={ctx.st['type']} device={ctx.device} seed={ctx.st['seed']}")
    fn = {"distill": distill.run, "finetune": finetune.run, "eval": evaluation.run, "features": features.run}[ctx.st["type"]]
    t0 = time.time()
    try:
        outputs, metrics = fn(ctx)
    except Exception:
        traceback.print_exc()
        return 1
    ctx.progress.update(1.0, "done", force=True)
    (ctx.dir / "result.json").write_text(json.dumps({"outputs": outputs, "metrics": metrics,
                                                     "seconds": round(time.time() - t0, 1)}, indent=2, default=str))
    ctx.log(f"done in {time.time() - t0:.0f}s")
    offline_guard.assert_no_network_attempts()
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2]))
