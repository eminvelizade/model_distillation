"""ModelLab web app: `python app.py` -> http://127.0.0.1:8765

Starts a background queue worker if none is running (runs keep going if this app stops), then serves the API and
the prebuilt UI (modellab/web/dist; no Node needed at runtime, no CDN/remote assets).

    python app.py [--port 8765] [--host 127.0.0.1] [--no-worker]
"""

import offline_guard  # noqa: F401  (must be first)

import argparse


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--host", default="127.0.0.1")
    p.add_argument("--port", type=int, default=8765)
    p.add_argument("--no-worker", action="store_true", help="don't start a background worker")
    a = p.parse_args()

    import uvicorn

    from modellab import runs_dir, worker
    from modellab.server import app

    if not a.no_worker:
        pid = worker.start_background()
        print(f"[modellab] worker: {'started pid ' + str(pid) if pid else 'already running'} (log: {runs_dir() / 'worker.log'})")
    print(f"[modellab] UI on http://{a.host}:{a.port}")
    uvicorn.run(app, host=a.host, port=a.port, log_level="warning")


if __name__ == "__main__":
    main()
