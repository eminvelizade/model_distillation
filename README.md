# <img src="modellab/web/public/tube.svg" width="32" alt="" /> ModelLab

A platform for building, training and comparing vision models on your own GPUs.

You describe an experiment in the web app: fine-tune a detector, distill a large teacher into a small model, benchmark
them on your data. It runs on one of your GPU machines, and the results come back to one place where you can rank
and compare them.

Current version: **v0.1** (beta).

![Machine page](docs/screenshots/hub_3_machine_detail.png)

## How it works

```
 Browser ──sign in──▶ ModelLab Hub (web app on Railway)
                         ▲
                         │  HTTPS, opened by each PC
           ┌─────────────┴─────────────┐
     GPU PC (RTX 5090)           GPU PC (RTX A4000)
     ModelLab agent              ModelLab agent
```

- **The hub** is the web app your team signs into. It keeps accounts, queues, results and logs.
- **The agent** runs on each Linux GPU PC. It trains and evaluates there. Datasets, weights and checkpoints never
  leave the PC.
- **Offline mode**: the same app also runs on a single PC without internet (`python app.py`), for air-gapped
  machines.

## What you can do

**Experiments**
- Build experiments from **stages** you chain together: `finetune`, `distill`, `eval`, `features`. A stage can use an
  earlier stage's output, e.g. fine-tune a teacher → distill it into a student → fine-tune → evaluate.
- **Sweeps**: one experiment can expand into many runs (e.g. four teacher sizes).
- Start from **templates** or write the recipe in YAML.
- Models today: RF-DETR (Nano → Large) and LT-DETR detectors, with DINOv2 / DINOv3 teachers (ViT-S up to ViT-7B).

**Find my best model**
- Give ModelLab a dataset, your machines and a speed budget (ms per image on one of your GPUs). It times every
  candidate model and input size first, trains the ones that fit in rounds (the best move on with more epochs),
  repeats the best with other seeds, and recommends the most accurate model that fits.
- Optionally tries learning rates and distilling a DINOv2 / DINOv3 teacher into RF-DETR models. Trials are ordinary
  runs, spread over every machine that holds the same data.
- **Export** the winner (or any fine-tuned model): ONNX, a TensorRT FP16 engine when TensorRT is installed on the
  machine, a model card and a small example script. The files stay on the machine.

**Results**
- **One evaluation for every model**: same images, same metric code (COCO mAP, per-class AP, latency, VRAM, size).
- **Leaderboard** with the current best model and a speed-vs-accuracy chart; **Compare** up to 4 runs side by side,
  down to the config differences.
- Results are flagged as **not comparable** when the data or evaluation code differs. Datasets are fingerprinted, so
  you can tell two machines hold identical data.

**Machines**
- **Add a machine** with one command pasted into a terminal. No sudo, no manual setup: the agent installs its own
  environment and keeps itself updated.
- **Hardware page** per machine: GPU, driver, memory, disk and live usage. Anything that would break a run shows in
  red, with the fix.
- **Datasets** per machine: browse the PC's folders from the web app to add one (Roboflow, COCO or YOLO), and remove
  it again any time. Files never move. Every dataset is **checked** when added: missing images, broken boxes, unknown
  classes, and images that leak between train, valid and test.
- Live progress and logs; cancel and re-queue. Runs survive a closed browser, and keep training if the hub goes
  down.

**Team**
- Only users an admin adds can sign in; each user runs on their own machines.
- Agent updates are signed, so a PC only accepts code you released.

## Get started

| I want to… | Read |
|---|---|
| Deploy the hub and add my GPU PCs | [docs/HUB.md](docs/HUB.md) |
| Write experiments: recipes, stages, evaluation details | [docs/MODELLAB.md](docs/MODELLAB.md) |
| Run everything on one offline PC | [docs/MODELLAB.md](docs/MODELLAB.md) and [docs/OFFLINE_PIPELINE.md](docs/OFFLINE_PIPELINE.md) |

## Roadmap

**Next: the rest of the R&D playground** ([plan](docs/PHASE2_PLAN.md))
- Any vision model from Hugging Face (`transformers`, `timm`), or your own upload.
- An architecture editor: swap backbones and heads, add or change layers, or build a model from scratch.
- Hugging Face datasets with a viewer; classification and segmentation.
- Claude through MCP, on your own Claude account: debug runs, plan experiments, find papers, edit architectures.

**Phase 3**: cloud GPUs, and clusters (sharing machines with teammates by invitation).

## Repository

| path | what |
|---|---|
| `modellab/` | the engine: recipes, stages, evaluation, datasets, run store |
| `modellab/hub/` | the hosted web app (API, accounts, machines, installer) |
| `modellab/agent/` | the agent on each GPU PC |
| `modellab/web/` | the web UI (React) |
| `recipes/` | experiment templates |
| `docs/` | guides and design notes |
| `tests/` | tests (`python -m pytest tests/modellab tests/hub -q`) |
