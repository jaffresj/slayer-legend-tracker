# Phase 8 — Developer Experience

## Shipped

| Area | Before | After |
|------|--------|-------|
| Linting | none | ESLint flat config: `@eslint/js` + `typescript-eslint` + `react-hooks` + `react-refresh` + `jsx-a11y`, `eslint-config-prettier` last. **0 errors.** |
| Formatting | none | Prettier (`.prettierrc.json`): no-semi, single quotes, width 100, trailing commas. `.prettierignore` excludes data JSON. |
| Tests | none | Vitest + RTL (see [TESTING](./TESTING.md)). |
| Scripts | `dev`, `build`, `preview` | + `typecheck`, `lint`, `lint:fix`, `format`, `format:check`, `test`, `test:watch`, `test:coverage`, `validate` |
| Path imports | `../../stores/x` | `@/stores/x` (alias in tsconfig + vite + vitest) |
| Line endings | none → CRLF churn on Windows | `.gitattributes` `* text=auto eol=lf` |
| Dead files | hero.png, 2 svgs, icons.svg | removed |

### Key ESLint rules

```js
'@typescript-eslint/no-explicit-any': 'error',          // hold the line at 0 any
'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
'react-hooks/exhaustive-deps': 'warn',
...jsxA11y.flatConfigs.recommended.rules,               // catches label/aria issues
'react-refresh/only-export-components': 'warn',          // keeps HMR fast
```

## Conventions (proposed project standards)

- **Foldering**: render → `features/<name>/`; compute → `services/` or `lib/`;
  reusable view → `components/{ui,layout,charts}`. One rule, documented in
  [ARCHITECTURE](./ARCHITECTURE.md).
- **Naming**: components `PascalCase.tsx`; hooks `useX.ts`; pure modules
  `camelCase.ts`; types in `PascalCase`; a feature's public surface via its
  `index.ts` barrel.
- **Imports**: always `@/…`, never deep relative chains. Type-only imports use
  `import type` (`verbatimModuleSyntax` enforces it).
- **Components stay presentational**; side-effects/logic go through hooks
  (`useStatusMessage`, `useImagePreviews`) or services.
- **Commits**: Conventional Commits (`refactor:`, `feat:`, `fix:`…).

## Onboarding (README updated)

`README.md` now documents the structure, the layering/dependency rule, and the
full script list. A new contributor can run `npm run validate` to get
typecheck + lint + tests in one command.

## Recommended next (not yet applied — [ROADMAP](./ROADMAP.md))

| Item | Why | Effort |
|------|-----|--------|
| **Husky + lint-staged** pre-commit (`eslint --fix` + `prettier` on staged) | Stop style/lint regressions at the source | S |
| **CI workflow** (GitHub Actions) running `npm run validate` + `build` on PR | Gate merges on green | S |
| **`pre-push`** running `npm run validate` | Catch before remote | S |
| EditorConfig + recommended VS Code extensions (`.vscode/extensions.json`) | Consistent editor setup | S |
| Commitlint + Changesets if this gets versioned/released | Automated changelog | M |
| Storybook (or Ladle, lighter) for the `ui/` primitives | Visual catalogue + a11y addon | M |
