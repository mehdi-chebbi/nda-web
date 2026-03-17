import { useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import axios from 'axios'

interface UploadDocumentsModalProps {
  onClose: () => void
  onSuccess: () => void
}

const UploadDocumentsModal = ({ onClose, onSuccess }: UploadDocumentsModalProps) => {
  const [uploadForm, setUploadForm] = useState({
    files: [] as File[],
    category: 'policy'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const pdfFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
      if (pdfFiles.length !== e.dataTransfer.files.length) {
        setError('Only PDF files are allowed')
        return
      }
      setUploadForm({ ...uploadForm, files: [...uploadForm.files, ...pdfFiles] })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadForm({ ...uploadForm, files: Array.from(e.target.files) })
    }
    setError('')
  }

  const removeFile = (index: number) => {
    setUploadForm({
      ...uploadForm,
      files: uploadForm.files.filter((_, i) => i !== index)
    })
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (uploadForm.files.length === 0) {
      setError('Please select files to upload')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      uploadForm.files.forEach((file) => {
        formData.append('files', file)
      })
      formData.append('category', uploadForm.category)

      await axios.post('/api/admin/documents/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      setUploadForm({ files: [], category: 'policy' })
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.')
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

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl font-body text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-6">
        {/* Drag and Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
            dragActive
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          />
          <div className="space-y-3">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="font-body font-semibold text-text-primary">
                Drop PDF files here or click to browse
              </p>
              <p className="font-body text-sm text-text-muted mt-1">
                Upload up to 50 files at once
              </p>
            </div>
          </div>
        </div>

        {/* Selected Files List */}
        {uploadForm.files.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <p className="font-body text-sm font-medium text-text-primary">
              {uploadForm.files.length} file{uploadForm.files.length !== 1 ? 's' : ''} selected
            </p>
            {uploadForm.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-text-primary truncate">
                      {file.name}
                    </p>
                    <p className="font-body text-xs text-text-muted">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-3 text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Category Selection */}
        <div>
          <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
            Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUploadForm({ ...uploadForm, category: 'policy' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                uploadForm.category === 'policy'
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
              onClick={() => setUploadForm({ ...uploadForm, category: 'project-readiness' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                uploadForm.category === 'project-readiness'
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
              onClick={() => setUploadForm({ ...uploadForm, category: 'templates' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                uploadForm.category === 'templates'
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
              onClick={() => setUploadForm({ ...uploadForm, category: 'deliverable' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                uploadForm.category === 'deliverable'
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || uploadForm.files.length === 0}
          className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-body font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload Documents</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default UploadDocumentsModal
