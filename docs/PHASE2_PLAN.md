# Phase 2: the core of the R&D playground, then the rest of it

> Status: in progress. The core (search, export, dataset check, privacy fix) and Yeti, the assistant, are built, see
> "The core" below.
> Phase 1 (v0.1): [HUB_PLAN.md](HUB_PLAN.md), [HUB.md](HUB.md).
> Yeti hands-on, the agents part: [AGENTS_PLAN.md](AGENTS_PLAN.md). How agents, the harness and loops fit together:
> [PLATFORM.md](PLATFORM.md).

The long-term goal is a playground for deep-learning R&D on vision models: bring any model, change its architecture,
fine-tune or distill it, and let ModelLab find the best variant.

**Until v1.0, ModelLab is a personal tool**: one owner, their own GPU machines, nothing published or sold. Accounts
for outside users, billing, licensing and launch work wait until a release is meant for others.

**The core in one sentence:** connect your GPU machine, point ModelLab at your dataset and set a speed budget.
ModelLab finds the most accurate detector that fits, compares every candidate fairly, and your data never leaves
your machines.

## Decisions

| topic | decision |
|---|---|
| Use | A personal tool until v1.0. No billing, sign-up or licensing work before a public release. |
| Job | Find the most accurate detector that fits a speed budget, with comparisons you can trust. |
| Tasks | Object detection first. Classification and segmentation next; language and vision-language models later. |
| Models | Every model in the catalog (RF-DETR, LT-DETR; DINOv2 and DINOv3 teachers). Any Hugging Face model or custom code comes later, with a sandbox. |
| Data | Stays on your machines. The hub receives metrics, logs, names and fingerprints, but never images, annotations or weights. |
| Compute | Your own Linux GPU machines, as in v0.1. Cloud GPUs and clusters are phase 3. |
| AI assistant | Yeti, on each user's own Claude account: an API key from their Claude Console account (stored encrypted on the hub) for the in-app chat, or a Claude app connected to ModelLab's MCP server with OAuth. Read-only first, then hands-on: a System One model for fast one-sentence actions and Claude for the rest ([AGENTS_PLAN.md](AGENTS_PLAN.md)). |
| Hosting | One hub instance on Railway (it keeps some state in memory). |
| Offline | Not part of phase 2. The offline PC stays on v0.1; a lighter offline edition will be planned separately. |
| Comparability | As in v0.1. Search trials are ordinary runs, so every result carries the same fingerprints and "not comparable" flags. |

## The core (built)

### Already in v0.1

- Connect machines with one command; a hardware check with fixes; signed updates.
- Datasets registered where they are (Roboflow, COCO or YOLO layout) and fingerprinted.
- RF-DETR and LT-DETR detectors; distillation from DINOv2 and DINOv3 teachers.
- Experiments built from stages (fine-tune, distill, evaluate), sweeps and templates: the manual R&D mode.
- The same evaluation for every model, a leaderboard, comparisons, "not comparable" flags.
- Live logs, cancel and re-queue.


### 1. Find my best model (automated search)

The heart of the playground: on the **Find best model** page.

- **You give:**
  - a dataset;
  - the machines to use (any of yours that hold the same dataset fingerprint);
  - a target machine, whose GPU sets the speed;
  - a speed budget (milliseconds per image);
  - the full training budget in epochs, the number of rounds and seed repeats, and optionally a GPU-hour cap.
