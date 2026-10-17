"""Offline guard. Import this FIRST in every script, before torch/transformers/rfdetr.

It does three things:
1. Sets offline / telemetry-off env vars (HF, transformers, LightlyTrain events, ...).
2. Points every library cache at <project>/cache so weights travel with the project.
3. Patches the socket module so that any non-loopback connection or DNS lookup
   raises NetworkAccessError. Libraries sometimes swallow exceptions (LightlyTrain's
   telemetry does `except Exception: pass`), so every attempt is also recorded and the
   process exits with code 3 at shutdown if anything was attempted.

Set ALLOW_NETWORK=1 to disable the socket patch (env vars are still set).
"""

from __future__ import annotations

import atexit
import ipaddress
import os
import socket
import sys
import threading
import traceback
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
CACHE_DIR = Path(os.environ.get("PROJECT_CACHE_DIR", ROOT / "cache")).resolve()
WEIGHTS_DIR = Path(os.environ.get("PROJECT_WEIGHTS_DIR", ROOT / "weights")).resolve()

# Files produced by download_weights.sh.
NANO_WEIGHTS = WEIGHTS_DIR / "rf-detr-nano.pth"
TEACHER_NAME = "dinov3/vitl16"
TEACHER_CACHE_FILE = CACHE_DIR / "lightly-train" / "models" / "dinov3_vitl16_lvd1689m.pth"
HF_TEACHER_DIR = WEIGHTS_DIR / "dinov3-vitl16"
HF_TEACHER_CONVERTED = WEIGHTS_DIR / "dinov3_vitl16_from_hf.pt"

EXPECTED_MD5 = {
    NANO_WEIGHTS.name: "fb6504cce7fbdc783f7a46991f07639f",  # rfdetr ModelWeights registry
    TEACHER_CACHE_FILE.name: "07469a2d507f0e58a0a9e0675a289e57",  # S3 ETag (single-part upload)
}

_ENV = {
    "HF_HUB_OFFLINE": "1",
    "TRANSFORMERS_OFFLINE": "1",
    "HF_DATASETS_OFFLINE": "1",
    "HF_HUB_DISABLE_TELEMETRY": "1",
    "LIGHTLY_TRAIN_EVENTS_DISABLED": "1",  # PostHog analytics -> eu.i.posthog.com
    "LIGHTLY_DID_VERSION_CHECK": "True",  # `import lightly` -> background check to api.lightly.ai
    "NO_ALBUMENTATIONS_UPDATE": "1",  # albumentations>=1.4 checks PyPI on import
    "WANDB_MODE": "disabled",
    "LIGHTLY_TRAIN_CACHE_DIR": str(CACHE_DIR / "lightly-train"),
    "HF_HOME": str(CACHE_DIR / "huggingface"),
    "TORCH_HOME": str(CACHE_DIR / "torch"),
    "MPLCONFIGDIR": str(CACHE_DIR / "matplotlib"),
}
for _k, _v in _ENV.items():
    os.environ.setdefault(_k, _v)

if any(m in sys.modules for m in ("torch", "transformers", "huggingface_hub", "rfdetr", "lightly_train")):
    print(
        "[offline_guard] WARNING: imported after torch/transformers/rfdetr/lightly_train; "
        "env vars may not have taken effect. Import offline_guard first.",
        file=sys.stderr,
    )


class NetworkAccessError(RuntimeError):
    pass


ATTEMPTS: list[str] = []
_lock = threading.Lock()
_orig_connect = socket.socket.connect
_orig_connect_ex = socket.socket.connect_ex
_orig_create_connection = socket.create_connection
_orig_getaddrinfo = socket.getaddrinfo


def _is_local_host(host: object) -> bool:
    if host is None:
        return True
    if isinstance(host, bytes):
        host = host.decode(errors="replace")
    host = str(host).strip("[]")
    if host in ("", "localhost", "localhost.localdomain"):
        return True
    try:
        ip = ipaddress.ip_address(host.split("%")[0])
        return ip.is_loopback or ip.is_unspecified
    except ValueError:
        return False


