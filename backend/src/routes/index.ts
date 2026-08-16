import { Router } from 'express'
import * as complaintController from '../controllers/complaintController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import multer from 'multer'
import { handleImageUpload } from '../controllers/storageController.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

// Public endpoints
router.get('/health', complaintController.getHealth)

// Protected endpoints
router.post('/complaints', authenticate, complaintController.createComplaint)
router.get('/complaints', authenticate, complaintController.getComplaints)
router.get('/complaints/nearby', complaintController.getNearbyComplaints)
router.get('/complaints/:id', authenticate, complaintController.getComplaintById)
router.patch('/complaints/:id/status', authenticate, authorize('admin', 'volunteer'), complaintController.updateComplaintStatus)
router.post('/complaints/:id/assign', authenticate, authorize('admin'), complaintController.assignComplaint)

// Image upload
router.post('/upload/image', authenticate, upload.single('image'), handleImageUpload)

// Assignments
router.get('/assignments', authenticate, complaintController.getAssignments)

// Dashboard
router.get('/dashboard/stats', authenticate, authorize('admin'), complaintController.getDashboardStats)
router.get('/dashboard/recent', authenticate, complaintController.getRecentComplaints)

// AI
router.post('/ai/predict', authenticate, complaintController.predictAI)

export default router
