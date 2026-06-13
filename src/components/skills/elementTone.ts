import type { BadgeTone } from '@/components/ui'
import type { SkillElement } from '@/types/domain'

export const elementTone: Record<SkillElement, BadgeTone> = {
  feu: 'rose',
  glace: 'cyan',
  foudre: 'amber',
  terre: 'emerald',
  vent: 'neutral',
  eau: 'cyan',
  neutre: 'neutral',
}
