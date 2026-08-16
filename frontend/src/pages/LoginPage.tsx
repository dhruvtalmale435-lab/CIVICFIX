import { useState } from 'react'
import {
  MapPin, Building2, HardHat, ArrowRight, ArrowLeft, Eye, EyeOff,
  CheckCircle2, Shield, ChevronRight, Plus, X, Users, Phone, UserCog
} from 'lucide-react'
import type { Role, AuthUser, TeamMember } from '../types'

interface Props {
  onLogin: (user: AuthUser) => void
}

const ROLES: Array<{
  role: Role
  label: string
  subtitle: string
  icon: React.FC<{ size: number; color: string }>
  color: string
  bg: string
  border: string
  chip: string
  chipBg: string
  demo: { email: string; password: string; name: string; id: string }
  features: string[]
}> = [
  {
    role: 'citizen',
    label: 'Citizen',
    subtitle: 'Report and track civic issues in your area',
    icon: MapPin,
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#bfdbfe',
    chip: 'Public Portal',
    chipBg: '#dbeafe',
    demo: { email: 'citizen@civicfix.in', password: 'demo123', name: 'Meera Joshi', id: 'C001' },
    features: ['Submit issue reports', 'AI duplicate detection', 'Track all city issues', 'City progress reports'],
  },
  {
    role: 'authority',
    label: 'Municipal Authority',
    subtitle: 'Manage city issues, assign teams, monitor progress',
    icon: Building2,
    color: '#1a3353',
    bg: '#f0f4f8',
    border: '#c8d0dc',
    chip: 'Municipal Portal',
    chipBg: '#e2e8f0',
    demo: { email: 'admin@pmcpune.gov.in', password: 'admin123', name: 'Municipal Admin', id: 'A001' },
    features: ['View all issues & map', 'AI priority insights', 'Assign coordinators', 'Verify & close issues'],
  },
  {
    role: 'worker',
    label: 'Team Coordinator',
    subtitle: 'Lead your team — accept tasks, track location, submit proof',
    icon: HardHat,
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    chip: 'Field Portal',
    chipBg: '#dcfce7',
    demo: { email: 'rajesh@civicfix.in', password: 'worker123', name: 'Rajesh Kumar', id: 'W001' },
    features: ['Register your team', 'Accept or reject tasks', 'Live map navigation', 'Upload proof & send alerts'],
  },
]

const MEMBER_ROLES = ['Driver', 'Technician', 'Helper', 'Supervisor', 'Engineer', 'Operator']

// ── TopBar ────────────────────────────────────────────────────────────────────
function TopBar() {
  return (
    <div className="bg-white border-b border-[#e4e8ef]" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.05)' }}>
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#1a3353' }}>
            <MapPin size={13} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-[15px]" style={{ fontWeight: 800, color: '#1a3353' }}>
            CIVIC<span style={{ color: '#15803d' }}>FIX</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield size={13} color="#7a8697" />
          <span className="text-xs text-[#7a8697]">Secure Government Platform</span>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <div className="border-t border-[#e4e8ef] bg-white px-6 py-3 text-center">
      <p className="text-xs text-[#7a8697]">
        CIVICFIX · Pune Municipal Corporation · AI-Powered Civic Platform · © 2026
      </p>
    </div>
  )
}

