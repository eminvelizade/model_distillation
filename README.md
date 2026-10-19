# RF-DETR Nano ← DINOv3 ViT-L/16 backbone distillation (offline-ready)

Domain-adapt the RF-DETR Nano backbone by distilling DINOv3 ViT-L/16 into it with LightlyTrain
(`method="distillation"` = DistillationV3) on your own images, then compare stock vs distilled
backbone features. Everything is prepared/tested on an online PC and run on an offline PC.

Pinned stack: Python 3.11.14, torch 2.8.0+cu128, torchvision 0.23.0+cu128, lightly-train 0.17.0,
rfdetr 1.5.2 (lightly-train 0.17's `[rfdetr]` extra requires `rfdetr>=1.4.1,<1.6`), transformers 4.57.6.
NVIDIA driver: >= 570 (CUDA 12.8; also the minimum for RTX 50-series). The cu128 torch/torchvision wheels
contain sm_120 kernels (RTX 5090) and sm_86 (A6000; the 4090's sm_89 runs them); cu126 has no sm_120 and fails
with "no kernel image" on a 5090.
The CUDA runtime ships inside the pip wheels; no system CUDA toolkit is needed.

## Command order

### Online PC
```bash
git clone <this repo> && cd model_distillation
bash setup_env.sh                      # creates conda env "rfdetr-distill" from environment.yml
conda activate rfdetr-distill
bash download_weights.sh               # Nano + teacher into weights/ and cache/, MD5-checked, then check_offline.py
# optional fallback teacher: put the HF folder at weights/dinov3-vitl16/ BEFORE download_weights.sh
#   (config.json, model.safetensors, preprocessor_config.json) -> converted to weights/dinov3_vitl16_from_hf.pt
bash tests/run_smoke.sh                # full pipeline on synthetic data, network guard on
unshare -rn bash tests/run_smoke.sh    # same, in a network namespace with no network at all (needs user namespaces)
bash pack_env.sh bundle                # bundle/{env.tar.gz, project.tar, SHA256SUMS, unpack_offline.sh}
```
Copy `bundle/` and your dataset to the offline PC.

### Offline PC
```bash
bash /path/to/bundle/unpack_offline.sh /path/to/bundle /opt/distill   # checksums, conda-unpack, check_offline.py
source /opt/distill/activate.sh                        # env + offline env vars, cd into project
bash tests/run_smoke.sh                                # optional: whole pipeline on synthetic data

# 1. splits (held-out valid/test are never distilled)
python make_splits.py --format coco --coco-json /data/ann.json --images-dir /data/images --out data/ds
#   or: python make_splits.py --format yolo --yolo-dir /data/yolo --out data/ds   [--keep-splits]
# 2. GPU smoke at the real batch size (one GPU per run: pick it with CUDA_VISIBLE_DEVICES)
CUDA_VISIBLE_DEVICES=0 python distill.py --data data/ds --out runs/distill_smoke --smoke --smoke-images 256 --batch-size 64
# 3. full distillation
CUDA_VISIBLE_DEVICES=0 python distill.py --data data/ds --out runs/distill --epochs 100 --batch-size 64
# 4. load into RF-DETR Nano, assert no skipped/mismatched keys
python load_backbone.py --ckpt runs/distill/rf-detr-nano-distilled.pth
# 5. features: stock vs distilled on held-out images (+ teacher reference, PCA plot)
python compare_features.py --data data/ds --split valid --distilled runs/distill/rf-detr-nano-distilled.pth --teacher --pca-plot
# 6. optional: same detector recipe from both backbones, test mAP
CUDA_VISIBLE_DEVICES=0 python finetune_detector.py --data data/ds --distilled runs/distill/rf-detr-nano-distilled.pth --epochs 50
```

## Files
| file | what |
|---|---|
| `offline_guard.py` | imported first by every script: offline env vars, project-local caches, blocks any non-loopback connection/DNS lookup **and** configured proxies; a swallowed attempt still exits the process with code 3 |
| `make_splits.py` | COCO or YOLO → RF-DETR layout `train/ valid/ test/` (`_annotations.coco.json`), duplicate images (md5) kept in one split |
| `distill.py` | LightlyTrain distillation, student `RFDETRNano(pretrain_weights=…)`, teacher `dinov3/vitl16`, 384×384, ImageNet mean/std, bf16 on GPU; `--smoke`; `--teacher hf` |
| `load_backbone.py` | strict key/shape check, proves rfdetr's own (strict=False) loader applied every tensor, only encoder tensors differ from stock |
| `compare_features.py` | ROI-pooled per-object features from the last encoder stage; kNN + linear probe (grouped by image); linear CKA, token cosine; optional teacher CKA and PCA plot |
| `finetune_detector.py` | identical RF-DETR recipe from stock and distilled init; test mAP50:95 / mAP50 |
| `convert_hf_dinov3.py` | HF DINOv3 folder → LightlyTrain native state dict, verified against transformers' model |
| `check_offline.py` | preflight: imports, weights + MD5, student/teacher forward, GPU/driver/bf16 report |
| `setup_env.sh`, `download_weights.sh`, `pack_env.sh`, `unpack_offline.sh` | env / weights / bundle |
| `tests/` | synthetic dataset, smoke pipeline, guard positive controls, negative tests |

## Verified findings (lightly-train 0.17.0, rfdetr 1.5.2)
- **RF-DETR Nano as student works.** `lightly_train.pretrain(model=RFDETRNano(...))` is accepted (RFDETRPackage
  checks `isinstance(model, RFDETR)`; Nano's encoder is the windowed DINOv2-S the wrapper expects). Trainable:
  the 21.8M-param encoder + two projection heads. Only `backbone.0.encoder.*` changes; decoder/projector untouched.
- **`method="distillation"` is DistillationV3** in 0.17.0. It distills the encoder's last stage (patch tokens)
  and its average-pooled global feature against the teacher's normed patch tokens and CLS token.
- **Teacher by name `dinov3/vitl16`** downloads, with no token, from
  `https://lightly-train-checkpoints.s3.us-east-1.amazonaws.com/dinov3/dinov3_vitl16_lvd1689m.pth`
  (1,213,050,671 bytes, MD5 `07469a2d507f0e58a0a9e0675a289e57` = S3 ETag) to
  `$LIGHTLY_TRAIN_CACHE_DIR/models/dinov3_vitl16_lvd1689m.pth` (default `~/.cache/lightly-train/models/`;
  here `cache/lightly-train/models/`). If the file exists, it is loaded and nothing is downloaded.
  LightlyTrain does not verify size/hash: a truncated download stays in the cache and fails later with
  "PytorchStreamReader failed reading zip archive" (happened during testing) → `download_weights.sh` checks MD5.
- **HF fallback**: `facebook/dinov3-vitl16-pretrain-lvd1689m` on HF is gated (manual approval, HF token
  needed to download). `teacher_weights` must be a state dict for LightlyTrain's own DINOv3 code (loaded
  strictly), so `convert_hf_dinov3.py` converts the HF folder and verifies it against transformers' model.
  Tested on an HF folder rebuilt from the real ViT-L weights: max abs diff 3.5e-6 vs transformers (fp32 RoPE);
  round-trip identical to Meta's checkpoint except the always-zero qkv `bias_mask`. Not tested on your folder.
- **Image size**: RF-DETR Nano is 384×384, patch 16, 2 windows → sizes must be divisible by 32. LightlyTrain's
  distillation default is 224 → `distill.py` sets `image_size=(384, 384)`. Normalization: ImageNet mean/std
  (LightlyTrain default, set explicitly).
- **Export**: `out/exported_models/exported_last.pt` = `{"model": LWDETR state_dict}` (all 465 keys) and loads with
  `RFDETRNano(pretrain_weights=...)`. rfdetr loads it with `strict=False` → `load_backbone.py` does the strict checks.

## Runtime network access found (and how it is handled)
| source | when | handling |
|---|---|---|
| rfdetr `rf-detr-nano.pth` (`storage.googleapis.com/rfdetr/nano_coco/checkpoint_best_regular.pth`, MD5 `fb6504cc…`) | `RFDETRNano()` if the file is missing; default target is **the current working directory** | pre-downloaded to `weights/`; scripts always pass the absolute path (missing abs path → no download attempt, load fails) |
| LightlyTrain DINOv3 teacher (S3, see above) | teacher build if cache file missing | pre-cached in `cache/lightly-train/models/` |
| LightlyTrain telemetry → `eu.i.posthog.com` (errors swallowed) | during `pretrain` | `LIGHTLY_TRAIN_EVENTS_DISABLED=1` |
| `lightly` (dependency) version check → `api.lightly.ai` (background thread on `import lightly`) | any LightlyTrain import | `LIGHTLY_DID_VERSION_CHECK=True` (found by the guard) |
| HF hub (DINOv2 configs/weights in rfdetr) | not used by Nano (patch 16 → hub weights skipped, config is a local JSON) | `HF_HUB_OFFLINE=1`, `TRANSFORMERS_OFFLINE=1` |
| albumentations update check | albumentations ≥1.4 only (pinned 1.3.1 has none) | `NO_ALBUMENTATIONS_UPDATE=1` |
| torch hub / timm | LightlyTrain downloads via `torch.hub.download_url_to_file` into its own cache; timm is not used by this pipeline (not installed) | `TORCH_HOME` → `cache/torch` |

The guard (`offline_guard.py`) is the "fail if a network call is attempted" check: any non-loopback
connect/DNS lookup, or a connection to a configured HTTP(S) proxy (a localhost proxy would otherwise slip
through, which happened during testing), raises `NetworkAccessError`, and the process exits with code 3
even if a library swallowed the exception. `ALLOW_NETWORK=1` disables it.

## What was tested (online, no GPU) and how
All on CPU (no GPU available for testing), synthetic 3-class shapes dataset, `tests/run_smoke.sh`:
- `setup_env.sh` (fresh create and update path) → `download_weights.sh` (real downloads, MD5 OK) →
  `pack_env.sh` (env.tar.gz 4.2 GB, project.tar 1.5 GB) → `unpack_offline.sh` into a new directory with the
  original conda install hidden, `env -i` and an empty `$HOME`, **inside `unshare -rn` (no network interface)**
  → `tests/run_smoke.sh` passed: preflight, guard controls, COCO + YOLO splits, 1-epoch distillation
  (teacher by name), `load_backbone`, negative tests, `compare_features` (+teacher, PCA), `finetune_detector`.
- cu128 kernels (no GPU here, so checked statically): `torch._C._cuda_getArchFlags()` = sm_70 sm_75 sm_80
  sm_86 sm_90 sm_100 sm_120, and the CUDA fatbins in `libtorch_cuda.so` and torchvision's `_C.so` contain sm_120
  cubins. Installed packages match `environment.yml` exactly (`pip check` clean).
- `--teacher hf` distillation and `convert_hf_dinov3.py`: tested in a separate CPU venv with the same package
  versions, on an HF folder rebuilt from the real ViT-L weights (not on the gated original).
- Negative tests: missing / unexpected / reshaped key, modified decoder, unchanged encoder, held-out image
  leaked into train → each is rejected.
- The smoke numbers (kNN, CKA, mAP) are meaningless (1 epoch, 16 synthetic images); they only show the code runs.

## What was NOT tested (you must run these)
- Anything on GPU: CUDA init, the driver version floor, bf16-mixed training, memory/batch size. Run
  `python check_offline.py` (prints driver, GPUs, bf16) and the GPU smoke step (`--smoke --smoke-images 256
  --batch-size 64`) on every GPU you will use (RTX 5090; 4090/A6000 if still used); lower `--batch-size`
  if it OOMs. Batch 64 is a starting guess, not a measured value.
- Full-length distillation (100 epochs default) and its effect on your data; the default LR comes from
  LightlyTrain (AdamW 5e-4 × sqrt(batch/1536)); `--lr` overrides it.
- Your real dataset through `make_splits.py` (COCO and YOLO paths were tested on synthetic data only).
- Your real HF folder `weights/dinov3-vitl16/` through `convert_hf_dinov3.py` (it self-checks against
  transformers and fails loudly if anything differs).
- conda-pack/conda-unpack on your machines (tested here on Linux x86_64, conda 26.7.2 / conda-pack 0.9.2).
  Don't run `conda clean -p` before packing (conda-pack then treats some packages as unmanaged).

## Notes
- One GPU per run: select it with `CUDA_VISIBLE_DEVICES=<id>`; `distill.py` uses `devices=1`.
- `rfdetr` loads `pretrain_weights` relative to the CWD if given a bare filename; scripts always pass absolute paths.
- `compare_features.py` uses the last encoder stage (the one that is distilled); `--stage 0..3` inspects the others.
  Per-object features are roi_align-pooled at stride 16, so very small boxes (<16 px at 384) cover <1 cell.
- Licenses: LightlyTrain prints that commercial training/inference needs a commercial license (otherwise AGPL-3.0
  or its community license); DINOv3 weights are under Meta's DINOv3 license; RF-DETR is Apache-2.0. Check these
  cover your use.
