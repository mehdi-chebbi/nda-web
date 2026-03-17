import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark px-6 py-4 rounded-t-2xl border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-heading">{title}</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors duration-200 hover:rotate-90 transform"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
