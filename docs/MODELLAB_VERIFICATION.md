# ModelLab: verification report (before building)

Checked on 2026-10-27 against the code, not only the docs:
- **lightly-train 0.17.0** (the version pinned in `environment.yml`) and the latest release **0.18.0**
  (wheel inspected). 0.18.0 still requires `rfdetr>=1.4.1,<1.6`, so the RF-DETR side is unchanged.
  ModelLab stays on 0.17.0 (tested). An upgrade to 0.18.0 is possible but would be untested.
- **rfdetr 1.5.2** (pinned; the newest version LightlyTrain allows). rfdetr 1.11.2 is out but LightlyTrain
  does not accept it.
- Probes were run on CPU in a venv with the pinned packages, on the tiny synthetic dataset. Scripts are
  summarised below; "OK" means the call ran end to end, **not** that accuracy was measured.

## (a) RF-DETR sizes as distillation students and fine-tune targets

| size | class | encoder | patch × windows | native res | distill student | fine-tune target | in ModelLab |
|---|---|---|---|---|---|---|---|
| Nano | `RFDETRNano` | DINOv2-S windowed | 16 × 2 | 384 | **OK** (probe) | yes (rfdetr `train`) | yes |
| Small | `RFDETRSmall` | DINOv2-S windowed | 16 × 2 | 512 | **OK** (probe) | yes | yes |
| Medium | `RFDETRMedium` | DINOv2-S windowed | 16 × 2 | 576 | **OK** (probe) | yes | yes |
| Large (2026) | `RFDETRLarge` (`rf-detr-large-2026.pth`) | DINOv2-S windowed | 16 × 2 | 704 | **OK** (probe) | yes | yes |
| Base / Large (legacy) | `RFDETRBase`, `RFDETRLargeDeprecated` | DINOv2-S/B windowed | 14 × 4 | 560 | not probed | yes | **no** |

- LightlyTrain's `RFDETRPackage` accepts any `rfdetr.RFDETR` instance (it checks `isinstance(model, RFDETR)`).
  It distills the encoder's last stage, and the export asserts a `WindowedDinov2WithRegistersBackbone`. All
  current detection sizes satisfy this.
- Probe: `lightly_train.pretrain(method="distillation")` ran 1 epoch on CPU with each of N/S/M/L as the student
  (random init) and teacher `dinov3/vitt16-notpretrained`, at the native resolution: all 4 OK
  (12–21 s on CPU).
- Base / legacy Large are the older patch-14 models. `RFDETRBase(pretrain_weights=None)` fails in rfdetr 1.5.2
  (`'NoneType' object has no attribute 'endswith'`), and the patch-14 encoder loads DINOv2 weights from the HF hub
  at build time. Roboflow superseded them with S/M/L. **Not offered in ModelLab; closest option: Small or Medium.**
- No XLarge/2XLarge *detection* models exist in rfdetr 1.5.2; only segmentation has them, and segmentation is out of scope.
- Fine-tuning uses rfdetr's own `RFDETR<Size>.train(dataset_dir=<Roboflow layout>)`, which is the same code
  path for all sizes. Before this change it had been run on CPU with Nano (`finetune_detector.py`). The ModelLab
  tests below cover Nano. **S/M/L fine-tuning was not run** (too slow on CPU at 512–704 px).
- Students can start from stock COCO weights (MD5s from rfdetr's own registry: Nano `fb6504cc…`,
  Small `fb37061c…`, Medium `7223f764…`, Large-2026 `5cb72153…`), from a previous stage's checkpoint, or from scratch.

## (b) Fine-tuning LightlyTrain's DINOv3 LT-DETR (to compare against DINOv2-based RF-DETR)

`lightly_train.train_object_detection(out=…, model=<name>, data=…, steps=…, batch_size=…, transform_args={"image_size": (h, w)})`

- **Data**: Roboflow/COCO layout works directly with
  `data={"format": "coco", "train": {"annotations": ".../train/_annotations.coco.json"}, "val": {"annotations": ".../valid/_annotations.coco.json"}}`
  (images resolve relative to the JSON). This is the same `make_splits.py` output RF-DETR uses, so both see identical data.
- **Models** (0.17.0 registry): COCO-pretrained detectors (`*-ltdetr-coco`): `dinov3/vitt16`, `vitt16plus`, `vits16`,
  `convnext-tiny/small/base/large`. Detection head from scratch with DINOv3 backbone weights (`*-ltdetr`): adds
  `dinov3/vitb16`, `vitl16`. DINOv2-based LT-DETRs exist too (`dinov2/vits14…vitg14-ltdetr`).
- **Fair pair for "DINOv2 vs DINOv3"**: RF-DETR Nano (DINOv2-S, COCO-pretrained, 384) vs
  `dinov3/vits16-ltdetr-coco` (DINOv3 ViT-S, COCO-pretrained). The template sets both to 384 px; LT-DETR's native
  size is larger. Both use the same split and the same epoch budget.
- **Budget**: LT-DETR counts optimizer **steps**, not epochs, and `gradient_accumulation_steps="auto"` resolved to 16
  in the probe. ModelLab therefore sets `gradient_accumulation_steps=1` and converts
  `steps = epochs × ceil(n_train / batch_size)`, so an "epoch" means the same number of images for both families.
