import { useState, useEffect } from 'react'
import {
  MapPin, LogOut, CheckCircle2, Clock, Wrench,
  Camera, Upload, AlertCircle, ChevronRight, RefreshCw,
  Navigation, X, Send, Users, Phone, Cpu, BellRing,
  ThumbsUp, ThumbsDown, ArrowLeft
} from 'lucide-react'
import type { Issue, TeamMember } from '../../types'
import { useAuth } from '../../context/AuthContext'
import { useIssues } from '../../context/IssuesContext'

const SC: Record<string, { label: string; bg: string; c: string }> = {
  assigned:        { label: 'Assigned',        bg: '#f5f3ff', c: '#7c3aed' },
  rejected:        { label: 'Rejected',        bg: '#fef2f2', c: '#dc2626' },
  accepted:        { label: 'Accepted',        bg: '#eff6ff', c: '#1d4ed8' },
  in_progress:     { label: 'In Progress',     bg: '#fffbeb', c: '#b45309' },
  proof_submitted: { label: 'Proof Submitted', bg: '#fdf4ff', c: '#9333ea' },
  verified:        { label: 'Verified',        bg: '#f0fdf4', c: '#16a34a' },
  resolved:        { label: 'Resolved',        bg: '#f0fdf4', c: '#16a34a' },
}
const PC: Record<string, { label: string; bg: string; c: string }> = {
  urgent: { label: 'Urgent', bg: '#fef2f2', c: '#dc2626' },
  high:   { label: 'High',   bg: '#fffbeb', c: '#d97706' },
  medium: { label: 'Medium', bg: '#fefce8', c: '#ca8a04' },
  low:    { label: 'Low',    bg: '#f0fdf4', c: '#16a34a' },
}

const TASK_STEPS = ['Assigned', 'Accepted', 'In Progress', 'Proof Sent', 'Resolved']
const STATUS_TO_STEP: Record<string, number> = {
  assigned: 0, accepted: 1, in_progress: 2, proof_submitted: 3, verified: 4, resolved: 4
}

interface UpdatePayload {
  status?: Issue['status']
  proofDescription?: string
  alertSent?: boolean
  newUpdate?: { time?: string; message: string; by: string; byRole: 'worker' | 'authority' | 'citizen' | 'ai' | 'system' }
}

