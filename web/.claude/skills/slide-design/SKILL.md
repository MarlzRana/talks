---
name: slide-design
description: Use when creating, modifying, or styling slides in this presentation app. Covers layout patterns (timelines, two-column flows, spatial), shared components (TimelineSlide, AgentFlowLayout, context-window blocks), animation techniques, accent theming, and the ink/paper design system.
---

# Drafting Paper Slide Design

Use this system when creating or designing slides and talks. All slides use a warm drafting-paper aesthetic with dot-grid backgrounds and grid-aligned wireframe borders.

## Layout architecture

Three layers:

1. **`.slide`** (DeckPlayer) = `display: flex; align-items: center; justify-content: center` + paper background
2. **`.frame`** (DeckPlayer) = the outer wireframe border + CSS grid inside, centered by flex parent. Sized `calc(100% - 160px)` with `grid-template: repeat(auto-fill, minmax(80px, 1fr))`
3. **Template zones** = grid items inside `.frame`, wrapped in `<Wireframe>`, using flexbox internally

The `.frame` div is automatically rendered by DeckPlayer when a slide has `paper` set. It provides the outer wireframe border (0.5px solid) with plus marks at corners.

## Grid system

The `.frame` is a CSS grid with tracks of `minmax(80px, 1fr)` — minimum 80px, expanding to fill the frame evenly. Templates span the full frame grid with `subgrid`:

```css
.slide {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}
```

Content zones are placed as grid items with `grid-column` / `grid-row`, then use flexbox internally.

## Wireframe system

Wireframes are thin solid borders (0.5px) that form the boundary of a component's grid area.

**Outer frame**: The `.frame` element's border. Always present on paper slides. Plus marks at the 4 corners. Rendered automatically by DeckPlayer.

**Component wireframes**: Use `<Wireframe>` from `@/components/paper` to wrap content zones. It renders a thin solid border + plus marks at corners. Set grid placement via `className`.

```tsx
import { Wireframe } from '@/components/paper';
import styles from './MySlide.module.css';

<Wireframe className={styles.titleZone}>
  <h2>Title here</h2>
</Wireframe>;
```

```css
.titleZone {
  grid-column: 1 / -1;
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
  padding: 0 var(--space-4);
}
```

**Props**: `label?` (mono uppercase tag), `accent?` (tints the border), `className?`, `children`.

**AccentColor values**: `'violet' | 'ochre' | 'forest' | 'ink-blue' | 'cyan' | 'crimson' | 'rust'`

**When to wireframe**: Every distinct content zone (title, body, code block, visual panel, columns container). Do NOT wireframe: individual text elements, inline components, or the slide itself.

## Paper backgrounds

Set `paper` on `TalkConfig` for the talk-wide default. Override per-slide via `export const paper = '...'`.

