## Overview

ModelLab is a personal R&D lab for object detectors. You train, distill and benchmark models on your own Linux GPU
PCs and compare everything in one web app.

- **The hub** is the web app (hosted on Railway). It keeps accounts, the queue, runs, results, logs and small figures.
- **The agent** runs on each GPU PC as a background service. It trains and evaluates there. Datasets, weights and
  checkpoints never leave the PC; the hub only receives metrics, logs and small figures (feature maps, no dataset
  images).
- Every experiment is a **run**: a recipe of chained **stages** (finetune, distill, eval, features, speed) that runs on
  one machine. Results land on the **Leaderboard**, where every model is scored with the same evaluation code.
- **Find best model** automates the search for the most accurate detector that fits a speed budget.
- **The agents** (that's me, and any others on the team) explain how things work and why results came out the way
  they did, and carry out work: one action as a card, or several steps as a plan (see "Chat, agents and plans").

Pages (sidebar): Chat, New experiment, Queue, Leaderboard, Compare, Find best model, Notebook, Machines, Team (admins). ⌘K / Ctrl+K
opens a palette that jumps to any page or run. The machine picker at the top of the sidebar selects the machine that
New experiment, Queue and the GPU widget work with.

## Machines and the agent

- **Add a machine**: Machines → Add machine, give it a name, and paste the one-line command into a terminal on the PC
  as your normal user (no sudo). The pairing code works once, for 10 minutes. The installer checks the OS, glibc,
  driver and disk, installs uv and Python 3.11, pairs, downloads the signed release, builds a hash-checked Python
  environment (a few GB the first time), starts the `modellab-agent` systemd user service and runs a self-check.
- **Requirements**: Linux x86_64 with glibc 2.28+, NVIDIA driver 570+ (CUDA 12.8; needed for RTX 50 series), about
  15 GB for the environment plus room for weights and checkpoints, outbound HTTPS to the hub, GitHub, PyPI,
  download.pytorch.org and the weight hosts.
- **The machine page** shows hardware (GPU, driver, memory, disk), live usage, the self-check (anything that would
  break a run shows in red with the fix), datasets, downloaded weights, recent commands and the agent version.
- **On the PC**: `systemctl --user status modellab-agent`, `journalctl --user -u modellab-agent -f`,
  `~/.modellab/bin/modellab-agent status | doctor | uninstall [--purge]`. Logs: `~/.modellab/logs/agent.log`.
- **Offline machine**: the PC is off, the service stopped, or the network blocks the hub. If the service stops when you
  log out, run `sudo loginctl enable-linger <user>`. Behind an HTTP proxy: `systemctl --user edit modellab-agent`,
  add `[Service]` and `Environment=HTTPS_PROXY=http://proxy:3128`, then restart the service.
- **Updates**: an idle agent installs the hub's current release by itself (signature and hash checked; the Python
  environment is rebuilt only when the lock files change). Runs in progress are never interrupted. An admin publishes
  releases with the "agent release" GitHub Action.
- **Remove** on the machine page revokes the machine; runs, checkpoints and weights stay on the PC.
- Each machine runs one job at a time.

## Datasets

- Datasets live on each machine. On the machine page, **Add dataset** takes a Roboflow-layout folder (`train/ valid/
  test/`, each with `_annotations.coco.json`), a COCO json plus an images folder, or a YOLO folder. **Browse** lists
  the PC's folders through the agent; you can also type a path. Images are never copied off the PC.
