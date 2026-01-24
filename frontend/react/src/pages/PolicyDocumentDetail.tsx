import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FileText, Download, ArrowLeft, Calendar, HardDrive, Tag } from 'lucide-react'
import axios from 'axios'

interface Document {
  id: string
  name: string
  display_name: string
  category: string
  size: number
  modified: string
  description?: string
}

const PolicyDocumentDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchDocument(id)
    }
  }, [id])

  const fetchDocument = async (docId: string) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/documents/${docId}`)
      setDocument(response.data)
      setError('')
    } catch (err) {
      console.error('Error fetching document:', err)
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Document not found. It may have been removed or the ID is incorrect.')
      } else {
        setError('Failed to load document details. Please try again later.')
      }
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
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCategory = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const handleDownload = () => {
    if (document) {
      window.open(`/docs/${document.category}/${document.name}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/gcf-policies"
            className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Policy Documents</span>
          </Link>
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-sm border border-secondary/40 mb-6">
              <FileText className="w-5 h-5 text-secondary-light mr-2" />
              <span className="text-sm font-semibold tracking-wider uppercase">Policy Document</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
              {document ? document.display_name : 'Loading...'}
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 blur-2xl rounded-full animate-pulse" />
                <div className="relative inline-block h-16 w-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
              <p className="mt-6 font-body text-xl text-text-secondary font-medium">
                Loading document details...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-8 rounded-xl font-body text-base text-center max-w-2xl mx-auto shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <p className="font-semibold text-lg mb-2">Unable to Load Document</p>
              <p>{error}</p>
              <Link
                to="/gcf-policies"
                className="mt-6 inline-block px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors duration-200"
              >
                Back to Policy Documents
              </Link>
            </div>
          )}

          {/* Document Details */}
          {!loading && !error && document && (
            <div className="max-w-4xl mx-auto">
              {/* Main Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                {/* Icon Area */}
                <div className="bg-gradient-to-br from-primary/5 to-primary-light/5 p-12 flex items-center justify-center">
                  <FileText className="w-24 h-24 text-primary" />
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                  {/* Title */}
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-8">
                    {document.display_name}
                  </h2>

                  {/* Description */}
                  {document.description && (
                    <div className="mb-8">
                      <h3 className="font-heading text-xl font-semibold text-primary mb-4">
                        Description
                      </h3>
                      <p className="font-body text-lg text-text-secondary leading-relaxed">
                        {document.description}
                      </p>
                    </div>
                  )}

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Category */}
                    <div className="bg-gradient-to-br from-primary/5 to-primary-light/5 rounded-xl p-6">
                      <div className="flex items-center mb-3">
                        <Tag className="w-5 h-5 text-primary mr-2" />
                        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                          Category
                        </span>
                      </div>
                      <p className="font-heading text-lg font-semibold text-primary">
                        {formatCategory(document.category)}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="bg-gradient-to-br from-primary/5 to-primary-light/5 rounded-xl p-6">
                      <div className="flex items-center mb-3">
                        <Calendar className="w-5 h-5 text-primary mr-2" />
                        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                          Date Modified
                        </span>
                      </div>
                      <p className="font-heading text-lg font-semibold text-primary">
                        {formatDate(document.modified)}
                      </p>
                    </div>

                    {/* Size */}
                    <div className="bg-gradient-to-br from-primary/5 to-primary-light/5 rounded-xl p-6">
                      <div className="flex items-center mb-3">
                        <HardDrive className="w-5 h-5 text-primary mr-2" />
                        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                          File Size
                        </span>
                      </div>
                      <p className="font-heading text-lg font-semibold text-primary">
                        {formatFileSize(document.size)}
                      </p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-6 h-6" />
                    <span className="text-lg">Download Document</span>
                  </button>
                </div>
              </div>

              {/* Back Button (Mobile Friendly) */}
              <div className="mt-8 text-center md:hidden">
                <Link
                  to="/gcf-policies"
                  className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-primary border-2 border-primary rounded-xl font-semibold transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span>Back to Policy Documents</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default PolicyDocumentDetail
