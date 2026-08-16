import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Upload, MapPin, Cpu, CheckCircle2, ChevronDown, Loader2, X, ArrowLeft, Info } from 'lucide-react'
import { useIssues } from '../../context/IssuesContext'
import { useAuth } from '../../context/AuthContext'
import { Button, Card } from '../../components/ui'
import { ISSUE_TYPES, getNow } from '../../lib/constants'
import type { Issue } from '../../types'

export function ReportPage() {
  const { addIssue } = useIssues()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState<{ type: string; confidence: number; severity: string } | null>(null)
  const [issueType, setIssueType] = useState('')
  const [description, setDescription] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [submitted, setSubmitted] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setImage(URL.createObjectURL(file))
    setAiResult(null)
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setAiResult({ type: 'Pothole', confidence: 94, severity: 'High' })
      setIssueType('Pothole')
    }, 2200)
  }

  const handleSubmit = () => {
    const id = `CF-${10490 + Math.floor(Math.random() * 100)}`
    const issue: Issue = {
      id, citizenId: auth?.id ?? 'guest', citizenName: auth?.name ?? 'Anonymous',
      type: issueType, description, location: 'MG Road, Pune',
      address: 'MG Road, Pune 411001', ward: 'Ward 5',
      priority: 'high', status: 'open',
      submittedAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      aiCategory: aiResult?.type ?? issueType, aiConfidence: aiResult?.confidence ?? 85,
      aiSeverity: aiResult?.severity ?? 'Medium', cx: 350, cy: 200,
      updates: [
        { time: getNow(), message: 'Issue submitted by citizen', by: auth?.name ?? 'Anonymous', byRole: 'citizen' },
        { time: getNow(), message: `AI classified: ${issueType}, ${aiResult?.confidence ?? 85}% confidence.`, by: 'AI System', byRole: 'ai' },
      ],
    }
    addIssue(issue)
    setSubmitted(id)
  }

  if (submitted) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#f0fdf4' }}>
          <CheckCircle2 size={32} color="#16a34a" />
        </div>
        <h2 className="font-display text-2xl mb-2" style={{ color: '#0f1923', fontWeight: 800 }}>Report Submitted</h2>
        <p className="text-sm text-[#4a5568] mb-2 leading-relaxed">Your issue has been received and AI-verified. Municipal authorities have been notified.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-8 text-sm font-semibold font-mono" style={{ background: '#f0f4f8', color: '#1a3353' }}>
          Issue ID: {submitted}
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate('/track')}>Track My Report</Button>
          <Button variant="secondary" onClick={() => { setSubmitted(null); setImage(null); setAiResult(null); setIssueType('') }}>Report Another</Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm font-medium mb-6 hover:text-[#1a3353]" style={{ color: '#7a8697' }}>
        <ArrowLeft size={15} /> Back
      </button>
      <div className="mb-8">
        <h1 className="font-display text-2xl mb-1" style={{ color: '#0f1923', fontWeight: 800 }}>Report a Civic Issue</h1>
        <p className="text-sm text-[#4a5568]">Help us identify and resolve problems in your neighborhood. Takes about 30 seconds.</p>
      </div>

      <div className="space-y-5">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>Issue Photo</h2>
            <span className="text-xs text-[#7a8697]">Helps AI classify accurately</span>
          </div>
          {image ? (
            <div className="relative rounded-xl overflow-hidden" style={{ height: 220 }}>
              <img src={image} alt="Uploaded issue" className="w-full h-full object-cover" />
              <button onClick={() => { setImage(null); setAiResult(null) }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                <X size={14} color="#4a5568" />
              </button>
              {analyzing && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(15,25,35,0.4)', backdropFilter: 'blur(2px)' }}>
                  <div className="flex items-center gap-2.5 bg-white rounded-xl px-5 py-3">
                    <Loader2 size={16} className="animate-spin" color="#1a3353" />
                    <span className="text-sm font-medium" style={{ color: '#0f1923' }}>AI analyzing image…</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`drag-zone py-12 flex flex-col items-center gap-3 cursor-pointer ${dragOver ? 'border-[#1a3353] bg-[#f0f4f8]' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) }}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#f0f4f8' }}><Camera size={22} color="#1a3353" /></div>
              <div className="text-center">
                <div className="text-sm font-semibold mb-0.5" style={{ color: '#1a3353' }}>Drag & drop or click to upload</div>
                <div className="text-xs text-[#7a8697]">JPG, PNG — up to 10 MB</div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#e4e8ef] bg-white" style={{ color: '#1a3353' }}
                  onClick={e => { e.stopPropagation(); fileRef.current?.click() }}><Upload size={12} /> Upload Photo</button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#e4e8ef] bg-white" style={{ color: '#1a3353' }}
                  onClick={e => { e.stopPropagation(); fileRef.current?.click() }}><Camera size={12} /> Take a Photo</button>
              </div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
        </Card>

        {aiResult && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#eff6ff' }}><Cpu size={14} color="#1d4ed8" /></div>
                <h2 className="font-display text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>AI Analysis</h2>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: '#eff6ff', color: '#1d4ed8' }}><Cpu size={9} /> AI-assisted</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {[
                { label: 'Detected Issue', value: aiResult.type,             bg: '#f8f9fb', c: '#0f1923' },
                { label: 'Confidence',     value: `${aiResult.confidence}%`, bg: '#f0fdf4', c: '#16a34a' },
                { label: 'Severity',       value: aiResult.severity,         bg: '#fef2f2', c: '#dc2626' },
                { label: 'Priority',       value: 'Urgent',                  bg: '#fef2f2', c: '#dc2626' },
              ].map(f => (
                <div key={f.label} className="p-3 rounded-xl" style={{ background: f.bg }}>
                  <div className="text-[10px] text-[#7a8697] mb-0.5">{f.label}</div>
                  <div className="text-sm font-semibold" style={{ color: f.c }}>{f.value}</div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: '#f8f9fb' }}>
              <Info size={13} color="#7a8697" className="mt-0.5 shrink-0" />
              <p className="text-xs text-[#7a8697]">This is an AI suggestion. Review and correct the issue type below if needed.</p>
            </div>
          </Card>
        )}

        <Card>
          <h2 className="font-display text-sm mb-4" style={{ color: '#0f1923', fontWeight: 700 }}>Issue Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: '#0f1923' }}>Issue Type <span style={{ color: '#dc2626' }}>*</span></label>
              <div className="relative">
                <select value={issueType} onChange={e => setIssueType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e8ef] bg-white appearance-none pr-9"
                  style={{ color: issueType ? '#0f1923' : '#9aabb8' }}>
                  <option value="" disabled>Select issue type</option>
                  {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#7a8697' }} />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: '#0f1923' }}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue — approximate size, traffic impact, any safety risk…"
                rows={4} className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e8ef] resize-none" />
              <div className="text-right text-xs text-[#7a8697] mt-1">{description.length}/400</div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-sm mb-4" style={{ color: '#0f1923', fontWeight: 700 }}>Location</h2>
          <div className="flex gap-3">
            <input type="text" defaultValue="MG Road, Pune, Maharashtra 411001" readOnly
              className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-[#e4e8ef] bg-[#f8f9fb]" style={{ color: '#0f1923' }} />
            <button className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl border border-[#e4e8ef] whitespace-nowrap" style={{ color: '#1a3353' }}>
              <MapPin size={13} /> My Location
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs text-[#7a8697]">GPS location auto-detected</span>
          </div>
        </Card>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-[#7a8697]">Submissions are anonymous unless you sign in.</p>
          <Button onClick={handleSubmit} disabled={!issueType}>
            <CheckCircle2 size={15} /> Submit Report
          </Button>
        </div>
      </div>
    </div>
  )
}
