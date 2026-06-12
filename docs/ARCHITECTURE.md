# Phase 2 — Architecture & Refactoring

## Verdict on the proposed structure

The proposed `app / components{ui,layout} / features / hooks / lib / services /
stores / types` tree is the right direction. I adopted it with **two
deliberate refinements**, justified below.

1. **`services/` holds framework-agnostic engines; `features/` holds route
   UI.** The original brief listed `features/recommendations` next to a
   top-level `services/`. Recommendations and OCR are pure logic with **no
   JSX** — they belong with persistence under `services/`, not in `features/`
   (which now uniformly means "a screen"). This keeps one rule: _if it renders,
   it's a feature; if it computes, it's a service or lib._
2. **`lib/` = pure, dependency-free utilities** (format, dates, classes,
   labels, validation, profile math). **`services/` = app-aware logic** that
   may touch stores or heavy deps (persistence reads stores; ocr loads
   Tesseract). The split makes `lib/` trivially unit-testable and tree-shakeable.

`components/shared/` from the sketch was dropped: with `ui/` (primitives),
`layout/` (chrome), and `charts/` (the one heavy shared widget), a `shared/`
bucket would just become the new grab-bag. Add it later only if a genuinely
cross-feature composite appears.

## Before → After

```
BEFORE                              AFTER
src/                                src/
  App.tsx        ← providers+router   app/
  main.tsx                              App.tsx          providers
  pages/         ← 7 monoliths          routes.tsx       lazy routes + Suspense
  components/    ← mixed primitives   components/
  features/                             ui/              Button, Card, Field, Select,
    ocr/                                                 Badge, Banner, StatTile, EmptyState
    recommendations/                    layout/          AppLayout, Sidebar, PageHeader, navigation
  stores/                               charts/          ProgressChart (Recharts boundary)
  utils/         ← grab-bag           features/
  types/                                dashboard/  import/  history/  profile/
  data/                                 builds/     daily/   settings/
                                          <Page>.tsx + components/ + hooks/ + index.ts
                                      hooks/             useStatusMessage
                                      lib/               classes, dates, format, labels,
                                                         profile, validate   (pure)
                                      services/          recommendations/, ocr/, persistence
                                      stores/            4 thin Zustand stores (versioned)
                                      types/             domain.ts
                                      data/              *.json + index.ts (typed access)
```

## Duplication removed

| Kind | Was | Now |
|------|-----|-----|
| Duplicated UI | Button/input/banner class strings across 5 pages | `components/ui` primitives |
| Duplicated logic | `asJson`/`toJson`, `downloadJson`, JSON-list parsing in 2–3 pages | `lib`/`services` single source |
| Duplicated types | `PriorityLabel` French strings as type | `Priority` union + `priorityLabels` map |
| Duplicated data access | `as TaggedGameItem[]`/`as Stage[]` casts in multiple files | `data/index.ts` typed exports |
| Duplicated constants | `goals` array + `goalLabels` in Dashboard & Builds | `lib/labels` (`GOALS`, `goalLabels`) |
| Misplaced business logic | `mergeProfile`/`snapshotFromProfile` in stores; merge/persist in pages | `lib/profile`, `services/persistence` |

## Dependency direction (enforced by convention)

```
data ─┐
lib  ─┼─→ services ─→ stores ─→ features ─→ app
types ┘         └──────────────→ components/ui (no app deps)
```

- `lib`, `types`, `data` depend on nothing app-specific.
- `components/ui` depends only on `lib` + `types` (reusable in isolation).
- `features` compose `components`, `stores`, `services`.
- Nothing imports "upward" (no store imports a feature; no lib imports a store).

## Migration plan (how it was sequenced, repeatable for future moves)

1. **Foundations, no behaviour change:** strict `tsconfig`, `@/*` alias,
   `.gitattributes`. Commit baseline first (done — `1cbdbf0`).
2. **Types & pure libs:** move `utils/*` → `lib/*`, add `lib/profile`,
   `lib/labels`, `lib/validate`. Re-type `domain.ts`.
3. **Data boundary:** `data/index.ts` centralises JSON casts.
4. **Services:** lift recommendations, ocr, persistence out of `features`/`stores`/`pages`.
5. **Stores:** thin them; add `version`; point at `lib`/`data`.
6. **UI primitives + layout**, then **features** one screen at a time.
7. **App shell** with lazy routes.
8. **Delete old files**, typecheck, lint, test, build. (All green.)

Because each layer only depends on layers below it, the migration compiled at
nearly every step rather than in one big-bang.

## Tradeoffs

- **More files, more indirection.** For a 7-screen app this is a real cost. It
  pays off the moment a second engineer joins or a screen grows — locality and
  testability beat file count. The primitives also _shrink_ total JSX.
- **Barrel `index.ts` per feature** enables clean `React.lazy(() =>
  import('@/features/x'))` but adds a file. Worth it for the routing ergonomics.
- **`services/persistence` reads stores via `getState()`** (not pure). That's
  an intentional seam: it's the one "app-aware" service, and it keeps the
  import/export orchestration in one place instead of in a component.
