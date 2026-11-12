"""The notebook: the lab's memory of what was asked, what was tried and what was learned (docs/PLATFORM.md).

An entry is a question or an idea in the user's words, the runs and searches that tested it, the answer with its
evidence, and a status: open, answered, or dropped (with the reason). Entries link to runs and searches instead of
copying their numbers, so an entry always shows the harness's own results. Negative results are kept.

Who writes:
    the user      on the Notebook page, at any time
    Claude        through its chat tools (yeti_actions.py), marked as written by Claude
    a loop        every search gets an entry of its own (author "loop"), answered from its recommendation when done

How runs and searches are linked:
    a run submitted with the tag  nb:<entry id>  is linked when it is queued (the forms add the tag)
    a search created with  notebook: <entry id>  is linked when it starts
    an existing run or search can be linked or unlinked on the entry's page
"""

from __future__ import annotations

import re
import statistics
import time

import sqlalchemy as sa
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from modellab import catalog
from modellab.hub import auth, db, model

STATUSES = ("open", "answered", "dropped")
AUTHORS = ("user", "claude", "loop")
TAG = "nb:"
ID_RE = re.compile(r"^[0-9a-f]{16}$")
router = APIRouter(prefix="/api")


# ---------------------------------------------------------------- entries

def _row(c: sa.Connection, user: dict, eid: str) -> dict:
    r = c.execute(sa.select(db.notebook).where(db.notebook.c.id == eid, db.notebook.c.owner_id == user["id"])).mappings().first()
    if r is None:
        raise HTTPException(404, "no such notebook entry")
    return dict(r)


def _clean(text: str | None, limit: int) -> str | None:
    if text is None:
        return None
    text = text.replace("\r\n", "\n").strip()
    return text[:limit] if text else None


def create(c: sa.Connection, user: dict, title: str, question: str, author: str = "user", plan: str | None = None) -> dict:
    title, question = _clean(title, 140), _clean(question, 4000)
    if not title or not question:
        raise HTTPException(422, "a notebook entry needs a title and a question")
    eid, now = db.new_id(), time.time()
    c.execute(db.notebook.insert().values(id=eid, owner_id=user["id"], title=title, question=question,
                                          plan=_clean(plan, 8000), answer=None, status="open", status_reason=None,
                                          author=author, updated_by=author, created=now, updated=now))
    return _row(c, user, eid)


def update(c: sa.Connection, user: dict, eid: str, by: str, **fields) -> dict:
    r = _row(c, user, eid)
    limits = {"title": 140, "question": 4000, "plan": 8000, "answer": 8000, "status_reason": 1000}
    vals: dict = {}
    for k, v in fields.items():
        if v is None:
            continue
        if k == "status":
            if v not in STATUSES:
                raise HTTPException(422, f"status must be one of {', '.join(STATUSES)}")
            vals["status"] = v
        elif k in limits:
            vals[k] = _clean(v, limits[k])
    if "title" in vals and not vals["title"] or "question" in vals and not vals["question"]:
        raise HTTPException(422, "a notebook entry needs a title and a question")
    status = vals.get("status", r["status"])
    if status == "dropped" and not (vals.get("status_reason") or r["status_reason"]):
        raise HTTPException(422, "say why the idea was dropped: dropped ideas are kept, with their reason")
    if status == "open" and "status" in vals:
        vals["status_reason"] = None
    if vals:
        c.execute(db.notebook.update().where(db.notebook.c.id == eid).values(**vals, updated_by=by, updated=time.time()))
    return _row(c, user, eid)


def delete(c: sa.Connection, user: dict, eid: str) -> None:
    _row(c, user, eid)
    c.execute(db.notebook_links.delete().where(db.notebook_links.c.entry_id == eid))
    c.execute(db.notebook.delete().where(db.notebook.c.id == eid))  # the runs and searches stay


# ---------------------------------------------------------------- links

def _check_ref(c: sa.Connection, user: dict, kind: str, ref: str) -> None:
    if kind == "run":
        model.get_run(c, user, ref)
    elif kind == "search":
        from modellab.hub import search

        search._row(c, user, ref)
    else:
        raise HTTPException(422, "kind must be run or search")


def link(c: sa.Connection, user: dict, eid: str, kind: str, ref: str) -> None:
    _row(c, user, eid)
    _check_ref(c, user, kind, ref)
    db.upsert(c, db.notebook_links, {"entry_id": eid, "kind": kind, "ref_id": ref, "added": time.time()},
              ["entry_id", "kind", "ref_id"])
    c.execute(db.notebook.update().where(db.notebook.c.id == eid).values(updated=time.time()))


