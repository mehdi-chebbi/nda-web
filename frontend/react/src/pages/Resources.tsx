import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

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

const Resources = () => {
  const observerTarget = useRef<HTMLDivElement>(null)
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observerTarget.current
        .querySelectorAll('.animate-on-scroll')
        .forEach((el) => observer.observe(el))
    }

    return () => observer.disconnect()
  }, [filteredDocs])

  useEffect(() => {
    fetchManifest()
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [manifest, searchTerm, categoryFilter])

  const fetchManifest = async () => {
    try {
      const response = await axios.get<Manifest>('/docs/manifest.json')
      setManifest(response.data)
      setError('')
    } catch (err) {
      setError('Failed to load documents. Please try again later.')
      console.error('Error fetching manifest:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterDocuments = () => {
    if (!manifest) return

    let docs = [
      ...(manifest?.gcf || []).map(doc => ({ ...doc, category: 'gcf' })),
      ...(manifest?.policy || []).map(doc => ({ ...doc, category: 'policy' }))
    ]

    // Filter by category
    if (categoryFilter !== 'all') {
      docs = docs.filter(doc => doc.category === categoryFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      docs = docs.filter(
        doc =>
          doc.displayName.toLowerCase().includes(term) ||
          doc.name.toLowerCase().includes(term)
      )
    }

    // Sort by modified date (newest first)
    docs.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())

    setFilteredDocs(docs)
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
      day: 'numeric'
    })
  }

  const handleDownload = (doc: Document) => {
    window.open(`/docs/${doc.category}/${doc.name}`, '_blank')
  }

  const getCategoryBadge = (category: string) => {
    const styles = {
      gcf: 'bg-gradient-to-br from-primary-light/20 to-primary/20 backdrop-blur-sm border border-primary-light/40',
      policy: 'bg-gradient-to-br from-secondary/20 to-secondary/40 backdrop-blur-sm border border-secondary/40'
    }
    const textStyles = {
      gcf: 'text-primary-light',
      policy: 'text-secondary'
    }
    const labels = {
      gcf: 'GCF',
      policy: 'Policy'
    }
    return (
      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase ${styles[category as keyof typeof styles]} ${textStyles[category as keyof typeof textStyles]}`}>
        {labels[category as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="w-full relative overflow-x-hidden">
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-on-scroll {
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          animation: slide-up 0.8s ease-out forwards;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }

        .glass-card {
          background: linear-gradient(135deg, rgba(13, 74, 46, 0.1) 0%, rgba(13, 74, 46, 0.05) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(13, 74, 46, 0.2);
        }

        .glass-dark {
          background: linear-gradient(135deg, rgba(13, 74, 46, 0.9) 0%, rgba(7, 51, 31, 0.85) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(13, 74, 46, 0.5);
        }

        .gradient-border {
          position: relative;
        }

        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          background: linear-gradient(135deg, #c9a227, #dbb84a, #c9a227);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .gradient-border:hover::before {
          opacity: 1;
        }

        .hero-gradient {
          background: linear-gradient(135deg, #0d1b13 0%, #0d4a2e 25%, #0a1a0f 50%, #156642 75%, #0d1b13 100%);
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: float-up 8s ease-in-out infinite;
        }

        .doc-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .doc-card::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c9a227, #dbb84a);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .doc-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(13, 74, 46, 0.35);
        }

        .doc-card:hover::before {
          transform: scaleX(1);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #c9a227 0%, #dbb84a 100%);
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.9375rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(201, 162, 39, 0.3);
          position: relative;
          overflow: hidden;
          border: none;
          cursor: pointer;
          width: 100%;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #dbb84a 0%, #c9a227 100%);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .btn-primary:hover::before {
          opacity: 1;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(201, 162, 39, 0.4);
        }

        .btn-primary span {
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="floating-orb w-96 h-96 bg-gradient-to-br from-green-600/30 to-green-800/20"
          style={{ top: '-10%', right: '-10%', animationDelay: '0s' }}
        />
        <div
          className="floating-orb w-[500px] h-[500px] bg-gradient-to-br from-yellow-500/20 to-green-700/20"
          style={{ bottom: '-15%', left: '-15%', animationDelay: '2s' }}
        />
        <div
          className="floating-orb w-80 h-80 bg-gradient-to-br from-green-500/25 to-green-600/15"
          style={{ top: '40%', left: '20%', animationDelay: '4s' }}
        />
      </div>

      <div ref={observerTarget} className="relative z-10">
        {/* Hero Section */}
        <section className="hero-gradient min-h-[60vh] flex items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="max-w-4xl">
              <div className="animate-on-scroll mb-6 inline-block">
                <span className="inline-block px-6 py-2 rounded-full bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 text-yellow-300 text-sm font-semibold tracking-wider uppercase">
                  Knowledge Hub
                </span>
              </div>

              <h1 className="animate-on-scroll delay-100 font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Resources & Documents
              </h1>

              <p className="animate-on-scroll delay-200 text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
                Access GCF documents, policies, and regulatory materials related to Eritrea's climate readiness initiatives
              </p>

              <div className="animate-on-scroll delay-300 flex items-center gap-4">
                <div className="h-px w-20 bg-gradient-to-r from-yellow-400 to-transparent" />
                <span className="text-yellow-300 font-medium">Official Repository</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-16 bg-gradient-to-b from-bg-primary to-bg-secondary relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll glass-card rounded-3xl p-8 gradient-border shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-body text-sm font-semibold text-primary mb-2">
                    Search Documents
                  </label>
                  <input
                    type="text"
                    placeholder="Search by title or filename..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-5 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-border rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-body text-sm font-semibold text-primary mb-2">
                    Filter by Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-5 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-border rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer"
                  >
                    <option value="all">All Documents</option>
                    <option value="gcf">GCF Documents</option>
                    <option value="policy">Policy & Regulation</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-on-scroll text-center py-20">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-light/30 to-primary/20 blur-2xl rounded-full animate-pulse" />
                  <div className="relative inline-block h-16 w-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
                <p className="mt-6 font-body text-xl text-text-secondary font-medium">
                  Loading documents...
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-on-scroll glass-card rounded-3xl p-12 text-center shadow-2xl max-w-2xl mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                  Oops! Something went wrong
                </h3>
                <p className="font-body text-text-secondary mb-8 text-lg">
                  {error}
                </p>
                <button
                  onClick={fetchManifest}
                  className="btn-primary"
                >
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Document Grid */}
        {!loading && !error && (
          <section className="py-16 bg-bg-primary relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {filteredDocs.length === 0 ? (
                <div className="animate-on-scroll glass-card rounded-3xl p-16 text-center shadow-2xl max-w-2xl mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
                    <svg className="h-12 w-12 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-primary mb-3">
                    No Documents Found
                  </h3>
                  <p className="font-body text-text-secondary text-lg mb-2">
                    {searchTerm || categoryFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No documents are available at this time.'}
                  </p>
                  <p className="font-body text-text-muted text-sm">
                    Check back later for new resources.
                  </p>
                </div>
              ) : (
                <>
                  <div className="animate-on-scroll mb-8 flex items-center justify-between">
                    <p className="font-body text-text-secondary text-lg">
                      Showing <span className="font-semibold text-primary">{filteredDocs.length}</span> document{filteredDocs.length !== 1 ? 's' : ''}
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent ml-8" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDocs.map((doc, index) => (
                      <div
                        key={doc.id}
                        className={`doc-card animate-on-scroll glass-card rounded-3xl p-6 bg-white/80 backdrop-blur-sm shadow-lg delay-${Math.min((index % 5 + 1) * 100, 500)}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          {getCategoryBadge(doc.category)}
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center flex-shrink-0">
                            <svg className="h-5 w-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>

                        <h3 className="font-heading font-semibold text-xl text-primary mb-4 line-clamp-2 leading-tight">
                          {doc.displayName}
                        </h3>

                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between items-center text-sm bg-bg-primary/50 rounded-lg px-3 py-2">
                            <span className="font-body text-text-muted font-medium flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                              Size
                            </span>
                            <span className="font-body text-text-secondary font-semibold">
                              {formatFileSize(doc.size)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm bg-bg-primary/50 rounded-lg px-3 py-2">
                            <span className="font-body text-text-muted font-medium flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Added
                            </span>
                            <span className="font-body text-text-secondary font-semibold">
                              {formatDate(doc.modified)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownload(doc)}
                          className="btn-primary"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Resources
