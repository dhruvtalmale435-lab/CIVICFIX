import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Building2, HardHat, ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle2, Shield, ChevronRight, Plus, X, Users, Phone, UserCog } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { Role, AuthUser, TeamMember } from '../../types'

const ROLES = [
  {
    role: 'citizen' as Role, label: 'Citizen', subtitle: 'Report and track civic issues in your area',
    icon: MapPin, color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', chip: 'Public Portal', chipBg: '#dbeafe',
    demo: { email: 'citizen@civicfix.in', password: 'demo123', name: 'Meera Joshi', id: 'C001' },
    features: ['Submit issue reports', 'AI duplicate detection', 'Track all city issues', 'City progress reports'],
  },
  {
    role: 'authority' as Role, label: 'Municipal Authority', subtitle: 'Manage city issues, assign teams, monitor progress',
    icon: Building2, color: '#1a3353', bg: '#f0f4f8', border: '#c8d0dc', chip: 'Municipal Portal', chipBg: '#e2e8f0',
    demo: { email: 'admin@pmcpune.gov.in', password: 'admin123', name: 'Municipal Admin', id: 'A001' },
    features: ['View all issues & map', 'AI priority insights', 'Assign coordinators', 'Verify & close issues'],
  },
  {
    role: 'worker' as Role, label: 'Team Coordinator', subtitle: 'Accept tasks, track location, submit proof',
    icon: HardHat, color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', chip: 'Field Portal', chipBg: '#dcfce7',
    demo: { email: 'rajesh@civicfix.in', password: 'worker123', name: 'Rajesh Kumar', id: 'W001' },
    features: ['Register your team', 'Accept or reject tasks', 'Live map navigation', 'Upload proof & send alerts'],
  },
]

const MEMBER_ROLES = ['Driver', 'Technician', 'Helper', 'Supervisor', 'Engineer', 'Operator']

