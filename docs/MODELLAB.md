# ModelLab

A local web app plus engine for running, queueing and comparing vision-model experiments: fine-tune, distill,
benchmark. It is single-user and has no auth, Docker or cloud services. It runs the same way on the online PC (RTX 5090)
and the offline PC (conda-pack bundle, `offline_guard` on, no runtime downloads, no CDN assets).

The engine comes first. The UI only calls it.

```bash
export PATH=$PWD/bin:$PATH            # `modellab` CLI (unpack_offline.sh's activate.sh does this for you)
python app.py                         # UI on http://127.0.0.1:8765 (starts a background worker if none is running)
modellab run recipes/4_baseline_stock_vs_finetuned.yaml   # queue; runs in the foreground if no worker is up
modellab queue                        # running + waiting (with progress)
modellab list [--results]             # runs, or leaderboard rows
```

What was checked against lightly-train / rfdetr before building, and why some options are missing (RF-DETR
Base, DINOv2 at 384 px): [MODELLAB_VERIFICATION.md](MODELLAB_VERIFICATION.md).

## Recipes

A recipe is a YAML file with **named stages**. A stage uses an earlier stage's output via `{from: <stage>}`. With
`matrix:`, a recipe expands into one run per combination, and `${var}` is substituted. Full field reference:
`modellab/recipe.py` (docstring).

| stage | does | consumes (`from`) | produces |
|---|---|---|---|
| `distill` | LightlyTrain DistillationV3, teacher held in bf16 → RF-DETR encoder | `init`: RF-DETR checkpoint of the same size; `teacher`: LT-DETR fine-tune with a DINOv3 ViT backbone | RF-DETR checkpoint |
| `finetune` | RF-DETR: rfdetr trainer; LT-DETR: LightlyTrain `train_object_detection` | `init`: checkpoint of the same model | checkpoint (+ `backbone.pt` for DINOv3-ViT LT-DETRs) |
| `eval` | identical COCO eval + latency + params + VRAM (below) | any checkpoint, or a model id = stock weights | leaderboard row |
| `features` | kNN / linear probe on ROI-pooled backbone features, CKA, PCA image | RF-DETR checkpoints / stock ids, optional teacher | probe metrics, `pca.png` |

**Budget**: `{epochs: N}` and/or `{minutes: M}` (a wall-clock cap). How the cap stops each training loop:
- Lightning (distill): Lightning's `Timer` stops it, then the model is exported as usual.
- rfdetr: training stops after the current epoch.
- LT-DETR: the current step becomes the last one, so LightlyTrain saves, exports and validates as normal.

All three were tested on CPU. `stopped_by_time_budget` is recorded in the stage metrics. LT-DETR counts steps, so
ModelLab sets `steps = epochs × ceil(n_train / batch)` with gradient accumulation 1. One epoch then means the same
number of images for both families.

Shipped templates (`recipes/`, also on the "New experiment" page):
1. `1_teacher_size_sweep.yaml`: DINOv3 ViT-S/B/L/H+ → RF-DETR Nano → fine-tune → eval (4 runs).
2. `2_backbone_compare.yaml`: RF-DETR Nano (DINOv2) vs LT-DETR DINOv3 ViT-S/16, both COCO-pretrained, same data,
   epochs, batch and 384 px.
3. `3_chain_finetuned_teacher.yaml`: LT-DETR DINOv3 ViT-B/16 fine-tune → its backbone as teacher → distill Nano →
   fine-tune → eval (+ eval of the teacher detector).
4. `4_baseline_stock_vs_finetuned.yaml`: stock COCO Nano (scored by class name) vs fine-tuned, plus a feature probe.

## Datasets

