"""Self-check: hardware facts and the checks the Machines page shows (red = blocks a run, amber = worth fixing).

Host facts are read in the agent process (cheap, no CUDA). GPU/CUDA/environment checks run in a separate process
(modellab.agent.probe) and are skipped while a run trains, reusing the last probe.
"""

from __future__ import annotations

import json
import os
import platform
import resource
import shutil
import subprocess
import sys
import time

from modellab import ROOT, catalog, datasets, release, weights
from modellab.agent import AGENT_VERSION, SERVICE, data_dir, home, release_info

MIN_DRIVER = 570
HASHES = "dataset_hashes.json"


def _gb(n: float) -> float:
    return round(n / 2**30, 1)


def _driver() -> tuple[str | None, str | None, list[dict]]:
    """-> (driver version, CUDA version the driver supports, [{name, memory_gb}]) from NVML or nvidia-smi."""
    try:
        import pynvml

        pynvml.nvmlInit()
        drv = pynvml.nvmlSystemGetDriverVersion()
        cuda = pynvml.nvmlSystemGetCudaDriverVersion_v2()
        gpus = []
        for i in range(pynvml.nvmlDeviceGetCount()):
            h = pynvml.nvmlDeviceGetHandleByIndex(i)
            name = pynvml.nvmlDeviceGetName(h)
            gpus.append({"index": i, "name": name.decode() if isinstance(name, bytes) else name,
                         "memory_gb": _gb(pynvml.nvmlDeviceGetMemoryInfo(h).total)})
        return (drv.decode() if isinstance(drv, bytes) else drv), f"{cuda // 1000}.{cuda % 1000 // 10}", gpus
    except Exception:  # noqa: BLE001
        pass
    try:
        r = subprocess.run(["nvidia-smi", "--query-gpu=index,name,memory.total,driver_version", "--format=csv,noheader,nounits"],
                           capture_output=True, text=True, timeout=15)
        gpus, drv = [], None
        for line in r.stdout.strip().splitlines():
            i, name, mem, drv = [x.strip() for x in line.split(",")]
            gpus.append({"index": int(i), "name": name, "memory_gb": round(float(mem) / 1024, 1)})
        return drv, None, gpus
    except (OSError, ValueError, subprocess.SubprocessError):
        return None, None, []


def _os_release() -> str:
    try:
        for line in open("/etc/os-release"):
            if line.startswith("PRETTY_NAME="):
                return line.split("=", 1)[1].strip().strip('"')
    except OSError:
        pass
    return platform.system()


def _cpu() -> dict:
    model = ""
    try:
        for line in open("/proc/cpuinfo"):
            if line.startswith("model name"):
                model = line.split(":", 1)[1].strip()
                break
    except OSError:
        pass
    return {"model": model or platform.processor(), "threads": os.cpu_count()}


def _ram() -> tuple[float, float]:
    info = {}
    try:
        for line in open("/proc/meminfo"):
            k, v = line.split(":", 1)
            info[k] = int(v.split()[0]) * 1024
    except OSError:
        pass
    return _gb(info.get("MemTotal", 0)), _gb(info.get("MemAvailable", 0))


def _service() -> dict:
    """systemd user service and lingering (without lingering the agent stops when the user logs out)."""
    out = {"systemd": shutil.which("systemctl") is not None, "active": None, "linger": None}
    if not out["systemd"]:
        return out
    try:
        out["active"] = subprocess.run(["systemctl", "--user", "is-active", SERVICE], capture_output=True, text=True,
                                       timeout=10).stdout.strip() or None
        user = os.environ.get("USER") or os.environ.get("LOGNAME") or ""
        r = subprocess.run(["loginctl", "show-user", user, "-p", "Linger"], capture_output=True, text=True, timeout=10)
        out["linger"] = r.stdout.strip().endswith("=yes") if r.returncode == 0 else None
    except (OSError, subprocess.SubprocessError):
        pass
    return out


def host_facts() -> dict:
    drv, cuda, gpus = _driver()
    total, avail = _ram()
    du = shutil.disk_usage(data_dir() if data_dir().exists() else home().parent)
    try:
        shm = _gb(shutil.disk_usage("/dev/shm").total)
    except OSError:
        shm = None
    soft, hard = resource.getrlimit(resource.RLIMIT_NOFILE)
    glibc = os.confstr("CS_GNU_LIBC_VERSION") if hasattr(os, "confstr") else None
    return {"os": _os_release(), "kernel": platform.release(), "arch": platform.machine(), "glibc": glibc,
            "hostname": platform.node(), "cpu": _cpu(), "ram_gb": total, "ram_available_gb": avail,
            "driver": drv, "cuda_driver": cuda, "gpus": gpus, "shm_gb": shm,
            "disk": {"path": str(data_dir()), "free_gb": _gb(du.free), "total_gb": _gb(du.total)},
            "nofile": {"soft": soft, "hard": hard if hard != resource.RLIM_INFINITY else -1},
            "python": sys.version.split()[0], "service": _service()}