- Every dataset gets a **fingerprint** (a content hash of the boxes, class names and every image's bytes, no paths).
  The same name and fingerprint on two machines means identical data, so results from those machines are comparable.
  **Re-check** (↻) after changing files.
- **Dataset check** runs on every add, import and re-check. **Errors** (red; they block a search): missing image
  files, boxes with no area or entirely outside their image, unknown class ids, the same image in two splits (the
  model would be scored on images it trained on). **Warnings** (amber): boxes partly outside the image, classes in
  valid/test missing from train, very unbalanced classes (over 20x), valid/test smaller than 20 images, mostly empty
  training images. Datasets added before the check existed show "not checked yet" until re-checked.
- The trash icon removes a dataset from the machine's list; its files stay.

## Experiments and stages

**New experiment** builds a recipe from stages, from a template, or from YAML. A stage can use an earlier stage's
output with `{from: <stage>}`, e.g. fine-tune a teacher → distill it into a student → fine-tune → evaluate.
**Sweeps** (`matrix:`) expand one recipe into several runs. Runs go to the queue of the machine picked in the sidebar.

| stage | what it does |
|---|---|
| `finetune` | supervised detection training on train (valid picks the best checkpoint). RF-DETR uses rfdetr's trainer; LT-DETR uses LightlyTrain. `image_size` (multiple of 32; default the model's native size), `lr`, `batch_size`, `budget` |
| `distill` | LightlyTrain DistillationV3: a frozen DINOv2/DINOv3 teacher (held in bf16) teaches an RF-DETR student's backbone to reproduce its features, on your images, without labels. Usually followed by a finetune that starts from it |
| `eval` | the same COCO evaluation for every model (below): mAP, per-class AP, latency, params, VRAM. Produces a leaderboard row |
| `features` | probes the backbone features of RF-DETR checkpoints (and optionally a teacher): kNN and linear probe accuracy on object crops, CKA similarity, a PCA figure and attention figures |
| `speed` | latency and parameter count of a model at an input size, no training and no dataset |

- **Budget**: `{epochs: N}` and/or `{minutes: M}` (a wall-clock cap; `stopped_by_time_budget` is recorded).
- **Seeds** come from the recipe (`seed:`) and go to Python, NumPy, torch, rfdetr and LightlyTrain.
- Weights a machine doesn't have yet are downloaded and hash-checked before the run starts.
- Templates: teacher-size sweep (DINOv3 S/B/L/H+ → RF-DETR Nano), backbone comparison (RF-DETR Nano vs LT-DETR),
  fine-tuned teacher chain (LT-DETR ViT-B fine-tune → its backbone teaches Nano), stock vs fine-tuned baseline.

## Models and teachers

Detectors (id → name, native input size):
{{DETECTORS}}

Distillation teachers (DINOv2 / DINOv3 vision transformers, frozen):
{{TEACHERS}}

- RF-DETR: DETR-style detectors with a DINOv2 backbone (windowed attention). Bigger sizes are more accurate and
  slower. Distillation applies to RF-DETR students.
- LT-DETR: LightlyTrain's DETR detectors with DINOv3 backbones (ViT or ConvNeXt). The "backbone only" entries start
  from a DINOv3 backbone without COCO detection training.

## Runs, queue and logs

- **Queue**: running and waiting runs of the selected machine, with progress. Runs keep going if you close the
  browser, and keep training if the hub goes down.
- **Run page**: stages with status, settings and metrics, live logs, results, figures, checkpoints (their path on the
  PC; never uploaded), tags and notes. **Cancel** stops a run; **Re-queue** resumes a failed or interrupted run at its
  first unfinished stage (finished stages are kept). Deleting a run can also delete its files on the machine.
- **Failed** runs keep the last log lines of the failing stage (the error tail) on the run page.
- **Interrupted** means the runner died (reboot, crash, machine removed); re-queue it.

## Evaluation and comparability

- Every model is scored by the same code: every image of the split at batch 1 with the model's own preprocessing and a
  score threshold of 0; the top 100 detections go to pycocotools, giving mAP50:95 ("mAP"), mAP50, AP for small /
  medium / large objects and per-class AP. Predicted classes map to the dataset's categories by name.
- **Latency**: network forward only on one 1×3×H×W tensor at the model's input size, fp16 on the GPU (fp32 on CPU,
  labelled), 25 warm-up + 200 timed iterations; median and p95. **Params** of the full detector; **VRAM** is the peak
  allocated during evaluation.
- **Comparability**: results are flagged **not comparable** when the evaluation code version (`eval_version`) or the
  evaluated data (dataset, split, fingerprint) differ; latency gets a warning when measured on a different device.
- **Leaderboard**: one split at a time (test by default). The champion card shows the best model; the
  speed-vs-accuracy chart puts every result at its latency and mAP (up and to the left is better).
- **Compare**: up to 4 results side by side: metrics, per-class AP, a radar chart, PCA figures and every config
  difference between the runs.

## Find best model

Finds the most accurate detector that fits a speed budget, automatically. Pick a dataset, the machines that train
(they must hold the same data: same fingerprint, no check errors), the machine whose GPU sets the speed, a speed budget
in ms per image, and the models to try. Optionally: several input sizes per model, learning rates, distillation
teachers (RF-DETR only), a GPU-hour cap, seeds, rounds and the keep fraction.