`datasets.json` (per machine, gitignored) maps names to Roboflow-layout dirs (`train/valid/test/_annotations.coco.json`).
```bash
modellab dataset build-coco-vehicles --coco-root /data/coco2017   # or --download (annotations zip + selected images)
modellab dataset add mydata /data/mydata_roboflow                 # already in Roboflow layout
modellab dataset import mydata --coco-json ann.json --images-dir imgs/   # any COCO json, via make_splits.py
modellab dataset list | info <name>
```
- `coco-vehicles` is car / motorcycle / bus / truck from COCO 2017 (COCO names, so stock COCO detectors can be scored).
  train/valid come from train2017 (seeded shuffle; default 6000/800), test comes from val2017 (default 1500).
  Crowd boxes are dropped.
- Every split gets a **content hash**: canonical boxes and class names, plus the MD5 of every image's bytes, and no
  paths. The same data therefore hashes identically on both PCs. Each run stores the hashes in `datasets.json`, and
  every eval row stores the hash of the split it evaluated.
- Prefer `dataset import` for raw Roboflow exports with a parent "superclass" category; `make_splits.py` drops unused
  categories.

## Eval (identical for every model)

`modellab/evaluate.py`:
- **Images**: every image of the split, batch 1, with the model's own preprocessing and score threshold 0. The top 100
  detections go to pycocotools (bbox, maxDets 100), which gives mAP50:95, mAP50, AP small/medium/large and per-class AP.
- **Classes**: predicted classes map to dataset categories **by name**. COCO-pretrained heads use COCO ids, ModelLab
  fine-tunes use the exact label order rfdetr trained with (`classes.json`), and LT-DETR uses its own class map.
- **Latency**: network forward only, on one 1×3×H×W tensor at the model's input size. fp16 on the GPU (fp32 on CPU,
  labelled as such), 25 warm-up + 200 timed iterations with `cuda.synchronize`, median and p95.
- **Params and VRAM**: params of the full detector, and `max_memory_allocated` over the eval pass.
- **Comparability**: the eval-code version is `EVAL_VERSION` + SHA-256 of `evaluate.py`. The leaderboard and compare
  page flag rows as **not comparable** when the eval code or the evaluated data hash differs (and warn when latency was
  measured on a different device/setting).
- Cross-check on the tiny CPU set: ModelLab's mAP for an RF-DETR fine-tune agrees with rfdetr's own validation number
  within 0.015 (5 images). **Caveat:** the first check was made while rfdetr was (unknowingly) validating at native image
  size (see the albumentations bug below). Repeated after the fix, on COCO-sized images with real resizing: ModelLab
  valid mAP50:95 0.5615 vs rfdetr's own 0.5727 (regular weights) / 0.5477 (EMA weights), 5 images.

