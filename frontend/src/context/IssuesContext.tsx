import { createContext, useContext, useState } from 'react'
import type { Issue } from '../types'
import { INITIAL_ISSUES } from '../data/seed'
import { getNow, formatDate } from '../lib/constants'

interface UpdatePayload {
  status?: Issue['status']
  proofDescription?: string
  resolvedAt?: string
  assignedWorkerId?: string
  assignedWorkerName?: string
  alertSent?: boolean
  newUpdate?: { time?: string; message: string; by: string; byRole: 'worker' | 'authority' | 'citizen' | 'ai' | 'system' }
}

interface IssuesContextType {
  issues: Issue[]
  addIssue: (issue: Issue) => void
  updateIssue: (issueId: string, updates: UpdatePayload) => void
  assignWorker: (issueId: string, workerId: string, workerName: string, byName: string) => void
  verifyIssue: (issueId: string, byName: string) => void
}

const IssuesContext = createContext<IssuesContextType | null>(null)

export function IssuesProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES)

  const updateIssue = (issueId: string, updates: UpdatePayload) => {
    setIssues(prev => prev.map(iss => {
      if (iss.id !== issueId) return iss
      const { newUpdate, ...rest } = updates
      return {
        ...iss, ...rest,
        updates: newUpdate
          ? [...iss.updates, { time: newUpdate.time ?? getNow(), ...newUpdate }]
          : iss.updates,
      }
    }))
  }

  const addIssue = (issue: Issue) => setIssues(prev => [issue, ...prev])

  const assignWorker = (issueId: string, workerId: string, workerName: string, byName: string) =>
    updateIssue(issueId, {
      status: 'assigned', assignedWorkerId: workerId, assignedWorkerName: workerName,
      newUpdate: { message: `Assigned to ${workerName}`, by: byName, byRole: 'authority' },
    })

  const verifyIssue = (issueId: string, byName: string) =>
    updateIssue(issueId, {
      status: 'resolved', resolvedAt: formatDate(new Date()),
      newUpdate: { message: 'Resolution verified. Issue closed and citizen notified.', by: byName, byRole: 'authority' },
    })

  return (
    <IssuesContext.Provider value={{ issues, addIssue, updateIssue, assignWorker, verifyIssue }}>
      {children}
    </IssuesContext.Provider>
  )
}

export function useIssues() {
  const ctx = useContext(IssuesContext)
  if (!ctx) throw new Error('useIssues must be used within IssuesProvider')
  return ctx
}
