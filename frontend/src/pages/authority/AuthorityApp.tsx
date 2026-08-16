import { useState } from 'react'
import {
  MapPin, LayoutDashboard, AlertCircle, Map, Cpu, Users,
  BarChart2, Settings, Bell, LogOut, ChevronDown, X,
  CheckCircle2, Wrench, Zap, TrendingUp, ArrowUpRight,
  Filter, RefreshCw, Clock, Eye, UserCheck
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'
import CityMap from '../../components/CityMap'
import { useAuth } from '../../context/AuthContext'
import { useIssues } from '../../context/IssuesContext'
import { WORKERS } from '../../data/seed'
import type { Issue, Worker } from '../../types'

// ── helpers ──────────────────────────────────────────────────────────────────
const PC: Record<string, { label: string; bg: string; c: string }> = {
  urgent: { label: 'Urgent', bg: '#fef2f2', c: '#dc2626' },
  high:   { label: 'High',   bg: '#fffbeb', c: '#d97706' },
  medium: { label: 'Medium', bg: '#fefce8', c: '#ca8a04' },
  low:    { label: 'Low',    bg: '#f0fdf4', c: '#16a34a' },
}
const SC: Record<string, { label: string; bg: string; c: string }> = {
  pending_ai:      { label: 'Analyzing',      bg: '#eff6ff', c: '#1d4ed8' },
  duplicate:       { label: 'Duplicate',      bg: '#fdf4ff', c: '#9333ea' },
  open:            { label: 'Open',           bg: '#f1f5f9', c: '#475569' },
  rejected:        { label: 'Rejected',       bg: '#fef2f2', c: '#dc2626' },
  assigned:        { label: 'Assigned',       bg: '#f5f3ff', c: '#7c3aed' },
  accepted:        { label: 'Accepted',       bg: '#eff6ff', c: '#1d4ed8' },
  in_progress:     { label: 'In Progress',    bg: '#fffbeb', c: '#b45309' },
  proof_submitted: { label: 'Proof Received', bg: '#fdf4ff', c: '#9333ea' },
  verified:        { label: 'Verified',       bg: '#f0fdf4', c: '#16a34a' },
  resolved:        { label: 'Resolved',       bg: '#f0fdf4', c: '#16a34a' },
}

const WEEKLY = [
  { day: 'Mon', reported: 48, resolved: 32 },
  { day: 'Tue', reported: 62, resolved: 45 },
  { day: 'Wed', reported: 55, resolved: 50 },
  { day: 'Thu', reported: 71, resolved: 58 },
  { day: 'Fri', reported: 80, resolved: 64 },
  { day: 'Sat', reported: 45, resolved: 38 },
  { day: 'Sun', reported: 30, resolved: 28 },
]
const CATEGORY_DATA = [
  { name: 'Roads',      value: 38, color: '#dc2626' },
  { name: 'Sanitation', value: 22, color: '#d97706' },
  { name: 'Electrical', value: 16, color: '#ca8a04' },
  { name: 'Water',      value: 14, color: '#1d4ed8' },
  { name: 'Drainage',   value: 10, color: '#16a34a' },
]

type Section = 'dashboard' | 'issues' | 'map' | 'ai' | 'workers' | 'analytics'
const NAV: { id: Section; label: string; icon: React.FC<{ size: number; color: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'issues',    label: 'Issues',        icon: AlertCircle },
  { id: 'map',       label: 'Live Map',      icon: Map },
  { id: 'ai',        label: 'AI Insights',   icon: Cpu },
  { id: 'workers',   label: 'Team Coordinators', icon: Users },
  { id: 'analytics', label: 'Analytics',     icon: BarChart2 },
]
const avatarColors = ['#1a3353','#16a34a','#d97706','#1d4ed8','#7c3aed']

// ── Assign Modal ──────────────────────────────────────────────────────────────
function AssignModal({
  issue, workers, onAssign, onClose
}: { issue: Issue; workers: Worker[]; onAssign: (workerId: string, workerName: string) => void; onClose: () => void }) {
  const [selected, setSelected] = useState('')
  const [done, setDone] = useState(false)
  const available = workers.filter(w => w.available)

  const handleAssign = () => {
    const w = workers.find(w => w.id === selected)
    if (!w) return
    onAssign(w.id, w.name)
    setDone(true)
  }

  if (done) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,25,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#f0fdf4' }}>
          <CheckCircle2 size={28} color="#16a34a" />
        </div>
        <h3 className="font-display font-700 text-base mb-1.5" style={{ color: '#0f1923', fontWeight: 700 }}>Worker Assigned!</h3>
        <p className="text-sm text-[#4a5568] mb-5">{workers.find(w => w.id === selected)?.name} has been notified and will receive the task details.</p>
        <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: '#1a3353' }}>Done</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,25,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-700 text-base" style={{ color: '#0f1923', fontWeight: 700 }}>Assign Worker</h3>
            <div className="text-xs text-[#7a8697] mt-0.5">{issue.id} · {issue.type} · {issue.location}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f0f4f8]"><X size={15} color="#7a8697" /></button>
        </div>

        <div className="flex flex-col gap-2 mb-5">
          {available.map((w, i) => (
            <button key={w.id}
              onClick={() => setSelected(w.id)}
              className="flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all"
              style={{ borderColor: selected === w.id ? '#1a3353' : '#e4e8ef', background: selected === w.id ? '#f0f4f8' : '#fff' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: avatarColors[i % 5] }}>{w.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: '#0f1923' }}>{w.name}</div>
                <div className="text-xs text-[#7a8697]">{w.team} · {w.distance} · {w.activeTasks} tasks</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a' }}>Available</span>
                <span className="text-[10px] text-[#7a8697]">Perf. {w.performance}%</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-[#e4e8ef]" style={{ color: '#4a5568' }}>Cancel</button>
          <button onClick={handleAssign} disabled={!selected}
            className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-40"
            style={{ background: '#1a3353' }}>
            <UserCheck size={14} className="inline mr-1.5" /> Assign Worker
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Verify Modal ──────────────────────────────────────────────────────────────
function VerifyModal({ issue, onVerify, onClose }: { issue: Issue; onVerify: () => void; onClose: () => void }) {
  const [done, setDone] = useState(false)

  if (done) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,25,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#f0fdf4' }}>
          <CheckCircle2 size={28} color="#16a34a" />
        </div>
        <h3 className="font-display font-700 text-base mb-1.5" style={{ color: '#0f1923', fontWeight: 700 }}>Issue Resolved!</h3>
        <p className="text-sm text-[#4a5568] mb-5">Resolution verified and citizen has been notified. Issue is now closed.</p>
        <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: '#16a34a' }}>Done</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,25,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-700 text-base" style={{ color: '#0f1923', fontWeight: 700 }}>Verify Resolution</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f0f4f8]"><X size={15} color="#7a8697" /></button>
        </div>
        <div className="p-4 rounded-xl mb-4 border border-[#e4e8ef]" style={{ background: '#f8f9fb' }}>
          <div className="text-xs text-[#7a8697] mb-1">Issue</div>
          <div className="text-sm font-semibold" style={{ color: '#0f1923' }}>{issue.id} · {issue.type} · {issue.location}</div>
          <div className="text-xs text-[#4a5568] mt-1">Proof submitted by {issue.assignedWorkerName}</div>
          {issue.proofDescription && (
            <div className="text-xs mt-2 px-3 py-2 rounded-lg" style={{ background: '#f0fdf4', color: '#15803d' }}>
              "{issue.proofDescription}"
            </div>
          )}
        </div>
        <p className="text-sm text-[#4a5568] mb-5">Review the worker's proof and confirm the issue has been properly resolved. The citizen will be notified automatically.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-[#e4e8ef]" style={{ color: '#4a5568' }}>Reject Proof</button>
          <button onClick={() => { onVerify(); setDone(true) }} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: '#16a34a' }}>
            <CheckCircle2 size={14} className="inline mr-1.5" /> Verify & Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Issue Row ─────────────────────────────────────────────────────────────────
