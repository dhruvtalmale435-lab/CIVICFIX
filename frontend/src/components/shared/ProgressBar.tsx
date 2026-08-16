import { PROGRESS_STEPS } from '../../lib/constants'
import type { IssueStatus } from '../../types'

const STATUS_TO_STEP: Record<IssueStatus, number> = {
  pending_ai: 0, duplicate: 0, open: 1, rejected: 1,
  assigned: 2, accepted: 2, in_progress: 3, proof_submitted: 3,
  verified: 4, resolved: 4,
}

export function ProgressBar({ status, showLabels = false }: { status: IssueStatus; showLabels?: boolean }) {
  const step = STATUS_TO_STEP[status] ?? 0
  const done = status === 'resolved' || status === 'verified'
  return (
    <div className="flex items-center gap-1">
      {PROGRESS_STEPS.map((label, idx) => (
        <div key={label} title={label} className="flex-1">
          <div className="h-1.5 rounded-full" style={{
            background: step > idx ? (done ? '#16a34a' : '#1a3353') : step === idx ? '#1a3353' : '#e4e8ef'
          }} />
          {showLabels && <div className="text-[9px] text-center mt-1 text-[#7a8697]">{label}</div>}
        </div>
      ))}
    </div>
  )
}
