# Phases 3 & 4 — UI & UX Review

Reviewed through the lens of Linear / Vercel / Notion / Raycast: opinionated
dark theme, high information density done calmly, keyboard-first, fast feedback.

The V1 already had a coherent dark aesthetic (slate + amber, good spacing).
This pass formalises it into a **system** and fixes the accessibility and
feedback gaps.

---

## Part A — Design system

### Tokens (`src/style.css`, Tailwind v4 `@theme`)

| Token | Value | Role |
|-------|-------|------|
| `--color-canvas` | `#020617` | App background |
| `--color-surface` | `#0f172a` | Card/panel base |
| `--color-surface-raised` | `#111c33` | Elevated surface |
| `--color-border` | `#1e293b` | Default hairline |
| `--color-border-strong` | `#334155` | Emphasis border |
| `--color-accent` | `#f59e0b` | Primary action / brand |
| `--color-accent-soft` | `#fcd34d` | Hover/selection accent |
| `--radius-control` | `0.5rem` | Inputs/buttons radius |

Centralising these means a re-theme (or a future light mode) is one block, not
a repo-wide find/replace. `color-scheme: dark` is set so native controls
(scrollbars, date pickers) match.

### Type scale

Inter, with a deliberately small scale: page title `text-2xl/3xl`,
section `text-lg`, body `text-sm`, meta `text-xs`. KPI numbers use
`tabular-nums` so digits don't jitter as values change. This is the
Linear/Vercel "quiet density" pattern — few sizes, lots of weight/colour
contrast instead.

### Color usage rules

- **Amber = action & "you are here"** only. Don't use it for decoration.
- Semantic tones via `Badge`/`Banner`: `emerald` success, `rose` danger/urgent,
  `cyan` info, `amber` warning/priority, `neutral` default.
- Priority maps to tone in one place (`RecommendationCard`): very-high→rose,
  high→amber, medium→cyan, low→neutral.

### Reusable component guidelines

Primitives live in `components/ui` and follow these rules:

1. **Encapsulate the class string, expose intent.** Callers pass
   `variant="primary"`, never `className="… bg-amber-400/15 …"`.
2. **`className` is a final override, merged last** via `cx()` — escape hatch
   without forking the component.
3. **Accessible by construction.** `Field`/`Select` wire `htmlFor`↔`id` with
   `useId`; `Banner` sets `role="status"`/`"alert"`; icon-only buttons require
   `aria-label`.
4. **Forward native props** (`ButtonHTMLAttributes`, `InputHTMLAttributes`) so
   primitives never block a legitimate attribute.

| Primitive | Replaces | Notes |
|-----------|----------|-------|
| `Button` | ~10 raw button strings | variants primary/secondary/danger/ghost, sizes sm/md/lg, focus ring |
| `Card` + `CardHeader` | `Panel` + ad-hoc headers | consistent title/count/action row |
| `Field` / `TextareaField` / `Select` | `Field`, `DetectionField`, raw `<select>` | label/id, focus-visible ring |
| `Badge` | inline pill spans | tone system |
| `Banner` | copy-pasted message divs | ARIA role, icon, tone |
| `StatTile` | `KpiCard` | `tabular-nums`, tone |
| `EmptyState` | _missing_ | used on Builds; reuse for empty history/snapshots |

---

## Part B — UI improvement roadmap

Concrete visual/layout work, in suggested order. ✅ = shipped this pass.

1. ✅ Focus-visible rings on all interactive elements (was: invisible keyboard focus).
2. ✅ Skip-to-content link; `<nav aria-label>`; semantic `<ul>` nav list.
3. ✅ Auto-dismissing, role-tagged status banners.
4. ✅ Drag-over visual state on the OCR dropzone.
5. ✅ `EmptyState` for zero-build / zero-data.
6. ✅ `prefers-reduced-motion` guard.
7. 🟡 **Active-route polish**: add an inset left-border indicator on the sidebar item (Linear-style) in addition to the fill.
8. 🟡 **Toast stack** instead of a single inline banner (so "saved" doesn't push layout).
9. 🟡 **Skeleton loaders** for charts while a lazy route resolves (currently a "Chargement…" line).
10. 🟡 **Sticky page header** with a subtle bottom border on scroll.
11. 🟡 **Tooltip** primitive for KPI definitions (what is "Frappe Mortelle"?).
12. 🟡 **Dialog/confirm** primitive to replace `window.confirm` on reset.

---

## Part C — Top 20 UX improvements (ranked by ROI)

ROI = Impact ÷ Effort. Effort: S ≤2h, M ≤1d, L >1d.

| # | Improvement | Impact | Effort | ROI | Status |
|---|-------------|:------:|:------:|:---:|--------|
| 1 | Keyboard focus visible everywhere (a11y blocker) | High | S | ★★★★★ | ✅ |
| 2 | Validate JSON import before writing to stores (prevents silent data loss) | High | S | ★★★★★ | ✅ |
| 3 | Auto-dismissing success/error feedback with ARIA roles | High | S | ★★★★★ | ✅ |
| 4 | Fix OCR preview memory leak (revoke object URLs on unmount) | Med | S | ★★★★★ | ✅ |
| 5 | Defer Tesseract/Recharts → first load 58% lighter | High | M | ★★★★★ | ✅ |
| 6 | Skip-to-content + landmark roles | Med | S | ★★★★☆ | ✅ |
| 7 | Empty states (no builds / no snapshots) instead of blank panels | Med | S | ★★★★☆ | ✅ (builds) |
| 8 | Disable "Save build" until a name exists (was: silent no-op) | Med | S | ★★★★☆ | ✅ |
| 9 | OCR button shows "OCR en cours…" pending state | Med | S | ★★★★☆ | ✅ |
| 10 | Confirm dialog primitive replacing `window.confirm` | Med | M | ★★★☆☆ | 🟡 |
| 11 | Inline field-level validation on Profile (which list is bad JSON) | Med | S | ★★★★☆ | ✅ (names the list) |
| 12 | Unsaved-changes guard on Profile/Builds before navigating away | High | M | ★★★★☆ | 🟡 |
| 13 | Toast stack (non-layout-shifting feedback) | Med | M | ★★★☆☆ | 🟡 |
| 14 | Chart skeletons during lazy load | Low | S | ★★★☆☆ | 🟡 |
| 15 | KPI tooltips defining each stat | Med | M | ★★★☆☆ | 🟡 |
| 16 | "Copy export to clipboard" + filename with date | Low | S | ★★★☆☆ | 🟡 |
| 17 | Mobile nav as a collapsible drawer (current grid is okay but cramped <400px) | Med | M | ★★★☆☆ | 🟡 |
| 18 | Snapshot diff ("+12 stages since last import") on Dashboard | High | L | ★★★☆☆ | 🟡 |
| 19 | Per-snapshot delete/edit in History | Med | M | ★★★☆☆ | 🟡 |
| 20 | Onboarding/first-run hint pointing to Import | Med | M | ★★★☆☆ | 🟡 |

### Friction / cognitive-load notes

- **Profile & Import expose raw JSON textareas.** Powerful, but intimidating
  and error-prone (the #1 reason validation mattered). Long term, replace the
  skills/companions JSON blobs with a small repeatable row editor (#19-adjacent).
- **No global feedback on destructive actions** beyond `window.confirm`
  (#10). The reset is irreversible and deserves a typed confirm.
- **Navigation is flat and discoverable** — 7 items, icon+label, good. Keep it
  flat; resist adding nesting.