def unlink(c: sa.Connection, user: dict, eid: str, kind: str, ref: str) -> None:
    _row(c, user, eid)
    c.execute(db.notebook_links.delete().where(db.notebook_links.c.entry_id == eid, db.notebook_links.c.kind == kind,
                                               db.notebook_links.c.ref_id == ref))


def link_from_tags(c: sa.Connection, user: dict, rids: list[str], tags: list[str]) -> None:
    """Runs queued with the tag nb:<entry id> join that entry, when it is the user's own."""
    for t in tags:
        eid = t[len(TAG):] if isinstance(t, str) and t.startswith(TAG) else None
        if not eid or not ID_RE.match(eid):
            continue
        if c.execute(sa.select(db.notebook.c.id).where(db.notebook.c.id == eid, db.notebook.c.owner_id == user["id"])).first():
            for rid in rids:
                link(c, user, eid, "run", rid)


# ---------------------------------------------------------------- searches: their own entries (the loop writes)

def for_new_search(c: sa.Connection, user: dict, s: dict, eid: str | None) -> str:
    """Link a search that just started to the entry it was started for, or give it an entry of its own."""
    if eid:
        link(c, user, eid, "search", s["id"])
        return eid
    spec = s["spec"]
    where = spec.get("machine_names", {}).get(spec.get("target_machine"), "the target machine")
    q = (f"Which detector is the most accurate on {spec['dataset']} within {spec['speed_ms']:g} ms per image on {where}? "
         f"Candidates: {', '.join(spec['models'])}" + (f"; distilled from {', '.join(spec['teachers'])}" if spec.get("teachers") else "")
         + ".")
    e = create(c, user, s["name"], q, author="loop")
    link(c, user, e["id"], "search", s["id"])
    return e["id"]


def _answer_from(rec: dict | None, row: dict) -> str | None:
    if not rec:
        return None
    det = catalog.DETECTORS.get(rec["model"])
    name = det.label if det else rec["model"]
    bits = [f"**{name} at {rec['image_size']} px**"]
    if rec.get("teacher"):
        bits.append(f"distilled from {rec['teacher']}")
    if rec.get("lr"):
        bits.append(f"learning rate {rec['lr']:g}")
    score = (f"mAP {100 * rec['map_test_mean']:.1f} on the test split" if rec.get("map_test_mean") is not None
             else f"mAP {100 * rec['map_valid_mean']:.1f} on the validation split")
    if rec.get("map_test_std") is not None:
        score += f" (± {100 * rec['map_test_std']:.1f} over {rec['runs']} seeds)"
    speed = f"{rec['latency_ms']:.2f} ms" + (f" on {rec['latency_device']}" if rec.get("latency_device") else "") \
        if rec.get("latency_ms") is not None else "speed not measured"
    text = f"Recommended {', '.join(bits)}: {score}, {speed}."
    if rec.get("early"):
        text += " The search stopped early, so this is the best of an unfinished round."
    return text + f" ([best run](/runs/{rec['best_run_id']}), [the search](/search/{row['id']}))"


def on_search_final(c: sa.Connection, sid: str) -> None:
    """A search finished: an entry the loop wrote for it gets the recommendation as its answer. Entries written by
    the user or by Claude are never overwritten: their answer is theirs to write."""
    row = c.execute(sa.select(db.searches).where(db.searches.c.id == sid)).mappings().first()
    if row is None or row["status"] != "done":
        return
    rec = db.loads(row["recommendation"])
    answer = _answer_from(rec, dict(row)) or (f"No answer: {row['message']}." if row["message"] else None)
    for (eid,) in c.execute(sa.select(db.notebook_links.c.entry_id).where(db.notebook_links.c.kind == "search",
                                                                          db.notebook_links.c.ref_id == sid)).all():
        e = c.execute(sa.select(db.notebook).where(db.notebook.c.id == eid)).mappings().first()
        if e and e["author"] == "loop" and not e["answer"] and answer:
            c.execute(db.notebook.update().where(db.notebook.c.id == eid).values(
                answer=answer, status="answered" if rec else "open", updated_by="loop", updated=time.time()))


# ---------------------------------------------------------------- reading

