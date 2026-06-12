# Phase 1 — Full Project Audit

Audit of the V1 codebase (commit `1cbdbf0`). Each finding has **Severity**,
**Impact**, **Recommendation**, and **Status** (✅ fixed in this pass, 🟡 planned,
referencing the [roadmap](./ROADMAP.md)).

Severity scale: 🔴 high · 🟠 medium · 🟡 low.

---

## 1. Architecture & separation of concerns

| # | Finding | Sev | Impact | Recommendation | Status |
|---|---------|-----|--------|----------------|--------|
| 1.1 | Business logic lived **inside page components**: `ImportPage` parsed numbers, mutated nested profile sections, parsed skills JSON and persisted; `ProfilePage` rebuilt the profile and parsed 4 JSON lists; `SettingsPage` held `downloadJson` + `isAppExport`. | 🔴 | Logic is untestable without rendering React, and duplicated across pages. A change to "how a profile is saved" touches 3 files. | Extract pure logic into `lib/` (merge, snapshot, format) and `services/` (persistence, recommendations, ocr). Keep pages as thin view/orchestration. | ✅ |
| 1.2 | `historyStore` imported `defaultProfile` from `profileStore`; `snapshotFromProfile` and `mergeProfile` lived in stores. | 🟠 | Store-to-store coupling; domain rules tied to Zustand, can't be reused server-side or in tests cleanly. | Move `mergeProfile`/`snapshotFromProfile` to `lib/profile`, seed data to `data/`. Stores import from `lib`/`data`, never each other. | ✅ |
| 1.3 | OCR + recommendations under `features/`, but `features/` also implied UI. Mixed "engine" and "screen" concepts. | 🟡 | Ambiguous mental model for where new code goes. | `features/<name>/` = route UI; `services/` = framework-agnostic engines. Documented in [ARCHITECTURE](./ARCHITECTURE.md). | ✅ |

## 2. Folder structure

| # | Finding | Sev | Impact | Recommendation | Status |
|---|---------|-----|--------|----------------|--------|
| 2.1 | Flat `pages/` with 7 monolithic files; shared `components/` held unrelated primitives; `utils/` was a grab-bag. | 🟠 | Poor locality — a feature's code is scattered across `pages/`, `components/`, `utils/`, `features/`. | Feature-based foldering with co-located components/hooks. | ✅ |
| 2.2 | Dead assets shipped: `src/assets/hero.png`, `typescript.svg`, `vite.svg`, `public/icons.svg` — zero references. | 🟡 | Repo bloat, confusion about what's used. | Delete. | ✅ |
| 2.3 | No `app/` shell — `App.tsx` mixed providers + router + layout. | 🟡 | Hard to see the composition root. | `app/App.tsx` (providers) + `app/routes.tsx` (routing). | ✅ |

## 3. State management

| # | Finding | Sev | Impact | Recommendation | Status |
|---|---------|-----|--------|----------------|--------|
| 3.1 | `persist` stores had **no `version`/`migrate`**. | 🔴 | Any future shape change silently corrupts users' LocalStorage or crashes on read. | Add `version: 1` to every persisted store now; add `migrate` when shape changes. | ✅ (version added) |
| 3.2 | Import path (`importAppData`) wrote external JSON straight into stores after a **keys-present-only** check (`isAppExport`). | 🔴 | A malformed/old export poisons state (e.g. `level: "abc"`), breaking charts/recommendations with no recovery besides reset. | Validate + sanitise field-by-field (`lib/validate.normalizeAppExport`) before writing; drop corrupt list entries instead of failing. | ✅ |
| 3.3 | Selectors were fine (`useStore(s => s.x)`), but stores exposed broad state. | 🟢 | — | Kept; added typed actions. No change needed. | ✅ |

## 4. Component design & reusability

| # | Finding | Sev | Impact | Recommendation | Status |
|---|---------|-----|--------|----------------|--------|
| 4.1 | **Button styles duplicated ~10×** as raw class strings (`inline-flex h-10 … bg-amber-400/15 …`). | 🟠 | Inconsistency drift; a restyle is a find-and-replace across files. | `Button` primitive with variants/sizes. | ✅ |
| 4.2 | Two near-identical `Field`/`DetectionField` label+input components in `ProfilePage` and `ImportPage`. | 🟠 | Same control, two implementations, two a11y behaviours. | One `Field`/`TextareaField`/`Select` in `components/ui`. | ✅ |
| 4.3 | Status "message" banner markup copy-pasted on 4 pages. | 🟡 | Inconsistent tone/role; no auto-dismiss. | `Banner` + `useStatusMessage` hook (auto-dismiss, ARIA role). | ✅ |
| 4.4 | `ImportPage` was ~275 lines doing upload, OCR, detection form, raw text, persistence. | 🟠 | Hard to read/test/change. | Split into `Dropzone`, `DetectionForm`, `useImagePreviews`, orchestrator. | ✅ |
| 4.5 | `goalLabels` + `goals` array duplicated (Dashboard + Builds); `formatDate` reimplemented in `ProgressChart` vs `utils/dates`. | 🟡 | Drift risk. | Centralised in `lib/labels` and `lib/dates`. | ✅ |

