import { useState } from 'react'
import {
  LayoutDashboard, AlertCircle, Map, Cpu, Users, BarChart2,
  FileText, Settings, Bell, ChevronDown, X, TrendingUp,
  AlertTriangle, Lightbulb, Trash2, Droplets, TreePine,
  Wrench, Zap, CheckCircle2, ArrowUpRight, Clock, Filter,
  RefreshCw, MapPin
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, AreaChart, Area,
  PieChart, Pie, Cell,
} from 'recharts'
import CityMap from '../components/CityMap'
import { WORKERS } from '../data'

type Section = 'dashboard' | 'issues' | 'map' | 'ai' | 'workers' | 'analytics' | 'reports'

const NAV = [
  { id: 'dashboard' as Section, label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'issues'    as Section, label: 'Issues',       icon: AlertCircle },
  { id: 'map'       as Section, label: 'Live Map',     icon: Map },
  { id: 'ai'        as Section, label: 'AI Insights',  icon: Cpu },
  { id: 'workers'   as Section, label: 'Field Workers',icon: Users },
  { id: 'analytics' as Section, label: 'Analytics',    icon: BarChart2 },
  { id: 'reports'   as Section, label: 'Reports',      icon: FileText },
]

const KPIS = [
  { label: 'Open Issues',    value: '1,248', sub: '↑ 12% this week',      icon: AlertCircle,   c: '#dc2626', bg: '#fef2f2' },
  { label: 'High Priority',  value: '186',   sub: 'Requires attention',   icon: Zap,           c: '#d97706', bg: '#fffbeb' },
  { label: 'In Progress',    value: '324',   sub: 'Currently assigned',   icon: Wrench,        c: '#1d4ed8', bg: '#eff6ff' },
  { label: 'Resolved',       value: '892',   sub: 'This month',           icon: CheckCircle2,  c: '#16a34a', bg: '#f0fdf4' },
]

const AI_QUEUE = [
  {
    rank: '01', title: 'Water Leakage', location: 'Shivaji Nagar, Ward 5',
    priority: 'Critical', score: 92,
    reason: 'High water loss rate + major road obstruction risk near school zone',
    c: '#dc2626', bg: '#fef2f2', type: 'water',
  },
  {
    rank: '02', title: 'Road Damage', location: 'MG Road, near Station',
    priority: 'High', score: 84,
    reason: 'Heavy traffic arterial, structural deterioration widening daily',
    c: '#d97706', bg: '#fffbeb', type: 'road',
  },
  {
    rank: '03', title: 'Blocked Storm Drain', location: 'Ward 7, Kothrud',
    priority: 'Medium', score: 68,
    reason: 'Pre-monsoon risk, residential flooding if not cleared within 72h',
    c: '#ca8a04', bg: '#fefce8', type: 'drain',
  },
]

const WEEKLY = [
  { day: 'Mon', reported: 48, resolved: 32 },
  { day: 'Tue', reported: 62, resolved: 45 },
  { day: 'Wed', reported: 55, resolved: 50 },
  { day: 'Thu', reported: 71, resolved: 58 },
  { day: 'Fri', reported: 80, resolved: 64 },
  { day: 'Sat', reported: 45, resolved: 38 },
  { day: 'Sun', reported: 30, resolved: 28 },
]

const CATEGORY = [
  { name: 'Roads',      value: 38, color: '#dc2626' },
  { name: 'Garbage',    value: 22, color: '#d97706' },
  { name: 'Streetlts.', value: 16, color: '#ca8a04' },
  { name: 'Water',      value: 14, color: '#1d4ed8' },
  { name: 'Drainage',   value: 7,  color: '#16a34a' },
  { name: 'Other',      value: 3,  color: '#94a3b8' },
]

const WARD_DATA = [
  { ward: 'Ward 1', res: 94, open: 12 },
  { ward: 'Ward 2', res: 78, open: 24 },
  { ward: 'Ward 3', res: 88, open: 18 },
  { ward: 'Ward 4', res: 65, open: 35 },
  { ward: 'Ward 5', res: 91, open: 9  },
]