Three bugs were found and fixed (two while building this, one on the first real run on a user's PC). All three are
worth knowing about if you use these tools elsewhere:
- **rfdetr silently skips all image transforms (resize + augmentation) with the pinned albumentations 1.3.1.** rfdetr 1.5.2
  builds them with `BboxParams(clip=...)`, which needs albumentations >= 1.4.8; with 1.3.1 it catches the error, logs
  one warning (`Failed to initialize Resize ... unexpected keyword argument 'clip'. Skipping.` /
  `Built 0 Albumentations transforms`) and trains and validates on **native-size, un-augmented images**. On real photos
  this crashed fine-tuning at the end of epoch 1 (`Backbone requires input shape to be divisible by 32, but got
  [2, 3, 427, 640]`); on images whose sides happen to be multiples of 32 it did not crash and trained at the wrong scale,
  **so earlier fine-tune results of this repo (including `finetune_detector.py` smoke numbers) used no resize and no
  augmentation**. My synthetic test images were all multiples of 32, which hid it; `tests/make_synthetic_dataset.py
  --sizes coco` (now the default for the ModelLab tests) produces COCO-like sizes.
  No single pip pin fixes it (checked): albumentations 1.3.1 breaks rfdetr, 1.4.24 fixes rfdetr but crashes LightlyTrain's
  LT-DETR training (its `ScaleJitter` has no `always_apply`; its metadata excludes 1.4.*), and 2.0.8 breaks rfdetr's
  training crop. **Fix:** the environment keeps 1.3.1 for LightlyTrain, `setup_env.sh` installs albumentations 1.4.24 into
  `vendor/albumentations14/`, and processes that train with rfdetr select it before importing rfdetr
  (`modellab/compat.py`). Because ModelLab runs each stage in its own process, the two never meet. The rfdetr fine-tune
  stage, `check_offline.py` and `finetune_detector.py` verify the transforms really build (`modellab/preflight.py`) and
  fail with a clear message instead of silently skipping them.
- **Off-by-one class mapping** (found while building). rfdetr trains COCO-layout datasets with `label = index of the category sorted by id`
  (0-based), but `RFDETR.class_names` is 1-based. Mapping predictions through `class_names` scored a fine-tuned model
  at 0.256 instead of 0.555.
- **Annotation id 0** (found while building). pycocotools treats a matched ground-truth annotation with `id == 0` as unmatched.
  `make_splits.py` numbered annotations from 0 (now from 1; the content hash ignores ids). The evaluator also renumbers
  them internally.

## Runs, queue, worker

- Each run is stored in `runs/<id>/`:
  - `recipe.yaml` (expanded) and `resolved.json` (stages with defaults)
  - `env.json` (git commit, package versions, GPU, driver, seed) and `datasets.json` (hashes)
  - `runner.log`, `metrics.json`
  - `stages/<stage>/` with `log.txt`, `progress.json`, `result.json` and artifacts
  - SQLite index: `runs/index.sqlite`
- **Worker**: one per `runs/` dir (flock), one job at a time. Each run executes in a detached runner
  (`python -m modellab.runner`, its own session/process group), and each stage in its own subprocess. So:
  - closing the browser or restarting `app.py` does not touch a run (tested);
  - if the worker dies, the run continues and the next worker **adopts** it (tested);
  - if the runner died too (crash, reboot), the run is marked **interrupted** with the error tail. **Re-queue** resumes
    at the first unfinished stage, and finished stages are kept (tested);
  - **cancel** sends SIGTERM to the run's process group (SIGKILL after 15 s), and nothing survives (tested).
- **Failed** runs keep the last 40 log lines of the failing stage (`error_tail`), shown in the queue and run pages.
- **Seeds** come from the recipe (`seed:`) and go to Python/NumPy/torch and to rfdetr/LightlyTrain. Eval sets
  `cudnn.deterministic`.

## UI

FastAPI serves the prebuilt React/Vite/Tailwind bundle from `modellab/web/dist`, which is committed, so no Node is
needed at runtime. Fonts (Geist, Geist Mono) and icons are bundled, so it makes no external requests. Light/dark
mode follows the system and can be toggled; ⌘K / Ctrl+K jumps to any page or run. Look and feel, components and
motion rules for new UI work: [modellab/web/DESIGN.md](../modellab/web/DESIGN.md).

| page | |
|---|---|
| New experiment | templates; stage builder with dropdowns (model, teacher, init/from, dataset, budget, batch); sweep editor; live YAML preview with validation, missing-weights warnings and the runs it will create; **Run next** / **Add to queue**; YAML mode |
| Queue | worker status, GPU util/VRAM/temp/power (NVML), running job with stage timeline, progress and **live logs (SSE)**, cancel; waiting list; recently finished with error tails and re-queue |
| Leaderboard | current champion and headline numbers, Pareto-front scatter (mAP vs latency), "Model shape" radar (champion, or up to 4 selected rows), sortable/filterable ranked table (dataset, family, search, only-comparable), "not comparable" and "pareto" badges, tags and notes per run, pick 2–4 to compare |
| Compare | contender cards, metrics side by side (best highlighted), radar, per-class AP bars, PCA images, config diff (stages, seed, packages, git, GPU), comparability banner |
| Run detail | stages timeline with metrics and artifacts, logs per stage, recipe/env/data hashes, notes, **Clone & edit**, re-queue, cancel, delete |

Screenshots: [docs/screenshots/](screenshots/) (`1_new_experiment`, `1b_clone_and_edit`, `2_queue`, `3_leaderboard`, `4_compare`, `5_run_detail`, plus `_dark` variants). They were taken from CPU test runs on the tiny synthetic dataset,
so all numbers in them are meaningless.

Development: `cd modellab/web && npm ci && npm run dev` proxies `/api` to a running `python app.py`. Run
`npm run build` before committing UI changes.

## Weights

```bash
modellab weights list                 # present / verified / missing
modellab weights fetch rfdetr/small dinov3/vitb16 ltdetr/dinov3-vits16-coco dinov2/vitl14   # online PC
modellab weights verify
```
Every file is MD5- or SHA-256-checked (`modellab/catalog.py`). The DINOv2 and DINOv3 H+/7B files are S3 multipart
uploads, so their hashes were computed from full downloads that matched the multipart ETags. The New-experiment
preview lists missing weights per run, and stages fail fast offline with the exact `fetch` command to run online.

## Tests

```bash
python -m pytest tests/modellab -q        # CPU; test_worker.py takes a few minutes (real subprocesses + training)
```
- `test_unit.py`: recipe validation and matrix expansion, defaults (DINOv2 → multiples of 224), the COCO metric code (perfect
  = 1.0, wrong class = 0, shifted boxes), dataset hashing (path independent, content sensitive), store/queue state,
  API (preview, parse, submit, run-next ordering, compare warnings for different eval code or data, tags/notes,
  cancel/requeue, path traversal), and the UI bundle served with no external assets.
- `test_worker.py`: cancel kills the process group; worker crash → adoption; runner death → interrupted → re-queue
  resumes at the unfinished stage; a second worker refuses to start.
- Manual CPU end-to-end runs on the tiny dataset (`tests/modellab/recipes/`):
  - `tiny_chain.yaml`: LT-DETR fine-tune → its backbone as teacher → distill → fine-tune → evals → features.
  - `tiny_sweep.yaml`: DINOv3 and DINOv2 random teachers; DINOv2 at 448 px.
  - `tiny_timebudget.yaml`: all three loops stopped by the minutes cap.
  - The baseline template on the tiny dataset.
- **Real data, small**: `modellab dataset build-coco-vehicles --download --max-train 40 --max-valid 10 --max-test 20`
  ran against images.cocodataset.org: annotation zip, the selected images, Roboflow layout, registration and
  hashing. Stock RF-DETR Nano evaluated on those 20 real val2017 images: mAP50:95 0.588, mAP50 0.772 (per class: car
  0.50, motorcycle 0.65, bus 0.88, truck 0.32). This confirms the stock-model class mapping and the evaluator on real
  data (20 images only).
- **Offline**: `python app.py` inside `unshare -rn` (no network interface; loopback only). A fine-tune + eval run was
  submitted through the API, executed by the worker, and finished `done`. No network attempt was logged. This used
  the CPU venv, not a conda-pack bundle.
- **Restart safety**: the web app was killed and restarted while a run was in progress; the run kept going.
- **Old pipeline**: `tests/run_smoke.sh` still passes after the refactors (bf16-teacher patch moved into
  teacher.py; make_splits annotation ids now start at 1).

## Not tested (run these on the 5090 before trusting numbers)

- **Anything on a GPU**: bf16-mixed training through ModelLab, fp16 latency numbers, peak VRAM, NVML panel values
  (this machine has no NVIDIA driver; the panel shows "no GPU").
- **Real datasets at size**: a full `build-coco-vehicles` (only a 70-image `--download` build ran; the `--coco-root`
  path with a local COCO copy was not run, though it uses the same selection/writer code after loading the JSONs)
  and your own data.
- **The four templates at full size**: real teachers (only random-init tiny teachers ran here), RF-DETR S/M/L
  fine-tuning (only Nano), and real COCO-pretrained LT-DETR checkpoints (only the tiny test LT-DETR).
- **Whether 1–3 h budgets fit**: the template batch sizes and epochs are starting guesses, not measured values.
- **conda-pack bundle with the new dependencies** on the offline PC: the pins were resolved together (`uv pip compile`
  reproduces exactly the pinned set), but the bundle was not rebuilt and unpacked in this session.
