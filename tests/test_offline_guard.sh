#!/usr/bin/env bash
# Positive controls: the guard must FAIL a process that touches the network, even when the
# library swallows the exception. Run from the repo root: bash tests/test_offline_guard.sh
set -u
cd "$(dirname "$0")/.."
PY=${PYTHON:-python}
fail=0

expect_fail() {  # name, expected exit code, python code
  out=$("$PY" -c "$3" 2>&1); rc=$?
  if [ "$rc" -eq "$2" ]; then echo "PASS $1 (exit $rc)"; else echo "FAIL $1: exit $rc, wanted $2"; echo "$out" | tail -5; fail=1; fi
}

expect_fail "direct urlopen is blocked" 3 \
  "import offline_guard, urllib.request; urllib.request.urlopen('https://pypi.org', timeout=5)"
expect_fail "swallowed exception still fails the process" 3 \
  "import offline_guard, urllib.request
try: urllib.request.urlopen('https://huggingface.co', timeout=5)
except Exception: pass"
expect_fail "requests (used by rfdetr) is blocked" 3 \
  "import offline_guard, requests; requests.get('https://storage.googleapis.com', timeout=5)"
expect_fail "HF hub download in offline mode does not reach the network" 1 \
  "import offline_guard; from huggingface_hub import hf_hub_download; hf_hub_download('facebook/dinov2-small', 'config.json')"
expect_fail "loopback is allowed (SKIP if the namespace has no loopback, e.g. unshare -n)" 0 \
  "import offline_guard, socket, errno
s=socket.socket()
try: s.bind(('127.0.0.1',0)); s.listen(); socket.create_connection(s.getsockname()).close()
except OSError as e:
    if e.errno not in (errno.ENETUNREACH, errno.EADDRNOTAVAIL): raise
    print('SKIP: no loopback interface here')"

[ "$fail" -eq 0 ] && echo "offline_guard: all checks passed" || { echo "offline_guard: FAILURES"; exit 1; }
