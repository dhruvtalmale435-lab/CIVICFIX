import { useState } from 'react'

interface Marker {
  id: string
  type: 'pothole' | 'garbage' | 'streetlight' | 'water' | 'drain' | 'road'
  cx: number
  cy: number
  priority: 'urgent' | 'high' | 'medium' | 'low'
  label: string
  location: string
  reportedAgo: string
}

const MARKERS: Marker[] = [
  { id: 'CF-10482', type: 'pothole',     cx: 310, cy: 195, priority: 'urgent', label: 'Deep Pothole',          location: 'MG Road',        reportedAgo: '2h ago' },
  { id: 'CF-10479', type: 'garbage',     cx: 490, cy: 130, priority: 'high',   label: 'Overflowing Garbage',  location: 'Shivaji Nagar',  reportedAgo: '4h ago' },
  { id: 'CF-10480', type: 'streetlight', cx: 580, cy: 270, priority: 'medium', label: 'Broken Streetlight',   location: 'Camp Area',      reportedAgo: 'Yesterday' },
  { id: 'CF-10475', type: 'water',       cx: 175, cy: 310, priority: 'urgent', label: 'Burst Water Pipe',     location: 'Koregaon Park',  reportedAgo: '6h ago' },
  { id: 'CF-10483', type: 'drain',       cx: 400, cy: 350, priority: 'high',   label: 'Blocked Storm Drain',  location: 'Ward 7',         reportedAgo: '1d ago' },
  { id: 'CF-10470', type: 'road',        cx: 660, cy: 390, priority: 'low',    label: 'Road Crack (Resolved)',location: 'Aundh',          reportedAgo: '3d ago' },
  { id: 'CF-10485', type: 'pothole',     cx: 240, cy: 420, priority: 'high',   label: 'Pothole near School',  location: 'Kothrud',        reportedAgo: '5h ago' },
]

const PRIORITY_COLOR: Record<string, string> = {
  urgent: '#dc2626',
  high:   '#d97706',
  medium: '#ca8a04',
  low:    '#16a34a',
}

interface CityMapProps {
  showNotification?: boolean
  height?: string
  compact?: boolean
}

