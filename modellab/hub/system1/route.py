"""Code checks System 1's answers and decides what happens: the fast path, or a hand-over.

The fast path is taken only when one registered action was picked, both option orders agree, every value the action
requires was found, and the least certain answer it relies on clears the threshold. Everything else goes to Claude
(or back to the user as one short question), with System 1's picks as hints.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from . import actions as A
from .questions import NOT_SAID


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


def route(answers: dict, screen: dict, threshold: float = 0.9, need_complete: bool = False) -> Decision:
    """threshold applies to models that give probabilities; a model without them passes it (its trust comes from
    the evals alone)."""
    intent = _pick(answers, "intent")
    action = _pick(answers, "action") or A.NONE
    act = A.BY_ID.get(action)
    if not act:
        return Decision(False, A.NONE, reason="no listed action", intent=intent)
    values, ps = {}, [(answers.get("action") or {}).get("p")]
    subject = screen.get("subject") or {}
    for p in act.params:
        v = _pick(answers, p.name)
        if v in (None, NOT_SAID) and p.kind == subject.get("kind") and act.subject == p.kind and p.name == p.kind:
            v = subject.get("id")  # "this run": the page's own run, known by code
        elif v not in (None, NOT_SAID):
            ps.append((answers.get(p.name) or {}).get("p"))
        if v not in (None, NOT_SAID):
            values[p.name] = v
    known = [p for p in ps if p is not None]
    conf = min(known) if known else None
    d = Decision(False, action, values, conf, intent=intent)
    if _pick(answers, "action_rev") != action:
        d.reason = "the two option orders disagree"
    elif intent not in ("do", "show"):
        d.reason = f"intent is {intent}"
    elif missing := [p.name for p in act.params if p.required and p.name not in values]:
        d.reason = "missing " + ", ".join(missing)
    elif conf is not None and conf < threshold:
        d.reason = "not confident enough"
    elif need_complete and _pick(answers, "complete") is False:
        d.reason = "the request may be incomplete"
    else:
        d.fast = True
    return d