def _block(what: str) -> None:
    stack = "".join(traceback.format_stack(limit=25)[:-2])
    msg = f"Blocked network access: {what}"
    with _lock:
        ATTEMPTS.append(f"{msg}\n{stack}")
    print(f"[offline_guard] {msg}", file=sys.stderr)
    raise NetworkAccessError(msg + " (offline_guard; set ALLOW_NETWORK=1 to allow)")


def _check(address: object, what: str) -> None:
    host, port = (address[0], address[1] if len(address) > 1 else None) if isinstance(address, tuple) else (address, None)
    if not _is_local_host(host):
        _block(f"{what} {address!r}")
    if port is not None and (str(host).strip("[]"), int(port)) in PROXIES:
        _block(f"{what} {address!r} (configured HTTP proxy)")


def _connect(self, address):  # type: ignore[no-untyped-def]
    if self.family != getattr(socket, "AF_UNIX", None):
        _check(address, "connect to")
    return _orig_connect(self, address)


def _connect_ex(self, address):  # type: ignore[no-untyped-def]
    if self.family != getattr(socket, "AF_UNIX", None):
        _check(address, "connect to")
    return _orig_connect_ex(self, address)


def _create_connection(address, *args, **kwargs):  # type: ignore[no-untyped-def]
    _check(address, "create_connection to")
    return _orig_create_connection(address, *args, **kwargs)


def _getaddrinfo(host, *args, **kwargs):  # type: ignore[no-untyped-def]
    if not _is_local_host(host):
        _block(f"DNS lookup of {host!r}")
    return _orig_getaddrinfo(host, *args, **kwargs)


def _report_at_exit() -> None:
    if not ATTEMPTS:
        return
    sys.stderr.write(
        f"\n[offline_guard] FAIL: {len(ATTEMPTS)} network access attempt(s) in this process "
        f"(pid {os.getpid()}). First one:\n{ATTEMPTS[0]}\n"
    )
    sys.stderr.flush()
    os._exit(3)


ENABLED = os.environ.get("ALLOW_NETWORK", "0") != "1"

# A proxy on localhost would otherwise pass the loopback exception. Remember every configured
# proxy endpoint (blocked even on 127.0.0.1) and drop the vars so clients try direct connections.
PROXIES: set[tuple[str, int]] = set()
for _var in ("HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "http_proxy", "https_proxy", "all_proxy"):
    _val = os.environ.get(_var)
    if _val:
        _u = urlparse(_val if "://" in _val else f"http://{_val}")
        if _u.hostname:
            PROXIES.add((_u.hostname, _u.port or (443 if _u.scheme == "https" else 80)))
        if ENABLED:
            del os.environ[_var]

if ENABLED:
    socket.socket.connect = _connect  # type: ignore[method-assign]
    socket.socket.connect_ex = _connect_ex  # type: ignore[method-assign]
    socket.create_connection = _create_connection  # type: ignore[assignment]
    socket.getaddrinfo = _getaddrinfo  # type: ignore[assignment]
    atexit.register(_report_at_exit)


def assert_no_network_attempts() -> None:
    """Call at the end of a script to fail loudly (in addition to the atexit check)."""
    if ATTEMPTS:
        raise NetworkAccessError(f"{len(ATTEMPTS)} network attempt(s); first:\n{ATTEMPTS[0]}")


def md5sum(path: Path, chunk: int = 1 << 22) -> str:
    import hashlib

    h = hashlib.md5()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(chunk), b""):
            h.update(block)
    return h.hexdigest()


def require_file(path: Path, check_md5: bool = False) -> Path:
    if not path.is_file():
        raise FileNotFoundError(f"Missing {path}. Run download_weights.sh (online) / unpack_offline.sh (offline).")
    if check_md5 and path.name in EXPECTED_MD5:
        got = md5sum(path)
        if got != EXPECTED_MD5[path.name]:
            raise RuntimeError(f"MD5 mismatch for {path}: {got} != {EXPECTED_MD5[path.name]} (truncated download?)")
    return path
