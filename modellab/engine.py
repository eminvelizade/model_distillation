"""Submitting recipes: validate, expand the matrix, create one queued run per combination."""

from __future__ import annotations

import secrets
import time

from modellab import datasets, recipe, store, weights


def preview(text: str) -> dict:
    """For the UI's live preview / `modellab validate`: errors, warnings, runs that would be created."""
    try:
        plans, errors = recipe.plan(text, known_datasets=set(datasets._load()))
    except recipe.RecipeError as e:
        return {"ok": False, "errors": [str(e)], "warnings": [], "runs": []}
    runs = []
    for p in plans:
        model_ids = [s.get("student") or s.get("model_id") or (s.get("model") if isinstance(s.get("model"), str) else None)
                     for s in p.stages]
        model_ids += [s["teacher"] for s in p.stages if isinstance(s.get("teacher"), str)]
        model_ids += [m for s in p.stages for m in (s.get("models") or []) if isinstance(m, str)]
        try:
            missing = weights.missing([m for m in model_ids if m])
        except KeyError:
            missing = []
        runs.append({"name": p.name, "stages": [{"name": s["name"], "type": s["type"]} for s in p.stages],
                     "missing_weights": missing, "matrix": p.matrix_values})
    return {"ok": not errors, "errors": errors, "warnings": [w for p in plans for w in p.warnings], "runs": runs}


def submit(text: str, tags: list[str] = ()) -> list[str]:
    plans, errors = recipe.plan(text, known_datasets=set(datasets._load()))
    if errors:
        raise recipe.RecipeError("; ".join(errors))
    group = f"g{time.strftime('%Y%m%d%H%M%S')}{secrets.token_hex(2)}" if len(plans) > 1 else None
    ids = []
    for p in plans:
        resolved = {"name": p.name, "recipe_name": p.recipe.get("name"), "description": p.recipe.get("description", ""),
                    "dataset": p.recipe.get("dataset"), "seed": p.recipe.get("seed", 42), "matrix": p.matrix_values,
                    "warnings": p.warnings, "stages": p.stages}
        all_tags = list(dict.fromkeys([*(p.recipe.get("tags") or []), *tags]))
        ids.append(store.create_run(p.name, p.recipe.get("name", ""), recipe.to_yaml(p.recipe), resolved, group, all_tags))
    return ids
