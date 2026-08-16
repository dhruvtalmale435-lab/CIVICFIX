import { getSupabaseClient } from '../config/database.js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export interface Complaint {
  id: string
  citizen_id: string
  title: string
  description: string
  category: string
  status: string
  priority: string
  latitude: number
  longitude: number
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface ComplaintUpdate {
  id: string
  complaint_id: string
  user_id: string
  status: string
  message: string
  image_url: string | null
  created_at: string
}

export interface Assignment {
  id: string
  complaint_id: string
  volunteer_id: string
  assigned_by: string
  assigned_at: string
  completed_at: string | null
}

export interface AIPrediction {
  id: string
  complaint_id: string
  issue_type: string
  confidence: number
  model_version: string
  created_at: string
}

const supabase = getSupabaseClient()

export async function createComplaint(data: {
  citizen_id: string
  title: string
  description: string
  category: string
  latitude: number
  longitude: number
  image_url?: string
  priority: string
}): Promise<Complaint> {
  const { data: result, error } = await supabase
    .from('complaints')
    .insert({
      citizen_id: data.citizen_id,
      title: data.title,
      description: data.description,
      category: data.category,
      status: 'PENDING',
      priority: data.priority,
      latitude: data.latitude,
      longitude: data.longitude,
      image_url: data.image_url || null
    })
    .select()
    .single()

  if (error) throw error
  return result as Complaint
}

export async function getComplaints(filters: {
  page: number
  limit: number
  status?: string
  category?: string
  priority?: string
}): Promise<{ complaints: Complaint[]; total: number }> {
  const { page, limit, status, category, priority } = filters
  const offset = (page - 1) * limit

  let query = supabase.from('complaints').select('*', { count: 'exact' })

  if (status) query = query.eq('status', status)
  if (category) query = query.eq('category', category)
  if (priority) query = query.eq('priority', priority)

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { complaints: data as Complaint[], total: count || 0 }
}

export async function getComplaintById(id: string): Promise<Complaint | null> {
  const { data, error } = await supabase
    .from('complaints')
    .select()
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data as Complaint) || null
}

export async function updateComplaintStatus(
  id: string,
  status: string
): Promise<Complaint | null> {
  const { data, error } = await supabase
    .from('complaints')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Complaint
}

export async function createComplaintUpdate(data: {
  complaint_id: string
  user_id: string
  status: string
  message: string
  image_url?: string
}): Promise<ComplaintUpdate> {
  const { data: result, error } = await supabase
    .from('complaint_updates')
    .insert({
      complaint_id: data.complaint_id,
      user_id: data.user_id,
      status: data.status,
      message: data.message,
      image_url: data.image_url || null
    })
    .select()
    .single()

  if (error) throw error
  return result as ComplaintUpdate
}

export async function getComplaintUpdates(complaintId: string): Promise<ComplaintUpdate[]> {
  const { data, error } = await supabase
    .from('complaint_updates')
    .select()
    .eq('complaint_id', complaintId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as ComplaintUpdate[]
}

export async function createAssignment(data: {
  complaint_id: string
  volunteer_id: string
  assigned_by: string
}): Promise<Assignment> {
  const { data: result, error } = await supabase
    .from('assignments')
    .insert({
      complaint_id: data.complaint_id,
      volunteer_id: data.volunteer_id,
      assigned_by: data.assigned_by,
      assigned_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return result as Assignment
}

export async function getAssignments(userId: string, role: string): Promise<Assignment[]> {
  let query = supabase.from('assignments').select('*')

  if (role === 'volunteer') {
    query = query.eq('volunteer_id', userId)
  } else if (role === 'admin') {
    query = query.eq('assigned_by', userId)
  }

  const { data, error } = await query.order('assigned_at', { ascending: false })
  if (error) throw error
  return data as Assignment[]
}

export async function getDashboardStats(): Promise<{
  total: number
  pending: number
  assigned: number
  in_progress: number
  resolved: number
  high_priority: number
}> {
  const [total, pending, assigned, inProgress, resolved, highPriority] = await Promise.all([
    supabase.from('complaints').select('id', { count: 'exact' }),
    supabase.from('complaints').select('id', { count: 'exact' }).eq('status', 'PENDING'),
    supabase.from('complaints').select('id', { count: 'exact' }).eq('status', 'ASSIGNED'),
    supabase.from('complaints').select('id', { count: 'exact' }).eq('status', 'IN_PROGRESS'),
    supabase.from('complaints').select('id', { count: 'exact' }).eq('status', 'RESOLVED'),
    supabase.from('complaints').select('id', { count: 'exact' }).in('priority', ['HIGH', 'URGENT'])
  ])

  return {
    total: total.count || 0,
    pending: pending.count || 0,
    assigned: assigned.count || 0,
    in_progress: inProgress.count || 0,
    resolved: resolved.count || 0,
    high_priority: highPriority.count || 0
  }
}

export async function getRecentComplaints(limit = 5): Promise<Complaint[]> {
  const { data, error } = await supabase
    .from('complaints')
    .select()
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Complaint[]
}

export async function getNearbyComplaints(lat: number, lng: number, radiusKm: number): Promise<Complaint[]> {
  // Simple Haversine distance calculation for MVP
  // PostGIS would be more accurate but this works for the MVP
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .gte('latitude', lat - (radiusKm / 111))
    .lte('latitude', lat + (radiusKm / 111))
    .gte('longitude', lng - (radiusKm / (111 * Math.cos((lat * Math.PI) / 180))))
    .lte('longitude', lng + (radiusKm / (111 * Math.cos((lat * Math.PI) / 180))))

  if (error) throw error

  // Filter by actual distance in JS for MVP
  const results = (data as Complaint[]).filter(c => {
    const dLat = c.latitude - lat
    const dLng = c.longitude - lng
    const a = Math.sin(dLat * Math.PI / 360) ** 2 +
              Math.cos(lat * Math.PI / 180) * Math.cos(c.latitude * Math.PI / 180) *
              Math.sin(dLng * Math.PI / 360) ** 2
    const distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 6371
    return distance <= radiusKm
  })

  return results
}

export async function createAIPrediction(data: {
  complaint_id: string
  issue_type: string
  confidence: number
  model_version: string
}): Promise<AIPrediction> {
  const { data: result, error } = await supabase
    .from('ai_predictions')
    .insert({
      complaint_id: data.complaint_id,
      issue_type: data.issue_type,
      confidence: data.confidence,
      model_version: data.model_version
    })
    .select()
    .single()

  if (error) throw error
  return result as AIPrediction
}

export async function getAIPredictionByComplaintId(complaintId: string): Promise<AIPrediction | null> {
  const { data, error } = await supabase
    .from('ai_predictions')
    .select()
    .eq('complaint_id', complaintId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data as AIPrediction) || null
}
