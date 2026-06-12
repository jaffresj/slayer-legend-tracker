# Phase 9 — V2 Roadmap

Prioritised, with **Impact**, **Difficulty**, **Risk**, **Est. value**. No new
_gameplay_ features — this is platform/quality work, per the brief.

Legend: Impact/Value H/M/L · Difficulty & Risk L/M/H.

> Many "quick wins" from the audit are **already shipped** in commit `cb58b64`
> (strict TS, code splitting, lazy OCR, validation, primitives, a11y, tests,
> tooling). The items below are what remains.

## 0. Already delivered this pass ✅
Strict TypeScript · `@/` alias · feature architecture · `lib`/`services` split ·
runtime validation on import · route splitting · dynamic Tesseract · Recharts
chunked · UI primitives + tokens · focus rings / skip-link / ARIA / reduced-motion ·
ESLint + Prettier + Vitest (50 tests) · object-URL leak fixed · dead assets removed.

---

## 1. Quick wins — ~1 day total

| Item | Impact | Diff | Risk | Value |
|------|:---:|:---:|:---:|:---:|
| Husky + lint-staged + GitHub Actions running `npm run validate` + build | H | L | L | H |
| Route prefetch on nav `mouseenter` (`import()` the next chunk) | M | L | L | M |
| Debounce Import raw-text re-parse (250 ms) | M | L | L | M |
| Persistence round-trip tests (export→import, corrupt import) | M | L | L | H |
| `EmptyState` on empty history/snapshots; chart skeleton during lazy load | M | L | L | M |
| Filename with date on export; "copy to clipboard" | L | L | L | M |

## 2. Short term — ~1 week

| Item | Impact | Diff | Risk | Value |
|------|:---:|:---:|:---:|:---:|
| `Dialog`/confirm + `Toast` primitives; replace `window.confirm` & inline banner | M | M | L | M |
| Unsaved-changes guard on Profile/Builds (router blocker) | H | M | M | H |
| Replace raw JSON textareas (skills/companions/…) with a row editor | H | M | M | H |
| RTL coverage for Profile/Import save paths + `Field`/`Banner` | M | M | L | H |
| Self-host Tesseract worker/core/lang (pin version, offline, privacy) | M | M | M | M |
| CONTRIBUTING.md + ADRs for the architecture decisions | M | L | L | M |

## 3. Medium term — ~1 month

| Item | Impact | Diff | Risk | Value |
|------|:---:|:---:|:---:|:---:|
| Snapshot diffing ("+12 stages, +8% crit since last import") on Dashboard | H | M | L | H |
| History: select metric, date-range filter, per-snapshot edit/delete | M | M | M | M |
| Storybook/Ladle for `ui/` with a11y addon + visual regression | M | M | L | M |
| i18n scaffolding (extract fr strings; the type/label split already enables it) | M | M | M | M |
| Playwright happy-path e2e in CI (import → dashboard → snapshot → history) | M | M | M | H |
| Evaluate Zod/Valibot to generate types+validators from one schema | M | M | M | M |

## 4. Long term

| Item | Impact | Diff | Risk | Value |
|------|:---:|:---:|:---:|:---:|
| Pluggable OCR "profiles" per game screen (registry of extractor rule-sets) | H | H | M | H |
| Swap Recharts for uPlot/visx if chart-route weight matters (−60–80 kB gzip) | M | H | M | M |
| Optional cloud sync / multi-device (the `AppExport` schema + validation is the seam) | H | H | H | M |
| PWA: offline shell + installable (self-hosted Tesseract makes OCR work offline) | M | M | M | M |
| Web Worker for OCR orchestration to keep the main thread free on batches | M | M | M | M |

---

## Sequencing rationale

1. **Lock the gains first** (CI + hooks) so the strictness/tests can't regress —
   cheapest insurance, highest leverage.
2. **Reduce data-entry friction** (row editor, unsaved guard) — the JSON
   textareas are the biggest remaining UX risk now that import is validated.
3. **Then build value features** (snapshot diffing, richer history) on the now-stable base.
4. **Defer heavy swaps** (chart lib, cloud sync) until there's a measured need;
   the architecture leaves clean seams for all of them.
