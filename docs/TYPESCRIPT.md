# Phase 6 — TypeScript Quality

## What changed in `tsconfig.json`

```jsonc
"strict": true,                    // was absent → no strictNullChecks, implicit any allowed
"noUncheckedIndexedAccess": true,  // arr[i] is T | undefined — forces guards
"noImplicitOverride": true,
"forceConsistentCasingInFileNames": true,
"paths": { "@/*": ["./src/*"] }    // kills ../../.. import chains
```

`strict` was the single highest-leverage change: the V1 compiled without
null-checking, so whole classes of bug were invisible. Typecheck is now **clean
(exit 0)** under the stricter config.

## Domain modelling improvements

| Before | After | Why |
|--------|-------|-----|
| `PriorityLabel = 'Priorité élevée' \| …` (French display strings **as a type**) | `Priority = 'very-high' \| 'high' \| 'medium' \| 'low'` + `priorityLabels` map | Decouples domain from copy; rewording or i18n no longer breaks types |
| `ProfileUpdate` defined inside `profileStore` | in `types/domain` | It's a domain type, not store-private |
| `extractSkills(): Partial<PlayerSkill[]>` | `: PlayerSkill[]` | `Partial<T[]>` is meaningless; the signature lied |
| `Goal[]` literal duplicated | `GOALS` `as const satisfies readonly Goal[]` + `isGoal()` guard | One source, exhaustiveness-checked |

## `any` and unsafe casts

**Goal: zero `any` in application code — achieved**, and enforced by ESLint
(`@typescript-eslint/no-explicit-any: error`).

Casts were not all removable (JSON imports widen literals), so they were
**isolated to one boundary** instead of scattered:

- `data/index.ts` — the only place `.json` is cast to domain types, with a
  comment and a **`data.test.ts` that validates every file against the runtime
  guards**, so a bad cast fails CI.
- `lib/validate.ts` — the trust boundary for external JSON. A handful of
  `value as Record<string, unknown>` casts appear _after_ a `isTaggedGameItem`
  narrowing, to read the extra numeric fields; these are local and tested.

Everything else (`as PlayerProfile`, `as ProfileUpdate`, `as PlayerSkill[]`)
that was sprinkled through pages and extractors is **gone**.

## New: a runtime type-guard layer (`lib/validate.ts`)

Static types vanish at runtime; LocalStorage and imported files are `unknown`.
The validation module provides:

- Primitive guards (`isString`, `isFiniteNumber`, …) and entity guards
  (`isPlayerSkill`, `isSnapshot`, `isBuild`, …).
- `normalizeAppExport(data, defaults)` — sanitises an imported export
  **field-by-field**: valid numbers/strings overwrite defaults, corrupt list
  items are filtered, and it returns `null` only if the profile itself is
  unrecoverable. This replaced a keys-present-only check that would happily
  write `level: "abc"` into the store.
- `parseJsonArray(text, guard)` — used by Profile/Import to parse the JSON
  textareas safely (returns `null` instead of throwing or trusting `JSON.parse`).

```ts
// Pattern: narrow, then read extras from the record explicitly.
export function isPlayerSkill(value: unknown): value is PlayerSkill {
  if (!isTaggedGameItem(value)) return false
  const record = value as Record<string, unknown>
  return isFiniteNumber(record.level) && isBoolean(record.equipped)
}
```

## Store / service / utility typing

- **Stores**: each `create<State>()` is fully typed; actions return `Partial<State>`;
  added `version` to the `persist` config (typed).
- **Services**: `getRecommendations(profile, goal): Recommendation[]`,
  `runOcrForImages(files, onProgress): Promise<string>`,
  `importAppData(text): ImportResult` (a discriminated union
  `{ ok: true } | { ok: false; error: 'invalid-json' | 'invalid-shape' }`) —
  callers must handle both arms.
- **Utilities** in `lib/` are pure and generically typed (`sanitizeList<T>`,
  `parseJsonArray<T>`).

## Recommendations not yet applied

- Consider a schema library (**Zod/Valibot**) to replace hand-written guards if
  the domain grows — generates types _and_ validators from one source. Held off
  to avoid a runtime dep for a small schema; the hand-rolled guards are tested
  and tree-shakeable. (See [ROADMAP](./ROADMAP.md).)
- `satisfies` could be pushed further onto the JSON data if migrated to `.ts`
  data modules.
