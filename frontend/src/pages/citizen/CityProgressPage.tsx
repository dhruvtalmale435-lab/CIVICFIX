import { useIssues } from '../../context/IssuesContext'
import { Card } from '../../components/ui'
import { TrendingUp, Award, BarChart3 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const WEEKLY = [
  { week: 'Wk 1', reported: 62, resolved: 48 },
  { week: 'Wk 2', reported: 74, resolved: 61 },
  { week: 'Wk 3', reported: 58, resolved: 55 },
  { week: 'Wk 4', reported: 80, resolved: 72 },
]

const CATEGORY_PERF = [
  { name: 'Roads & Potholes', total: 142, resolved: 119, color: '#dc2626' },
  { name: 'Sanitation',       total: 98,  resolved: 84,  color: '#d97706' },
  { name: 'Streetlights',     total: 63,  resolved: 58,  color: '#ca8a04' },
  { name: 'Water Supply',     total: 55,  resolved: 49,  color: '#1d4ed8' },
  { name: 'Drainage',         total: 44,  resolved: 36,  color: '#16a34a' },
]

export function CityProgressPage() {
  const { issues } = useIssues()
  const resolved = issues.filter(i => i.status === 'resolved').length
  const total = issues.filter(i => i.status !== 'duplicate').length
  const resRate = total > 0 ? Math.round((resolved / total) * 100) : 0
  const healthScore = Math.min(100, Math.round(60 + resRate * 0.3 + 8))

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-xl mb-1" style={{ color: '#0f1923', fontWeight: 800 }}>City Health & Progress</h1>
        <p className="text-sm text-[#7a8697]">How Pune is improving — live data from CIVICFIX</p>
      </div>

      <Card className="mb-4 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative flex items-center justify-center shrink-0" style={{ width: 120, height: 120 }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f2f6" strokeWidth="10" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#16a34a" strokeWidth="10"
              strokeDasharray={`${(healthScore / 100) * 314} 314`} strokeLinecap="round" transform="rotate(-90 60 60)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display text-2xl" style={{ color: '#0f1923', fontWeight: 800 }}>{healthScore}</div>
            <div className="text-[10px] text-[#7a8697]">/ 100</div>
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2" style={{ background: '#f0fdf4' }}>
            <Award size={13} color="#16a34a" />
            <span className="text-xs font-semibold text-green-700">City Health Score</span>
          </div>
          <h2 className="font-display text-2xl mb-1" style={{ fontWeight: 800, color: '#0f1923' }}>
            {healthScore >= 80 ? 'Excellent' : healthScore >= 65 ? 'Good Progress' : 'Improving'}
          </h2>
          <p className="text-sm text-[#4a5568] mb-3">Pune is resolving civic issues faster than last month.</p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {[
              { label: 'Resolved',     value: `${resolved}`, sub: 'this month',    c: '#16a34a' },
              { label: 'Avg Time',     value: '4.2d',        sub: '↓ from 6.1d',  c: '#1d4ed8' },
              { label: 'Satisfaction', value: '4.2★',        sub: '1,284 ratings', c: '#d97706' },
            ].map(k => (
              <div key={k.label} className="px-3 py-2 rounded-xl text-center" style={{ background: '#f8f9fb', minWidth: 80 }}>
                <div className="font-display text-lg leading-none mb-0.5" style={{ color: k.c, fontWeight: 700 }}>{k.value}</div>
                <div className="text-[10px] font-semibold text-[#0f1923]">{k.label}</div>
                <div className="text-[9px] text-[#7a8697]">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={15} color="#1a3353" />
          <div className="font-display text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>Issues Reported vs. Resolved — Last 4 Weeks</div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={WEEKLY} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
            <defs>
              <linearGradient id="cgR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a3353" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#1a3353" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cgG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f0f2f6" strokeDasharray="4 4" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#7a8697' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#7a8697' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #e4e8ef' }} />
            <Area type="monotone" dataKey="reported" stroke="#1a3353" strokeWidth={2} fill="url(#cgR)" name="Reported" />
            <Area type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2} fill="url(#cgG)" name="Resolved" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={14} color="#1a3353" />
          <div className="font-display text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>By Category</div>
        </div>
        <div className="flex flex-col gap-3">
          {CATEGORY_PERF.map(c => {
            const pct = Math.round((c.resolved / c.total) * 100)
            return (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#4a5568]">{c.name}</span>
                  <span className="text-xs font-semibold" style={{ color: c.color }}>{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#f0f2f6' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                </div>
                <div className="text-[10px] text-[#7a8697] mt-0.5">{c.resolved} of {c.total} resolved</div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
