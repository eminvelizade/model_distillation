"""Folder listings from a machine, for the dataset picker: the web app asks, the machine's agent answers.

The agent keeps one long-poll open (POST /agent/v1/fs/poll). A listing request wakes it; it lists the folder on the PC
and hands the answer back with its next poll, so a click in the picker costs one round trip, not a heartbeat.
Kept in memory: the hub runs as one process (like the login throttles), and a lost request is simply asked again.
"""

from __future__ import annotations

import asyncio
import secrets
import time

from fastapi import HTTPException

POLL_HOLD_S = 25.0  # how long an agent's poll waits for a request before returning empty
ANSWER_WAIT_S = 12.0  # how long the web app waits for the agent's answer
MAX_PENDING = 8  # per machine
WANT = ("dir", "json")


def check_request(path: object, want: object) -> dict:
    if want not in WANT:
        raise HTTPException(422, f"want must be one of {', '.join(WANT)}")
    if path in (None, ""):
        return {"path": None, "want": want}
    if not isinstance(path, str) or len(path) > 1024 or "\x00" in path or not path.startswith(("/", "~")):
        raise HTTPException(422, "path must be absolute (starts with / or ~)")
    return {"path": path, "want": want}


class Broker:
    def __init__(self) -> None:
        self.pending: dict[str, list[dict]] = {}  # machine id -> requests not yet handed to its agent
        self.wake: dict[str, asyncio.Event] = {}  # machine id -> set when a request arrives
        self.answers: dict[str, asyncio.Future] = {}  # request id -> the web app request waiting for it
        self.last_poll: dict[str, float] = {}  # machine id -> when its agent last polled

    def listening(self, mid: str) -> bool:
        """The machine's agent polls for listings (it is online and new enough to have the folder browser)."""
        return time.time() - self.last_poll.get(mid, 0.0) < POLL_HOLD_S + 20

    def _event(self, mid: str) -> asyncio.Event:
        return self.wake.setdefault(mid, asyncio.Event())

    async def ask(self, mid: str, req: dict, timeout: float | None = None) -> dict:
        """-> the listing; raises HTTPException with the agent's error, or 504 if it does not answer in time."""
        queue = self.pending.setdefault(mid, [])
        if len(queue) >= MAX_PENDING:
            raise HTTPException(429, "too many folder requests waiting for this machine")
        rid = secrets.token_hex(8)
        fut = asyncio.get_running_loop().create_future()
        self.answers[rid] = fut
        queue.append({"id": rid, **req})
        self._event(mid).set()
        try:
            ans = await asyncio.wait_for(fut, ANSWER_WAIT_S if timeout is None else timeout)
        except asyncio.TimeoutError:
            raise HTTPException(504, "the machine did not answer: is it online? Type the path instead") from None
        finally:
            self.answers.pop(rid, None)
            self.pending[mid] = [r for r in self.pending.get(mid, []) if r["id"] != rid]
        if ans.get("error"):
            raise HTTPException(422, str(ans["error"])[:500])
        if not isinstance(ans.get("result"), dict):
            raise HTTPException(502, "the machine sent an empty answer")
        return ans["result"]

    async def poll(self, mid: str, answers: list, hold: float | None = None, gone: asyncio.Event | None = None) -> list[dict]:
        """Agent side: deliver answers, then wait (up to `hold` s) for requests and return them. `gone` is set when the
        agent hangs up: the wait ends at once and its requests stay queued for its next poll."""
        self.last_poll[mid] = time.time()
        for a in answers:
            fut = self.answers.get(a.get("id")) if isinstance(a, dict) and isinstance(a.get("id"), str) else None
            if fut is not None and not fut.done():
                fut.set_result(a)
        ev = self._event(mid)
        if not self.pending.get(mid):
            ev.clear()
            waits = [asyncio.ensure_future(e.wait()) for e in (ev, gone) if e is not None]
            try:
                await asyncio.wait(waits, timeout=POLL_HOLD_S if hold is None else hold, return_when=asyncio.FIRST_COMPLETED)
            finally:
                for w in waits:
                    w.cancel()
        if gone is not None and gone.is_set():
            return []
        reqs, self.pending[mid] = self.pending.get(mid, []), []
        self.last_poll[mid] = time.time()
        return reqs