def _counts(c: sa.Connection, eids: list[str]) -> dict[str, dict]:
    out = {e: {"runs": 0, "searches": 0} for e in eids}
    if eids:
        for eid, kind, n in c.execute(sa.select(db.notebook_links.c.entry_id, db.notebook_links.c.kind, sa.func.count())
                                      .where(db.notebook_links.c.entry_id.in_(eids))
                                      .group_by(db.notebook_links.c.entry_id, db.notebook_links.c.kind)).all():
            out[eid]["runs" if kind == "run" else "searches"] = n
    return out


def _public(r: dict, counts: dict | None = None) -> dict:
    return {**{k: r[k] for k in ("id", "title", "question", "plan", "answer", "status", "status_reason", "author",
                                  "updated_by", "created", "updated")}, **(counts or {})}


def list_entries(c: sa.Connection, user: dict, q: str | None = None, status: str | None = None,
                 ref: tuple[str, str] | None = None, limit: int = 200) -> list[dict]:
    t = db.notebook
    sel = sa.select(t).where(t.c.owner_id == user["id"])
    if status in STATUSES:
        sel = sel.where(t.c.status == status)
    if q and q.strip():
        for word in q.strip().split()[:6]:
            pat = f"%{word[:60]}%"
            sel = sel.where(sa.or_(t.c.title.ilike(pat), t.c.question.ilike(pat), t.c.plan.ilike(pat), t.c.answer.ilike(pat)))
    if ref:
        sel = sel.where(t.c.id.in_(sa.select(db.notebook_links.c.entry_id).where(
            db.notebook_links.c.kind == ref[0], db.notebook_links.c.ref_id == ref[1])))
    rows = [dict(r) for r in c.execute(sel.order_by(t.c.updated.desc()).limit(limit)).mappings()]
    counts = _counts(c, [r["id"] for r in rows])
    return [_public(r, counts[r["id"]]) for r in rows]


def detail(c: sa.Connection, user: dict, eid: str) -> dict:
    from modellab.hub import search

    r = _row(c, user, eid)
    links = c.execute(sa.select(db.notebook_links).where(db.notebook_links.c.entry_id == eid)
                      .order_by(db.notebook_links.c.added)).mappings().all()
    names = model._machine_names(c, user)
    runs, searches = [], []
    for ln in links:
        try:
            if ln["kind"] == "run":
                s = model.run_summary(c, model.get_run(c, user, ln["ref_id"]), names)
                res = [x for x in model._result_rows(c, s["id"]) if x["map"] is not None]
                best = max(res, key=lambda x: x["map"], default=None)
                runs.append({k: s[k] for k in ("id", "name", "status", "dataset", "machine_name", "created", "tags", "error_tail")}
                            | {"best": None if not best else {k: best.get(k) for k in ("map", "label", "stage", "latency_ms",
                                                                                         "latency_device", "split", "model")}}
                            | {"progress": s["progress"]})
            else:
                p = search._public(search._row(c, user, ln["ref_id"]))
                searches.append({k: p[k] for k in ("id", "name", "status", "message", "recommendation", "trials", "created")})
        except HTTPException:
            continue  # deleted since: the link stays harmless
    out = _public(r, {"runs": len(runs), "searches": len(searches)})
    out.update(linked_runs=runs, linked_searches=searches,
               all_finished=bool(runs or searches) and all(x["status"] in model.FINAL for x in runs)
               and all(s["status"] != "running" for s in searches))
    return out


# ---------------------------------------------------------------- how long would it take?

