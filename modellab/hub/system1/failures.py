"""Fix: known failures, each with a fix that is a registered action (docs/AGENTS_PLAN.md, "Fix").

    1. matched by code   a catalogue of signatures: a pattern on the error, what it means, and a fix
    2. near matches      the decision model picks a signature (or "none of these") when no pattern matches
    3. everything else   Claude reads the logs, as before

A fix is never applied here. It is a decision, in the same shape as a one-sentence decision (service.py), that the
web app carries out when the user presses its button: a draft opens Clone & edit filled in, an act runs after the
press. A run started from a fix carries the tag `fix:<signature>`, so the catalogue can say how often a fix worked.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Callable

from . import actions as A

FIX_TAG = "fix:"


@dataclass(frozen=True)
class Signature:
    id: str
    title: str  # the diagnosis, as a short noun phrase
    pattern: str  # a regex on the error text (case-insensitive); "" = not matched by text
    explain: str  # what happened, in plain words
    hint: str  # what the decision model reads when it looks for a near match
    fix: Callable[[dict], dict | None]  # context → {"action", "values", "extra", "changes", "note"} | None


def _stage(ctx: dict) -> dict | None:
    """The stage that failed, from the run's resolved recipe."""
    stages = (ctx.get("resolved") or {}).get("stages") or []
    name = ctx.get("failed_stage")
    return next((s for s in stages if s.get("name") == name), None) or \
        next((s for s in reversed(stages) if s.get("type") in ("finetune", "distill")), None)


def _clone(ctx: dict, sig: str, values: dict, changes: list[dict], note: str) -> dict:
    return {"action": "run.clone_edit", "values": {"run": ctx["run_id"], **values}, "extra": {"tag": FIX_TAG + sig},
            "changes": changes, "note": note}


def _oom(ctx: dict) -> dict | None:
    st = _stage(ctx)
    if not st or not isinstance(st.get("batch_size"), int) or st["batch_size"] < 2:
        return None  # a batch of 1 can't be halved: a smaller image or model is a judgement call, for Claude
    old, new = st["batch_size"], st["batch_size"] // 2
    values = {"batch_size": str(new)}
    changes = [{"name": "batch_size", "label": "Batch size", "value": f"{old} → {new}"}]
    note = "Half the batch needs about half the memory."
    if st.get("type") == "finetune" and str(st.get("model", "")).startswith("rfdetr"):
        accum = int(st.get("grad_accum") or 1)
        values["grad_accum"] = str(accum * 2)
        changes.append({"name": "grad_accum", "label": "Gradient accumulation", "value": f"{accum} → {accum * 2}"})
        note += " Twice the gradient accumulation keeps the effective batch the same, so the result stays comparable."
    return _clone(ctx, "oom", values, changes, note)


def _nan(ctx: dict) -> dict | None:
    st = _stage(ctx)
    lr = st.get("lr") if st else None
    if not isinstance(lr, (int, float)) or lr <= 0:
        return None  # the library's default rate isn't known here
    new = f"{lr / 2:g}"
    return _clone(ctx, "nan", {"lr": new}, [{"name": "lr", "label": "Learning rate", "value": f"{lr:g} → {new}"}],
                  "Half the learning rate is the usual first try. If it turns NaN again, look at the data.")


def _machine(action: str, note: str) -> Callable[[dict], dict | None]:
    def fix(ctx: dict) -> dict | None:
        if not ctx.get("machine_id"):
            return None
        return {"action": action, "values": {"machine": ctx["machine_id"]}, "extra": {}, "changes": [], "note": note}
    return fix


def _recheck(ctx: dict) -> dict | None:
    if not ctx.get("machine_id") or not ctx.get("dataset"):
        return None
    return {"action": "dataset.recheck", "values": {"dataset": ctx["dataset"]}, "extra": {"machine": ctx["machine_id"]},
            "changes": [], "note": "The check says what is missing. If the folder moved, add the dataset again from "
                                   "its new place, then re-queue this run."}


def _weights(ctx: dict) -> dict | None:
    if not ctx.get("machine_id"):
        return None
    ids = list(dict.fromkeys(re.findall(r"weights fetch ([\w./-]+)", ctx.get("error") or "")))
    ids = [i for i in ids if i in ctx.get("known_weights", ids)] or ctx.get("missing_weights") or []
    if not ids:
        return None
    return {"action": "weights.fetch", "values": {"machine": ctx["machine_id"]}, "extra": {"ids": ids[:8]},
            "changes": [{"name": "weights", "label": "Weights", "value": ", ".join(ids[:8])}],
            "note": "When the download has finished, re-queue this run."}


def _requeue(ctx: dict) -> dict | None:
    return {"action": "run.requeue", "values": {"run": ctx["run_id"]}, "extra": {}, "changes": [],
            "note": "Stages that finished are kept; it resumes at the first unfinished one."}


