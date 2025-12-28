import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '../components/Card'
import Input from '../components/Input'
import Select from '../components/Select'

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
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      gcf: 'bg-primary-light text-white',
      policy: 'bg-secondary text-white'
    }
    const labels = {
      gcf: 'GCF',
      policy: 'Policy'
    }
    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${styles[category as keyof typeof styles]}`}>
        {labels[category as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-heading font-bold text-4xl text-primary mb-4">
            Resources & Documents
          </h1>
          <p className="font-body text-text-secondary text-lg">
            Access GCF documents, policies, and regulatory materials related to Eritrea's climate readiness initiatives
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Search Documents"
              type="text"
              placeholder="Search by title or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              label="Filter by Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Documents' },
                { value: 'gcf', label: 'GCF Documents' },
                { value: 'policy', label: 'Policy & Regulation' }
              ]}
            />
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 font-body text-text-secondary">Loading documents...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-body text-text-secondary mb-4">{error}</p>
            <button
              onClick={fetchManifest}
              className="bg-primary text-white px-6 py-2 rounded-md font-body font-medium hover:bg-primary-dark transition-colors"
            >
              Retry
            </button>
          </Card>
        )}

        {/* Document Grid */}
        {!loading && !error && (
          <>
            {filteredDocs.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-text-muted mb-4">
                  <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-xl text-text-primary mb-2">
                  No Documents Found
                </h3>
                <p className="font-body text-text-secondary">
                  {searchTerm || categoryFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No documents are available at this time.'}
                </p>
              </Card>
            ) : (
              <>
                <p className="font-body text-text-secondary mb-6">
                  Showing {filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocs.map((doc) => (
                    <Card key={doc.id} className="p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-3">
                        {getCategoryBadge(doc.category)}
                        <svg className="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>

                      <h3 className="font-heading font-semibold text-lg text-primary mb-2 line-clamp-2">
                        {doc.displayName}
                      </h3>

                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="font-body text-text-muted">Size:</span>
                          <span className="font-body text-text-secondary">{formatFileSize(doc.size)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-body text-text-muted">Added:</span>
                          <span className="font-body text-text-secondary">{formatDate(doc.modified)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(doc)}
                        className="w-full bg-primary text-white py-2 rounded-md font-body font-medium hover:bg-primary-dark transition-colors duration-200"
                      >
                        Download
                      </button>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Resources
