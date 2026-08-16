import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MapPin, Search, Bell, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',          label: 'Home' },
  { to: '/report',    label: 'Report Issue' },
  { to: '/track',     label: 'Track Issue' },
  { to: '/community', label: 'Community' },
  { to: '/about',     label: 'About' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e8ecf2]" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#1a3353' }}>
            <MapPin size={13} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-display tracking-tight text-[15px]" style={{ fontWeight: 800, color: '#1a3353' }}>
            CIVIC<span style={{ color: '#16a34a' }}>FIX</span>
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}
              className={({ isActive }) =>
                `relative px-3 py-1.5 text-[13.5px] font-medium rounded-md transition-colors ${isActive ? 'text-[#1a3353] font-semibold bg-[#f0f4f8]' : 'text-[#5a6a7e] hover:text-[#1a3353]'}`
              }>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7a8697] hover:bg-[#f0f4f8]"><Search size={15} /></button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7a8697] hover:bg-[#f0f4f8] relative">
            <Bell size={15} />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>
          <div className="w-px h-5 bg-[#e4e8ef] mx-1" />
          <NavLink to="/login" className="px-3 py-1.5 text-[13px] font-medium rounded-lg text-[#4a5568] hover:bg-[#f0f4f8]">Login</NavLink>
          <NavLink to="/report" className="ml-1 px-4 py-1.5 text-[13px] font-semibold text-white rounded-lg hover:opacity-90" style={{ background: '#1a3353' }}>
            Report an Issue
          </NavLink>
        </div>

        <button className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[#4a5568]" onClick={() => setOpen(!open)}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#e8ecf2] bg-white px-4 py-3">
          <div className="flex flex-col gap-0.5 mb-3">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-left px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-[#f0f4f8] text-[#1a3353] font-semibold' : 'text-[#5a6a7e]'}`
                }>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="flex gap-2 pt-3 border-t border-[#e8ecf2]">
            <NavLink to="/login" onClick={() => setOpen(false)} className="flex-1 py-2 text-sm font-medium rounded-xl border border-[#e4e8ef] text-center" style={{ color: '#1a3353' }}>Login</NavLink>
            <NavLink to="/report" onClick={() => setOpen(false)} className="flex-1 py-2 text-sm font-semibold text-white rounded-xl text-center" style={{ background: '#1a3353' }}>Report Issue</NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
