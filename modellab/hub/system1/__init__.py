"""System 1: one sentence → one decision (docs/AGENTS_PLAN.md).

    actions.py    the action registry: what each button does, its tier and its parameters
    parse.py      numbers found in the sentence by code; System 1 only picks among them
    questions.py  the typed questions for one sentence on one page
    providers.py  decide(state, questions) → answers, through OpenRouter (decision models and chat models)
    route.py      code checks the answers: act on the fast path, or hand over
    evals/        the golden set and the side-by-side evaluation

Nothing here runs an action yet: this is the deciding half, measured before it is trusted.
"""
