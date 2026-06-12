import { BarChart3, ClipboardCheck, FileJson, Home, Swords, Upload, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/import', label: 'Import', icon: Upload },
  { to: '/history', label: 'Historique', icon: BarChart3 },
  { to: '/profile', label: 'Profil', icon: UserRound },
  { to: '/builds', label: 'Builds', icon: Swords },
  { to: '/daily', label: 'Daily', icon: ClipboardCheck },
  { to: '/settings', label: 'Données', icon: FileJson },
]
