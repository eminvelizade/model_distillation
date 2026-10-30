"""Agent releases: the engine code the hub hands to agents, and how agents check it before running it.

A release is a tarball of the engine (top-level *.py, modellab/ without the UI, recipes/, the lock files) plus a
manifest. The manifest is signed with Ed25519 (raw 32-byte keys, base64). The private key lives only where releases
are built (a GitHub Actions secret or an admin's own machine), never on the hub. Agents pin the public key at install
time and refuse a release whose signature or tarball hash doesn't match, so whoever controls the hub cannot push code
to machines that are already installed.

    python -m modellab.hub release keygen                      # once: prints a private and a public key
    python -m modellab.hub release publish --hub URL ...        # build + sign + upload (CI or by hand)
"""

from __future__ import annotations

import base64
import hashlib
import io
import json
import subprocess
import tarfile
import time
from pathlib import Path

from modellab import ROOT, __version__

PYTHON = "3.11.14"  # environment.yml pins the same interpreter
LOCK = "requirements-agent.lock"  # environment.yml's pins + cryptography, with hashes
VENDOR_LOCK = "requirements-vendor.lock"  # albumentations 1.4.24 for rfdetr (vendor/albumentations14), with hashes
_EPOCH = 1_700_000_000  # fixed mtime in the tarball, so the same tree gives the same bytes


class ReleaseError(RuntimeError):
    pass


def canonical(manifest: dict) -> bytes:
    """The exact bytes that are signed and verified."""
    return json.dumps(manifest, sort_keys=True, separators=(",", ":")).encode()


def _ed25519():
    from cryptography.hazmat.primitives.asymmetric import ed25519

    return ed25519


def keygen() -> tuple[str, str]:
    """-> (private key, public key), both base64 of the raw 32 bytes."""
    from cryptography.hazmat.primitives import serialization as s

    k = _ed25519().Ed25519PrivateKey.generate()
    priv = k.private_bytes(s.Encoding.Raw, s.PrivateFormat.Raw, s.NoEncryption())
    pub = k.public_key().public_bytes(s.Encoding.Raw, s.PublicFormat.Raw)
    return base64.b64encode(priv).decode(), base64.b64encode(pub).decode()


def public_key_of(private_b64: str) -> str:
    from cryptography.hazmat.primitives import serialization as s

    k = _ed25519().Ed25519PrivateKey.from_private_bytes(base64.b64decode(private_b64))
    return base64.b64encode(k.public_key().public_bytes(s.Encoding.Raw, s.PublicFormat.Raw)).decode()


def sign(data: bytes, private_b64: str) -> str:
    k = _ed25519().Ed25519PrivateKey.from_private_bytes(base64.b64decode(private_b64.strip()))
    return base64.b64encode(k.sign(data)).decode()


def verify(data: bytes, signature_b64: str, public_b64: str) -> bool:
    from cryptography.exceptions import InvalidSignature

    try:
        key = _ed25519().Ed25519PublicKey.from_public_bytes(base64.b64decode(public_b64.strip()))
        key.verify(base64.b64decode(signature_b64.strip()), data)
        return True
    except (InvalidSignature, ValueError, TypeError):
        return False


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def check(manifest_text: str, signature_b64: str, tarball: bytes, public_b64: str) -> dict:
    """Verify a downloaded release. Returns the manifest; raises ReleaseError if anything doesn't match."""
    try:
        manifest = json.loads(manifest_text)
    except ValueError as e:
        raise ReleaseError(f"manifest is not JSON: {e}") from e
    if canonical(manifest) != manifest_text.encode():
        raise ReleaseError("manifest is not in canonical form")
    if not verify(manifest_text.encode(), signature_b64, public_b64):
        raise ReleaseError("release signature does not match the public key pinned at install")
    if sha256(tarball) != manifest.get("tarball_sha256") or len(tarball) != manifest.get("tarball_size"):
        raise ReleaseError("release tarball does not match its signed manifest (hash or size)")
    return manifest


def lock_hash(root: Path = ROOT) -> str:
    """Identifies the Python environment: releases with the same locks share one environment on the PC."""
    data = b"".join((root / f).read_bytes() for f in (LOCK, VENDOR_LOCK)) + PYTHON.encode()
    return sha256(data)[:16]


def release_files(root: Path = ROOT) -> list[Path]:
    files = [p for p in root.glob("*.py")]
    files += [p for p in (root / "modellab").rglob("*") if p.is_file() and "web" not in p.relative_to(root / "modellab").parts[:1]
              and "__pycache__" not in p.parts and p.suffix in (".py", ".sh", ".service")]
    files += sorted((root / "recipes").glob("*.yaml"))
    files += [root / LOCK, root / VENDOR_LOCK, root / "bin" / "modellab"]
    missing = [str(p) for p in files if not p.is_file()]
    if missing:
        raise ReleaseError(f"release files missing: {missing}")
    return sorted(set(files))


def git_commit(root: Path = ROOT) -> tuple[str, bool]:
    def git(*a):
        return subprocess.run(["git", *a], cwd=root, capture_output=True, text=True).stdout.strip()

    return git("rev-parse", "HEAD"), bool(git("status", "--porcelain", "--untracked-files=no"))


def default_version(root: Path = ROOT) -> str:
    commit, dirty = git_commit(root)
    v = f"{__version__}+{commit[:7] or 'nogit'}"
    return v + (f".dirty{time.strftime('%Y%m%d%H%M%S')}" if dirty else "")


def build(root: Path = ROOT, version: str | None = None) -> tuple[dict, bytes]:
    """-> (manifest, tarball bytes). Deterministic for a given tree and version."""
    version = version or default_version(root)
    commit, dirty = git_commit(root)
    buf = io.BytesIO()
    files = release_files(root)

    def add(tar: tarfile.TarFile, name: str, data: bytes, mode: int = 0o644) -> None:
        ti = tarfile.TarInfo(name)
        ti.size, ti.mtime, ti.mode, ti.uid, ti.gid, ti.uname, ti.gname = len(data), _EPOCH, mode, 0, 0, "", ""
        tar.addfile(ti, io.BytesIO(data))

    info = {"version": version, "git_commit": commit, "dirty": dirty, "lock_hash": lock_hash(root), "python": PYTHON}
    with tarfile.open(fileobj=buf, mode="w:gz", compresslevel=9) as tar:
        for p in files:
            add(tar, str(p.relative_to(root)), p.read_bytes(), 0o755 if p.parent.name == "bin" else 0o644)
        add(tar, "RELEASE.json", json.dumps(info, indent=2).encode())
        add(tar, "GIT_COMMIT", (commit + "\n").encode())  # envinfo.git_info() reads it when there is no .git
    tarball = buf.getvalue()
    manifest = {**info, "created": int(time.time()), "tarball_sha256": sha256(tarball), "tarball_size": len(tarball),
                "files": len(files) + 2}
    return manifest, tarball


def extract(tarball: bytes, dest: Path) -> None:
    """Unpack a verified release; refuses absolute paths, '..' and links."""
    dest.mkdir(parents=True, exist_ok=True)
    with tarfile.open(fileobj=io.BytesIO(tarball), mode="r:gz") as tar:
        for m in tar.getmembers():
            p = Path(m.name)
            if p.is_absolute() or ".." in p.parts or not (m.isfile() or m.isdir()):
                raise ReleaseError(f"unsafe path in release: {m.name}")
        tar.extractall(dest, filter="data")
