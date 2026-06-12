export type Goal = 'push_stage' | 'farm_gold' | 'boss' | 'survie'

export type Priority = 'very-high' | 'high' | 'medium' | 'low'

export type Rarity = 'exemple' | 'commun' | 'rare' | 'epique' | 'legendaire' | 'mythique'

export type PlayerInfo = {
  name: string
  level: number
  stage: number
  zone: string
}

export type PlayerResources = {
  diamonds: number
  emeralds: number
  gold: number
  souls: number
}

export type PlayerStats = {
  attack: number
  estimatedDamage: number
  criticalRate: number
  criticalDamage: number
  deathStrike: number
  goldPerMinute: number
  health: number
  defense: number
}

export type GrowthData = {
  attack: number
  health: number
  recovery: number
  critical: number
  deathStrike: number
}

export type TaggedGameItem = {
  id: string
  name: string
  rarity: Rarity
  description: string
  type: string
  tags: string[]
}

export type PlayerSkill = TaggedGameItem & {
  level: number
  equipped: boolean
}

export type PlayerCompanion = TaggedGameItem & {
  level: number
}

export type PlayerEquipment = TaggedGameItem & {
  level: number
  equipped: boolean
}

export type PlayerRelic = TaggedGameItem & {
  level: number
}

export type Stage = TaggedGameItem & {
  stage: number
  zone: string
  recommendedAttack: number
}

export type PlayerProfile = {
  player: PlayerInfo
  resources: PlayerResources
  stats: PlayerStats
  growth: GrowthData
  skills: PlayerSkill[]
  companions: PlayerCompanion[]
  equipment: PlayerEquipment[]
  relics: PlayerRelic[]
}

export type ProfileUpdate = {
  player?: Partial<PlayerInfo>
  resources?: Partial<PlayerResources>
  stats?: Partial<PlayerStats>
  growth?: Partial<GrowthData>
  skills?: PlayerProfile['skills']
  companions?: PlayerProfile['companions']
  equipment?: PlayerProfile['equipment']
  relics?: PlayerProfile['relics']
}

export type Snapshot = {
  id: string
  date: string
  level: number
  stage: number
  attack: number
  criticalRate: number
  deathStrike: number
  goldPerMinute: number
}

export type RecommendationCategory = 'stat' | 'growth' | 'skill' | 'resource' | 'build'

export type Recommendation = {
  id: string
  name: string
  score: number
  priority: Priority
  reason: string
  category: RecommendationCategory
}

export type Build = {
  id: string
  name: string
  description: string
  goal: Goal
  skills: string[]
  createdAt: string
}

export type DailyTask = {
  id: string
  label: string
  done: boolean
}

export type DailyChecklist = {
  date: string
  tasks: DailyTask[]
  notes: string
}

export type AppExport = {
  version: 1
  exportedAt: string
  profile: PlayerProfile
  snapshots: Snapshot[]
  builds: Build[]
  daily: DailyChecklist
}