## 5. Type safety

| # | Finding | Sev | Impact | Recommendation | Status |
|---|---------|-----|--------|----------------|--------|
| 5.1 | `tsconfig` was **not `strict`** (only `noUnusedLocals/Parameters`). | 🔴 | No `strictNullChecks`, implicit `any` allowed — the compiler wasn't catching real bugs. | Enable `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`. | ✅ |
| 5.2 | JSON data imported with unchecked casts (`as PlayerProfile`, `as Stage[]`, `as TaggedGameItem[]`) in 3 places. | 🟠 | A typo in a `.json` file is invisible until runtime. | Centralise casts in `data/index.ts`; lock them with a `data.test.ts` validating every file against guards. | ✅ |
| 5.3 | `extractSkills` returned `Partial<PlayerSkill[]>` (Partial of an array = meaningless); `extractProfileFromText` used `as` casts. | 🟠 | False sense of typing; the function lied about its return. | Return `PlayerSkill[]`; build `ProfileUpdate` without casts. | ✅ |
| 5.4 | `PriorityLabel` was a union of **French display strings** used as a domain type. | 🟠 | Display copy coupled to types — rewording "Priorité élevée" is a breaking type change; not i18n-able. | `Priority = 'very-high' \| …'` semantic union + `priorityLabels` map for display. | ✅ |
| 5.5 | `value as Record<string, unknown>` casts in `updateNested`. | 🟡 | Unsafe nested writes. | Localised, documented casts; covered by validation on save. | ✅ (minimised) |

## 6. Performance

| # | Finding | Sev | Impact | Recommendation | Status |
|---|---------|-----|--------|----------------|--------|
| 6.1 | **No code splitting** — one 665 kB / 203 kB-gzip bundle for all routes. | 🔴 | Every visitor downloads every page + Recharts + Tesseract before first paint. | Route-based `React.lazy` + `Suspense`. | ✅ |
| 6.2 | **Tesseract.js statically imported** in `runOcr`. | 🔴 | The heaviest dependency loads for users who never touch OCR. | `await import('tesseract.js')` — deferred to the scan action. | ✅ |
| 6.3 | Recharts eager despite being used on 2 of 7 routes. | 🟠 | ~100 kB gzip on routes that show no charts. | Isolated chunk via lazy chart routes. | ✅ |
| 6.4 | `SettingsPage` recomputed the **entire export** twice per render (`exportAppData()` for the button + the `<pre>`). | 🟠 | Wasted CPU on every render of that page. | `useMemo` over the four exported slices. | ✅ |
| 6.5 | `ProgressChart` re-derived `chartData` every render. | 🟡 | Minor re-compute. | `useMemo`. | ✅ |
| 6.6 | `ImportPage` raw-text editor re-runs all extractor regexes on **every keystroke**. | 🟡 | Jank on large pastes. | Debounce the parse (see roadmap). | 🟡 |

## 7. Technical debt & maintainability

| # | Finding | Sev | Impact | Recommendation | Status |
|---|---------|-----|--------|----------------|--------|
| 7.1 | **No tests, no ESLint, no Prettier.** | 🔴 | No safety net; style drift; regressions invisible. | Vitest + RTL, ESLint flat config, Prettier. | ✅ |
| 7.2 | No `.gitattributes` → CRLF/LF churn on Windows (observed on first commit). | 🟡 | Noisy diffs across machines. | `* text=auto eol=lf`. | ✅ |
| 7.3 | Object URLs in OCR previews revoked only on "Vider", **not on unmount**. | 🟠 | Memory leak when navigating away with images loaded. | `useImagePreviews` revokes on unmount. | ✅ |
| 7.4 | `makeId` uses `Date.now()+Math.random()`. | 🟢 | Collision-unlikely but not guaranteed. | Use `crypto.randomUUID()` where an id is purely internal (done in previews). Kept `makeId` for prefixed domain ids. | ✅ (partial) |

---

## Scorecard (before → after)

| Dimension | Before | After |
|-----------|--------|-------|
| TS strictness | `strict: false` | `strict` + `noUncheckedIndexedAccess` + `noImplicitOverride` |
| `any` / unsafe casts in app code | several | 0 `any`; casts isolated to `data/` (test-locked) + documented validation boundary |
| Initial JS (gzip) | 203 kB | ~85 kB (−58%) |
| Tests | 0 | 50 |
| Lint / format | none | ESLint (ts + hooks + a11y) + Prettier, 0 errors |
| Largest source file | `ImportPage` ~275 lines | orchestrator ~150, logic in `lib`/`services` |
| Reusable UI primitives | 3 (Panel, KpiCard, PageHeader) | 8 + layout + charts |

See [ARCHITECTURE](./ARCHITECTURE.md), [PERFORMANCE](./PERFORMANCE.md),
[TYPESCRIPT](./TYPESCRIPT.md), [TESTING](./TESTING.md), [DESIGN](./DESIGN.md),
[DX](./DX.md), and the prioritised [ROADMAP](./ROADMAP.md).
