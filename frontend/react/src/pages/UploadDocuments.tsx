import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import axios from 'axios'

interface FileWithDescription {
  file: File
  displayName: string
  description: string
}

const UploadDocuments = () => {
  const navigate = useNavigate()
  const [files, setFiles] = useState<FileWithDescription[]>([])
  const [category, setCategory] = useState('policy')
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
      const newFiles = pdfFiles.map(file => {
        const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
        return {
          file,
          displayName: baseName,
          description: ''
        };
      })
      setFiles([...files, ...newFiles])
      setError('')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => {
        const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
        return {
          file,
          displayName: baseName,
          description: ''
        };
      })
      setFiles(newFiles)
      setError('')
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const updateDescription = (index: number, description: string) => {
    const updatedFiles = [...files]
    updatedFiles[index].description = description
    setFiles(updatedFiles)
  }

  const updateDisplayName = (index: number, displayName: string) => {
    const updatedFiles = [...files]
    updatedFiles[index].displayName = displayName
    setFiles(updatedFiles)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      setError('Please select files to upload')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()

      files.forEach((fileWithDesc) => {
        formData.append('files', fileWithDesc.file)
      })

      formData.append('category', category)

      const descriptionsMap: { [key: string]: string } = {}
      const displayNamesMap: { [key: string]: string } = {}
      files.forEach((fileWithDesc) => {
        descriptionsMap[fileWithDesc.file.name] = fileWithDesc.description
        displayNamesMap[fileWithDesc.file.name] = fileWithDesc.displayName
      })
      formData.append('descriptions', JSON.stringify(descriptionsMap))
      formData.append('displayNames', JSON.stringify(displayNamesMap))

      await axios.post('/api/admin/documents/with-descriptions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      navigate('/admin')
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
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Admin</span>
          </button>

          <h1 className="font-heading font-bold text-4xl text-primary mb-2">
            Upload Documents
          </h1>
          <p className="font-body text-text-secondary text-lg">
            Add documents with descriptions for {category.replace('-', ' ')}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl font-body text-sm flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="font-body text-sm font-semibold text-text-primary mb-3 block">
              Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['policy', 'project-readiness', 'templates', 'deliverable'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    category === cat
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <FileText className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-body text-sm font-medium capitalize">
                      {cat.replace('-', ' ')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Drag and Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
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
            <div className="space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="font-body font-semibold text-text-primary text-lg">
                  Drop PDF files here or click to browse
                </p>
                <p className="font-body text-sm text-text-muted mt-2">
                  Upload up to 50 files at once
                </p>
              </div>
            </div>
          </div>

          {/* Files List with Descriptions */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-body text-sm font-medium text-text-primary">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </p>
                <p className="font-body text-xs text-text-muted">
                  Fill in display names and descriptions for each document below
                </p>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {files.map((fileWithDesc, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    {/* File Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-medium text-text-primary truncate">
                            {fileWithDesc.file.name}
                          </p>
                          <p className="font-body text-xs text-text-muted">
                            {formatFileSize(fileWithDesc.file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-3 text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-lg flex-shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Display Name Input */}
                    <div>
                      <label className="font-body text-xs font-semibold text-text-primary mb-1.5 block">
                        Display Name <span className="text-text-muted font-normal">(shown to users)</span>
                      </label>
                      <input
                        type="text"
                        value={fileWithDesc.displayName}
                        onChange={(e) => updateDisplayName(index, e.target.value)}
                        placeholder="Enter a user-friendly name for this document..."
                        className="w-full px-3 py-2 bg-bg-secondary border-2 border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted"
                      />
                    </div>

                    {/* Description Input */}
                    <div>
                      <label className="font-body text-xs font-semibold text-text-primary mb-1.5 block">
                        Description
                      </label>
                      <textarea
                        value={fileWithDesc.description}
                        onChange={(e) => updateDescription(index, e.target.value)}
                        placeholder="Enter a brief description for this document..."
                        rows={2}
                        className="w-full px-3 py-2 bg-bg-secondary border-2 border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-body font-semibold transition-all duration-300 hover:bg-gray-50 hover:border-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || files.length === 0}
              className="flex-1 max-w-xs bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-body font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Documents</span>
                </>
              )}
            </button>
          </div>
        </form>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c9c9c9;
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}</style>
      </div>
    </div>
  )
}

export default UploadDocuments
