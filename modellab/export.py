"""Export a trained detector (a finetune stage's checkpoint) for deployment. `python -m modellab.export <run_id> <stage>`

Writes runs/<id>/export/<stage>/ on the machine that trained it (nothing is uploaded):
  model.onnx         the network, fp32, batch 1 at the trained input size (RF-DETR via rfdetr, LT-DETR via LightlyTrain)
  model.engine       a TensorRT FP16 engine, when TensorRT's trtexec is installed on the machine; it only runs on the GPU
                     model and TensorRT version that built it
  preprocess.json    input size, normalisation and the class name of every output column
  infer_onnx.py      a short, dependency-light example (numpy, pillow, onnxruntime)
  model_card.md/json what it is, how it was trained, how well it does, where the files are

Both families output raw class logits and normalised (cx, cy, w, h) boxes for a fixed number of queries; the example
decodes them the way the libraries do (sigmoid, top-k over queries x classes).
"""

import offline_guard  # noqa: F401  (must be first)

import hashlib
import json
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

from modellab import catalog, store

IMAGENET = {"mean": [0.485, 0.456, 0.406], "std": [0.229, 0.224, 0.225]}
TRTEXEC_PATHS = ("/usr/src/tensorrt/bin/trtexec", "/usr/local/tensorrt/bin/trtexec", "/opt/tensorrt/bin/trtexec")

INFER = '''"""Run the exported model on one image: python infer_onnx.py image.jpg [threshold]

Needs numpy, pillow and onnxruntime (onnxruntime-gpu for CUDA). Prints one line per detection: class, score, box
(x1, y1, x2, y2 in pixels of the original image)."""

import json
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

here = Path(__file__).parent
pre = json.loads((here / "preprocess.json").read_text())
img = Image.open(sys.argv[1]).convert("RGB")
threshold = float(sys.argv[2]) if len(sys.argv) > 2 else 0.5
w, h = img.size
s = pre["input_size"]
x = np.asarray(img.resize((s, s), Image.BILINEAR), dtype=np.float32) / 255.0
x = (x - np.array(pre["mean"], np.float32)) / np.array(pre["std"], np.float32)
x = x.transpose(2, 0, 1)[None]
sess = ort.InferenceSession(str(here / "model.onnx"), providers=ort.get_available_providers())
boxes, logits = (sess.run([pre["boxes_output"], pre["logits_output"]], {pre["input"]: x}))
scores = 1 / (1 + np.exp(-logits[0]))  # [queries, columns]
flat = scores.ravel()
top = np.argsort(-flat)[: pre.get("max_detections", 100)]
for i in top:
    if flat[i] < threshold:
        break
    q, col = divmod(int(i), scores.shape[1])
    name = pre["classes"][col] if col < len(pre["classes"]) else None
    if name is None:
        continue  # a column with no class (e.g. RF-DETR's background column)
    cx, cy, bw, bh = boxes[0][q]
    print(f"{name}\\t{flat[i]:.3f}\\t{(cx - bw / 2) * w:.1f}\\t{(cy - bh / 2) * h:.1f}\\t{(cx + bw / 2) * w:.1f}\\t{(cy + bh / 2) * h:.1f}")
'''


def log(msg: str) -> None:
    print(f"[export {time.strftime('%H:%M:%S')}] {msg}", flush=True)


def _sha256(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def trtexec() -> str | None:
    found = shutil.which("trtexec")
    return found or next((p for p in TRTEXEC_PATHS if Path(p).is_file()), None)


def _tensorrt(onnx_path: Path, engine: Path, input_name: str, size: int) -> dict:
    """Build an FP16 engine with trtexec and time it (median / p95 GPU compute time, batch 1)."""
    exe = trtexec()
    if exe is None:
        return {"tensorrt": "not installed on this machine (no trtexec): ONNX only"}
    cmd = [exe, f"--onnx={onnx_path}", f"--saveEngine={engine}", "--fp16", "--warmUp=500", "--duration=5",
           "--percentile=95", f"--shapes={input_name}:1x3x{size}x{size}"]
    log("$ " + " ".join(cmd))
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=3600)
    except (OSError, subprocess.SubprocessError) as e:
        return {"tensorrt": f"trtexec failed: {e}"}
    out = r.stdout + r.stderr
    if r.returncode != 0 or not engine.is_file():
        tail = "\n".join(out.strip().splitlines()[-6:])
        log(tail)
        return {"tensorrt": f"trtexec failed (exit {r.returncode}): {tail[-500:]}"}
    m = re.search(r"GPU Compute Time:.*?median = ([0-9.]+) ms.*?percentile\(95%\) = ([0-9.]+) ms", out)
    ver = re.search(r"TensorRT version: ([0-9.]+)", out) or re.search(r"\[TensorRT v(\d+)\]", out)
    res = {"tensorrt": "built", "tensorrt_version": ver.group(1) if ver else None}
    if m:
        res.update(trt_latency_ms=float(m.group(1)), trt_latency_p95_ms=float(m.group(2)))
    return res


