import { useState } from 'react'

interface Marker {
  id: string; cx: number; cy: number
  priority: 'urgent' | 'high' | 'medium' | 'low'
  label: string; location: string; reportedAgo: string
}

const MARKERS: Marker[] = [
  { id: 'CF-10482', cx: 310, cy: 195, priority: 'urgent', label: 'Deep Pothole',         location: 'MG Road',       reportedAgo: '2h ago' },
  { id: 'CF-10479', cx: 490, cy: 130, priority: 'high',   label: 'Overflowing Garbage',  location: 'Shivaji Nagar', reportedAgo: '4h ago' },
  { id: 'CF-10480', cx: 580, cy: 270, priority: 'medium', label: 'Broken Streetlight',   location: 'Camp Area',     reportedAgo: 'Yesterday' },
  { id: 'CF-10475', cx: 175, cy: 310, priority: 'urgent', label: 'Burst Water Pipe',     location: 'Koregaon Park', reportedAgo: '6h ago' },
  { id: 'CF-10483', cx: 400, cy: 350, priority: 'high',   label: 'Blocked Storm Drain',  location: 'Ward 7',        reportedAgo: '1d ago' },
  { id: 'CF-10470', cx: 660, cy: 390, priority: 'low',    label: 'Road Crack (Resolved)',location: 'Aundh',         reportedAgo: '3d ago' },
  { id: 'CF-10485', cx: 240, cy: 420, priority: 'high',   label: 'Pothole near School',  location: 'Kothrud',       reportedAgo: '5h ago' },
]

const PC: Record<string, string> = { urgent: '#dc2626', high: '#d97706', medium: '#ca8a04', low: '#16a34a' }

