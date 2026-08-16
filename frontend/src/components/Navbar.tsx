import { MapPin, Search, Bell, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  currentPage: string
  setPage: (page: string) => void
}

const NAV_ITEMS = [
  { id: 'home',      label: 'Home' },
  { id: 'report',    label: 'Report Issue' },
  { id: 'track',     label: 'Track Issue' },
  { id: 'community', label: 'Community' },
  { id: 'about',     label: 'About' },
]

export default function Navbar({ currentPage, setPage }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e8ecf2]"
      style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <button onClick={() => setPage('home')} className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#1a3353' }}>
            <MapPin size={13} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-display tracking-tight text-[15px]"
            style={{ fontWeight: 800, color: '#1a3353' }}>
            CIVIC<span style={{ color: '#16a34a' }}>FIX</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className="relative px-3 py-1.5 text-[13.5px] font-medium rounded-md transition-colors"
              style={{
                color: currentPage === item.id ? '#1a3353' : '#5a6a7e',
                fontWeight: currentPage === item.id ? 600 : 500,
                background: currentPage === item.id ? '#f0f4f8' : 'transparent',
              }}
            >
              {item.label}
              {currentPage === item.id && (
                <div className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full" style={{ background: '#1a3353' }} />
              )}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7a8697] hover:bg-[#f0f4f8] hover:text-[#1a3353] transition-colors">
            <Search size={15} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7a8697] hover:bg-[#f0f4f8] transition-colors relative">
            <Bell size={15} />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>
          <div className="w-px h-5 bg-[#e4e8ef] mx-1" />
          <button
            className="px-3 py-1.5 text-[13px] font-medium rounded-lg text-[#4a5568] hover:bg-[#f0f4f8] hover:text-[#1a3353] transition-colors"
            onClick={() => setPage('admin')}
          >
            Admin
          </button>
          <button
            onClick={() => setPage('report')}
            className="ml-1 px-4 py-1.5 text-[13px] font-semibold text-white rounded-lg transition-opacity hover:opacity-90"
            style={{ background: '#1a3353' }}
          >
            Report an Issue
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[#4a5568]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#e8ecf2] bg-white px-4 py-3">
          <div className="flex flex-col gap-0.5 mb-3">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMobileOpen(false) }}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: currentPage === item.id ? '#f0f4f8' : 'transparent',
                  color: currentPage === item.id ? '#1a3353' : '#5a6a7e',
                  fontWeight: currentPage === item.id ? 600 : 500,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-3 border-t border-[#e8ecf2]">
            <button
              onClick={() => { setPage('admin'); setMobileOpen(false) }}
              className="flex-1 py-2 text-sm font-medium rounded-xl border border-[#e4e8ef]"
              style={{ color: '#1a3353' }}
            >
              Admin
            </button>
            <button
              onClick={() => { setPage('report'); setMobileOpen(false) }}
              className="flex-1 py-2 text-sm font-semibold text-white rounded-xl"
              style={{ background: '#1a3353' }}
            >
              Report Issue
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
