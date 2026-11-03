# Phase 2: the first market release (MVP), then the R&D playground

> Status: planned. Phase 1 (v0.1) is built: [HUB_PLAN.md](HUB_PLAN.md), [HUB.md](HUB.md).

The long-term goal is a playground for deep-learning R&D on vision models: bring any model, change its architecture,
fine-tune or distill it, and let ModelLab find the best variant. Phase 2 starts with the smallest version of that
which outside teams can use and pay for: the **MVP**. The rest of the playground follows as updates after launch, in
the order customers ask for it.

**The MVP in one sentence:** connect your GPU machine, point ModelLab at your dataset and set a speed budget.
ModelLab finds the most accurate detector that fits, compares every candidate fairly, and your data never leaves
your machines.

## Decisions

| topic | decision |
|---|---|
| Customer | Vision teams with private data and their own NVIDIA GPUs on Linux. |
| Job | Find the most accurate detector that fits a speed budget, with comparisons you can trust. |
| Tasks | Object detection in the MVP. Classification and segmentation come after launch, and language and vision-language models later. |
| Models | The MVP offers a short, licence-checked list of models. It runs no custom code, so it needs no sandbox: only signed code runs, as in v0.1. Any model comes after launch. |
| Data | Stays on the customer's machines. The hub receives metrics, logs, names and fingerprints, but never images, annotations or weights. |
| Compute | The customer's own Linux GPU machines, as in v0.1. Cloud GPUs and clusters are phase 3. |
| AI assistant | Each user connects ModelLab to their own Claude account through MCP. The MVP may include an optional read-only version; tools that change things come after launch. ModelLab holds no Anthropic key. |
| Accounts | Organisations with invites and one paid plan. Members run on their own machines, as in v0.1. |
| Hosting | One hub instance on Railway. A second instance only when load requires it: the hub keeps some state in memory. |
| Offline | Not part of phase 2. The offline PC stays on v0.1, and a lighter offline edition will be planned separately. |
| Comparability | As in v0.1. Search trials are ordinary runs, so every result carries the same fingerprints and "not comparable" flags. |

## The MVP

### Already in v0.1

- Connect machines with one command; a hardware check with fixes; signed updates.
- Datasets registered where they are (Roboflow, COCO or YOLO layout) and fingerprinted.
- RF-DETR and LT-DETR detectors; distillation from DINOv2 and DINOv3 teachers.
- Experiments built from stages (fine-tune, distill, evaluate), sweeps and templates. This stays as the manual R&D
  mode for power users.
- The same evaluation for every model, a leaderboard, comparisons, "not comparable" flags.
- Live logs, cancel and re-queue, and accounts that an admin creates.

### 1. Find my best model (automated search)

This is the core of the MVP and its biggest piece of work.

- **You give:**
  - a dataset;
  - the machines to use (any of yours that hold the same dataset fingerprint);
  - a target machine, whose GPU sets the speed;
  - a speed budget (milliseconds per image);
  - a compute budget (GPU-hours).
- **What it tries:**
  - a model and size from the licence-checked list;
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

  In the MVP, a candidate that moves on restarts with the bigger budget. Continuing from its checkpoint would be
  faster and can come later.
- **Honest final numbers.**
  - Only the finalists are trained with the full budget and evaluated on the test split, with the standard evaluation.
  - The best one or two are repeated with other seeds, and the results show the spread.
- **Results.** A search page shows:
  - progress and how much of the budget is used;
  - a speed-vs-accuracy chart with the budget line and the best trade-offs (the Pareto front);
  - a recommendation: the most accurate model under the budget, one click away from export.
- **Built from what exists.**
  - Every trial is an ordinary run, with the same queue, logs, evaluation, leaderboard and comparability flags.
  - The search's state lives in the hub's database, so it survives hub and agent restarts.
  - A failed trial is retried once, then marked as failed.

### 2. Export the winner

- **Files on the machine:** an ONNX file and a TensorRT FP16 engine.
  - rfdetr exports ONNX, and LightlyTrain exports both formats.
  - TensorRT is added to the agent's pinned environment. LightlyTrain supports TensorRT 10.13, not 11.
- **Speed as deployed:** the finalists' speed is also measured as TensorRT engines, the way they would be deployed.
  The results show both numbers.
- **Model card** next to the files:
  - metrics and speed;
  - dataset fingerprint and recipe;
  - the base model's licence and any notice it requires (e.g. "Built with DINOv3");
  - a note that a TensorRT engine only runs on the GPU model and TensorRT version that built it.
