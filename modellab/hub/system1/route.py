"""Code checks System 1's answers and decides what happens: the fast path, or a hand-over.

The fast path is taken only when one registered action was picked, both option orders agree, every value the action
requires was found, and the least certain answer it relies on clears the threshold. Everything else goes to Claude
(or back to the user as one short question), with System 1's picks as hints.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

from . import actions as A
from .questions import NOT_SAID


# How people name a setting. A sentence that names one without a value the router could use ("halve the batch
# size", "more epochs", "a faster machine") asks for thinking, not for a pick.
NAMED = {
    "batch_size": r"\bbatch(es)?\b|\bbs\b", "epochs": r"\bepochs?\b(?!\s+\d+\s+of\b)", "lr": r"\blr\b|learning[- ]rate",
    "image_size": r"image[- ]size|\bresolution\b|\binput[- ]size\b", "machine": r"\bmachines?\b|\bgpus?\b(?![- ]hours?)",
    "model": r"\bmodels?\b", "dataset": r"\bdatasets?\b", "speed_budget_ms": r"speed budget|\bbudget\b",
    "gpu_hours": r"gpu[- ]hours?",
}


def named_without_value(sentence: str, act: A.Action, found: set[str]) -> list[str]:
    return [p.name for p in act.params
            if p.name in NAMED and p.name not in found and re.search(NAMED[p.name], sentence, re.I)]


@dataclass
class Decision:
    fast: bool
    action: str  # an action id, or "none"
    values: dict = field(default_factory=dict)  # the action's parameters that the sentence gave
    confidence: float | None = None  # the least certain answer the decision relies on; None without probabilities
    reason: str = ""  # why it was handed over
    intent: str | None = None


def _pick(answers: dict, name: str):
    return (answers.get(name) or {}).get("pick")


def _fits(answers: dict, least: float) -> bool:
    a = answers.get("fits") or {}
    return a.get("p") >= least if a.get("p") is not None else a.get("pick") is True


def _several(answers: dict, most: float) -> bool:
    a = answers.get("several") or {}
    return a.get("p") > most if a.get("p") is not None else a.get("pick") is True


def current(screen: dict, run: str | None = None) -> dict:
    """The values that already hold: the form's, and the chosen run's own (its machine)."""
    cur = dict(screen.get("current") or {})
    row = next((r for r in screen.get("runs") or [] if r["id"] == run), None)
    return cur | ((row or {}).get("current") or {})


def changes(values: dict, screen: dict) -> dict:
    """Only what the sentence changes: a value equal to the one already there is no change."""
    cur = current(screen, values.get("run"))
    return {k: v for k, v in values.items() if str(cur.get(k)) != str(v)}


def route(answers: dict, screen: dict, threshold: float = 0.9, need_complete: bool = False,
          sentence: str = "", min_fits: float | None = None, max_several: float | None = None) -> Decision:
    """threshold applies to models that give probabilities; a model without them passes it (its trust comes from
    the evals alone). min_fits holds the model's own answer to "one listed action does what the user asked" to a
    probability (or, without probabilities, to a yes); max_several does the same for "the sentence asks for more
    than one thing" (at most this probability, or a no)."""
    intent = _pick(answers, "intent")
    action = _pick(answers, "action") or A.NONE
    act = A.BY_ID.get(action)
    if not act:
        return Decision(False, A.NONE, reason="no listed action", intent=intent)
    subject = screen.get("subject") or {}
    picked: dict[str, tuple] = {}  # param → (value, probability)
    for p in act.params:
        v = _pick(answers, p.name)
        if v in (None, NOT_SAID) and p.kind == subject.get("kind") and act.subject == p.kind and p.name == p.kind:
            picked[p.name] = (subject.get("id"), None)  # "this run": the page's own run, known by code
        elif v not in (None, NOT_SAID):
            picked[p.name] = (v, (answers.get(p.name) or {}).get("p"))
    # one number states one setting: when two settings claim the same number, the surer one keeps it
    clash = False
    numeric = [p.name for p in act.params if p.kind == "number" and p.name in picked]
    for name in numeric:
        rivals = [n for n in numeric if n != name and n in picked and picked[n][0] == picked[name][0]]
        if not rivals:
            continue
        ps = {n: picked[n][1] for n in rivals + [name]}
        if any(v is None for v in ps.values()):
            clash = True  # no probabilities to settle it
        elif ps[name] < max(ps.values()):
            del picked[name]
    kept = changes({k: v for k, (v, _) in picked.items()}, screen)
    ps = [(answers.get("action") or {}).get("p")] + [picked[k][1] for k in kept]
    known = [p for p in ps if p is not None]
    conf = min(known) if known else None
    d = Decision(False, action, kept, conf, intent=intent)
    have = {k for k in picked}  # a required value may equal the current one: it was still found
    if _pick(answers, "action_rev") != action:
        d.reason = "the two option orders disagree"
    elif intent not in ("do", "show"):
        d.reason = f"intent is {intent}"
    elif missing := [p.name for p in act.params if p.required and p.name not in have]:
        d.reason = "missing " + ", ".join(missing)
    elif clash:
        d.reason = "one number was read as two settings"
    elif intent == "do" and (vague := named_without_value(sentence, act, have)):
        d.reason = "names " + ", ".join(vague) + " without a value"
    elif min_fits is not None and not _fits(answers, min_fits):
        d.reason = "one action may not cover the request"
    elif max_several is not None and _several(answers, max_several):
        d.reason = "the sentence may ask for several things"
    elif conf is not None and conf < threshold:
        d.reason = "not confident enough"
    elif need_complete and _pick(answers, "complete") is False:
        d.reason = "the request may be incomplete"
    else:
        d.fast = True
    return d
