import { ThumbsUp, Plus, MapPin, CheckCircle2, Clock, ChevronRight, Star } from 'lucide-react'
import { useState } from 'react'

const RESOLUTIONS = [
  {
    id: 1,
    title: 'Pothole repaired — Ward 4',
    location: 'FC Road, Pune',
    resolvedTime: 'Today, 11:30 AM',
    days: 3,
    likes: 48,
    category: 'Pothole',
    ward: 'Ward 4',
  },
  {
    id: 2,
    title: 'Storm drain cleared',
    location: 'Koregaon Park',
    resolvedTime: 'Yesterday, 4:00 PM',
    days: 2,
    likes: 31,
    category: 'Drainage',
    ward: 'Ward 8',
  },
  {
    id: 3,
    title: 'Streetlight restored',
    location: 'Camp Area, Pune',
    resolvedTime: '2 days ago',
    days: 4,
    likes: 22,
    category: 'Streetlight',
    ward: 'Ward 5',
  },
  {
    id: 4,
    title: 'Garbage cleared, bin repaired',
    location: 'Aundh, Ward 12',
    resolvedTime: '3 days ago',
    days: 1,
    likes: 55,
    category: 'Garbage',
    ward: 'Ward 12',
  },
]

const IMPACT = [
  { value: '8,920',  label: 'Issues Resolved',   color: '#16a34a' },
  { value: '14',     label: 'Cities Active',      color: '#1a3353' },
  { value: '42,000+',label: 'Citizens Engaged',   color: '#d97706' },
  { value: '4.6d',   label: 'Avg. Resolution',    color: '#1d4ed8' },
]

const CATEGORY_COLORS: Record<string, string> = {
  Pothole: '#dc2626',
  Drainage: '#1d4ed8',
  Streetlight: '#ca8a04',
  Garbage: '#d97706',
}

