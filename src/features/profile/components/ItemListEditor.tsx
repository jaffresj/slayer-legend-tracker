import { Plus, Trash2 } from 'lucide-react'
import { Button, EmptyState, Select } from '@/components/ui'
import { makeId } from '@/lib/dates'
import { parseNumberInput } from '@/lib/format'
import type { Rarity, TaggedGameItem } from '@/types/domain'

// Forme commune aux compagnons / équipements / reliques (équipé optionnel).
export type EditableProfileItem = TaggedGameItem & { level: number; equipped?: boolean }

const RARITIES: Rarity[] = ['commun', 'rare', 'epique', 'legendaire', 'mythique']
const rarityOptions = RARITIES.map((rarity) => ({
  value: rarity,
  label: rarity.charAt(0).toUpperCase() + rarity.slice(1),
}))

type ItemListEditorProps = {
  items: EditableProfileItem[]
  onChange: (items: EditableProfileItem[]) => void
  /** Affiche la case « équipé » (équipements). */
  withEquipped?: boolean
  /** Nom au singulier, ex. « compagnon » — sert d'id par défaut et de libellé. */
  itemNoun: string
}

/**
 * Éditeur structuré d'une liste d'objets du profil : remplace l'édition JSON
 * brute par des champs (nom, rareté, niveau, équipé). Ajout / retrait inline.
 */
export function ItemListEditor({ items, onChange, withEquipped, itemNoun }: ItemListEditorProps) {
  function addItem() {
    onChange([
      ...items,
      {
        id: makeId(itemNoun),
        name: '',
        rarity: 'commun',
        description: '',
        type: itemNoun,
        tags: [],
        level: 1,
        ...(withEquipped ? { equipped: false } : {}),
      },
    ])
  }

  function patchItem(id: string, patch: Partial<EditableProfileItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  return (
    <div className="grid gap-3">
      {items.length ? (
        <ul className="grid gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-800 bg-slate-950/55 p-3"
            >
              <label className="grid min-w-44 flex-1 gap-1 text-xs text-slate-400">
                Nom
                <input
                  value={item.name}
                  onChange={(event) => patchItem(item.id, { name: event.target.value })}
                  placeholder={`Nom du ${itemNoun}`}
                  className="h-9 rounded-lg border border-slate-700 bg-slate-950 px-2 text-sm text-slate-100 outline-none focus-visible:border-amber-300 focus-visible:ring-2 focus-visible:ring-amber-300/40"
                />
              </label>

              <div className="grid w-32 gap-1 text-xs text-slate-400">
                <span>Rareté</span>
                <Select
                  value={item.rarity}
                  onChange={(value) => patchItem(item.id, { rarity: value as Rarity })}
                  options={rarityOptions}
                  aria-label="Rareté"
                />
              </div>

              <label className="grid w-20 gap-1 text-xs text-slate-400">
                Niveau
                <input
                  type="number"
                  min={0}
                  value={item.level}
                  onChange={(event) =>
                    patchItem(item.id, { level: parseNumberInput(event.target.value) })
                  }
                  className="h-9 rounded-lg border border-slate-700 bg-slate-950 px-2 text-sm text-slate-100 outline-none focus-visible:border-amber-300 focus-visible:ring-2 focus-visible:ring-amber-300/40"
                />
              </label>

              {withEquipped ? (
                <label className="flex h-9 items-center gap-2 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={item.equipped ?? false}
                    onChange={(event) => patchItem(item.id, { equipped: event.target.checked })}
                    className="size-4 accent-amber-300"
                  />
                  Équipé
                </label>
              ) : null}

              <Button
                variant="secondary"
                size="sm"
                onClick={() => onChange(items.filter((current) => current.id !== item.id))}
                aria-label={`Retirer ${item.name || itemNoun}`}
                className="size-9 px-0 hover:border-rose-400/50 hover:text-rose-200"
                icon={<Trash2 size={15} />}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={`Aucun ${itemNoun}`} description="Ajoute une entrée ci-dessous." />
      )}

      <Button
        variant="secondary"
        onClick={addItem}
        icon={<Plus size={16} />}
        className="justify-self-start"
      >
        Ajouter un {itemNoun}
      </Button>
    </div>
  )
}
