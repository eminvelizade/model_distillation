"""The typed questions for one sentence on one page.

    state      what a System 1 model reads: the sentence and what is on screen (lean: names, statuses, form values)
    questions  one Choice per thing to decide, each option with a description, plus two yes/no checks

Every question is answered in the same request. The action question is asked twice with the options in opposite
orders (`action` and `action_rev`): decision models lean toward the first option, and the fast path needs both to
agree.
"""

from __future__ import annotations

from . import actions as A
from . import parse

VERSION = 2  # of the questions' wording; results of different versions are not comparable
NOT_SAID = "not_said"
INTENTS = {
    "do": "Do something now: run, change, open, cancel, delete, export",
    "show": "Show where something is or how to do it, without doing it",
    "explain": "Explain a result, a failure, a number or a concept",
    "plan": "Plan or discuss an idea that needs several steps or experiments",
    "find": "Find a dataset, a model or a paper online",
    "talk": "Small talk, thanks, or something unrelated to the app",
}
ENTITY_KINDS = ("run", "search", "machine", "dataset")
PLURAL = {"run": "runs", "search": "searches", "machine": "machines", "dataset": "datasets"}
MODELS = {  # the catalog's detectors, by the names people use
    "rfdetr/nano": "RF-DETR Nano", "rfdetr/small": "RF-DETR Small", "rfdetr/medium": "RF-DETR Medium",
    "rfdetr/base": "RF-DETR Base", "rfdetr/large": "RF-DETR Large",
    "ltdetr/s": "LT-DETR S (DINOv3 ViT-S backbone)", "ltdetr/b": "LT-DETR B (DINOv3 ViT-B backbone)",
}


def _describe(kind: str, e: dict, here: bool) -> str:
    bits = [e["name"]] + [str(e[k]) for k in ("status", "model", "gpu", "detail") if e.get(k)]
    text = ", ".join(bits)
    return f"{text} (the {kind} this page is about)" if here else text


def build(sentence: str, screen: dict) -> tuple[dict, dict]:
    """(state, questions) for one sentence.

    screen: {"page": kind, "title": str, "subject": {"kind", "id"} | None, "form": {...} | None,
             "selected_machine": id | None, "runs"|"searches"|"machines"|"datasets": [{"id", "name", ...}]}
    Entity lists hold only what is on screen, in the order shown. The selected machine is left out of the state:
    no question needs it, and models took it for the machine the user meant. "current" (the form's values) and a run's own
    "current" are for the router, not for the model: they never enter the state.
    """
    kind = screen["page"]
    offered = A.on_page(kind)
    subject = screen.get("subject") or {}
    state = {"sentence": sentence, "page": screen.get("title") or A.PAGES.get(kind, kind)}
    if screen.get("form"):
        state["form"] = screen["form"]
    for k in ENTITY_KINDS:
        rows = screen.get(PLURAL[k]) or []
        if rows:
            state[PLURAL[k] + "_on_screen"] = [_describe(k, e, subject.get("kind") == k and subject.get("id") == e["id"])
                                        for e in rows]
    options = {a.id: a.description for a in offered} | {
        A.NONE: "None of these: a question, small talk, or a request that no listed action carries out"}
    q: dict[str, dict] = {
        "intent": {"type": "choice", "instructions": "What does the user want from the assistant?", "criteria": INTENTS},
        "action": {"type": "choice", "instructions": "Which action is the user's sentence about?", "criteria": options},
        "action_rev": {"type": "choice", "instructions": "Which action is the user's sentence about?",
                       "criteria": dict(reversed(options.items()))},
    }
    params: dict[str, A.Param] = {}
    for a in offered:
        for p in a.params:
            params.setdefault(p.name, p)
    nums = parse.numbers(sentence)
    for name, p in params.items():
        if p.kind in ENTITY_KINDS:
            rows = screen.get(PLURAL[p.kind]) or []
            crit = {e["id"]: _describe(p.kind, e, subject.get("kind") == p.kind and subject.get("id") == e["id"])
                    for e in rows}
        elif p.kind == "page":
            crit = dict(A.PAGES)
        elif p.kind == "model":
            crit = dict(MODELS)
        else:
            crit = {v: f'{v}, in "{ctx}"' for v, ctx in nums.items()}
        if not crit:
            continue  # nothing to pick from: code already knows the answer is "not said"
        crit[NOT_SAID] = "The sentence doesn't say" if p.kind != "run" or name != "run_b" else "No second run is named"
        q[name] = {"type": "choice", "instructions": p.ask, "criteria": crit}
    q["several"] = {"type": "noul",
                    "instructions": "The sentence asks for more than one thing to be done.",
                    "criteria": {"true": "Two or more actions (\"do this, then that\"), or one action on several "
                                         "items (\"all\", \"both\", \"every\", \"the last two\")",
                                 "false": "Exactly one action on one item, or no action at all"}}
    q["fits"] = {"type": "noul", "instructions": "One of the listed actions does what the user asked.",
                 "criteria": {"true": "A listed action matches the request",
                              "false": "No listed action matches, or the request needs more than one action"}}
    q["complete"] = {"type": "noul",
                     "instructions": "The sentence can be carried out as it stands, without asking the user anything.",
                     "criteria": {"true": "Every value it needs is stated or is already on screen",
                                  "false": "A needed value is missing, relative (\"half\", \"more\") or ambiguous"}}
    return state, q
