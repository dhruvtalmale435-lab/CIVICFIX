import { z } from 'zod'

export const createComplaintSchema = z.object({
  title: z.string().min(5).max(150),
  description: z.string().min(10).max(1000),
  category: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  image_url: z.string().url().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium')
})

export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'assigned', 'in_progress', 'resolved', 'rejected']),
  message: z.string().min(1).max(500).optional(),
  image_url: z.string().url().optional()
})

export const assignComplaintSchema = z.object({
  volunteer_id: z.string().uuid(),
  assigned_by: z.string().uuid().optional()
})

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['pending', 'assigned', 'in_progress', 'resolved', 'rejected']).optional(),
  category: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional()
})

export const nearbySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive().max(50).default(5)
})

export const aiPredictSchema = z.object({
  complaint_id: z.string().uuid(),
  image_url: z.string().url().optional()
})

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
export type AssignComplaintInput = z.infer<typeof assignComplaintSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type NearbyInput = z.infer<typeof nearbySchema>
export type AIPredictInput = z.infer<typeof aiPredictSchema>
