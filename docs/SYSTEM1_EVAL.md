# System 1 evaluation: which decision model, 11 November 2026

> The first side-by-side run of every decision model on OpenRouter, for the fast path in
> [AGENTS_PLAN.md](AGENTS_PLAN.md). Code: `modellab/hub/system1/`. Run it again with the two commands in
> [AGENTS_PLAN.md](AGENTS_PLAN.md#evals-trust-is-earned-per-action); everything below the summary is generated.

## Summary

- **The golden set holds up.** Claude Sonnet 5.5, the reference, makes the expected decision in 99.7 % of the 405
  cases, so the expected answers are sound.
- **Two decision models are close to the gate; the rest are not.**
  - `perplexity/pplx-decider-v1.2`: 94.2 % of decisions right, a 301 ms median (627 ms at the 95th percentile). Its
    fast path covers 91.4 % of the one-action requests at 98 % precision; on held-out cases, 90.2 % at 97.7 %.
  - `nace-ai/drex-max-finance`: 96.8 % right, a 499 ms median (769 ms). Its fast path covers 92.8 % at 98 %
    precision; held out, 88.8 % at 99.2 %. It costs three times as much per request, still under a hundredth of a
    cent.
- **Jev is the fastest and not accurate enough.** `typesafe/jev-1.14` answers in 194 ms at the median but makes the
  right decision in 80.3 % of cases, and its fast path reaches 98 % precision on only 4 % of requests.
- **Claude is the most accurate and 5 to 7 times slower.** Sonnet 5.5: 1.5 s at the median, 3.8 s at the 95th
  percentile. Haiku 5.5: 97.6 % right, 2.1 s.
- **No model clears the 99.5 % gate for act actions.** The mistakes that remain are almost all requests for several
  actions ("export this and then delete the run") answered with one of them. Act and careful actions keep their
  tap.

**Choice for now:** `perplexity/pplx-decider-v1.2` for look and draft actions, with `nace-ai/drex-max-finance` as
the alternative if accuracy turns out to matter more than 200 ms. Neither is switched on yet.

**What this run does not show:**
- One run, on 405 cases written by one author. The gate is tuned on about 200 cases and checked on the other 200;
  pplx-decider's held-out precision is 97.7 %, just under the gate.
- Latency was measured from a cloud container, not from where the hub runs. The order between models should hold;
  the absolute numbers may not.
- `upstage/solar-decide` did not finish in 30 minutes and was stopped. Three Respan models and `cloudflare/clairic`
  could not take the questions.
- The questions were written once and not tuned for any model. A dedicated "asks for several things" question and
  sharper action descriptions are the obvious next changes, and need a second run.
- The whole run cost $5.66, most of it Sonnet.

405 golden cases (292 meant for the fast path, 113 meant to be handed over), 28 models through OpenRouter. Reference: `anthropic/claude-sonnet-5.5`.

## Ranking

Sorted by how much of the fast-path work a model covers while its fast path stays at least 98 % right. "never" means no threshold reaches 98 %.

| model | decision right | fast path: coverage at the gate | gate | mistakes there (that would run something) | held out: coverage, precision | agrees with the reference | median | 95th pct | cost per request |
|---|---|---|---|---|---|---|---|---|---|
| `anthropic/claude-sonnet-5.5` (chat) | 99.7 % | 100.0 % | none needed | 3 of 295 (1) | 100.0 %, 99.3 % | 100.0 % | 1508 ms | 3782 ms | $0.006827 |
| `anthropic/claude-haiku-5.5` (chat) | 97.6 % | 97.6 % | fits ≥ 0.5 | 4 of 289 (0) | 98.6 %, 98.6 % | 95.0 % | 2070 ms | 3206 ms | $0.000443 |
| `nace-ai/drex-max-finance` | 96.8 % | 92.8 % | p ≥ 0.7 + fits ≥ 0.9 + complete | 5 of 276 (4) | 88.8 %, 99.2 % | 93.3 % | 499 ms | 769 ms | $0.000078 |
| `perplexity/pplx-decider-v1.2` | 94.2 % | 91.4 % | p ≥ 0.7 + fits ≥ 0.9 | 5 of 272 (5) | 90.2 %, 97.7 % | 89.1 % | 301 ms | 627 ms | $0.000026 |
| `baseten/mammoth-1` | 90.8 % | 70.2 % | p ≥ 0.9 + fits ≥ 0.5 | 4 of 209 (3) | 62.9 %, 98.9 % | 87.2 % | 266 ms | 349 ms | $0.000148 |
| `cloudflare/clef` | 82.4 % | 63.7 % | p ≥ 0.7 + fits ≥ 0.7 + complete | 3 of 189 (1) | 70.6 %, 95.3 % | 77.8 % | 441 ms | 828 ms | $0.000418 |
| `liquid/d1-ultra` | 90.3 % | 61.3 % | p ≥ 0.9 + complete | 3 of 182 (2) | 79.7 %, 95.8 % | 86.2 % | 267 ms | 457 ms | $0.000048 |
| `liquid/d1.1` | 77.1 % | 50.7 % | p ≥ 0.85 | 3 of 151 (3) | 49.0 %, 97.2 % | 75.1 % | 204 ms | 376 ms | $0.000023 |
| `nace-ai/drex-max` | 94.5 % | 45.9 % | p ≥ 0.98 | 2 of 136 (1) | 46.2 %, 98.5 % | 90.9 % | 516 ms | 687 ms | $0.000109 |
| `perplexity/pplx-decider-flash-v1.2` | 81.1 % | 39.0 % | p ≥ 0.93 + fits ≥ 0.5 | 1 of 115 (1) | 32.2 %, 97.9 % | 77.0 % | 200 ms | 246 ms | $0.000013 |
| `morph/reflex` | 87.4 % | 35.6 % | p ≥ 0.995 | 1 of 105 (1) | 44.8 %, 97.0 % | 83.5 % | 1438 ms | 2428 ms | $0.000059 |
| `typesafe/jev-1.13` | 81.1 % | 26.4 % | p ≥ 0.99 + complete | 1 of 78 (1) | 2.1 %, 100.0 % | 76.8 % | 172 ms | 256 ms | $0.000077 |
| `parallel/decisions-fast:free` | 78.9 % | 25.7 % | p ≥ 0.93 + fits ≥ 0.5 + complete | 1 of 76 (1) | 7.7 %, 100.0 % | 75.3 % | 661 ms | 897 ms | $0.000000 |
| `microsoft/microsoft-decision-1` | 89.2 % | 25.3 % | p ≥ 0.995 | 0 of 74 (0) | 24.5 %, 100.0 % | 85.4 % | 414 ms | 733 ms | $0.000049 |
| `openai/gpt-6-luna-decisions` | 81.6 % | 23.3 % | p ≥ 0.98 | 1 of 69 (0) | 28.7 %, 93.2 % | 78.0 % | 319 ms | 778 ms | $0.000204 |
| `baseten/elephant-1` | 83.4 % | 21.9 % | p ≥ 0.99 | 1 of 65 (1) | 30.1 %, 93.5 % | 79.8 % | 204 ms | 275 ms | $0.000052 |
| `cloudflare/clef-flash` | 74.2 % | 21.9 % | p ≥ 0.95 | 1 of 65 (1) | 24.5 %, 94.6 % | 71.8 % | 367 ms | 802 ms | $0.000048 |
| `cloudflare/clef-omni` | 80.5 % | 18.8 % | p ≥ 0.93 + fits ≥ 0.9 | 0 of 55 (0) | 26.6 %, 95.0 % | 76.0 % | 230 ms | 417 ms | $0.000286 |
| `nace-ai/drex-v2.0` | 73.2 % | 17.5 % | p ≥ 0.9 | 1 of 52 (1) | 3.5 %, 100.0 % | 69.6 % | 597 ms | 923 ms | $0.000067 |
| `nace-ai/drex-v1.5` | 63.9 % | 9.9 % | p ≥ 0.99 + fits ≥ 0.5 | 0 of 29 (0) | 12.6 %, 81.8 % | 62.2 % | 480 ms | 1667 ms | $0.000044 |
| `liquid/d1` | 65.5 % | 9.2 % | p ≥ 0.93 + fits ≥ 0.5 | 0 of 27 (0) | 8.4 %, 100.0 % | 64.0 % | 276 ms | 402 ms | $0.000023 |
| `upstage/solar-decide-flash` | 67.1 % | 7.2 % | p ≥ 0.95 | 0 of 21 (0) | 7.7 %, 100.0 % | 64.0 % | 1709 ms | 6949 ms | $0.000300 |
| `respan/span-02` | 75.3 % | 5.1 % | p ≥ 0.995 | 0 of 15 (0) | 2.8 %, 66.7 % | 72.3 % | 528 ms | 924 ms | $0.000036 |
| `scaledown/classify-1` | 73.9 % | 4.8 % | p ≥ 0.95 + fits ≥ 0.5 + complete | 0 of 14 (0) | 4.9 %, 87.5 % | 70.4 % | 742 ms | 8363 ms | $0.000222 |
| `jaredpalmer/kev-4b` | 50.3 % | 4.8 % | p ≥ 0.8 | 0 of 14 (0) | 4.2 %, 100.0 % | 49.6 % | 1122 ms | 1609 ms | $0.000047 |
| `typesafe/jev-1.14` | 80.3 % | 4.1 % | p ≥ 0.97 + fits ≥ 0.5 | 0 of 12 (0) | 3.5 %, 83.3 % | 76.3 % | 194 ms | 249 ms | $0.000077 |
| `togethercomputer/tev1-4b-experimental` | 70.0 % | 1.0 % | p ≥ 0.98 + fits ≥ 0.7 | 0 of 3 (0) | 7.0 %, 83.3 % | 68.6 % | 505 ms | 718 ms | $0.000149 |
| `baseten/joey-1` | 62.1 % | 1.0 % | fits ≥ 0.9 | 0 of 3 (0) | 0.7 %, 100.0 % | 58.5 % | 186 ms | 242 ms | $0.000015 |

- **Gate**: what the fast path requires beyond the router's own checks. `p`: the least certain answer; `fits`: the model's own answer to "one listed action does what the user asked"; `complete`: its answer to "nothing needs asking".
- **Mistakes (that would run something)**: fast paths that were wrong or should have been handed over; in brackets, those whose action is in the act or careful tier. The rest only open or fill something in.
- **Held out**: the gate chosen on every other case, scored on the remaining half.
- **Median and 95th percentile**: one request at a time on a warm connection where a model was timed alone (`claude-haiku-5.5`, `drex-max-finance`, `pplx-decider-v1.2`, `mammoth-1`, `clef`, `d1-ultra`, `drex-max`, `pplx-decider-flash-v1.2`, `microsoft-decision-1`, `jev-1.14`); otherwise measured with 6 requests in flight. Both include the network between this computer and OpenRouter.

## Without a gate

What each model does when every structurally valid answer is acted on. Mistakes here are fast paths taken that were wrong or should have been handed over.

| model | answered | action right | decision right | intent right | fast paths taken | mistakes | of them act or careful | precision | option orders disagree | calibration error |
|---|---|---|---|---|---|---|---|---|---|---|
| `anthropic/claude-sonnet-5.5` | 100 % | 99.7 % | 99.7 % | 99.3 % | 295 | 3 | 1 | 99.0 % | 0.0 % | no probabilities |
| `anthropic/claude-haiku-5.5` | 99 % | 98.4 % | 97.6 % | 97.5 % | 297 | 12 | 8 | 96.0 % | 0.5 % | no probabilities |
| `nace-ai/drex-max-finance` | 100 % | 97.6 % | 96.8 % | 99.5 % | 304 | 17 | 12 | 94.4 % | 1.5 % | 0.034 |
| `perplexity/pplx-decider-v1.2` | 100 % | 95.3 % | 94.2 % | 98.8 % | 316 | 28 | 21 | 91.1 % | 3.5 % | 0.075 |
| `baseten/mammoth-1` | 100 % | 95.3 % | 90.8 % | 96.0 % | 301 | 38 | 15 | 87.4 % | 0.7 % | 0.023 |
| `cloudflare/clef` | 100 % | 91.1 % | 82.4 % | 86.7 % | 290 | 54 | 26 | 81.4 % | 3.0 % | 0.089 |
| `liquid/d1-ultra` | 100 % | 96.1 % | 90.3 % | 99.3 % | 304 | 39 | 13 | 87.2 % | 1.0 % | 0.053 |
| `liquid/d1.1` | 100 % | 82.1 % | 77.1 % | 99.8 % | 246 | 36 | 16 | 85.4 % | 9.6 % | 0.046 |
| `nace-ai/drex-max` | 100 % | 96.6 % | 94.5 % | 96.8 % | 297 | 26 | 13 | 91.2 % | 2.2 % | 0.014 |
| `perplexity/pplx-decider-flash-v1.2` | 100 % | 89.5 % | 81.1 % | 93.8 % | 297 | 60 | 26 | 79.8 % | 4.9 % | 0.041 |
| `morph/reflex` | 100 % | 90.8 % | 87.4 % | 93.6 % | 265 | 34 | 20 | 87.2 % | 7.4 % | 0.026 |
| `typesafe/jev-1.13` | 100 % | 90.5 % | 81.1 % | 94.3 % | 290 | 63 | 30 | 78.3 % | 3.0 % | 0.022 |
| `parallel/decisions-fast:free` | 100 % | 86.1 % | 78.9 % | 93.8 % | 290 | 65 | 38 | 77.6 % | 3.0 % | 0.033 |
| `microsoft/microsoft-decision-1` | 100 % | 94.7 % | 89.2 % | 97.0 % | 302 | 40 | 13 | 86.8 % | 0.0 % | 0.032 |
| `openai/gpt-6-luna-decisions` | 100 % | 92.6 % | 81.6 % | 94.8 % | 278 | 51 | 15 | 81.7 % | 9.9 % | 0.070 |
| `baseten/elephant-1` | 100 % | 88.9 % | 83.4 % | 93.1 % | 294 | 53 | 33 | 82.0 % | 3.7 % | 0.028 |
| `cloudflare/clef-flash` | 97 % | 83.2 % | 74.2 % | 87.9 % | 293 | 70 | 33 | 76.1 % | 4.3 % | 0.085 |
| `cloudflare/clef-omni` | 100 % | 89.2 % | 80.5 % | 89.6 % | 290 | 57 | 29 | 80.3 % | 3.7 % | 0.058 |
| `nace-ai/drex-v2.0` | 100 % | 82.6 % | 73.2 % | 81.5 % | 218 | 48 | 28 | 78.0 % | 10.6 % | 0.063 |
| `nace-ai/drex-v1.5` | 100 % | 71.6 % | 63.9 % | 87.7 % | 220 | 51 | 28 | 76.8 % | 14.3 % | 0.137 |
| `liquid/d1` | 100 % | 75.3 % | 65.5 % | 90.6 % | 202 | 43 | 16 | 78.7 % | 15.3 % | 0.049 |
| `upstage/solar-decide-flash` | 100 % | 86.8 % | 67.1 % | 94.3 % | 239 | 74 | 22 | 69.0 % | 21.5 % | 0.145 |
| `respan/span-02` | 100 % | 82.9 % | 75.3 % | 86.2 % | 261 | 57 | 30 | 78.2 % | 12.3 % | 0.026 |
| `scaledown/classify-1` | 100 % | 89.7 % | 73.9 % | 85.4 % | 283 | 73 | 20 | 74.2 % | 9.9 % | 0.141 |
| `jaredpalmer/kev-4b` | 100 % | 56.3 % | 50.3 % | 34.8 % | 94 | 20 | 12 | 78.7 % | 13.1 % | 0.095 |
| `typesafe/jev-1.14` | 100 % | 87.9 % | 80.3 % | 96.3 % | 294 | 64 | 37 | 78.2 % | 3.7 % | 0.022 |
| `togethercomputer/tev1-4b-experimental` | 100 % | 81.6 % | 70.0 % | 55.8 % | 187 | 47 | 21 | 74.9 % | 15.1 % | 0.064 |
| `baseten/joey-1` | 100 % | 73.7 % | 62.1 % | 78.3 % | 246 | 89 | 57 | 63.8 % | 5.7 % | 0.047 |

## By kind of sentence

Decisions right, for the leading models.

| kind | cases | `claude-sonnet-5.5` | `claude-haiku-5.5` | `drex-max-finance` | `pplx-decider-v1.2` | `mammoth-1` | `clef` | `d1-ultra` | `d1.1` |
|---|---|---|---|---|---|---|---|---|---|
| plain | 91 | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 98 % |
| numbers | 90 | 98 % | 97 % | 96 % | 97 % | 87 % | 76 % | 84 % | 48 % |
| indirection | 37 | 100 % | 95 % | 100 % | 100 % | 92 % | 86 % | 89 % | 89 % |
| none | 28 | 100 % | 100 % | 89 % | 64 % | 96 % | 71 % | 96 % | 100 % |
| typo | 24 | 100 % | 96 % | 100 % | 100 % | 96 % | 88 % | 100 % | 88 % |
| multi | 23 | 100 % | 91 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % |
| nav | 20 | 100 % | 100 % | 100 % | 100 % | 80 % | 85 % | 80 % | 40 % |
| explain | 16 | 100 % | 100 % | 100 % | 100 % | 100 % | 81 % | 94 % | 100 % |
| negation | 15 | 100 % | 93 % | 87 % | 93 % | 80 % | 87 % | 87 % | 87 % |
| show | 14 | 100 % | 86 % | 93 % | 93 % | 93 % | 79 % | 71 % | 64 % |
| relative | 11 | 100 % | 91 % | 100 % | 82 % | 82 % | 73 % | 91 % | 73 % |
| hostile | 10 | 100 % | 100 % | 90 % | 90 % | 80 % | 80 % | 80 % | 80 % |
| talk | 8 | 100 % | 100 % | 100 % | 88 % | 75 % | 75 % | 100 % | 88 % |
| ambiguous | 6 | 100 % | 100 % | 83 % | 67 % | 83 % | 33 % | 100 % | 33 % |
| plan | 6 | 100 % | 100 % | 100 % | 83 % | 67 % | 0 % | 33 % | 67 % |
| find | 6 | 100 % | 100 % | 100 % | 100 % | 83 % | 83 % | 100 % | 100 % |

Fast paths wrongly taken, by kind (no threshold):

| kind | `claude-sonnet-5.5` | `claude-haiku-5.5` | `drex-max-finance` | `pplx-decider-v1.2` | `mammoth-1` | `clef` | `d1-ultra` | `d1.1` |
|---|---|---|---|---|---|---|---|---|
| plain | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| numbers | 0 | 0 | 2 | 1 | 13 | 12 | 15 | 14 |
| indirection | 0 | 0 | 0 | 0 | 2 | 4 | 3 | 2 |
| none | 0 | 0 | 2 | 7 | 1 | 5 | 1 | 0 |
| typo | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 2 |
| multi | 1 | 9 | 10 | 11 | 10 | 18 | 13 | 8 |
| nav | 0 | 0 | 0 | 0 | 2 | 2 | 1 | 2 |
| explain | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| negation | 1 | 1 | 1 | 2 | 3 | 2 | 2 | 1 |
| show | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| relative | 1 | 2 | 1 | 3 | 3 | 2 | 2 | 1 |
| hostile | 0 | 0 | 0 | 1 | 2 | 2 | 1 | 2 |
| talk | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 |
| ambiguous | 0 | 0 | 1 | 2 | 1 | 5 | 0 | 3 |
| plan | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| find | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Not scored

| model | answered | why |
|---|---|---|
| `cloudflare/clairic` | 0 | HTTP 404: {"error":{"message":"No endpoints found for cloudflare/clairic.","code":404},"user_id":"user_3LxNxYM |
| `respan/span-01` | 0 | HTTP 400: {"error":{"message":"Respan only accepts noul questions whose instructions and criteria are present, |
| `respan/span-01-lite` | 0 | HTTP 400: {"error":{"message":"Respan only accepts noul questions whose instructions and criteria are present, |
| `respan/span-01-lite:free` | 0 | HTTP 400: {"error":{"message":"Respan only accepts noul questions whose instructions and criteria are present, |
| `upstage/solar-decide` | 0 | no answers |
