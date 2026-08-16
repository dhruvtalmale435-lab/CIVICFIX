import { NavLink } from 'react-router-dom'
import { MapPin, LogOut } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface SidebarProps {
  navItems: { id: string; label: string; icon: LucideIcon; badge?: number }[]
  basePath: string
  userName: string
  userRole: string
  onLogout: () => void
  accentColor?: string
}

export function Sidebar({ navItems, basePath, userName, userRole, onLogout, accentColor = '#1a3353' }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col bg-white border-r border-[#e4e8ef] shrink-0" style={{ width: 212 }}>
      <div className="px-4 py-4 border-b border-[#e4e8ef]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: accentColor }}>
            <MapPin size={13} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-[15px]" style={{ fontWeight: 800, color: '#1a3353' }}>
            CIVIC<span style={{ color: '#16a34a' }}>FIX</span>
          </span>
        </div>
        <div className="text-[10px] text-[#7a8697] mt-0.5 ml-9">{userRole}</div>
      </div>

      <div className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(item => (
          <NavLink key={item.id} to={`${basePath}/${item.id}`}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <item.icon size={15} />
            <span>{item.label}</span>
            {item.badge != null && item.badge > 0 && (
              <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </div>

      <div className="border-t border-[#e4e8ef] px-3 py-3">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1 rounded-xl" style={{ background: '#f8f9fb' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0" style={{ background: accentColor }}>
            {userName.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: '#0f1923' }}>{userName}</div>
            <div className="text-[10px] text-[#7a8697]">{userRole}</div>
          </div>
        </div>
        <button onClick={onLogout} className="sidebar-link w-full text-red-500">
          <LogOut size={15} color="#ef4444" /><span className="text-red-500">Logout</span>
        </button>
      </div>
    </aside>
  )
}
