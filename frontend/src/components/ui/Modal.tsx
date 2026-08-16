import { X } from 'lucide-react'

interface ModalProps {
  title?: string
  onClose: () => void
  children: React.ReactNode
  maxWidth?: string
}

export function Modal({ title, onClose, children, maxWidth = 'max-w-md' }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,25,35,0.45)', backdropFilter: 'blur(2px)' }}
    >
      <div className={`bg-white rounded-2xl w-full ${maxWidth}`} style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e8ef]">
            <h3 className="font-display text-base font-700" style={{ color: '#0f1923', fontWeight: 700 }}>{title}</h3>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f0f4f8]">
              <X size={15} color="#7a8697" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
