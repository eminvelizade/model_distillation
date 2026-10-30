# ModelLab Hub

One web app, hosted on Railway, that pre-registered users sign into. Each user's experiments run on their own Linux GPU
PCs, through a small background program there, the **agent**. The hub holds accounts, the queue, results, logs and
small artifacts. The PCs hold the computation, datasets, weights and checkpoints.

```
Browser ──sign in──▶ Hub on Railway: UI + API + PostgreSQL (users, machines, queue, runs, results, logs, small files)
                          ▲   HTTPS, opened by the agent (no port forwarding, works behind NAT)
              ┌───────────┴────────────┐
     Agent on PC 1 (RTX 5090)    Agent on PC 2 (RTX A4000)
     runs the stages with the same engine as `python app.py`; data, weights and checkpoints stay on the PC
```

The local app (`python app.py`, the offline PC) is unchanged: same engine, same UI, no sign-in.
Design and decisions: [HUB_PLAN.md](HUB_PLAN.md).

| | where | what |
|---|---|---|
| Hub | Railway (`Dockerfile.hub`, `railway.json`) | `modellab/hub/`: FastAPI + PostgreSQL; serves the UI, `/install.sh`, the agent API |
| Agent | each GPU PC, `~/.modellab` | `modellab/agent/`: systemd user service; runs jobs with the existing worker/runner |
| Releases | built and signed in GitHub Actions | `modellab/release.py`, `.github/workflows/agent-release.yml` |

## 1. Deploy the hub (admin, once)

1. **Signing key**, on your own computer (anywhere this repo and `cryptography` are installed):
   ```bash
   python -m modellab.hub release keygen
   ```
   It prints a private key and a public key. Keep the private key in a password manager. It goes into GitHub only, never Railway.
