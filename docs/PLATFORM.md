# ModelLab: Agents, Harness and Loops

> Status: how the platform is organised. Plans: [AGENTS_PLAN.md](AGENTS_PLAN.md) (agents),
> [PHASE2_PLAN.md](PHASE2_PLAN.md) (the harness, and the first loop). What's built, and how to use it:
> [HUB.md](HUB.md).

ModelLab has three parts:

| part | its job | today | next |
|---|---|---|---|
| **Agents** | help you develop | Yeti explains the app and your results (read-only) | Yeti goes hands-on: guides you, acts when you approve, fixes failures, turns your ideas into experiments, finds datasets and models online |
| **Harness** | the tools to build and improve models | the engine, the hub, your machines, datasets, one evaluation for every model, export | any Hugging Face model, an architecture editor, more data sources, more tasks |
| **Loops** | run dozens of experiments to find the next breakthrough | Find best model | faster and wider searches, failed trials that fix themselves, research loops |

```
 you ── a sentence, an idea, an approval ──▶ Agents     explain · guide · act · fix · find
                                             │    │
                        start, watch and fix │    │ actions: the same API as the web app
                                             ▼    │
                                           Loops  │     many experiments; results pick the next round
                                             │    │
               ordinary runs, one evaluation │    │
                                             ▼    ▼
                                            Harness     engine · hub · datasets · models · evaluation · export
                                             │
                                             ▼
                                     your GPU machines  data, weights and checkpoints stay here
```

You can always use the harness directly, through the web app. Agents and loops add speed and scale on top of it,
never a second way around it.

## Rules that hold the parts together

1. **The harness is the ground truth.** Every action an agent takes is a hub API call the web app makes too. Every
   experiment a loop runs is an ordinary run. Every result comes from the same evaluation, with the same fingerprints
   and "not comparable" flags. An agent or a loop is only as good as the harness's numbers.
2. **Agents act for you, with your approval.** What they may do on their own, what takes a tap and what is out of
   reach: [AGENTS_PLAN.md](AGENTS_PLAN.md#approval-tiers).
3. **Loops spend budgets you set**: machines, epochs, GPU hours. Inside the budget they decide what runs next;
   outside it, they ask.
4. **A breakthrough has to survive the harness.** With dozens of experiments, some look better by luck. A loop
   chooses on the validation split, reports the test split with other seeds, and calls a result better only when it
   beats the best comparable one by more than the seed noise.
5. **Data stays on your machines.** Agents and loops see names, settings, metrics and logs; never images,
   annotations, weights or checkpoints.

**Naming.** "Agents" here means the AI assistants. The program on each GPU PC, called "the agent" in the code and in
[HUB.md](HUB.md), is the **machine agent** wherever both could be meant. Code names stay as they are
(`modellab/agent/`, `modellab-agent`).

## Agents

The assistants that help you develop: Bloom and the other mascots, one engine with six characters.

**Today:**
- Answers how-to questions and explains results: why a search recommended its model, why a run scored what it did or
  failed, PCA and attention figures, how two runs differ.
- Read-only. Runs on Claude with your own Claude account, in the app or in a Claude app through the MCP server.

**Next** ([AGENTS_PLAN.md](AGENTS_PLAN.md)):
- **Two systems.** A System One model, which makes fast typed decisions, turns one sentence into the right component
  and action in under a second. Claude, as System 2, plans, writes recipes, diagnoses new failures and searches.
- **Guide**: highlights the component to click, step by step.
- **Act**: one sentence, and the action is highlighted and filled in; it runs when you approve.
- **Fix**: failed runs, search trials, dataset checks and machine checks get a diagnosis and a ready fix.
- **Collaborate**: explain an idea in your own words; it drafts the experiment or the search, you approve, it runs
  and reports back.
- **Find**: datasets, models and papers online, hooked up through the harness's import paths.

## Harness

The tools to build and improve models, and the guarantees that make their results trustworthy.

**Today:**
- **Engine**: recipes of chained stages (`finetune`, `distill`, `eval`, `features`, `speed`), sweeps and templates;
  RF-DETR and LT-DETR detectors with DINOv2 / DINOv3 teachers.
- **Hub and machine agents**: the queue, live logs, cancel and re-queue, hardware checks with fixes, signed updates.
- **Datasets**: registered where they are, fingerprinted and checked.
- **Evaluation**: the same images and metric code for every model; the leaderboard, Compare, "not comparable" flags.
- **Export**: ONNX, a TensorRT FP16 engine and a model card.

**Next** ([PHASE2_PLAN.md](PHASE2_PLAN.md)):
- **Foundations**: the model spec, a task layer, a general trainer, environments per model family, a sandbox,
  secrets, a live machine channel, and every feature as a hub API. New: the **action registry**, so every button's
  action is also there for ⌘K, Yeti and Claude apps.
- **Model library** (Hugging Face models, uploads), **Data** (Hugging Face datasets, a viewer), the **architecture
  editor**, classification and segmentation.
- **Phase 3**: cloud GPUs and clusters.

## Loops

Loop engineering is the design of loops in which many experiments run and their results decide what runs next: what
a loop may try, how it spreads its budget, when it stops, and what counts as a real improvement.

**Today:**
- **Find best model**: timing against a speed budget, rounds of successive halving, seed repeats and a
  recommendation, over every machine that holds the same data ([HUB.md](HUB.md#7-find-my-best-model)).
- **Sweeps** expand one experiment into many runs. Nothing feeds back between those runs, so a sweep is a batch, not
  a loop.

**Next** (to be planned in detail; this order unless something else is more useful):
1. **Faster rounds**: a trial that moves on continues from its checkpoint instead of restarting.
2. **Self-healing**: a trial that fails for a known reason gets the agents' fix and one retry, inside the loop's
   budget ([AGENTS_PLAN.md](AGENTS_PLAN.md#fix-when-something-fails)).
3. **Wider search spaces**: anything the model spec can describe (Hugging Face models, architecture variants), once
   the model library and the editor exist.
4. **Research loops**: a question in your words and a budget. Each round, the agent proposes the next experiments
   from the last results, and you can step in at any point. A loop keeps its question, its runs and its answer
   together, as a notebook entry.
5. **More compute**: cloud GPUs and clusters (phase 3) let a loop run wider.

## Where things are written down

| part | plan | built, and how to use it |
|---|---|---|
| Agents | [AGENTS_PLAN.md](AGENTS_PLAN.md) | [HUB.md §8](HUB.md#8-yeti-the-assistant) |
| Harness | [PHASE2_PLAN.md](PHASE2_PLAN.md), [HUB_PLAN.md](HUB_PLAN.md) | [HUB.md](HUB.md), [MODELLAB.md](MODELLAB.md) |
| Loops | this file, and [PHASE2_PLAN.md §1](PHASE2_PLAN.md#1-find-my-best-model-automated-search) | [HUB.md §7](HUB.md#7-find-my-best-model) |
