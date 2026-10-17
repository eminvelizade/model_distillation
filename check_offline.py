"""Offline preflight. Run on the online PC (after download_weights.sh) and again on the offline PC.

With the network guard on, it: imports every library the pipeline uses (import-time network calls
would fail here), checks weight files + MD5, builds the student (RF-DETR Nano) and the teacher
(dinov3/vitl16 via LightlyTrain's own loader, from cache), runs one 384x384 forward each, and reports
GPU / driver / bf16 support. Exit code 0 = ready to run without network.

    python check_offline.py [--no-md5] [--device cpu]
"""

import offline_guard  # noqa: F401  (must be first)

import argparse
import os


def gpu_report() -> str:
    import torch

    if not torch.cuda.is_available():
        return "CUDA not available (CPU only)"
    try:
        import pynvml

        pynvml.nvmlInit()
        drv = pynvml.nvmlSystemGetDriverVersion()
        drv = drv.decode() if isinstance(drv, bytes) else drv
    except Exception as e:  # noqa: BLE001
        drv = f"unknown ({e})"
    gpus = [f"{i}: {torch.cuda.get_device_name(i)} sm_{''.join(map(str, torch.cuda.get_device_capability(i)))}"
            for i in range(torch.cuda.device_count())]
    return f"driver {drv}, torch CUDA runtime {torch.version.cuda}, bf16={torch.cuda.is_bf16_supported()}, GPUs: {gpus}"


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--no-md5", action="store_true")
    p.add_argument("--device", default=None)
    a = p.parse_args()

    for k in ("HF_HUB_OFFLINE", "TRANSFORMERS_OFFLINE", "LIGHTLY_TRAIN_EVENTS_DISABLED", "LIGHTLY_DID_VERSION_CHECK"):
        print(f"[check] {k}={os.environ.get(k)}")
    print(f"[check] network guard enabled: {offline_guard.ENABLED}; caches: {offline_guard.CACHE_DIR}")
    assert offline_guard.ENABLED, "ALLOW_NETWORK=1 is set; unset it for this check"

    import lightly  # noqa: F401  (its import starts a version check unless disabled)
    import lightly_train
    import matplotlib  # noqa: F401
    import pycocotools  # noqa: F401
    import rfdetr  # noqa: F401
    import sklearn  # noqa: F401
    import torch
    import transformers

    print(f"[check] torch {torch.__version__}, transformers {transformers.__version__}, lightly-train {lightly_train.__version__}")
    print(f"[check] {gpu_report()}")

    md5 = not a.no_md5
    offline_guard.require_file(offline_guard.NANO_WEIGHTS, check_md5=md5)
    offline_guard.require_file(offline_guard.TEACHER_CACHE_FILE, check_md5=md5)
    print(f"[check] weight files present{' (md5 ok)' if md5 else ''}")

    device = a.device or ("cuda" if torch.cuda.is_available() else "cpu")
    from rfdetr import RFDETRNano
    from lightly_train._models.dinov3.dinov3_package import DINOV3_PACKAGE

    student = RFDETRNano(pretrain_weights=str(offline_guard.NANO_WEIGHTS), device=device)
    enc = student.model.model.backbone[0].encoder.eval()
    teacher = DINOV3_PACKAGE.get_model("vitl16").to(device).eval()  # load_weights=True -> cache file, no download
    x = torch.randn(1, 3, 384, 384, device=device)
    with torch.no_grad():
        s = enc(x)[-1]
        t = teacher.forward_features(x)["x_norm_patchtokens"]
    assert tuple(s.shape) == (1, 384, 24, 24), s.shape
    assert tuple(t.shape) == (1, 576, 1024), t.shape
    print(f"[check] student last stage {tuple(s.shape)}, teacher patch tokens {tuple(t.shape)} on {device}")

    if offline_guard.HF_TEACHER_CONVERTED.is_file():
        teacher.load_state_dict(torch.load(offline_guard.HF_TEACHER_CONVERTED, map_location=device, weights_only=True))
        print(f"[check] converted HF teacher loads strictly: {offline_guard.HF_TEACHER_CONVERTED}")

    offline_guard.assert_no_network_attempts()
    print("[check] OFFLINE CHECK PASSED")


if __name__ == "__main__":
    main()
