import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from './Card'

interface PressRelease {
  id: number
  title: string
  content: string
  images: string[]
  createdAt: string
  createdBy: string
}

const PressReleaseAdmin = () => {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [uploadForm, setUploadForm] = useState({
    title: '',
    content: '',
    images: [] as File[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchPressReleases()
  }, [])

  const fetchPressReleases = async () => {
    try {
      const response = await axios.get<PressRelease[]>('/api/press-releases')
      setPressReleases(response.data)
      setError('')
    } catch (err) {
      console.error('Error fetching press releases:', err)
      setError('Failed to fetch press releases')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadForm.title || !uploadForm.content) {
      setError('Title and content are required')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('title', uploadForm.title)
      formData.append('content', uploadForm.content)

      uploadForm.images.forEach((image) => {
        formData.append('images', image)
      })

      await axios.post('/api/admin/press-releases', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      setSuccessMessage('Press release created successfully!')
      setUploadForm({ title: '', content: '', images: [] })
      fetchPressReleases()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create press release')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this press release?')) return

    setIsSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`/api/admin/press-releases/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSuccessMessage('Press release deleted successfully!')
      fetchPressReleases()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete press release')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  return (
    <div className="space-y-8">
      {/* Create Press Release Form */}
      <Card className="p-6">
        <h2 className="font-heading font-semibold text-2xl text-primary mb-6">
          Create Press Release
        </h2>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-sm font-medium text-text-primary mb-1 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter press release title"
              required
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-text-primary mb-1 block">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={uploadForm.content}
              onChange={(e) => setUploadForm({ ...uploadForm, content: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[200px]"
              placeholder="Enter press release content"
              required
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-text-primary mb-1 block">
              Images (Optional)
            </label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setUploadForm({ ...uploadForm, images: Array.from(e.target.files) })
                }
              }}
              className="w-full px-4 py-2 border border-border rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="font-body text-xs text-text-muted mt-1">
              {uploadForm.images.length} image{uploadForm.images.length !== 1 ? 's' : ''} selected (PNG, JPEG only)
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-body font-medium px-6 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Press Release'}
          </button>
        </form>
      </Card>

      {/* Press Releases List */}
      <Card className="p-6">
        <h2 className="font-heading font-semibold text-2xl text-primary mb-6">
          Press Releases ({pressReleases.length})
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 font-body text-text-secondary text-sm">Loading press releases...</p>
          </div>
        ) : pressReleases.length === 0 ? (
          <p className="font-body text-text-secondary text-center py-8">
            No press releases yet
          </p>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {pressReleases.map((pr) => (
              <div
                key={pr.id}
                className="p-4 bg-bg-secondary rounded-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-medium text-primary mb-2">
                      {pr.title}
                    </h3>
                    <div className="font-body text-xs text-text-muted space-x-2 mb-2">
                      <span>{formatDate(pr.createdAt)}</span>
                      <span>•</span>
                      <span>{pr.createdBy}</span>
                    </div>
                    {pr.images.length > 0 && (
                      <div className="font-body text-xs text-text-muted mb-2">
                        {pr.images.length} image{pr.images.length !== 1 ? 's' : ''}
                      </div>
                    )}
                    <p className="font-body text-sm text-text-secondary line-clamp-2">
                      {pr.content}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(pr.id)}
                    disabled={isSubmitting}
                    className="ml-4 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete press release"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default PressReleaseAdmin