type Step = 'roles' | 'team' | 'login'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('roles')
  const [selectedRole, setSelectedRole] = useState<typeof ROLES[0] | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [memberName, setMemberName] = useState('')
  const [memberPhone, setMemberPhone] = useState('')
  const [memberRole, setMemberRole] = useState('Technician')

  const selectRole = (r: typeof ROLES[0]) => {
    setSelectedRole(r)
    setEmail(r.demo.email)
    setPassword(r.demo.password)
    setError('')
    setStep(r.role === 'worker' ? 'team' : 'login')
  }

  const addMember = () => {
    if (!memberName.trim() || memberPhone.length < 10) return
    setTeamMembers(p => [...p, { name: memberName.trim(), phone: memberPhone.trim(), role: memberRole }])
    setMemberName(''); setMemberPhone('')
  }

  const handleLogin = async () => {
    if (!selectedRole) return
    if (email !== selectedRole.demo.email || password !== selectedRole.demo.password) {
      setError('Invalid credentials. Use the demo credentials shown.'); return
    }
    setLoading(true)
    const result = await signInWithDemo(selectedRole.role)
    setLoading(false)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f7fa' }}>
      <div className="bg-white border-b border-[#e4e8ef]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#1a3353' }}>
              <MapPin size={13} color="white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px]" style={{ fontWeight: 800, color: '#1a3353' }}>CIVIC<span style={{ color: '#16a34a' }}>FIX</span></span>
          </div>
          <div className="flex items-center gap-1.5"><Shield size={13} color="#7a8697" /><span className="text-xs text-[#7a8697]">Secure Government Platform</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-14">
        {step === 'roles' && (
          <div className="w-full max-w-4xl">
            <div className="text-center mb-10">
              <h1 className="font-display mb-2" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.4rem)', fontWeight: 800, color: '#0f1923' }}>Welcome to CIVICFIX</h1>
              <p className="text-sm text-[#7a8697]">AI-Powered Urban Issue Detection, Prioritization & Resolution</p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7a8697] text-center mb-5">Who are you?</p>
            <div className="grid md:grid-cols-3 gap-4">
              {ROLES.map(r => (
                <button key={r.role} onClick={() => selectRole(r)}
                  className="group text-left rounded-2xl border-2 p-5 bg-white transition-all hover:shadow-lg"
                  style={{ borderColor: '#e4e8ef' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = r.color; (e.currentTarget as HTMLElement).style.background = r.bg }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e4e8ef'; (e.currentTarget as HTMLElement).style.background = '#fff' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: r.bg }}><r.icon size={20} color={r.color} /></div>
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
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: r.color }}>Continue as {r.label} <ChevronRight size={13} /></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'team' && selectedRole && (
          <div className="w-full max-w-md">
            <button onClick={() => setStep('roles')} className="flex items-center gap-1.5 text-sm font-medium mb-8 hover:opacity-70" style={{ color: '#7a8697' }}>
              <ArrowLeft size={15} /> Back
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#15803d' }}><Users size={22} color="white" /></div>
              <div>
                <div className="font-display text-lg" style={{ fontWeight: 800, color: '#0f1923' }}>Register Your Team</div>
                <div className="text-xs text-[#7a8697]">Add team members before signing in</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#e4e8ef] p-5 mb-4">
              <div className="flex flex-col gap-3">
                <input value={memberName} onChange={e => setMemberName(e.target.value)} placeholder="Full name" className="w-full px-3.5 py-2.5 text-sm rounded-xl border-2 border-[#e4e8ef] outline-none" style={{ color: '#0f1923' }} />
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Phone size={13} color="#7a8697" className="absolute left-3 top-1/2 -translate-y-1/2" />
                    <input value={memberPhone} onChange={e => setMemberPhone(e.target.value)} placeholder="Phone" className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border-2 border-[#e4e8ef] outline-none" style={{ color: '#0f1923' }} />
                  </div>
                  <select value={memberRole} onChange={e => setMemberRole(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-xl border-2 border-[#e4e8ef] outline-none bg-white" style={{ color: '#0f1923' }}>
                    {MEMBER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <button onClick={addMember} className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: '#15803d' }}>
                  <Plus size={15} /> Add Member
                </button>
              </div>
            </div>
            {teamMembers.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e4e8ef] p-5 mb-5">
                <div className="text-xs font-semibold text-[#0f1923] mb-3">{teamMembers.length} member{teamMembers.length > 1 ? 's' : ''} registered</div>
                <div className="flex flex-col gap-2">
                  {teamMembers.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: '#f8fdf9' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: '#15803d' }}>
                        {m.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: '#0f1923' }}>{m.name}</div>
                        <div className="text-[10px] text-[#7a8697]">{m.role} · {m.phone}</div>
                      </div>
                      <button onClick={() => setTeamMembers(p => p.filter((_, idx) => idx !== i))} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50">
                        <X size={12} color="#7a8697" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setStep('login')} className="w-full py-3 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2" style={{ background: '#15803d' }}>
              {teamMembers.length === 0 ? 'Skip for now' : `Continue with ${teamMembers.length} member${teamMembers.length > 1 ? 's' : ''}`} <ArrowRight size={15} />
            </button>
          </div>
        )}

        {step === 'login' && selectedRole && (
          <div className="w-full max-w-sm">
            <button onClick={() => setStep(selectedRole.role === 'worker' ? 'team' : 'roles')} className="flex items-center gap-1.5 text-sm font-medium mb-8 hover:opacity-70" style={{ color: '#7a8697' }}>
              <ArrowLeft size={15} /> Back
            </button>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: selectedRole.color }}><selectedRole.icon size={22} color="white" /></div>
              <div>
                <div className="font-display text-lg" style={{ fontWeight: 800, color: '#0f1923' }}>{selectedRole.label} Login</div>
                <div className="text-xs text-[#7a8697]">{selectedRole.chip}</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl mb-6" style={{ background: selectedRole.bg, border: `1.5px solid ${selectedRole.border}` }}>
              <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ background: selectedRole.color }} />
              <div>
                <div className="text-[11px] font-semibold mb-0.5" style={{ color: selectedRole.color }}>Demo credentials pre-filled</div>
                <div className="text-[11px]" style={{ color: selectedRole.color, opacity: 0.8 }}>{selectedRole.demo.email} · {selectedRole.demo.password}</div>
              </div>
            </div>
            <div className="flex flex-col gap-4 mb-5">
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#0f1923' }}>Email address</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
                  className="w-full px-4 py-3 text-sm rounded-xl border-2 outline-none" style={{ color: '#0f1923', borderColor: '#e4e8ef' }} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#0f1923' }}>Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-3 text-sm rounded-xl border-2 outline-none pr-11" style={{ color: '#0f1923', borderColor: '#e4e8ef' }} />
                  <button onClick={() => setShowPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#7a8697' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            {error && <div className="px-3.5 py-2.5 rounded-xl mb-4 text-xs text-red-700" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>{error}</div>}
            <button onClick={handleLogin} disabled={loading}
              className="w-full py-3 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-75"
              style={{ background: selectedRole.color }}>
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</> : <><ArrowRight size={15} /> Sign in as {selectedRole.label}</>}
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-[#e4e8ef] bg-white px-6 py-3 text-center">
        <p className="text-xs text-[#7a8697]">CIVICFIX · Pune Municipal Corporation · AI-Powered Civic Platform · © 2026</p>
      </div>
    </div>
  )
}