// ── Live issue map (SVG mock) ─────────────────────────────────────────────────
function IssueMap({ issue }: { issue: Issue }) {
  const [myX, setMyX] = useState(issue.cx + 60)
  const [myY, setMyY] = useState(issue.cy + 50)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setMyX(prev => prev + (issue.cx - prev) * 0.04 + (Math.random() - 0.5) * 2)
      setMyY(prev => prev + (issue.cy - prev) * 0.04 + (Math.random() - 0.5) * 2)
      setTick(t => t + 1)
    }, 800)
    return () => clearInterval(id)
  }, [issue.cx, issue.cy])

  const dist = Math.sqrt(Math.pow(myX - issue.cx, 2) + Math.pow(myY - issue.cy, 2))
  const eta = Math.round(dist / 12)

  return (
    <div className="rounded-2xl overflow-hidden border border-[#e4e8ef]" style={{ background: '#eef0f5' }}>
      {/* Map header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#e4e8ef]">
        <div className="flex items-center gap-2">
          <Navigation size={14} color="#1d4ed8" />
          <span className="text-xs font-semibold" style={{ color: '#0f1923' }}>Live Navigation</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#7a8697]">
          <span><span className="font-bold text-[#0f1923]">{(dist * 0.03).toFixed(1)} km</span> away</span>
          <span>·</span>
          <span>ETA <span className="font-bold text-[#0f1923]">{eta} min</span></span>
        </div>
      </div>

      {/* SVG map */}
      <div className="relative" style={{ height: 260 }}>
        <svg width="100%" height="260" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
          {/* Background */}
          <rect width="400" height="260" fill="#f0ebe3" />
          {/* Water */}
          <path d="M0,140 Q100,125 200,145 Q300,165 400,140 L400,260 L0,260 Z" fill="#b3d4f5" opacity="0.4" />
          {/* Parks */}
          <rect x="30" y="40" width="60" height="40" rx="4" fill="#c8e6c9" opacity="0.7" />
          <rect x="300" y="180" width="70" height="50" rx="4" fill="#c8e6c9" opacity="0.7" />
          {/* Road grid */}
          {[60,120,180,240].map(x => <line key={x} x1={x} y1="0" x2={x} y2="260" stroke="#e8ddd0" strokeWidth="8" />)}
          {[50,100,150,200].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#e8ddd0" strokeWidth="8" />)}
          {/* Road labels */}
          <text x="62" y="48" fontSize="7" fill="#b0a090" fontFamily="sans-serif">FC Road</text>
          <text x="122" y="48" fontSize="7" fill="#b0a090" fontFamily="sans-serif">MG Road</text>
          <text x="182" y="48" fontSize="7" fill="#b0a090" fontFamily="sans-serif">JM Road</text>
          {/* Path from my loc to issue */}
          <line x1={myX * 400 / 760} y1={myY * 260 / 480} x2={issue.cx * 400 / 760} y2={issue.cy * 260 / 480}
            stroke="#1d4ed8" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />

          {/* Issue pin */}
          <g transform={`translate(${issue.cx * 400 / 760},${issue.cy * 260 / 480})`}>
            <circle r="16" fill="#dc2626" opacity="0.15">
              <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="10" fill="#dc2626" />
            <text textAnchor="middle" dy="4" fontSize="10" fill="white">!</text>
          </g>

          {/* My location (coordinator) */}
          <g transform={`translate(${myX * 400 / 760},${myY * 260 / 480})`}>
            <circle r="14" fill="#1d4ed8" opacity="0.15" />
            <circle r="8" fill="#1d4ed8" />
            <circle r="3" fill="white" />
          </g>
        </svg>

        {/* Legend overlay */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 bg-white/90 px-3 py-2 rounded-xl" style={{ backdropFilter: 'blur(4px)' }}>
          <div className="flex items-center gap-1.5 text-[10px] text-[#4a5568]">
            <div className="w-3 h-3 rounded-full bg-red-500" /> Issue location
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#4a5568]">
            <div className="w-3 h-3 rounded-full bg-blue-600" /> Your location
          </div>
        </div>

        {/* Address callout */}
        <div className="absolute top-3 right-3 bg-white/95 px-3 py-2 rounded-xl max-w-[160px]" style={{ backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div className="text-[9px] text-[#7a8697] mb-0.5">Issue location</div>
          <div className="text-[11px] font-semibold leading-tight" style={{ color: '#0f1923' }}>{issue.location}</div>
        </div>
      </div>

      {/* Nav footer */}
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: '#1d4ed8' }}>
          <Navigation size={14} /> Open in Maps
        </button>
        <div className="text-center">
          <div className="text-[10px] text-[#7a8697]">Live tracking</div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ animation: 'pulse 1.5s infinite' }} />
            <span className="text-[10px] font-semibold text-green-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Alert panel ───────────────────────────────────────────────────────────────
function AlertPanel({ issue, auth, onSend, onClose }: {
  issue: Issue; auth: { name: string } | null; onSend: (msg: string) => void; onClose: () => void
}) {
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)
  const presets = [
    "Road blocked — cannot reach the issue location.",
    "Equipment failure — need a replacement crew.",
    "Safety hazard at site — please reassign.",
    "Traffic diversion in effect — need alternate route.",
  ]

  if (sent) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,25,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#fffbeb' }}>
          <BellRing size={26} color="#d97706" />
        </div>
        <h3 className="font-display font-700 text-base mb-2" style={{ color: '#0f1923', fontWeight: 700 }}>Alert Sent to CIVICFIX</h3>
        <p className="text-sm text-[#4a5568] mb-5">The authority has been notified and will reassign this task or adjust your route.</p>
        <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: '#1a3353' }}>Done</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,25,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BellRing size={18} color="#d97706" />
            <h3 className="font-display font-700 text-base" style={{ color: '#0f1923', fontWeight: 700 }}>Send Alert to CIVICFIX</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f0f4f8]"><X size={15} color="#7a8697" /></button>
        </div>
        <p className="text-xs text-[#7a8697] mb-4">Use this to notify the authority if you cannot reach the issue location. They can reassign the task or adjust your route.</p>
        {/* Presets */}
        <div className="flex flex-col gap-1.5 mb-4">
          {presets.map(p => (
            <button key={p} onClick={() => setMsg(p)}
              className="text-left text-xs px-3 py-2 rounded-xl border transition-colors"
              style={{ borderColor: msg === p ? '#d97706' : '#e4e8ef', background: msg === p ? '#fffbeb' : '#f8f9fb', color: '#4a5568' }}>
              {p}
            </button>
          ))}
        </div>
        <textarea
          value={msg}
          onChange={e => setMsg(e.target.value)}
          rows={2}
          placeholder="Or type a custom message…"
          className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e8ef] resize-none mb-4"
          style={{ color: '#0f1923' }}
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-[#e4e8ef]" style={{ color: '#4a5568' }}>Cancel</button>
          <button
            onClick={() => { if (msg.trim()) { onSend(msg.trim()); setSent(true) } }}
            disabled={!msg.trim()}
            className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-40 flex items-center justify-center gap-1.5"
            style={{ background: '#d97706' }}>
            <Send size={13} /> Send Alert
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Task detail view ──────────────────────────────────────────────────────────
function TaskDetail({ issue, auth, onUpdate, onBack }: {
  issue: Issue; auth: { name: string } | null;
  onUpdate: (u: UpdatePayload) => void;
  onBack: () => void
}) {
  const [view, setView] = useState<'detail' | 'map'>('detail')
  const [note, setNote] = useState('')
  const [proofDesc, setProofDesc] = useState('')
  const [proofPhoto, setProofPhoto] = useState(false)
  const [busy, setBusy] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [toast, setToast] = useState('')

  const s = SC[issue.status] ?? { label: issue.status, bg: '#f1f5f9', c: '#475569' }
  const p = PC[issue.priority] ?? PC.medium
  const step = STATUS_TO_STEP[issue.status] ?? 0
  const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const doAction = (action: string) => {
    setBusy(true)
    setTimeout(() => {
      const name = auth?.name ?? 'Coordinator'
      if (action === 'accept') {
        onUpdate({ status: 'accepted', newUpdate: { time: now(), message: 'Task accepted. Team is heading to the location.', by: name, byRole: 'worker' } })
        showToast('Task accepted!')
        setView('map')
      } else if (action === 'reject') {
        onUpdate({ status: 'rejected', newUpdate: { time: now(), message: 'Task rejected by coordinator. Awaiting reassignment.', by: name, byRole: 'worker' } })
        showToast('Task rejected. Authority notified.')
        onBack()
      } else if (action === 'start') {
        onUpdate({ status: 'in_progress', newUpdate: { time: now(), message: note || 'Work started at the issue location.', by: name, byRole: 'worker' } })
        setNote('')
        showToast('Progress updated!')
      } else if (action === 'proof') {
        onUpdate({
          status: 'proof_submitted',
          proofDescription: proofDesc || 'Work completed, proof uploaded.',
          newUpdate: { time: now(), message: `Work completed. Proof submitted: ${proofDesc || 'Work done.'}`, by: name, byRole: 'worker' }
        })
        showToast('Proof submitted for verification!')
        setProofDesc(''); setProofPhoto(false)
      }
      setBusy(false)
    }, 700)
  }

  const sendAlert = (msg: string) => {
    onUpdate({ alertSent: true, newUpdate: { time: now(), message: `⚠️ Alert: ${msg}`, by: auth?.name ?? 'Coordinator', byRole: 'worker' } })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#7a8697' }}>
          <ArrowLeft size={15} /> My Tasks
        </button>
        {/* View toggle — only after accepted */}
        {['accepted','in_progress','proof_submitted','verified','resolved'].includes(issue.status) && (
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#e4e8ef' }}>
            {(['detail','map'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-3 py-1 text-xs font-semibold rounded-lg"
                style={{ background: view === v ? 'white' : 'transparent', color: view === v ? '#0f1923' : '#7a8697' }}>
                {v === 'detail' ? 'Details' : '🗺 Map'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-[#e4e8ef] p-5 mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[11px] font-mono font-semibold text-[#7a8697]">{issue.id}</span>
          <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: p.bg, color: p.c }}>{p.label}</span>
          <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: s.bg, color: s.c }}>{s.label}</span>
        </div>
        <h2 className="font-display font-700 text-lg mb-1" style={{ color: '#0f1923', fontWeight: 700 }}>{issue.type}</h2>
        <p className="text-sm text-[#4a5568] mb-3">{issue.description}</p>
        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
          <div><span className="text-[#7a8697]">Location</span><br /><span className="font-medium" style={{ color: '#0f1923' }}>{issue.location}</span></div>
          <div><span className="text-[#7a8697]">Ward</span><br /><span className="font-medium" style={{ color: '#0f1923' }}>{issue.ward}</span></div>
          <div><span className="text-[#7a8697]">Address</span><br /><span className="font-medium" style={{ color: '#0f1923' }}>{issue.address}</span></div>
          <div><span className="text-[#7a8697]">Submitted</span><br /><span className="font-medium" style={{ color: '#0f1923' }}>{issue.submittedAt}</span></div>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-0">
          {TASK_STEPS.map((name, i) => (
            <div key={name} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: i <= step ? '#15803d' : '#e4e8ef', color: i <= step ? 'white' : '#94a3b8' }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-[8px] text-[#7a8697] whitespace-nowrap hidden sm:block">{name}</span>
              </div>
              {i < TASK_STEPS.length - 1 && <div className="h-0.5 w-8 sm:w-10 mx-0.5 -mt-3 sm:-mt-4" style={{ background: i < step ? '#15803d' : '#e4e8ef' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Map view */}
      {view === 'map' && <div className="mb-4"><IssueMap issue={issue} /></div>}

      {/* Accept / Reject */}
      {issue.status === 'assigned' && view === 'detail' && (
        <div className="bg-white rounded-2xl border-2 p-5 mb-4" style={{ borderColor: '#7c3aed' }}>
          <div className="font-display font-700 text-sm mb-1" style={{ color: '#7c3aed', fontWeight: 700 }}>New Task Assigned</div>
          <p className="text-xs text-[#4a5568] mb-4">Review this task. Accept to begin navigation, or reject if your team cannot handle it.</p>
          <div className="flex gap-3">
            <button onClick={() => doAction('reject')} disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl border-2"
              style={{ borderColor: '#fca5a5', color: '#dc2626', background: '#fff' }}>
              <ThumbsDown size={14} /> Reject
            </button>
            <button onClick={() => doAction('accept')} disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl"
              style={{ background: '#15803d' }}>
              {busy ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ThumbsUp size={14} />}
              Accept
            </button>
          </div>
        </div>
      )}

      {/* After accepted — alert + start work */}
      {issue.status === 'accepted' && view === 'detail' && (
        <>
          <div className="bg-white rounded-2xl border border-[#e4e8ef] p-5 mb-4">
            <div className="font-display font-700 text-sm mb-3" style={{ color: '#0f1923', fontWeight: 700 }}>Start Work</div>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e8ef] resize-none mb-3"
              style={{ color: '#0f1923' }} placeholder="Describe what work your team is starting…" />
            <button onClick={() => doAction('start')} disabled={busy}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-60"
              style={{ background: '#d97706' }}>
              {busy ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wrench size={14} />}
              Start Work
            </button>
          </div>
          <button onClick={() => setShowAlert(true)} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl border-2 mb-4"
            style={{ borderColor: '#fbbf24', color: '#b45309', background: '#fffbeb' }}>
            <BellRing size={14} /> Send Alert — Can't Reach Location
          </button>
        </>
      )}

      {/* In progress — upload proof */}
      {issue.status === 'in_progress' && view === 'detail' && (
        <>
          <div className="bg-white rounded-2xl border border-[#e4e8ef] p-5 mb-4">
            <div className="font-display font-700 text-sm mb-3" style={{ color: '#0f1923', fontWeight: 700 }}>Submit Proof of Completion</div>
            <button onClick={() => setProofPhoto(true)}
              className="w-full h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed mb-4"
              style={{ borderColor: proofPhoto ? '#15803d' : '#d0d8e4', background: proofPhoto ? '#f0fdf4' : '#f8f9fb' }}>
              {proofPhoto
                ? <><CheckCircle2 size={22} color="#16a34a" /><span className="text-xs text-green-700 font-semibold">Photo captured</span></>
                : <><Camera size={22} color="#7a8697" /><span className="text-xs text-[#7a8697]">Tap to capture proof photo</span></>}
            </button>
            <textarea value={proofDesc} onChange={e => setProofDesc(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e8ef] resize-none mb-3"
              style={{ color: '#0f1923' }} placeholder="Describe the work completed by your team…" />
            <button onClick={() => doAction('proof')} disabled={busy || (!proofPhoto && !proofDesc)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-40"
              style={{ background: '#7c3aed' }}>
              {busy ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={14} />}
              Submit for Verification
            </button>
          </div>
          <button onClick={() => setShowAlert(true)} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl border-2 mb-4"
            style={{ borderColor: '#fbbf24', color: '#b45309', background: '#fffbeb' }}>
            <BellRing size={14} /> Send Alert to CIVICFIX
          </button>
        </>
      )}

      {/* Proof submitted */}
      {issue.status === 'proof_submitted' && view === 'detail' && (
        <div className="flex items-start gap-3 px-4 py-4 rounded-xl mb-4" style={{ background: '#fdf4ff', border: '1px solid #e9d5ff' }}>
          <Clock size={18} color="#9333ea" className="shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold mb-0.5" style={{ color: '#6b21a8' }}>Awaiting Authority Verification</div>
            <div className="text-xs" style={{ color: '#7e22ce' }}>Proof submitted. The authority is reviewing and will verify or request a re-do.</div>
          </div>
        </div>
      )}

      {/* Resolved */}
      {(issue.status === 'verified' || issue.status === 'resolved') && view === 'detail' && (
        <div className="px-4 py-4 rounded-xl mb-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle2 size={18} color="#16a34a" />
            <span className="text-sm font-semibold" style={{ color: '#15803d' }}>Excellent Work — Issue Resolved!</span>
          </div>
          <p className="text-xs" style={{ color: '#166534' }}>Authority verified your team's work. Citizen has been notified.</p>
        </div>
      )}

      {/* Activity log */}
      {view === 'detail' && (
        <div className="bg-white rounded-2xl border border-[#e4e8ef] p-5">
          <div className="font-display font-700 text-sm mb-4" style={{ color: '#0f1923', fontWeight: 700 }}>Activity Log</div>
          <div className="flex flex-col gap-0">
            {issue.updates.map((u, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold"
                    style={{ background: u.byRole === 'ai' ? '#1d4ed8' : u.byRole === 'authority' ? '#1a3353' : u.byRole === 'worker' ? '#15803d' : '#7c3aed' }}>
                    {u.byRole === 'ai' ? <Cpu size={10} /> : u.by.charAt(0)}
                  </div>
                  {i < issue.updates.length - 1 && <div className="w-px flex-1 my-1 min-h-[18px]" style={{ background: '#e4e8ef' }} />}
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
      )}

      {/* Alert modal */}
      {showAlert && <AlertPanel issue={issue} auth={auth} onSend={sendAlert} onClose={() => setShowAlert(false)} />}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-xl z-50"
          style={{ background: '#0f1923' }}>
          <CheckCircle2 size={15} /> {toast}
        </div>
      )}
    </div>
  )
}

// ── Main CoordinatorApp ───────────────────────────────────────────────────────
export function WorkerApp() {
  const { auth, logout } = useAuth()
  const { issues, updateIssue } = useIssues()
  const onUpdateIssue = updateIssue
  const onLogout = logout
  const [activeTask, setActiveTask] = useState<Issue | null>(null)
  const [tab, setTab] = useState<'active' | 'completed'>('active')
  const [showTeam, setShowTeam] = useState(false)

  const teamMembers: TeamMember[] = auth?.teamMembers ?? []
  const myIssues = issues.filter(i => i.assignedWorkerId === auth?.id)
  const active = myIssues.filter(i => !['resolved', 'verified'].includes(i.status))
  const completed = myIssues.filter(i => ['resolved', 'verified'].includes(i.status))
  const displayed = tab === 'active' ? active : completed

  if (activeTask) {
    const current = issues.find(i => i.id === activeTask.id) ?? activeTask
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <CoordTopBar auth={auth} teamMembers={teamMembers} onLogout={onLogout} showTeam={showTeam} setShowTeam={setShowTeam} />
        <TaskDetail issue={current} auth={auth} onUpdate={u => onUpdateIssue(current.id, u)} onBack={() => setActiveTask(null)} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <CoordTopBar auth={auth} teamMembers={teamMembers} onLogout={onLogout} showTeam={showTeam} setShowTeam={setShowTeam} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Coordinator card */}
        <div className="bg-white rounded-2xl border border-[#e4e8ef] p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
              style={{ background: '#15803d' }}>
              {(auth?.name ?? 'C').split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="font-display font-700 text-base" style={{ color: '#0f1923', fontWeight: 700 }}>{auth?.name}</div>
              <div className="text-xs text-[#7a8697]">Team Coordinator · Road Maintenance</div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[11px] text-green-700 font-medium">On Duty</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-700 text-2xl" style={{ color: '#0f1923', fontWeight: 700 }}>{active.length}</div>
              <div className="text-xs text-[#7a8697]">Active Tasks</div>
            </div>
          </div>
        </div>

        {/* Team members panel */}
        {teamMembers.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#e4e8ef] p-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} color="#15803d" />
              <div className="font-display font-700 text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>Your Team ({teamMembers.length})</div>
            </div>
            <div className="flex flex-col gap-2">
              {teamMembers.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ background: ['#1d4ed8','#d97706','#7c3aed','#16a34a','#dc2626'][i % 5] }}>
                    {m.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold" style={{ color: '#0f1923' }}>{m.name}</div>
                    <div className="text-[10px] text-[#7a8697]">{m.role}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#7a8697]">
                    <Phone size={10} /> {m.phone}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: '#e4e8ef' }}>
          {([['active', `Active (${active.length})`], ['completed', `Completed (${completed.length})`]] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all"
              style={{ background: tab === t ? 'white' : 'transparent', color: tab === t ? '#0f1923' : '#7a8697', boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: tab === 'active' ? '#f0fdf4' : '#f0f4f8' }}>
              {tab === 'active' ? <CheckCircle2 size={26} color="#16a34a" /> : <RefreshCw size={22} color="#7a8697" />}
            </div>
            <div className="font-semibold text-[#0f1923] mb-1">{tab === 'active' ? 'No active tasks!' : 'No completed tasks yet'}</div>
            <div className="text-sm text-[#7a8697]">{tab === 'active' ? 'You are all caught up.' : 'Completed tasks appear here.'}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayed.map(iss => {
              const s = SC[iss.status] ?? { label: iss.status, bg: '#f1f5f9', c: '#475569' }
              const p = PC[iss.priority] ?? PC.medium
              const step = STATUS_TO_STEP[iss.status] ?? 0
              return (
                <button key={iss.id} onClick={() => setActiveTask(iss)}
                  className="bg-white rounded-2xl border border-[#e4e8ef] p-5 text-left hover:border-[#15803d] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[11px] font-mono font-semibold text-[#7a8697]">{iss.id}</span>
                      <h3 className="font-display font-700 text-[15px] mt-0.5" style={{ color: '#0f1923', fontWeight: 700 }}>{iss.type}</h3>
                      <div className="flex items-center gap-1 text-xs text-[#7a8697] mt-0.5">
                        <MapPin size={11} /> {iss.location}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: p.bg, color: p.c }}>{p.label}</span>
                      <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: s.bg, color: s.c }}>{s.label}</span>
                    </div>
                  </div>
                  {iss.alertSent && (
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold mb-2 px-2 py-1 rounded-lg" style={{ background: '#fffbeb', color: '#b45309' }}>
                      <BellRing size={10} /> Alert sent to CIVICFIX
                    </div>
                  )}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= step ? '#15803d' : '#e4e8ef' }} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#7a8697]">{iss.ward}</span>
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#15803d' }}>
                      {iss.status === 'assigned' ? 'Accept / Reject' : iss.status === 'accepted' ? 'Start + Map' : iss.status === 'in_progress' ? 'Submit Proof' : 'View'}
                      <ChevronRight size={13} />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function CoordTopBar({ auth, teamMembers, onLogout, showTeam, setShowTeam }: {
  auth: { name: string } | null; teamMembers: TeamMember[]; onLogout: () => void; showTeam: boolean; setShowTeam: (v: boolean) => void
}) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e4e8ef]" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.05)' }}>
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#15803d' }}>
            <MapPin size={13} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-[15px]" style={{ fontWeight: 800, color: '#1a3353' }}>
            CIVIC<span style={{ color: '#15803d' }}>FIX</span>
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1" style={{ background: '#dcfce7', color: '#15803d' }}>Coordinator</span>
        </div>
        <div className="flex items-center gap-2">
          {teamMembers.length > 0 && (
            <button onClick={() => setShowTeam(!showTeam)} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: '#f0fdf4', color: '#15803d' }}>
              <Users size={13} /> {teamMembers.length} members
            </button>
          )}
          <span className="text-xs font-medium text-[#4a5568] hidden sm:block">{auth?.name}</span>
          <button onClick={onLogout} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7a8697] hover:bg-[#f0f4f8]">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}
