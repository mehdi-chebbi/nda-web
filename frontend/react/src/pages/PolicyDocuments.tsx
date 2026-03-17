import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowRight, Search, Filter } from 'lucide-react'
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

const PolicyDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPolicyDocuments()
  }, [])

  const fetchPolicyDocuments = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/docs/manifest.json')
      const policyDocs = response.data.policy || []
      setDocuments(policyDocs)
      setError('')
    } catch (err) {
      console.error('Error fetching policy documents:', err)
      setError('Failed to load policy documents. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter(doc =>
    doc.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  return (
    <div className="min-h-screen bg-bg-primary">
      <style>{`
        .flip-card {
          perspective: 1000px;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-sm border border-secondary/40 mb-6">
              <FileText className="w-5 h-5 text-secondary-light mr-2" />
              <span className="text-sm font-semibold tracking-wider uppercase">Policy Documents</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Policy Framework
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Access comprehensive policy documents and regulatory frameworks governing Eritrea's climate initiatives
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search policy documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl font-body text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted shadow-sm"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 blur-2xl rounded-full animate-pulse" />
                <div className="relative inline-block h-16 w-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
              <p className="mt-6 font-body text-xl text-text-secondary font-medium">
                Loading policy documents...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-8 rounded-xl font-body text-base text-center max-w-2xl mx-auto shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <p className="font-semibold text-lg mb-2">Unable to Load Documents</p>
              <p>{error}</p>
              <button
                onClick={fetchPolicyDocuments}
                className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Documents List */}
          {!loading && !error && (
            <>
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
                    <Filter className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                    {searchTerm ? 'No Matching Documents' : 'No Policy Documents'}
                  </h3>
                  <p className="font-body text-lg text-text-secondary">
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'No policy documents have been uploaded yet. Check back later!'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDocuments.map((doc, index) => (
                    <div
                      key={doc.id}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/30"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Flip Card Container */}
                      <div className="flip-card aspect-[3/4]">
                        <div className="flip-card-inner">
                          {/* Front Side - Thumbnail */}
                          <div className="flip-card-front bg-gradient-to-br from-primary/5 to-primary-light/5">
                            {doc.thumbnail ? (
                              <img
                                src={doc.thumbnail}
                                alt={doc.displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText className="w-16 h-16 text-primary" />
                              </div>
                            )}
                          </div>

                          {/* Back Side - Description */}
                          <div className="flip-card-back bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-6">
                            {doc.description ? (
                              <p className="font-body text-base text-white leading-relaxed text-center">
                                {doc.description}
                              </p>
                            ) : (
                              <p className="font-body text-base text-white/70 italic text-center">
                                No description available
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-heading font-bold text-xl text-primary mb-4 line-clamp-2 group-hover:text-primary-dark transition-colors">
                          {doc.displayName}
                        </h3>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between mb-4 text-xs font-body text-text-muted">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                              Policy
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span>{formatFileSize(doc.size)}</span>
                            <span>{formatDate(doc.modified)}</span>
                          </div>
                        </div>

                        {/* More Details Button */}
                        <Link
                          to={`/gcf-policies/${doc.id}`}
                          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                        >
                          <ArrowRight className="w-5 h-5" />
                          <span>More Details</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default PolicyDocuments