def probe(timeout: float = 300) -> dict:
    lock = ROOT / release.LOCK
    cmd = [sys.executable, "-m", "modellab.agent.probe", *([str(lock)] if lock.is_file() else [])]
    env = dict(os.environ, PYTHONPATH=str(ROOT))
    env.pop("ALLOW_NETWORK", None)
    try:
        r = subprocess.run(cmd, cwd=ROOT, env=env, capture_output=True, text=True, timeout=timeout)
        return json.loads(r.stdout.strip().splitlines()[-1]) if r.stdout.strip() else {"probe_error": r.stderr[-800:]}
    except (subprocess.SubprocessError, ValueError, IndexError) as e:
        return {"probe_error": f"{type(e).__name__}: {e}"}


def _check(cid: str, label: str, status: str, value=None, detail: str = "") -> dict:
    return {"id": cid, "label": label, "status": status, "value": value, "detail": detail}


def _ver_tuple(v: str) -> tuple:
    return tuple(int(x) for x in v.split(".") if x.isdigit())


def checks(f: dict, p: dict | None, skip_gpu: bool = False) -> list[dict]:
    out = []
    ok_os = platform.system() == "Linux" and f["arch"] == "x86_64"
    out.append(_check("os", "Operating system", "ok" if ok_os else "fail", f"{f['os']} ({f['arch']})",
                      "" if ok_os else "ModelLab agents run on Linux x86_64 only."))
    g = (f.get("glibc") or "").split()[-1] if f.get("glibc") else None
    ok_g = g is not None and _ver_tuple(g) >= (2, 28)
    out.append(_check("glibc", "glibc", "ok" if ok_g else "fail", g,
                      "" if ok_g else "The PyTorch wheels need glibc 2.28 or newer (Ubuntu 20.04+, Debian 10+, RHEL 8+)."))
    drv = f.get("driver")
    if skip_gpu and not drv:
        out.append(_check("driver", "NVIDIA driver", "warn", None, "No NVIDIA driver: this machine can only run CPU tests."))
    elif not drv:
        out.append(_check("driver", "NVIDIA driver", "fail", None,
                          "No NVIDIA driver found. Install driver 570 or newer (Ubuntu: sudo ubuntu-drivers install), then reboot."))
    elif _ver_tuple(drv)[:1] < (MIN_DRIVER,):
        out.append(_check("driver", "NVIDIA driver", "fail", drv,
                          f"Driver {drv} is older than {MIN_DRIVER}, which CUDA 12.8 and the RTX 50 series need. Update the driver."))
    else:
        out.append(_check("driver", "NVIDIA driver", "ok", drv + (f" (CUDA {f['cuda_driver']})" if f.get("cuda_driver") else "")))
    if f["gpus"]:
        out.append(_check("gpu", "GPU", "ok", ", ".join(f"{x['name']} {x['memory_gb']:.0f} GB" for x in f["gpus"])))
    elif not skip_gpu:
        out.append(_check("gpu", "GPU", "fail", None, "No NVIDIA GPU visible to the driver."))
    if p is not None:
        if p.get("probe_error"):
            out.append(_check("env", "Python environment", "fail", None, f"The environment check crashed: {p['probe_error'][-300:]}"))
        else:
            tor = p.get("torch")
            if p.get("torch_error"):
                out.append(_check("torch", "PyTorch", "fail", None, p["torch_error"]))
            elif not p.get("cuda_available") and not skip_gpu:
                out.append(_check("cuda", "CUDA", "fail", tor, "PyTorch cannot use the GPU (torch.cuda.is_available() is False). "
                                                               "Check the driver (nvidia-smi) and reboot after driver updates."))
            else:
                bad = [d for d in p.get("devices", []) if not d.get("matmul_ok")]
                if bad:
                    out.append(_check("cuda", "CUDA", "fail", tor, "; ".join(f"GPU {d['index']} {d['name']}: {d.get('error', '')}" for d in bad)))
                elif p.get("devices"):
                    caps = ", ".join(sorted({d["capability"] for d in p["devices"]}))
                    out.append(_check("cuda", "CUDA", "ok", f"torch {tor}, CUDA {p.get('torch_cuda')}, compute {caps}"))
                else:
                    out.append(_check("cuda", "CUDA", "warn", f"torch {tor}", "CPU only"))
            if p.get("transforms_error"):
                out.append(_check("transforms", "rfdetr image transforms", "fail", None, p["transforms_error"]))
            elif p.get("albumentations_rfdetr"):
                out.append(_check("transforms", "rfdetr image transforms", "ok", f"albumentations {p['albumentations_rfdetr']}"))
            mm = p.get("lock_mismatch") or []
            if mm:
                out.append(_check("packages", "Packages vs lock", "warn", f"{len(mm)} differ",
                                  ", ".join(f"{m['package']} {m['got']} (lock {m['want']})" for m in mm[:6])))
            elif "lock_mismatch" in p:
                out.append(_check("packages", "Packages vs lock", "ok", "match"))
    free = f["disk"]["free_gb"]
    out.append(_check("disk", "Free disk", "fail" if free < 10 else "warn" if free < 50 else "ok", f"{free:.0f} GB free",
                      "" if free >= 50 else f"Checkpoints, weights and caches need room: {free:.0f} GB left in {f['disk']['path']}."))
    out.append(_check("ram", "Memory", "warn" if f["ram_gb"] < 15 else "ok", f"{f['ram_gb']:.0f} GB",
                      "" if f["ram_gb"] >= 15 else "Less than 16 GB RAM: lower num_workers or batch sizes if runs get killed."))
    shm = f.get("shm_gb")
    out.append(_check("shm", "Shared memory (/dev/shm)", "warn" if shm is not None and shm < 1 else "ok",
                      f"{shm:.1f} GB" if shm is not None else "?",
                      "" if shm is None or shm >= 1 else "Data-loader workers pass batches through /dev/shm; under 1 GB they crash. "
                                                         "In Docker use --shm-size=8g."))
    hard = f["nofile"]["hard"]
    out.append(_check("nofile", "Open-files limit", "warn" if 0 <= hard < 65536 else "ok", f"soft {f['nofile']['soft']}, hard "
                      + ("unlimited" if hard < 0 else str(hard)),
                      "" if hard < 0 or hard >= 65536 else "ModelLab raises the limit to the hard limit; below 65536 PyTorch "
                                                           "switches to file_system tensor sharing (works, uses /dev/shm)."))
    svc = f.get("service") or {}
    if svc.get("active") == "active" and svc.get("linger") is False:
        out.append(_check("linger", "Runs without login", "warn", "off",
                          "The agent stops when you log out. Fix: loginctl enable-linger (may need an admin)."))
    return out