| Variant           | Background                              | Text color        | Grid dots  |
| ----------------- | --------------------------------------- | ----------------- | ---------- |
| `paper` (default) | Warm vellum `--paper` (#F1EDE3)         | `--ink-1`         | Dark dots  |
| `paper-dark`      | Near-black `--paper-black` (#1A1815)    | `--ink-on-dark-1` | Cream dots |
| `paper-blueprint` | Deep blue `--paper-blueprint` (#0E3A5F) | `--ink-on-dark-1` | Cream dots |

Custom papers: set any string as the paper value and define `[data-paper="my-name"]` in the talk's CSS.

## Full-bleed slides

A slide can opt out of the inset frame and fill the entire viewport by exporting `fullbleed`:

```tsx
export const fullbleed = true;
```

The slide still gets the paper background but skips the `.frame` wrapper (no wireframe border, no grid). Use for hero visuals, full-screen images, 3D scenes, or timeline layouts that need edge-to-edge rendering.

## Standard grid zones

Grid zones are relative to the `.frame` grid (not the slide). `1 / -1` spans the full frame.

| Zone             | Grid placement                           | Purpose                                     |
| ---------------- | ---------------------------------------- | ------------------------------------------- |
| Title            | `grid-column: 1 / -1; grid-row: 1 / 2`   | Title bar, 1 cell (~80px) tall              |
| Body             | `grid-column: 1 / -1; grid-row: 2 / -1`  | Main content below title                    |
| Full content     | `grid-column: 1 / -1; grid-row: 1 / -1`  | Spans entire frame                          |
| Title (centered) | `grid-column: 2 / -2; grid-row: 2 / -2`  | Title slides, inset 1 cell from frame edges |
| Caption row      | `grid-column: 1 / -1; grid-row: -2 / -1` | Bottom row for captions                     |

Use negative grid lines (`-1`, `-2`) to adapt to any viewport size.

## Typography hierarchy

1. **Eyebrow** — `var(--font-mono)`, 11-13px, uppercase, `letter-spacing: 0.14em`, color `--ink-3` or accent
2. **Display title** — `var(--font-display)`, weight 700-800, `clamp(2.5rem, 6vw, 5rem)`, `letter-spacing: -0.03em`
3. **Section title** — `var(--font-display)`, weight 700, `clamp(1.4rem, 2.5vw, 2rem)`, `letter-spacing: -0.03em`
4. **Body** — `var(--font-text)`, weight 400, 16-20px, `line-height: 1.55`
5. **Card title** — `var(--font-display)`, weight 700, `clamp(0.8rem, 1.8vw, 1.5rem)`, `letter-spacing: -0.02em`
6. **Label/metadata** — `var(--font-mono)`, 10-11px, uppercase, `letter-spacing: 0.14em`
7. **Code** — `var(--font-mono)`, 10-13px, `line-height: 1.5`

Font families: `--font-display` (SF Pro Display), `--font-text` (SF Pro Text), `--font-mono` (SF Mono).

## Accent colors

Use **one accent per composition**. Pick from:

| Token                  | Hex     | Use for                    |
| ---------------------- | ------- | -------------------------- |
| `--accent-violet`      | #8B4A9E | Primary/hero concept       |
| `--accent-violet-deep` | #5B2A6E | Emphasis on violet hero    |
| `--accent-ochre`       | #C08A3E | Warmth, history, timelines |
| `--accent-forest`      | #3E6B4A | Success, "after" state     |
| `--accent-ink-blue`    | #2E4A7A | Links, info (muted)        |
| `--accent-cyan`        | #4AADE8 | Bright interface, tech     |
| `--accent-crimson`     | #9A3333 | Error, "before" state      |
| `--accent-rust`        | #B05A3C | Correction, numbers        |

Only exception: before/after pairs may use crimson + forest together.

## Ink colors

| Token             | Use                                       |
| ----------------- | ----------------------------------------- |
| `--ink-1`         | Primary text                              |
| `--ink-2`         | Secondary text                            |
| `--ink-3`         | Tertiary/labels                           |
| `--ink-4`         | Hairlines, wireframe borders              |
| `--ink-line`      | Draftsman's line, strong borders          |
| `--ink-on-dark-1` | Primary text on dark/blueprint surfaces   |
| `--ink-on-dark-2` | Secondary text on dark/blueprint surfaces |
| `--ink-on-dark-3` | Tertiary text on dark/blueprint surfaces  |

## Slide layout patterns

### Timeline slides

Use the shared `TimelineSlide` + `TimelineCard` components from `talks/under-hood-coding-agent/components/`.

```tsx
import { TimelineSlide, TimelineCard } from '../components'
```

**TimelineSlide** provides:
- Outer Wireframe with accent-colored border
- Title box with full-width extending rails + grey corner marks
- Accent-colored timeline line at 55% vertical
- Bidirectional pulse animation (glowing dot travels along timeline)
- Absolutely-positioned items alternating top/bottom
- Connectors with T-bar junction where they meet the timeline
- scaleY connector animation (draws from card to timeline)

**Props:**
```tsx
interface TimelineSlideProps<T extends TimelineItemBase> {
  title: string
  accent: string                    // CSS value: 'var(--accent-ochre)'
  wireframeAccent?: AccentColor     // Wireframe border tint
  items: T[]
  activeSubstep: number
  renderCard: (item: T, index: number) => ReactNode
  getItemOpacity: (index: number, activeSubstep: number) => number
  connectorThreshold?: number       // Min opacity to show connector (default 0)
}
```

**TimelineCard** provides:
- Frosted glass card (`rgba(255,255,255,0.03)` + `backdrop-filter: blur(8px)`)
- Accent-colored border via `var(--timeline-accent)`
- Grey corner plus marks
- Optional highlight state (full accent border + glow)

**Positioning pattern** — use proportional time-based placement:
```tsx
const TOTAL_MONTHS = 51
const RANGE_START = 8  // left boundary %
const RANGE = 84       // usable width %
const pos = (months: number) => RANGE_START + (months / TOTAL_MONTHS) * RANGE
```

### Two-column agent flow slides

Use `AgentFlowLayout` for slides that show agent runtime (left) alongside context window (right).

```tsx
<AgentFlowLayout eyebrow="PTC Flow" title="With PTC" accent="forest" bottom={<BottomCards />}>
  <AgentFlowLayout.Runtime>{/* FlowSteps + FlowConnectors */}</AgentFlowLayout.Runtime>
  <AgentFlowLayout.Context>{/* Context blocks */}</AgentFlowLayout.Context>
</AgentFlowLayout>
```

**Accent handling:** Sets `--slide-accent` CSS variable on container, cascading to all children.

### Scattered/spatial layouts

For non-linear content (e.g., memory fragments), use absolute positioning with percentage coordinates:
```css
.fragment {
  position: absolute;
  left: 28%;
  top: 78%;
}
```

Animate state changes (highlight, prune, merge) with motion opacity/color transitions.

## Animation patterns

### Standard transitions
- **Item reveal:** `opacity: 0 → 1`, duration 0.35-0.55s, easeOut
- **Entry with motion:** `opacity: 0, y: 8-20` → `opacity: 1, y: 0`
- **Connector draw:** `scaleY: 0 → 1` with appropriate `transformOrigin`
- **Highlight glow:** `box-shadow` transition with accent color at 30% opacity

### Timeline pulse
Glowing accent-colored dot (10px, `border-radius: 50%`) that travels between positions:
```tsx
initial={{ left: `${from}%`, opacity: 0 }}
animate={{ left: `${to}%`, opacity: [0, 1, 0] }}
transition={{ left: { duration: 0.7 }, opacity: { duration: 1.0, times: [0, 0.3, 1] } }}
```

### Staggered reveals
Use `delay` prop on motion elements for cascading entrance:
- Context blocks: 0.1-0.2s stagger
- Benefits cards: 0.4-0.5s delay after main content
- Operation labels: 0.4s delay between transitions

### Dimming patterns
- **Progressive focus** (Slide 2): Current item at 1, others at 0.15
- **Final highlight** (Slide 5): Last item at 1, earlier items at 0.35
- Connector visibility tied to opacity via `connectorThreshold`

## Context window blocks

Shared components in `components/context-window/` for rendering agent context entries:

| Component              | Label Color      | Purpose                       |
| ---------------------- | ---------------- | ----------------------------- |
| `UserBlock`            | grey             | User message                  |
| `ThinkingBlockContext` | grey (dashed)    | Model reasoning               |
| `ModelBlock`           | grey             | Model response                |
| `WriteBlock`           | violet           | Write tool call + code        |
| `BashBlock`            | yellow (#e5c07b) | Bash command + response       |
| `McpBlock`             | cyan             | MCP tool call + response      |
| `ContextBar`           | slide-accent     | Context usage progress bar    |

All blocks support:
- `visible` prop (AnimatePresence mount/unmount)
- Response reveal animation (height 0→auto + opacity)
- `explainer` prop for uppercase grey description above label

## Frosted glass cards

Used on timeline cards and other elevated surfaces:
```css
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
border: 0.5px solid color-mix(in srgb, var(--accent) 40%, transparent);
```

## Color mixing technique

Use CSS `color-mix()` for tinted overlays, borders, and backgrounds:
```css
/* 40% accent for borders */
border-color: color-mix(in srgb, var(--accent-cyan) 40%, transparent);

/* 5% accent for subtle backgrounds */
background: color-mix(in srgb, var(--accent-violet) 5%, transparent);

/* 50% accent for timeline lines */
border-top: 0.5px solid color-mix(in srgb, var(--timeline-accent) 50%, transparent);
```

## Corner plus marks

Decorative cross marks at element corners (used on cards, wireframes, title boxes):
```css
.mark {
  position: absolute;
  width: 16px;
  height: 16px;
  pointer-events: none;
}
.mark::before {  /* vertical bar */
  left: 50%; top: 0; width: 0; height: 100%;
  border-left: 0.5px solid var(--ink-4);
}
.mark::after {   /* horizontal bar */
  top: 50%; left: 0; width: 100%; height: 0;
  border-top: 0.5px solid var(--ink-4);
}
.mark[data-pos='tl'] { top: -8px; left: -8px; }
.mark[data-pos='tr'] { top: -8px; right: -8px; }
.mark[data-pos='bl'] { bottom: -8px; left: -8px; }
.mark[data-pos='br'] { bottom: -8px; right: -8px; }
```

Corner marks are always grey (`--ink-4`) regardless of the element's accent color.

## Code slides

Use `--code-bg` (#EAE4D4) for code block backgrounds. Syntax tokens: `--code-keyword`, `--code-string`, `--code-fn`, `--code-type`, `--code-number`, `--code-comment`, `--code-punct`.

For Shiki, prefer a light theme on `paper` surfaces and `github-dark` on dark surfaces.

## Borders and spacing

| Token             | Value       | Use                             |
| ----------------- | ----------- | ------------------------------- |
| `--border-hair`   | 0.5px solid | Wireframe lines, hairline rules |
| `--border-thin`   | 1px solid   | Cards, inputs                   |
| `--border-dashed` | 1px dashed  | Draft states, placeholders      |

**Hairline rendering**: Always draw 0.5px lines with `border` (e.g. `border-top: 0.5px solid var(--ink-4)`), never with `background` + explicit width/height. On non-Retina (1x) displays, `background` and `border` round 0.5px differently — when they overlap at intersections (e.g. a plus mark crossing a wireframe border), the mismatch creates visible thickness inconsistencies. Using `border` everywhere ensures all lines render through the same path.

Use `--space-1` (4px) through `--space-10` (128px).

## Interactive features

- **Thinking toggle:** Brain icon (top-right), persists to localStorage key `showThinking`. Hides ThinkingBlockContext blocks + FlowConnectors on agent flow slides.
- **Finder overlay:** Clickable Finder icon shows an interactive file explorer. Files appear progressively based on substep. Uses Shiki for syntax highlighting.
- **Expandable blocks:** System reminder blocks with click-to-expand/collapse behavior.

## Anti-patterns

- No emoji
- No gradients on backgrounds
- No scrollbars — scrollbars are globally hidden via CSS
- No drop shadows with blur >20px
- No multiple accent colors in one composition (exception: crimson + forest for before/after)
- Sharp corners by default. Use radius only with reason
- No filled icons — use line icons with `currentColor`
- No body text under 14px (under 28px on slides)
- Paper surfaces must always show their dot grid
- Do not put wireframe borders inside components — wireframes wrap components at the grid level
- Do not use `opacity > 0` checks without considering the `connectorThreshold` pattern
- Avoid hardcoded colors — always use CSS custom properties or `color-mix()`