export function CityMap({ height = '420px', showNotification = false }: { height?: string; showNotification?: boolean }) {
  const [selected, setSelected] = useState<Marker | null>(null)
  const W = 760, H = 480
  return (
    <div className="relative rounded-xl overflow-hidden border border-[#dce3ee]" style={{ height, background: '#dde6f0' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <rect width={W} height={H} fill="#dde6f0" />
        <path d="M0,230 Q80,220 160,235 Q240,250 320,240 Q400,230 480,245 Q560,258 640,248 Q710,238 760,245 L760,270 Q710,263 640,273 Q560,283 480,270 Q400,255 320,265 Q240,275 160,260 Q80,245 0,255 Z" fill="#b8d0e8" opacity="0.75" />
        <rect x="60" y="60" width="90" height="70" rx="4" fill="#b8d9b0" />
        <text x="105" y="100" fontSize="8" fill="#5a8a56" textAnchor="middle" fontFamily="Inter,sans-serif">Empress Garden</text>
        <rect x="540" y="310" width="75" height="60" rx="4" fill="#b8d9b0" />
        <rect x="620" y="55" width="80" height="55" rx="4" fill="#b8d9b0" />
        {[[160,60,90,55],[260,60,80,55],[350,60,100,55],[460,60,70,55],[60,145,90,65],[160,145,90,65],[260,145,80,65],[350,145,100,65],[460,145,70,65],[540,145,90,65],[640,145,90,65],[60,280,90,70],[160,280,90,70],[260,280,80,70],[350,280,100,70],[460,280,70,70],[640,280,90,70],[60,370,90,90],[160,370,90,90],[260,370,80,90],[350,370,100,90],[460,370,70,90],[640,380,90,80]].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="#cad3df" />
        ))}
        <rect x="0" y="127" width={W} height="14" fill="#f0f3f7" />
        <text x="380" y="137.5" fontSize="8.5" fill="#8fa0b4" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600">MG Road</text>
        <rect x="0" y="358" width={W} height="10" fill="#edf0f5" />
        <rect x="0" y="270" width={W} height="8" fill="#edf0f5" />
        <text x="200" y="277" fontSize="7.5" fill="#8fa0b4" fontFamily="Inter,sans-serif" fontWeight="500">FC Road</text>
        <rect x="148" y="0" width="11" height={H} fill="#f0f3f7" />
        <rect x="348" y="0" width="11" height={H} fill="#f0f3f7" />
        <rect x="628" y="0" width="11" height={H} fill="#edf0f5" />
        <rect x="248" y="0" width="9" height={H} fill="#edf0f5" />
        <rect x="528" y="0" width="9" height={H} fill="#edf0f5" />
        {MARKERS.map(m => {
          const col = PC[m.priority]
          const isSel = selected?.id === m.id
          return (
            <g key={m.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(isSel ? null : m)}>
              {m.priority === 'urgent' && (
                <circle cx={m.cx} cy={m.cy} r="14" fill={col} opacity="0.15">
                  <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <ellipse cx={m.cx} cy={m.cy + 13} rx="5" ry="2.5" fill="rgba(0,0,0,0.15)" />
              <path d={`M${m.cx},${m.cy+12} C${m.cx-9},${m.cy+3} ${m.cx-9},${m.cy-12} ${m.cx},${m.cy-14} C${m.cx+9},${m.cy-12} ${m.cx+9},${m.cy+3} ${m.cx},${m.cy+12}Z`}
                fill={col} stroke={isSel ? '#fff' : 'none'} strokeWidth={isSel ? '1.5' : '0'} />
              <circle cx={m.cx} cy={m.cy - 4} r="4" fill="white" opacity="0.9" />
            </g>
          )
        })}
        <g transform={`translate(${W - 38}, 38)`}>
          <circle r="18" fill="white" opacity="0.85" />
          <text y="-6" fontSize="9" fill="#4a5568" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="700">N</text>
          <text y="14" fontSize="7" fill="#7a8697" textAnchor="middle" fontFamily="Inter,sans-serif">S</text>
          <text x="-12" y="4" fontSize="7" fill="#7a8697" textAnchor="middle" fontFamily="Inter,sans-serif">W</text>
          <text x="12" y="4" fontSize="7" fill="#7a8697" textAnchor="middle" fontFamily="Inter,sans-serif">E</text>
          <line y1="-14" y2="14" stroke="#4a5568" strokeWidth="0.8" />
          <line x1="-14" x2="14" stroke="#4a5568" strokeWidth="0.8" />
        </g>
      </svg>
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2.5 flex flex-col gap-1.5 border border-[#e4e8ef]">
        {[{ color: '#dc2626', label: 'Urgent' }, { color: '#d97706', label: 'High' }, { color: '#ca8a04', label: 'Medium' }, { color: '#16a34a', label: 'Resolved' }].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: l.color }} />
            <span style={{ color: '#5a6a7e', fontSize: '11px' }}>{l.label}</span>
          </div>
        ))}
      </div>
      {selected && (
        <div className="absolute top-4 left-4 bg-white rounded-xl p-4 w-56 border border-[#e4e8ef]" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-[10px] font-mono font-semibold text-[#7a8697] mb-0.5">{selected.id}</div>
              <div className="text-sm font-semibold" style={{ color: '#0f1923' }}>{selected.label}</div>
              <div className="text-xs text-[#7a8697] mt-0.5">{selected.location}</div>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0"
              style={{ background: PC[selected.priority] + '18', color: PC[selected.priority] }}>
              {selected.priority.charAt(0).toUpperCase() + selected.priority.slice(1)}
            </span>
          </div>
          <div className="text-xs text-[#7a8697] mb-3 pb-3 border-b border-[#f0f4f8]">Reported {selected.reportedAgo} · 3 workers nearby</div>
          <button className="w-full py-1.5 text-xs font-semibold text-white rounded-lg" style={{ background: '#1a3353' }}>Assign Worker</button>
        </div>
      )}
      {showNotification && !selected && (
        <div className="absolute top-4 left-4 bg-white rounded-xl overflow-hidden border border-[#e4e8ef]" style={{ width: '216px' }}>
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
