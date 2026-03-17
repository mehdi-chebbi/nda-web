import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Calendar, FileText, ExternalLink } from 'lucide-react'
import axios from 'axios'

interface Document {
  id: string
  name: string
  displayName: string
  size: number
  modified: string
  category: string
  thumbnail?: string
  description?: string
}

const PolicyDocumentDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDocument()
  }, [id])

  const fetchDocument = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/docs/manifest.json')
      const allDocs = [
        ...(response.data.policy || []),
      ]
      const foundDoc = allDocs.find((doc: Document) => doc.id === id)

      if (foundDoc) {
        setDocument(foundDoc)
        setError('')
      } else {
        setError('Document not found')
      }
    } catch (err) {
      console.error('Error fetching document:', err)
      setError('Failed to load document details. Please try again later.')
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

  const handleDownload = () => {
    if (document) {
      window.open(`/docs/${document.category}/${document.name}`, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 blur-2xl rounded-full animate-pulse" />
          <div className="relative inline-block h-20 w-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-8 py-12 rounded-2xl font-body text-base text-center max-w-2xl mx-auto shadow-lg">
          <FileText className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <p className="font-semibold text-lg mb-2">Unable to Load Document</p>
          <p>{error}</p>
          <Link
            to="/gcf-policies"
            className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Documents</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">


      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Link
          to="/gcf-policies"
          className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Policy Documents</span>
        </Link>
      </div>

      {/* Document Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Thumbnail */}
          <div className="max-w-sm mx-auto lg:mx-0">
            <div className="aspect-[3/4] bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {document.thumbnail ? (
                <img
                  src={document.thumbnail}
                  alt={document.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary-light/5">
                  <FileText className="w-24 h-24 text-primary" />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-4">
                Policy
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">
                {document.displayName}
              </h1>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h3 className="font-heading text-xl font-bold text-primary mb-4">Description</h3>
              <p className="font-body text-base text-text-secondary leading-relaxed">
                {document.description || 'No description available for this document.'}
              </p>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <div className="flex items-center space-x-2 text-text-muted text-xs uppercase tracking-wider mb-1">
                  <FileText className="w-4 h-4" />
                  <span>File Size</span>
                </div>
                <p className="font-semibold text-lg text-primary">{formatFileSize(document.size)}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <div className="flex items-center space-x-2 text-text-muted text-xs uppercase tracking-wider mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Last Modified</span>
                </div>
                <p className="font-semibold text-lg text-primary">{formatDate(document.modified)}</p>
              </div>
            </div>


            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              <Download className="w-6 h-6" />
              <span>Download Document</span>
              <ExternalLink className="w-5 h-5" />
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PolicyDocumentDetail