2. **Upload token**: any long random string, e.g. `python -c "import secrets; print(secrets.token_urlsafe(32))"`.
3. **Railway**: New Project → Deploy from GitHub repo → this repository. Railway reads `railway.json` and builds
   `Dockerfile.hub` (Python 3.11, the hub's hash-pinned dependencies from `requirements-hub.lock`, no PyTorch).
4. In the project: **+ New → Database → PostgreSQL**.
5. Service **Variables** of the hub:

   | variable | value |
   |---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (the name of your Postgres service) |
   | `MODELLAB_ADMIN_USER` | your username, e.g. `emin` |
   | `MODELLAB_ADMIN_PASSWORD` | a strong password: creates the first admin when the hub has no users yet; ignored afterwards (remove it then) |
   | `MODELLAB_RELEASE_PUBKEY` | the public key from step 1 |
   | `MODELLAB_RELEASE_UPLOAD_TOKEN` | the token from step 2 |
   | `MODELLAB_PUBLIC_URL` | optional: `https://your.custom.domain` (default `https://$RAILWAY_PUBLIC_DOMAIN`) |

6. **Settings → Networking → Generate Domain**, then deploy. `https://<domain>/healthz` answers `{"ok": true}`.
   Keep one replica: login throttling is kept in memory.

## 2. Publish an agent release (admin; again for every update)

Machines install the hub's *current release*, and idle agents update to a newer one by themselves.

GitHub repository → Settings → Secrets and variables → Actions:

| kind | name | value |
|---|---|---|
| secret | `MODELLAB_RELEASE_SIGNING_KEY` | the private key from step 1 |
| secret | `MODELLAB_RELEASE_UPLOAD_TOKEN` | the upload token |
| variable | `MODELLAB_HUB_URL` | `https://<domain>` |

Then Actions → **agent release** → Run workflow, or push a tag `agent-v*`. GitHub only offers "Run workflow" for
workflows on the default branch, so merge this branch first. To publish from your own computer instead:
```bash
MODELLAB_RELEASE_SIGNING_KEY=<private key> python -m modellab.hub release publish --hub https://<domain> --token <upload token>
```
The hub refuses a release whose signature doesn't match `MODELLAB_RELEASE_PUBKEY`. The newest one becomes current.
**Team → Agent releases → Make current** rolls back.

## 3. Users (admin)

**Team → Add user**: the hub shows a temporary password once. The person changes it at their first sign-in.
**Reset password** and **Disable** (signs them out everywhere) are on the same page. There is no sign-up. From a shell with
`DATABASE_URL` set: `python -m modellab.hub users add NAME [--admin]`, `users passwd NAME`, `users disable NAME`, `users list`.

## 4. Add a machine (each user)

Requirements on the PC:
- Linux x86_64 with glibc 2.28 or newer.
- NVIDIA driver 570 or newer. CUDA 12.8 needs it, and so does the RTX 50 series.
- About 15 GB for the Python environment, plus room for weights and checkpoints.
- Outbound HTTPS to the hub, github.com (uv), pypi.org and download.pytorch.org (packages), and the weight hosts
  (`lightly-train-checkpoints.s3…amazonaws.com`, `storage.googleapis.com/rfdetr`, `dl.fbaipublicfiles.com`).
- No sudo.

**Machines → Add machine**, give it a name, and paste the command shown into a terminal on the PC as your normal user:
```bash
curl -fsSL https://<domain>/install.sh | bash -s -- --pair ABCD-2345
```
The code works once, for 10 minutes. The installer:
1. Checks the OS, glibc, driver and disk.
2. Installs uv (pinned version and checksum) and Python 3.11.14.
3. Pairs with the hub.
4. Downloads the current release and checks its SHA-256.
5. Builds the environment from `requirements-agent.lock`, every package hash-checked (a few GB the first time).
6. Verifies the release signature, then installs and starts the `modellab-agent` systemd user service.
7. Runs the self-check.

The machine page fills in as the agent reports.

```
~/.modellab/                    (--dir elsewhere for a bigger disk)
  agent.json                    hub URL, machine id, token (mode 600), release public key pinned at install
  bin/uv, bin/modellab-agent    launcher used by the service
  python/  envs/<lock-hash>/    Python and the environment (shared by releases with the same lock)
  releases/<version>/  current  engine code; weights/ cache/ data/ runs/ link into data/
  data/                         runs/ weights/ cache/ datasets/ datasets.json: kept on update and uninstall
  logs/agent.log
```

On the PC:
- `systemctl --user status modellab-agent` and `journalctl --user -u modellab-agent -f` show the service and its log.
  The log is also in `~/.modellab/logs/agent.log`.
- `~/.modellab/bin/modellab-agent status | doctor | uninstall [--purge]` checks the pairing, runs the self-check, or
  removes the agent. `uninstall` keeps `data/` unless you pass `--purge`.
- The service starts with the PC. If the installer says lingering couldn't be enabled, it stops when you log out;
  `sudo loginctl enable-linger <user>` fixes that.
- `--no-service` skips the service: start it yourself with `~/.modellab/bin/modellab-agent run`.
- Re-run the install command without `--pair` to repair or update an install.
- Behind an HTTP proxy: services don't see your shell's variables. Run `systemctl --user edit modellab-agent`, add
  `[Service]` and `Environment=HTTPS_PROXY=http://proxy:3128`, then `systemctl --user restart modellab-agent`.

**Remove** on the machine page revokes its token. The agent cancels its work and turns its service off.
Runs, checkpoints and weights stay on the PC.

## 5. Datasets

On the machine page, **Add dataset** offers three ways in:
- A folder that is already in Roboflow layout (`train/ valid/ test/`, each with `_annotations.coco.json`).
- A COCO json plus an images folder.
- A YOLO folder.

The last two are split by `make_splits.py` into `~/.modellab/data/datasets/<name>`. Paths are on that PC, and images
are not copied. The agent hashes every image and annotation. If a dataset has the same name and the same hash on two
machines, it holds identical data, and results from those machines are comparable. **Re-hash** after you change files.

## 6. Experiments

Pick a machine in the sidebar. New experiment, Queue and the GPU widget follow it, and **Runs on** sits next to the run
buttons. The recipe is checked against that machine's datasets. Weights it doesn't have yet are downloaded and
hash-checked before the run starts. Each machine runs one job at a time, as before.

The Leaderboard and Compare show results from all your machines. Accuracy is comparable across GPUs; latency is
flagged when it was measured on different devices.

A run page lists checkpoints with their path on the PC; they are never uploaded. Deleting a run can also delete its
files on the machine.

## 7. Updates

Each heartbeat tells the agent the hub's current release. When the agent is idle (no run, no command), it:
1. Downloads the release.
2. Verifies the signature with the key pinned at install, and the tarball hash.
3. Builds a new Python environment only if the lock files changed.
4. Runs a self-test, switches `current` and restarts.

Runs already in progress are never interrupted. A failed update leaves the machine on its release, shows on the
machine page, and is retried within the hour.

## Security

- **Accounts.** Pre-registered only. Passwords are hashed with scrypt.
- **Sessions.** Random tokens stored hashed, in HttpOnly, Secure, SameSite=Lax cookies. They last 30 days and are
  revoked on sign-out, password change and disable.
- **Login throttling.** 5 failures per user or 30 per IP in 15 minutes.
- **Browser protections.** Every state-changing `/api` call needs an `X-ModelLab` header, which cross-site forms
  cannot send. Responses carry a CSP (scripts only from the bundle and the hash of the inline theme script),
  `frame-ancestors 'none'`, nosniff and HSTS.
- **Isolation.** Users only see and command their own machines and runs. A machine token only reaches that machine's
  runs and commands. Pairing codes work once, for 10 minutes. Machine tokens are stored hashed and are revocable.
- **What the hub can make a PC do.** Run recipes, which the agent re-validates with its own code, and a fixed list of
  commands with re-checked arguments. Never shell or code.
- **Updates.** Releases are signed in CI with a key that is not on Railway. Agents refuse anything else, so even
  someone who took over the hub could not push code to an installed PC. A *new* install trusts the hub at install
  time, as any `curl | bash` does.
- **Network on the PC.** Training processes run with `offline_guard`'s network block. Only the agent process talks
  to the network.
- **Rotating keys.** The upload token can be replaced at any time: Railway variable plus GitHub secret. A new signing
  key means re-running the install command, with a new `--pair` code, on each machine, because agents pin the key.

## Development

```bash
# hub on SQLite (http only)
MODELLAB_INSECURE_COOKIES=1 MODELLAB_ADMIN_USER=me MODELLAB_ADMIN_PASSWORD=dev-password-1 \
  MODELLAB_RELEASE_PUBKEY=<pub> MODELLAB_RELEASE_UPLOAD_TOKEN=dev python -m modellab.hub serve --port 8790
# an agent from this checkout (no release, never self-updates); --cpu-only on a machine without NVIDIA GPU
python -m modellab.agent pair --hub http://127.0.0.1:8790 --code ABCD-2345 --pubkey <pub>
python -m modellab.agent run
# tests
python -m pytest tests/hub -q                               # hub + agent (no torch needed; SQLite)
MODELLAB_TEST_POSTGRES=1 python -m pytest tests/hub -q      # the same on PostgreSQL (pip install pgserver)
python -m pytest tests/hub/test_e2e.py -q                   # real hub + agent + a tiny CPU run (full environment)
./lock_agent_env.sh                                         # after changing environment.yml pins
```
UI: `cd modellab/web && npm run dev` proxies `/api` to port 8765 (edit `vite.config.ts` to point at a hub); run
`npm run build` and commit `dist/`.

Screenshots: [docs/screenshots/](screenshots/) `hub_*`. The RTX 5090 / A4000 machines in them are simulated through
the agent API, because the sandbox where this was built has no GPU. "cpu box" and "installed box" are real agents.

## What was tested, and what wasn't

Tested in a Linux sandbox without GPU:
- The hub's test suite on SQLite and PostgreSQL 16.
- The hub image layout: `requirements-hub.lock` installed into a fresh Python 3.11 venv with hashes enforced, then
  25 HTTP checks against PostgreSQL.
- The real installer (`curl …/install.sh | bash`), with `--python` pointing at an existing CPU environment.
- Pairing, dataset commands, a weight download before a run, real CPU fine-tune + eval runs, live logs, cancel and
  re-queue.
- 106 s of hub downtime in the middle of a run: the run finished locally and synced afterwards.
- A self-update to a new signed release.
- Refusal of a release signed with another key, placed on the hub as if it had been compromised.
- The UI in light, dark and 390 px, and the local app's UI unchanged.

Not tested here; check these on the real machines:
- **Building the CUDA environment on a GPU PC.** The full lock resolved with `uv pip install --dry-run` (134
  packages, `torch==2.8.0+cu128`), but nothing downloaded or ran it on a GPU.
- **The systemd user service.** The sandbox has no user systemd. The restart behaviour (exit 75 restarts into a new
  release, 78 stays stopped) ran under a stand-in loop.
- **The Railway build and deploy itself.** There is no Docker here; the image was simulated as described above.
- **The GitHub Actions release workflow.** It needs your secrets.
- **Several users and agents at once over hours**, and Railway's proxy with SSE log streaming.
