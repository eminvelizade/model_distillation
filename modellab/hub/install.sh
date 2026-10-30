#!/usr/bin/env bash
# ModelLab agent installer, served by the hub at /install.sh (the hub fills in its address and release key).
#
#   curl -fsSL https://<hub>/install.sh | bash -s -- --pair XXXX-XXXX
#
# Options:  --dir DIR       install location (default ~/.modellab)
#           --no-service    don't install the systemd user service (start it yourself)
#           --cpu-only      a machine without NVIDIA GPU (CPU testing only)
#           --python PATH   use an existing Python environment instead of building one (testing)
# Run it again without --pair to repair or update an existing install. No sudo needed.
set -euo pipefail

HUB_URL="__HUB_URL__"
RELEASE_PUBKEY="__RELEASE_PUBKEY__"
UV_VERSION="0.11.32"
UV_SHA256="aab924fd522efd06f1c5f3b93a243864fc453132c94b2dc49f1371b528a4b967"
PYTHON_VERSION="3.11.14"
MIN_DRIVER=570

say() { printf '\033[1;36m[modellab]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[modellab] %s\033[0m\n' "$*" >&2; }
die() { printf '\033[1;31m[modellab] %s\033[0m\n' "$*" >&2; exit 1; }

PAIR=""; DIR="${MODELLAB_HOME:-$HOME/.modellab}"; NO_SERVICE=0; CPU_ONLY=0; EXISTING_PY=""
while [ $# -gt 0 ]; do
  case "$1" in
    --pair) PAIR="${2:-}"; shift 2 ;;
    --dir) DIR="${2:-}"; shift 2 ;;
    --no-service) NO_SERVICE=1; shift ;;
    --cpu-only) CPU_ONLY=1; shift ;;
    --python) EXISTING_PY="${2:-}"; shift 2 ;;
    -h|--help) echo "usage: curl -fsSL $HUB_URL/install.sh | bash -s -- --pair CODE [--dir DIR] [--no-service] [--cpu-only]"; exit 0 ;;
    *) die "unknown option: $1 (see --help)" ;;
  esac
done
mkdir -p "$DIR"
DIR="$(cd "$DIR" && pwd)"

# ---------------------------------------------------------------- 1. this machine
say "checking this machine"
[ "$(uname -s)" = "Linux" ] || die "ModelLab agents run on Linux only."
[ "$(uname -m)" = "x86_64" ] || die "ModelLab agents need an x86_64 CPU (this is $(uname -m))."
for tool in curl tar sha256sum; do command -v "$tool" >/dev/null || die "'$tool' is required."; done
GLIBC="$(getconf GNU_LIBC_VERSION 2>/dev/null | awk '{print $2}')"
if [ -z "$GLIBC" ] || [ "$(printf '%s\n2.28\n' "$GLIBC" | sort -V | head -1)" != "2.28" ]; then
  die "glibc ${GLIBC:-unknown} is too old: PyTorch needs glibc 2.28+ (Ubuntu 20.04+, Debian 10+, RHEL 8+)."
fi
if [ "$CPU_ONLY" = 0 ]; then
  command -v nvidia-smi >/dev/null || die "No NVIDIA driver found (nvidia-smi). Install driver $MIN_DRIVER or newer (Ubuntu: sudo ubuntu-drivers install), reboot, then run this command again."
  DRIVER="$(nvidia-smi --query-gpu=driver_version --format=csv,noheader 2>/dev/null | head -1 | tr -d ' ')"
  [ -n "$DRIVER" ] || die "nvidia-smi found no GPU. Check the driver (nvidia-smi), then run this again."
  [ "${DRIVER%%.*}" -ge "$MIN_DRIVER" ] || die "NVIDIA driver $DRIVER is older than $MIN_DRIVER, which CUDA 12.8 and the RTX 50 series need. Update the driver, reboot, run this again."
  nvidia-smi --query-gpu=name,memory.total --format=csv,noheader | while read -r line; do say "GPU: $line (driver $DRIVER)"; done
else
  warn "--cpu-only: no GPU checks; this machine can only run CPU tests"
fi
FREE_GB=$(( $(df -Pk "$DIR" | awk 'NR==2 {print $4}') / 1048576 ))
NEED_GB=15; [ -n "$EXISTING_PY" ] && NEED_GB=1
[ "$FREE_GB" -ge "$NEED_GB" ] || die "only ${FREE_GB} GB free in $DIR; the environment needs about $NEED_GB GB (use --dir on a bigger disk)."
[ "$FREE_GB" -ge 50 ] || warn "${FREE_GB} GB free in $DIR: checkpoints and weights need room, 50 GB+ is comfortable."
[ -n "$RELEASE_PUBKEY" ] || die "This hub has no release signing key yet (MODELLAB_RELEASE_PUBKEY). Ask the hub admin to set it and publish a release."
if [ "$(id -u)" = 0 ]; then warn "installing as root: a normal user account is recommended"; fi

mkdir -p "$DIR/bin" "$DIR/logs" "$DIR/data"
chmod 700 "$DIR"
export UV_PYTHON_INSTALL_DIR="$DIR/python" UV_CACHE_DIR="$DIR/cache/uv"

