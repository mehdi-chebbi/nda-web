import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText, Newspaper, Search, LogOut, Sparkles, Video, Upload, Trash2 } from 'lucide-react'
import axios from 'axios'
import Modal from '../components/Modal'
import AddNewsModal from '../components/AddNewsModal'
import UpdateDocumentModal from '../components/UpdateDocumentModal'
import UpdateNewsModal from '../components/UpdateNewsModal'
import DocumentCard from '../components/DocumentCard'
import NewsCard from '../components/NewsCard'

interface Document {
  id: string
  name: string
  displayName: string
  size: number
  modified: string
  category: string
  description?: string
}

interface PressRelease {
  id: number
  title: string
  content: string
  images: string[]
  createdAt: string
  createdBy: string
}

interface Workshop {
  id: string
  title: string
  description: string
  video_filename: string
  video_url: string
  event_date: string | null
  tags: string[]
  created_at: string
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [documents, setDocuments] = useState<Document[]>([])
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'documents' | 'news' | 'workshops'>('documents')
  const [searchTerm, setSearchTerm] = useState('')

  // Modal states
  const [addNewsModalOpen, setAddNewsModalOpen] = useState(false)
  const [updateDocumentModalOpen, setUpdateDocumentModalOpen] = useState(false)
  const [updateNewsModalOpen, setUpdateNewsOpen] = useState(false)
  const [addWorkshopModalOpen, setAddWorkshopModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [selectedNews, setSelectedNews] = useState<PressRelease | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
      fetchDocuments()
      fetchPressReleases()
      fetchWorkshops()
    }
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/admin/documents', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const allDocs = [
        ...(response.data.policy || []).map((doc: Document) => ({ ...doc, category: 'policy' })),
        ...(response.data['project-readiness'] || []).map((doc: Document) => ({ ...doc, category: 'project-readiness' })),
        ...(response.data.templates || []).map((doc: Document) => ({ ...doc, category: 'templates' })),
        ...(response.data.deliverable || []).map((doc: Document) => ({ ...doc, category: 'deliverable' }))
      ]
      setDocuments(allDocs)
    } catch (err) {
      console.error('Error fetching documents:', err)
      setError('Failed to fetch documents')
    } finally {
      setLoading(false)
    }
  }

  const fetchPressReleases = async () => {
    try {
      setLoading(true)
      const response = await axios.get<PressRelease[]>('/api/press-releases')
      setPressReleases(response.data)
    } catch (err) {
      console.error('Error fetching Workshops:', err)
      setError('Failed to fetch Workshops')
    } finally {
      setLoading(false)
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
        fetchPressReleases()
        fetchWorkshops()
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
    setDocuments([])
    setPressReleases([])
    setWorkshops([])
    setLoginForm({ username: '', password: '' })
  }

  const handleDeleteDocument = async (id: string) => {
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

  const handleDeleteNews = async (id: number) => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`/api/admin/press-releases/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSuccessMessage('Work shop deleted successfully!')
      fetchPressReleases()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Delete failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDocument = (document: Document) => {
    setSelectedDocument(document)
    setUpdateDocumentModalOpen(true)
  }

  const handleUpdateNews = (news: PressRelease) => {
    setSelectedNews(news)
    setUpdateNewsOpen(true)
  }

  const fetchWorkshops = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/admin/workshops', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWorkshops(response.data)
    } catch (err) {
      console.error('Error fetching workshops:', err)
      setError('Failed to fetch workshops')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWorkshop = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`/api/admin/workshops/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSuccessMessage('Workshop deleted successfully!')
      fetchWorkshops()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Delete failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter documents and news based on search term
  const filteredDocuments = documents.filter(doc =>
    doc.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredNews = pressReleases.filter(pr =>
    pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredWorkshops = workshops.filter(workshop =>
    workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        {/* Login Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-primary mb-2">
              Admin Panel
            </h1>
            <p className="font-body text-text-secondary">
              Welcome back! Please sign in to continue
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 font-body text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-bg-secondary border-2 border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted"
                required
              />
            </div>

            <div>
              <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-bg-secondary border-2 border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted"
                required
              />
            </div>

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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl text-primary">
                  Admin Dashboard
                </h1>
                <p className="font-body text-sm text-text-secondary">
                  Manage your content
                </p>
              </div>
            </div>

            {/* Right: Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all duration-200 hover:shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-6 py-4 rounded-xl font-body text-sm animate-in fade-in slide-in-from-top-2 duration-300">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl font-body text-sm animate-in fade-in slide-in-from-top-2 duration-300">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-white rounded-2xl p-2 shadow-lg">
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-body font-semibold text-base transition-all duration-300 ${
                activeTab === 'documents'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-primary hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Documents</span>
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs ${
                activeTab === 'documents' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {documents.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-body font-semibold text-base transition-all duration-300 ${
                activeTab === 'news'
                  ? 'bg-secondary text-white shadow-md'
                  : 'text-text-secondary hover:text-secondary hover:bg-gray-50'
              }`}
            >
              <Newspaper className="w-5 h-5" />
              <span>Workshops</span>
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs ${
                activeTab === 'news' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {pressReleases.length}
              </span>
            </button>
            
          </div>
        </div>

        {/* Search Bar & Add Button */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder={activeTab === 'documents' ? 'Search documents...' : 'Search news...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted"
            />
          </div>

          {activeTab === 'documents' ? (
            <Link
              to="/admin/upload-documents"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span>Add Documents</span>
            </Link>
          ) : activeTab === 'news' ? (
            <button
              onClick={() => setAddNewsModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-secondary to-secondary/80 hover:to-secondary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span>Add Workshop</span>
            </button>
          ) : (
            <button
              onClick={() => setAddWorkshopModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-dark to-primary hover:to-primary-dark text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Upload className="w-5 h-5" />
              <span>Add Workshop</span>
            </button>
          )}
        </div>

        {/* Documents Tab Content */}
        {activeTab === 'documents' && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 blur-2xl rounded-full animate-pulse" />
                  <div className="relative inline-block h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
                <p className="mt-6 font-body text-xl text-text-secondary font-medium">Loading documents...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl mb-6">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-heading font-semibold text-2xl text-text-primary mb-2">
                  {searchTerm ? 'No documents found' : 'No documents yet'}
                </h3>
                <p className="font-body text-text-secondary mb-8">
                  {searchTerm
                    ? 'Try a different search term'
                    : 'Get started by uploading your first document'}
                </p>
                {!searchTerm && (
                  <Link
                    to="/admin/upload-documents"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Upload Your First Document</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onDelete={handleDeleteDocument}
                    onUpdate={handleUpdateDocument}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* News Tab Content */}
        {activeTab === 'news' && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/10 blur-2xl rounded-full animate-pulse" />
                  <div className="relative inline-block h-12 w-12 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                </div>
                <p className="mt-6 font-body text-xl text-text-secondary font-medium">Loading Workshop...</p>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl mb-6">
                  <Newspaper className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-heading font-semibold text-2xl text-text-primary mb-2">
                  {searchTerm ? 'No Workshop found' : 'No Workshop yet'}
                </h3>
                <p className="font-body text-text-secondary mb-8">
                  {searchTerm
                    ? 'Try a different search term'
                    : 'Get started by publishing your first news article'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setAddNewsModalOpen(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-secondary to-secondary/80 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Publish Your First Workshop</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((pr) => (
                  <NewsCard
                    key={pr.id}
                    {...pr}
                    onDelete={handleDeleteNews}
                    onUpdate={handleUpdateNews}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Workshops Tab Content */}
        {activeTab === 'workshops' && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/20 to-primary-dark/10 blur-2xl rounded-full animate-pulse" />
                  <div className="relative inline-block h-12 w-12 border-4 border-primary-dark/30 border-t-primary-dark rounded-full animate-spin" />
                </div>
                <p className="mt-6 font-body text-xl text-text-secondary font-medium">Loading workshops...</p>
              </div>
            ) : filteredWorkshops.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl mb-6">
                  <Video className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-heading font-semibold text-2xl text-text-primary mb-2">
                  {searchTerm ? 'No workshops found' : 'No workshops yet'}
                </h3>
                <p className="font-body text-text-secondary mb-8">
                  {searchTerm
                    ? 'Try a different search term'
                    : 'Get started by uploading your first workshop video'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setAddWorkshopModalOpen(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-dark to-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload Your First Workshop</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkshops.map((workshop) => (
                  <div key={workshop.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/30">
                    {/* Video Preview */}
                    <div className="relative aspect-video bg-gray-900">
                      <video
                        src={workshop.video_url}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                        onMouseEnter={(e) => {
                          const video = e.target as HTMLVideoElement
                          try {
                            if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
                              video.currentTime = 0
                              video.play().catch(err => {
  console.error(err)
                              })
                            }
                          } catch (err) {
  console.error(err)
                          }
                        }}
                        onMouseLeave={(e) => {
                          const video = e.target as HTMLVideoElement
                          try {
                            video.pause()
                            video.currentTime = 0
                          } catch (err) {
  console.error(err)
                          }
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="font-heading font-bold text-lg text-primary mb-2 line-clamp-2">
                        {workshop.title}
                      </h4>

                      {/* Tags */}
                      {workshop.tags && workshop.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {workshop.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                            >
                              {tag}
                            </span>
                          ))}
                          {workshop.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-text-muted text-xs font-semibold">
                              +{workshop.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteWorkshop(workshop.id)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium text-sm transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Workshop</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={addWorkshopModalOpen}
        onClose={() => setAddWorkshopModalOpen(false)}
        title="Upload Workshop Video"
      >
        <div className="space-y-4">
          <form onSubmit={async (e) => {
            e.preventDefault()
            const formData = new FormData()
            const videoInput = (e.target as HTMLFormElement).querySelector('#workshop-video') as HTMLInputElement
            const titleInput = (e.target as HTMLFormElement).querySelector('#workshop-title') as HTMLInputElement
            const descriptionInput = (e.target as HTMLFormElement).querySelector('#workshop-description') as HTMLTextAreaElement
            const eventDateInput = (e.target as HTMLFormElement).querySelector('#workshop-event-date') as HTMLInputElement
            const tagsInput = (e.target as HTMLFormElement).querySelector('#workshop-tags') as HTMLInputElement

            if (videoInput.files && videoInput.files[0]) {
              formData.append('video', videoInput.files[0])
            }
            formData.append('title', titleInput.value)
            formData.append('description', descriptionInput.value)
            formData.append('eventDate', eventDateInput.value)
            formData.append('tags', tagsInput.value)

            try {
              setLoading(true)
              const token = localStorage.getItem('adminToken')
              await axios.post('/api/admin/workshops', formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data'
                }
              })
              setSuccessMessage('Workshop uploaded successfully!')
              fetchWorkshops()
              setAddWorkshopModalOpen(false)
              setTimeout(() => setSuccessMessage(''), 5000)
            } catch (err: any) {
              setError(err.response?.data?.error || 'Upload failed. Please try again.')
            } finally {
              setLoading(false)
            }
          }}>
            <div>
              <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
                Video File *
              </label>
              <input
                type="file"
                id="workshop-video"
                accept="video/*"
                required
                className="w-full px-4 py-3 bg-bg-secondary border-2 border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>

            <div>
              <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
                Title *
              </label>
              <input
                type="text"
                id="workshop-title"
                placeholder="Enter workshop title"
                required
                className="w-full px-4 py-3 bg-bg-secondary border-2 border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted"
              />
            </div>

            <div>
              <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
                Description
              </label>
              <textarea
                id="workshop-description"
                placeholder="Enter workshop description"
                rows={4}
                className="w-full px-4 py-3 bg-bg-secondary border-2 border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted resize-none"
              />
            </div>

            <div>
              <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
                Event Date
              </label>
              <input
                type="date"
                id="workshop-event-date"
                className="w-full px-4 py-3 bg-bg-secondary border-2 border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>

            <div>
              <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="workshop-tags"
                placeholder="e.g., climate, training, 2024"
                className="w-full px-4 py-3 bg-bg-secondary border-2 border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted"
              />
              <p className="text-xs text-text-muted mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-dark to-primary hover:to-primary-dark text-white font-body font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
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
                  <span>Upload Workshop</span>
                </>
              )}
            </button>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={addNewsModalOpen}
        onClose={() => setAddNewsModalOpen(false)}
        title="Publish News"
      >
        <AddNewsModal
          onClose={() => setAddNewsModalOpen(false)}
          onSuccess={() => {
            fetchPressReleases()
            setSuccessMessage('News published successfully!')
            setTimeout(() => setSuccessMessage(''), 5000)
          }}
        />
      </Modal>

      <Modal
        isOpen={updateDocumentModalOpen}
        onClose={() => setUpdateDocumentModalOpen(false)}
        title="Update Document"
      >
        <UpdateDocumentModal
          isOpen={updateDocumentModalOpen}
          document={selectedDocument!}
          onClose={() => setUpdateDocumentModalOpen(false)}
          onSuccess={() => {
            fetchDocuments()
            setSuccessMessage('Document updated successfully!')
            setTimeout(() => setSuccessMessage(''), 5000)
          }}
        />
      </Modal>

      <Modal
        isOpen={updateNewsModalOpen}
        onClose={() => setUpdateNewsOpen(false)}
        title="Update Work Shop"
      >
        <UpdateNewsModal
          isOpen={updateNewsModalOpen}
          news={selectedNews!}
          onClose={() => setUpdateNewsOpen(false)}
          onSuccess={() => {
            fetchPressReleases()
            setSuccessMessage('Work shop updated successfully!')
            setTimeout(() => setSuccessMessage(''), 5000)
          }}
        />
      </Modal>
    </div>
  )
}

export default Admin
