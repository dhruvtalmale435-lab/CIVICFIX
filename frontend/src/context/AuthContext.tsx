import { createContext, useContext, useState, useEffect } from 'react'
import { api, supabase } from '../api/client'
import type { AuthUser, Role } from '../types'

interface AuthContextType {
  auth: AuthUser | null
  login: (user: AuthUser, token: string) => void
  logout: () => void
  signInWithDemo: (role: Role) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Demo credentials mapping with generated tokens (valid for development)
const DEMO_USERS: Record<Role, AuthUser & { token: string }> = {
  citizen: { 
    id: 'C001', 
    name: 'Meera Joshi', 
    role: 'citizen',
    email: 'citizen@civicfix.in',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaWxkcmN2ZW1lYWFobXp2YXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTE5NjMsImV4cCI6MjEwMjQ2Nzk2MywidXNlcl9tZXRhZGF0YSI6eyJyb2xlIjoiY2l0aXplbiJ9fQ.demo_citizen_token'
  },
  authority: { 
    id: 'A001', 
    name: 'Municipal Admin', 
    role: 'authority',
    email: 'admin@pmcpune.gov.in',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaWxkcmN2ZW1lYWFobXp2YXBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg5MTk2MywiZXhwIjoyMTAyNDY3OTYzLCJ1c2VyX21ldGFkYXRhIjp7InJvbGUiOiJhdXRob3JpdHkifX0.demo_authority_token'
  },
  worker: { 
    id: 'W001', 
    name: 'Rajesh Kumar', 
    role: 'worker',
    email: 'rajesh@civicfix.in',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaWxkcmN2ZW1lYWFobXp2YXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTE5NjMsImV4cCI6MjEwMjQ2Nzk2MywidXNlcl9tZXRhZGF0YSI6eyJyb2xlIjoid29ya2VyIn19.demo_worker_token'
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthUser | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('supabase_token')
    const savedUser = localStorage.getItem('civicfix_user')
    
    if (token && savedUser) {
      setAuth(JSON.parse(savedUser))
    }
  }, [])

  const login = (user: AuthUser, token: string) => {
    localStorage.setItem('supabase_token', token)
    localStorage.setItem('civicfix_user', JSON.stringify(user))
    setAuth(user)
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      // Ignore errors during logout
    }
    localStorage.removeItem('supabase_token')
    localStorage.removeItem('civicfix_user')
    setAuth(null)
  }

  const signInWithDemo = async (role: Role): Promise<{ success: boolean; error?: string }> => {
    const demoUser = DEMO_USERS[role]
    if (!demoUser) {
      return { success: false, error: 'Invalid role' }
    }

    // Use pre-generated demo token for development
    // In production, this would use actual Supabase auth
    login(demoUser, demoUser.token)
    return { success: true }
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, signInWithDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
