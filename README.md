# Slayer Legends Progression Helper

Application web locale d'aide à la progression pour Slayer Legends: Idle RPG.

Cette V1 n'automatise jamais le jeu : pas de clic automatique, pas de bot, pas de lecture temps réel de l'écran, pas d'injection et pas d'autofarm. Elle analyse uniquement des données saisies ou des captures importées par le joueur.

## Installation

```bash
npm install
```

## Lancement

```bash
npm run dev
```

Build de vérification :

```bash
npm run build
```

## Structure du projet

- `src/pages` : pages principales (`/`, `/import`, `/history`, `/profile`, `/builds`, `/daily`, `/settings`).
- `src/stores` : stores Zustand persistés dans LocalStorage.
- `src/features/ocr` : OCR Tesseract.js et extracteurs texte.
- `src/features/recommendations` : moteur de priorités.
- `src/data` : données JSON d'exemple, non officielles.
- `src/types` : types TypeScript partagés.

## Ajouter un parseur OCR

Les extracteurs se trouvent dans `src/features/ocr/extractors.ts`.

Pour améliorer l'OCR :

1. Ajouter une nouvelle règle dans `extractPlayerData`, `extractStats`, `extractSkills` ou `extractGrowth`.
2. Garder une valeur éditable dans la page `/import`.
3. Tester avec une capture réelle puis vérifier le profil avant sauvegarde.

## Ajouter des données du jeu

Les fichiers modifiables sont :

- `src/data/skills.json`
- `src/data/companions.json`
- `src/data/equipment.json`
- `src/data/relics.json`
- `src/data/stages.json`

Chaque entrée doit garder cette base :

```json
{
  "id": "sample-id",
  "name": "Nom",
  "rarity": "exemple",
  "description": "Donnée d'exemple non officielle.",
  "type": "type",
  "tags": ["tag"]
}
```

Remplacer les données d'exemple uniquement par des données que vous avez le droit d'utiliser.
