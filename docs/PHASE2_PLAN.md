# Phase 2: the R&D playground

> Status: planned. Phase 1 (v0.1) is built: [HUB_PLAN.md](HUB_PLAN.md), [HUB.md](HUB.md).

Phase 1 made one workflow easy: fine-tune and distill two detector families on your own GPUs, then compare them
fairly. Phase 2 turns ModelLab into a playground for deep-learning R&D on vision models:

- bring any vision model, or build your own;
- change its architecture;
- fine-tune or distill it;
- let ModelLab search for the variant that does best on your data within your speed budget.

Claude works alongside you through your own Claude account.

## Decisions

| topic | decision |
|---|---|
| Scope | Vision only: detection, classification and segmentation. Tracking comes later. Language and vision-language models are not in phase 2, but the design is not tied to vision where it doesn't need to be. |
| Compute | Your own Linux GPU machines, as in phase 1. One run per machine; a run may use several GPUs in that machine. Cloud GPUs and clusters move to phase 3. |
| AI assistant | Not built into the hub. ModelLab serves an MCP server, and each user connects it to their own Claude account (claude.ai, Claude Desktop or Claude Code). ModelLab holds no Anthropic key and pays for no AI usage. |
| Offline | Phase 2 needs internet (Hugging Face, Claude). The offline PC stays on v0.1. A separate, lighter offline edition will be planned later, on its own branch. |
| Comparability | Every result records four fingerprints: the model, the environment, the dataset and the evaluation version. Runs that differ in any of them are flagged "not comparable", as today. |
| Trust | Signed code and plain weight files run as today. Everything else runs in a sandbox (see 2.0): Hugging Face models that bring their own code, uploaded code, code written with Claude, pickled checkpoints. |
| Licences | Every model and dataset shows its licence. Gated models download with the user's own Hugging Face token. |

## 2.0 Foundations

Everything below depends on these. They come first and are mostly invisible.

- **Model spec.** A model becomes a versioned, fingerprinted description instead of a fixed catalog entry:
  - parts: backbone, neck and head, plus any inserted blocks;
  - for each part: where it comes from (`hf:<repo>@<revision>`, `timm:<name>`, `catalog:<id>`, `upload:<id>` or
    `custom:<module>`), its starting weights (pretrained, random, or from an earlier run), whether it is frozen, and a
    learning-rate multiplier;
  - a version is its parent plus a list of recorded edits: swap, insert, remove, replace a layer type, or set a
    value. Every model can then be rebuilt exactly and compared with its parent.

  Today's RF-DETR and LT-DETR entries become specs too.
- **Task layer.** Detection, classification and segmentation each define their dataset format, prediction format and
  evaluation:
  - detection: today's COCO evaluation;
  - classification: top-1 and top-5 accuracy, per-class accuracy, confusion matrix;
  - segmentation: mIoU and per-class IoU.

  Latency, parameter count and peak GPU memory are measured the same way for every task.
