import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, Cpu, CheckCircle2 } from 'lucide-react'
import { useIssues } from '../../context/IssuesContext'
import { Card, Badge } from '../../components/ui'
import { ActivityLog, ProgressBar } from '../../components/shared'
import { PRIORITY_CONFIG, STATUS_CONFIG, PROGRESS_STEPS } from '../../lib/constants'

const STATUS_TO_STEP: Record<string, number> = {
  pending_ai: 0, duplicate: 0, open: 1, rejected: 1,
  assigned: 2, accepted: 2, in_progress: 3, proof_submitted: 3, verified: 4, resolved: 4,
}

export function DetailsPage() {
  const { id } = useParams()
  const { issues } = useIssues()
  const navigate = useNavigate()
  const issue = issues.find(i => i.id === id) ?? issues[0]
  const p = PRIORITY_CONFIG[issue.priority] ?? PRIORITY_CONFIG.medium
  const s = STATUS_CONFIG[issue.status] ?? { label: issue.status, bg: '#f1f5f9', color: '#475569' }
  const step = STATUS_TO_STEP[issue.status] ?? 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate('/track')}
        className="flex items-center gap-1.5 text-sm font-medium mb-6 hover:text-[#1a3353]" style={{ color: '#7a8697' }}>
        <ChevronLeft size={16} /> Back to Issues
      </button>

      <div className="grid lg:grid-cols-[2fr_3fr] gap-6">
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

          <Card>
            <div className="text-xs font-semibold text-[#7a8697] uppercase tracking-wide mb-2">Location</div>
            <div className="flex items-start gap-2">
              <MapPin size={14} color="#1a3353" className="mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium" style={{ color: '#0f1923' }}>{issue.address}</div>
                <div className="text-xs text-[#7a8697] mt-0.5">{issue.ward}</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] font-mono font-semibold text-[#7a8697]">{issue.id}</span>
              <Badge label={p.label} bg={p.bg} color={p.color} />
              <Badge label={s.label} bg={s.bg} color={s.color} />
            </div>
            <h1 className="font-display text-xl mb-3" style={{ color: '#0f1923', fontWeight: 800 }}>
              {issue.type} — {issue.location}
            </h1>
            <p className="text-sm text-[#4a5568] mb-5">{issue.description}</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Issue ID',      value: issue.id },
                { label: 'Reported by',   value: issue.citizenName },
                { label: 'Submitted',     value: issue.submittedAt },
                { label: 'Ward',          value: issue.ward },
                { label: 'AI Category',   value: issue.aiCategory },
                { label: 'AI Confidence', value: `${issue.aiConfidence}% · ${issue.aiSeverity} severity` },
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
              <span className="text-xs text-[#4a5568]">AI classified in <strong>1.2s</strong> with {issue.aiConfidence}% confidence</span>
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-sm mb-4" style={{ color: '#0f1923', fontWeight: 700 }}>Status Timeline</h2>
            <ActivityLog updates={issue.updates} />
            <div className="mt-4">
              <ProgressBar status={issue.status} showLabels />
            </div>
          </Card>

          {issue.assignedWorkerName && (
            <Card>
              <div className="text-xs font-semibold text-[#7a8697] uppercase tracking-wide mb-3">Assigned Worker</div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#1a3353' }}>
                  {issue.assignedWorkerName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: '#0f1923' }}>{issue.assignedWorkerName}</div>
                  <div className="text-xs text-[#7a8697] mt-0.5">Assigned · {issue.submittedAt.split(',')[0]}</div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                </span>
              </div>
            </Card>
          )}

          {(issue.status === 'resolved' || issue.status === 'verified') && issue.resolvedAt && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
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
