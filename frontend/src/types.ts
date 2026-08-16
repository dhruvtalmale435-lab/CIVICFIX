export type Role = 'citizen' | 'authority' | 'worker'

export type Priority = 'urgent' | 'high' | 'medium' | 'low'

export type IssueStatus =
  | 'pending_ai'       // submitted, waiting AI
  | 'duplicate'        // AI flagged duplicate
  | 'open'             // AI verified, awaiting assignment
  | 'assigned'         // assigned to coordinator
  | 'rejected'         // coordinator rejected — awaiting reassignment
  | 'accepted'         // coordinator accepted task
  | 'in_progress'      // team actively working
  | 'proof_submitted'  // coordinator uploaded proof
  | 'verified'         // authority verified resolution
  | 'resolved'         // closed & citizen notified

export interface IssueUpdate {
  time: string
  message: string
  by: string
  byRole: Role | 'system' | 'ai'
}

export interface Issue {
  id: string
  citizenName: string
  citizenId: string
  type: string
  description: string
  location: string
  address: string
  ward: string
  priority: Priority
  status: IssueStatus
  submittedAt: string
  aiCategory: string
  aiConfidence: number
  aiSeverity: string
  duplicateOf?: string
  assignedWorkerId?: string
  assignedWorkerName?: string
  proofDescription?: string
  resolvedAt?: string
  alertSent?: boolean
  updates: IssueUpdate[]
  cx: number
  cy: number
}

export interface TeamMember {
  name: string
  phone: string
  role: string
}

export interface Worker {
  id: string
  name: string
  initials: string
  team: string
  distance: string
  available: boolean
  activeTasks: number
  performance: number
  phone: string
}

export interface AuthUser {
  role: Role
  name: string
  id: string
  teamMembers?: TeamMember[]
}