CATALOG: tuple[Signature, ...] = (
    Signature("oom", "Out of GPU memory", r"CUDA out of memory|OutOfMemoryError|CUDA error: out of memory",
              "The batch didn't fit in the GPU's memory.",
              "The GPU ran out of memory (VRAM) while training or evaluating", _oom),
    Signature("open_files", "Too many open files", r"received 0 items of ancdata|Too many open files|\[Errno 24\]",
              "The data loader hit the machine's open-files limit. It is a limit of the machine, not of the run.",
              "A data-loader crash from the operating system's limit on open files or file descriptors",
              _machine("machine.selfcheck", "The self-check shows the limit and the command that raises it.")),
    Signature("shm", "Too little shared memory",
              r"shared memory|/dev/shm|killed by signal: Bus error|Bus error|unable to (open|allocate) shared",
              "Data-loader workers pass batches through /dev/shm, and it is too small on this machine.",
              "A data-loader worker crash from too little shared memory (/dev/shm), often a bus error in Docker",
              _machine("machine.selfcheck", "The self-check shows the size of /dev/shm and how to raise it.")),
    Signature("disk", "The disk is full", r"No space left on device|\[Errno 28\]|Disk quota exceeded",
              "The machine ran out of disk space while writing checkpoints or logs.",
              "Writing a file failed because the disk or quota is full",
              _machine("nav.open_machine", "Its page shows the free space. Delete old runs' files there, then re-queue.")),
    Signature("dataset_missing", "The dataset folder is missing or incomplete",
              r"missing \(expected Roboflow layout|images missing, e\.g\.|_annotations\.coco\.json|"
              r"No such file or directory: '[^']*(train|valid|test|images|labels)",
              "The dataset's files aren't where they were when it was added.",
              "Dataset files, images or annotation files were not found on the machine", _recheck),
    Signature("weights_missing", "Model weights are missing", r"weights .*missing|teacher weights missing|failed to fetch http",
              "A pretrained weight file this recipe needs isn't on the machine.",
              "Pretrained model or teacher weight files are missing or could not be downloaded", _weights),
    Signature("driver", "The NVIDIA driver is too old or not working",
              r"driver version is insufficient|NVIDIA-SMI has failed|no kernel image is available|Found no NVIDIA driver|"
              r"CUDA driver initialization failed",
              "PyTorch couldn't use the GPU with the driver installed on this machine.",
              "The GPU driver is missing, too old, or doesn't match the GPU or CUDA version",
              _machine("machine.selfcheck", "The self-check names the driver it found and the version it needs (570 or newer).")),
    Signature("nan", "The loss turned NaN", r"loss (is|became|turned) nan|nan loss|loss is not finite|non-finite loss|Loss is NaN",
              "Training diverged: the loss stopped being a number.",
              "Training diverged: the loss became NaN, infinite or not finite", _nan),
    Signature("interrupted", "The run was interrupted", "",
              "The machine or its agent stopped while this run was going (a restart, a shutdown, an update).",
              "", _requeue),
)
BY_ID = {s.id: s for s in CATALOG}
NEAR = [s for s in CATALOG if s.pattern]  # the ones a text can look like


def match(error: str | None) -> Signature | None:
    """The first catalogue entry whose pattern is in the error text."""
    if not error:
        return None
    return next((s for s in NEAR if re.search(s.pattern, error, re.I)), None)


def near_question(error: str) -> tuple[dict, dict]:
    """(state, questions) for the decision model: which known failure, if any, does this error look like?"""
    lines = [ln.rstrip() for ln in error.strip().splitlines() if ln.strip()]
    state = {"error": "\n".join(lines[-12:])[-1500:]}
    crit = {s.id: s.hint for s in NEAR} | {A.NONE: "None of these: a different error, or not enough to tell"}
    q = {"failure": {"type": "choice", "instructions": "Which known failure does this error show?", "criteria": crit},
         "failure_rev": {"type": "choice", "instructions": "Which known failure does this error show?",
                         "criteria": dict(reversed(crit.items()))}}
    return state, q


def near_pick(answers: dict, threshold: float) -> tuple[Signature | None, float | None]:
    """The model's pick, when both option orders agree and it is sure enough."""
    a, b = answers.get("failure") or {}, answers.get("failure_rev") or {}
    p = a.get("p")
    if a.get("pick") in BY_ID and a.get("pick") == b.get("pick") and p is not None and p >= threshold:
        return BY_ID[a["pick"]], p
    return None, p


def check() -> None:
    assert len(BY_ID) == len(CATALOG)
    for s in CATALOG:
        if s.pattern:
            re.compile(s.pattern)
