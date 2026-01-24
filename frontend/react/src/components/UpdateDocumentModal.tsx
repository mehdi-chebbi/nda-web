import { useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import axios from 'axios'

interface UpdateDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  document: {
    id: string
    displayName: string
    category: string
    name: string
  }
}

const UpdateDocumentModal = ({ isOpen, onClose, onSuccess, document }: UpdateDocumentModalProps) => {
  const [form, setForm] = useState({
    displayName: document.displayName,
    category: document.category,
    file: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm({ ...form, file: e.target.files[0] })
      setError('')
    }
  }

  const removeFile = () => {
    setForm({ ...form, file: null })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.displayName.trim()) {
      setError('Display name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()

      if (form.file) {
        formData.append('file', form.file)
      }
      formData.append('displayName', form.displayName.trim())
      formData.append('category', form.category)

      await axios.put(`/api/admin/documents/${document.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Update failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  if (!isOpen) return null

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl font-body text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display Name Input */}
        <div>
          <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
            Display Name
          </label>
          <input
            type="text"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            placeholder="Enter display name"
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted"
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
            Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, category: 'policy' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                form.category === 'policy'
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-primary hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <FileText className="w-6 h-6 mx-auto mb-2" />
                <span className="font-body text-sm font-medium">Policy</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, category: 'project-readiness' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                form.category === 'project-readiness'
                  ? 'border-blue-500 bg-blue-500/5 ring-2 ring-blue-500/20'
                  : 'border-gray-200 hover:border-blue-500 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <FileText className="w-6 h-6 mx-auto mb-2" />
                <span className="font-body text-sm font-medium">Project Readiness</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, category: 'templates' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                form.category === 'templates'
                  ? 'border-purple-500 bg-purple-500/5 ring-2 ring-purple-500/20'
                  : 'border-gray-200 hover:border-purple-500 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <FileText className="w-6 h-6 mx-auto mb-2" />
                <span className="font-body text-sm font-medium">Templates</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, category: 'deliverable' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                form.category === 'deliverable'
                  ? 'border-orange-500 bg-orange-500/5 ring-2 ring-orange-500/20'
                  : 'border-gray-200 hover:border-orange-500 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <FileText className="w-6 h-6 mx-auto mb-2" />
                <span className="font-body text-sm font-medium">Deliverables</span>
              </div>
            </button>
          </div>
        </div>

        {/* File Upload (Optional) */}
        <div>
          <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
            Replace File (Optional)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
          {form.file && (
            <div className="mt-3 flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-text-primary truncate">
                    {form.file.name}
                  </p>
                  <p className="font-body text-xs text-text-muted">
                    {formatFileSize(form.file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="ml-3 text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-body font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Updating...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Update Document</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default UpdateDocumentModal
