# ModelLab Hub + Agent: build plan

One web app (the **hub**, hosted on Railway) that pre-registered users log into, and a small background program
(the **agent**) on each user's Linux GPU PC that runs the work. The hub holds accounts, the queue, results, logs and
small artifacts. The PC holds the computation, the datasets, the weights and the checkpoints.

```
Browser ──login──▶ Hub on Railway: UI + API + Postgres (users, machines, queue, runs, results, logs, small files)
                        ▲  HTTPS, opened by the agent (no port forwarding, works behind NAT)
            ┌───────────┴────────────┐
   Agent on PC 1 (RTX 5090)    Agent on PC 2 (A4000)
   runs stages with the existing runner; datasets, weights and checkpoints stay on the PC
```

The local mode (`python app.py`, used on the offline PC) keeps working unchanged. Both modes share the engine
(recipes, stages, evaluation, dataset hashing) and the UI.

## Decisions

| topic | decision |
|---|---|
| Platform | Linux x86_64 only (glibc ≥ 2.28, as the PyTorch wheels need). Other platforms may come later. |
| Accounts | Pre-registered only. An admin creates users (Team page or CLI); there is no sign-up. The first admin comes from Railway env vars. |
| Machines | Each user pairs their own PCs and only runs on their own machines. Sharing machines (clusters by invitation) is phase 2; the data model keeps `owner_id` per machine so an access table can be added. |
| Datasets | Registered per machine: a name and a path on that PC. The content hash shows whether two machines hold identical data. |
| Checkpoints | Stay on the PC. The UI lists them (stage, file, size, path on the PC); they are never uploaded. |
| Results | Private to their owner in phase 1 (each user sees their own runs and leaderboard). Sharing is a small change if wanted. |
| Hardware page | Each machine shows its GPU, driver, CUDA, CPU, RAM, disk, shared memory, open-files limit, environment, weights and datasets. Anything that blocks a run is red, with the fix. |

## The agent on a PC

Installed by one command copied from the web app (Machines → Add machine), no sudo:

```
curl -fsSL https://<hub>/install.sh | bash -s -- --pair K7QX-29MD
```

The installer checks Linux/x86_64/glibc, the NVIDIA driver (≥ 570) and disk space; installs `uv` (pinned version,
SHA-256 checked); fetches the current release from the hub and checks its SHA-256; creates the Python environment
from the release's hash-pinned lock file (`uv` downloads Python 3.11.14 and the exact packages: torch 2.8.0+cu128,
rfdetr, LightlyTrain, …); vendors albumentations 1.4.24 for rfdetr as `setup_env.sh` does; exchanges the pairing code
for a machine token; installs a systemd **user** service; runs the self-check and reports to the hub.

Everything lives in one folder (default `~/.modellab`, the large parts can live on another disk):

```
~/.modellab/
  agent.json              hub URL, machine id, token (mode 600), release public key (pinned at install)
  bin/uv, bin/modellab-agent
  python/                 uv-managed Python 3.11.14
  envs/<lock-hash>/       Python environment (shared by releases with the same lock)
  releases/<version>/     ModelLab code; symlinks runs/ weights/ cache/ data/ into data/
  current -> releases/<version>
  data/  runs/ weights/ cache/ datasets.json      kept across updates and on uninstall
  logs/agent.log
~/.config/systemd/user/modellab-agent.service      (Restart=always, KillMode=process so runs survive agent restarts)
```

What the agent does:
- **Heartbeat** every 5 s: online, current run, live GPU (util, VRAM, temperature, power). The reply carries
  cancel requests, commands and update notices.
- **Runs**: claims the next queued run for its machine, re-validates the recipe with its own code, downloads missing
  weights (hash-checked), then hands the run to the existing worker/runner. Each stage still runs in its own process
  with the network guard on; only the agent process talks to the network.
- **Sync** every 2 s while a run is active: run and stage status, progress, log lines, eval rows, `env.json`,
  dataset hashes, small artifacts (PNG/JSON ≤ 10 MB) and the checkpoint list. Offsets are saved on disk, so an
  agent restart resumes without duplicates; a run started before a restart is adopted, as the worker does today.
