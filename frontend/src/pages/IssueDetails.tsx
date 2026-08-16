import { MapPin, Cpu, CheckCircle2, Circle, ChevronLeft, Clock } from 'lucide-react'
import type { Issue } from '../types'

interface Props {
  issue: Issue
  setPage: (p: string) => void
}

const TIMELINE_STEPS = ['Submitted', 'AI Verified', 'Assigned', 'In Progress', 'Resolved']
const STATUS_TO_STEP: Record<string, number> = {
  pending_ai: 0, duplicate: 0, open: 1, rejected: 1,
  assigned: 2, accepted: 2, in_progress: 3, proof_submitted: 3,
  verified: 4, resolved: 4,
}

const PC: Record<string, { label: string; bg: string; c: string }> = {
  urgent: { label: 'Urgent', bg: '#fef2f2', c: '#dc2626' },
  high:   { label: 'High',   bg: '#fffbeb', c: '#d97706' },
  medium: { label: 'Medium', bg: '#fefce8', c: '#ca8a04' },
  low:    { label: 'Low',    bg: '#f0fdf4', c: '#16a34a' },
}
const SC: Record<string, { label: string; bg: string; c: string }> = {
  pending_ai:      { label: 'Analyzing',    bg: '#eff6ff', c: '#1d4ed8' },
  duplicate:       { label: 'Duplicate',    bg: '#fdf4ff', c: '#9333ea' },
  open:            { label: 'Open',         bg: '#f1f5f9', c: '#475569' },
  rejected:        { label: 'Rejected',     bg: '#fef2f2', c: '#dc2626' },
  assigned:        { label: 'Assigned',     bg: '#f5f3ff', c: '#7c3aed' },
  accepted:        { label: 'Accepted',     bg: '#eff6ff', c: '#1d4ed8' },
  in_progress:     { label: 'In Progress',  bg: '#fffbeb', c: '#b45309' },
  proof_submitted: { label: 'Under Review', bg: '#fdf4ff', c: '#9333ea' },
  verified:        { label: 'Verified',     bg: '#f0fdf4', c: '#16a34a' },
  resolved:        { label: 'Resolved',     bg: '#f0fdf4', c: '#16a34a' },
}

