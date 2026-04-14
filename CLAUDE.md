# Talks — Project Reference

Vite + React 19 presentation app. Talk picker grid at `/talks`, slide deck player at `/talks/:slug`.

## Commands

```bash
pnpm dev        # Dev server (Vite, sub-second HMR)
pnpm build      # Production build -> dist/
pnpm preview    # Preview production build
```

## Architecture

- **Vite SPA** — no SSR. Client-side routing via react-router-dom v7
- **Routes**: `/` redirects to `/talks` (TalkPicker), `/talks/:slug` (TalkPlayer)
- **Talks**: each in `talks/<slug>/` with `index.ts`, `slides.tsx`, `slides/`, `components/`
- **Registry**: `src/lib/talks.ts` — explicit imports, sorted array. One import line per talk
- **Styling**: CSS Modules (`.module.css` per component), `globals.css` custom properties, `data-theme` attribute for per-deck theming
- **Transitions**: Motion `AnimatePresence` with `custom={direction}` for directional slide animations
- **Presenter mode**: `P` key or `?presenter=true`, bidirectional BroadcastChannel sync between tabs

## Folder Structure

```
src/
  main.tsx                          # React root, BrowserRouter, route definitions
  vite-env.d.ts                     # Vite client types (CSS modules)
  types/index.ts                    # TalkConfig, SlideModule, SlideTransition
  styles/globals.css                # Custom properties, reset, base typography
  routes/
    TalkPicker.tsx + .module.css    # Talk card grid
    TalkPlayer.tsx + .module.css    # Slide deck player shell
  components/
    picker/
      TalkCard.tsx + .module.css    # Card in picker grid
      TagBadge.tsx + .module.css    # Colored tag pill
    player/
      DeckPlayer.tsx + .module.css  # AnimatePresence wrapper, renders active slide
      SlideProgress.tsx + .module.css
      SlideControls.tsx + .module.css
      PresenterView.tsx + .module.css
    slides/                         # Reusable slide layout templates
      TitleSlide.tsx + .module.css
      ContentSlide.tsx + .module.css
      SplitSlide.tsx + .module.css
      FullscreenSlide.tsx + .module.css
      CodeSlide.tsx + .module.css
      ScrollySlide.tsx + .module.css
  lib/
    talks.ts                        # Talk registry
    useDeck.ts                      # Slide index state, direction, localStorage resume
    useKeyNav.ts                    # Keyboard shortcuts
    useFullscreen.ts                # Fullscreen API wrapper
    useSwipe.ts                     # @use-gesture swipe navigation
    useBroadcast.ts                 # BroadcastChannel sync
    usePresenter.ts                 # Presenter mode state

talks/
  demo/                             # Capability demo (12 slides)
    index.ts                        # TalkConfig
    slides.tsx                      # Barrel: namespace imports, ordered array
    slides/01-title.tsx ... 12-custom-transition.tsx
    components/SampleChart.tsx, SampleDiagram.tsx, SampleScene3D.tsx
```

## Types

```ts
// src/types/index.ts
import type { TargetAndTransition, Easing } from 'motion/react'

interface SlideTransition {
  enter: TargetAndTransition
  center: TargetAndTransition
  exit: TargetAndTransition
  config?: { duration?: number; ease?: Easing }  // Easing, not string
}

interface SlideModule {
  default: SlideComponent       // The React component
  transition?: SlideTransition  // Optional per-slide override
  notes?: string                // Optional speaker notes
}

interface TalkConfig {
  slug: string          // URL param, matches folder name
  title: string
  description: string
  author?: string
  date?: string         // ISO date
  tags?: string[]
  theme?: Theme         // 'light' | 'dark', defaults to 'dark'
  slides: SlideModule[]
  coverImage?: string
}
```

## Adding a New Talk

1. Create `talks/my-talk/`
2. Create `talks/my-talk/slides/01-title.tsx`, `02-...tsx`, etc.
3. Create `talks/my-talk/slides.tsx`:
   ```tsx
   import type { SlideModule } from '@/types'
   import * as TitleSlide from './slides/01-title'
   import * as SecondSlide from './slides/02-content'
   export const slides: SlideModule[] = [TitleSlide, SecondSlide]
   ```
4. Create `talks/my-talk/index.ts`:
   ```ts
   import type { TalkConfig } from '@/types'
   import { slides } from './slides'
   const myTalk: TalkConfig = { slug: 'my-talk', title: '...', description: '...', slides }
   export default myTalk
   ```
5. Register in `src/lib/talks.ts`:
   ```ts
   import myTalk from '@talks/my-talk'
   export const talks = [demo, myTalk].sort((a, b) => a.title.localeCompare(b.title))
   ```

**Key**: `slides.tsx` uses **namespace imports** (`import * as X from ...`) to capture `{ default, transition?, notes? }` matching `SlideModule`.

## Slide Templates

### TitleSlide
```tsx
<TitleSlide title="My Talk" subtitle="Optional subtitle" author="Name" />
```

### ContentSlide
```tsx
<ContentSlide title="Heading">
  <p>Body content as children.</p>
</ContentSlide>
```

### SplitSlide (compound component)
```tsx
<SplitSlide title="Heading" ratio="40/60">
  <SplitSlide.Text><p>Left column text.</p></SplitSlide.Text>
  <SplitSlide.Visual><MyChart /></SplitSlide.Visual>
</SplitSlide>
```
Implemented via `Object.assign(SplitSlideBase, { Text, Visual })`. Ratios: `'40/60'`, `'50/50'`, `'60/40'`.

### FullscreenSlide
```tsx
<FullscreenSlide caption="Optional caption">
  <MyFullBleedVisual />
</FullscreenSlide>
```