- **Example code:** a short Python example for running the exported files.
- The files stay on the machine, and the web app shows where they are.

### 3. Dataset check

It runs on the machine when a dataset is added and again before a search starts.

- **Counts:** images, classes, boxes per class, images without boxes.
- **Errors:** boxes outside the image or with zero size, unknown class ids, images that appear in two splits.
- **Warnings:** strong class imbalance, very small splits.

Errors block a search. Warnings are shown alongside it.

### 4. Licence-checked model list

- RF-DETR Nano, Small, Medium and Large (Apache 2.0) are offered. XL and 2XL use Roboflow's PML licence, which
  requires a Roboflow plan, so they are not offered.
- DINOv2 (Apache 2.0) is the default teacher.
- Options built on DINOv3 (its teachers, LT-DETR) are labelled with their licence, which excludes military and
  weapons-related use and requires a "Built with DINOv3" notice. Users accept that licence before using them.
- Features that use LightlyTrain (distillation and LT-DETR) stay off until LightlyTrain's licence for customers is
  settled (see [Before launch](#before-launch)). Without it, the search covers RF-DETR fine-tuning only.

### 5. Privacy: only what we promise leaves the machine

- **Fix first:** today the `features` stage draws its PCA plot with a few downscaled dataset images next to the
  feature maps, and the agent uploads `.png` artifacts. Plots uploaded to the hub must contain no dataset images.
- **A privacy page** lists exactly what reaches the hub:
  - account details and machine hardware;
  - dataset names, paths, fingerprints and class names;
  - recipes, logs and metrics;
  - plots without dataset images;
  - the names, sizes and paths of checkpoints and exported files.

  Images, annotations, weights and checkpoints never reach it.

### 6. Accounts for outside customers

- Sign-up with email verification, and password reset.
- **Organisations:**
  - one owner, invited members, and two roles (admin, member);
  - the subscription belongs to the organisation;
  - members run on their own machines, as in v0.1 (sharing machines is phase 3).

  Sharing results inside an organisation is a small change and can come early if customers ask.
- **Billing:** Stripe, with one plan and a free trial. The price unit (per connected machine or per user) is decided
  with the first customers.
- **Operator page** for you: organisations, plans and usage.

### 7. Launch basics

- A quickstart that gets a new user to a first result in about 15 minutes, using a small sample dataset with a
  permissive licence and a short search.
- Docs for the search, export and dataset check.
- Error monitoring and an uptime check for the hub.
- Emails: verification, password reset, and when a search finishes or fails.
- Terms of service, the privacy page, and a support channel.

### Optional: Claude, read-only

- A read-only MCP server at `/mcp` that can read runs, logs, results, comparisons and searches.
- Each user connects it to their own Claude account with a personal access token, for example in Claude Code.
  Sign-in from claude.ai (OAuth) comes after launch.
- Because it only reads, it can't change anything.
- It is a thin layer over the existing API and makes a good demo. It ships if there is time.

### Before launch

These are not features, but they decide whether and how the MVP can launch.

- **Ownership:** written confirmation from your employer of who owns the code.
- **LightlyTrain** (distillation, LT-DETR): it is AGPL-3.0 or paid. Ask Lightly about a licence that covers customers
  who run it through ModelLab. Without one, the MVP launches with RF-DETR fine-tuning only, and distillation comes
  later.
- **Legal review:** DINOv3's licence, the AGPL question, the terms of service and the privacy page.
- **Design partners:** 3–5 outside vision teams use the MVP for free before the public launch. They can start as soon
  as search and export work: an admin creates their accounts, as in v0.1, so they don't wait for sign-up and billing.

### Order

1. Privacy fix and licence-checked model list. Both are small, and everything else builds on them.
2. Dataset check. It is small, and the search depends on clean data.
3. Find my best model.
4. Export the winner. Design partners start here.
5. Accounts and billing.
6. Launch basics, then the public launch.

The read-only Claude server can be built at any point.

## After launch: the R&D playground

These updates come in the order customers ask for them. The default order is:

1. **Claude through MCP, full:** sign-in from claude.ai (OAuth), plus tools that change things (draft recipes,
   queue runs, start searches, edit models). Claude asks the user before using them, and the hub logs each change as
   "via Claude". Users use it to debug failed runs, plan experiments, find papers and released weights, write custom
   modules and drive the architecture editor.
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
- **API first.** Every feature is a hub API used by both the web app and the MCP server.

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
- **Claude** drives the editor through MCP, and you accept or reject each change.

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