export default function CityMap({ showNotification = false, height = '420px', compact = false }: CityMapProps) {
  const [selected, setSelected] = useState<Marker | null>(null)
  const W = 760, H = 480

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#dce3ee]" style={{ height, background: '#dde6f0' }}>
      <svg
        width="100%" height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ── Base ground ── */}
        <rect width={W} height={H} fill="#dde6f0" />

        {/* ── Water / river (Mula-Mutha) ── */}
        <path d="M0,230 Q80,220 160,235 Q240,250 320,240 Q400,230 480,245 Q560,258 640,248 Q710,238 760,245 L760,270 Q710,263 640,273 Q560,283 480,270 Q400,255 320,265 Q240,275 160,260 Q80,245 0,255 Z"
          fill="#b8d0e8" opacity="0.75" />
        <text x="380" y="256" fontSize="9" fill="#7fa8c8" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="500">Mula River</text>

        {/* ── Parks / green spaces ── */}
        <rect x="60"  y="60"  width="90" height="70" rx="4" fill="#b8d9b0" />
        <text x="105" y="100" fontSize="8" fill="#5a8a56" textAnchor="middle" fontFamily="Inter,sans-serif">Empress</text>
        <text x="105" y="110" fontSize="8" fill="#5a8a56" textAnchor="middle" fontFamily="Inter,sans-serif">Garden</text>

        <rect x="540" y="310" width="75" height="60" rx="4" fill="#b8d9b0" />
        <text x="577" y="344" fontSize="8" fill="#5a8a56" textAnchor="middle" fontFamily="Inter,sans-serif">Saras Baug</text>

        <rect x="620" y="55"  width="80" height="55" rx="4" fill="#b8d9b0" />
        <text x="660" y="87"  fontSize="8" fill="#5a8a56" textAnchor="middle" fontFamily="Inter,sans-serif">Bund Garden</text>

        {/* ── City blocks ── */}
        {/* Row 1 */}
        <rect x="160" y="60"  width="90"  height="55" rx="2" fill="#cad3df" />
        <rect x="260" y="60"  width="80"  height="55" rx="2" fill="#c8d2de" />
        <rect x="350" y="60"  width="100" height="55" rx="2" fill="#cad3df" />
        <rect x="460" y="60"  width="70"  height="55" rx="2" fill="#c6d0dc" />
        {/* Row 2 */}
        <rect x="60"  y="145" width="90"  height="65" rx="2" fill="#c8d2de" />
        <rect x="160" y="145" width="90"  height="65" rx="2" fill="#c5cfdb" />
        <rect x="260" y="145" width="80"  height="65" rx="2" fill="#cad3df" />
        <rect x="350" y="145" width="100" height="65" rx="2" fill="#c8d2de" />
        <rect x="460" y="145" width="70"  height="65" rx="2" fill="#c5cfdb" />
        <rect x="540" y="145" width="90"  height="65" rx="2" fill="#cad3df" />
        <rect x="640" y="145" width="90"  height="65" rx="2" fill="#c8d2de" />
        {/* Row 3 */}
        <rect x="60"  y="280" width="90"  height="70" rx="2" fill="#cad3df" />
        <rect x="160" y="280" width="90"  height="70" rx="2" fill="#c8d2de" />
        <rect x="260" y="280" width="80"  height="70" rx="2" fill="#c5cfdb" />
        <rect x="350" y="280" width="100" height="70" rx="2" fill="#cad3df" />
        <rect x="460" y="280" width="70"  height="70" rx="2" fill="#c8d2de" />
        <rect x="640" y="280" width="90"  height="70" rx="2" fill="#c5cfdb" />
        {/* Row 4 */}
        <rect x="60"  y="370" width="90"  height="90" rx="2" fill="#c8d2de" />
        <rect x="160" y="370" width="90"  height="90" rx="2" fill="#cad3df" />
        <rect x="260" y="370" width="80"  height="90" rx="2" fill="#c5cfdb" />
        <rect x="350" y="370" width="100" height="90" rx="2" fill="#c8d2de" />
        <rect x="460" y="370" width="70"  height="90" rx="2" fill="#cad3df" />
        <rect x="640" y="380" width="90"  height="80" rx="2" fill="#c8d2de" />

        {/* ── Arterial roads (wider, white) ── */}
        {/* MG Road – horizontal major */}
        <rect x="0" y="127" width={W} height="14" fill="#f0f3f7" />
        <text x="380" y="137.5" fontSize="8.5" fill="#8fa0b4" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600">MG Road</text>

        {/* JM Road – horizontal secondary */}
        <rect x="0" y="358" width={W} height="10" fill="#edf0f5" />
        <text x="120" y="366" fontSize="7.5" fill="#8fa0b4" fontFamily="Inter,sans-serif" fontWeight="500">JM Road</text>

        {/* FC Road – diagonal-ish secondary */}
        <rect x="0" y="270" width={W} height="8" fill="#edf0f5" />
        <text x="200" y="277" fontSize="7.5" fill="#8fa0b4" fontFamily="Inter,sans-serif" fontWeight="500">FC Road</text>

        {/* Vertical: Deccan / Karve Road */}
        <rect x="148" y="0" width="11" height={H} fill="#f0f3f7" />
        <text x="153.5" y="80" fontSize="8" fill="#8fa0b4" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="500" transform="rotate(-90,153.5,80)">Karve Rd</text>

        {/* Vertical: Bund Garden Rd */}
        <rect x="348" y="0" width="11" height={H} fill="#f0f3f7" />
        <text x="353.5" y="85" fontSize="8" fill="#8fa0b4" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="500" transform="rotate(-90,353.5,85)">Bund Garden Rd</text>

        {/* Vertical: Solapur Road */}
        <rect x="628" y="0" width="11" height={H} fill="#edf0f5" />
        <text x="633.5" y="90" fontSize="8" fill="#8fa0b4" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="500" transform="rotate(-90,633.5,90)">Solapur Rd</text>

        {/* Vertical: SB Road */}
        <rect x="248" y="0" width="9" height={H} fill="#edf0f5" />

        {/* Vertical: Nagar Road */}
        <rect x="528" y="0" width="9" height={H} fill="#edf0f5" />
        <text x="532.5" y="82" fontSize="7.5" fill="#8fa0b4" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="500" transform="rotate(-90,532.5,82)">Nagar Road</text>

        {/* Local cross streets */}
        <rect x="0" y="54"  width={W} height="5" fill="#e8ecf3" />
        <rect x="0" y="210" width={W} height="5" fill="#e8ecf3" />
        <rect x="0" y="440" width={W} height="5" fill="#e8ecf3" />
        <rect x="50"  y="0" width="7" height={H} fill="#e8ecf3" />
        <rect x="440" y="0" width="7" height={H} fill="#e8ecf3" />

        {/* ── Issue Markers ── */}
        {MARKERS.map(m => {
          const col  = PRIORITY_COLOR[m.priority]
          const isSel = selected?.id === m.id
          return (
            <g key={m.id}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelected(isSel ? null : m)}
            >
              {/* Pulse ring for urgent */}
              {m.priority === 'urgent' && (
                <circle cx={m.cx} cy={m.cy} r="14" fill={col} opacity="0.15">
                  <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Pin shadow */}
              <ellipse cx={m.cx} cy={m.cy + 13} rx="5" ry="2.5" fill="rgba(0,0,0,0.15)" />
              {/* Pin body */}
              <path
                d={`M${m.cx},${m.cy + 12} C${m.cx - 9},${m.cy + 3} ${m.cx - 9},${m.cy - 12} ${m.cx},${m.cy - 14} C${m.cx + 9},${m.cy - 12} ${m.cx + 9},${m.cy + 3} ${m.cx},${m.cy + 12}Z`}
                fill={col}
                stroke={isSel ? '#fff' : 'none'}
                strokeWidth={isSel ? '1.5' : '0'}
              />
              {/* Pin inner circle */}
              <circle cx={m.cx} cy={m.cy - 4} r="4" fill="white" opacity="0.9" />
            </g>
          )
        })}

        {/* ── Compass rose ── */}
        <g transform={`translate(${W - 38}, 38)`}>
          <circle r="18" fill="white" opacity="0.85" />
          <text y="-6"  fontSize="9" fill="#4a5568" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="700">N</text>
          <text y="14"  fontSize="7" fill="#7a8697" textAnchor="middle" fontFamily="Inter,sans-serif">S</text>
          <text x="-12" y="4"  fontSize="7" fill="#7a8697" textAnchor="middle" fontFamily="Inter,sans-serif">W</text>
          <text x="12"  y="4"  fontSize="7" fill="#7a8697" textAnchor="middle" fontFamily="Inter,sans-serif">E</text>
          <line y1="-14" y2="14" stroke="#4a5568" strokeWidth="0.8" />
          <line x1="-14" x2="14" stroke="#4a5568" strokeWidth="0.8" />
        </g>

        {/* ── Scale bar ── */}
        <g transform={`translate(24, ${H - 24})`}>
          <rect width="60" height="4" rx="2" fill="white" opacity="0.7" />
          <rect width="30" height="4" rx="2" fill="#7a8697" opacity="0.7" />
          <text x="0"  y="-4" fontSize="7" fill="#7a8697" fontFamily="Inter,sans-serif">0</text>
          <text x="52" y="-4" fontSize="7" fill="#7a8697" fontFamily="Inter,sans-serif">500m</text>
        </g>
      </svg>

      {/* ── Legend ── */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2.5 flex flex-col gap-1.5 border border-[#e4e8ef]"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        {[
          { color: '#dc2626', label: 'Urgent' },
          { color: '#d97706', label: 'High' },
          { color: '#ca8a04', label: 'Medium' },
          { color: '#16a34a', label: 'Resolved' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: l.color }} />
            <span style={{ color: '#5a6a7e', fontSize: '11px', fontFamily: 'Inter,sans-serif' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* ── Marker popup ── */}
      {selected && (
        <div className="absolute top-4 left-4 bg-white rounded-xl p-4 w-56 border border-[#e4e8ef]"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-[10px] font-mono font-semibold text-[#7a8697] mb-0.5">{selected.id}</div>
              <div className="text-sm font-semibold" style={{ color: '#0f1923', fontFamily: 'Manrope,sans-serif' }}>{selected.label}</div>
              <div className="text-xs text-[#7a8697] mt-0.5">{selected.location}</div>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0"
              style={{
                background: PRIORITY_COLOR[selected.priority] + '18',
                color: PRIORITY_COLOR[selected.priority],
              }}>
              {selected.priority.charAt(0).toUpperCase() + selected.priority.slice(1)}
            </span>
          </div>
          <div className="text-xs text-[#7a8697] mb-3 pb-3 border-b border-[#f0f4f8]">
            Reported {selected.reportedAgo} · 3 workers nearby
          </div>
          <button
            className="w-full py-1.5 text-xs font-semibold text-white rounded-lg"
            style={{ background: '#1a3353' }}
          >
            Assign Worker
          </button>
        </div>
      )}

      {/* ── Notification toast ── */}
      {showNotification && !selected && (
        <div className="absolute top-4 left-4 bg-white rounded-xl overflow-hidden border border-[#e4e8ef]"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '216px' }}>
          <div className="h-1 w-full" style={{ background: '#16a34a' }} />
          <div className="px-3 py-2.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[11px] font-semibold" style={{ color: '#16a34a' }}>Issue Verified</span>
            </div>
            <div className="text-xs font-semibold" style={{ color: '#0f1923' }}>Pothole on MG Road</div>
            <div className="text-xs text-[#7a8697]">Status: Assigned to Rajesh K.</div>
          </div>
        </div>
      )}
    </div>
  )
}