function BeforeAfterCard({ item, setPage }: { item: typeof RESOLUTIONS[0]; setPage: (p: string) => void }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(item.likes)
  const col = CATEGORY_COLORS[item.category] ?? '#1a3353'

  const handleLike = () => {
    setLiked(v => !v)
    setCount(v => liked ? v - 1 : v + 1)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e4e8ef] overflow-hidden"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.09)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)')}>

      {/* Before/After */}
      <div className="grid grid-cols-2">
        {[
          { label: 'Before', dark: true },
          { label: 'After',  dark: false },
        ].map(({ label, dark }) => (
          <div key={label} className="relative" style={{ height: 170, background: dark ? '#6b7280' : '#4b5563' }}>
            <svg width="100%" height="100%" viewBox="0 0 200 170">
              <rect width="200" height="170" fill={dark ? '#94a3b8' : '#64748b'} />
              {/* Road */}
              <rect x="0" y="90" width="200" height="80" fill={dark ? '#6b7280' : '#475569'} />
              {/* Lane marking */}
              <rect x="92" y="100" width="16" height="28" fill="#9ca3af" opacity={dark ? 0.4 : 0} rx="1" />
              <rect x="92" y="136" width="16" height="20" fill="#9ca3af" opacity={dark ? 0.4 : 0} rx="1" />
              {/* Issue or clean road */}
              {dark ? (
                <>
                  <ellipse cx="100" cy="130" rx="42" ry="26" fill="#1f2937" />
                  <ellipse cx="92"  cy="124" rx="14" ry="9"  fill="#111827" />
                </>
              ) : (
                <>
                  <rect x="90" y="98" width="16" height="24" fill="#9ca3af" opacity="0.4" rx="1" />
                  <rect x="90" y="132" width="16" height="24" fill="#9ca3af" opacity="0.4" rx="1" />
                </>
              )}
              {/* Buildings */}
              <rect x="8"   y="30" width="34" height="60" fill={dark ? '#9ca3af' : '#6b7280'} opacity="0.7" />
              <rect x="50"  y="10" width="44" height="80" fill={dark ? '#6b7280' : '#4b5563'} opacity="0.5" />
              <rect x="148" y="20" width="38" height="70" fill={dark ? '#9ca3af' : '#6b7280'} opacity="0.7" />
              {/* Windows */}
              {[16,28,40].map(x => [38,52].map(y => (
                <rect key={`${x}${y}`} x={x} y={y} width="6" height="8" fill="#e2e8f0" opacity={dark ? 0.5 : 0.7} rx="0.5" />
              )))}
            </svg>
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold"
              style={{
                background: dark ? 'rgba(185,28,28,0.85)' : 'rgba(21,128,61,0.85)',
                color: 'white',
              }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h3 className="font-display font-700 text-sm leading-snug" style={{ color: '#0f1923', fontWeight: 700 }}>
            {item.title}
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold shrink-0"
            style={{ background: '#f0fdf4', color: '#16a34a' }}>Resolved</span>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-[#7a8697] mb-3">
          <span className="flex items-center gap-1"><MapPin size={11} /> {item.location}</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {item.resolvedTime}</span>
          <span className="flex items-center gap-1"><CheckCircle2 size={11} color="#16a34a" /> {item.days}d to resolve</span>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            style={{
              background: liked ? '#f0fdf4' : '#f8f9fb',
              color: liked ? '#16a34a' : '#4a5568',
              borderColor: liked ? '#86efac' : '#e4e8ef',
            }}>
            <ThumbsUp size={12} />
            Helpful · {count}
          </button>
          <button
            onClick={() => setPage('report')}
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: '#1a3353' }}>
            <Plus size={12} /> Report Similar
          </button>
        </div>
      </div>
    </div>
  )
}

interface Props { setPage: (p: string) => void }

export default function Community({ setPage }: Props) {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? RESOLUTIONS :
    RESOLUTIONS.filter(r => r.category === filter || r.ward === filter)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 border"
          style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}>
          <CheckCircle2 size={12} /> Real Impact, Real Results
        </div>
        <h1 className="font-display font-800 mb-3" style={{ fontSize: 'clamp(1.7rem,3.5vw,2.3rem)', fontWeight: 800, color: '#0f1923' }}>
          See Your City Improve
        </h1>
        <p className="text-sm text-[#4a5568] max-w-md mx-auto leading-relaxed">
          Every report you submit creates traceable, verifiable change. Browse resolved issues and see what citizens across Pune are accomplishing.
        </p>
      </div>

      {/* Impact stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {IMPACT.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#e4e8ef] px-5 py-4 text-center"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="font-display font-800 text-2xl mb-0.5" style={{ color: s.color, fontWeight: 800 }}>{s.value}</div>
            <div className="text-xs text-[#7a8697]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display font-700 text-lg" style={{ color: '#0f1923', fontWeight: 700 }}>
          Recently Resolved
        </h2>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Pothole', 'Drainage', 'Streetlight', 'Garbage'].map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors"
              style={{
                background: filter === f ? '#1a3353' : '#fff',
                color: filter === f ? 'white' : '#4a5568',
                borderColor: filter === f ? '#1a3353' : '#e4e8ef',
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-5 mb-10">
        {filtered.map(item => (
          <BeforeAfterCard key={item.id} item={item} setPage={setPage} />
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { name: 'Meera Joshi', ward: 'Ward 4', quote: 'I reported a pothole at 9am and it was fixed by 3pm. Never thought civic tech could work this fast.' },
          { name: 'Arjun Patil', ward: 'Ward 7', quote: 'The drain near our school used to flood every monsoon. CIVICFIX got it cleared in 2 days.' },
          { name: 'Sangeeta R.', ward: 'Ward 12', quote: 'My streetlight report was assigned to a worker within the hour. It felt like someone was actually listening.' },
        ].map(t => (
          <div key={t.name} className="bg-white rounded-xl border border-[#e4e8ef] p-5"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex gap-0.5 mb-3">
              {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <p className="text-sm text-[#4a5568] leading-relaxed mb-4">"{t.quote}"</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: '#1a3353' }}>
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: '#0f1923' }}>{t.name}</div>
                <div className="text-[10px] text-[#7a8697]">{t.ward}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-5"
        style={{ background: '#1a3353' }}>
        <div>
          <h3 className="font-display font-700 text-base text-white mb-1" style={{ fontWeight: 700 }}>
            Spotted something that needs fixing?
          </h3>
          <p className="text-sm" style={{ color: '#8ba5c4' }}>
            Your report goes directly to the right team.
          </p>
        </div>
        <button
          onClick={() => setPage('report')}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-white"
          style={{ color: '#1a3353' }}>
          Report an Issue <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