- **What it tries:**
  - a model and size from the catalog;
  - an input size;
  - a learning rate;
  - with or without distillation, and from which teacher.

  Each candidate is a small model spec (model, input size, teacher). This is the first version of the model spec
  described under [Foundations](#foundations), so later features extend it instead of replacing it.
- **Speed first.** A model's speed doesn't depend on its training. So before anything trains, the search measures
  every candidate's speed on the target GPU (a few minutes) and drops those over the budget.
- **Then accuracy, in rounds (successive halving).**
  1. Every remaining candidate trains briefly and is scored on the validation split.
  2. The best part of them gets a bigger budget.
  3. Repeat until only the finalists are left.

  A candidate that moves on restarts with the bigger budget. Continuing from its checkpoint would be
  faster and can come later.
- **Honest final numbers.**
  - Only the finalists are trained with the full budget and evaluated on the test split, with the standard evaluation.
  - The best one or two are repeated with other seeds, and the results show the spread.
- **Results.** A search page shows:
  - progress and how much of the budget is used;
  - a speed-vs-accuracy chart with the budget line, every candidate's timing, and each round's trials;
  - a recommendation: the most accurate model under the budget, one click away from export.
- **Built from what exists.**
  - Every trial is an ordinary run, with the same queue, logs, evaluation, leaderboard and comparability flags.
  - The search's state lives in the hub's database, so it survives hub and agent restarts.
  - A failed trial drops out of its round (re-queue its run to retry it); a round where every trial failed stops
    the search with the first error.

### 2. Export the winner

- **Files on the machine:** an ONNX file, and a TensorRT FP16 engine when TensorRT (`trtexec`) is installed on the
  machine. rfdetr and LightlyTrain export the ONNX; `trtexec` builds the engine.
- **Speed as deployed:** the exported model's speed is also measured as a TensorRT engine, the way it would be
  deployed. The export shows both numbers.
- **Model card** next to the files:
  - metrics and speed;
  - dataset fingerprint and recipe;
  - a note that a TensorRT engine only runs on the GPU model and TensorRT version that built it.
- **Example code:** a short Python example for running the exported files.
- The files stay on the machine, and the web app shows where they are.

### 3. Dataset check

It runs on the machine when a dataset is added or imported, and again with the re-check button.

- **Counts:** images, classes, boxes per class, images without boxes.
- **Errors:** boxes outside the image or with zero size, unknown class ids, images that appear in two splits.
- **Warnings:** strong class imbalance, very small splits.

Errors block a search. Warnings are shown alongside it.

### 4. Privacy: only what we promise leaves the machine

- **Fix first:** today the `features` stage draws its PCA plot with a few downscaled dataset images next to the
  feature maps, and the agent uploads `.png` artifacts. Plots uploaded to the hub must contain no dataset images.
- **A privacy page** lists exactly what reaches the hub:
  - account details and machine hardware;
  - dataset names, paths, fingerprints and class names;
  - recipes, logs and metrics;
  - plots without dataset images;
  - the names, sizes and paths of checkpoints and exported files.

  Images, annotations, weights and checkpoints never reach it.
- **Yeti** sends Claude only what its tools return when the user asks (names, settings, metrics, log tails, the PCA
  and attention figures above), with the user's own Claude account. Never datasets, images or checkpoints.


### How it was built

- **`speed` stage** (`modellab/stages/speed.py`): times an architecture at an input size without training it (RF-DETR
  from its stock weights, LT-DETR built without weights), with the same latency code as the eval stage.
- **RF-DETR at any input size**: `finetune` and `eval` accept `image_size` for RF-DETR too (a multiple of 32).
- **Search controller** (`modellab/hub/search.py`, table `searches`): advances when a trial run finishes and when the
  web app reads a search; writes only on the revision it read, so two calls can't start the same round twice.
- **Export** (`modellab/export.py`, agent command `export`): ONNX for both families; a TensorRT FP16 engine and its
  latency when `trtexec` is installed on the machine (TensorRT isn't part of the agent's environment: its pip
  packages need NVIDIA's own index); `preprocess.json`, `infer_onnx.py`, `model_card.md/json`. The agent environment
  gained `onnx`, `onnxscript` and `onnxslim`, which LightlyTrain's exporter needs.
- **Dataset check** (`modellab.datasets.check`): runs with every dataset add, import and re-check on the machine.

### 5. Yeti, the assistant (built)

A cute ice-blue yeti in the corner of every page: help with ModelLab, and explanations of results (explainable AI).

- **Help**: how pages, stages, searches, datasets, machines and export work, from a guide built into the system prompt
  (`modellab/hub/yeti_guide.md`) and the user's own data.
- **Explanations**: Claude reads deterministic evidence instead of computing it: why a search recommended its model
  (speed headroom, round rankings and cutoffs, marginal gain per model and input size, distillation and learning-rate
  effects, seed noise, margin over the runner-up, caveats), runs (results against comparable ones, per-class
  strengths, failures and logs), comparisons, the leaderboard, and feature figures (PCA and attention images are sent
  as images).
- **Attention maps** (`modellab/attention.py`): the features stage now also records where each backbone's last global
  self-attention layer looks, how much of it lands on objects, and how close it is to the teacher's.
- **Suggestions**: pages with something to explain make Yeti wave once with an offer; "Explain" buttons sit next to
  recommendations, results, figures, failures and checks.
- **Claude**: the in-app chat uses the user's Claude Console API key (encrypted at rest); Claude apps connect to the
  MCP server at `/mcp` with OAuth (claude.ai, Desktop, mobile, Claude Code). Same read-only tools either way.

### Next

1. The rest of the playground below, starting with Yeti hands-on ([AGENTS_PLAN.md](AGENTS_PLAN.md)).

## Next: the rest of the R&D playground

Updates in whatever order is most useful. Item 1 belongs to the agents part of ModelLab, the rest to the harness
([PLATFORM.md](PLATFORM.md)). The default order is:

1. **Yeti hands-on** ([AGENTS_PLAN.md](AGENTS_PLAN.md)): an action registry shared by every button, ⌘K, Yeti and
   the MCP server; a System One model that turns one sentence into the right action in under a second, and Claude
   for plans, recipes, diagnosis and search. Yeti guides by highlighting components, acts when the user approves
   (logged "via Yeti"), fixes failed runs, turns ideas into experiments, and finds datasets and models online.
   Writing custom modules and driving the architecture editor come once those exist.
2. **[Foundations](#foundations)**, built when the first feature that needs them starts.
3. **[Model library](#model-library)**.
4. **[Data](#data)**.
5. **[Architecture editor](#architecture-editor)**.
6. **Classification and segmentation.**

### Foundations

- **Model spec.** A model becomes a versioned, fingerprinted description instead of a fixed catalog entry:
  - parts: backbone, neck and head, plus any inserted blocks;
  - for each part: where it comes from (`hf:<repo>@<revision>`, `timm:<name>`, `catalog:<id>`, `upload:<id>` or
    `custom:<module>`), its starting weights, whether it is frozen, and a learning-rate multiplier;
  - a version is its parent plus a list of recorded edits: swap, insert, remove, replace a layer type, or set a
    value.
- **Task layer.** Detection, classification and segmentation each define their dataset format, prediction format and
  evaluation:
  - detection: today's COCO evaluation;
  - classification: top-1 and top-5 accuracy, per-class accuracy, confusion matrix;
  - segmentation: mIoU and per-class IoU.

  Speed, size and memory are measured the same way for every task.
- **General trainer.** One training loop for any spec: bf16, gradient accumulation, EMA, per-layer learning rates,
  freezing schedules, LoRA, budgets, resuming, and several GPUs in one machine. RF-DETR and LT-DETR keep their own
  verified trainers.
- **Environments per model family.**
  - The base environment stays signed.
  - Each model family adds pinned extras with their own lockfile.
  - uv builds them the first time they are needed and caches them by lockfile hash, as `modellab/agent/update.py`
    already does for the base environment.
- **Sandbox** for untrusted code: Hugging Face models with their own code, uploads, code written with Claude,
  pickled checkpoints. An untrusted run gets:
  - no network;
  - read-only data and weights;
  - write access to its own run folder only;
  - no access to tokens or the home folder.

  The leading option is bubblewrap with the GPU devices passed through. Test it on Ubuntu 22.04 and 24.04 first.
- **Secrets.** Each user's Hugging Face token is stored encrypted in the hub. The agent receives it only for
  downloads, and run code never sees it.
- **Live machine channel.** The folder picker's long-poll broker (`modellab/hub/browse.py`) becomes a general way to
  ask a machine something and get the answer in seconds.
- **API first.** Every feature is a hub API used by both the web app and the MCP server, and every button registers
  its action in the action registry that ⌘K and Yeti use too
  ([AGENTS_PLAN.md](AGENTS_PLAN.md#the-action-registry-how-the-agent-clicks)).

### Model library

- **Import from Hugging Face:** `transformers` and `timm` models, pinned to a revision, preferring safetensors files,
  with licence and gating shown.
- **Upload:** weights, plus optional code that runs in the sandbox.
- **Fine-tune, evaluate and search** any model in the library: full fine-tuning, freezing, per-layer learning rates,
  LoRA.
- **Distill:**
  - DINOv2 or DINOv3 teacher → any backbone, through LightlyTrain's custom-model support (to be verified, as phase 1
    did);
  - any other teacher → our own feature-distillation loop;
  - output (logit) distillation for classification.

### Data

- **Import** from Hugging Face datasets (repo id and revision), and from Pascal VOC and image-folder layouts.
- **Mapping step.** Hugging Face detection datasets don't share one format, so import asks which fields hold the
  image, the boxes and the labels. Claude can propose the mapping. The dataset is then converted, split and
  fingerprinted, as today.
- **Viewer:** sample images with their boxes or masks, class balance, and the spread of box sizes.

### Architecture editor

- **Block-level editing:** swap, insert, remove or change blocks in backbone → neck → head; build a model from
  scratch with a library of blocks; write custom Python modules (sandboxed) for anything else.
- **Weights report** for every version: how much is still pretrained, and which parts are new, reset or adapted.
- **Quick check** on a chosen machine in seconds: output shape per block, parameter count, FLOPs, memory, speed, and
  whether ONNX export works.
- **Versions and lineage:** every run points at the exact version it trained.
- **Yeti** drives the editor: its edits are registered actions ([AGENTS_PLAN.md](AGENTS_PLAN.md)), which Claude apps
  reach through MCP too. You accept or reject each change.

## Phase 3 and later

- **Cloud GPUs.**
  - First, rent a cloud machine yourself and pair it like a PC. This needs a container mode for the agent, since
    RunPod- and Vast-style machines have no systemd.
  - Then, the hub starts and stops cloud machines itself, with spending caps.
  - Cloud checkpoints go to a storage bucket.
  - Training has to resume after interruptions, for cheap interruptible machines.
- **Clusters.**
  - Share machines with teammates by invitation.
  - The owner decides who can queue work, quotas, time windows, priority, and whether sandboxed code may run.
  - A teammate's dataset is copied to your machine only with explicit consent.
- **Team workspaces:** shared models, datasets and leaderboards.
- **Offline edition:** a separate, lighter app on its own branch.
- **Language and vision-language models.**
