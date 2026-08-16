import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Cpu, UserCheck, Wrench, AlertTriangle, Lightbulb, Trash2, Droplets, TreePine, TrendingUp, Clock, Star, ChevronRight, Shield } from 'lucide-react'
import { CityMap } from '../../components/shared'

const steps = [
  { number: '01', title: 'Report', description: 'Snap a photo, pin the location, and submit in under 30 seconds.', icon: AlertTriangle, color: '#dc2626' },
  { number: '02', title: 'AI Verification', description: 'Our model classifies the issue, estimates severity, and sets a priority score.', icon: Cpu, color: '#d97706' },
  { number: '03', title: 'Smart Assignment', description: 'The nearest available worker with the right skills is auto-assigned.', icon: UserCheck, color: '#1d4ed8' },
  { number: '04', title: 'Resolution', description: 'Track real-time progress. Get notified when your issue is closed.', icon: Wrench, color: '#16a34a' },
]

const issueTypes = [
  { icon: AlertTriangle, label: 'Potholes',    count: '3,240', color: '#dc2626' },
  { icon: Trash2,        label: 'Garbage',     count: '2,180', color: '#d97706' },
  { icon: Lightbulb,     label: 'Streetlights',count: '1,840', color: '#ca8a04' },
  { icon: Droplets,      label: 'Water Issues',count: '1,560', color: '#1d4ed8' },
  { icon: TreePine,      label: 'Fallen Trees', count: '820',  color: '#16a34a' },
]

const stats = [
  { value: '12,480+', label: 'Issues Reported',  sub: 'Across all wards',       icon: AlertTriangle, color: '#dc2626' },
  { value: '8,920',   label: 'Issues Resolved',  sub: 'Verified closed',         icon: CheckCircle2,  color: '#16a34a' },
  { value: '72%',     label: 'Resolution Rate',  sub: 'City-wide average',       icon: TrendingUp,    color: '#1d4ed8' },
  { value: '4.6 days',label: 'Avg. Resolution',  sub: 'Down from 11 last year',  icon: Clock,         color: '#d97706' },
]

export function HomePage() {
  const navigate = useNavigate()
  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-10">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-7 border" style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#16a34a' }} /> Live across 14 Indian cities
            </div>
            <h1 className="font-display leading-[1.08] tracking-tight mb-5" style={{ fontSize: 'clamp(2rem,4vw,2.9rem)', fontWeight: 800, color: '#0f1923' }}>
              Fixing Cities,<br /><span style={{ color: '#1a3353' }}>One Issue</span><span style={{ color: '#16a34a' }}> at a Time.</span>
            </h1>
            <p className="text-[15px] leading-relaxed mb-8 max-w-[440px]" style={{ color: '#4a5568' }}>
              Report civic problems, track their progress, and help your city become cleaner, safer, and smarter — backed by AI that prioritizes what matters most.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <button onClick={() => navigate('/report')} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg hover:opacity-90" style={{ background: '#1a3353' }}>
                Report an Issue <ArrowRight size={15} />
              </button>
              <button onClick={() => navigate('/track')} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg border hover:bg-[#f4f7fb]" style={{ color: '#1a3353', borderColor: '#c8d0dc', background: '#fff' }}>
                Track My Report
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-5 pt-6 border-t border-[#eaecf2]">
              <div className="flex items-center gap-1.5"><Star size={14} fill="#f59e0b" color="#f59e0b" /><span className="text-sm font-semibold" style={{ color: '#0f1923' }}>4.8</span><span className="text-sm text-[#7a8697]">Citizen rating</span></div>
              <div className="w-px h-4 bg-[#e4e8ef]" />
              <div className="flex items-center gap-1.5"><CheckCircle2 size={14} color="#16a34a" /><span className="text-sm text-[#7a8697]">Used by 14 cities</span></div>
              <div className="w-px h-4 bg-[#e4e8ef]" />
              <div className="flex items-center gap-1.5"><Shield size={14} color="#1d4ed8" /><span className="text-sm text-[#7a8697]">ISO 27001 certified</span></div>
            </div>
          </div>
          <div>
            <CityMap showNotification height="430px" />
            <div className="flex gap-2 mt-3 flex-wrap">
              {issueTypes.map(t => (
                <button key={t.label} onClick={() => navigate('/track')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-xs font-medium border border-[#e4e8ef] hover:shadow-md" style={{ color: '#0f1923' }}>
                  <t.icon size={11} color={t.color} />{t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#e4e8ef] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-9">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-[#e4e8ef]">
            {stats.map(s => (
              <div key={s.label} className="px-8 py-4 flex items-center gap-4 first:pl-0 last:pr-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.color + '12' }}>
                  <s.icon size={18} color={s.color} />
                </div>
                <div>
                  <div className="font-display text-[1.6rem] leading-none mb-0.5" style={{ color: '#0f1923', fontWeight: 800 }}>{s.value}</div>
                  <div className="text-xs font-semibold text-[#0f1923]">{s.label}</div>
                  <div className="text-xs text-[#7a8697]">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#7a8697] mb-2">How It Works</div>
            <h2 className="font-display text-2xl" style={{ color: '#0f1923', fontWeight: 700 }}>From report to resolution in 4 steps</h2>
          </div>
          <button onClick={() => navigate('/report')} className="hidden sm:flex items-center gap-1 text-sm font-medium" style={{ color: '#1a3353' }}>
            Start reporting <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div key={step.number} className="relative bg-white rounded-xl p-5 border border-[#e4e8ef]">
              {i < steps.length - 1 && <div className="hidden lg:flex absolute top-7 -right-3 z-10 w-6 items-center justify-center"><ChevronRight size={14} color="#c8d0dc" /></div>}
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: step.color + '14' }}><step.icon size={17} color={step.color} /></div>
                <span className="text-xs font-mono font-semibold" style={{ color: '#c8d0dc' }}>{step.number}</span>
              </div>
              <h3 className="font-display text-[15px] mb-1.5" style={{ color: '#0f1923', fontWeight: 700 }}>{step.title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: '#4a5568' }}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: '#1a3353' }}>
          <div>
            <h2 className="font-display text-[1.4rem] text-white mb-1.5" style={{ fontWeight: 700 }}>Spotted something broken in your neighborhood?</h2>
            <p className="text-sm" style={{ color: '#8ba5c4' }}>It takes 30 seconds to report an issue. Your report creates real, traceable change.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={() => navigate('/report')} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-white hover:opacity-90" style={{ color: '#1a3353' }}>
              Report an Issue <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate('/login')} className="px-5 py-2.5 text-sm font-semibold rounded-xl border text-white hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.25)' }}>
              Login
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
