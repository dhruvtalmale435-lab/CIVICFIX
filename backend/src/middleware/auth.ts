import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Missing or invalid authorization header' })
    return
  }

  const token = authHeader.substring(7)

  try {
    // Check for demo tokens first (development only)
    if (token.includes('demo_')) {
      const roleMap: Record<string, string> = {
        'demo_citizen_token': 'citizen',
        'demo_authority_token': 'authority',
        'demo_worker_token': 'worker'
      }
      
      let foundRole = 'citizen'
      for (const [key, role] of Object.entries(roleMap)) {
        if (token.includes(key)) {
          foundRole = role
          break
        }
      }
      
      req.user = {
        id: foundRole === 'authority' ? 'A001' : foundRole === 'worker' ? 'W001' : 'C001',
        email: foundRole === 'authority' ? 'admin@pmcpune.gov.in' : foundRole === 'worker' ? 'rajesh@civicfix.in' : 'citizen@civicfix.in',
        role: foundRole
      }
      next()
      return
    }

    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
    if (!supabaseKey) {
      throw new Error('Supabase key not configured')
    }

    const decoded = jwt.verify(token, supabaseKey) as {
      sub: string
      email?: string
      user_metadata?: { role?: string }
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email || '',
      role: decoded.user_metadata?.role || 'citizen'
    }

    next()
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }
}

export function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' })
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: 'Insufficient permissions' })
      return
    }

    next()
  }
}