def _eval_metrics(run_id: str, resolved: dict, stage: str) -> dict:
    """Metrics of the eval stages that evaluated this stage's model: the test split if there is one."""
    found = {}
    for s in resolved["stages"]:
        if s["type"] == "eval" and isinstance(s.get("model"), dict) and s["model"].get("from") == stage:
            f = store.stage_dir(run_id, s["name"]) / "result.json"
            if f.is_file():
                found[s.get("split", "test")] = json.loads(f.read_text()).get("metrics") or {}
    return found.get("test") or found.get("valid") or {}


def export(run_id: str, stage: str) -> dict:
    rd, sd = store.run_dir(run_id), store.stage_dir(run_id, stage)
    resolved = json.loads((rd / "resolved.json").read_text())
    st = next((s for s in resolved["stages"] if s["name"] == stage), None)
    if st is None:
        raise ValueError(f"run {run_id} has no stage {stage!r}")
    if st["type"] != "finetune":
        raise ValueError("only fine-tune stages produce a detector to deploy")
    res_f = sd / "result.json"
    if not res_f.is_file():
        raise ValueError(f"stage {stage} hasn't finished on this machine")
    outs = json.loads(res_f.read_text())["outputs"]
    det = catalog.detector(outs["model"])
    ckpt = sd / outs["checkpoint"]
    size = int(outs.get("image_size") or det.resolution)
    out = rd / "export" / stage
    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True)
    onnx_path = out / "model.onnx"
    log(f"exporting {det.id} ({det.family}) from {ckpt} at {size}x{size}")
    if det.family == "rfdetr":
        import rfdetr

        rf = getattr(rfdetr, det.rfdetr_class)(pretrain_weights=str(ckpt), device="cpu", resolution=size)
        rf.export(output_dir=str(out), simplify=False, verbose=False)
        (out / "inference_model.onnx").rename(onnx_path)
        classes = json.loads((sd / outs["classes"]).read_text()) if outs.get("classes") else list(dict(rf.class_names).values())
        pre = {"input": "input", "boxes_output": "dets", "logits_output": "labels", **IMAGENET}
    else:
        import lightly_train

        m = lightly_train.load_model(str(ckpt), device="cpu").eval()
        m.export_onnx(out=str(onnx_path), precision="fp32", simplify=True, verify=True)
        import onnx

        meta = {p.key: p.value for p in onnx.load(str(onnx_path), load_external_data=False).metadata_props}
        norm = json.loads(meta["image_normalize"]) if meta.get("image_normalize") else IMAGENET  # what LightlyTrain uses
        cls_meta = json.loads(meta["classes"]) if meta.get("classes") else {str(k): v for k, v in m.classes.items()}
        classes = [str(v) for v in cls_meta.values()]  # output column i = the i-th class
        pre = {"input": "images", "boxes_output": "boxes", "logits_output": "logits",
               "mean": list(norm["mean"]), "std": list(norm["std"])}
    pre.update(input_size=size, classes=classes, max_detections=100, box_format="normalised cx, cy, w, h",
               scores="sigmoid of the logits")
    (out / "preprocess.json").write_text(json.dumps(pre, indent=2))
    (out / "infer_onnx.py").write_text(INFER)
    log(f"ONNX written: {onnx_path} ({onnx_path.stat().st_size / 2**20:.1f} MB)")
    trt = _tensorrt(onnx_path, out / "model.engine", pre["input"], size)
    log(f"TensorRT: {trt.get('tensorrt')}" + (f", {trt['trt_latency_ms']:.2f} ms median" if trt.get("trt_latency_ms") else ""))

    metrics = _eval_metrics(run_id, resolved, stage)
    try:
        ds_info = json.loads((rd / "datasets.json").read_text()).get(st["dataset"], {})
    except (OSError, ValueError):
        ds_info = {}
    files = {p.name: {"size": p.stat().st_size, "sha256": _sha256(p)} for p in sorted(out.iterdir()) if p.is_file()}
    card = {
        "model": det.id, "label": det.label, "family": det.family, "backbone": det.backbone, "input_size": size,
        "classes": classes, "run_id": run_id, "run_name": resolved.get("name"), "stage": stage,
        "trained": {k: st.get(k) for k in ("init", "lr", "batch_size", "budget", "seed", "image_size")},
        "dataset": {"name": st["dataset"], "fingerprint": (ds_info.get("hash") or {}).get("all"),
                    "train_images": (ds_info.get("train") or {}).get("images")},
        "metrics": {k: metrics.get(k) for k in ("split", "map", "map50", "ap_small", "ap_medium", "ap_large", "per_class",
                                                 "latency_ms", "latency_p95_ms", "latency_device", "params_m", "eval_version")
                    if metrics.get(k) is not None},
        **trt, "folder": str(out), "files": files, "exported": time.time(),
    }
    (out / "model_card.json").write_text(json.dumps(card, indent=2, default=str))
    (out / "model_card.md").write_text(_card_md(card))
    files = {p.name: {"size": p.stat().st_size} for p in sorted(out.iterdir()) if p.is_file()}
    return {**card, "files": files}