# ---------------------------------------------------------------- 2. uv + Python
UV="$DIR/bin/uv"
if ! "$UV" --version 2>/dev/null | grep -q " $UV_VERSION"; then
  say "installing uv $UV_VERSION"
  tmp="$(mktemp -d)"
  curl -fsSL -o "$tmp/uv.tar.gz" "https://github.com/astral-sh/uv/releases/download/$UV_VERSION/uv-x86_64-unknown-linux-gnu.tar.gz"
  echo "$UV_SHA256  $tmp/uv.tar.gz" | sha256sum -c --quiet - || die "uv download does not match its checksum"
  tar -xzf "$tmp/uv.tar.gz" -C "$tmp"
  install -m 755 "$tmp"/uv-x86_64-unknown-linux-gnu/uv "$UV"
  rm -rf "$tmp"
fi
if [ -n "$EXISTING_PY" ]; then
  PY="$EXISTING_PY"
  "$PY" -c 'import sys; assert sys.version_info[:2] >= (3, 11)' || die "--python must be Python 3.11+"
else
  say "installing Python $PYTHON_VERSION"
  "$UV" python install --quiet "$PYTHON_VERSION"
  PY="$("$UV" python find "$PYTHON_VERSION")"
fi

# ---------------------------------------------------------------- 3. pair with the hub
CFG="$DIR/agent.json"
if [ -n "$PAIR" ]; then
  say "pairing with $HUB_URL"
  HUB_URL="$HUB_URL" PAIR="$PAIR" PUBKEY="$RELEASE_PUBKEY" CPU_ONLY="$CPU_ONLY" CFG="$CFG" "$PY" - <<'PYEOF'
import json, os, platform, time, urllib.error, urllib.request
hub = os.environ["HUB_URL"]
body = json.dumps({"code": os.environ["PAIR"], "hostname": platform.node(), "agent_version": "installer"}).encode()
req = urllib.request.Request(hub + "/agent/v1/pair", data=body, method="POST", headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req, timeout=60) as r:
        res = json.load(r)
except urllib.error.HTTPError as e:
    detail = e.read().decode(errors="replace")
    try:
        detail = json.loads(detail).get("detail", detail)
    except ValueError:
        pass
    raise SystemExit(f"[modellab] pairing failed: {detail}")
except urllib.error.URLError as e:
    raise SystemExit(f"[modellab] cannot reach {hub}: {e.reason}")
cfg = {"hub_url": hub, "machine_id": res["machine_id"], "name": res["name"], "token": res["token"],
       "release_pubkey": os.environ["PUBKEY"], "cpu_only": os.environ["CPU_ONLY"] == "1", "paired": time.time()}
fd = os.open(os.environ["CFG"], os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
with os.fdopen(fd, "w") as f:
    json.dump(cfg, f, indent=2)
print(f"[modellab] paired as {res['name']!r}")
PYEOF
elif [ ! -f "$CFG" ]; then
  die "Not paired yet: copy the install command from the hub's Machines page (it includes --pair CODE)."
else
  say "already paired ($(grep -o '"name": "[^"]*"' "$CFG" | cut -d'"' -f4)); repairing / updating the install"
fi

# ---------------------------------------------------------------- 4. download the current release
STAGE="$(mktemp -d "$DIR/.install.XXXXXX")"
trap 'rm -rf "$STAGE"' EXIT
say "downloading the current ModelLab release"
CFG="$CFG" STAGE="$STAGE" "$PY" - <<'PYEOF'
import hashlib, json, os, tarfile, urllib.error, urllib.parse, urllib.request
from pathlib import Path
cfg = json.load(open(os.environ["CFG"]))
stage = Path(os.environ["STAGE"])
def get(path, timeout=900):
    req = urllib.request.Request(cfg["hub_url"] + path, headers={"Authorization": "Bearer " + cfg["token"]})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        raise SystemExit(f"[modellab] {path}: {e.code} {e.read().decode(errors='replace')[:300]}")
meta = json.loads(get("/agent/v1/releases/current"))
m = json.loads(meta["manifest"])
tar = get("/agent/v1/releases/" + urllib.parse.quote(m["version"], safe="") + "/tarball")
if hashlib.sha256(tar).hexdigest() != m["tarball_sha256"] or len(tar) != m["tarball_size"]:
    raise SystemExit("[modellab] the release download does not match its manifest")
(stage / "manifest.json").write_text(meta["manifest"])
(stage / "signature.txt").write_text(meta["signature"])
(stage / "release.tar.gz").write_bytes(tar)
code = stage / "code"
with tarfile.open(stage / "release.tar.gz") as t:
    for x in t.getmembers():
        p = Path(x.name)
        if p.is_absolute() or ".." in p.parts or not (x.isfile() or x.isdir()):
            raise SystemExit(f"[modellab] unsafe path in release: {x.name}")
    t.extractall(code, filter="data")
print(f"[modellab] release {m['version']} ({len(tar) / 2**20:.1f} MB)")
PYEOF

# ---------------------------------------------------------------- 5. environment, signature check, service
ARGS=(--staged "$STAGE/code" --manifest "$STAGE/manifest.json" --signature "$STAGE/signature.txt" --tarball "$STAGE/release.tar.gz")
[ -n "$EXISTING_PY" ] && ARGS+=(--python "$EXISTING_PY")
[ "$NO_SERVICE" = 1 ] && ARGS+=(--no-service)
MODELLAB_HOME="$DIR" PYTHONPATH="$STAGE/code" "$PY" -m modellab.agent.setup "${ARGS[@]}"

say "done. This machine now shows up on $HUB_URL (Machines)."
say "logs: $DIR/logs/agent.log    status: $DIR/bin/modellab-agent status    remove: $DIR/bin/modellab-agent uninstall"
