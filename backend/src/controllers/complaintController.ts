import { Request, Response } from 'express'
import * as complaintService from '../services/complaintService.js'
import { handleAsyncError } from '../utils/errorHandler.js'
import { createComplaintSchema, paginationSchema, updateStatusSchema, assignComplaintSchema, nearbySchema, aiPredictSchema } from '../utils/validators.js'
import type { AuthRequest } from '../middleware/auth.js'

export const getHealth = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    service: 'civicfix-api',
    status: 'healthy'
  })
}

export const createComplaint = handleAsyncError(async (req: AuthRequest, res: Response) => {
  const data = createComplaintSchema.parse(req.body)

  const complaint = await complaintService.createComplaint({
    citizen_id: req.user?.id || 'anonymous',
    ...data
  })

  res.status(201).json({ success: true, data: complaint })
})

export const getComplaints = handleAsyncError(async (req: AuthRequest, res: Response) => {
  const filters = paginationSchema.parse(req.query)
  const result = await complaintService.getComplaints(filters)

  res.json({
    success: true,
    data: result.complaints,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / filters.limit)
    }
  })
})

export const getComplaintById = handleAsyncError(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id)

  const complaint = await complaintService.getComplaintById(id)
  if (!complaint) {
    res.status(404).json({ success: false, error: 'Complaint not found' })
    return
  }

  const updates = await complaintService.getComplaintUpdates(id)

  res.json({
    success: true,
    data: { ...complaint, updates }
  })
})

export const updateComplaintStatus = handleAsyncError(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id)
  const { status, message, image_url } = updateStatusSchema.parse(req.body)

  const complaint = await complaintService.updateComplaintStatus(id, status)
  if (!complaint) {
    res.status(404).json({ success: false, error: 'Complaint not found' })
    return
  }

  if (message) {
    await complaintService.createComplaintUpdate({
      complaint_id: id,
      user_id: req.user?.id || 'system',
      status,
      message,
      image_url
    })
  }

  res.json({ success: true, data: complaint })
})

export const assignComplaint = handleAsyncError(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id)
  const { volunteer_id } = assignComplaintSchema.parse(req.body)

  // First update the complaint status
  await complaintService.updateComplaintStatus(id, 'ASSIGNED')

  const assignment = await complaintService.createAssignment({
    complaint_id: id,
    volunteer_id,
    assigned_by: req.user?.id || 'system'
  })

  // Create update record
  await complaintService.createComplaintUpdate({
    complaint_id: id,
    user_id: req.user?.id || 'system',
    status: 'ASSIGNED',
    message: `Assigned to volunteer ${volunteer_id}`
  })

  res.status(201).json({ success: true, data: assignment })
})

export const getAssignments = handleAsyncError(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' })
    return
  }

  const assignments = await complaintService.getAssignments(req.user.id, req.user.role)
  res.json({ success: true, data: assignments })
})

export const getDashboardStats = handleAsyncError(async (_req: Request, res: Response) => {
  const stats = await complaintService.getDashboardStats()
  res.json({ success: true, data: stats })
})

export const getRecentComplaints = handleAsyncError(async (_req: Request, res: Response) => {
  const complaints = await complaintService.getRecentComplaints(5)
  res.json({ success: true, data: complaints })
})

export const getNearbyComplaints = handleAsyncError(async (req: Request, res: Response) => {
  const { lat, lng, radius } = nearbySchema.parse(req.query)
  const complaints = await complaintService.getNearbyComplaints(lat, lng, radius)
  res.json({ success: true, data: complaints })
})

export const predictAI = handleAsyncError(async (req: AuthRequest, res: Response) => {
  const { complaint_id, image_url } = aiPredictSchema.parse(req.body)

  // Mock AI prediction - replace with actual YOLOv8 integration later
  const mockPrediction = {
    issue_type: 'Pothole',
    confidence: 0.94,
    model_version: 'mock-v1.0'
  }

  const prediction = await complaintService.createAIPrediction({
    complaint_id,
    ...mockPrediction
  })

  res.json({
    success: true,
    data: prediction,
    mock: true,
    note: 'This is a mock AI prediction. Integrate YOLOv8 for production.'
  })
})
