import type { Priority, IssueStatus } from '../types'

export const PRIORITY_CONFIG: Record<Priority, { label: string; bg: string; color: string }> = {
  urgent: { label: 'Urgent', bg: '#fef2f2', color: '#dc2626' },
  high:   { label: 'High',   bg: '#fffbeb', color: '#d97706' },
  medium: { label: 'Medium', bg: '#fefce8', color: '#ca8a04' },
  low:    { label: 'Low',    bg: '#f0fdf4', color: '#16a34a' },
}

export const STATUS_CONFIG: Record<IssueStatus, { label: string; bg: string; color: string; step: number }> = {
  pending_ai:      { label: 'Analyzing',    bg: '#eff6ff', color: '#1d4ed8', step: 0 },
  duplicate:       { label: 'Duplicate',    bg: '#fdf4ff', color: '#9333ea', step: 0 },
  open:            { label: 'Open',         bg: '#f1f5f9', color: '#475569', step: 1 },
  rejected:        { label: 'Rejected',     bg: '#fef2f2', color: '#dc2626', step: 1 },
  assigned:        { label: 'Assigned',     bg: '#f5f3ff', color: '#7c3aed', step: 2 },
  accepted:        { label: 'Accepted',     bg: '#eff6ff', color: '#1d4ed8', step: 2 },
  in_progress:     { label: 'In Progress',  bg: '#fffbeb', color: '#b45309', step: 3 },
  proof_submitted: { label: 'Under Review', bg: '#fdf4ff', color: '#9333ea', step: 3 },
  verified:        { label: 'Verified',     bg: '#f0fdf4', color: '#16a34a', step: 4 },
  resolved:        { label: 'Resolved',     bg: '#f0fdf4', color: '#16a34a', step: 4 },
}

export const ISSUE_TYPES = [
  'Pothole', 'Garbage', 'Streetlight', 'Water Leakage',
  'Drain Blockage', 'Fallen Tree', 'Damaged Road', 'Other',
]

export const PROGRESS_STEPS = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved']

export const AVATAR_COLORS = ['#1a3353', '#16a34a', '#d97706', '#1d4ed8', '#7c3aed']

export const ROLE_COLORS: Record<string, string> = {
  ai: '#1d4ed8', authority: '#1a3353', worker: '#16a34a', citizen: '#7c3aed', system: '#94a3b8',
}

export const STATUS_GROUP: Record<string, string> = {
  pending_ai: 'Open', duplicate: 'Open', open: 'Open', rejected: 'Open',
  assigned: 'Assigned', accepted: 'Assigned',
  in_progress: 'In Progress', proof_submitted: 'In Progress',
  verified: 'Resolved', resolved: 'Resolved',
}

export function getNow() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
