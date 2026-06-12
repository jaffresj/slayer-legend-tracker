# Slayer Legends Progression Helper

Application web locale d'aide à la progression pour Slayer Legends: Idle RPG.

Cette application n'automatise jamais le jeu : pas de clic automatique, pas de
bot, pas de lecture temps réel de l'écran, pas d'injection et pas d'autofarm.
Elle analyse uniquement des données saisies ou des captures importées par le
joueur, stockées localement (LocalStorage).

## Stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · Zustand · React Query ·
Recharts · Tesseract.js (OCR) · Vitest + Testing Library.

## Démarrage

```bash
npm install
npm run dev          # serveur de dev
```

## Scripts

| Script                                      | Rôle                                                   |
| ------------------------------------------- | ------------------------------------------------------ |
| `npm run dev`                               | Serveur de développement Vite                          |
| `npm run build`                             | Typecheck (`tsc`) puis build de production             |
| `npm run preview`                           | Sert le build de production                            |
| `npm run typecheck`                         | Vérification de types seule                            |
| `npm run lint` / `lint:fix`                 | ESLint                                                 |
| `npm run format` / `format:check`           | Prettier                                               |
| `npm test` / `test:watch` / `test:coverage` | Vitest                                                 |
| `npm run validate`                          | typecheck + lint + tests (à lancer avant un commit/PR) |

## Structure du projet

```
src/
  app/          Composition racine : providers (App.tsx) + routes lazy (routes.tsx)
  components/
    ui/         Primitives réutilisables (Button, Card, Field, Select, Badge, Banner, StatTile, EmptyState)
    layout/     Chrome de l'app (AppLayout, Sidebar, PageHeader, navigation)
    charts/     ProgressChart (frontière Recharts, chargée à la demande)
  features/     Une route = un dossier (dashboard, import, history, profile, builds, daily, settings)
                  <Page>.tsx + components/ + hooks/ + index.ts
  hooks/        Hooks transverses (useStatusMessage)
  lib/          Utilitaires purs sans dépendance app (format, dates, classes, labels, profile, validate)
  services/     Logique métier indépendante du framework (recommendations, ocr, persistence)
  stores/       Stores Zustand persistés (versionnés)
  types/        Types de domaine partagés (domain.ts)
  data/         Données JSON d'exemple + accès typé (index.ts)
```

**Règle de dépendances** : `data`/`lib`/`types` ne dépendent de rien ;
`components/ui` ne dépend que de `lib`/`types` ; `features` composent
`components` + `stores` + `services`. Aucune dépendance « vers le haut »
(un store n'importe jamais une feature).

## Ajouter / améliorer l'OCR

Les extracteurs sont dans `src/services/ocr/extractors.ts` (fonctions pures,
couvertes par `extractors.test.ts` et `extractors.realworld.test.ts`).
Tesseract.js est chargé dynamiquement (uniquement au lancement d'un scan).

**Qualité des images.** L'OCR est fiable sur des **captures d'écran nettes**,
pas sur des photos d'écran (reflets, angle, moiré dégradent fortement la
reconnaissance). Recadrer sur un seul panneau aide. Toutes les valeurs restent
éditables dans `/import` : il faut vérifier avant d'enregistrer.

**Vocabulaire du jeu (FR).** Les libellés sont centralisés dans la constante
`LABELS` de `extractors.ts`. Le jeu utilise des abréviations : `Niv.` (niveau),
`Étape` (stage, ≠ « étage »), `ATQ` (attaque), `PV` (vie), `Frappe Mortelle`,
`Dgt CRIT`, `Récupération`… Pour ajouter une règle : ajouter l'alternative au
libellé concerné dans `LABELS`, ajouter un cas dans
`extractors.realworld.test.ts` avec un fragment réel, puis vérifier le profil
avant sauvegarde. Les libellés courts (2-3 lettres : `or`, `pv`, `niv`) sont
bornés par `\b` pour éviter les faux positifs.

## Ajouter des données du jeu

Modifier les fichiers dans `src/data/` (`skills.json`, `companions.json`,
`equipment.json`, `relics.json`, `stages.json`). Chaque entrée garde la base
`{ id, name, rarity, description, type, tags }`. `src/data/data.test.ts` valide
automatiquement la structure de chaque fichier.

## Documentation d'architecture & audits

Le dossier [`docs/`](./docs) contient l'audit complet et les revues :

- [AUDIT](./docs/AUDIT.md) — audit complet (sévérité / impact / reco)
- [ARCHITECTURE](./docs/ARCHITECTURE.md) — structure cible & migration
- [DESIGN](./docs/DESIGN.md) — design system + revue UI/UX (top 20)
- [PERFORMANCE](./docs/PERFORMANCE.md) — bundle & code splitting
- [TYPESCRIPT](./docs/TYPESCRIPT.md) — typage strict & validation runtime
- [TESTING](./docs/TESTING.md) — stratégie et roadmap de tests
- [DX](./docs/DX.md) — outillage & conventions
- [ROADMAP](./docs/ROADMAP.md) — feuille de route V2 priorisée
