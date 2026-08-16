import { Shield, Zap, Users, MapPin, ChevronRight } from 'lucide-react'

interface AboutProps {
  setPage: (page: string) => void
}

const values = [
  {
    icon: Shield,
    title: 'Transparent',
    description: 'Every issue is tracked publicly. Citizens see exactly what happens to their report.',
  },
  {
    icon: Zap,
    title: 'AI-Assisted',
    description: 'Machine learning prioritizes issues by urgency, not by who reported them first.',
  },
  {
    icon: Users,
    title: 'Community-First',
    description: 'Built for residents, field workers, and administrators equally.',
  },
  {
    icon: MapPin,
    title: 'Hyperlocal',
    description: 'Every issue is geo-tagged and routed to the team responsible for that ward.',
  },
]

const team = [
  { name: 'Arjun Mehta', role: 'Co-founder & CEO', initials: 'AM', bg: '#1a3353' },
  { name: 'Priya Nair', role: 'Co-founder & CTO', initials: 'PN', bg: '#15803d' },
  { name: 'Vikram Singh', role: 'Head of Product', initials: 'VS', bg: '#d97706' },
  { name: 'Ananya Rao', role: 'Head of Design', initials: 'AR', bg: '#1d4ed8' },
]

export default function About({ setPage }: AboutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Mission */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
          style={{ background: '#f0f4f8', color: '#1a3353' }}>
          Our Mission
        </div>
        <h1 className="font-display text-3xl font-800 mb-4" style={{ color: '#0f1923', fontWeight: 800 }}>
          Making civic infrastructure work for everyone
        </h1>
        <p className="text-base text-[#4a5568] max-w-xl mx-auto leading-relaxed">
          CIVICFIX was built by a team frustrated with slow government response times, ignored complaint emails, and broken systems. We believe technology can close the gap between citizens and the services they deserve.
        </p>
      </div>

      {/* Values */}
      <div className="grid sm:grid-cols-2 gap-5 mb-14">
        {values.map(v => (
          <div key={v.title} className="bg-white rounded-xl border border-[#e4e8ef] p-6">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: '#f0f4f8' }}>
              <v.icon size={18} color="#1a3353" />
            </div>
            <h3 className="font-display font-700 text-base mb-2" style={{ color: '#0f1923', fontWeight: 700 }}>
              {v.title}
            </h3>
            <p className="text-sm text-[#4a5568] leading-relaxed">{v.description}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="mb-12">
        <h2 className="font-display font-700 text-xl mb-6" style={{ color: '#0f1923', fontWeight: 700 }}>
          The Team
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {team.map(m => (
            <div key={m.name} className="bg-white rounded-xl border border-[#e4e8ef] p-5 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-3"
                style={{ background: m.bg }}
              >
                {m.initials}
              </div>
              <div className="text-sm font-semibold" style={{ color: '#0f1923' }}>{m.name}</div>
              <div className="text-xs text-[#7a8697] mt-0.5">{m.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-8 text-center" style={{ background: '#1a3353' }}>
        <h2 className="font-display font-700 text-xl text-white mb-2" style={{ fontWeight: 700 }}>
          Ready to fix your city?
        </h2>
        <p className="text-sm mb-5" style={{ color: '#9fb5d0' }}>
          Join thousands of citizens already making their neighborhoods better.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setPage('report')}
            className="px-5 py-2.5 text-sm font-semibold text-[#1a3353] bg-white rounded-xl"
          >
            Report an Issue
          </button>
          <button
            onClick={() => setPage('admin')}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl border"
            style={{ borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Admin Demo <ChevronRight size={14} className="inline" />
          </button>
        </div>
      </div>
    </div>
  )
}
