"""Recipes: YAML with named stages. A stage can consume an earlier stage's output with `{from: <stage>}`.

    name: teacher-sweep              # required
    description: ...
    dataset: coco-vehicles           # default dataset for every stage (stage-level `dataset:` overrides)
    seed: 42
    tags: [sweep]
    matrix:                          # optional: one run per combination; ${var} is substituted everywhere
      teacher: [dinov3/vits16, dinov3/vitb16]
    stages:
      - {name: distill, type: distill, student: rfdetr/nano, teacher: "${teacher}", budget: {epochs: 30}}
      - {name: finetune, type: finetune, model: rfdetr/nano, init: {from: distill}, budget: {epochs: 20, minutes: 90}}
      - {name: eval, type: eval, model: {from: finetune}}

Stage types and their fields (defaults in brackets):
  distill   student (rfdetr/*), init [stock] | {from}, teacher (teacher id | {from: <ltdetr finetune>}),
            image_size [student native; 448/672 for DINOv2 teachers], batch_size [32], lr, budget
  finetune  model (detector id), init [stock] | {from}, batch_size [8], lr, lr_encoder (rfdetr), grad_accum [1],
            image_size (ltdetr only [384]), budget
  eval      model (detector id = stock weights | {from}), split [test], label, latency [true], max_images
  features  models (list of rfdetr ids | {from}), teacher (optional), split [valid], size [384], pca [true], max_images
Budget: {epochs: N} and/or {minutes: M}. Minutes is a wall-clock cap; without epochs a nominal epoch count is used
for the LR schedule (distill 30, finetune 20) and training stops at the cap.
"""

from __future__ import annotations

import copy
import itertools
import re
from dataclasses import dataclass, field
from pathlib import Path

import yaml

from modellab import ROOT, catalog

STAGE_TYPES = ("distill", "finetune", "eval", "features")
DEFAULT_EPOCHS = {"distill": 30, "finetune": 20}
NAME_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{0,40}$")
VAR_RE = re.compile(r"\$\{(\w+)\}")
TEMPLATES_DIR = ROOT / "recipes"


class RecipeError(ValueError):
    pass


@dataclass
class Plan:
    """One expanded, validated run: the recipe text it came from + resolved stages."""

    name: str
    recipe: dict  # expanded recipe (matrix applied)
    stages: list[dict]
    matrix_values: dict = field(default_factory=dict)
    warnings: list[str] = field(default_factory=list)


def _subst(obj, vals: dict):
    if isinstance(obj, str):
        m = VAR_RE.fullmatch(obj)
        if m and m.group(1) in vals:
            return vals[m.group(1)]
        return VAR_RE.sub(lambda mm: str(vals[mm.group(1)]) if mm.group(1) in vals else mm.group(0), obj)
    if isinstance(obj, list):
        return [_subst(x, vals) for x in obj]
    if isinstance(obj, dict):
        return {k: _subst(v, vals) for k, v in obj.items()}
    return obj


def _ref(v) -> str | None:
    return v["from"] if isinstance(v, dict) and "from" in v else None


def load_text(text: str) -> dict:
    try:
        r = yaml.safe_load(text)
    except yaml.YAMLError as e:
        raise RecipeError(f"YAML error: {e}") from e
    if not isinstance(r, dict):
        raise RecipeError("recipe must be a YAML mapping")
    return r


def expand(recipe: dict) -> list[tuple[dict, dict]]:
    matrix = recipe.get("matrix") or {}
    if not isinstance(matrix, dict) or any(not isinstance(v, list) or not v for v in matrix.values()):
        raise RecipeError("matrix must map variable names to non-empty lists")
    keys = sorted(matrix)
    out = []
    for combo in itertools.product(*(matrix[k] for k in keys)) if keys else [()]:
        vals = dict(zip(keys, combo))
        r = _subst({k: v for k, v in recipe.items() if k != "matrix"}, vals)
        out.append((r, vals))
    return out


def _budget(st: dict, errs: list[str]) -> dict:
    b = st.get("budget") or {}
    if not isinstance(b, dict) or not set(b) <= {"epochs", "minutes"}:
        errs.append(f"{st['name']}: budget must be {{epochs: N}} and/or {{minutes: M}}")
        return {}
    for k in b:
        if not isinstance(b[k], (int, float)) or b[k] <= 0:
            errs.append(f"{st['name']}: budget.{k} must be > 0")
    out = {"epochs": int(b.get("epochs") or DEFAULT_EPOCHS[st["type"]]), "minutes": b.get("minutes")}
    out["epochs_given"] = "epochs" in b
    return out


