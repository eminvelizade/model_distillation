# ModelLab design guide

How ModelLab looks, moves and feels, and the rules that keep it that way. **Read this before adding a page,
component or chart**, and reuse what already exists (`src/ui.tsx`, `src/components/`) before writing anything new.

The feeling we want: a calm, professional ML tool with a frozen, icy softness. It's clean and minimal, with a
little wonder in the details. Think fresh snow and clear ice, not a neon dashboard.

## Principles

1. **Less is more.** Every element, colour and motion must earn its place. When unsure, leave it out.
2. **Soft, not loud.** Hairline borders, gentle shadows, rounded corners, low-contrast chrome, and colour mostly
   reserved for data and the one main action.
3. **Calm motion with meaning.** Things ease in when they appear or change, then hold still. Motion explains
   (a bar fills to its value, a selected shape blooms in). It never decorates for its own sake or loops for attention.
4. **Sparkles are rare.** Keep them for delight and success moments (see the sparkle budget below).
5. **Everything in one place.** Prefer one rich page over more navigation. Dense but breathable.
6. **Works offline.** No CDN, no remote fonts or images. Everything ships inside `dist/`.

## Colour

### Theme tokens: always use these for UI chrome

Defined as RGB triplets in `src/index.css` (light under `:root`, dark under `html.dark`) and exposed as Tailwind
colours, so opacity modifiers work (`bg-accent/10`). They switch with the theme on their own, so **no `dark:`
variants are needed for neutrals.**

| token | use | light | dark |
|---|---|---|---|
| `canvas` | page background | frost white `#f6f9fa` | frozen night `#070b0e` |
| `surface` | cards, inputs, popovers | `#ffffff` | `#0d1216` |
| `raised` | hover fills, tracks, chips, segmented background | `#eff4f6` | `#151c21` |
| `line` | borders, dividers, gridlines | `#e2e9ed` | `#1f282e` |
| `fg` | primary text | `#0f171c` | `#ecf3f6` |
| `muted` | secondary text, labels | `#54626c` | `#9baab3` |
| `subtle` | tertiary text, axis ticks, hints | `#86949e` | `#65747d` |
| `accent` | brand: links, eyebrows, active nav, tags, focus | deep glacier `#0a8296` | glacier ice `#6ee2f0` |
| `code` | terminal / YAML / dark glass surfaces | `#0d181e` | `#080d11` |

All neutrals carry a faint icy-blue tint. Don't introduce `gray-*`, `zinc-*`, `slate-*` or raw hex for chrome.
Shadows are theme-aware too: use `shadow-soft` (resting) and `shadow-lift` (hovered, floating, popovers).

### The brand: glacier ice

- The brand colour is **glacier ice**: an ice blue (hue ~188) that leans towards emerald, never teal. It lives in the
  `ice` scale in `tailwind.config.js` (`ice-50` … `ice-950`, 300 = `#6ee2f0`) plus `ice-glint` (`#95eedd`), the
  minty highlight gradients drift into. Use `ice-*`, not `teal-*` / `cyan-*`.
- Gradients run **ice blue → glint**: `from-ice-500 via-ice-300 to-ice-glint` (progress, Ring default
  `#14b2cb → #95eedd`); the brand button is `from-ice-500 to-ice-700`.
- The aurora glow behind each page (`.aurora`) and the champion card (`#06161a`, ice + glint radial glows) carry
  the mood. Don't add more glows elsewhere.
- **No purple, violet, fuchsia, pink or indigo.** Not in the UI, gradients, charts or illustrations.

### Status colours

| meaning | colour | component |
|---|---|---|
| running / live | sky blue | `StatusPill status="running"`, `LiveDot` |
| done / success / best value | emerald | `StatusPill`, `Callout tone="success"`, winning metric |
| waiting / cancelled / pending | neutral (`raised`, `muted`) | `StatusPill` |
| warning / interrupted / "not comparable" | amber | `Callout tone="warn"` |
| error / failed | rose | `Callout tone="error"` |

Brand ice is **not** a status colour. Don't use it to mean "good". Green (emerald) means success.

### Data colours

- **Compared / selected items:** `SERIES` from `components/Radar.tsx`: ice `#14b2cb`, blue `#3b82f6`,
  amber `#f59e0b`, rose `#f43f5e`, in that order. One item keeps the same colour everywhere it appears on screen
  (row stripe, chart ring, radar shape, chips).
- **Detector families:** `FAMILY` from `components/Scatter.tsx`: RF-DETR blue, LT-DETR amber.
- **Stage types** (`TYPE_STYLE` in `pages/NewExperiment.tsx`): distill glint→ice, finetune sky→blue,
  eval orange→rose, features amber.
- Add new data colours to these maps. Don't scatter hex values through pages.