const RECENT_ISSUES = [
  { id: 'CF-10492', title: 'Pothole — Deep cavity',   loc: 'MG Road',        p: 'urgent', s: 'assigned',    time: '12m ago'   },
  { id: 'CF-10490', title: 'Garbage overflow',         loc: 'Shivaji Nagar', p: 'high',   s: 'verified',    time: '28m ago'   },
  { id: 'CF-10488', title: 'Burst water pipe',         loc: 'Koregaon Park', p: 'urgent', s: 'in-progress', time: '45m ago'   },
  { id: 'CF-10486', title: 'Streetlight out',          loc: 'Camp Area',     p: 'medium', s: 'reported',    time: '1h ago'    },
  { id: 'CF-10484', title: 'Fallen tree blocking road',loc: 'Baner Road',    p: 'high',   s: 'in-progress', time: '2h ago'    },
]

const PC: Record<string, string> = { urgent: '#dc2626', high: '#d97706', medium: '#ca8a04', low: '#16a34a' }
const PB: Record<string, string> = { urgent: '#fef2f2', high: '#fffbeb', medium: '#fefce8', low: '#f0fdf4' }
const SL: Record<string, { label: string; bg: string; c: string }> = {
  reported:    { label: 'Reported',    bg: '#f1f5f9', c: '#475569' },
  verified:    { label: 'Verified',    bg: '#eff6ff', c: '#1d4ed8' },
  assigned:    { label: 'Assigned',    bg: '#f5f3ff', c: '#7c3aed' },
  'in-progress':{ label: 'In Progress',bg: '#fffbeb', c: '#b45309' },
  resolved:    { label: 'Resolved',    bg: '#f0fdf4', c: '#16a34a' },
}

const avatarColors = ['#1a3353','#16a34a','#d97706','#1d4ed8','#7c3aed']

interface Props { setPage: (p: string) => void }