- **General trainer.** One training loop for any spec:
  - bf16 mixed precision, gradient accumulation, EMA;
  - per-layer learning rates, freezing schedules, LoRA (small add-on weights instead of the whole model);
  - epoch or wall-clock budgets (today's hooks);
  - checkpoints that a run can resume from;
  - several GPUs in one machine.

  RF-DETR and LT-DETR keep their own trainers (rfdetr's and LightlyTrain's), because those are tuned and verified.
- **Environments per model family.**
  - The base environment stays signed, as today.
  - Each model family adds pinned extras (for example a `transformers` or `timm` version) with their own lockfile.
  - uv builds the extras the first time they're needed and caches them by lockfile hash.

  This extends `modellab/agent/update.py`, which already identifies environments by lockfile hash. Phase 1 already
  needed it once: LightlyTrain needs albumentations 1.3.1 and rfdetr needs 1.4.
- **Sandbox.** An untrusted run gets:
  - no network;
  - datasets and weights mounted read-only;
  - write access to its own run folder only;
  - no access to tokens or the home folder.

  The leading option is bubblewrap (Linux user namespaces), with the GPU devices passed through. Some distributions
  (recent Ubuntu) may need a one-time admin step. Test on Ubuntu 22.04 and 24.04 before choosing.
- **Secrets.** Each user's Hugging Face token is stored encrypted in the hub. The agent receives it only for
  downloads, and run code never sees it.
- **Live machine channel.** The folder picker's long-poll broker (`modellab/hub/browse.py`) becomes a general way to
  ask a machine something and get the answer in seconds, without waiting in the queue.
- **API first.** Every phase 2 feature is a hub API. The web app is one client and the MCP server is another.

## 2.1 Claude through MCP

- **Connecting.** The hub serves an MCP server at `/mcp` (streamable HTTP).
  - Users add it to Claude as a custom connector and sign in with their ModelLab account (OAuth).
  - Claude Code can also use a personal access token created on the Account page.
  - Each token belongs to one user, can be revoked, and reaches only that user's own runs, machines and models.
- **Tools** mirror the hub API:
  - reading: runs, logs (the end of each log and the lines around errors), results and comparisons, leaderboards,
    machines and their hardware reports, datasets, models, recipe templates;
  - changing: draft and validate recipes, queue, cancel and re-queue runs, edit model specs, run quick checks,
    register datasets.
- **Safety.**
  - Changing tools are marked as such, so Claude asks the user before using them unless the user has allowed them.
  - The hub logs every change made through MCP as "via Claude".
  - Logs, model cards and papers are text from outside ModelLab. Claude sees it as tool output, which is another
    reason changing tools stay behind a confirmation.
- **What users do with it:**
  - debug a failed run: an "Ask Claude" button on the run copies a prompt with the run's link;
  - explain and compare results;
  - plan experiments and searches;
  - find papers and their released weights with Claude's own web search;
  - write custom modules;
  - drive the architecture editor, where Claude's edits show up live in the open page.
- **Usage** counts against each user's own Claude plan.
- **Early start.** The reading tools only need phase 1 data, so they can ship first.

## 2.2 Model library

- **Import from Hugging Face.** `transformers` and `timm` models by repo id, pinned to a revision, preferring
  safetensors files. Licence and gating are shown.
- **Upload.** Weights (safetensors, or torch files loaded with weights only), plus optional code, which runs in the
  sandbox.
- **Fine-tune and evaluate** any model in the library on the three tasks with the general trainer: full fine-tuning,
  freezing, per-layer learning rates, LoRA.
- **Distill**:
  - DINOv2 or DINOv3 teacher → any backbone, through LightlyTrain's custom-model support (to be verified against the
    pinned LightlyTrain version, as phase 1 did);
  - any other teacher → our own feature-distillation loop;
  - output (logit) distillation for classification.

  Distilling one detector into another comes later.
- RF-DETR and LT-DETR keep their verified pipelines.

## 2.3 Data

- **Import** from Hugging Face datasets (repo id and revision), or from COCO, YOLO, Pascal VOC and image-folder
  layouts.
- **Mapping step.** Hugging Face detection datasets don't share one format. Import shows the dataset's fields and asks
  which ones hold the image, the boxes and the labels; Claude can propose the mapping through MCP. The dataset is then
  converted to the engine's layout, split (`make_splits.py`) and fingerprinted, as today.
- **Downloads** run on the machine, not through the hub.
- **Viewer**: sample images with their boxes or masks, class balance, and the spread of box sizes.
- **Licence** recorded per dataset.

## 2.4 Architecture editor

- **Block-level editing.** A model shows as backbone → neck → head. You swap, insert, remove or change blocks: for
  example, replace every BatchNorm with GroupNorm, change the class count, or add an attention block after stage 3. It
  edits whole blocks, not individual operations.
- **From scratch.** The same editor with a library of blocks. Anything the blocks can't express goes into a custom
  Python module, which runs in the sandbox and is typically written with Claude.
- **Weights report** for every version: how much of the model is still pretrained, and which parts are new, reset or
  adapted (for example position embeddings resized for a new input size).
- **Quick check** on a chosen machine, answered in seconds through the live machine channel: output shape per block,
  parameter count, FLOPs, memory, latency, and whether ONNX export works.
- **Versions and lineage.** For example, v3 = v2 with a swapped backbone. Every run points at the exact version it
  trained.
- **Claude** drives the editor through MCP. Its edits appear live, and you accept or reject each one.

## 2.5 Automated search

- **Search spaces** over hyperparameters and architecture choices (for example backbone × input size × head ×
  learning rate), written in the recipe or set up in the UI.
- **Strategy.** Sample combinations and stop weak trials early (for example Optuna with pruning), within a total
  budget of runs or GPU hours.
- **Speed-aware.** Accuracy and latency on the chosen GPU are optimised together. The results show the trade-off
  between them (the Pareto front) and answer "what is the best model under X ms?"
- **Reliable winners.** The finalists re-run with several seeds, and the leaderboard shows the spread.
- **Trials** queue on your machines like any other run.

## Order

1. 2.0 Foundations. 2.1's reading tools can start at the same time.
2. 2.2 Model library.
3. 2.3 Data.
4. 2.4 Architecture editor.
5. 2.5 Automated search.

Each step ships on its own, and everything from phase 1 keeps working.

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
- **Team workspaces**: shared models, datasets and leaderboards.
- **Offline edition**: a separate, lighter app on its own branch.
- **Language and vision-language models.**
