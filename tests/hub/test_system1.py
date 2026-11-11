"""System 1 without a network: the action registry, the number parser, the questions, the router and the scorer.
Model answers are recorded or built by hand; the real side-by-side run needs a key (modellab.hub.system1.evals.run)."""

import json
import re

import httpx2 as httpx
import pytest

from modellab.hub.system1 import actions as A
from modellab.hub.system1 import parse, questions
from modellab.hub.system1.evals import golden, score
from modellab.hub.system1.providers import OpenRouter
from modellab.hub.system1.questions import NOT_SAID
from modellab.hub.system1.route import route


def test_registry_is_consistent():
    A.check()
    assert {a.tier for a in A.ACTIONS} == set(A.TIERS)
    for kind in ("run", "queue", "leaderboard", "new", "searches", "search", "machines", "machine", "compare"):
        offered = A.on_page(kind)
        assert offered and offered[-1].id == "nav.open_page", kind  # global actions come last


def test_every_action_calls_an_api_the_hub_has(hub):
    """An action that runs something names the same route its button calls."""
    have = {(m.upper(), re.sub(r"\{[^}]+\}", "{}", path)) for path, ops in hub.openapi()["paths"].items() for m in ops}
    for a in A.ACTIONS:
        if a.api:
            method, path = a.api.split(" ", 1)
            assert (method, re.sub(r"\{[^}]+\}", "{}", path)) in have, a.id


def test_numbers_are_found_with_their_surroundings():
    n = parse.numbers("re-run this with batch size 4 on the 5090, lr 1e-4 for 2k steps and twelve epochs at 640px")
    assert list(n) == ["4", "5090", "1e-4", "2000", "12", "640"]
    assert "batch size 4" in n["4"]
    assert parse.numbers("no digits here") == {}
    assert list(parse.numbers("small-640-aerial with 0,5 and 30 epochs")) == ["640", "0.5", "30"]
    assert list(parse.numbers("4 and 4 again")) == ["4"]


def test_questions_offer_only_what_is_on_screen():
    state, q = questions.build("re-run this with batch size 4 on the 5090", golden.SCREENS["run_failed"])
    assert state["sentence"].startswith("re-run") and "selected_machine" in state
    assert list(q["action"]["criteria"]) == list(reversed(q["action_rev"]["criteria"]))
    assert "run.clone_edit" in q["action"]["criteria"] and A.NONE in q["action"]["criteria"]
    assert "search.start" not in q["action"]["criteria"]  # not on a run's page
    assert set(q["batch_size"]["criteria"]) == {"4", "5090", NOT_SAID}
    assert set(q["machine"]["criteria"]) == {"mach_7f2a", "mach_31bc", "mach_9d10", NOT_SAID}
    _, q = questions.build("just retry it", golden.SCREENS["run_failed"])
    assert "batch_size" not in q  # no number in the sentence: nothing to ask
    _, q = questions.build("cancel this search", golden.SCREENS["search_running"])
    assert set(q["search"]["criteria"]) == {"srch_1", NOT_SAID}


def _ans(**picks):
    out = {}
    for k, v in picks.items():
        pick, p = v if isinstance(v, tuple) else (v, 0.99)
        out[k] = {"pick": pick, "p": p, "probs": None}
    return out


def test_route_takes_the_fast_path_only_when_everything_holds():
    scr = golden.SCREENS["run_failed"]
    good = _ans(intent="do", action="run.clone_edit", action_rev="run.clone_edit", run=NOT_SAID, machine="mach_7f2a",
                batch_size="4", epochs=NOT_SAID, complete=True)
    d = route(good, scr)
    assert d.fast and d.action == "run.clone_edit"
    assert d.values == {"run": "run_a1", "machine": "mach_7f2a", "batch_size": "4"}  # "this run" is filled by code
    assert d.confidence == 0.99
    assert route(good | _ans(action_rev="run.requeue"), scr).reason == "the two option orders disagree"
    assert route(good | _ans(batch_size=("4", 0.6)), scr).reason == "not confident enough"
    assert route(good | _ans(batch_size=("4", 0.6)), scr, threshold=0.5).fast
    assert route(good | _ans(intent="explain"), scr).reason == "intent is explain"
    assert not route(good | _ans(action=A.NONE, action_rev=A.NONE), scr).fast
    assert not route(good | _ans(complete=False), scr, need_complete=True).fast
    assert not route({}, scr).fast
    # a required value that wasn't found: on the queue, "cancel it" names no run
    q = route(_ans(intent="do", action="run.cancel", action_rev="run.cancel", run=NOT_SAID), golden.SCREENS["queue"])
    assert not q.fast and q.reason == "missing run"
    # a chat model gives no probabilities: nothing to hold against the threshold
    chat = {k: v | {"p": None} for k, v in good.items()}
    assert route(chat, scr).fast and route(chat, scr).confidence is None