function IssueRow({ issue, onAssign, onVerify, onView }: {
  issue: Issue; onAssign: (i: Issue) => void; onVerify: (i: Issue) => void; onView: (i: Issue) => void
}) {
  const s = SC[issue.status] ?? { label: issue.status, bg: '#f1f5f9', c: '#475569' }
  const p = PC[issue.priority] ?? PC.medium
  return (
    <tr className="border-b border-[#f4f6f9] hover:bg-[#fafbfd] transition-colors">
      <td className="px-4 py-3.5 text-[11px] font-mono font-semibold text-[#7a8697]">{issue.id}</td>
      <td className="px-4 py-3.5">
        <div className="text-sm font-medium" style={{ color: '#0f1923' }}>{issue.type}</div>
        <div className="text-xs text-[#7a8697]">{issue.location}</div>
      </td>
      <td className="px-4 py-3.5 text-xs text-[#7a8697]">{issue.ward}</td>
      <td className="px-4 py-3.5">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: p.bg, color: p.c }}>{p.label}</span>
      </td>
      <td className="px-4 py-3.5">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: s.bg, color: s.c }}>{s.label}</span>
      </td>
      <td className="px-4 py-3.5 text-xs text-[#7a8697]">{issue.assignedWorkerName ?? '—'}</td>
      <td className="px-4 py-3.5 text-xs text-[#7a8697] whitespace-nowrap">{issue.submittedAt.split(',')[0]}</td>
      <td className="px-4 py-3.5">
        <div className="flex gap-1.5">
          <button onClick={() => onView(issue)} className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#e4e8ef]" style={{ color: '#4a5568' }}>View</button>
          {(issue.status === 'open' || issue.status === 'pending_ai' || issue.status === 'rejected') && (
            <button onClick={() => onAssign(issue)} className="px-2.5 py-1 text-xs font-semibold rounded-lg text-white" style={{ background: '#1a3353' }}>Assign</button>
          )}
          {issue.status === 'proof_submitted' && (
            <button onClick={() => onVerify(issue)} className="px-2.5 py-1 text-xs font-semibold rounded-lg text-white" style={{ background: '#16a34a' }}>Verify</button>
          )}
        </div>
      </td>
    </tr>
  )
}