// ── Step 1: Role picker ───────────────────────────────────────────────────────
function RolePicker({ onSelect }: { onSelect: (role: Role) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-14">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: '#f0f4f8' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-[#4a5568]">Pune Municipal Corporation</span>
          </div>
          <h1 className="font-display mb-2" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.4rem)', fontWeight: 800, color: '#0f1923', lineHeight: 1.15 }}>
            Welcome to CIVICFIX
          </h1>
          <p className="text-sm text-[#7a8697]">
            AI-Powered Urban Issue Detection, Prioritization &amp; Resolution
          </p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7a8697] text-center mb-5">Who are you?</p>
        <div className="grid md:grid-cols-3 gap-4">
          {ROLES.map(r => (
            <button key={r.role} onClick={() => onSelect(r.role)}
              className="group text-left rounded-2xl border-2 p-5 bg-white transition-all hover:shadow-lg"
              style={{ borderColor: '#e4e8ef' }}
              onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.borderColor = r.color; ;(e.currentTarget as HTMLElement).style.background = r.bg }}
              onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.borderColor = '#e4e8ef'; ;(e.currentTarget as HTMLElement).style.background = '#fff' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: r.bg }}>
                  <r.icon size={20} color={r.color} />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: r.chipBg, color: r.color }}>{r.chip}</span>
              </div>
              <div className="font-display text-[16px] mb-1" style={{ color: '#0f1923', fontWeight: 700 }}>{r.label}</div>
              <p className="text-xs text-[#7a8697] mb-4 leading-relaxed">{r.subtitle}</p>
              <div className="flex flex-col gap-1.5 mb-4">
                {r.features.map(f => (
                  <div key={f} className="flex items-center gap-1.5 text-[11px]" style={{ color: '#4a5568' }}>
                    <CheckCircle2 size={11} color={r.color} />{f}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold mt-1" style={{ color: r.color }}>
                Continue as {r.label} <ChevronRight size={13} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Step 2 (Coordinator only): Team setup ─────────────────────────────────────
function TeamSetup({ onNext, onBack }: { onNext: (members: TeamMember[]) => void; onBack: () => void }) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('Technician')
  const [error, setError] = useState('')

  const addMember = () => {
    if (!name.trim()) { setError('Please enter a name.'); return }
    if (!phone.trim() || phone.length < 10) { setError('Enter a valid phone number.'); return }
    setMembers(prev => [...prev, { name: name.trim(), phone: phone.trim(), role }])
    setName(''); setPhone(''); setError('')
  }

  const removeMember = (i: number) => setMembers(prev => prev.filter((_, idx) => idx !== i))

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-14">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-8 hover:opacity-70" style={{ color: '#7a8697' }}>
          <ArrowLeft size={15} /> Back to role selection
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#15803d' }}>
            <Users size={22} color="white" />
          </div>
          <div>
            <div className="font-display text-lg" style={{ fontWeight: 800, color: '#0f1923' }}>Register Your Team</div>
            <div className="text-xs text-[#7a8697]">Add team members before signing in</div>
          </div>
        </div>

        <p className="text-xs text-[#7a8697] mb-6 leading-relaxed">
          As a Team Coordinator, you must register your team members. They will be visible to the authority and tracked during field work.
        </p>

        {/* Add member form */}
        <div className="bg-white rounded-2xl border border-[#e4e8ef] p-5 mb-4">
          <div className="text-xs font-semibold text-[#0f1923] mb-3 flex items-center gap-1.5">
            <UserCog size={13} color="#15803d" /> Add Team Member
          </div>
          <div className="flex flex-col gap-3">
            <input
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              placeholder="Full name"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border-2 border-[#e4e8ef] outline-none"
              style={{ color: '#0f1923' }}
              onFocus={e => (e.target.style.borderColor = '#15803d')}
              onBlur={e => (e.target.style.borderColor = '#e4e8ef')}
              onKeyDown={e => e.key === 'Enter' && addMember()}
            />
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Phone size={13} color="#7a8697" className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError('') }}
                  placeholder="Phone number"
                  className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border-2 border-[#e4e8ef] outline-none"
                  style={{ color: '#0f1923' }}
                  onFocus={e => (e.target.style.borderColor = '#15803d')}
                  onBlur={e => (e.target.style.borderColor = '#e4e8ef')}
                  onKeyDown={e => e.key === 'Enter' && addMember()}
                />
              </div>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border-2 border-[#e4e8ef] outline-none bg-white"
                style={{ color: '#0f1923' }}>
                {MEMBER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {error && <div className="text-xs text-red-600">{error}</div>}
            <button onClick={addMember}
              className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white rounded-xl"
              style={{ background: '#15803d' }}>
              <Plus size={15} /> Add Member
            </button>
          </div>
        </div>

        {/* Member list */}
        {members.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#e4e8ef] p-5 mb-5">
            <div className="text-xs font-semibold text-[#0f1923] mb-3">{members.length} team member{members.length > 1 ? 's' : ''} registered</div>
            <div className="flex flex-col gap-2">
              {members.map((m, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: '#f8fdf9' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: '#15803d' }}>
                    {m.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: '#0f1923' }}>{m.name}</div>
                    <div className="text-[10px] text-[#7a8697]">{m.role} · {m.phone}</div>
                  </div>
                  <button onClick={() => removeMember(i)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50">
                    <X size={12} color="#7a8697" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => onNext(members)}
          className="w-full py-3 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2"
          style={{ background: '#15803d' }}>
          {members.length === 0 ? 'Skip for now' : `Continue with ${members.length} member${members.length > 1 ? 's' : ''}`} <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ── Step 3 (or 2 for non-coordinator): Login form ─────────────────────────────
function LoginForm({ role, teamMembers, onLogin, onBack }: {
  role: Role; teamMembers: TeamMember[]; onLogin: (user: AuthUser) => void; onBack: () => void
}) {
  const cfg = ROLES.find(r => r.role === role)!
  const [email, setEmail] = useState(cfg.demo.email)
  const [password, setPassword] = useState(cfg.demo.password)
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (email !== cfg.demo.email || password !== cfg.demo.password) {
      setError('Invalid credentials. Use the demo credentials shown.')
      return
    }
    setLoading(true)
    setTimeout(() => onLogin({ role, name: cfg.demo.name, id: cfg.demo.id, teamMembers }), 800)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-14">
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-8 hover:opacity-70" style={{ color: '#7a8697' }}>
          <ArrowLeft size={15} /> {role === 'worker' ? 'Back to team setup' : 'Back to role selection'}
        </button>

        <div className="flex items-center gap-3 mb-7">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: cfg.color }}>
            <cfg.icon size={22} color="white" />
          </div>
          <div>
            <div className="font-display text-lg" style={{ fontWeight: 800, color: '#0f1923' }}>{cfg.label} Login</div>
            <div className="text-xs text-[#7a8697]">{cfg.chip}</div>
          </div>
        </div>

        {/* Team summary for coordinator */}
        {role === 'worker' && teamMembers.length > 0 && (
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl mb-5" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
            <Users size={14} color="#15803d" />
            <div className="text-[11px]" style={{ color: '#15803d' }}>
              <span className="font-semibold">{teamMembers.length} team member{teamMembers.length > 1 ? 's' : ''} registered</span>
              {' · '}{teamMembers.map(m => m.name.split(' ')[0]).join(', ')}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl mb-6" style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
          <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ background: cfg.color }} />
          <div>
            <div className="text-[11px] font-semibold mb-0.5" style={{ color: cfg.color }}>Demo credentials pre-filled</div>
            <div className="text-[11px]" style={{ color: cfg.color, opacity: 0.8 }}>{cfg.demo.email} · {cfg.demo.password}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-5">
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#0f1923' }}>Email address</label>
            <input type="email" value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              className="w-full px-4 py-3 text-sm rounded-xl border-2 outline-none"
              style={{ color: '#0f1923', borderColor: '#e4e8ef' }}
              onFocus={e => (e.target.style.borderColor = cfg.color)}
              onBlur={e => (e.target.style.borderColor = '#e4e8ef')} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#0f1923' }}>Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 text-sm rounded-xl border-2 outline-none pr-11"
                style={{ color: '#0f1923', borderColor: '#e4e8ef' }}
                onFocus={e => (e.target.style.borderColor = cfg.color)}
                onBlur={e => (e.target.style.borderColor = '#e4e8ef')} />
              <button onClick={() => setShowPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#7a8697' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {error && <div className="px-3.5 py-2.5 rounded-xl mb-4 text-xs text-red-700" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>{error}</div>}

        <button onClick={handleLogin} disabled={loading}
          className="w-full py-3 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2"
          style={{ background: cfg.color, opacity: loading ? 0.75 : 1 }}>
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
            : <><ArrowRight size={15} /> Sign in as {cfg.label}</>}
        </button>
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
type Step = 'roles' | 'team-setup' | 'login'

export default function LoginPage({ onLogin }: Props) {
  const [step, setStep] = useState<Step>('roles')
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    if (role === 'worker') {
      setStep('team-setup')
    } else {
      setStep('login')
    }
  }

  const handleTeamNext = (members: TeamMember[]) => {
    setTeamMembers(members)
    setStep('login')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f7fa' }}>
      <TopBar />
      {step === 'roles' && <RolePicker onSelect={handleRoleSelect} />}
      {step === 'team-setup' && <TeamSetup onNext={handleTeamNext} onBack={() => setStep('roles')} />}
      {step === 'login' && selectedRole && (
        <LoginForm
          role={selectedRole}
          teamMembers={teamMembers}
          onLogin={onLogin}
          onBack={() => setStep(selectedRole === 'worker' ? 'team-setup' : 'roles')}
        />
      )}
      <Footer />
    </div>
  )
}
