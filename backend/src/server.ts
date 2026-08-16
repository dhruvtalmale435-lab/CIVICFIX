import { app, PORT } from './app.js'

const server = app.listen(PORT, () => {
  console.log(`CivicFix API running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})