// ── Issue Detail (authority view) ─────────────────────────────────────────────
function AuthorityIssueDetail({ issue, workers, onAssign, onVerify, onBack }: {
  issue: Issue; workers: Worker[]; onAssign: (wid: string, wname: string) => void; onVerify: () => void; onBack: () => void
}) {
  const [showAssign, setShowAssign] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const s = SC[issue.status] ?? { label: issue.status, bg: '#f1f5f9', c: '#475569' }
  const p = PC[issue.priority] ?? PC.medium

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: '#7a8697' }}>← Back to Issues</button>
      <div className="bg-white rounded-2xl border border-[#e4e8ef] p-6 mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[11px] font-mono font-semibold text-[#7a8697]">{issue.id}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: p.bg, color: p.c }}>{p.label}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: s.bg, color: s.c }}>{s.label}</span>
        </div>
        <h2 className="font-display font-700 text-xl mb-3" style={{ color: '#0f1923', fontWeight: 700 }}>{issue.type} — {issue.location}</h2>
        <p className="text-sm text-[#4a5568] mb-4">{issue.description}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {[
            { l: 'Citizen', v: issue.citizenName },
            { l: 'Ward', v: issue.ward },
            { l: 'Submitted', v: issue.submittedAt },
            { l: 'AI Category', v: issue.aiCategory },
            { l: 'AI Confidence', v: `${issue.aiConfidence}%` },
            { l: 'AI Severity', v: issue.aiSeverity },
          ].map(f => (
            <div key={f.l}><div className="text-xs text-[#7a8697] mb-0.5">{f.l}</div><div className="text-sm font-medium" style={{ color: '#0f1923' }}>{f.v}</div></div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(issue.status === 'open' || issue.status === 'pending_ai' || issue.status === 'rejected') && (
            <button onClick={() => setShowAssign(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl" style={{ background: '#1a3353' }}>
              <UserCheck size={15} /> Assign Worker
            </button>
          )}
          {issue.status === 'proof_submitted' && (
            <button onClick={() => setShowVerify(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl" style={{ background: '#16a34a' }}>
              <CheckCircle2 size={15} /> Verify & Close
            </button>
          )}
        </div>
      </div>
      {/* Activity */}
      <div className="bg-white rounded-2xl border border-[#e4e8ef] p-6">
        <div className="font-display font-700 text-sm mb-4" style={{ color: '#0f1923', fontWeight: 700 }}>Activity Log</div>
        <div className="flex flex-col gap-0">
          {issue.updates.map((u, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold"
                  style={{ background: u.byRole === 'ai' ? '#1d4ed8' : u.byRole === 'authority' ? '#1a3353' : u.byRole === 'worker' ? '#16a34a' : '#7c3aed' }}>
                  {u.byRole === 'ai' ? <Cpu size={11} /> : u.by.charAt(0)}
                </div>
                {i < issue.updates.length - 1 && <div className="w-px flex-1 my-1 min-h-[20px]" style={{ background: '#e4e8ef' }} />}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: '#0f1923' }}>{u.by}</span>
                  <span className="text-[10px] text-[#7a8697]">{u.time}</span>
                </div>
                <p className="text-xs text-[#4a5568]">{u.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAssign && <AssignModal issue={issue} workers={workers} onAssign={(wid, wname) => { onAssign(wid, wname); setShowAssign(false) }} onClose={() => setShowAssign(false)} />}
      {showVerify && <VerifyModal issue={issue} onVerify={onVerify} onClose={() => { setShowVerify(false) }} />}
    </div>
  )
}

// ── Main AuthorityApp ─────────────────────────────────────────────────────────
export function AuthorityApp() {
  const { auth, logout } = useAuth()
  const { issues, assignWorker, verifyIssue } = useIssues()
  const workers = WORKERS
  const onAssignWorker = (issueId: string, workerId: string, workerName: string) =>
    assignWorker(issueId, workerId, workerName, auth?.name ?? 'Authority')
  const onVerifyIssue = (issueId: string) => verifyIssue(issueId, auth?.name ?? 'Authority')
  const onLogout = logout
  const [section, setSection] = useState<Section>('dashboard')
  const [detailIssue, setDetailIssue] = useState<Issue | null>(null)
  const [assignTarget, setAssignTarget] = useState<Issue | null>(null)
  const [verifyTarget, setVerifyTarget] = useState<Issue | null>(null)
  const [statusFilter, setStatusFilter] = useState('All')

  const open = issues.filter(i => !['resolved','duplicate'].includes(i.status)).length
  const high = issues.filter(i => ['urgent','high'].includes(i.priority) && i.status !== 'resolved').length
  const inProg = issues.filter(i => ['in_progress','accepted','assigned'].includes(i.status)).length
  const resolved = issues.filter(i => i.status === 'resolved').length
  const proofPending = issues.filter(i => i.status === 'proof_submitted').length

  const STATUSES = ['All','open','rejected','assigned','in_progress','proof_submitted','resolved']
  const filteredIssues = statusFilter === 'All' ? issues.filter(i => i.status !== 'duplicate') :
    issues.filter(i => i.status === statusFilter)

  const aiQueue = [...issues]
    .filter(i => !['resolved','duplicate'].includes(i.status))
    .sort((a, b) => {
      const order = { urgent: 0, high: 1, medium: 2, low: 3 }
      return order[a.priority] - order[b.priority]
    })

  if (detailIssue) {
    const current = issues.find(i => i.id === detailIssue.id) ?? detailIssue
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <AuthTopBar auth={auth} onLogout={onLogout} section={section} setSection={s => { setSection(s); setDetailIssue(null) }} proofPending={proofPending} />
        <AuthorityIssueDetail
          issue={current}
          workers={workers}
          onAssign={(wid, wname) => onAssignWorker(current.id, wid, wname)}
          onVerify={() => onVerifyIssue(current.id)}
          onBack={() => setDetailIssue(null)}
        />
      </div>
    )
  }

  return (
    <div className="flex h-screen" style={{ background: '#f5f7fa' }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col bg-white border-r border-[#e4e8ef] shrink-0" style={{ width: 212 }}>
        <div className="px-4 py-4 border-b border-[#e4e8ef]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#1a3353' }}>
              <MapPin size={13} color="white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px]" style={{ fontWeight: 800, color: '#1a3353' }}>
              CIVIC<span style={{ color: '#16a34a' }}>FIX</span>
            </span>
          </div>
          <div className="text-[10px] text-[#7a8697] mt-0.5 ml-9">Authority Dashboard</div>
        </div>
        <div className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map(link => (
            <button key={link.id} onClick={() => setSection(link.id)}
              className={`sidebar-link ${section === link.id ? 'active' : ''}`}>
              <link.icon size={15} color={section === link.id ? 'white' : '#4a5568'} />
              <span>{link.label}</span>
              {link.id === 'issues' && proofPending > 0 && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: section === 'issues' ? 'rgba(255,255,255,0.25)' : '#fef2f2', color: section === 'issues' ? 'white' : '#dc2626' }}>
                  {proofPending}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="border-t border-[#e4e8ef] px-3 py-3">
          <button className="sidebar-link mb-1"><Settings size={15} color="#4a5568" /><span>Settings</span></button>
          <div className="flex items-center gap-2.5 px-3 py-2 mt-1 rounded-xl" style={{ background: '#f8f9fb' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ background: '#1a3353' }}>MA</div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: '#0f1923' }}>{auth?.name}</div>
              <div className="text-[10px] text-[#7a8697]">PMC · Ward Admin</div>
            </div>
          </div>
          <button onClick={onLogout} className="sidebar-link mt-1 text-red-500"><LogOut size={15} color="#ef4444" /><span className="text-red-500">Logout</span></button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar — mobile only */}
        <header className="lg:hidden bg-white border-b border-[#e4e8ef] px-4 h-14 flex items-center justify-between shrink-0">
          <span className="font-display font-800 text-[15px]" style={{ color: '#1a3353', fontWeight: 800 }}>
            CIVIC<span style={{ color: '#16a34a' }}>FIX</span>
          </span>
          <div className="flex gap-1">
            {NAV.slice(0, 4).map(n => (
              <button key={n.id} onClick={() => setSection(n.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center ${section === n.id ? 'bg-[#1a3353]' : 'hover:bg-[#f0f4f8]'}`}>
                <n.icon size={15} color={section === n.id ? 'white' : '#4a5568'} />
              </button>
            ))}
            <button onClick={onLogout} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f0f4f8]"><LogOut size={15} color="#4a5568" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {/* Desktop header */}
          <div className="hidden lg:flex sticky top-0 bg-white border-b border-[#e4e8ef] px-6 py-3 items-center justify-between z-10 shrink-0">
            <div>
              <div className="font-display text-[15px] font-700" style={{ color: '#0f1923', fontWeight: 700 }}>Good morning, {auth?.name}</div>
              <div className="text-xs text-[#7a8697]">Sat 16 Aug 2026 · Pune Municipal Corporation</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#e4e8ef] text-[#4a5568]">
                <RefreshCw size={12} /> Refresh
              </button>
              <div className="relative">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#e4e8ef]">
                  <Bell size={15} color="#4a5568" />
                </button>
                {proofPending > 0 && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />}
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1a3353' }}>MA</div>
                <ChevronDown size={13} color="#7a8697" />
              </div>
              <button onClick={onLogout} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7a8697] hover:bg-[#f0f4f8]"><LogOut size={15} /></button>
            </div>
          </div>

          <div className="p-4 lg:p-6 space-y-5 max-w-[1400px]">
            {/* ── Dashboard ── */}
            {section === 'dashboard' && (
              <>
                {/* KPIs */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { label: 'Open Issues',   value: String(open),     sub: '↑ 12% this week',    icon: AlertCircle, c: '#dc2626', bg: '#fef2f2' },
                    { label: 'High Priority', value: String(high),     sub: 'Requires attention', icon: Zap,         c: '#d97706', bg: '#fffbeb' },
                    { label: 'In Progress',   value: String(inProg),   sub: 'Currently assigned', icon: Wrench,      c: '#1d4ed8', bg: '#eff6ff' },
                    { label: 'Resolved',      value: String(resolved), sub: 'Total closed',        icon: CheckCircle2,c: '#16a34a', bg: '#f0fdf4' },
                  ].map(k => (
                    <div key={k.label} className="bg-white rounded-xl border border-[#e4e8ef] p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: k.bg }}>
                          <k.icon size={17} color={k.c} />
                        </div>
                        <ArrowUpRight size={14} color="#c8d0dc" />
                      </div>
                      <div className="font-display font-800 text-[1.75rem] leading-none mb-1" style={{ color: '#0f1923', fontWeight: 800 }}>{k.value}</div>
                      <div className="text-xs font-semibold text-[#0f1923]">{k.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: k.sub.startsWith('↑') ? '#dc2626' : '#7a8697' }}>{k.sub}</div>
                    </div>
                  ))}
                </div>
                {/* Proof pending alert */}
                {proofPending > 0 && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-l-4" style={{ background: '#fffbeb', borderLeftColor: '#d97706' }}>
                    <Zap size={16} color="#d97706" />
                    <div className="flex-1 text-sm" style={{ color: '#92400e' }}>
                      <strong>{proofPending} issue{proofPending > 1 ? 's' : ''}</strong> ha{proofPending > 1 ? 've' : 's'} worker proof waiting for your verification.
                    </div>
                    <button onClick={() => setSection('issues')} className="text-xs font-semibold" style={{ color: '#d97706' }}>Review Now →</button>
                  </div>
                )}
                {/* Map + AI queue */}
                <div className="grid xl:grid-cols-[1fr_320px] gap-5">
                  <div className="bg-white rounded-xl border border-[#e4e8ef] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="font-display font-700 text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>Live Map</h2>
                        <p className="text-xs text-[#7a8697]">Click a marker for issue details</p>
                      </div>
                      <button onClick={() => setSection('map')} className="text-xs font-medium" style={{ color: '#1a3353' }}>Fullscreen →</button>
                    </div>
                    <CityMap height="280px" />
                  </div>
                  <div className="bg-white rounded-xl border border-[#e4e8ef] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-display font-700 text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>AI Priority Queue</h2>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: '#eff6ff', color: '#1d4ed8' }}><Cpu size={9} /> AI</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {aiQueue.slice(0, 4).map((iss, i) => {
                        const p = PC[iss.priority] ?? PC.medium
                        const scores: Record<string, number> = { urgent: 92, high: 84, medium: 68, low: 45 }
                        return (
                          <button key={iss.id} onClick={() => { setDetailIssue(iss); setSection('issues') }}
                            className="flex items-center gap-3 p-3 rounded-xl border border-[#e4e8ef] text-left hover:border-[#1a3353] transition-colors">
                            <span className="text-[10px] font-mono font-bold text-[#c8d0dc] shrink-0">0{i+1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold truncate" style={{ color: '#0f1923' }}>{iss.type} · {iss.location}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1 rounded-full" style={{ background: '#e4e8ef' }}>
                                  <div className="h-1 rounded-full" style={{ width: `${scores[iss.priority]}%`, background: p.c }} />
                                </div>
                                <span className="text-[10px] font-bold" style={{ color: p.c }}>{scores[iss.priority]}</span>
                              </div>
                            </div>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0" style={{ background: p.bg, color: p.c }}>{p.label}</span>
                          </button>
                        )
                      })}
                    </div>
                    <button onClick={() => setSection('ai')} className="mt-3 w-full py-2 text-xs font-semibold rounded-xl border border-[#e4e8ef]" style={{ color: '#1a3353' }}>View Full AI Insights →</button>
                  </div>
                </div>
                {/* Recent issues table (mini) */}
                <div className="bg-white rounded-xl border border-[#e4e8ef] overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e4e8ef]">
                    <h2 className="font-display font-700 text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>Recent Issues</h2>
                    <button onClick={() => setSection('issues')} className="text-xs font-medium" style={{ color: '#1a3353' }}>View all →</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead style={{ background: '#f8f9fb' }}>
                        <tr>
                          {['ID','Issue','Ward','Priority','Status','Assigned To','Actions'].map(h => (
                            <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#7a8697] whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {issues.filter(i => i.status !== 'duplicate').slice(0, 5).map(iss => (
                          <IssueRow key={iss.id} issue={iss}
                            onAssign={i => setAssignTarget(i)}
                            onVerify={i => setVerifyTarget(i)}
                            onView={i => { setDetailIssue(i); setSection('issues') }}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ── Issues list ── */}
            {section === 'issues' && !detailIssue && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h1 className="font-display font-800 text-xl" style={{ color: '#0f1923', fontWeight: 800 }}>All Issues</h1>
                    <p className="text-sm text-[#7a8697]">{filteredIssues.length} issues</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {STATUSES.map(s => (
                      <button key={s} onClick={() => setStatusFilter(s)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg"
                        style={{ background: statusFilter === s ? '#1a3353' : '#f0f4f8', color: statusFilter === s ? 'white' : '#4a5568' }}>
                        {s === 'All' ? 'All' : SC[s]?.label ?? s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#e4e8ef] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead style={{ background: '#f8f9fb' }}>
                        <tr>
                          {['ID','Issue','Ward','Priority','Status','Assigned To','Submitted','Actions'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#7a8697] whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIssues.map(iss => (
                          <IssueRow key={iss.id} issue={iss}
                            onAssign={i => setAssignTarget(i)}
                            onVerify={i => setVerifyTarget(i)}
                            onView={i => setDetailIssue(i)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Live Map ── */}
            {section === 'map' && (
              <div>
                <h1 className="font-display font-800 text-xl mb-5" style={{ color: '#0f1923', fontWeight: 800 }}>Live City Map</h1>
                <div className="bg-white rounded-xl border border-[#e4e8ef] p-5">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Issue Type','Priority','Ward','Status'].map(f => (
                      <button key={f} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-[#e4e8ef] text-[#4a5568]">
                        <Filter size={11} /> {f} <ChevronDown size={10} />
                      </button>
                    ))}
                  </div>
                  <CityMap height="500px" />
                </div>
              </div>
            )}

            {/* ── AI Insights ── */}
            {section === 'ai' && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <h1 className="font-display font-800 text-xl" style={{ color: '#0f1923', fontWeight: 800 }}>AI Insights</h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: '#eff6ff', color: '#1d4ed8' }}><Cpu size={10} /> AI-Assisted Prioritization</span>
                </div>
                <div className="grid lg:grid-cols-2 gap-5">
                  {aiQueue.map((iss, i) => {
                    const p = PC[iss.priority] ?? PC.medium
                    const scores: Record<string, number> = { urgent: 92, high: 84, medium: 68, low: 45 }
                    const reasons: Record<string, string> = {
                      urgent: 'Critical infrastructure failure, immediate public safety risk, high population exposure',
                      high: 'Significant inconvenience, risk of escalation if not resolved within 48h',
                      medium: 'Moderate impact, pre-monsoon risk factor, residential area',
                      low: 'Low current impact, routine maintenance required',
                    }
                    return (
                      <div key={iss.id} className="bg-white rounded-xl border border-[#e4e8ef] p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#c8d0dc]">0{i+1}</span>
                            <div>
                              <div className="text-sm font-semibold" style={{ color: '#0f1923', fontFamily: 'Manrope,sans-serif' }}>{iss.type} · {iss.location}</div>
                              <div className="text-xs text-[#7a8697]">{iss.ward} · {iss.id}</div>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold shrink-0" style={{ background: p.bg, color: p.c }}>{p.label}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 h-2 rounded-full" style={{ background: '#f0f2f6' }}>
                            <div className="h-2 rounded-full" style={{ width: `${scores[iss.priority]}%`, background: p.c }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color: p.c }}>{scores[iss.priority]}/100</span>
                        </div>
                        <p className="text-xs text-[#7a8697] mb-3 italic">"{reasons[iss.priority]}"</p>
                        {(iss.status === 'open' || iss.status === 'pending_ai') && (
                          <button onClick={() => setAssignTarget(iss)} className="w-full py-2 text-xs font-semibold text-white rounded-xl" style={{ background: p.c }}>
                            Assign Worker Now
                          </button>
                        )}
                        {!['open','pending_ai','rejected'].includes(iss.status) && (
                          <button onClick={() => setDetailIssue(iss)} className="w-full py-2 text-xs font-semibold rounded-xl border border-[#e4e8ef]" style={{ color: '#1a3353' }}>
                            View Progress
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Workers ── */}
            {section === 'workers' && (
              <div>
                <h1 className="font-display font-800 text-xl mb-5" style={{ color: '#0f1923', fontWeight: 800 }}>Team Coordinators</h1>
                <div className="bg-white rounded-xl border border-[#e4e8ef] overflow-hidden">
                  <table className="w-full">
                    <thead style={{ background: '#f8f9fb' }}>
                      <tr>
                        {['Worker','Team','Location','Active Tasks','Status','Performance','Actions'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#7a8697] whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f4f6f9]">
                      {workers.map((w, i) => (
                        <tr key={w.id} className="hover:bg-[#fafbfd] transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: avatarColors[i % 5] }}>{w.initials}</div>
                              <div>
                                <div className="text-sm font-medium" style={{ color: '#0f1923' }}>{w.name}</div>
                                <div className="text-[10px] text-[#7a8697]">{w.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs text-[#4a5568]">{w.team}</td>
                          <td className="px-5 py-4 text-xs text-[#7a8697]">{w.distance} away</td>
                          <td className="px-5 py-4 text-xs font-medium" style={{ color: '#0f1923' }}>{w.activeTasks}</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold"
                              style={{ background: w.available ? '#f0fdf4' : '#f1f5f9', color: w.available ? '#16a34a' : '#64748b' }}>
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: w.available ? '#16a34a' : '#94a3b8' }} />
                              {w.available ? 'Available' : 'Busy'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 rounded-full" style={{ background: '#e4e8ef' }}>
                                <div className="h-1.5 rounded-full" style={{ width: `${w.performance}%`, background: '#16a34a' }} />
                              </div>
                              <span className="text-xs font-semibold" style={{ color: '#16a34a' }}>{w.performance}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white" style={{ background: '#1a3353' }}>Assign Task</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Analytics ── */}
            {section === 'analytics' && (
              <div>
                <h1 className="font-display font-800 text-xl mb-5" style={{ color: '#0f1923', fontWeight: 800 }}>Analytics</h1>
                <div className="grid lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 bg-white rounded-xl border border-[#e4e8ef] p-5">
                    <h2 className="font-display font-700 text-sm mb-4" style={{ color: '#0f1923', fontWeight: 700 }}>Resolution Trend — Last 7 Days</h2>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={WEEKLY} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                        <defs>
                          <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1a3353" stopOpacity={0.12} />
                            <stop offset="95%" stopColor="#1a3353" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.12} />
                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#f0f2f6" strokeDasharray="4 4" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#7a8697' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#7a8697' }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #e4e8ef' }} />
                        <Area type="monotone" dataKey="reported" stroke="#1a3353" strokeWidth={2} fill="url(#gR)" name="Reported" />
                        <Area type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2} fill="url(#gG)" name="Resolved" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white rounded-xl border border-[#e4e8ef] p-5">
                    <h2 className="font-display font-700 text-sm mb-4" style={{ color: '#0f1923', fontWeight: 700 }}>By Category</h2>
                    <div className="flex flex-col items-center gap-3">
                      <ResponsiveContainer width={160} height={160}>
                        <PieChart>
                          <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value">
                            {CATEGORY_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="w-full flex flex-col gap-1.5">
                        {CATEGORY_DATA.map(c => (
                          <div key={c.name} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: c.color }} />
                            <span className="text-xs text-[#4a5568] flex-1">{c.name}</span>
                            <span className="text-xs font-semibold" style={{ color: '#0f1923' }}>{c.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {assignTarget && (
        <AssignModal issue={assignTarget} workers={workers}
          onAssign={(wid, wname) => { onAssignWorker(assignTarget.id, wid, wname); setAssignTarget(null) }}
          onClose={() => setAssignTarget(null)} />
      )}
      {verifyTarget && (
        <VerifyModal issue={verifyTarget}
          onVerify={() => { onVerifyIssue(verifyTarget.id) }}
          onClose={() => setVerifyTarget(null)} />
      )}
    </div>
  )
}

function AuthTopBar({ auth, onLogout, section, setSection, proofPending }: {
  auth: { name: string } | null; onLogout: () => void; section: string; setSection: (s: Section) => void; proofPending: number
}) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e4e8ef]" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.05)' }}>
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#1a3353' }}>
            <MapPin size={13} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-[15px]" style={{ fontWeight: 800, color: '#1a3353' }}>
            CIVIC<span style={{ color: '#16a34a' }}>FIX</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#4a5568]">{auth?.name}</span>
          <button onClick={onLogout} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7a8697] hover:bg-[#f0f4f8]"><LogOut size={15} /></button>
        </div>
      </div>
    </header>
  )
}
