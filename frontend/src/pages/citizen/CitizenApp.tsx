import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { MapPin, LogOut, Plus, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useIssues } from '../../context/IssuesContext'
import { IssueCard } from '../../components/shared'
import { ReportPage } from '../public/ReportPage'
import { DetailsPage } from '../public/DetailsPage'
import { CityProgressPage } from './CityProgressPage'

function CitizenTopBar() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const { issues } = useIssues()
  const myIssues = issues.filter(i => i.citizenId === auth?.id)
  const openCount = myIssues.filter(i => !['resolved', 'duplicate'].includes(i.status)).length

  const TABS = [
    { to: '/citizen/my',       label: 'My Issues' },
    { to: '/citizen/all',      label: 'All Issues' },
    { to: '/citizen/progress', label: 'City Progress' },
    { to: '/citizen/report',   label: '+ Report' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e4e8ef]" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.05)' }}>
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#1a3353' }}><MapPin size={13} color="white" strokeWidth={2.5} /></div>
          <span className="font-display text-[15px]" style={{ fontWeight: 800, color: '#1a3353' }}>CIVIC<span style={{ color: '#16a34a' }}>FIX</span></span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#dbeafe', color: '#1d4ed8', fontWeight: 600 }}>Citizen</span>
        </div>
        <nav className="hidden sm:flex items-center gap-0.5">
          {TABS.map(t => (
            <NavLink key={t.to} to={t.to}
              className={({ isActive }) => `relative px-3 py-1.5 text-[13px] font-medium rounded-lg ${isActive ? 'bg-[#f0f4f8] text-[#1a3353] font-semibold' : 'text-[#5a6a7e]'}`}>
              {t.label}
              {t.to === '/citizen/my' && openCount > 0 && (
                <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#fef2f2', color: '#dc2626' }}>{openCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#f0f4f8' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: '#1d4ed8' }}>{auth?.name.charAt(0)}</div>
            <span className="text-xs font-medium hidden sm:block" style={{ color: '#0f1923' }}>{auth?.name.split(' ')[0]}</span>
          </div>
          <button onClick={logout} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7a8697] hover:bg-[#f0f4f8]"><LogOut size={15} /></button>
        </div>
      </div>
      <div className="sm:hidden flex border-t border-[#e4e8ef]">
        {TABS.map(t => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => `flex-1 py-2.5 text-[10px] font-semibold text-center ${isActive ? 'text-[#1a3353] border-b-2 border-[#1a3353]' : 'text-[#7a8697] border-b-2 border-transparent'}`}>
            {t.label}
          </NavLink>
        ))}
      </div>
    </header>
  )
}

function MyIssues() {
  const { auth } = useAuth()
  const { issues } = useIssues()
  const navigate = useNavigate()
  const myIssues = issues.filter(i => i.citizenId === auth?.id)
  const openCount = myIssues.filter(i => !['resolved', 'duplicate'].includes(i.status)).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl" style={{ color: '#0f1923', fontWeight: 800 }}>My Reports</h1>
          <p className="text-sm text-[#7a8697]">{myIssues.length} total · {openCount} active</p>
        </div>
        <button onClick={() => navigate('/citizen/report')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl" style={{ background: '#1a3353' }}>
          <Plus size={15} /> Report Issue
        </button>
      </div>
      {myIssues.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#e4e8ef]">
          <MapPin size={32} color="#c8d0dc" className="mx-auto mb-3" />
          <div className="text-sm font-medium text-[#4a5568]">No reports yet</div>
          <p className="text-xs text-[#7a8697] mt-1 mb-4">Submit your first civic issue to get started</p>
          <button onClick={() => navigate('/citizen/report')} className="px-4 py-2 text-sm font-semibold text-white rounded-xl" style={{ background: '#1a3353' }}>Report an Issue</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {myIssues.map(iss => <IssueCard key={iss.id} issue={iss} mine href={`/citizen/issues/${iss.id}`} />)}
        </div>
      )}
    </div>
  )
}

function AllIssues() {
  const { issues } = useIssues()
  const { auth } = useAuth()
  const allIssues = issues.filter(i => i.status !== 'duplicate')
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-xl mb-1" style={{ color: '#0f1923', fontWeight: 800 }}>All City Issues</h1>
        <p className="text-sm text-[#7a8697]">{allIssues.length} active issues reported across Pune</p>
      </div>
      <div className="flex flex-col gap-3">
        {allIssues.map(iss => <IssueCard key={iss.id} issue={iss} mine={iss.citizenId === auth?.id} href={`/citizen/issues/${iss.id}`} />)}
      </div>
    </div>
  )
}

export function CitizenApp() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <CitizenTopBar />
      <Routes>
        <Route path="/" element={<Navigate to="/citizen/my" replace />} />
        <Route path="/citizen/my" element={<MyIssues />} />
        <Route path="/citizen/all" element={<AllIssues />} />
        <Route path="/citizen/progress" element={<CityProgressPage />} />
        <Route path="/citizen/report" element={<ReportPage />} />
        <Route path="/citizen/issues/:id" element={<DetailsPage />} />
        <Route path="*" element={<Navigate to="/citizen/my" replace />} />
      </Routes>
    </div>
  )
}
