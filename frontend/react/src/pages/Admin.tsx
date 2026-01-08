import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import PressReleaseAdmin from '../components/PressReleaseAdmin'

interface Document {
  id: string
  name: string
  displayName: string
  size: number
  modified: string
  category: string
}

interface Manifest {
  gcf: Document[]
  policy: Document[]
  lastUpdated: string
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [uploadForm, setUploadForm] = useState({
    files: null as FileList | null,
    category: 'gcf'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'documents' | 'press-releases'>('documents')

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
      fetchDocuments()
    }
  }, [])

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get<Manifest>('/api/admin/documents', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setManifest(response.data)
    } catch (err) {
      console.error('Error fetching documents:', err)
      setError('Failed to fetch documents')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/admin/login', loginForm)
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token)
        setIsAuthenticated(true)
        fetchDocuments()
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setManifest(null)
    setLoginForm({ username: '', password: '' })
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadForm.files || uploadForm.files.length === 0) {
      setError('Please select files to upload')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      for (let i = 0; i < uploadForm.files.length; i++) {
        formData.append('files', uploadForm.files[i])
      }
      formData.append('category', uploadForm.category)

      const response = await axios.post('/api/admin/documents/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      setSuccessMessage(`Successfully uploaded ${response.data.totalUploaded} file${response.data.totalUploaded !== 1 ? 's' : ''}!`)
      setUploadForm({ files: null, category: 'gcf' })
      fetchDocuments()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`/api/admin/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSuccessMessage('Document deleted successfully!')
      fetchDocuments()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Delete failed. Please try again.')
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="bg-bg-primary min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md p-8">
          <h1 className="font-heading font-bold text-3xl text-primary text-center mb-6">
            Admin Login
          </h1>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 font-body text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Username"
              type="text"
              name="username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              placeholder="Enter your username"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="font-heading font-bold text-4xl text-primary mb-2">
              Admin Dashboard
            </h1>
            <p className="font-body text-text-secondary">
              Manage documents and content for Readiness Eritrea platform
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 font-body text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6 font-body text-sm">
            {successMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-3 rounded-t-lg font-body font-medium transition-colors duration-200 ${
                activeTab === 'documents'
                  ? 'bg-white text-primary border-b-2 border-primary'
                  : 'bg-bg-secondary text-text-secondary hover:text-primary'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('press-releases')}
              className={`px-6 py-3 rounded-t-lg font-body font-medium transition-colors duration-200 ${
                activeTab === 'press-releases'
                  ? 'bg-white text-primary border-b-2 border-primary'
                  : 'bg-bg-secondary text-text-secondary hover:text-primary'
              }`}
            >
              Press Releases
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'press-releases' ? (
          <PressReleaseAdmin />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <Card className="p-6 lg:col-span-1">
            <h2 className="font-heading font-semibold text-2xl text-primary mb-6">
              Upload Documents
            </h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="font-body text-sm font-medium text-text-primary mb-1 block">
                  PDF Files <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => setUploadForm({
                    ...uploadForm,
                    files: e.target.files
                  })}
                  className="w-full px-4 py-2 border border-border rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="font-body text-xs text-text-muted mt-1">
                  {uploadForm.files?.length || 0} file{uploadForm.files?.length !== 1 ? 's' : ''} selected
                </p>
              </div>

              <div>
                <label className="font-body text-sm font-medium text-text-primary mb-1 block">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({
                    ...uploadForm,
                    category: e.target.value
                  })}
                  className="w-full px-4 py-2 border border-border rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="gcf">GCF Document</option>
                  <option value="policy">Policy & Regulation</option>
                </select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Documents'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-bg-secondary rounded-md">
              <p className="font-body text-xs text-text-secondary">
                <strong>Note:</strong> Display names are automatically extracted from filenames.
                You can upload one or multiple files at once. All files will be assigned to the same category.
                Max 50 files at once.
              </p>
            </div>
          </Card>

          {/* Document List */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="font-heading font-semibold text-2xl text-primary mb-6">
              Documents ({manifest?.gcf.length && manifest?.policy.length
                ? manifest.gcf.length + manifest.policy.length
                : 0})
            </h2>

            {!manifest ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 font-body text-text-secondary text-sm">Loading documents...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {[...manifest?.gcf, ...manifest?.policy]?.length === 0 ? (
                  <p className="font-body text-text-secondary text-center py-8">
                    No documents uploaded yet
                  </p>
                ) : (
                  [...manifest?.gcf, ...manifest?.policy]?.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start justify-between p-4 bg-bg-secondary rounded-md"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            doc.category === 'gcf' ? 'bg-primary-light text-white' : 'bg-secondary text-white'
                          }`}>
                            {doc.category === 'gcf' ? 'GCF' : 'Policy'}
                          </span>
                          <span className="font-heading font-medium text-primary text-sm truncate">
                            {doc.displayName}
                          </span>
                        </div>
                        <div className="font-body text-xs text-text-muted space-x-3">
                          <span>{formatFileSize(doc.size)}</span>
                          <span>{formatDate(doc.modified)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                        title="Delete document"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        </div>
        )}
      </div>
    </div>
  )
}

export default Admin
