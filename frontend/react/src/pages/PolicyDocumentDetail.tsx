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
  thumbnail?: string
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
                {/* Thumbnail and Content */}
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail Area - Left Side */}
                  <div className="w-full md:w-3/5 bg-gradient-to-br from-primary/5 to-primary-light/5 p-6 flex items-center justify-center">
                    {document.thumbnail ? (
                      <img
                        src={document.thumbnail}
                        alt={document.display_name}
                        className="w-full h-auto rounded-lg shadow-lg"
                        onError={(e) => {
                          // Fallback to icon if thumbnail fails to load
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const fallback = target.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full aspect-[3/4] flex items-center justify-center ${document.thumbnail ? 'hidden' : 'flex'}`}
                    >
                      <FileText className="w-32 h-32 text-primary" />
                    </div>
                  </div>

                  {/* Content - Right Side */}
                  <div className="w-full md:w-3/5 p-8 md:p-12">
                    {/* Title */}
                    <h2 className="font-heading text-lg font-bold text-primary mb-8">
                      {document.display_name}
                    </h2>

                    {/* Description */}
                    {document.description && (
                      <div className="mb-8 bg-gray-50 p-4 rounded-xl">
                        <h3 className="font-heading text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
                          Description
                        </h3>
                        <p className="font-body text-base text-text-secondary leading-relaxed">
                          {document.description}
                        </p>
                      </div>
                    )}

                    {/* Metadata Grid - Ultra Compact */}
                    <div className="flex flex-row justify-between gap-2 mb-4">
                      {/* Category */}
                      <div className="flex-1 flex flex-col items-start">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Tag className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Category
                          </span>
                        </div>
                        <p className="font-heading text-xs font-semibold text-primary">
                          {formatCategory(document.category)}
                        </p>
                      </div>

                      {/* Date */}
                      <div className="flex-1 flex flex-col items-start">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Added
                          </span>
                        </div>
                        <p className="font-heading text-xs font-semibold text-primary">
                          {formatDate(document.modified)}
                        </p>
                      </div>

                      {/* Size */}
                      <div className="flex-1 flex flex-col items-start">
                        <div className="flex items-center gap-1 mb-0.5">
                          <HardDrive className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Size
                          </span>
                        </div>
                        <p className="font-heading text-xs font-semibold text-primary">
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