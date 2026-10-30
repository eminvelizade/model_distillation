"""Releases on the PC: verify, unpack, build (or reuse) the Python environment, link the data folders, switch.

Used by the installer's last step (modellab.agent.setup) and by self-updates between runs. Nothing is executed from a
release before its manifest signature (key pinned in agent.json at install) and tarball hash check out. Environments
are keyed by the hash of the lock files, so a code-only update reuses the existing environment.
"""

from __future__ import annotations

import os
import re
import shutil
import subprocess
from pathlib import Path

from modellab import release
from modellab.agent import data_dir, home

PYTORCH_INDEX = "https://download.pytorch.org/whl/cu128"
VERSION_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9.+_-]{0,127}$")
LINKS = {"weights": "weights", "cache": "cache", "data": "datasets", "runs": "runs"}


class UpdateError(RuntimeError):
    pass


def uv() -> str:
    p = home() / "bin" / "uv"
    found = str(p) if p.is_file() else shutil.which("uv")
    if not found:
        raise UpdateError(f"uv not found ({p}); re-run the install command")
    return found


def _run(cmd: list[str], log, **kw) -> None:
    log("$ " + " ".join(cmd))
    env = dict(os.environ, UV_PYTHON_INSTALL_DIR=str(home() / "python"), UV_CACHE_DIR=str(home() / "cache" / "uv"))
    env.pop("ALLOW_NETWORK", None)
    p = subprocess.run(cmd, env=env, capture_output=True, text=True, **kw)
    if p.returncode:
        tail = "\n".join((p.stderr or p.stdout).strip().splitlines()[-25:])
        raise UpdateError(f"{Path(cmd[0]).name} {cmd[1] if len(cmd) > 1 else ''} failed (exit {p.returncode}):\n{tail}")


def env_python(env: Path) -> Path:
    return env / "bin" / "python"


def ensure_env(rel: Path, lock: str, log=print, base_python: str | None = None) -> Path:
    """Python environment for a release's lock files: envs/<lock> (built once, reused by later releases).
    `base_python`: use an existing environment instead of building one (development / CPU testing); only the
    vendored albumentations is installed next to it."""
    env = home() / "envs" / lock
    if (env / ".ready").is_file():
        return env
    if env.exists():
        shutil.rmtree(env)  # an earlier attempt did not finish
    env.mkdir(parents=True)
    if base_python:  # a wrapper, not a symlink: a symlink would lose that venv's site-packages
        base_python = os.path.abspath(base_python)
        (env / "bin").mkdir()
        w = env / "bin" / "python"
        w.write_text(f'#!/bin/sh\nexec "{base_python}" "$@"\n')
        w.chmod(0o755)
        (env / "EXTERNAL").write_text(base_python + "\n")
    else:
        log(f"building the Python environment {lock} (Python {release.PYTHON}, PyTorch and CUDA libraries: a few GB) ...")
        _run([uv(), "venv", "--python", release.PYTHON, "--seed", "--allow-existing", str(env)], log)
        _run([uv(), "pip", "install", "--python", str(env_python(env)), "--require-hashes", "--no-deps",
              "--index-strategy", "unsafe-best-match", "--extra-index-url", PYTORCH_INDEX, "-r", str(rel / release.LOCK)], log)
    # rfdetr needs albumentations 1.4.x next to the 1.3.1 LightlyTrain needs (see modellab/compat.py)
    _run([uv(), "pip", "install", "--python", str(env_python(env)), "--require-hashes", "--no-deps",
          "--target", str(env / "vendor" / "albumentations14"), "-r", str(rel / release.VENDOR_LOCK)], log)
    (env / ".ready").write_text(release.PYTHON + "\n")
    return env


def link_release(rel: Path, env: Path) -> None:
    """weights/ cache/ data/ runs/ -> data/... (shared by all releases), vendor/ -> the environment's, ENV file."""
    d = data_dir()
    for name, target in LINKS.items():
        (d / target).mkdir(parents=True, exist_ok=True)
        p = rel / name
        if p.is_symlink() or p.is_file():
            p.unlink()
        elif p.is_dir():
            shutil.rmtree(p)
        p.symlink_to(d / target)
    v = rel / "vendor"
    if v.is_symlink():
        v.unlink()
    v.symlink_to(env / "vendor")
    (rel / "ENV").write_text(str(env) + "\n")