- **Weights offline**: named checkpoints are downloaded by `download_checkpoint()` into
  `$LIGHTLY_TRAIN_CACHE_DIR/models/<file>` and SHA-256-checked (hashes are in LightlyTrain's registry), so they can
  be pre-fetched. Probe finding: even `dinov3/vitt16-notpretrained-ltdetr` tried to download the `vitt16` backbone
  (`offline_guard` blocked it). **Every LT-DETR used offline must be pre-fetched**; `modellab weights fetch` does this.
- **Probe**: `train_object_detection("dinov3/vitt16-notpretrained-ltdetr")` ran 2 steps on CPU on the synthetic
  Roboflow-layout split → `exported_models/exported_best.pt`. Loading it with `lightly_train.load_model(...)` and
  calling `predict()` returned `labels/bboxes/scores`: OK.
- ModelLab evaluates LT-DETR with its own evaluator, the same one as for RF-DETR (see (eval) below), not with LightlyTrain's validation metrics.

## (c) A fine-tuned DINOv3 as distillation teacher

**Supported.** DistillationV3's `get_teacher` builds the teacher architecture by name with `load_weights=False` and then
`load_state_dict(torch.load(teacher_weights))` **strictly**. Any state dict of the same DINOv3 ViT architecture works.

- **From an LT-DETR fine-tune (tested)**: the DINOv3 ViT lives at
  `task_model.backbone._model_wrapper.get_model()`. ModelLab saves its `state_dict()` as `backbone_dinov3.pt` and
  passes `teacher=<same dinov3 name>, teacher_weights=<that file>`. Probe: LT-DETR (vitt16) fine-tune → extract
  backbone (188 tensors) → distill into RF-DETR Nano: "Loaded teacher weights", 1 epoch OK.
- **From LightlyTrain SSL pretraining** (`pretrain(model="dinov3/vitb16", method="dinov2")` on unlabeled images):
  the export is a plain DINOv3 state dict, so the same mechanism applies. **Not built or tested here.** It would be the
  "unsupervised domain fine-tune" variant of the chain; ModelLab's chain template uses the supervised LT-DETR route.
- Caveat: LT-DETR fine-tunes the backbone with `backbone_lr_factor=0.05` and reads intermediate layers through its
  STA adapter. The extracted ViT is therefore a lightly adapted DINOv3, not a detector-specialised one. Whether that
  is a better teacher than stock DINOv3 is exactly what template 3 measures.
- ModelLab keeps the teacher in bf16 (as in `distill.py`) for named and fine-tuned teachers.

## (d) Supported DINOv2 and DINOv3 teachers

The distillation `teacher` accepts any LightlyTrain backbone name; DistillationV3 uses its normed patch tokens + CLS.

- **DINOv3 ViT** (LVD-1689M): `dinov3/vits16`, `vits16plus`, `vitb16`, `vitl16`, `vith16plus`, `vit7b16`; satellite
  `vitl16-sat493m`, `vit7b16-sat493m`; distilled tiny `vitt16`, `vitt16plus`; variants `-eupe`, `-lingbot`. ConvNeXt
  `dinov3/convnext-*` are also accepted by LightlyTrain but are not ViT teachers. ModelLab offers vits16 / vitb16 /
  vitl16 / vith16plus / vit7b16.
- **DINOv2 ViT** (with registers): `dinov2/vits14`, `vitb14`, `vitl14`, `vitg14` (and `-tipsv2` variants). Weights
  come from `dl.fbaipublicfiles.com` into the LightlyTrain cache.
- **Constraint found by probe**: the teacher sees the same image as the student, and DINOv2 needs a size divisible by
  **14**. With RF-DETR's patch 16 × 2 windows (multiple of 32), the size must be a multiple of **224**. Nano at its
  native 384 → `RuntimeError: shape '[2, 384, 27, 27]' is invalid`; at **448 → OK**. ModelLab validates this and
  defaults DINOv2-teacher distillation to the next multiple of 224 at or above the student's size: Nano 448,
  Small/Medium 672, Large 896. It refuses other sizes with a clear message.
- 7B: needs about 54 GB of CPU RAM while loading (fp32 checkpoint), then about 13.4 GB of VRAM in bf16 (from the previous change).

## Eval definition (identical for all models)

Same test split, same COCO evaluation (pycocotools, maxDets=100), and predictions mapped to dataset classes **by
class name**. That mapping lets stock COCO models be scored on `coco-vehicles` and gives 0 with a warning when no
names overlap. Latency is the network forward on one fp16 1×3×H×W tensor at the model's own resolution on the GPU:
warm-up 25, then 200 timed iterations with CUDA sync; median and p95 are reported. Each run records the eval-code
version (constant + SHA-256 of the eval source) and the dataset test-split hash. Runs whose values differ are flagged
"not comparable".

## Build plan (short)

1. `modellab/` engine: recipe (YAML, `from:`, `matrix:` sweeps, budgets), catalog (models / teachers / weights with
   hashes), dataset registry (+ `coco-vehicles` builder, split hashes), stages (distill / finetune / eval / features),
   evaluator, run store (`runs/<id>/` + SQLite index), env capture.
2. Worker: one job at a time. Each run executes in a detached runner process (own process group), and each stage in
   its own subprocess. Status lives in SQLite. When the worker restarts it adopts runners that are still alive and
   marks dead ones `interrupted`; a re-queue resumes at the first unfinished stage. Cancel kills the process group.
   CLI: `modellab run|queue|list|show|cancel|requeue|worker|weights|dataset`.
3. FastAPI (`python app.py`): REST + SSE logs + NVML. It starts the worker if none is running. React/Vite/Tailwind UI
   is built into `modellab/web/dist` and committed, so no Node is needed at runtime and no external fonts or CDNs are used.
4. CPU tests with synthetic data; Playwright screenshots of every page; env/pack updates; README.