def _card_md(c: dict) -> str:
    m = c["metrics"]
    lines = [f"# {c['label']} at {c['input_size']}x{c['input_size']}", "",
             f"Trained in ModelLab run `{c['run_id']}` ({c.get('run_name') or ''}), stage `{c['stage']}`.", "",
             "| | |", "|---|---|",
             f"| Model | {c['model']} ({c['family']}, backbone {c['backbone']}) |",
             f"| Input | 1x3x{c['input_size']}x{c['input_size']}, RGB, see preprocess.json |",
             f"| Classes | {', '.join(c['classes'][:30])}{' ...' if len(c['classes']) > 30 else ''} |",
             f"| Dataset | {c['dataset']['name']} (fingerprint {str(c['dataset']['fingerprint'])[:12]}) |"]
    if m.get("map") is not None:
        lines.append(f"| mAP50:95 / mAP50 ({m.get('split')}) | {m['map']:.4f} / {m.get('map50', 0):.4f} |")
    if m.get("latency_ms") is not None:
        lines.append(f"| Latency, PyTorch | {m['latency_ms']:.2f} ms median, {m.get('latency_p95_ms', 0):.2f} ms p95 ({m.get('latency_device')}) |")
    if c.get("trt_latency_ms") is not None:
        lines.append(f"| Latency, TensorRT FP16 | {c['trt_latency_ms']:.2f} ms median, {c.get('trt_latency_p95_ms', 0):.2f} ms p95 "
                     f"(TensorRT {c.get('tensorrt_version') or '?'}) |")
    else:
        lines.append(f"| TensorRT | {c.get('tensorrt')} |")
    lines += ["", "## Files", "", *[f"- `{n}` ({f['size'] / 2**20:.1f} MB, sha256 {f['sha256'][:16]}...)" for n, f in c["files"].items()],
              "", "## Run it", "", "```bash", "python infer_onnx.py image.jpg 0.5", "```", "",
              "`model.engine` only runs on the GPU model and TensorRT version that built it; rebuild it from `model.onnx` "
              "with `trtexec --onnx=model.onnx --fp16 --saveEngine=model.engine` elsewhere.", ""]
    return "\n".join(lines)


def main(argv: list[str]) -> int:
    run_id, stage = argv
    try:
        res = export(run_id, stage)
    except Exception as e:  # noqa: BLE001
        import traceback

        traceback.print_exc()
        print("EXPORT_ERROR " + json.dumps({"error": f"{type(e).__name__}: {e}"[-2000:]}), flush=True)
        return 1
    print("EXPORT_RESULT " + json.dumps(res, default=str), flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