def validate(recipe: dict, known_datasets: set[str] | None = None) -> tuple[list[dict], list[str], list[str]]:
    """-> (resolved stages, errors, warnings). Resolved stages carry defaults and producer info."""
    errs: list[str] = []
    warns: list[str] = []
    if not isinstance(recipe.get("name"), str) or not recipe["name"].strip():
        errs.append("recipe needs a name")
    stages_in = recipe.get("stages")
    if not isinstance(stages_in, list) or not stages_in:
        return [], errs + ["recipe needs a non-empty list of stages"], warns
    seed = recipe.get("seed", 42)
    if not isinstance(seed, int):
        errs.append("seed must be an integer")
    default_ds = recipe.get("dataset")
    produced: dict[str, dict] = {}  # stage name -> {"kind": ..., "model": detector id, "teacher_arch": ...}
    out: list[dict] = []
    for i, raw in enumerate(stages_in):
        if not isinstance(raw, dict):
            errs.append(f"stage #{i + 1} must be a mapping")
            continue
        st = copy.deepcopy(raw)
        name, typ = st.get("name"), st.get("type")
        if not isinstance(name, str) or not NAME_RE.match(name):
            errs.append(f"stage #{i + 1}: name must match {NAME_RE.pattern}")
            continue
        if name in produced or name in [s["name"] for s in out]:
            errs.append(f"{name}: duplicate stage name")
            continue
        if typ not in STAGE_TYPES:
            errs.append(f"{name}: type must be one of {STAGE_TYPES}")
            continue
        st["dataset"] = st.get("dataset") or default_ds
        if not st["dataset"]:
            errs.append(f"{name}: no dataset (set recipe.dataset or stage.dataset)")
        elif known_datasets is not None and st["dataset"] not in known_datasets:
            errs.append(f"{name}: unknown dataset {st['dataset']!r}")
        st["seed"] = seed
        before = len(errs)

        def need_ref(field_name: str, value, allowed_kinds: tuple[str, ...]) -> dict | None:
            ref = _ref(value)
            if ref is None:
                return None
            if ref not in produced:
                errs.append(f"{name}.{field_name}: from: {ref!r} is not an earlier stage")
                return None
            p = produced[ref]
            if p["kind"] not in allowed_kinds:
                errs.append(f"{name}.{field_name}: stage {ref!r} produces {p['kind']}, need {' or '.join(allowed_kinds)}")
                return None
            return p

        if typ == "distill":
            student = st.get("student", "rfdetr/nano")
            st["student"] = student
            det = catalog.DETECTORS.get(student)
            if not det or det.family != "rfdetr":
                errs.append(f"{name}: student must be one of {[k for k, d in catalog.DETECTORS.items() if d.family == 'rfdetr']}")
                det = None
            init = st.get("init", "stock")
            st["init"] = init
            if _ref(init):
                p = need_ref("init", init, ("rfdetr_ckpt",))
                if p and det and p["model"] != student:
                    errs.append(f"{name}.init: from {init['from']!r} is {p['model']}, student is {student}")
            elif init != "stock":
                errs.append(f"{name}.init must be 'stock' or {{from: <stage>}}")
            t = st.get("teacher")
            patch = 16
            if _ref(t):
                p = need_ref("teacher", t, ("ltdetr_ckpt",))
                if p and not p.get("teacher_arch"):
                    errs.append(f"{name}.teacher: {p['model']} has no DINOv3 ViT backbone to use as teacher")
                st["teacher_arch"] = p.get("teacher_arch") if p else None
            elif isinstance(t, str) and t in catalog.TEACHERS:
                patch = catalog.TEACHERS[t].patch
                st["teacher_arch"] = t
            else:
                errs.append(f"{name}.teacher must be a teacher id or {{from: <ltdetr finetune>}}; got {t!r}")
            if det:
                div = det.divisor * (7 if patch == 14 else 1)  # lcm(32, 14) = 224
                size = st.get("image_size") or (det.resolution if patch != 14 else max(448, -(-det.resolution // 224) * 224))
                if not isinstance(size, int) or size % div:
                    errs.append(f"{name}: image_size {size} must be a multiple of {div}"
                                + (" (DINOv2 teacher: patch 14 and student 32 -> 224)" if patch == 14 else ""))
                st["image_size"] = size
            st.setdefault("batch_size", 32)
            st["budget"] = _budget(st, errs)
            produced[name] = {"kind": "rfdetr_ckpt", "model": student}
        elif typ == "finetune":
            model = st.get("model")
            det = catalog.DETECTORS.get(model) if isinstance(model, str) else None
            if not det:
                errs.append(f"{name}.model must be a detector id, got {model!r}")
            init = st.get("init", "stock")
            st["init"] = init
            if _ref(init):
                kinds = ("rfdetr_ckpt",) if det and det.family == "rfdetr" else ("ltdetr_ckpt",)
                p = need_ref("init", init, kinds)
                if p and det and p["model"] != model:
                    errs.append(f"{name}.init: from {init['from']!r} is {p['model']}, model is {model}")
            elif init != "stock":
                errs.append(f"{name}.init must be 'stock' or {{from: <stage>}}")
            if det and det.family == "ltdetr":
                st["image_size"] = st.get("image_size") or det.resolution
                if st["image_size"] % 32:
                    errs.append(f"{name}: image_size must be a multiple of 32")
            elif "image_size" in st:
                warns.append(f"{name}: image_size is ignored for RF-DETR (fine-tunes at its native {det.resolution if det else '?'})")
            st.setdefault("batch_size", 8)
            st.setdefault("grad_accum", 1)
            st["budget"] = _budget(st, errs)
            if det:
                produced[name] = {"kind": f"{det.family}_ckpt", "model": model, "teacher_arch": det.dinov3_arch}
        elif typ == "eval":
            m = st.get("model")
            if _ref(m):
                p = need_ref("model", m, ("rfdetr_ckpt", "ltdetr_ckpt"))
                st["model_id"] = p["model"] if p else None
            elif isinstance(m, str) and m in catalog.DETECTORS:
                st["model_id"] = m
            else:
                errs.append(f"{name}.model must be a detector id (stock weights) or {{from: <stage>}}")
            st.setdefault("split", "test")
            if st["split"] not in ("test", "valid"):
                errs.append(f"{name}.split must be test or valid")
            st.setdefault("latency", True)
            st.setdefault("label", (m["from"] if _ref(m) else f"stock {m}") if m else name)
            produced[name] = {"kind": "metrics", "model": st.get("model_id")}
        elif typ == "features":
            models = st.get("models")
            if not isinstance(models, list) or not models:
                errs.append(f"{name}.models must be a non-empty list")
                models = []
            ids = []
            for j, m in enumerate(models):
                if _ref(m):
                    p = need_ref(f"models[{j}]", m, ("rfdetr_ckpt",))
                    ids.append(p["model"] if p else None)
                elif isinstance(m, str) and catalog.DETECTORS.get(m) and catalog.DETECTORS[m].family == "rfdetr":
                    ids.append(m)
                else:
                    errs.append(f"{name}.models[{j}] must be an rfdetr id or {{from: <stage>}}")
            st["model_ids"] = ids
            t = st.get("teacher")
            if t is not None and t not in catalog.TEACHERS:
                errs.append(f"{name}.teacher: unknown teacher {t!r}")
            st.setdefault("split", "valid")
            st.setdefault("pca", True)
            patch14 = t is not None and catalog.TEACHERS.get(t) and catalog.TEACHERS[t].patch == 14
            st.setdefault("size", 448 if patch14 else 384)
            if st["size"] % (224 if patch14 else 32):
                errs.append(f"{name}.size must be a multiple of {224 if patch14 else 32}")
            produced[name] = {"kind": "metrics"}
        if len(errs) == before:
            out.append(st)
    for st in out:
        if st["type"] in ("distill", "finetune") and st["budget"].get("minutes") and not st["budget"]["epochs_given"]:
            warns.append(f"{st['name']}: minutes-only budget; LR schedule assumes {st['budget']['epochs']} epochs")
    return out, errs, warns


def plan(text_or_dict, known_datasets: set[str] | None = None) -> tuple[list[Plan], list[str]]:
    """Expand + validate. Returns (plans, errors); errors are prefixed with the matrix combination."""
    recipe = load_text(text_or_dict) if isinstance(text_or_dict, str) else text_or_dict
    plans, errors = [], []
    for r, vals in expand(recipe):
        stages, errs, warns = validate(r, known_datasets)
        tag = ("[" + ", ".join(f"{k}={v}" for k, v in vals.items()) + "] ") if vals else ""
        errors += [tag + e for e in errs]
        name = r.get("name", "?") + (" " + tag.strip() if tag else "")
        plans.append(Plan(name=name, recipe=r, stages=stages, matrix_values=vals, warnings=[tag + w for w in warns]))
    return plans, errors


def templates() -> list[dict]:
    out = []
    for f in sorted(TEMPLATES_DIR.glob("*.yaml")):
        text = f.read_text()
        r = load_text(text)
        out.append({"id": f.stem, "name": r.get("name"), "description": r.get("description", ""), "yaml": text})
    return out


def to_yaml(recipe: dict) -> str:
    return yaml.safe_dump(recipe, sort_keys=False, default_flow_style=None, width=110)


def read(path: Path) -> str:
    return Path(path).read_text()