export default function IssueDetails({ issue, setPage }: Props) {
  const p = PC[issue.priority] ?? PC.medium
  const s = SC[issue.status] ?? { label: issue.status, bg: '#f1f5f9', c: '#475569' }
  const step = STATUS_TO_STEP[issue.status] ?? 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => setPage('track')}
        className="flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors"
        style={{ color: '#7a8697' }}
        onMouseEnter={e => e.currentTarget.style.color = '#1a3353'}
        onMouseLeave={e => e.currentTarget.style.color = '#7a8697'}>
        <ChevronLeft size={16} /> Back to Issues
      </button>

      <div className="grid lg:grid-cols-[2fr_3fr] gap-6">

        {/* Left: visual + mini map */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl overflow-hidden border border-[#e4e8ef]" style={{ aspectRatio: '4/3' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 300">
              <rect width="400" height="120" fill="#93c5fd" opacity="0.4" />
              <rect y="120" width="400" height="180" fill="#6b7280" />
              <rect x="10" y="40" width="55" height="80" fill="#9ca3af" opacity="0.7" />
              <rect x="75" y="20" width="80" height="100" fill="#94a3b8" opacity="0.6" />
              <rect x="290" y="30" width="65" height="90" fill="#9ca3af" opacity="0.7" />
              <rect x="0" y="160" width="400" height="140" fill="#4b5563" />
              <rect x="190" y="168" width="20" height="36" fill="#9ca3af" opacity="0.35" rx="1" />
              <rect x="190" y="214" width="20" height="36" fill="#9ca3af" opacity="0.35" rx="1" />
              <ellipse cx="200" cy="210" rx="58" ry="38" fill="#374151" />
              <ellipse cx="200" cy="210" rx="50" ry="30" fill="#1f2937" />
              <ellipse cx="186" cy="202" rx="18" ry="12" fill="#111827" opacity="0.8" />
              <ellipse cx="198" cy="216" rx="28" ry="14" fill="#3b82f6" opacity="0.22" />
              <rect x="120" y="248" width="160" height="10" fill="#fbbf24" opacity="0.85" rx="2" />
              <text x="200" y="256" textAnchor="middle" fontSize="5.5" fill="#92400e" fontWeight="bold" fontFamily="Inter,sans-serif">CAUTION — ROAD WORK</text>
            </svg>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#e4e8ef]" style={{ height: 150 }}>
            <svg width="100%" height="100%" viewBox="0 0 360 150">
              <rect width="360" height="150" fill="#dde6f0" />
              {[0,45,90,135,180,225,270,315,360].map(x => (
                <line key={x} x1={x} y1={0} x2={x} y2={150} stroke="#f0f3f7" strokeWidth="4" />
              ))}
              {[0,50,100,150].map(y => (
                <line key={y} x1={0} y1={y} x2={360} y2={y} stroke="#f0f3f7" strokeWidth="3" />
              ))}
              <text x="178" y="46" fontSize="8.5" fill="#8fa0b4" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600">{issue.location}</text>
              <circle cx="178" cy="75" r="16" fill="#dc2626" opacity="0.15" />
              <circle cx="178" cy="75" r="9"  fill="#dc2626" opacity="0.3" />
              <circle cx="178" cy="75" r="5"  fill="#dc2626" />
              <circle cx="178" cy="75" r="2"  fill="white" />
            </svg>
          </div>

          <div className="bg-white rounded-2xl border border-[#e4e8ef] p-4">
            <div className="text-xs font-semibold text-[#7a8697] uppercase tracking-wide mb-2">Location</div>
            <div className="flex items-start gap-2">
              <MapPin size={14} color="#1a3353" className="mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium" style={{ color: '#0f1923' }}>{issue.address}</div>
                <div className="text-xs text-[#7a8697] mt-0.5">{issue.ward}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: details + timeline */}
        <div className="flex flex-col gap-4">

          {/* Header */}
          <div className="bg-white rounded-2xl border border-[#e4e8ef] p-6"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] font-mono font-semibold" style={{ color: '#7a8697' }}>{issue.id}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold"
                style={{ background: p.bg, color: p.c }}>{p.label}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold"
                style={{ background: s.bg, color: s.c }}>{s.label}</span>
            </div>

            <h1 className="font-display text-xl font-800 mb-3" style={{ color: '#0f1923', fontWeight: 800 }}>
              {issue.type} — {issue.location}
            </h1>
            <p className="text-sm text-[#4a5568] mb-5">{issue.description}</p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Issue ID',       value: issue.id },
                { label: 'Reported by',    value: issue.citizenName },
                { label: 'Submitted',      value: issue.submittedAt },
                { label: 'Ward',           value: issue.ward },
                { label: 'AI Category',    value: issue.aiCategory },
                { label: 'AI Confidence',  value: `${issue.aiConfidence}% · ${issue.aiSeverity} severity` },
              ].map(f => (
                <div key={f.label}>
                  <div className="text-xs text-[#7a8697] mb-0.5">{f.label}</div>
                  <div className="text-sm font-medium" style={{ color: '#0f1923' }}>{f.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#f0f2f5] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#eff6ff' }}>
                <Cpu size={12} color="#1d4ed8" />
              </div>
              <span className="text-xs text-[#4a5568]">
                AI classified in <strong>1.2s</strong> with {issue.aiConfidence}% confidence
              </span>
            </div>
          </div>

          {/* Progress steps */}
          <div className="bg-white rounded-2xl border border-[#e4e8ef] p-6"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h2 className="font-display font-700 text-sm mb-5" style={{ color: '#0f1923', fontWeight: 700 }}>
              Status Timeline
            </h2>
            <div className="flex flex-col">
              {issue.updates.map((u, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: u.byRole === 'ai' ? '#1d4ed8' : u.byRole === 'authority' ? '#1a3353' : u.byRole === 'worker' ? '#16a34a' : '#7c3aed',
                      }}>
                      {u.byRole === 'ai'
                        ? <Cpu size={11} color="white" />
                        : <span className="text-[10px] font-bold text-white">{u.by.charAt(0)}</span>}
                    </div>
                    {i < issue.updates.length - 1 && (
                      <div className="w-px flex-1 my-1.5 min-h-[24px]" style={{ background: '#e4e8ef' }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold" style={{ color: '#0f1923' }}>{u.by}</span>
                      <span className="text-[11px] text-[#7a8697]">{u.time}</span>
                    </div>
                    <p className="text-xs text-[#4a5568]">{u.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-2 flex items-center gap-1">
              {TIMELINE_STEPS.map((label, idx) => (
                <div key={label} title={label} className="flex-1">
                  <div className="h-1.5 rounded-full"
                    style={{
                      background: step > idx
                        ? (issue.status === 'resolved' || issue.status === 'verified' ? '#16a34a' : '#1a3353')
                        : step === idx ? '#1a3353' : '#e4e8ef',
                    }}
                  />
                  <div className="text-[9px] text-center mt-1 text-[#7a8697]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned worker */}
          {issue.assignedWorkerName && (
            <div className="bg-white rounded-2xl border border-[#e4e8ef] p-5"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="text-xs font-semibold text-[#7a8697] uppercase tracking-wide mb-3">Assigned Worker</div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: '#1a3353' }}>
                  {issue.assignedWorkerName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: '#0f1923' }}>{issue.assignedWorkerName}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#7a8697]">
                    <Clock size={11} /> Assigned on {issue.submittedAt.split(',')[0]}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold"
                  style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Active
                </span>
              </div>
            </div>
          )}

          {/* Resolved */}
          {(issue.status === 'resolved' || issue.status === 'verified') && issue.resolvedAt && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <CheckCircle2 size={18} color="#16a34a" />
              <div>
                <div className="text-sm font-semibold" style={{ color: '#15803d' }}>Issue Resolved</div>
                <div className="text-xs" style={{ color: '#166534' }}>Closed on {issue.resolvedAt}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
