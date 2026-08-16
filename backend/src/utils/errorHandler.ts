import { Request, Response } from 'express'
import { z } from 'zod'

export function handleAsyncError(
  fn: (req: Request, res: Response) => Promise<void>
) {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res)
    } catch (error) {
      console.error('Controller error:', error)

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        })
        return
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error'
      })
    }
  }
}