def dataset_hashes() -> dict:
    try:
        return json.loads((data_dir() / HASHES).read_text())
    except (OSError, ValueError):
        return {}


def _save_hashes(reg: dict) -> None:
    p = data_dir() / HASHES
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(reg, indent=1))


def remember_hash(name: str, info: dict) -> None:
    reg = dataset_hashes()
    reg[name] = {"hash": info.get("hash"), "path": info.get("path"), "time": time.time()}
    _save_hashes(reg)


def forget_hash(name: str) -> None:
    reg = dataset_hashes()
    if reg.pop(name, None) is not None:
        _save_hashes(reg)


def dataset_list() -> list[dict]:
    known = dataset_hashes()
    out = []
    for d in datasets.list_all():
        h = known.get(d["name"])
        if h and h.get("path") == d.get("path"):
            d["hash"], d["hash_time"] = h.get("hash"), h.get("time")
        out.append(d)
    return out


def weight_list() -> dict:
    out = {}
    for k in catalog.all_weight_keys():
        s = weights.status(k)
        out[k] = {"present": s["present"], "verified": s["verified"], "size": s["size"], "expected_size": s["expected_size"]}
    return out


def report(with_probe: bool = True, last_probe: dict | None = None, skip_gpu: bool = False) -> dict:
    f = host_facts()
    p = probe() if with_probe else last_probe
    if p and p.get("devices"):
        caps = {d["index"]: d for d in p["devices"]}
        for g in f["gpus"]:
            if g["index"] in caps:
                g["capability"] = caps[g["index"]]["capability"]
    rel = release_info()
    return {"time": time.time(), "agent_version": AGENT_VERSION, "release": rel.get("version"), "lock_hash": rel.get("lock_hash"),
            "home": str(home()), "hardware": {**f, "torch": (p or {}).get("torch"), "torch_cuda": (p or {}).get("torch_cuda")},
            "checks": checks(f, p, skip_gpu), "probe": p, "probe_time": time.time() if with_probe else None,
            "datasets": dataset_list(), "weights": weight_list()}


def print_report(rep: dict) -> None:
    hw = rep["hardware"]
    print(f"Machine: {hw['hostname']} · {hw['os']} · {hw['cpu']['model']} ({hw['cpu']['threads']} threads) · {hw['ram_gb']:.0f} GB RAM")
    for g in hw["gpus"]:
        print(f"GPU {g['index']}: {g['name']} {g['memory_gb']:.0f} GB" + (f" (compute {g['capability']})" if g.get("capability") else ""))
    mark = {"ok": "  ok ", "warn": " WARN", "fail": " FAIL"}
    for c in rep["checks"]:
        print(f"{mark[c['status']]}  {c['label']:<26} {c['value'] or ''}")
        if c["detail"] and c["status"] != "ok":
            print(f"       {c['detail']}")
    for d in rep["datasets"]:
        state = "error: " + d["error"] if d.get("error") else ("ready" if d.get("built") else "not built")
        print(f"dataset {d['name']:<20} {state}")
