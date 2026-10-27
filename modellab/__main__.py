import os
import sys

# Every ModelLab process imports offline_guard first (offline env vars, project caches, network guard). Only the
# online-PC download commands allow the network (downloads run through curl, which needs the proxy env vars that
# the guard would otherwise remove).
if sys.argv[1:3] == ["weights", "fetch"] or (sys.argv[1:2] == ["dataset"] and "--download" in sys.argv):
    os.environ["ALLOW_NETWORK"] = "1"

import offline_guard  # noqa: E402,F401

from modellab.cli import main  # noqa: E402

sys.exit(main())