def selftest(rel: Path, env: Path, log=print) -> str:
    """The new release imports and builds rfdetr's transforms with its environment."""
    code = ("import offline_guard, modellab.agent, modellab.release; from modellab import preflight; "
            "print(preflight.ensure_rfdetr_transforms())")
    e = dict(os.environ, PYTHONPATH=str(rel))
    e.pop("ALLOW_NETWORK", None)
    p = subprocess.run([str(env_python(env)), "-c", code], cwd=rel, env=e, capture_output=True, text=True, timeout=600)
    if p.returncode:
        raise UpdateError("self-test of the new release failed:\n" + "\n".join(p.stderr.strip().splitlines()[-15:]))
    log(f"self-test ok (albumentations for rfdetr {p.stdout.strip().splitlines()[-1]})")
    return p.stdout.strip()


def unpack(version: str, manifest_text: str, signature: str, tarball: bytes, pubkey: str) -> tuple[Path, dict]:
    if not VERSION_RE.match(version):
        raise UpdateError(f"bad release version {version!r}")
    try:
        manifest = release.check(manifest_text, signature, tarball, pubkey)
    except release.ReleaseError as e:
        raise UpdateError(str(e)) from e
    if manifest["version"] != version:
        raise UpdateError("release version does not match its manifest")
    rel = home() / "releases" / version
    if not (rel / ".verified").is_file():
        tmp = rel.with_name(rel.name + ".tmp")
        shutil.rmtree(tmp, ignore_errors=True)
        release.extract(tarball, tmp)
        (tmp / ".verified").write_text(manifest_text)
        shutil.rmtree(rel, ignore_errors=True)
        tmp.rename(rel)
    return rel, manifest


def current() -> Path | None:
    p = home() / "current"
    return p.resolve() if p.is_symlink() else None


def switch(rel: Path) -> None:
    link = home() / "current"
    tmp = home() / "current.new"
    if tmp.is_symlink():
        tmp.unlink()
    tmp.symlink_to(rel)
    os.replace(tmp, link)


def prune(keep: int = 2, log=print) -> None:
    """Keep the current and the previous release (rollback) and the environments they use."""
    rels = sorted((p for p in (home() / "releases").glob("*") if p.is_dir() and not p.name.endswith(".tmp")),
                  key=lambda p: p.stat().st_mtime, reverse=True)
    cur = current()
    keep_set = {cur} if cur else set()
    for p in rels:
        if len(keep_set) >= keep:
            break
        keep_set.add(p)
    for p in rels:
        if p not in keep_set:
            log(f"removing old release {p.name}")
            shutil.rmtree(p, ignore_errors=True)
    used = {(p / "ENV").read_text().strip() for p in keep_set if (p / "ENV").is_file()}
    for env in (home() / "envs").glob("*"):
        if env.is_dir() and str(env) not in used:
            log(f"removing unused environment {env.name}")
            shutil.rmtree(env, ignore_errors=True)


def install(client, cfg: dict, version: str, log=print) -> Path:
    """Download, verify and prepare `version`; switch to it. The caller restarts the agent afterwards."""
    meta = client.get(f"/agent/v1/releases/{version}")
    tarball = client.get_bytes(f"/agent/v1/releases/{version}/tarball")
    rel, manifest = unpack(version, meta["manifest"], meta["signature"], tarball, cfg["release_pubkey"])
    base = None
    cur = current()
    if cur and (cur / "ENV").is_file():  # an environment that points at an existing Python stays that way (dev installs)
        ext = Path((cur / "ENV").read_text().strip()) / "EXTERNAL"
        base = ext.read_text().strip() if ext.is_file() else None
    env = ensure_env(rel, manifest["lock_hash"], log, base_python=base)
    link_release(rel, env)
    selftest(rel, env, log)
    switch(rel)
    prune(log=log)
    log(f"switched to release {version}")
    return rel
