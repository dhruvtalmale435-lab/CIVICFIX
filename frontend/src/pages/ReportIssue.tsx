import { useState, useRef } from 'react'
import {
  Camera, Upload, MapPin, Cpu, CheckCircle2,
  ChevronDown, Loader2, X, ArrowLeft, Info
} from 'lucide-react'

const ISSUE_TYPES = [
  'Pothole',
  'Garbage / Overflowing Bin',
  'Broken Streetlight',
  'Water Leakage',
  'Drain Blockage',
  'Fallen Tree',
  'Damaged Road',
  'Other',
]

interface AIResult {
  type: string
  confidence: number
  severity: string
  priority: string
}

interface Props { setPage: (p: string) => void }

export default function ReportIssue({ setPage }: Props) {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState<AIResult | null>(null)
  const [issueType, setIssueType] = useState('')
  const [description, setDescription] = useState('')
  const [address] = useState('MG Road, Pune, Maharashtra 411001')
  const [submitted, setSubmitted] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setImage(URL.createObjectURL(file))
    setAiResult(null)
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setAiResult({ type: 'Pothole', confidence: 94, severity: 'High', priority: 'Urgent' })
      setIssueType('Pothole')
    }, 2200)
  }

  if (submitted) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: '#f0fdf4' }}>
          <CheckCircle2 size={32} color="#16a34a" />
        </div>
        <h2 className="font-display text-2xl font-800 mb-2" style={{ color: '#0f1923', fontWeight: 800 }}>
          Report Submitted
        </h2>
        <p className="text-sm text-[#4a5568] mb-2 leading-relaxed">
          Your issue has been received, queued for AI verification, and will be assigned shortly.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-8 text-sm font-semibold"
          style={{ background: '#f0f4f8', color: '#1a3353', fontFamily: 'monospace' }}>
          Issue ID: #CF-10488
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setPage('track')}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl"
            style={{ background: '#1a3353' }}>
            Track My Report
          </button>
          <button onClick={() => { setSubmitted(false); setImage(null); setAiResult(null); setIssueType('') }}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-[#e4e8ef]"
            style={{ color: '#1a3353' }}>
            Report Another
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button onClick={() => setPage('home')}
        className="flex items-center gap-1.5 text-sm font-medium mb-6"
        style={{ color: '#7a8697' }}>
        <ArrowLeft size={15} /> Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-800 mb-1" style={{ color: '#0f1923', fontWeight: 800 }}>
          Report a Civic Issue
        </h1>
        <p className="text-sm text-[#4a5568]">
          Help us identify and resolve problems in your neighborhood. Takes about 30 seconds.
        </p>
      </div>

      <div className="space-y-5">

        {/* ── Photo upload ── */}
        <div className="bg-white rounded-xl border border-[#e4e8ef] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-700 text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>Issue Photo</h2>
            <span className="text-xs text-[#7a8697]">Helps AI classify accurately</span>
          </div>

          {image ? (
            <div className="relative rounded-xl overflow-hidden" style={{ height: 220 }}>
              <img src={image} alt="Uploaded issue" className="w-full h-full object-cover" />
              <button
                onClick={() => { setImage(null); setAiResult(null) }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                <X size={14} color="#4a5568" />
              </button>
              {analyzing && (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'rgba(15,25,35,0.4)', backdropFilter: 'blur(2px)' }}>
                  <div className="flex items-center gap-2.5 bg-white rounded-xl px-5 py-3">
                    <Loader2 size={16} className="animate-spin" color="#1a3353" />
                    <span className="text-sm font-medium" style={{ color: '#0f1923' }}>AI analyzing image…</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`drag-zone py-12 flex flex-col items-center gap-3 cursor-pointer ${dragOver ? 'border-[#1a3353] bg-[#f0f4f8]' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) }}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#f0f4f8' }}>
                <Camera size={22} color="#1a3353" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold mb-0.5" style={{ color: '#1a3353' }}>Drag & drop or click to upload</div>
                <div className="text-xs text-[#7a8697]">JPG, PNG — up to 10 MB</div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#e4e8ef] bg-white"
                  style={{ color: '#1a3353' }} onClick={e => { e.stopPropagation(); fileRef.current?.click() }}>
                  <Upload size={12} /> Upload Photo
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#e4e8ef] bg-white"
                  style={{ color: '#1a3353' }} onClick={e => { e.stopPropagation(); fileRef.current?.click() }}>
                  <Camera size={12} /> Take a Photo
                </button>
              </div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
        </div>

        {/* ── AI Analysis result ── */}
        {(analyzing || aiResult) && (
          <div className="bg-white rounded-xl border border-[#e4e8ef] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#eff6ff' }}>
                  <Cpu size={14} color="#1d4ed8" />
                </div>
                <h2 className="font-display font-700 text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>AI Analysis</h2>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
                style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                <Cpu size={9} /> AI-assisted
              </span>
            </div>

            {analyzing ? (
              <div className="flex items-center gap-3 py-3 text-sm text-[#7a8697]">
                <Loader2 size={15} className="animate-spin" color="#1a3353" />
                Scanning image for issue type, severity, and location context…
              </div>
            ) : aiResult && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {[
                    { label: 'Detected Issue', value: aiResult.type,             color: '#0f1923', bg: '#f8f9fb' },
                    { label: 'Confidence',      value: `${aiResult.confidence}%`, color: '#16a34a', bg: '#f0fdf4' },
                    { label: 'Severity',        value: aiResult.severity,         color: '#dc2626', bg: '#fef2f2' },
                    { label: 'Priority',        value: aiResult.priority,         color: '#dc2626', bg: '#fef2f2' },
                  ].map(f => (
                    <div key={f.label} className="p-3 rounded-xl" style={{ background: f.bg }}>
                      <div className="text-[10px] text-[#7a8697] mb-0.5">{f.label}</div>
                      <div className="text-sm font-semibold" style={{ color: f.color }}>{f.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: '#f8f9fb' }}>
                  <Info size={13} color="#7a8697" className="mt-0.5 shrink-0" />
                  <p className="text-xs text-[#7a8697]">
                    This is an AI suggestion. Review and correct the issue type below if needed.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Issue details ── */}
        <div className="bg-white rounded-xl border border-[#e4e8ef] p-5 space-y-4">
          <h2 className="font-display font-700 text-sm" style={{ color: '#0f1923', fontWeight: 700 }}>Issue Details</h2>

          {/* Type */}
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: '#0f1923' }}>
              Issue Type <span style={{ color: '#dc2626' }}>*</span>
            </label>
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

          {/* Description */}
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: '#0f1923' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the issue — approximate size, traffic impact, any safety risk…"
              rows={4}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e8ef] resize-none"
            />
            <div className="text-right text-xs text-[#7a8697] mt-1">{description.length}/400</div>
          </div>
        </div>

        {/* ── Location ── */}
        <div className="bg-white rounded-xl border border-[#e4e8ef] p-5">
          <h2 className="font-display font-700 text-sm mb-4" style={{ color: '#0f1923', fontWeight: 700 }}>Location</h2>

          {/* Mini map */}
          <div className="rounded-xl overflow-hidden mb-4 border border-[#e4e8ef]" style={{ height: 130 }}>
            <svg width="100%" height="100%" viewBox="0 0 500 130">
              <rect width="500" height="130" fill="#dde6f0" />
              {[0,50,100,150,200,250,300,350,400,450,500].map(x => (
                <line key={x} x1={x} y1={0} x2={x} y2={130} stroke="#f0f3f7" strokeWidth="4" />
              ))}
              {[0,40,80,120].map(y => (
                <line key={y} x1={0} y1={y} x2={500} y2={y} stroke="#f0f3f7" strokeWidth="3" />
              ))}
              {[[0,0,48,38],[52,0,46,38],[100,0,48,38],[150,0,46,38],[200,0,48,38],[250,0,46,38],[300,0,48,38],
                [0,42,48,36],[52,42,46,36],[100,42,48,36],[200,42,48,36],[300,42,48,36],
                [0,80,48,46],[52,80,46,46],[100,80,48,46],[200,80,48,46],[300,80,48,46]].map(([x,y,w,h],i) => (
                <rect key={i} x={x} y={y} width={w} height={h} fill="#cad3df" rx="1" />
              ))}
              {/* Pin */}
              <circle cx="250" cy="65" r="14" fill="#dc2626" opacity="0.15" />
              <path d="M250,75 C244,67 244,54 250,52 C256,54 256,67 250,75Z" fill="#dc2626" />
              <circle cx="250" cy="60" r="4" fill="white" />
              {/* Road label */}
              <text x="250" y="34" fontSize="9" fill="#8fa0b4" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600">MG Road</text>
            </svg>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={address}
              readOnly
              className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-[#e4e8ef] bg-[#f8f9fb]"
              style={{ color: '#0f1923' }}
            />
            <button className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl border border-[#e4e8ef] whitespace-nowrap"
              style={{ color: '#1a3353' }}>
              <MapPin size={13} /> My Location
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs text-[#7a8697]">GPS location auto-detected</span>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-[#7a8697]">
            Submissions are anonymous unless you sign in.
          </p>
          <button
            onClick={() => setSubmitted(true)}
            disabled={!issueType}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#1a3353', transition: 'opacity 0.15s' }}
          >
            <CheckCircle2 size={15} />
            Submit Report
          </button>
        </div>

      </div>
    </div>
  )
}