## Type

- **Geist** for UI text, **Geist Mono** for numbers, IDs, code, ticks. Both are bundled via `@fontsource-variable`
  (offline). Never load fonts remotely.
- Every number a user compares is `font-mono tabular-nums`. Put units in a smaller `text-subtle` span:
  `58.7<span className="text-sm text-subtle">%</span>`.
- Sizes: page title 26px semibold (via `PageHeader`), card title 13.5px semibold, body 13–13.5px,
  meta 11–12px, micro `text-2xs` (10.5px). Hero numbers 34–56px mono.
- Copy is sentence case, short and plain. A little warmth is fine ("Cooking an experiment"), jokes aren't.

## Shape and layout

- Radii: cards `rounded-2xl`, inputs and buttons `rounded-[10px]`, chips `rounded-md`, pills `rounded-full`.
- Borders: 1px `border-line`. Never a heavy outline or a second border colour.
- Spacing: sections `space-y-6`, grids `gap-4`/`gap-5`, card padding `p-5` (built into `Card`).
- Content max width 1320px. Sidebar 248px on `lg+`, top bar with scrollable nav below that.
- **Phone width (390px) must not scroll sideways.** Wide tables scroll inside their own card
  (`overflow-x-auto`), and grid children get `min-w-0`.

## Page anatomy

```tsx
export default function MyPage() {
  return (
    <div className="space-y-6">          {/* each direct child drifts in, staggered (the .page rule in index.css) */}
      <PageHeader eyebrow="Analyze" title="My page" description="One sentence on what this is for."
        actions={<Button variant="brand">Main action</Button>} />
      <Card title="Section" description="Optional one-liner">…</Card>
      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
```

Keep sections as direct children of the page root so the entrance stagger works. Register new pages in `NAV`
(`App.tsx`) under the right group (Build / Run / Analyze); the tab title follows automatically.

## Components: reuse these (`src/ui.tsx`)

| need | use |
|---|---|
| page title block | `PageHeader` |
| container | `Card` (`title`, `description`, `actions`, `icon`, `flush` for edge-to-edge tables/lists) |
| headline number | `Stat` + `CountUp` |
| buttons | `Button`: `brand` = **the one main action per view** (ice gradient + glint); `primary` = solid confirm in dialogs; `secondary` default; `ghost` for quiet actions; `danger` for destructive. `IconButton` for icon-only (always has `title`) |
| switches | `Segmented` (2–4 options, sliding thumb), `Switch` (boolean) |
| picking from a list | `Dropdown` (button like the search box, popover list, keyboard, opens upwards near the bottom; `footer` for an action). Native `<select>` only inside dense forms |
| beta label | `Beta` (under the wordmark in the sidebar and on sign-in) |
| forms | `Field` + `inputCls`, `SearchInput`, `Tag` |
| state | `StatusPill`, `LiveDot`, `Medal`, `Callout`, `Empty` (with Labby), `Toast` |
| progress | `ProgressBar` (`active` adds the shimmer), `Ring` (gauges, progress); both fill in from zero on mount |
| overlays | `Modal` (Esc / click outside closes), `CommandPalette` |
| code / logs | `Yaml`, `LogView` + `TermTab` (always-dark `bg-code` surfaces) |
| charts | `Scatter`, `Radar` (`components/`); `useWidth` for pixel-sized SVG |
| mascot | `Mascot` (moods: happy / busy / sleepy / sad). Labby appears in empty states, the worker widget, the Queue system card, the preview footer and the hub's sign-in page only |
| hub pieces | `components/Hub.tsx`: `MachinePicker`, `MachineDot`, `CheckIcon` (ok / warn / fail), `CopyBox` (commands, one-time secrets), `ChangePassword` |

If a component is almost right, extend it with a prop rather than copying it.

## Motion

Everything is CSS (Tailwind `animate-*` in `tailwind.config.js`, helpers in `index.css`), plus `CountUp` and
`sparkleBurst` in `ui.tsx`.

**Easing:** standard `cubic-bezier(.2,.7,.2,1)`; spring `cubic-bezier(.34,1.56,.64,1)` only for small things
(points, toggles, icon tilts). **Durations:** hover/press 150–300ms; entrances 450–900ms; nothing over ~1.4s.
**Stagger:** 35–90ms per item, capped (`Math.min(i, 12)`) so long lists don't trail.

