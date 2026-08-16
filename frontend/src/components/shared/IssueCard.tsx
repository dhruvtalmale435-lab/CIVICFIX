import { AlertTriangle, Lightbulb, Trash2, Droplets, TreePine, Wrench, Clock, MapPin, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge, Card } from '../ui'
import { ProgressBar } from './ProgressBar'
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../lib/constants'
import type { Issue } from '../../types'

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

interface IssueCardProps {
  issue: Issue
  mine?: boolean
  href?: string
  onView?: () => void
}

export function IssueCard({ issue, mine, href, onView }: IssueCardProps) {
  const navigate = useNavigate()
  const p = PRIORITY_CONFIG[issue.priority] ?? PRIORITY_CONFIG.medium
  const s = STATUS_CONFIG[issue.status] ?? { label: issue.status, bg: '#f1f5f9', color: '#475569' }
  const Icon = TYPE_ICONS[issue.type] ?? AlertTriangle
  const iconColor = TYPE_COLORS[issue.type] ?? '#1a3353'

  const handleView = () => {
    if (onView) { onView(); return }
    if (href) navigate(href)
  }

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconColor + '12' }}>
          <Icon size={17} color={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-semibold text-[#7a8697]">{issue.id}</span>
            {mine && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: '#eff6ff', color: '#1d4ed8' }}>My Report</span>}
            <Badge label={p.label} bg={p.bg} color={p.color} />
            <Badge label={s.label} bg={s.bg} color={s.color} />
          </div>
          <div className="text-sm font-semibold mb-1" style={{ color: '#0f1923', fontFamily: 'Manrope,sans-serif' }}>
            {issue.type} — {issue.location}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#7a8697] mb-3">
            <span className="flex items-center gap-1"><MapPin size={11} />{issue.ward}</span>
            <span className="flex items-center gap-1"><Clock size={11} />{issue.submittedAt}</span>
          </div>
          <ProgressBar status={issue.status} />
        </div>
        <button
          onClick={handleView}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#e4e8ef] hover:bg-[#f4f7fb]"
          style={{ color: '#1a3353' }}
        >
          <Eye size={12} /> View
        </button>
      </div>
    </Card>
  )
}
