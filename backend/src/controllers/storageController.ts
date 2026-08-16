import { Request, Response } from 'express'
import { uploadImage } from '../services/storageService.js'
import type { AuthRequest } from '../middleware/auth.js'

export const handleImageUpload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No image file provided' })
      return
    }

    const result = await uploadImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    )

    if (!result.success) {
      res.status(500).json({ success: false, error: result.error })
      return
    }

    res.json({
      success: true,
      data: {
        url: result.url,
        path: result.path
      }
    })
  } catch (error) {
    console.error('Upload controller error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    })
  }
}
