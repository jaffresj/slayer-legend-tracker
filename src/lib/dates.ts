export function getTodayKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDateTimeKey() {
  return new Date().toISOString()
}

export function formatDateKey(dateKey: string) {
  const parsed = new Date(dateKey)
  if (Number.isNaN(parsed.getTime())) return dateKey
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(parsed)
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
