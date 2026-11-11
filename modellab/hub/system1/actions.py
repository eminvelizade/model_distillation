"""The action registry: every action an agent may take, described once.

An action is something a button in the web app already does. The registry gives it an id, a description (what a
System 1 model reads), a tier (how much approval it needs), its parameters and the hub API it calls. ⌘K, Yeti and the
MCP server are meant to read the same list.
"""

from __future__ import annotations

from dataclasses import dataclass, field

TIERS = ("look", "draft", "act", "careful")

# Page kinds, as pages register them with useYetiPage (modellab/hub/yeti.py: PAGE_KINDS).
PAGES = {
    "leaderboard": "Leaderboard: every finished result, ranked",
    "queue": "Runs: the queue and the history of runs",
    "new": "New experiment: the form that builds and queues a run",
    "searches": "Find best model: the form that starts a search, and the list of searches",
    "machines": "Machines: the GPU machines and their state",
    "compare": "Compare: results side by side",
    "team": "Team: users and their roles",
}


@dataclass(frozen=True)
class Param:
    name: str
    kind: str  # "run" | "search" | "machine" | "dataset" | "page" | "model" | "number"
    ask: str  # the question a System 1 model is asked
    required: bool = False
    unit: str | None = None


@dataclass(frozen=True)
class Action:
    id: str
    title: str
    description: str
    tier: str
    pages: tuple[str, ...]  # page kinds that show it; "*" = everywhere
    params: tuple[Param, ...] = ()
    api: str | None = None  # the hub API the button calls
    undo: str | None = None
    subject: str | None = None  # the entity the action is about, when it sits on that entity's page or row

    def param(self, name: str) -> Param | None:
        return next((p for p in self.params if p.name == name), None)


RUN = Param("run", "run", "Which run does the user mean?", required=True)
SEARCH = Param("search", "search", "Which search does the user mean?", required=True)
MACHINE = Param("machine", "machine", "Which machine does the user mean?")
DATASET = Param("dataset", "dataset", "Which dataset does the user mean?")
BATCH = Param("batch_size", "number", "Which number is the batch size the user asks for?")
EPOCHS = Param("epochs", "number", "Which number is the count of training epochs the user asks for?")
SIZE = Param("image_size", "number", "Which number is the input image size (resolution) the user asks for?", unit="px")
LR = Param("lr", "number", "Which number is the learning rate the user asks for?")
BUDGET = Param("speed_budget_ms", "number", "Which number is the speed budget in milliseconds per image?", unit="ms")
GPU_H = Param("gpu_hours", "number", "Which number is the cap on GPU hours?", unit="h")
MODEL = Param("model", "model", "Which detector model does the user ask for?")


def _req(p: Param) -> Param:
    return Param(p.name, p.kind, p.ask, True, p.unit)