| situation | do |
|---|---|
| page sections appear | automatic (`.page` stagger) |
| something new is added (a stage, a selection, a modal) | `animate-pop` / `animate-fade` |
| a number is shown | `CountUp` |
| a bar shows a value | `origin-left animate-growx` (SVG: `svg-bottom animate-growy`), staggered |
| chart points appear | `svg-center animate-popin`, staggered |
| a line or path appears | `pathLength={1} strokeDasharray={1} className="animate-draw"` |
| a radar shape appears | `radar-in`, keyed by the item so existing shapes stay put |
| user picks / clicks a data point | `svg-center animate-ripple` once |
| hover on a card / tile | `hover:-translate-y-px hover:shadow-lift hover:border-accent/30`, nothing bigger |
| hover on a legend item | spotlight that series (dim the others to ~0.2 opacity) |
| something is live | `LiveDot`, `ProgressBar active`, `.flow-line`. Only for genuinely live state |
| theme switch | automatic cross-fade (`useTheme`) |

Rules:

- Animate on **mount or change**, then rest. The only things that loop are live status and the existing ambient
  touches (aurora drift, champion twinkles, logo bubbles, Labby's blink and float).
- Entrance animations on containers use fill mode **`backwards`, never `both`/`forwards`**. A lingering transform
  turns the element into the containing block for `position: fixed` children (toasts, the selection bar).
- Polling refreshes must not replay animations: key lists by stable ids, not indexes.
- `prefers-reduced-motion` is handled globally (durations and delays collapse). Any motion done in JS must check
  `reducedMotion()` first (`useCountUp` and `sparkleBurst` already do).

## Sparkles: the budget

The ✦ is precious. Current placements are the whole budget:

- champion card: six slow twinkles in empty space, plus a frost light that follows the cursor
- "Leader" badge on Compare: one twinkle
- empty states: three twinkles around Labby
- logo: two bubbles rising from the 🧪
- `sparkleBurst(el)`: **only after a user action succeeds** (run queued, notes or tags saved)

A new feature may add a sparkle burst to its own success moment, and nothing more. Never sparkle on page load,
on errors, on polling updates, or as decoration in tables and forms. Ambient twinkles never sit on top of text.

## Charts

- Draw in pixels: measure with `useWidth` and set `width`/`height`. **Never stretch an SVG with `viewBox`
  when it holds text** (labels would scale with the window).
- Ticks `font-mono text-[10.5px] fill-subtle`; axis titles `text-[11px] fill-muted`; gridlines `stroke-line`
  dashed `2 4`, with a solid baseline. Use `niceTicks` and make sure the domain covers every point.
- Colours from `SERIES` / `FAMILY` only. A highlighted "best" line or front uses the brand ice → glint gradient.
- Tooltips: `bg-surface/95 border border-line shadow-lift backdrop-blur rounded-xl`, keyed values in mono.
- Labels avoid each other (see the placement in `Scatter`) and never cover points.
- Every chart has a legend or a one-line description that says how to read it ("up and to the left is better").

## Accessibility

- Icon-only buttons have `title`/`aria-label` (`IconButton` requires it).
- Never encode meaning by colour alone: pair it with a label, icon or position.
- Accent text is the deeper glacier (`ice-700`) in light mode for contrast. Don't use the light ice (`ice-300`) for text on white.
- Decorative sparkles and bubbles get `aria-hidden`.

## Don't

- Purple, pink or indigo anywhere; neon glows; heavy drop shadows; thick borders.
- New one-off greys or hex colours for chrome (use the tokens).
- More than one `brand` button per view.
- Emoji as UI icons (use `lucide-react`). The 🧪 logo is the one exception.
- Remote assets: fonts, images, CDNs.
- Motion that loops for attention, delays content, bounces large surfaces, or runs longer than ~1.4s.

## Before you ship a UI change

1. `cd modellab/web && npm run dev` (with `python app.py` running) and look at it in **light and dark**,
   at desktop width and at **390px**.
2. Try it with reduced motion (DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion"): everything must still
   appear and be usable.
3. Check that there's no horizontal page scroll, no console errors, and no text covered by a sparkle, label or tooltip.
4. `npm run build`. The type check must pass, and commit the updated `dist/` (the app serves it, no Node at runtime).

## Where things live

| file | what |
|---|---|
| `src/index.css` | theme tokens, shadows, aurora, page stagger, SVG motion helpers, sparkle burst, reduced-motion rule |
| `tailwind.config.js` | token → Tailwind colour mapping, fonts, keyframes and `animate-*` names |
| `src/ui.tsx` | shared components and hooks (`useCountUp`, `CountUp`, `sparkleBurst`, `useTheme`, `useWidth`, …) |
| `src/components/` | `Scatter`, `Radar` (+ `SERIES`), `CommandPalette` |
| `src/App.tsx` | shell: sidebar, machine picker, worker / machine widget, account, logo, page wrapper, tab titles |
| `src/nav.ts` | pages in the sidebar and ⌘K (`hub` / `admin` flags hide them on the local app) |
| `src/session.tsx` | mode (local app or hub), signed-in user, the user's machines and the selected one |
