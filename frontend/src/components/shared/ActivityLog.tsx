import { Cpu } from 'lucide-react'
import type { IssueUpdate } from '../../types'
import { ROLE_COLORS } from '../../lib/constants'

export function ActivityLog({ updates }: { updates: IssueUpdate[] }) {
  return (
    <div className="flex flex-col">
      {updates.map((u, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold"
              style={{ background: ROLE_COLORS[u.byRole] ?? '#94a3b8' }}>
              {u.byRole === 'ai' ? <Cpu size={11} /> : u.by.charAt(0)}
            </div>
            {i < updates.length - 1 && <div className="w-px flex-1 my-1 min-h-[20px]" style={{ background: '#e4e8ef' }} />}
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
  )
}
