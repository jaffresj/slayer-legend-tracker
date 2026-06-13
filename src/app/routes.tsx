import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

// Chaque page est un chunk séparé : seul le code de la route visitée est
// téléchargé. Le bundle initial ne contient plus ni Recharts (dashboard/
// history) ni les pages lourdes.
const DashboardPage = lazy(() => import('@/features/dashboard'))
const HistoryPage = lazy(() => import('@/features/history'))
const ProfilePage = lazy(() => import('@/features/profile'))
const BuildsPage = lazy(() => import('@/features/builds'))
const DailyPage = lazy(() => import('@/features/daily'))
const SettingsPage = lazy(() => import('@/features/settings'))

function RouteFallback() {
  return (
    <div className="flex min-h-64 items-center justify-center text-sm text-slate-500" role="status">
      Chargement…
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/builds" element={<BuildsPage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
