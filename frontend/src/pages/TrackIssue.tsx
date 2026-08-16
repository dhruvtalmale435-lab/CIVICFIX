import { useState } from 'react'
import {
  Search, ChevronRight, MapPin, Clock,
  AlertTriangle, Lightbulb, Trash2, Droplets, TreePine, Wrench
} from 'lucide-react'
import type { Issue } from '../types'

const STATUSES = ['All', 'Open', 'Assigned', 'In Progress', 'Resolved']

const PC: Record<string, { label: string; bg: string; c: string }> = {
  urgent: { label: 'Urgent', bg: '#fef2f2', c: '#dc2626' },
  high:   { label: 'High',   bg: '#fffbeb', c: '#d97706' },
  medium: { label: 'Medium', bg: '#fefce8', c: '#ca8a04' },
  low:    { label: 'Low',    bg: '#f0fdf4', c: '#16a34a' },
}

const SC: Record<string, { label: string; bg: string; c: string; step: number }> = {
  pending_ai:      { label: 'Analyzing',   bg: '#eff6ff', c: '#1d4ed8', step: 1 },
  duplicate:       { label: 'Duplicate',   bg: '#fdf4ff', c: '#9333ea', step: 0 },
  open:            { label: 'Open',        bg: '#f1f5f9', c: '#475569', step: 1 },
  rejected:        { label: 'Rejected',    bg: '#fef2f2', c: '#dc2626', step: 1 },
  assigned:        { label: 'Assigned',    bg: '#f5f3ff', c: '#7c3aed', step: 2 },
  accepted:        { label: 'Accepted',    bg: '#eff6ff', c: '#1d4ed8', step: 2 },
  in_progress:     { label: 'In Progress', bg: '#fffbeb', c: '#b45309', step: 3 },
  proof_submitted: { label: 'Under Review',bg: '#fdf4ff', c: '#9333ea', step: 3 },
  verified:        { label: 'Verified',    bg: '#f0fdf4', c: '#16a34a', step: 4 },
  resolved:        { label: 'Resolved',    bg: '#f0fdf4', c: '#16a34a', step: 4 },
}

const TYPE_ICONS: Record<string, React.FC<{ size: number; color: string }>> = {
  'Pothole': AlertTriangle, 'Garbage': Trash2, 'Streetlight': Lightbulb,
  'Water Leakage': Droplets, 'Drain Blockage': Droplets,
  'Fallen Tree': TreePine, 'Damaged Road': Wrench,
}
const TYPE_COLORS: Record<string, string> = {
  'Pothole': '#dc2626', 'Garbage': '#d97706', 'Streetlight': '#ca8a04',
  'Water Leakage': '#1d4ed8', 'Drain Blockage': '#1d4ed8',
  'Fallen Tree': '#16a34a', 'Damaged Road': '#7c3aed',
}

const PROGRESS_LABELS = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved']

const STATUS_GROUP: Record<string, string> = {
  pending_ai: 'Open', duplicate: 'Open', open: 'Open', rejected: 'Open',
  assigned: 'Assigned', accepted: 'Assigned',
  in_progress: 'In Progress', proof_submitted: 'In Progress',
  verified: 'Resolved', resolved: 'Resolved',
}

interface Props {
  issues: Issue[]
  setPage: (p: string, issueId?: string) => void
}

export default function TrackIssue({ issues, setPage }: Props) {
  const [activeStatus, setActiveStatus] = useState('All')
  const [search, setSearch] = useState('')

  const visible = issues.filter(i => i.status !== 'duplicate')

  const filtered = visible.filter(iss => {
    const matchStatus = activeStatus === 'All' || STATUS_GROUP[iss.status] === activeStatus
    const matchSearch = !search ||
      iss.id.toLowerCase().includes(search.toLowerCase()) ||
      iss.type.toLowerCase().includes(search.toLowerCase()) ||
      iss.location.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h1 className="font-display text-2xl font-800 mb-1" style={{ color: '#0f1923', fontWeight: 800 }}>
          Track Issues
        </h1>
        <p className="text-sm text-[#4a5568]">
          Follow submitted reports or browse active issues in your ward.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a8697' }} />
          <input
            type="text"
            placeholder="Search by ID, type or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#e4e8ef] bg-white"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
              style={{
                background: activeStatus === s ? '#1a3353' : '#f0f4f8',
                color: activeStatus === s ? 'white' : '#4a5568',
              }}
            >
              {s}
              {s !== 'All' && (
                <span className="ml-1.5 opacity-60">
                  {visible.filter(i => STATUS_GROUP[i.status] === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-[#7a8697] mb-4">
        {filtered.length} issue{filtered.length !== 1 ? 's' : ''} found
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(iss => {
          const p = PC[iss.priority] ?? PC.medium
          const s = SC[iss.status] ?? { label: iss.status, bg: '#f1f5f9', c: '#475569', step: 0 }
          const Icon = TYPE_ICONS[iss.type] ?? AlertTriangle
          const iconColor = TYPE_COLORS[iss.type] ?? '#1a3353'

          return (
            <div key={iss.id}
              className="bg-white rounded-xl border border-[#e4e8ef] p-5 transition-shadow hover:shadow-md"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: iconColor + '12' }}>
                  <Icon size={18} color={iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-semibold" style={{ color: '#7a8697' }}>{iss.id}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold"
                      style={{ background: p.bg, color: p.c }}>{p.label}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold"
                      style={{ background: s.bg, color: s.c }}>{s.label}</span>
                  </div>
                  <div className="text-[14px] font-semibold mb-1.5 truncate" style={{ color: '#0f1923', fontFamily: 'Manrope,sans-serif' }}>
                    {iss.type} — {iss.location}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-[#7a8697]">
                      <MapPin size={11} /> {iss.address}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#7a8697]">
                      <Clock size={11} /> {iss.submittedAt}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    {PROGRESS_LABELS.map((label, idx) => (
                      <div key={label} title={label} className="flex items-center gap-1 flex-1">
                        <div className="h-1.5 w-full rounded-full"
                          style={{
                            background: s.step > idx
                              ? (iss.status === 'resolved' || iss.status === 'verified' ? '#16a34a' : '#1a3353')
                              : '#e4e8ef',
                          }}
                        />
                      </div>
                    ))}
                    <span className="text-[10px] text-[#7a8697] ml-2 whitespace-nowrap">{s.label}</span>
                  </div>
                </div>
                <button
                  onClick={() => setPage('details', iss.id)}
                  className="self-start sm:self-center flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#e4e8ef] shrink-0"
                  style={{ color: '#1a3353', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f4f7fb'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  View Details <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: '#f0f4f8' }}>
            <Search size={20} color="#7a8697" />
          </div>
          <div className="text-sm font-semibold text-[#4a5568]">No issues match your search</div>
          <div className="text-xs text-[#7a8697] mt-1">Try a different filter or search term</div>
        </div>
      )}
    </div>
  )
}