1. **Timing**: one run on the speed machine times every model at every input size (`speed` stages). Candidates over
   the budget are dropped before any training.
2. **Rounds (successive halving)**: every remaining configuration (model × input size × learning rate × teacher)
   trains briefly and is scored on the validation split; the best 1/eta (default a third) move on with eta× the epochs.
   The last round trains with the full epochs and also evaluates on the test split, with latency. Epochs per round:
   the last round gets the full budget, each earlier round 1/eta of the next (e.g. 9 epochs over 3 rounds: 1, 3, 9).
3. **Seeds**: the best two of the last round run again with other seeds, which shows the noise.
4. **Recommendation**: the configuration with the best **mean validation mAP** over its full-budget runs. Its test
   mAP (mean ± spread) is reported but never used to choose, because choosing on test would overstate it.

Trials are ordinary runs tagged `search:<id>`: they show in the queue and on the leaderboard, spread over the
search's machines (the one with the fewest active runs gets the next trial), and the search advances by itself when a
trial finishes. A GPU-hour cap stops it before a round that wouldn't fit (the recommendation then comes from an earlier
round and is marked as an early stop). Cancel stops queued trials; a finished or cancelled search can be deleted (its
runs stay).

## Export

**Export** (on a search's recommendation, or any finished fine-tune stage) runs on the machine that trained the model
and writes `runs/<id>/export/<stage>/` there: `model.onnx`, `model.engine` (TensorRT FP16, only when `trtexec` is
installed on that PC; it also reports the TensorRT latency), `preprocess.json`, `infer_onnx.py` (runs the model on one
image) and `model_card.md/json`. Nothing is uploaded; the page shows the folder path.

## Reading results

- **mAP (mAP50:95)** averages precision over IoU thresholds 0.50–0.95, so it rewards tight boxes. **mAP50** only asks
  for 50% overlap: a large gap between them means the model finds objects but places boxes loosely.
- **AP small / medium / large** (COCO: under 32², 32²–96², over 96² pixels). Weak small-object AP often improves with a
  larger input size, at a latency cost.
- **Per-class AP**: a class far below the others usually has few training boxes, looks like another class, or is
  mostly small. Check the class balance in the dataset check.
- **Latency median vs p95**: a p95 far above the median means jittery timing (thermal or other GPU load).
- **Valid vs test**: test noticeably below valid can mean the selection overfit the validation split, or the splits
  differ in distribution.
- **Seed noise**: two runs that differ only in seed often differ by 0.5–1.5 mAP points on small datasets. Treat smaller
  differences as ties unless several seeds agree.
- **Successive halving** judges early rounds after few epochs: fast learners look good early, slow learners (bigger
  models, distilled students, low learning rates) can be dropped before they catch up.
- **Distillation**: a teacher helps most when the dataset is small or differs from COCO; check the features stage
  (probes, CKA to the teacher, attention) to see whether the student's representation actually moved.

## Feature figures (PCA, attention)

The `features` stage writes figures that I can look at and explain:

- **pca.png**: one row per image, one column per model. Each patch is coloured by the first three principal components
  of that model's feature map. Coherent, object-shaped regions with consistent colours across images mean semantic
  features; speckle or grid patterns mean local texture. No input images are shown (they never leave the PC).
- **Probes**: kNN and linear-probe accuracy of predicting each object's class from the backbone features inside its
  box. Higher means the classes are easier to tell apart in feature space.
- **CKA**: similarity of two models' feature geometry (0..1). After distillation, CKA to the teacher should rise.
- **Attention** (attention.png and metrics): where the last global self-attention layer looks, averaged over heads.
  object_focus is the share of attention inside ground-truth boxes; lift is that share divided by the boxes' share of
  the image (above 1 means attention concentrates on objects); entropy (0..1) says how spread out it is;
  similarity_to_teacher correlates the attention maps with the teacher's.

## Notebook

- The Notebook page (sidebar, Analyze) is the lab's memory: each question or idea, the runs and searches that tested
  it, the answer, and a status (open, answered, dropped with its reason).
- An entry's page has New experiment and New search buttons: what is started from there is linked to the entry.
  Link a run adds an existing run. Edit the question, plan or answer with the pencil on each part.
- Every Find best model search gets an entry of its own, answered from its recommendation when it finishes.
- When all of an entry's runs have finished, its page offers "Write up the answer".

## Chat, agents and plans

- **Chat** (sidebar, Team) is where the user talks with the agents, like messaging: the team on the left, one
  conversation per agent on the right. The corner button on every other page opens the same conversation in a small
  panel. Conversations are kept on the hub, so they are the same on every device.
- **Agents.** Everyone starts with one (Bloom). The + in Chat adds another, up to 8; the pencil changes one. An
  agent has a name, an optional role in the user's words ("keeps an eye on the overnight runs") and a look: a classic
  mascot, or one put together from a shape, a colour, eyes, glasses and an extra. All agents use the same Claude model
  and the same tools; the role only shapes what an agent pays attention to.
- **Kept in mind** (bottom of the team list): notes the agents keep between conversations, a sentence each: a
  correction the user made, or a standing preference. An agent adds one when it is corrected; the user can add,
  change or remove any of them. Every agent reads all of them.
- **Plans.** For work of several steps the agent writes a plan, shown as a card: steps of four kinds (train a run,
  run a Find best model search, pick the best of earlier steps by mAP or latency, export a model), the estimated GPU
  time, and a Start button. Nothing runs until the user presses **Start**; one Start covers every step.
  - A started plan runs on the hub, with no page open: it queues the runs on the machines, waits, picks and exports.
    Runs that don't depend on each other are queued together; a step can wait for another (a quick test first).
  - Each step shows what really happened to its run. A run that fails for a known reason is tried again with the
    catalogue's fix: half the batch (and twice the gradient accumulation) after an out-of-memory error, half the
    learning rate after a NaN loss, a re-queue after an interruption; at most three tries, and only within the
    approved GPU time (the estimate times 1.5, plus 10 minutes).
  - Anything else stops the plan: the card says why and offers Retry the step, Skip it or Stop the plan.
  - The agent can change a plan's steps that haven't started. A change inside what was approved (the same machines
    and datasets, within the approved GPU time) takes effect at once; one that goes beyond it waits on the card for
    the user's OK.
  - When a plan finishes or stops, the hub writes what happened into the conversation, and the agent follows up with
    a report the next time the conversation is on screen. A plan's runs carry the tag `plan:<id>`.
- The corner button and the Chat entry show a red count of messages that arrived while the user was away.

## Yeti and Claude

- The agents are powered by Claude. **Chat here**: paste an API key from your Claude Console account
  (console.anthropic.com → API keys) in the settings (the sliders icon in Chat or in the corner panel); usage is
  billed to that account. The key is stored encrypted on the hub and never shown again. Pick the model and how
  thorough answers are in the same place.
- **Use your Claude app**: add ModelLab as a custom connector in Claude (claude.ai, Claude Desktop, Claude mobile) or
  in Claude Code with the connector URL shown in the settings. Claude then reads your ModelLab data with your own
  Claude subscription, after you approve access once.
- What Claude sees: only what the tools return when you ask: run and search names, settings, metrics, log tails and
  the feature figures. Never datasets, images or checkpoints.
- What an agent can do: it starts nothing on its own. It can fill in the New experiment form, offer one action
  (re-queue, cancel, export, delete, open a page) as a card, or write a plan of several steps. Opening and filling
  in happen at once; anything that runs, cancels or deletes waits for the user's tap, and a plan waits for Start.

## Troubleshooting

- **CUDA out of memory**: lower `batch_size` or `image_size`, or pick a smaller model; check what else uses the GPU on
  the machine page.
- **Weights missing / download failed**: the machine needs outbound HTTPS to the weight hosts; the run downloads and
  hash-checks weights before it starts.
- **"not comparable"**: the two results used different evaluation code or different data. Re-run the evaluation with
  the current code, or check the dataset fingerprints on the machine pages.
- **A search failed or found nothing**: "no candidate fits" means even the fastest model is over the budget: raise the
  budget, try smaller input sizes or a smaller model. "every trial failed": open one trial run's error tail.
- **Dataset errors block a search**: fix the files (missing images, broken boxes, leaked images between splits) and
  re-check the dataset.
- **Run stuck in queued**: the machine is offline or busy with another run; one job at a time per machine.
- **Interrupted run**: re-queue it; finished stages are kept.