export default function AdminDashboard({ setPage }: Props) {
  const [section, setSection] = useState<Section>('dashboard')
  const [assignModal, setAssignModal] = useState(false)
  const [assigned, setAssigned] = useState(false)

  return (
    <div className="flex h-[calc(100vh-0px)]" style={{ background: '#f5f7fa' }}>

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col bg-white border-r border-[#e4e8ef] shrink-0" style={{ width: 216 }}>
        {/* Logo */}
        <div className="px-5 py-4 border-b border-[#e4e8ef]">
          <button onClick={() => setPage('home')} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#1a3353' }}>
              <MapPin size={13} color="white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-800 text-[15px]" style={{ color: '#1a3353', fontWeight: 800 }}>
              CIVIC<span style={{ color: '#16a34a' }}>FIX</span>
            </span>
          </button>
          <div className="text-[10px] text-[#7a8697] mt-0.5 pl-9">Municipal Dashboard</div>
        </div>

        {/* Nav */}
        <div className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map(link => (
            <button
              key={link.id}
              onClick={() => setSection(link.id)}
              className={`sidebar-link ${section === link.id ? 'active' : ''}`}
            >
              <link.icon size={15} />
              <span>{link.label}</span>
              {link.id === 'issues' && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: section === 'issues' ? 'rgba(255,255,255,0.25)' : '#fef2f2', color: section === 'issues' ? 'white' : '#dc2626' }}>
                  12
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Settings + Profile */}
        <div className="border-t border-[#e4e8ef] px-3 py-3 space-y-0.5">
          <button className="sidebar-link">
            <Settings size={15} /><span>Settings</span>
          </button>
          <div className="flex items-center gap-2.5 px-3 py-2.5 mt-1 rounded-xl" style={{ background: '#f8f9fb' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: '#1a3353' }}>MA</div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: '#0f1923' }}>Municipal Admin</div>
              <div className="text-[10px] text-[#7a8697] truncate">Pune PMC · Ward 5</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-[#e4e8ef] px-6 py-3 flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-display text-[15px] font-700" style={{ color: '#0f1923', fontWeight: 700 }}>
              Good morning, Admin
            </h1>
            <p className="text-xs text-[#7a8697]">Here's what's happening across Pune today — Sat 16 Aug 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#e4e8ef] text-[#4a5568]">
              <RefreshCw size={12} /> Refresh
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#e4e8ef] relative">
              <Bell size={15} color="#4a5568" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 pl-1 cursor-pointer">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: '#1a3353' }}>MA</div>
              <ChevronDown size={13} color="#7a8697" />
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5 max-w-[1400px]">

            {/* ── KPI row ── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {KPIS.map(k => (
                <div key={k.label} className="bg-white rounded-xl border border-[#e4e8ef] p-5"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: k.bg }}>
                      <k.icon size={17} color={k.c} />
                    </div>
                    <ArrowUpRight size={14} color="#c8d0dc" />
                  </div>
                  <div className="font-display font-800 text-[1.75rem] leading-none mb-1" style={{ color: '#0f1923', fontWeight: 800 }}>
                    {k.value}
                  </div>
                  <div className="text-xs font-semibold text-[#0f1923]">{k.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: k.sub.startsWith('↑') ? '#dc2626' : '#7a8697' }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* ── Map + AI Queue ── */}
            <div className="grid xl:grid-cols-[1fr_340px] gap-5">

              {/* Map */}
              <div className="bg-white rounded-xl border border-[#e4e8ef] p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-display font-700 text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>Live Civic Issue Map</h2>
                    <p className="text-xs text-[#7a8697]">Click any marker to view issue details</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#e4e8ef] text-[#4a5568]">
                      <Filter size={11} /> Filters
                    </button>
                    {['Issue Type','Priority','Ward'].map(f => (
                      <button key={f} className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-[#e4e8ef] text-[#4a5568]">
                        {f} <ChevronDown size={10} />
                      </button>
                    ))}
                  </div>
                </div>
                <CityMap height="320px" />
              </div>

              {/* AI Priority Queue */}
              <div className="bg-white rounded-xl border border-[#e4e8ef] p-5 flex flex-col" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-display font-700 text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>AI Priority Queue</h2>
                    <p className="text-xs text-[#7a8697]">Ranked by composite risk score</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
                    style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                    <Cpu size={10} /> AI-assisted
                  </span>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  {AI_QUEUE.map(item => (
                    <div key={item.rank} className="rounded-xl border p-4"
                      style={{ borderColor: item.c + '30', background: item.bg }}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-[#b0bcc8]">{item.rank}</span>
                          <div>
                            <div className="text-sm font-semibold" style={{ color: '#0f1923', fontFamily: 'Manrope,sans-serif' }}>{item.title}</div>
                            <div className="text-xs text-[#7a8697]">{item.location}</div>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold shrink-0"
                          style={{ background: item.c + '20', color: item.c }}>
                          {item.priority}
                        </span>
                      </div>

                      {/* Score bar */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.08)' }}>
                          <div className="h-1.5 rounded-full transition-all" style={{ width: `${item.score}%`, background: item.c }} />
                        </div>
                        <span className="text-xs font-bold shrink-0" style={{ color: item.c }}>{item.score}/100</span>
                      </div>

                      <p className="text-[11px] leading-relaxed" style={{ color: item.c, opacity: 0.8 }}>
                        "{item.reason}"
                      </p>

                      <button className="mt-3 w-full py-1.5 text-xs font-semibold text-white rounded-lg"
                        style={{ background: item.c }}>
                        View & Assign
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Worker Assignment + Recent Issues ── */}
            <div className="grid xl:grid-cols-[380px_1fr] gap-5">

              {/* Smart worker assignment */}
              <div className="bg-white rounded-xl border border-[#e4e8ef] p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="mb-4">
                  <h2 className="font-display font-700 text-sm mb-0.5" style={{ color: '#0f1923', fontWeight: 700 }}>Smart Worker Assignment</h2>
                  <div className="text-xs text-[#7a8697]">Issue: Pothole · MG Road · #CF-10482</div>
                </div>

                {/* Recommended */}
                <div className="rounded-xl border-2 p-4 mb-4" style={{ borderColor: '#1a3353', background: '#f8faff' }}>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Cpu size={12} color="#1a3353" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#1a3353' }}>
                      AI Recommendation
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: '#1a3353' }}>RK</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: '#0f1923', fontFamily: 'Manrope,sans-serif' }}>Rajesh Kumar</div>
                      <div className="text-xs text-[#7a8697]">Road Maintenance Team</div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                      style={{ background: '#f0fdf4', color: '#16a34a' }}>Available</span>
                  </div>

                  {/* Factors */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { label: 'Distance',    value: '1.2 km',  icon: MapPin },
                      { label: 'Skill Match', value: '98%',     icon: Zap },
                      { label: 'Active Tasks',value: '2',       icon: Wrench },
                      { label: 'Performance', value: '94%',     icon: TrendingUp },
                    ].map(f => (
                      <div key={f.label} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: '#eef2f8' }}>
                        <f.icon size={12} color="#4a6a8a" />
                        <div>
                          <div className="text-[10px] text-[#7a8697]">{f.label}</div>
                          <div className="text-xs font-semibold" style={{ color: '#0f1923' }}>{f.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setAssignModal(true)}
                    className="w-full py-2 text-sm font-semibold text-white rounded-lg"
                    style={{ background: '#1a3353' }}
                  >
                    Assign to Rajesh
                  </button>
                </div>

                {/* Alternatives */}
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[#7a8697] mb-2">Alternatives</div>
                {WORKERS.slice(1, 3).map((w, i) => (
                  <div key={w.name} className={`flex items-center gap-3 py-3 ${i === 0 ? 'border-b border-[#f0f2f5]' : ''}`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: avatarColors[i + 1] }}>
                      {w.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: '#0f1923' }}>{w.name}</div>
                      <div className="text-xs text-[#7a8697]">{w.distance} · {w.activeTasks} tasks · Perf {w.performance}%</div>
                    </div>
                    <button className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#e4e8ef] shrink-0"
                      style={{ color: '#1a3353' }}>Assign</button>
                  </div>
                ))}
              </div>

              {/* Recent issues table */}
              <div className="bg-white rounded-xl border border-[#e4e8ef] overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e8ef]">
                  <h2 className="font-display font-700 text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>Recent Issues</h2>
                  <button onClick={() => setPage('track')} className="text-xs font-medium" style={{ color: '#1a3353' }}>
                    View all →
                  </button>
                </div>
                <table className="w-full text-sm">
                  <thead style={{ background: '#f8f9fb' }}>
                    <tr>
                      {['Issue ID', 'Title', 'Location', 'Priority', 'Status', 'Time', ''].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#7a8697] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f6f9]">
                    {RECENT_ISSUES.map(iss => {
                      const sl = SL[iss.s]
                      return (
                        <tr key={iss.id} className="hover:bg-[#fafbfd] transition-colors">
                          <td className="px-5 py-3.5 text-xs font-mono font-semibold text-[#7a8697]">{iss.id}</td>
                          <td className="px-5 py-3.5">
                            <span className="text-sm font-medium" style={{ color: '#0f1923' }}>{iss.title}</span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[#7a8697]">{iss.loc}</td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold"
                              style={{ background: PB[iss.p], color: PC[iss.p] }}>
                              {iss.p.charAt(0).toUpperCase() + iss.p.slice(1)}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold"
                              style={{ background: sl.bg, color: sl.c }}>
                              {sl.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[#7a8697] whitespace-nowrap">{iss.time}</td>
                          <td className="px-5 py-3.5">
                            <button className="text-xs font-medium" style={{ color: '#1a3353' }}>Manage</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Analytics row ── */}
            <div className="grid lg:grid-cols-3 gap-5">

              {/* Area chart — resolution trend */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-[#e4e8ef] p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-display font-700 text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>Resolution Trend</h2>
                    <p className="text-xs text-[#7a8697]">Issues reported vs. resolved — last 7 days</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#7a8697]">
                      <div className="w-3 h-0.5 rounded" style={{ background: '#1a3353' }} /> Reported
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#7a8697]">
                      <div className="w-3 h-0.5 rounded" style={{ background: '#16a34a' }} /> Resolved
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={WEEKLY} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                    <defs>
                      <linearGradient id="gReported" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1a3353" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#1a3353" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#f0f2f6" strokeDasharray="4 4" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#7a8697' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#7a8697' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #e4e8ef', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} labelStyle={{ color: '#0f1923', fontWeight: 600 }} />
                    <Area type="monotone" dataKey="reported" stroke="#1a3353" strokeWidth={2} fill="url(#gReported)" name="Reported" />
                    <Area type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2} fill="url(#gResolved)" name="Resolved" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Donut — category */}
              <div className="bg-white rounded-xl border border-[#e4e8ef] p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <h2 className="font-display font-700 text-sm mb-4" style={{ color: '#0f1923', fontWeight: 700 }}>By Category</h2>
                <div className="flex flex-col items-center gap-3">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={CATEGORY} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                        {CATEGORY.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-full flex flex-col gap-1.5">
                    {CATEGORY.map(c => (
                      <div key={c.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: c.color }} />
                        <span className="text-xs text-[#4a5568] flex-1">{c.name}</span>
                        <span className="text-xs font-semibold" style={{ color: '#0f1923' }}>{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Field workers table ── */}
            <div className="bg-white rounded-xl border border-[#e4e8ef] overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e8ef]">
                <div>
                  <h2 className="font-display font-700 text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>Field Workers</h2>
                  <p className="text-xs text-[#7a8697]">5 workers active in your area</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#e4e8ef]" style={{ color: '#1a3353' }}>
                  Manage All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: '#f8f9fb' }}>
                    <tr>
                      {['Worker','Team','Location','Active Tasks','Availability','Performance',''].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#7a8697] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f6f9]">
                    {WORKERS.map((w, i) => (
                      <tr key={w.name} className="hover:bg-[#fafbfd] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                              style={{ background: avatarColors[i] }}>
                              {w.initials}
                            </div>
                            <span className="text-sm font-medium" style={{ color: '#0f1923' }}>{w.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-[#4a5568]">{w.team}</td>
                        <td className="px-5 py-4 text-xs text-[#7a8697]">{w.distance} away</td>
                        <td className="px-5 py-4 text-xs font-medium" style={{ color: '#0f1923' }}>{w.activeTasks} tasks</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold"
                            style={{ background: w.available ? '#f0fdf4' : '#f1f5f9', color: w.available ? '#16a34a' : '#64748b' }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: w.available ? '#16a34a' : '#94a3b8' }} />
                            {w.available ? 'Available' : 'Busy'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full" style={{ background: '#e4e8ef' }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${w.performance}%`, background: '#16a34a' }} />
                            </div>
                            <span className="text-xs font-semibold" style={{ color: '#16a34a' }}>{w.performance}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1.5">
                            <button className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#e4e8ef]" style={{ color: '#4a5568' }}>View</button>
                            <button className="px-2.5 py-1 text-xs font-semibold rounded-lg text-white" style={{ background: '#1a3353' }}>Assign</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Ward performance ── */}
            <div className="bg-white rounded-xl border border-[#e4e8ef] p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <h2 className="font-display font-700 text-sm mb-4" style={{ color: '#0f1923', fontWeight: 700 }}>Ward Performance</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={WARD_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -28 }} barGap={4}>
                  <CartesianGrid stroke="#f0f2f6" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="ward" tick={{ fontSize: 11, fill: '#7a8697' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#7a8697' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #e4e8ef' }} />
                  <Bar dataKey="res"  fill="#16a34a" radius={[5,5,0,0]} name="Resolved" maxBarSize={40} />
                  <Bar dataKey="open" fill="#fca5a5" radius={[5,5,0,0]} name="Open"     maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-[#7a8697]">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#16a34a' }} /> Resolved
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#7a8697]">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#fca5a5' }} /> Open
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Assign confirm modal ── */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,25,35,0.45)', backdropFilter: 'blur(2px)' }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            {!assigned ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-700 text-base" style={{ color: '#0f1923', fontWeight: 700 }}>Confirm Assignment</h3>
                  <button onClick={() => setAssignModal(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f0f4f8]">
                    <X size={15} color="#7a8697" />
                  </button>
                </div>
                <div className="p-3 rounded-xl mb-5 border border-[#e4e8ef]" style={{ background: '#f8f9fb' }}>
                  <div className="text-xs text-[#7a8697] mb-1">Assigning</div>
                  <div className="text-sm font-semibold" style={{ color: '#0f1923' }}>Rajesh Kumar → Pothole, MG Road</div>
                  <div className="text-xs text-[#7a8697] mt-0.5">Issue #CF-10482 · Urgent priority</div>
                </div>
                <p className="text-sm text-[#4a5568] mb-5">
                  Rajesh will receive a notification and task brief on their mobile device.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setAssignModal(false)}
                    className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-[#e4e8ef]" style={{ color: '#4a5568' }}>
                    Cancel
                  </button>
                  <button onClick={() => setAssigned(true)}
                    className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl"
                    style={{ background: '#1a3353' }}>
                    Confirm Assignment
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#f0fdf4' }}>
                  <CheckCircle2 size={28} color="#16a34a" />
                </div>
                <h3 className="font-display font-700 text-base mb-1.5" style={{ color: '#0f1923', fontWeight: 700 }}>Assigned!</h3>
                <p className="text-sm text-[#4a5568] mb-5">Rajesh Kumar has been notified and is en route.</p>
                <button onClick={() => { setAssignModal(false); setAssigned(false) }}
                  className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl"
                  style={{ background: '#1a3353' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