def estimate(c: sa.Connection, user: dict, machine_id: str, dataset: str | None, model_id: str, epochs: int) -> dict:
    """Training time for one fine-tune, from the user's own finished fine-tunes of the same model: seconds per epoch
    per training image, the median over past runs (those on the same machine when there are any)."""
    m = model.get_machine(c, user, machine_id)
    d = next((x for x in model.machine_datasets(m) if x.get("name") == dataset), None)
    images = ((d or {}).get("train") or {}).get("images")
    rows = c.execute(sa.select(db.stages.c.started, db.stages.c.finished, db.stages.c.result, db.stages.c.name,
                               db.runs.c.resolved, db.runs.c.machine_id)
                     .join(db.runs, db.runs.c.id == db.stages.c.run_id)
                     .where(db.runs.c.owner_id == user["id"], db.stages.c.type == "finetune", db.stages.c.status == "done",
                            db.stages.c.started.is_not(None), db.stages.c.finished.is_not(None))
                     .order_by(db.stages.c.finished.desc()).limit(400)).mappings().all()
    per_image: dict[bool, list[float]] = {True: [], False: []}  # seconds per epoch per training image
    per_epoch: dict[bool, list[float]] = {True: [], False: []}  # seconds per epoch, on this same dataset
    for r in rows:
        res = db.loads(r["resolved"], {}) or {}
        st = next((s for s in res.get("stages", []) if s.get("name") == r["name"]), {})
        n = ((db.loads(r["result"], {}) or {}).get("metrics") or {}).get("train_images")
        ep = (st.get("budget") or {}).get("epochs")
        if st.get("model") != model_id or not ep or r["finished"] <= r["started"]:
            continue
        here, took = r["machine_id"] == machine_id, r["finished"] - r["started"]
        if n:
            per_image[here].append(took / (ep * n))
        if (st.get("dataset") or res.get("dataset")) == dataset:
            per_epoch[here].append(took / ep)
    out = {"model": model_id, "machine": m["name"], "dataset": dataset, "epochs": epochs, "train_images": images,
           "based_on_runs": 0, "same_machine": False, "seconds": None}
    for here in (True, False):  # the same machine first: GPUs differ more than anything else here
        if images and per_image[here]:
            out.update(seconds=round(statistics.median(per_image[here]) * epochs * images), based_on_runs=len(per_image[here]),
                       same_machine=here)
            return out
        if per_epoch[here]:
            out.update(seconds=round(statistics.median(per_epoch[here]) * epochs), based_on_runs=len(per_epoch[here]),
                       same_machine=here)
            return out
    out["note"] = (f"no finished fine-tune of {model_id} to estimate from" if not (per_image[True] or per_image[False])
                   else f"the number of training images of {dataset} on {m['name']} isn't known")
    return out


def fmt_duration(s: float | None) -> str:
    if s is None:
        return "unknown"
    if s < 90:
        return f"about {max(1, round(s))} s"
    if s < 5400:
        return f"about {round(s / 60)} min"
    return f"about {s / 3600:.1f} h"


# ---------------------------------------------------------------- API

class EntryIn(BaseModel):
    title: str = Field(min_length=1, max_length=140)
    question: str = Field(min_length=1, max_length=4000)
    plan: str | None = Field(None, max_length=8000)


class EntryPatch(BaseModel):
    title: str | None = Field(None, max_length=140)
    question: str | None = Field(None, max_length=4000)
    plan: str | None = Field(None, max_length=8000)
    answer: str | None = Field(None, max_length=8000)
    status: str | None = None
    status_reason: str | None = Field(None, max_length=1000)


class LinkIn(BaseModel):
    kind: str = Field(pattern="^(run|search)$")
    id: str = Field(min_length=1, max_length=100)


@router.get("/notebook")
def api_list(request: Request, q: str | None = None, status: str | None = None, run: str | None = None,
             search: str | None = None, user: dict = Depends(auth.current_user)):
    ref = ("run", run) if run else ("search", search) if search else None
    with request.app.state.engine.begin() as c:
        return list_entries(c, user, q, status, ref)


@router.post("/notebook")
def api_create(body: EntryIn, request: Request, user: dict = Depends(auth.current_user)):
    with request.app.state.engine.begin() as c:
        e = create(c, user, body.title, body.question, "user", body.plan)
        return detail(c, user, e["id"])


@router.get("/notebook/{eid}")
def api_detail(eid: str, request: Request, user: dict = Depends(auth.current_user)):
    with request.app.state.engine.begin() as c:
        return detail(c, user, eid)


@router.patch("/notebook/{eid}")
def api_update(eid: str, body: EntryPatch, request: Request, user: dict = Depends(auth.current_user)):
    with request.app.state.engine.begin() as c:
        update(c, user, eid, "user", **body.model_dump())
        return detail(c, user, eid)


@router.delete("/notebook/{eid}")
def api_delete(eid: str, request: Request, user: dict = Depends(auth.current_user)):
    with request.app.state.engine.begin() as c:
        delete(c, user, eid)
    return {"result": "deleted"}


@router.post("/notebook/{eid}/links")
def api_link(eid: str, body: LinkIn, request: Request, user: dict = Depends(auth.current_user)):
    with request.app.state.engine.begin() as c:
        link(c, user, eid, body.kind, body.id)
        return detail(c, user, eid)


@router.delete("/notebook/{eid}/links/{kind}/{ref}")
def api_unlink(eid: str, kind: str, ref: str, request: Request, user: dict = Depends(auth.current_user)):
    with request.app.state.engine.begin() as c:
        unlink(c, user, eid, kind, ref)
        return detail(c, user, eid)
