import type { Goal, Priority } from '@/types/domain'

export const GOALS = [
  'push_stage',
  'farm_gold',
  'boss',
  'survie',
] as const satisfies readonly Goal[]

export const goalLabels: Record<Goal, string> = {
  push_stage: 'Push stage',
  farm_gold: 'Farm or',
  boss: 'Boss',
  survie: 'Survie',
}

export const priorityLabels: Record<Priority, string> = {
  'very-high': 'Priorité très élevée',
  high: 'Priorité élevée',
  medium: 'Priorité moyenne',
  low: 'Priorité faible',
}

export function isGoal(value: string): value is Goal {
  return (GOALS as readonly string[]).includes(value)
}
