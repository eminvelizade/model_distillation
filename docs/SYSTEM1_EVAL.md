# System 1 evaluation: which decision model, 11 November 2026

> Two side-by-side runs of every decision model on OpenRouter, for the fast path in
> [AGENTS_PLAN.md](AGENTS_PLAN.md). Code: `modellab/hub/system1/`. Run it again with the two commands in
> [AGENTS_PLAN.md](AGENTS_PLAN.md#evals-trust-is-earned-per-action); everything below "Second run in full" is
> generated.

## Summary

- **Three decision models are within reach of the gate**, and their decision accuracy is within about two points
  of each other, which 405 cases cannot separate:
  - `perplexity/pplx-decider-v1.2`: 95.0 % of decisions right, a 320 ms median (659 ms at the 95th percentile).
  - `liquid/d1-ultra`: 95.8 % right, a 232 ms median (460 ms). Its fast path covers less (87 %) at the same precision.
  - `nace-ai/drex-max-finance`: 96.6 % right, a 512 ms median (1.4 s at the 95th percentile). None of its
    fast-path mistakes would have run anything.
- **None clears the 98 % gate on held-out cases.** With the gate chosen on half of the cases, precision on the other
  half is 97.1 % (pplx-decider), 97.6 % (d1-ultra) and 95.9 % (drex-max-finance). That is one or two mistakes too
  many in about 145 fast paths, so it is close, and not yet passed.
- **Jev improved a lot and is still behind.** `typesafe/jev-1.14` went from 80.3 % to 91.6 % of decisions right with
  the second version of the questions; its fast path covers 50 % of requests at the gate.
- **Claude is the most accurate and 5 to 7 times slower.** Sonnet 5.5: 98.4 % right, 1.5 s at the median, 4.1 s at
  the 95th percentile. Haiku 5.5: 96.6 %, 2.1 s.
- **Act actions keep their tap.** No model clears 99.5 %.

**Choice for now:** `perplexity/pplx-decider-v1.2` for look and draft actions, with `liquid/d1-ultra` as the faster
alternative and `nace-ai/drex-max-finance` as the most careful one. None is switched on yet.

## What changed between the runs

The first run used questions written once, for no model in particular. The second (questions v2) changed three
things, for every model alike:

- a new yes/no question, "the sentence asks for more than one thing", which the gate can use;
- sharper descriptions for the two actions models confused most (re-queue a run unchanged, and clone it with a
  change), and for "none of these";
- the selected machine left out of the state: models took it for the machine the user meant.

| model | decisions right, v1 → v2 | fast path coverage at the gate, v1 → v2 | median, v2 |
|---|---|---|---|
| `anthropic/claude-sonnet-5.5` | 99.7 % → 98.4 % | 100.0 % → 98.3 % | 1542 ms |
| `anthropic/claude-haiku-5.5` | 97.6 % → 96.6 % | 97.6 % → 94.2 % | 2114 ms |
| `nace-ai/drex-max-finance` | 96.8 % → 96.6 % | 92.8 % → 97.6 % | 512 ms |
| `perplexity/pplx-decider-v1.2` | 94.2 % → 95.0 % | 91.4 % → 95.9 % | 320 ms |
| `liquid/d1-ultra` | 90.3 % → 95.8 % | 61.3 % → 87.0 % | 232 ms |
| `baseten/mammoth-1` | 90.8 % → 95.3 % | 70.2 % → 86.0 % | 245 ms |
| `liquid/d1.1` | 77.1 % → 94.2 % | 50.7 % → 81.2 % | 226 ms |
| `typesafe/jev-1.14` | 80.3 % → 91.6 % | 4.1 % → 50.3 % | 246 ms |

Sonnet's 1.3 points down are five cases; the questions changed for it too, and nothing was tuned to it.

## What these runs do not show

- 405 cases written by one author, each model asked once. Differences of a point or two are noise.
- The gate has four dials now (`p`, `fits`, `several`, `complete`), so a gate chosen on all cases flatters the
  model. The held-out column is the honest one.
- Latency was measured from a cloud container, not from where the hub runs. The order between models should hold;
  the absolute numbers may not.
- Claude was asked through OpenRouter, which limits new accounts to 20 requests a minute on Sonnet. The direct
  Anthropic adapter (`providers.Claude`) is written and tested with recorded replies, but has not been run against
  the real API: the environment these runs used cannot hold an Anthropic key.
- `upstage/solar-decide` and `upstage/solar-decide-flash` were too slow to finish and were stopped. Three Respan
  models and `cloudflare/clairic` could not take the questions.
- Both runs together cost $10.12, most of it Sonnet.

## Second run in full

405 golden cases (292 meant for the fast path, 113 meant to be handed over), 28 models through OpenRouter. Reference: `anthropic/claude-sonnet-5.5`.

## Ranking

Sorted by how much of the fast-path work a model covers while its fast path stays at least 98 % right. "never" means no threshold reaches 98 %.

| model | decision right | fast path: coverage at the gate | gate | mistakes there (that would run something) | held out: coverage, precision | agrees with the reference | median | 95th pct | cost per request |
|---|---|---|---|---|---|---|---|---|---|
| `anthropic/claude-sonnet-5.5` (chat) | 98.4 % | 98.3 % | several ≤ 0.5 | 3 of 290 (0) | 98.6 %, 99.3 % | 100.0 % | 1542 ms | 4120 ms | $0.007396 |
| `nace-ai/drex-max-finance` | 96.6 % | 97.6 % | p ≥ 0.5 + fits ≥ 0.9 | 5 of 290 (0) | 97.9 %, 95.9 % | 94.3 % | 512 ms | 1392 ms | $0.000087 |
| `perplexity/pplx-decider-v1.2` | 95.0 % | 95.9 % | p ≥ 0.7 + fits ≥ 0.7 + several ≤ 0.5 + complete | 5 of 285 (4) | 95.1 %, 97.1 % | 91.6 % | 320 ms | 659 ms | $0.000029 |
| `anthropic/claude-haiku-5.5` (chat) | 96.6 % | 94.2 % | fits ≥ 0.5 + complete | 4 of 279 (2) | 95.1 %, 99.3 % | 96.5 % | 2114 ms | 3205 ms | $0.000463 |
| `liquid/d1-ultra` | 95.8 % | 87.0 % | p ≥ 0.7 + several ≤ 0.5 | 5 of 259 (1) | 86.0 %, 97.6 % | 94.1 % | 232 ms | 460 ms | $0.000054 |
| `baseten/mammoth-1` | 95.3 % | 86.0 % | p ≥ 0.85 + several ≤ 0.5 | 5 of 256 (0) | 86.7 %, 96.1 % | 91.9 % | 245 ms | 345 ms | $0.000165 |
| `cloudflare/clef` | 91.3 % | 84.9 % | p ≥ 0.5 + fits ≥ 0.7 + several ≤ 0.3 | 5 of 253 (2) | 89.5 %, 94.8 % | 87.2 % | 473 ms | 814 ms | $0.000457 |
| `liquid/d1.1` | 94.2 % | 81.2 % | p ≥ 0.8 + several ≤ 0.5 | 4 of 241 (1) | 86.7 %, 96.9 % | 90.4 % | 226 ms | 976 ms | $0.000026 |
| `nace-ai/drex-max` | 95.5 % | 69.9 % | p ≥ 0.93 + several ≤ 0.5 | 4 of 208 (0) | 71.3 %, 97.1 % | 93.3 % | 649 ms | 958 ms | $0.000121 |
| `morph/reflex` | 93.4 % | 69.2 % | p ≥ 0.93 + several ≤ 0.5 | 3 of 205 (1) | 70.6 %, 98.1 % | 90.6 % | 768 ms | 1064 ms | $0.000066 |
| `parallel/decisions-fast:free` | 88.7 % | 58.2 % | p ≥ 0.93 + several ≤ 0.5 | 3 of 173 (1) | 57.3 %, 97.6 % | 85.7 % | 660 ms | 901 ms | $0.000000 |
| `perplexity/pplx-decider-flash-v1.2` | 90.3 % | 56.5 % | p ≥ 0.93 + several ≤ 0.5 | 2 of 167 (1) | 58.7 %, 98.8 % | 87.7 % | 212 ms | 328 ms | $0.000015 |
| `typesafe/jev-1.14` | 91.6 % | 50.3 % | p ≥ 0.95 + several ≤ 0.5 | 3 of 150 (1) | 65.0 %, 95.9 % | 88.4 % | 246 ms | 995 ms | $0.000084 |
| `typesafe/jev-1.13` | 90.0 % | 44.9 % | p ≥ 0.97 + several ≤ 0.5 | 2 of 133 (0) | 46.2 %, 97.1 % | 87.2 % | 182 ms | 348 ms | $0.000084 |
| `microsoft/microsoft-decision-1` | 94.5 % | 42.8 % | p ≥ 0.97 + several ≤ 0.3 + complete | 2 of 127 (0) | 31.5 %, 100.0 % | 91.4 % | 427 ms | 617 ms | $0.000056 |
| `baseten/elephant-1` | 90.5 % | 40.8 % | p ≥ 0.97 + several ≤ 0.5 + complete | 2 of 121 (1) | 60.8 %, 94.6 % | 87.7 % | 217 ms | 358 ms | $0.000058 |
| `respan/span-02` | 82.6 % | 34.9 % | p ≥ 0.93 + several ≤ 0.5 | 2 of 104 (0) | 12.6 %, 100.0 % | 79.8 % | 780 ms | 940 ms | $0.000039 |
| `cloudflare/clef-flash` | 68.4 % | 28.1 % | p ≥ 0.9 + fits ≥ 0.9 | 1 of 83 (0) | 23.1 %, 100.0 % | 77.0 % | 387 ms | 1106 ms | $0.000055 |
| `cloudflare/clef-omni` | 83.2 % | 26.4 % | p ≥ 0.93 + fits ≥ 0.9 | 1 of 78 (1) | 42.7 %, 96.8 % | 80.5 % | 242 ms | 420 ms | $0.000316 |
| `nace-ai/drex-v2.0` | 83.9 % | 19.9 % | p ≥ 0.93 + several ≤ 0.5 | 1 of 59 (0) | 21.0 %, 96.8 % | 81.5 % | 596 ms | 1002 ms | $0.000076 |
| `openai/gpt-6-luna-decisions` | 86.8 % | 16.8 % | p ≥ 0.98 | 1 of 50 (0) | 5.6 %, 100.0 % | 84.7 % | 317 ms | 728 ms | $0.000234 |
| `liquid/d1` | 81.3 % | 12.7 % | p ≥ 0.9 + fits ≥ 0.5 + several ≤ 0.5 | 0 of 37 (0) | 10.5 %, 100.0 % | 78.3 % | 315 ms | 446 ms | $0.000026 |
| `togethercomputer/tev1-4b-experimental` | 81.1 % | 8.6 % | p ≥ 0.95 + fits ≥ 0.5 + several ≤ 0.5 | 0 of 25 (0) | 9.8 %, 93.3 % | 80.0 % | 560 ms | 768 ms | $0.000164 |
| `scaledown/classify-1` | 75.8 % | 8.6 % | p ≥ 0.95 + complete | 0 of 25 (0) | 22.4 %, 94.1 % | 75.9 % | 517 ms | 2536 ms | $0.000242 |
| `nace-ai/drex-v1.5` | 70.8 % | 6.5 % | p ≥ 0.97 + fits ≥ 0.7 | 0 of 19 (0) | 48.3 %, 97.2 % | 69.1 % | 509 ms | 1306 ms | $0.000050 |
| `baseten/joey-1` | 71.3 % | 5.1 % | p ≥ 0.95 + several ≤ 0.5 | 0 of 15 (0) | 6.3 %, 90.0 % | 68.9 % | 195 ms | 349 ms | $0.000016 |
| `upstage/solar-decide-flash` | 70.3 % | 4.5 % | p ≥ 0.95 + fits ≥ 0.7 + complete | 0 of 13 (0) | 9.8 %, 82.4 % | 69.6 % | 1481 ms | 24026 ms | $0.000331 |
| `jaredpalmer/kev-4b` | 57.4 % | 3.8 % | p ≥ 0.8 + several ≤ 0.5 | 0 of 11 (0) | 4.2 %, 100.0 % | 56.3 % | 1439 ms | 2576 ms | $0.000053 |

- **Gate**: what the fast path requires beyond the router's own checks. `p`: the least certain answer; `fits`: the model's own answer to "one listed action does what the user asked"; `several`: its answer to "the sentence asks for more than one thing"; `complete`: its answer to "nothing needs asking".
- **Mistakes (that would run something)**: fast paths that were wrong or should have been handed over; in brackets, those whose action is in the act or careful tier. The rest only open or fill something in.
- **Held out**: the gate chosen on every other case, scored on the remaining half.
- **Median and 95th percentile**: one request at a time on a warm connection where a model was timed alone (`drex-max-finance`, `pplx-decider-v1.2`, `d1-ultra`, `mammoth-1`, `clef`, `d1.1`, `drex-max`, `pplx-decider-flash-v1.2`, `jev-1.14`, `microsoft-decision-1`); otherwise measured with 6 requests in flight. Both include the network between this computer and OpenRouter.

## Without a gate

What each model does when every structurally valid answer is acted on. Mistakes here are fast paths taken that were wrong or should have been handed over.

| model | answered | action right | decision right | intent right | fast paths taken | mistakes | of them act or careful | precision | option orders disagree | calibration error |
|---|---|---|---|---|---|---|---|---|---|---|
| `anthropic/claude-sonnet-5.5` | 100 % | 98.9 % | 98.4 % | 99.5 % | 301 | 14 | 8 | 95.3 % | 0.2 % | no probabilities |
| `nace-ai/drex-max-finance` | 100 % | 97.1 % | 96.6 % | 99.8 % | 307 | 21 | 11 | 93.2 % | 2.5 % | 0.013 |
| `perplexity/pplx-decider-v1.2` | 100 % | 96.1 % | 95.0 % | 99.3 % | 321 | 30 | 21 | 90.7 % | 2.0 % | 0.048 |
| `anthropic/claude-haiku-5.5` | 100 % | 97.4 % | 96.6 % | 99.0 % | 296 | 16 | 9 | 94.6 % | 0.5 % | no probabilities |
| `liquid/d1-ultra` | 100 % | 97.9 % | 95.8 % | 99.5 % | 306 | 26 | 15 | 91.5 % | 1.7 % | 0.058 |
| `baseten/mammoth-1` | 100 % | 97.6 % | 95.3 % | 95.8 % | 304 | 27 | 13 | 91.1 % | 1.2 % | 0.015 |
| `cloudflare/clef` | 100 % | 93.4 % | 91.3 % | 88.4 % | 292 | 32 | 22 | 89.0 % | 3.2 % | 0.080 |
| `liquid/d1.1` | 100 % | 96.8 % | 94.2 % | 99.8 % | 308 | 31 | 16 | 89.9 % | 2.7 % | 0.048 |
| `nace-ai/drex-max` | 100 % | 97.6 % | 95.5 % | 96.5 % | 300 | 26 | 14 | 91.3 % | 1.5 % | 0.006 |
| `morph/reflex` | 100 % | 96.1 % | 93.4 % | 93.1 % | 290 | 30 | 16 | 89.7 % | 4.0 % | 0.016 |
| `parallel/decisions-fast:free` | 100 % | 93.4 % | 88.7 % | 93.1 % | 286 | 39 | 20 | 86.4 % | 4.4 % | 0.032 |
| `perplexity/pplx-decider-flash-v1.2` | 100 % | 93.9 % | 90.3 % | 94.8 % | 309 | 36 | 20 | 88.3 % | 2.2 % | 0.031 |
| `typesafe/jev-1.14` | 100 % | 95.5 % | 91.6 % | 94.8 % | 300 | 39 | 20 | 87.0 % | 1.2 % | 0.027 |
| `typesafe/jev-1.13` | 100 % | 94.5 % | 90.0 % | 94.1 % | 294 | 37 | 18 | 87.4 % | 3.0 % | 0.030 |
| `microsoft/microsoft-decision-1` | 100 % | 98.9 % | 94.5 % | 97.3 % | 303 | 31 | 10 | 89.8 % | 0.2 % | 0.022 |
| `baseten/elephant-1` | 100 % | 94.7 % | 90.5 % | 94.1 % | 305 | 37 | 21 | 87.9 % | 2.2 % | 0.036 |
| `respan/span-02` | 100 % | 87.4 % | 82.6 % | 86.4 % | 276 | 44 | 19 | 84.1 % | 11.6 % | 0.041 |
| `cloudflare/clef-flash` | 85 % | 75.5 % | 68.4 % | 73.6 % | 255 | 54 | 26 | 78.8 % | 3.2 % | 0.071 |
| `cloudflare/clef-omni` | 100 % | 87.9 % | 83.2 % | 87.2 % | 286 | 44 | 26 | 84.6 % | 5.7 % | 0.043 |
| `nace-ai/drex-v2.0` | 100 % | 91.3 % | 83.9 % | 79.0 % | 243 | 37 | 21 | 84.8 % | 7.7 % | 0.082 |
| `openai/gpt-6-luna-decisions` | 100 % | 94.7 % | 86.8 % | 94.8 % | 293 | 50 | 18 | 82.9 % | 5.9 % | 0.100 |
| `liquid/d1` | 100 % | 88.2 % | 81.3 % | 88.1 % | 263 | 43 | 23 | 83.7 % | 7.2 % | 0.039 |
| `togethercomputer/tev1-4b-experimental` | 100 % | 87.6 % | 81.1 % | 59.0 % | 210 | 36 | 16 | 82.9 % | 14.3 % | 0.064 |
| `scaledown/classify-1` | 97 % | 87.9 % | 75.8 % | 82.2 % | 277 | 66 | 17 | 76.2 % | 10.2 % | 0.133 |
| `nace-ai/drex-v1.5` | 100 % | 81.6 % | 70.8 % | 87.2 % | 247 | 57 | 25 | 76.9 % | 9.1 % | 0.076 |
| `baseten/joey-1` | 100 % | 81.1 % | 71.3 % | 75.8 % | 237 | 67 | 43 | 71.7 % | 5.7 % | 0.076 |
| `upstage/solar-decide-flash` | 100 % | 84.5 % | 70.3 % | 89.9 % | 224 | 48 | 13 | 78.6 % | 19.3 % | 0.093 |
| `jaredpalmer/kev-4b` | 100 % | 62.1 % | 57.4 % | 38.5 % | 119 | 19 | 11 | 84.0 % | 18.0 % | 0.139 |

## By kind of sentence

Decisions right, for the leading models.

| kind | cases | `claude-sonnet-5.5` | `drex-max-finance` | `pplx-decider-v1.2` | `claude-haiku-5.5` | `d1-ultra` | `mammoth-1` | `clef` | `d1.1` |
|---|---|---|---|---|---|---|---|---|---|
| plain | 91 | 100 % | 100 % | 100 % | 100 % | 99 % | 99 % | 100 % | 99 % |
| numbers | 90 | 99 % | 100 % | 100 % | 99 % | 96 % | 93 % | 96 % | 92 % |
| indirection | 37 | 97 % | 97 % | 100 % | 97 % | 97 % | 95 % | 95 % | 97 % |
| none | 28 | 100 % | 79 % | 64 % | 100 % | 93 % | 93 % | 54 % | 96 % |
| typo | 24 | 100 % | 100 % | 100 % | 96 % | 100 % | 100 % | 92 % | 100 % |
| multi | 23 | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % |
| nav | 20 | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 90 % | 90 % |
| explain | 16 | 100 % | 100 % | 100 % | 100 % | 94 % | 100 % | 100 % | 100 % |
| negation | 15 | 93 % | 87 % | 93 % | 93 % | 80 % | 93 % | 93 % | 87 % |
| show | 14 | 79 % | 86 % | 100 % | 43 % | 86 % | 93 % | 100 % | 79 % |
| relative | 11 | 100 % | 100 % | 82 % | 91 % | 91 % | 82 % | 82 % | 91 % |
| hostile | 10 | 100 % | 90 % | 90 % | 100 % | 100 % | 100 % | 90 % | 100 % |
| talk | 8 | 100 % | 100 % | 88 % | 100 % | 100 % | 88 % | 88 % | 100 % |
| plan | 6 | 100 % | 100 % | 83 % | 100 % | 83 % | 83 % | 83 % | 83 % |
| ambiguous | 6 | 100 % | 83 % | 67 % | 100 % | 100 % | 100 % | 50 % | 50 % |
| find | 6 | 100 % | 100 % | 83 % | 100 % | 100 % | 83 % | 83 % | 100 % |

Fast paths wrongly taken, by kind (no threshold):

| kind | `claude-sonnet-5.5` | `drex-max-finance` | `pplx-decider-v1.2` | `claude-haiku-5.5` | `d1-ultra` | `mammoth-1` | `clef` | `d1.1` |
|---|---|---|---|---|---|---|---|---|
| plain | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| numbers | 0 | 1 | 1 | 2 | 4 | 6 | 0 | 8 |
| indirection | 0 | 1 | 0 | 0 | 1 | 1 | 1 | 0 |
| none | 0 | 5 | 8 | 0 | 1 | 1 | 6 | 0 |
| typo | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| multi | 11 | 10 | 13 | 10 | 16 | 14 | 15 | 15 |
| nav | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| explain | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| negation | 2 | 2 | 1 | 2 | 2 | 1 | 2 | 1 |
| show | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| relative | 1 | 1 | 3 | 2 | 2 | 3 | 2 | 2 |
| hostile | 0 | 0 | 1 | 0 | 0 | 1 | 1 | 1 |
| talk | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| plan | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ambiguous | 0 | 1 | 2 | 0 | 0 | 0 | 4 | 3 |
| find | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Not scored

| model | answered | why |
|---|---|---|
| `cloudflare/clairic` | 0 | no answers |
| `respan/span-01` | 0 | no answers |
| `respan/span-01-lite` | 0 | no answers |
| `respan/span-01-lite:free` | 0 | no answers |
| `upstage/solar-decide` | 0 | no answers |
