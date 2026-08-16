import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navbar } from '../components/layout'

// Public pages
import { HomePage }      from '../pages/public/HomePage'
import { AboutPage }     from '../pages/public/AboutPage'
import { CommunityPage } from '../pages/public/CommunityPage'
import { ReportPage }    from '../pages/public/ReportPage'
import { TrackPage }     from '../pages/public/TrackPage'
import { DetailsPage }   from '../pages/public/DetailsPage'
import { LoginPage }     from '../pages/public/LoginPage'

// Role apps
import { CitizenApp }   from '../pages/citizen/CitizenApp'
import { AuthorityApp } from '../pages/authority/AuthorityApp'
import { WorkerApp }    from '../pages/worker/WorkerApp'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export function AppRouter() {
  const { auth } = useAuth()

  if (auth?.role === 'citizen')   return <CitizenApp />
  if (auth?.role === 'authority') return <AuthorityApp />
  if (auth?.role === 'worker')    return <WorkerApp />

  return (
    <Routes>
      <Route path="/"          element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/about"     element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/community" element={<PublicLayout><CommunityPage /></PublicLayout>} />
      <Route path="/report"    element={<PublicLayout><ReportPage /></PublicLayout>} />
      <Route path="/track"     element={<PublicLayout><TrackPage /></PublicLayout>} />
      <Route path="/issues/:id" element={<PublicLayout><DetailsPage /></PublicLayout>} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  )
}