def test_golden_set_is_answerable():
    cases = golden.cases()
    assert len(cases) >= 300 and len({c["id"] for c in cases}) == len(cases)
    for c in cases:
        _, q = questions.build(c["sentence"], golden.SCREENS[c["screen"]])
        if c["action"] not in (None, A.NONE):
            assert c["action"] in q["action"]["criteria"], c
            for k, v in c["values"].items():
                assert A.BY_ID[c["action"]].param(k), c
                assert v in q[k]["criteria"], c


def _oracle(case):
    """The answers a perfect System 1 gives."""
    _, q = questions.build(case["sentence"], golden.SCREENS[case["screen"]])
    if case["action"] is None or (not case["fast"] and case["action"] != A.NONE):
        return _ans(intent=case["intent"][0], action=A.NONE, action_rev=A.NONE)  # it hands over
    a = _ans(intent=case["intent"][0], action=case["action"], action_rev=case["action"], complete=case["fast"])
    for name in q:
        if name not in a and q[name]["type"] == "choice":
            a |= _ans(**{name: case["values"].get(name, NOT_SAID)})
    return a


def test_a_perfect_model_scores_perfectly_and_a_reckless_one_does_not():
    cases = golden.cases()
    rows = {c["id"]: {"answers": _oracle(c), "seconds": 0.1, "cost": 0.0001} for c in cases}
    s = score.score_model(cases, rows, None, None)
    assert s["plain"]["mistakes"] == 0 and s["plain"]["coverage"] == 1.0 and s["intent"] == 1.0
    assert s["best"]["coverage"] == 1.0
    # always picks the first action, very sure of itself: every hand-over case becomes a confident mistake
    first = {}
    for c in cases:
        _, q = questions.build(c["sentence"], golden.SCREENS[c["screen"]])
        act = next(iter(q["action"]["criteria"]))
        first[c["id"]] = {"answers": _ans(intent="do", action=act, action_rev=act), "seconds": 0.1, "cost": 0.0}
    r = score.score_model(cases, first, None, None)
    assert r["plain"]["precision"] < 0.5 and r["best"] is None


def test_openrouter_answers_are_read_into_one_shape():
    def handler(req: httpx.Request) -> httpx.Response:
        body = json.loads(req.content)
        if req.url.path == "/api/alpha/decisions":
            assert set(body) == {"model", "state", "questions"}
            return httpx.Response(200, json={
                "model": "typesafe/jev-1.14-20261014", "provider": "TypeSafe",
                "answers": {"action": {"type": "choice", "choice": "run.requeue", "confidence": 0.9,
                                       "probabilities": {"run.requeue": 0.95, "none": 0.05}},
                            "complete": {"type": "noul", "noul": 0.3}, "fits": {"type": "refusal"}},
                "usage": {"input_tokens": 600, "output_tokens": 100, "cost": 0.00002}})
        assert body["response_format"]["json_schema"]["schema"]["properties"]["action"]["enum"] == ["run.requeue", "none"]
        return httpx.Response(200, json={"model": "anthropic/claude-sonnet-5.5", "provider": "Anthropic",
                                         "choices": [{"message": {"content": '{"action": "run.requeue", "complete": true, "fits": "x"}'}}],
                                         "usage": {"prompt_tokens": 900, "completion_tokens": 40, "cost": 0.004}})

    c = OpenRouter("k")
    c.http = httpx.Client(base_url="https://openrouter.ai", transport=httpx.MockTransport(handler))
    q = {"action": {"type": "choice", "instructions": "?", "criteria": {"run.requeue": "again", "none": "none"}},
         "complete": {"type": "noul", "instructions": "?"}, "fits": {"type": "noul", "instructions": "?"}}
    r = c.decide("typesafe/jev-1.14", {"sentence": "requeue"}, q)
    assert r.error is None and r.answers["action"] == {"pick": "run.requeue", "p": 0.95, "confidence": 0.9,
                                                       "probs": {"run.requeue": 0.95, "none": 0.05}}
    assert r.answers["complete"]["pick"] is False and r.answers["fits"]["pick"] is None and r.cost == 0.00002
    r = c.decide_chat("anthropic/claude-sonnet-5.5", {"sentence": "requeue"}, q)
    assert r.answers["action"]["pick"] == "run.requeue" and r.answers["action"]["p"] is None
    assert r.answers["complete"]["pick"] is True and r.answers["fits"]["pick"] is None  # not a boolean: dropped
