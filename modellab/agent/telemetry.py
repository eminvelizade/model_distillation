"""Live machine telemetry for the heartbeat: GPU util / VRAM / temperature / power (NVML), CPU and RAM."""

from __future__ import annotations

import os
import subprocess
import time

_nvml = {"ok": None}
_cpu_prev: list[int] = []


def _nvml_init() -> bool:
    if _nvml["ok"] is None:
        try:
            import pynvml

            pynvml.nvmlInit()
            _nvml["ok"] = True
        except Exception:  # noqa: BLE001  (no driver / no nvidia-ml-py)
            _nvml["ok"] = False
    return bool(_nvml["ok"])


def gpus() -> list[dict]:
    if _nvml_init():
        import pynvml

        out = []
        try:
            for i in range(pynvml.nvmlDeviceGetCount()):
                h = pynvml.nvmlDeviceGetHandleByIndex(i)
                name = pynvml.nvmlDeviceGetName(h)
                mem = pynvml.nvmlDeviceGetMemoryInfo(h)
                util = pynvml.nvmlDeviceGetUtilizationRates(h)
                try:
                    power = pynvml.nvmlDeviceGetPowerUsage(h) / 1000
                except pynvml.NVMLError:
                    power = None
                out.append({"index": i, "name": name.decode() if isinstance(name, bytes) else name, "util": util.gpu,
                            "mem_used_mb": round(mem.used / 2**20), "mem_total_mb": round(mem.total / 2**20),
                            "temp_c": pynvml.nvmlDeviceGetTemperature(h, pynvml.NVML_TEMPERATURE_GPU), "power_w": power})
            return out
        except pynvml.NVMLError:
            _nvml["ok"] = None  # driver reloaded: try again next time
            return []
    return _nvidia_smi()


def _nvidia_smi() -> list[dict]:
    q = "index,name,utilization.gpu,memory.used,memory.total,temperature.gpu,power.draw"
    try:
        r = subprocess.run(["nvidia-smi", f"--query-gpu={q}", "--format=csv,noheader,nounits"], capture_output=True,
                           text=True, timeout=10)
    except (OSError, subprocess.SubprocessError):
        return []
    out = []
    for line in r.stdout.strip().splitlines():
        f = [x.strip() for x in line.split(",")]
        if len(f) < 7:
            continue

        def num(x):
            try:
                return float(x)
            except ValueError:
                return None

        out.append({"index": int(f[0]), "name": f[1], "util": num(f[2]), "mem_used_mb": num(f[3]), "mem_total_mb": num(f[4]),
                    "temp_c": num(f[5]), "power_w": num(f[6])})
    return out


def cpu_percent() -> float | None:
    try:
        vals = [int(x) for x in open("/proc/stat").readline().split()[1:]]
    except OSError:
        return None
    global _cpu_prev
    prev, _cpu_prev = _cpu_prev, vals
    if not prev:
        return None
    idle = (vals[3] + vals[4]) - (prev[3] + prev[4])
    total = sum(vals) - sum(prev)
    return round(100 * (1 - idle / total), 1) if total > 0 else None


def memory() -> dict:
    info = {}
    try:
        for line in open("/proc/meminfo"):
            k, v = line.split(":", 1)
            info[k] = int(v.split()[0]) * 1024
    except OSError:
        return {}
    return {"ram_total_gb": round(info.get("MemTotal", 0) / 2**30, 1),
            "ram_used_gb": round((info.get("MemTotal", 0) - info.get("MemAvailable", 0)) / 2**30, 1)}


def live() -> dict:
    return {"gpus": gpus(), "cpu_percent": cpu_percent(), "load": os.getloadavg()[0], **memory(), "time": time.time()}
