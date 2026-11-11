"""Numbers in a sentence, found by code.

Decision models are weak at numbers, so they never read one: code finds every number with a little of its
surroundings, and the model only picks which candidate (if any) is the batch size, the epochs, and so on.
"""

from __future__ import annotations

import re

NUM = re.compile(r"""
    (?<![\w.])                       # not inside a word or another number
    (?P<num>\d+(?:[.,]\d+)?(?:e-?\d+)?)
    \s?(?P<unit>ms|px|epochs?|ep|h|hrs?|hours?|gb|x|k|%)?
    (?![\w]|\.\d)
""", re.I | re.X)
WORDS = {"one": "1", "two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "eight": "8", "ten": "10",
         "twelve": "12", "sixteen": "16", "twenty": "20", "thirty": "30", "fifty": "50", "hundred": "100"}
WORD = re.compile(r"\b(" + "|".join(WORDS) + r")\b", re.I)


def _around(text: str, start: int, end: int, words: int = 3) -> str:
    left = text[:start].split()[-words:]
    tail = text[end:]
    right = " ".join(tail.split()[:words])
    gap = " " if tail[:1].isspace() else ""
    return (("… " + " ".join(left) + " ") if left else "") + text[start:end] + (gap + right + " …" if right else "")


def numbers(sentence: str, limit: int = 8) -> dict[str, str]:
    """{value: where it stands in the sentence}, in order of appearance. The value is normalised ("1e-4" stays,
    "0,5" → "0.5", "2k" → "2000", "four" → "4"); a number that appears twice is listed once."""
    found: list[tuple[int, str, str]] = []
    for m in NUM.finditer(sentence):
        v = m.group("num").replace(",", ".").lower()
        if (m.group("unit") or "").lower() == "k":
            try:
                v = str(int(float(v) * 1000))
            except ValueError:
                pass
        found.append((m.start(), v, _around(sentence, m.start(), m.end())))
    for m in WORD.finditer(sentence):
        found.append((m.start(), WORDS[m.group(1).lower()], _around(sentence, m.start(), m.end())))
    out: dict[str, str] = {}
    for _, v, ctx in sorted(found):
        if v not in out and len(out) < limit:
            out[v] = ctx
    return out
