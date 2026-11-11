# Agents: Yeti, hands-on

> Status: the first steps are built: one-sentence actions work in the web app ([Build order](#build-order) says
> what is and isn't; [HUB.md](HUB.md#8-yeti-the-assistant) says how to use it). The rest is the plan. Where agents sit among ModelLab's three parts: [PLATFORM.md](PLATFORM.md).

**In one sentence:** you say what you want in one sentence; a fast System One model picks the component and the
action, ModelLab highlights it and fills it in, and nothing runs without your approval. Anything bigger than one step
goes to Claude, which plans it.

## What changes

| you say | today | next |
|---|---|---|
| "How do I add a dataset?" | Yeti explains the steps | Yeti highlights each component to click, in turn |
| "Why did this run fail?" | explains the error | explains it and offers the fix, ready to apply |
| "Re-run this with batch size 4 on the 5090" | tells you where to click | opens Clone & edit with batch 4 and the RTX 5090 filled in; one tap queues it |
| "Could distilling DINOv3 into the Nano beat the Small at the same speed?" | discusses it | drafts the search that answers it, runs it when you approve, explains the outcome |
| "Find a forklift detection dataset" | can't help yet | finds candidates online with their licence and size, and imports the one you pick |

## Decisions

| topic | decision |
|---|---|
| Job | Help you develop: guide, act, fix, collaborate, find. Agents never go around the harness: every action is one the web app can take too. |
| Two systems | **System 1**: a System One (decision) model, a pinned version, for fast, bounded decisions: which action, which component, which option. Which model is chosen by our own evaluation, not by name. **System 2**: Claude, the Yeti engine that exists today, for open-ended work: plans, recipes, diagnosis, search, explanations. |
| One router | System 1 models are reached through **OpenRouter**: one key and one credit balance for every decision model and for the chat models they are compared with, so a model can be swapped by changing its id. |
| One sentence | One sentence → one System 1 request, with all its questions answered in parallel → one decision: act, show, ask you, or hand over to Claude. |
| Clicking | The agent doesn't click pixels or read the page. It picks from registered actions; the web app highlights the matching component, fills it in, and calls the same API the button calls. |
| Values | Numbers, sizes, names and dates are found in the sentence by code. System 1 only picks among those candidates, and the hub validates them as it does for the web app. |
| Approval | By tier: **look** never asks, **draft** leaves the last click to you, **act** takes one tap (or a standing permission you grant), **careful** always asks. Some things are never in reach. |
| Trust | System 1 decides an action kind on its own only after it passes our evals for that kind. Vendors' own benchmarks don't count. |
| Accounts | Your own keys, encrypted on the hub: an OpenRouter key for System 1, and the Claude key Yeti already uses for System 2. Yeti's chat stays on the Claude key for now; OpenRouter can become a second way to reach Claude later. |
| Privacy | System 1 sees your sentence and what's on screen (component labels, names, current values). Never images, annotations, weights, checkpoints or file contents. OpenRouter and the model's provider both receive it; both are listed on the privacy page. |
| Claude apps | The same actions and tiers are served through the MCP server. |
| Record | Every action is logged with the sentence, the decision, its confidence and who approved it. What an agent starts is tagged "via Yeti" (or with the Claude app's name). |

## Two systems

The split follows Kahneman's fast, intuitive System 1 and slow, deliberate System 2. Most of what an assistant
decides while you work is a quick choice between known options; a few things need real thinking.

### System 1: a System One model

**What it is.** "System One model" is TypeSafe AI's name for a decision model; the first one, Jev, opened in early
access in September 2026. It reads a state (text, JSON or images) and a set of typed questions, and answers each one
with probabilities instead of text:
- **Choice**: which of up to 255 options, each given with a description;
- **Score**: a level on an ordered scale;
- **Noul**: the probability that a statement is true.

All questions in a request are answered in parallel, so ten questions take about as long as one. TypeSafe quotes 70
to 500 ms end to end, and $0.042 per million input tokens with output free: about a hundredth of a cent for one of
our requests.

**Why it fits.** Picking a component and an action is a bounded choice. The answer can only be one of the options we
list, so it's always well-formed, and the probabilities say how sure it is: confident means act or show; unsure
means ask you or hand over to Claude.

**What it can't do.** Write text, explain, or produce a value it wasn't given as an option. TypeSafe's own notes say
Jev is weak at numbers, dates, counting, indirection ("the run before the one that failed"), long irrelevant state
and adversarial text, and that it leans toward the first option. ModelLab is full of numbers, so code reads them
(below).

**What isn't verified.** TypeSafe's speed, cost and accuracy figures come from its own benchmarks, scored against the
answers of two large LLMs rather than a ground truth. We measure it on our own tasks before trusting it
([Evals](#evals-trust-is-earned-per-action)).

**Access.** Through OpenRouter's Decisions API (`POST /api/alpha/decisions`, in alpha: its shape may change), which
serves Jev (`typesafe/jev-1.14`) next to about thirty other decision models from fourteen makers, all with the same
request. We pin a dated version: aliases such as `~typesafe/jev-latest` move with every release, and the answers
move with them. Each maker's probabilities mean something slightly different, so a threshold is tuned per model.

### System 2: Claude

The Yeti engine as it is today (`modellab/hub/yeti.py`): your Claude account, the tool loop and the explanations,
plus the write tools from this plan. It takes everything open-ended: ideas, plans of several steps, recipes,
failures nobody has seen before, web search, explanations, and every request System 1 isn't sure about. Claude can
also call System 1 as a tool, for fast ranking and checks.

### One sentence, step by step

```
 "re-run this with batch size 4 on the 5090"               on the page of a run that ran out of GPU memory
                      │
                      ▼
 the hub: what's on screen, plus candidates found by code  machines: RTX 5090, RTX A4000 · numbers: 4, 5090
                      │
                      ▼
 System 1: one request, every question in parallel         action: clone & edit 0.97 · machine: RTX 5090 0.99
                      │                                    batch: 4 0.98 · complete: yes 0.93
                      ▼
 code: one action, every value found, confident enough, both option orders agree?
           │ yes                                           │ no
           ▼                                               ▼
 Clone & edit opens with batch 4 and the RTX 5090          Claude takes over, with System 1's guesses
 filled in and highlighted. "Queue it?" One tap.           as hints, or Yeti asks you one short question
```

1. The web app sends the sentence and what's on screen: the page, the ids of the components registered on it, the
   form values and the selected machine. The hub looks the names up itself, as Yeti's page note does today.
2. Code finds candidates in the sentence: numbers with their units, sizes, ratios, durations, and names that match
   your machines, datasets and runs.
3. System 1 answers all the questions in one request.
4. Code checks the answers: one registered action, both option orders agree, every required value found, no
   setting named without a value, and the model's gate for that action's tier passed. Then it acts within the
   action's tier, asks you one short question, or hands everything to Claude with System 1's top guesses as hints.

**One sentence, one action** on the fast path. A request that needs several actions goes to Claude, which plans
them and shows each one.

### The questions

| question | type | options |
|---|---|---|
| `intent` | Choice | show me how · do it · explain · plan an idea · find online · just talk |
| `action` | Choice | the actions registered on this page plus the global ones, each with its description, plus "none of these" |
| `target` | Choice | when an action appears on several rows: the rows on screen (which run, which dataset) |
| `machine`, `dataset`, `run`, … | Choice | your machines, the datasets on the machine, the runs on screen, plus "not said" |
| one per value the action needs | Choice | the candidates code found in the sentence, plus "not said" |
| `several` | Noul | "The sentence asks for more than one thing to be done." |
| `fits` | Noul | "One of the listed actions does what the user asked." |
| `complete` | Noul | "The request says everything needed to do it." |

For the sentence above, the request has this shape (field names as in TypeSafe's docs):

```json
{"model": "jev-1.14.0",
 "state": {"sentence": "re-run this with batch size 4 on the 5090",
           "page": "run nano-640-distill, failed: CUDA out of memory", "selected_machine": "RTX A4000"},
 "questions": {
   "action":   {"type": "choice", "instructions": "Which action does the user ask for?",
                "criteria": {"run.clone_edit": "Copy this run's recipe into New experiment, change it, run it again",
                             "run.requeue": "Run this exact run again, unchanged",
                             "run.cancel": "Stop this run", "none": "None of these"}},
   "machine":  {"type": "choice", "instructions": "Which machine should it run on?",
                "criteria": {"m-5090": "RTX 5090", "m-a4000": "RTX A4000", "not_said": "Not said"}},
   "batch":    {"type": "choice", "instructions": "Which batch size does the user ask for?",
                "criteria": {"4": "4", "5090": "5090", "not_said": "Not said"}},
   "complete": {"type": "noul", "instructions": "The request says everything needed to do it."}}}
```

**Rules for good answers**, from TypeSafe's notes on Jev's weak spots:
- **Parse, then choose.** Code finds the candidate values; System 1 only chooses among them.
- **Keep the state lean**: only what's on screen. No logs or long lists, since unrelated text costs accuracy.
- **Check the order.** The `action` question is asked twice in the same request, with the options in opposite
  orders; it adds little, since questions are answered in parallel. The fast path needs both answers to agree.
- **One pinned version.** Thresholds are tuned for one version; a new version reruns the evals before it's switched
  on.

## The action registry: how the agent clicks

The agent never clicks pixels or reads the DOM. Every interactive part of the web app registers what it does and
where it is:

- **Actions** (hub, typed): an id, a description (what System 1 reads), parameters with their options where they
  can be listed, a tier, the hub API it calls, and how it's undone.
- **Targets** (web app): the button, field, card or row that shows an action, registered with a hook like the
  `useYetiPage` hook pages use today.

When the agent acts, ModelLab scrolls the target into view, highlights it, fills in its fields, and calls the same
API the button calls. You see it happen where you would have done it yourself. The hub re-checks every action
exactly as if you had clicked, so an agent can't do anything you couldn't.

One registry serves three front ends: ⌘K (whose Actions group gains every registered action), Yeti (System 1's
options and Claude's tools) and the MCP server (write tools for Claude apps). A new page or button registers its
actions as part of being built, the way pages register Yeti's page context today.

The first actions, from today's API:

| action | tier | what it calls |
|---|---|---|
| open a page, run, search or machine | look | the router |
| show where something is | look | the highlight |
| compare results | look | Compare |
| fill in a form (New experiment, Find best model, Add dataset) | draft | the form |
| clone a run with changes | draft | Clone & edit (`/?clone=<id>`) |
| queue a run | act | `POST /api/runs` |
| re-queue or cancel a run | act | `POST /api/runs/{id}/requeue`, `…/cancel` |
| start a search | act, or careful above your agent GPU-hour limit | `POST /api/searches` |
| cancel a search | act | `POST /api/searches/{id}/cancel` |
| export a model | act | `POST /api/runs/{id}/export` |
| add, import or re-check a dataset; fetch weights; run the self-check | act | `POST /api/machines/{id}/commands` |
| delete a run (and its files on the machine), delete a search | careful | `DELETE /api/runs/{id}`, `DELETE /api/searches/{id}` |
| remove a dataset from a machine's list | careful | `POST /api/machines/{id}/commands` |

Later, the import paths and the architecture editor's edits (swap, insert or remove a block) are registered the same
way, so the agent can drive them too.

## Approval tiers

| tier | what it does | approval | examples |
|---|---|---|---|
| **look** | changes nothing | never asks | open pages, highlight, compare, explain |
| **draft** | prepares a change; nothing runs | you press the real button | fill in a form, clone & edit, draft a recipe or a search, prepare a fix |
| **act** | runs something reversible, inside its budget | one tap in the chat, or a standing permission you grant | queue, re-queue, cancel, start a search, add or re-check a dataset, export |
| **careful** | can't be undone, costs a lot, or brings in something from outside | always asks, with a summary of what and how much; never a standing permission | delete files, downloads from the internet, anything above your agent GPU-hour limit, third-party code (in the sandbox) |
| **never** | things only you do, by hand | not in the registry | users, pairing and removing machines, releases and signing, keys, a shell on a PC |

- **System 1 alone never goes past draft without your tap.** A fast wrong guess costs a highlight, not a run.
- **Only you give instructions.** Actions come from your words or your approval. Run names, logs, dataset cards and
  web pages are data: text in them can't trigger an action, whichever system reads it.
- **An agent GPU-hour limit** (set in Yeti's settings) caps what one approval can start; anything above it is
  careful.
- **Standing permissions** are narrow ("retry my search trials that ran out of memory, with the fix"), apply only to
  failures that code matched exactly (never to a guess), are listed in Yeti's settings, can be revoked, and are off
  by default.
- **Careful actions from Claude apps** wait for approval in ModelLab itself, because a Claude app may be set to allow
  tools without asking.
- **Undo** is offered where the action has one: a queued run can be cancelled, a removed dataset added back.

## What Yeti does

### Guide: show me

"How do I add a dataset?" → Machines → the machine → **Add dataset** → **Browse**. Yeti highlights each component
in turn, with a short caption, and waits for you to click it. Claude's answers can carry "show me" links that do the
same.

How it looks, following [DESIGN.md](../modellab/web/DESIGN.md): a ring in the accent colour with a soft lift
shadow eases in and holds still, with no sparkles; the mascot turns to look at it; with reduced motion, only the
ring. The caption is announced to screen readers. On a phone, one step at a time.

### Act: one sentence

- "Re-run this with batch size 4 on the 5090": Clone & edit opens with batch 4 and the RTX 5090 filled in and
  highlighted. "Queue it?"
- "Cancel everything queued on the A4000": the queued runs are listed. One tap.
- "Compare the two best Nano runs": Compare opens with both.
- "Export the winner": the export button on the recommendation is highlighted. One tap.

### Fix: when something fails

Yeti watches failed and interrupted runs, failed search trials, dataset check errors, failed machine self-checks,
and failed updates and exports.

1. **Known failures, matched by code.** A catalog of failure signatures, each with its fix as a registered action:
   out of GPU memory (half the batch, and twice the gradient accumulation where the trainer supports it, so the
   effective batch stays the same); too many open files (the "received 0 items of ancdata" DataLoader crash) or too
   little shared memory; a full disk; a dataset folder that moved; a driver older than 570; a weight file that
   fails its hash check; a loss that turns NaN.
2. **Near matches, by System 1**: the error tail against the catalog, as a Choice with "none of these", when no
   signature matches exactly.
3. **New failures, by Claude**: it reads the logs with today's tools, explains what happened, and proposes a fix as
   an action or a recipe change.

The fix shows where the failure does (on the run, the machine or the dataset) as a card with its component
highlighted; one tap applies it. Whether the retry worked is recorded next to the catalog entry, which we curate by
hand.

**In loops.** Today a failed trial drops out of its round. With a standing permission, a search applies a known fix
and retries the trial once, inside its GPU-hour cap. The trial and the search's explanation say what changed, since
a trial with a different batch size isn't identical to its siblings.

### Collaborate: ideas in your own words

"I think distilling DINOv3 into the Nano could beat the Small at the same speed."

1. Claude turns the idea into a plan: the question, what runs where (a search or an experiment), the estimated GPU
   hours (from past runs of similar models), and which result would answer the question.
2. The plan appears in the real forms (Find best model, New experiment) with the fields it filled highlighted. You
   change anything you like.
3. You approve. It runs as ordinary runs; Yeti watches, fixes what it can, and explains the outcome against the
   question.
4. The idea, its runs and the answer stay together as an entry in the lab's
   [notebook](PLATFORM.md#the-notebook): the first step toward the research loops in
   [PLATFORM.md](PLATFORM.md#loops).

Before it plans, Claude reads the notebook's earlier entries on the same dataset and models, so it can say "we
tried that, and here is what happened" instead of running it again.

### Find: datasets, models and papers online

"Find a forklift detection dataset." "Find a ViT-S backbone pretrained on aerial images."

1. Claude searches the Hugging Face Hub first (models and datasets, through the Hub's search API), and the web
   (Claude's web search tool) for papers and released weights.
2. Candidates come back with their licence, gating, size, format, task, downloads and last update. On long lists,
   System 1 scores relevance to trim them quickly.
3. You pick one. It's imported through the harness's import paths ([PHASE2_PLAN.md](PHASE2_PLAN.md#model-library)):
   pinned to a revision, safetensors preferred, the mapping step for datasets, then conversion, splits, fingerprint
   and the dataset check. Files download to the machine you choose, never to the hub.
4. It shows up in the dataset picker or the model library, ready to use.

Downloads are careful actions, shown with their size and licence first. Licences are shown as written and never
judged by System 1. Third-party code runs only in the sandbox, and the Hugging Face token stays a hub secret the
agent never sees. All of this needs the Foundations, the model library and data import from
[PHASE2_PLAN.md](PHASE2_PLAN.md), so it comes last.

## Speed and cost

- **Fast path:** from your sentence to a highlighted, filled-in component in under 0.7 s at the median and 1.5 s at
  the 95th percentile. TypeSafe quotes 70 to 500 ms; the rest is the hub and the browser.
- **Claude path:** as today, streamed with progress notes.
- **Cost:** a System 1 request of about 3,000 tokens costs about $0.0001. Claude stays billed to your Claude account,
  as today.

## Evals: trust is earned per action

- **A golden set** (`modellab/hub/system1/evals/golden.py`, 405 cases today): each a sentence on a recorded screen
  with the decision a correct System 1 makes (action, values, whether to act or hand over). The expected decision
  is written with the case, never taken from a model. It covers every page; paraphrases and typos; numbers with
  distractors ("batch size 4 on the 5090"); negation ("not the 5090"); indirection ("the run before this one");
  relative values ("halve the batch"); requests for several actions; requests no action covers; hostile text
  inside run names and logs.
- **Measured:** action and decision accuracy; the **fast path**'s coverage and precision; **confident mistakes**,
  fast paths that were wrong or should have been handed over, which is the number that matters; how many of those
  would run something; calibration; sensitivity to option order; latency (median and 95th percentile, through
  OpenRouter); cost.
- **Side by side:** every decision model OpenRouter serves, Claude Haiku 5.5 answering the same questions through
  structured outputs, and Claude Sonnet 5.5 as the reference. Each model is scored against the golden set and
  against the reference's decisions.
- **The gate:** System 1 decides an action kind on the fast path only where its fast path is right at least 98 % of
  the time for look and draft actions, and 99.5 % for act actions (which still ask). Below that, Claude decides.
  A gate is chosen on half of the cases and checked on the other half.
- **When:** the eval needs an OpenRouter key, so it runs on demand: before an action kind is switched on, before a
  model version changes, and after big changes to the registry. The router itself is tested in the normal test
  suite with recorded answers (`tests/hub/test_system1.py`).

```
OPENROUTER_API_KEY=... python -m modellab.hub.system1.evals.run --out runs/system1-eval --sequential 60
python -m modellab.hub.system1.evals.score runs/system1-eval
```

**Results so far** ([SYSTEM1_EVAL.md](SYSTEM1_EVAL.md)), after two runs: of the 25 decision models that could be
scored, `perplexity/pplx-decider-v1.2` (95 % of decisions right, 0.3 s), `liquid/d1-ultra` (96 %, 0.2 s) and
`nace-ai/drex-max-finance` (97 %, 0.5 s) come within reach of the gate for look and draft actions; on held-out
cases their fast paths are 96 to 98 % right, just under it. Jev makes the right decision 92 % of the time, so it
is not the choice. Claude Sonnet is right 98 % of the time and takes 1.5 s. No model clears the gate for act
actions.

### What the runs taught the router

Decision models read a single request well and are poor at knowing when not to act. Code closes most of that gap,
for every model alike (`modellab/hub/system1/route.py`):

- **A value that already holds is no change.** Asked "which machine?", models pick the machine the run is already
  on when the sentence names none. The router drops any value equal to the current one.
- **One number, one setting.** When two settings claim the same number, the surer one keeps it.
- **A setting named without a value is for Claude.** "Halve the batch size" names the batch size and gives no
  number to pick, so it is handed over.
- **The model's own doubt counts.** Its answers to "one listed action does what the user asked" and "the sentence
  asks for more than one thing" are part of the gate: they catch most requests for several actions.
- **The state stays lean.** The selected machine was in the state and no question needed it; models took it for
  the machine the user meant. It is left out.

## One interface, any model

System 1 is an interface, `decide(state, questions) → answers` (`modellab/hub/system1/providers.py`), with two
adapters, both through OpenRouter:

- **Decision models** (Jev and the others), through the Decisions API: a probability for every option.
- **Chat models** (Claude and the others), through chat completions with structured outputs: each answer limited
  to the listed options. They give a pick without probabilities, so there is no threshold to hold them to: they
  can only be trusted by measurement, and they face the same gate.

Claude can also be asked directly with your Anthropic key (`providers.Claude`), without OpenRouter in between: the
same questions through the Messages API's structured outputs.

Changing the System 1 model is changing one id, after it has passed the evals. The interface also leaves room for
open-weight decision models on your own GPU.

**What OpenRouter adds, and what to watch:**
- One key, one balance, and every model side by side in the same evaluation.
- One more party in the path. Requests carry `provider.data_collection: "deny"` where the model allows it, so only
  providers that don't keep or train on requests are used.
- One more hop. Latency is measured through OpenRouter, from where the hub runs, never taken from a vendor's page.
- A model can be served by several providers, with different features and speeds. The provider is pinned with the
  model.

## Privacy

- **System 1 receives:** your sentence; the page; the components registered on screen (labels, ids, current
  values); the names of your machines, datasets and runs as options; the candidates found in the sentence; and,
  when it diagnoses a failure, the error tail.
- **Never:** images (although Jev can read them), annotations, weights, checkpoints, file contents or keys.
- **OpenRouter and the model's provider** both receive the request. We read their data terms before real use, ask
  for providers that don't retain requests, and the privacy page lists both next to what Claude sees.
- **Your OpenRouter key** is kept like the Claude key: encrypted with `MODELLAB_SECRET_KEY`, only the last 4
  characters shown, never sent back to the browser.

## Build order

Each step ships on its own and is useful without the next.

0. **The deciding half** (built): the action list on the hub (`modellab/hub/system1/actions.py`), the number
   parser, the questions, the OpenRouter adapters, the router, the golden set and the evaluation.
1. **Action registry** (built, except the "via Yeti" tag): the web app's buttons, form fields, rows and sidebar
   links declare which action they are (`data-yeti…`, `modellab/web/src/agent.tsx`); a ring highlights them; forms
   fill themselves in from a decision; ⌘K lists the current page's actions and presses the real button; every
   decision is logged with its sentence, confidence and outcome (`agent_log`).
2. **Guide** (System 1's half built): "where do I export this?" rings the button. Showing asks for less certainty
   than doing, since a wrong ring costs nothing. Claude walking you through several steps is not built.
3. **Act** (built for one sentence): the hub's `POST /api/assistant/decide` builds the screen from its own data,
   asks the decision model and routes the answer. Look and draft actions happen at once; act and careful actions
   show a card and wait for one tap; anything else goes to Claude. The OpenRouter key is in the assistant's
   settings. Not built: the same actions for Claude apps through MCP, standing permissions, the agent GPU-hour
   limit, and Claude standing in when there is no OpenRouter key (the sentence goes to Claude's chat instead).

**The decision model in use:** `liquid/d1-ultra`, pinned as `liquid/d1-ultra-20261015`, with the gate the
evaluation found for it: the least certain answer at 0.7 or more, and "asks for more than one thing" at 0.5 or
less (`modellab/hub/system1/service.py`). Through the hub a decision takes about a quarter of a second.

4. **Fix**: the failure catalog, fix cards on failed runs, datasets and machine checks, and self-healing search
   trials with a standing permission.
5. **Collaborate**: idea → plan → drafts in the real forms → approval → watch → explanation, with each idea kept
   together with its runs as the first notebook entries.
6. **Find**: Hugging Face and web search, candidate cards, and imports through the model library and data import,
   after their Foundations.

## Open questions

1. **Naming**: the program on each GPU PC is also called "the agent". Keep calling it the "machine agent" wherever
   both could be meant, or rename it in the web app (for example "runner")?
2. **OpenRouter for Claude too?** System 1 goes through OpenRouter. Yeti's chat stays on Anthropic's SDK with your
   Claude key; moving it is a rewrite of something that works, for one fewer key. Proposed: not now.
3. **Standing permissions**: which fixes, if any, may a search apply on its own at first? Proposed: none until the
   failure catalog has been tried on real failures, then out-of-memory retries first.
4. **Sources beyond Hugging Face**: Roboflow Universe (it needs its own key), GitHub releases, arXiv?
5. **Mascots**: should a mascot's character change how it acts (Rime asking fewer questions)? Proposed: no, only how
   it talks.

## Sources

- TypeSafe AI: [System One models](https://docs.typesafe.ai/concepts/system-one),
  [Choice questions](https://docs.typesafe.ai/primitives/choice),
  [models and limits](https://docs.typesafe.ai/models),
  [Jev's weak spots](https://docs.typesafe.ai/model-jaggedness/jev-1.13),
  [launch post](https://typesafe.ai/blog/introducing-system-one-models-and-jev).
- Independent notes: [Simon Willison on Jev](https://simonwillison.net/2026/Sep/21/jev/).
- OpenRouter: [Jev and the Decisions API](https://openrouter.ai/docs/guides/community/jev),
  [structured outputs](https://openrouter.ai/docs/guides/features/structured-outputs),
  [provider selection and data policy](https://openrouter.ai/docs/guides/routing/provider-selection).
