import { createClient } from '@supabase/supabase-js'
import type { Issue, IssueUpdate, IssueStatus, Priority } from '../types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Supabase client for auth and direct DB access
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function getAuthHeader(): HeadersInit | undefined {
  const token = localStorage.getItem('supabase_token')
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  return undefined
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }
  
  return data
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    ...getAuthHeader(),
    ...options.headers
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  return handleResponse<T>(response)
}

// Map backend complaint to frontend Issue
function mapComplaintToIssue(complaint: any): Issue {
  return {
    id: complaint.id,
    citizenId: complaint.citizen_id || 'unknown',
    citizenName: 'Citizen',
    type: complaint.category,
    description: complaint.description,
    location: `${complaint.latitude.toFixed(4)}, ${complaint.longitude.toFixed(4)}`,
    address: 'Location based on coordinates',
    ward: 'Unknown',
    priority: (complaint.priority?.toLowerCase() as Priority) || 'medium',
    status: mapBackendStatusToFrontend(complaint.status),
    submittedAt: new Date(complaint.created_at).toLocaleString('en-IN'),
    aiCategory: complaint.category,
    aiConfidence: 85,
    aiSeverity: complaint.priority === 'urgent' ? 'Critical' : complaint.priority === 'high' ? 'High' : 'Medium',
    cx: 350,
    cy: 200,
    updates: []
  }
}

function mapBackendStatusToFrontend(status: string): IssueStatus {
  const statusMap: Record<string, IssueStatus> = {
    'PENDING': 'open',
    'ASSIGNED': 'assigned',
    'IN_PROGRESS': 'in_progress',
    'RESOLVED': 'resolved',
    'REJECTED': 'rejected'
  }
  return statusMap[status] || 'open'
}

export const api = {
  // Health check
  health: () => request<{ success: boolean; service: string; status: string }>('/health'),

  // Auth helpers
  auth: {
    getSession: () => supabase.auth.getSession(),
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (data.session) {
        localStorage.setItem('supabase_token', data.session.access_token)
      }
      return { data, error }
    },
    signUp: async (email: string, password: string, name: string) => {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { name } }
      })
      return { data, error }
    },
    signOut: async () => {
      localStorage.removeItem('supabase_token')
      return supabase.auth.signOut()
    },
    getUser: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    }
  },

  // Complaints
  complaints: {
    list: async (params?: { page?: number; limit?: number; status?: string; category?: string; priority?: string }) => {
      const result = await request<{ success: boolean; data: any[]; pagination: unknown }>(
        `/complaints${params ? '?' + new URLSearchParams(params as Record<string, string>) : ''}`
      )
      return {
        ...result,
        data: result.data.map(mapComplaintToIssue)
      }
    },
    
    getById: async (id: string) => {
      const result = await request<{ success: boolean; data: any }>(`/complaints/${id}`)
      return {
        ...result,
        data: mapComplaintToIssue(result.data)
      }
    },
    
    create: async (data: {
      title: string
      description: string
      category: string
      latitude: number
      longitude: number
      image_url?: string
      priority?: 'low' | 'medium' | 'high' | 'urgent'
    }) => {
      const result = await request<{ success: boolean; data: any }>('/complaints', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      return {
        ...result,
        data: mapComplaintToIssue(result.data)
      }
    },
    
    updateStatus: async (id: string, data: {
      status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'rejected'
      message?: string
      image_url?: string
    }) => request<{ success: boolean; data: unknown }>(`/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    
    nearby: async (lat: number, lng: number, radius: number) => {
      const result = await request<{ success: boolean; data: any[] }>(
        `/complaints/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      )
      return {
        ...result,
        data: result.data.map(mapComplaintToIssue)
      }
    }
  },

  // Assignments
  assignments: {
    list: () => request<{ success: boolean; data: unknown[] }>('/assignments'),
    
    assign: (complaintId: string, volunteerId: string) =>
      request<{ success: boolean; data: unknown }>(`/complaints/${complaintId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ volunteer_id: volunteerId })
      })
  },

  // Dashboard
  dashboard: {
    stats: () => request<{ 
      success: boolean
      data: {
        total: number
        pending: number
        assigned: number
        in_progress: number
        resolved: number
        high_priority: number
      }
    }>('/dashboard/stats'),
    recent: async () => {
      const result = await request<{ success: boolean; data: any[] }>('/dashboard/recent')
      return {
        ...result,
        data: result.data.map(mapComplaintToIssue)
      }
    }
  },

  // AI
  ai: {
    predict: (complaintId: string, image_url?: string) =>
      request<{ success: boolean; data: unknown; mock?: boolean }>(`/ai/predict`, {
        method: 'POST',
        body: JSON.stringify({ complaint_id: complaintId, image_url })
      })
  },

  // Storage
  storage: {
    uploadImage: async (file: File): Promise<{ success: boolean; data: { url: string; path: string } }> => {
      const formData = new FormData()
      formData.append('image', file)
      
      const token = localStorage.getItem('supabase_token')
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      })
      
      return handleResponse(response)
    }
  }
}