- **Commands** from the UI (owner only, fixed list, no shell): self-check, add / import (COCO or YOLO via
  `make_splits.py`) / verify / remove dataset, fetch / verify weights, delete a run's local files, update now.
- **Updates** only between runs: download the release, verify the Ed25519 signature with the key pinned at install
  and the tarball SHA-256, build or reuse the environment, run the self-check, switch `current`, restart. On failure it
  stays on the old release and reports why.
- **Uninstall**: `~/.modellab/bin/modellab-agent uninstall` removes the service and the code and environments, and keeps
  `data/` unless `--purge`. Removing the machine in the web app revokes its token; the agent then stops and disables
  its service.

## The hub

FastAPI + Postgres (SQLite for development and tests) through SQLAlchemy Core, serving the same React UI.

Tables: `users`, `sessions`, `pairing_codes`, `machines` (owner, token hash, last seen, report, live telemetry,
versions), `commands`, `runs` (owner, machine, recipe, resolved stages, env, dataset hashes, metrics, queue
position, status), `stages` (status, progress, result, artifacts), `results` (one row per eval stage, as today),
`logs` (chunks per run and stage, capped per stage, oldest trimmed), `files` (small artifacts), `releases` (signed
manifests + tarballs).

User API: the existing `/api/...` endpoints (catalog, preview, runs, queue, logs, results, compare, files) now
scoped to the logged-in user and to a machine, plus `/api/auth/*`, `/api/machines/*` (pair, rename, remove,
commands) and `/api/users/*` (admins). Agent API: `/agent/v1/*` with a machine token (pair, heartbeat, report, claim,
run events, file upload, command results, releases). `GET /install.sh` serves the installer with the hub URL and
the release public key filled in.

## Security

- Passwords: scrypt (stdlib). Sessions: random 256-bit tokens, stored hashed, HttpOnly + Secure + SameSite=Lax cookie,
  30-day expiry, revoked on logout and when an admin disables the user. Login is throttled per user and per IP.
- Every state-changing `/api` request must carry an `X-ModelLab` header, which cross-site forms cannot send.
  Security headers (CSP, no framing, nosniff) on every response.
- Pairing codes: one-time, 10 minutes, bound to the user who created them. Machine tokens: random, stored hashed,
  revocable, and they only reach that machine's runs and commands.
- The hub sends agents recipes and a fixed list of commands, never code or shell. The agent validates recipes with
  its own code and only touches registered dataset paths and its own runs folder.
- Releases are signed in GitHub Actions with a key that never sits on Railway. Agents pin the public key at install
  and refuse anything unsigned, so even someone who took over the hub could not push code to existing PCs. A new
  install trusts the hub at install time (like any `curl | bash`).

## Build order

1. Plan (this file).
2. Hub backend: schema, auth, pairing, machines, runs, agent API, admin CLI. Tests for auth, isolation between users
   and machines, pairing, the agent API.
3. Agent: client, doctor, worker reuse, sync, commands, updates, service/uninstall. Tests for sync, commands and
   signature checks.
4. Releases + installer: hash-pinned lock (+ `cryptography` for signature checks), tarball builder, signing,
   publishing, `install.sh`, GitHub Actions workflow.
5. UI: login, Machines (list, detail, add-machine flow), machine picker in New experiment, per-machine queue,
   checkpoint list on run detail, account menu, Team page. Light/dark, 390 px.
6. Railway: Dockerfile, `railway.json`, env var reference, docs (`docs/HUB.md`).
7. End-to-end: hub + installer (with an existing Python, since this sandbox has no GPU) + agent running a real tiny
   CPU recipe; results, logs and artifacts reach the hub; cancel and re-queue; screenshots; existing tests still pass.

## Not in phase 1

Machine sharing / clusters, other operating systems, multi-GPU scheduling (one run at a time per machine, as today),
downloading checkpoints through the hub, email/password-reset flows (an admin resets passwords).
