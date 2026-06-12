# Phase 7 — Testability & Test Roadmap

## Setup (shipped)

- **Vitest** (`vitest.config.ts`) with `jsdom`, globals, `setupFiles`, and v8
  coverage scoped to logic (`lib/`, `services/`, `stores/`, `hooks/`).
- **React Testing Library** + `@testing-library/jest-dom` +
  `@testing-library/user-event`. `vitest.setup.ts` runs `cleanup()` and clears
  `localStorage` after each test (Zustand persist isolation).
- Type augmentation in `src/testing.d.ts` so jest-dom matchers are typed.
- Scripts: `npm test`, `test:watch`, `test:coverage`, and `validate`
  (typecheck + lint + test).

## What made this testable

The refactor **extracted pure logic out of components** — that is the
precondition for cheap tests. The recommendation engine, OCR extractors, profile
math, validation, and daily-reset logic are now plain functions with no React,
no DOM, no store. They test in microseconds.

## Coverage shipped (50 tests, 8 files)

| Area | File | What's locked down |
|------|------|--------------------|
| Recommendation engine | `services/recommendations/engine.test.ts` | score clamping, priority thresholds, 8 results sorted desc, goal weighting (farm raises gold, survie raises survival vs push), scores ∈ [0,100] |
| OCR extractors | `services/ocr/extractors.test.ts` | `parseLooseNumber` (k/M/B, spaces, garbled→undefined), stat extraction fr, skill-line detection, aggregation, no empty sections |
| Validation | `lib/validate.test.ts` | entity guards, `parseJsonArray` (malformed/invalid), `normalizeAppExport` sanitises corrupt entries & recovers fields |
| Profile math | `lib/profile.test.ts` | partial merge doesn't clobber siblings, list replacement, source immutability, snapshot extraction |
| Formatting | `lib/format.test.ts` | fr grouping, non-finite→0, percent, input parsing |
| Daily reset | `stores/dailyStore.test.ts` | fresh checklist, same-day keep, stale-day reset |
| Data integrity | `data/data.test.ts` | every JSON file satisfies its guard; stages sorted; profile sections present |
| UI primitive | `components/ui/Button.test.tsx` | renders, click, disabled no-op (RTL seed) |

## Roadmap — what to test next

### Tier 1 — business rules (high value, low effort)
- [ ] `services/persistence` round-trip: export → import restores state; corrupt
  import returns the right `ImportResult` error and leaves stores intact.
- [ ] `mergeProfile` via OCR `ProfileUpdate` shapes (partial player + skills).
- [ ] `historyStore.addSnapshot` caps at 365 and appends.
- [ ] `buildStore` add/remove/reset; default builds reference real skill ids.

### Tier 2 — component behaviour (RTL)
- [ ] `ProfilePage`: editing a field + Save persists; invalid JSON list shows the
  named error and does **not** write.
- [ ] `ImportPage`: invalid skills JSON blocks save; the file-preview hook revokes
  URLs on unmount (spy on `URL.revokeObjectURL`).
- [ ] `Field`/`Select` label↔control association (`getByLabelText`).
- [ ] `Banner` exposes the correct `role` per tone.

### Tier 3 — integration / e2e
- [ ] Routing smoke: each path renders its lazy page (suspense resolves).
- [ ] **Playwright** happy path: import JSON → dashboard reflects it → add snapshot
  → history chart updates. (OCR itself stays manual — Tesseract in CI is slow.)

### Targets
- Keep `lib/` + `services/` at **>90%** line coverage (they're pure — cheap).
- Don't chase coverage on presentational JSX; assert behaviour, not markup.
- Wire `npm run validate` into a pre-push hook / CI (see [DX](./DX.md)).