ACTIONS: tuple[Action, ...] = (
    # look: changes nothing
    Action("nav.open_page", "Open a page", "Go to one of the app's main pages (leaderboard, runs, new experiment, find best model, machines, compare, "
           "team)", "look", ("*",),
           (Param("page", "page", "Which page does the user want to open?", required=True),)),
    Action("nav.open_run", "Open a run", "Open the page of one run, with its logs, metrics and figures", "look",
           ("queue", "leaderboard", "compare", "search"), (RUN,)),
    Action("nav.open_search", "Open a search", "Open the page of one search, with its progress and its recommendation",
           "look", ("searches",), (SEARCH,)),
    Action("nav.open_machine", "Open a machine", "Open the page of one GPU machine, with its datasets and checks",
           "look", ("machines",), (_req(MACHINE),)),
    Action("results.compare", "Compare results", "Put two results side by side on the Compare page", "look",
           ("leaderboard", "run", "queue"), (RUN, Param("run_b", "run", "Which other run should it be compared with?"))),
    # draft: prepares a change; nothing runs
    Action("experiment.fill", "Fill in New experiment",
           "Fill in the New experiment form (model, dataset, machine, training settings) without queueing it", "draft",
           ("new",), (MODEL, DATASET, MACHINE, EPOCHS, BATCH, SIZE, LR)),
    Action("search.fill", "Fill in Find best model",
           "Fill in the Find best model form (dataset, target machine, speed budget, budgets) without starting it",
           "draft", ("searches",), (DATASET, MACHINE, BUDGET, EPOCHS, GPU_H)),
    Action("run.clone_edit", "Clone & edit a run",
           "Run a run again WITH a change: copy its recipe into New experiment so the batch size, epochs, image "
           "size, learning rate or machine can be changed. Use this whenever the sentence changes any setting or "
           "names another machine", "draft", ("run", "queue", "leaderboard"),
           (RUN, MACHINE, BATCH, EPOCHS, SIZE, LR), subject="run"),
    Action("dataset.fill_add", "Add a dataset", "Open Add dataset on a machine, to register a dataset folder",
           "draft", ("machine", "machines"), (MACHINE,), subject="machine"),
    # act: runs something reversible
    Action("run.queue", "Queue the experiment", "Queue the experiment that is filled in on the New experiment form",
           "act", ("new",), api="POST /api/runs", undo="cancel the run"),
    Action("run.requeue", "Re-queue a run", "Run the exact same run again with nothing changed: same settings, same machine. Not for a request "
           "that changes anything", "act", ("run", "queue"),
           (RUN,), api="POST /api/runs/{id}/requeue", undo="cancel the run", subject="run"),
    Action("run.cancel", "Cancel a run", "Stop a run that is queued or running", "act", ("run", "queue"), (RUN,),
           api="POST /api/runs/{id}/cancel", undo="re-queue the run", subject="run"),
    Action("search.start", "Start the search", "Start the search that is filled in on the Find best model form",
           "act", ("searches",), api="POST /api/searches", undo="cancel the search"),
    Action("search.cancel", "Cancel a search", "Stop a search that is running, and its queued trials", "act",
           ("search", "searches"), (SEARCH,), api="POST /api/searches/{id}/cancel", subject="search"),
    Action("run.export", "Export a model", "Export a finished run's model to ONNX and TensorRT files on its machine",
           "act", ("run", "leaderboard", "search"), (RUN,), api="POST /api/runs/{id}/export", subject="run"),
    Action("dataset.recheck", "Re-check a dataset", "Run the dataset check again on a dataset of this machine", "act",
           ("machine",), (_req(DATASET),), api="POST /api/machines/{id}/commands", subject="machine"),
    Action("machine.selfcheck", "Run the self-check", "Run the hardware and software self-check on a machine", "act",
           ("machine", "machines"), (MACHINE,), api="POST /api/machines/{id}/commands", subject="machine"),
    Action("weights.fetch", "Fetch weights", "Download the pretrained weights the catalog needs onto a machine", "act",
           ("machine",), (MACHINE,), api="POST /api/machines/{id}/commands", subject="machine"),
    # careful: can't be undone
    Action("run.delete", "Delete a run", "Delete a run and its files on the machine, for good", "careful",
           ("run", "queue"), (RUN,), api="DELETE /api/runs/{id}", subject="run"),
    Action("search.delete", "Delete a search", "Delete a search, for good", "careful", ("search", "searches"),
           (SEARCH,), api="DELETE /api/searches/{id}", subject="search"),
    Action("dataset.remove", "Remove a dataset", "Remove a dataset from a machine's list (its files stay)", "careful",
           ("machine",), (_req(DATASET),), api="POST /api/machines/{id}/commands", undo="add the dataset again",
           subject="machine"),
)

BY_ID = {a.id: a for a in ACTIONS}
NONE = "none"


def on_page(kind: str) -> list[Action]:
    """The actions a page offers, page-specific ones first."""
    return [a for a in ACTIONS if kind in a.pages] + [a for a in ACTIONS if "*" in a.pages]


def check() -> None:
    assert len(BY_ID) == len(ACTIONS), "duplicate action id"
    for a in ACTIONS:
        assert a.tier in TIERS, a.id
        assert a.tier in ("look", "draft") or a.api, f"{a.id}: an action that runs something names its API"
        assert all(p in PAGES or p in ("*", "run", "search", "machine") for p in a.pages), a.id
