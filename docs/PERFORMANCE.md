# Phase 5 — Performance Review

> **Update (post-OCR removal):** OCR (Tesseract.js) and React Query were removed
> when OCR was dropped in favour of manual entry. Initial JS gzip is now
> **77.4 kB** (entry chunk 239.8 kB raw) — **−62% vs the original 203 kB**. The
> Tesseract row below is historical; it's no longer a dependency at all.

## Headline

| Metric                            |                Before |                      After | Δ        |
| --------------------------------- | --------------------: | -------------------------: | -------- |
| Initial JS (eagerly loaded, gzip) |         **203.22 kB** |                **77.4 kB** | **−62%** |
| Initial JS (raw)                  |             665.88 kB |                    ~240 kB | −64%     |
| Bundle shape                      |            1 monolith | per-route cacheable chunks | —        |
| Recharts (~100 kB gzip)           |     eager, all routes |          chart routes only | deferred |
| Tesseract.js                      | eager (static import) |                **removed** | −dep     |
| React Query                       |                 eager | **removed** (was OCR-only) | −dep     |

Total bytes barely changed — the win is **what loads when**. A user landing on
`/import`, `/profile`, `/builds`, `/daily`, or `/settings` no longer downloads
Recharts at all, and nobody downloads Tesseract until they click **Lancer OCR**.

## What was changed

### 1. Route-based code splitting (`app/routes.tsx`)

```tsx
const DashboardPage = lazy(() => import('@/features/dashboard'))
// …one per route, wrapped in <Suspense fallback={<RouteFallback />}>
```

Each route is its own chunk (dashboard 3.2 kB, import 4.9 kB, profile 1.7 kB …
gzip). The shared vendor (React, Router, Query, Zustand) stays in the entry
chunk and is cached across navigations.

### 2. Tesseract.js dynamic import (`services/ocr/runOcr.ts`)

```ts
export async function runOcrForImages(files, onProgress) {
  const { recognize } = await import('tesseract.js') // deferred
  …
}
```

Tesseract's JS glue (and its multi-MB WASM core + language traineddata, which
are fetched at runtime) are now off the critical path entirely.

### 3. Recharts isolated

`ProgressChart` is the only Recharts consumer and is reached only through the
lazy `dashboard`/`history` routes, so Recharts lands in its own
`ProgressChart-*.js` chunk (337 kB raw / 99.6 kB gzip) shared by those two
routes and cached.

### 4. Render-time work trimmed

- `SettingsPage` memoises the export-preview string over the four exported
  slices (was recomputing the whole export twice per render).
- `ProgressChart` memoises its derived series.
- React Query configured with `refetchOnWindowFocus: false`, `retry: 1` (the
  OCR mutation shouldn't silently retry a 30 s scan).

## Measured chunk map (post-build)

```
index (vendor+entry)     264.5 kB │ 84.4 kB gzip   ← initial
ProgressChart (Recharts) 337.0 kB │ 99.6 kB gzip   ← dashboard/history only
import route              12.7 kB │  4.9 kB gzip
dashboard route           8.1 kB │  3.2 kB gzip
profile / builds / daily / settings / history   1–5 kB each
stores / lib / data       <1–2 kB each
```

## Estimated real-world gains

- **First load on a non-chart route**: ~85 kB vs 203 kB gzip → roughly **2.4×
  less JS to parse/execute** before interactive. On a mid-tier phone over 4G
  that's a meaningful TTI improvement (hundreds of ms of parse/compile saved —
  JS parse cost scales with bytes).
- **Users who never use OCR** (likely the majority) **never pay for Tesseract.**
- **Repeat visits**: vendor and Recharts chunks are content-hashed and cached
  independently, so a feature change invalidates only that feature's small chunk.

## Remaining opportunities (see [ROADMAP](./ROADMAP.md))

| Opportunity                                                                  | Est. gain                              | Effort |
| ---------------------------------------------------------------------------- | -------------------------------------- | ------ |
| Debounce the Import raw-text re-parse                                        | Removes keystroke jank on large pastes | S      |
| Prefetch the likely-next route on nav hover (`import()` on `mouseenter`)     | Hides lazy latency                     | S      |
| Self-host Tesseract worker/core/lang to control CDN/version & enable offline | Reliability + privacy                  | M      |
| Manual `manualChunks` to split React vs Router vs Query for finer caching    | Marginal                               | S      |
| Virtualise long lists if snapshots → hundreds (history is capped at 365)     | Scales charts                          | M      |
| Replace Recharts with a lighter chart lib (uPlot/visx) if bundle matters     | −60–80 kB gzip on chart routes         | L      |
