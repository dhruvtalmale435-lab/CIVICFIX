import { createContext, useContext, useState } from 'react'
import type { AuthUser } from '../types'

interface AuthContextType {
  auth: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthUser | null>(null)
  return (
    <AuthContext.Provider value={{ auth, login: setAuth, logout: () => setAuth(null) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