### CodeSlide (Shiki, async)
```tsx
<CodeSlide title="Heading" language="python" code={myCode} filename="file.py" />
```
Uses `codeToHtml()` from `shiki` in a `useEffect` + `useState` pattern with a `mounted` guard. Default theme: `github-dark`.

### ScrollySlide (Motion useInView)
```tsx
<ScrollySlide
  steps={[{ label: 'Step 1', body: 'Description...' }, ...]}
  visual={(activeStep) => <MyDiagram step={activeStep} />}
/>
```
Left column scrolls, right column is sticky. Active step tracked via `useInView` from `motion/react`.

## Per-Slide Overrides

Any slide can export optional named exports alongside its default component:

```tsx
export default function MySlide() { return <ContentSlide title="...">...</ContentSlide> }

// Optional: custom transition (scale+fade instead of default horizontal slide)
export const transition: SlideTransition = {
  enter: { opacity: 0, scale: 0.96 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.04 },
  config: { duration: 0.5, ease: 'easeOut' },
}

// Optional: speaker notes for presenter mode
export const notes = `Key points to mention during this slide.`
```

## Library Patterns

### KaTeX — use `String.raw`
`katex.renderToString()` is synchronous. **Always use `String.raw` template literals** for LaTeX strings — JSX string attributes double-escape backslashes.

```tsx
// CORRECT
<MathBlock tex={String.raw`\frac{QK^T}{\sqrt{d_k}}`} />

// WRONG — backslashes get double-escaped, KaTeX sees \\frac instead of \frac
<MathBlock tex="\\frac{QK^T}{\\sqrt{d_k}}" />
```

### Shiki — async with mounted guard
```tsx
useEffect(() => {
  let mounted = true
  codeToHtml(code, { lang, theme }).then(result => { if (mounted) setHtml(result) })
  return () => { mounted = false }
}, [code, lang, theme])
```

### D3 — computation only
D3 computes scales and layouts. React renders SVG elements. Motion animates.

### React Three Fiber — lazy-loaded
3D slides use `React.lazy()` + `Suspense`. The component file imports R3F/drei at top level. Vite code-splits Three.js into a separate chunk.
```tsx
const Scene3D = lazy(() => import('../components/MyScene3D'))
export default function My3DSlide() {
  return <FullscreenSlide><Suspense fallback={...}><Scene3D /></Suspense></FullscreenSlide>
}
```

### Motion — directional transitions
Default variants are functions that receive `direction` (1 or -1) via the `custom` prop:
```tsx
const variants = {
  enter: (dir: number) => ({ x: dir * 300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -300, opacity: 0 }),
}
```

## Hooks

| Hook | Purpose |
|------|---------|
| `useDeck(slug, total)` | `[index, direction]` state, `next()`, `prev()`, `goTo(n)`. localStorage resume. `goTo` uses `indexRef` for stable identity |
| `useKeyNav(opts)` | ArrowRight/Space = next, ArrowLeft = prev, Escape = back to picker, F = fullscreen, P = presenter |
| `useFullscreen()` | `{ isFullscreen, toggle }` wrapping the Fullscreen API |
| `useSwipe({ next, prev })` | `useDrag` from `@use-gesture/react`, horizontal swipe detection |
| `useBroadcast(slug, onSlideChange)` | Bidirectional BroadcastChannel sync. Returns `{ send }`. New tabs send `sync-request` on connect; existing tabs respond with current position |
| `usePresenter()` | Reads/writes `?presenter=true` query param. `{ isPresenter, togglePresenter }` |

## Presenter Mode

- **P** key or `?presenter=true` URL param toggles presenter layout
- Two-panel: current slide (left), sidebar with next slide preview + speaker notes + counter + timer + clock (right)
- **Bidirectional sync**: both tabs broadcast and listen. Either tab can advance and the other follows
- New tabs send `sync-request` on connect; existing tabs respond with current position
- Messages scoped by talk `slug` — multiple talks in different tabs don't interfere

## Known Gotchas

1. **Vite SPA fallback**: The `talks/` directory on disk collides with the `/talks` route. A custom Vite plugin in `vite.config.ts` rewrites HTML requests to `/index.html` before Vite's file resolver runs.

2. **KaTeX backslash escaping**: JSX string attributes double-escape backslashes. Use `String.raw` template literals for all LaTeX strings. See "Library Patterns" above.

3. **BroadcastChannel callback stability**: `useBroadcast` stores the `onSlideChange` callback in a ref to avoid closing and reopening the channel on every render. Similarly, `useDeck.goTo` uses `indexRef` to avoid recreating on every index change.

4. **`SlideTransition.config.ease`**: Must be the `Easing` type from `motion/react`, not a plain `string`. Use `as const` when defining inline: `ease: 'easeOut' as const`.

5. **Path aliases**: `@/` maps to `src/`, `@talks/` maps to `talks/`. Configured in both `vite.config.ts` (resolve.alias) and `tsconfig.json` (paths).

## Local Reference Repos

Cloned locally for reading API signatures and types:

| Library | Path |
|---------|------|
| vite | `/Users/marlzrana/gh/vitejs/vite` |
| react-router | `/Users/marlzrana/gh/remix-run/react-router` |
| motion | `/Users/marlzrana/gh/motiondivision/motion` |
| react-three-fiber | `/Users/marlzrana/gh/pmndrs/react-three-fiber` |
| drei | `/Users/marlzrana/gh/pmndrs/drei` |
| three.js | `/Users/marlzrana/gh/mrdoob/three.js` |
| d3 | `/Users/marlzrana/gh/d3/d3` |
| use-gesture | `/Users/marlzrana/gh/pmndrs/use-gesture` |
| shiki | `/Users/marlzrana/gh/shikijs/shiki` |
| KaTeX | `/Users/marlzrana/gh/KaTeX/KaTeX` |
