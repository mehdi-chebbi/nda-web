import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowRight, Search, Filter, ExternalLink, Folder, Layers } from 'lucide-react'
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

// Interface for the Resource Links
interface ResourceLink {
  title: string
  url: string
}

// --- DATA SECTION: YOUR LINKS ---
const RESOURCES_DATA: { category: string; links: ResourceLink[] }[] = [
  {
    category: "Strategic Planning & Overview",
    links: [
      { title: "GCF in Brief: Readiness", url: "https://www.greenclimate.fund/document/gcf-brief-readiness" },
      { title: "Readiness Strategy 2024-2027", url: "https://www.greenclimate.fund/document/readiness-strategy-2024-2027" },
      { title: "Financing Modality for Country Support", url: "https://www.greenclimate.fund/readiness/country-window" },
      { title: "Readiness & Preparatory Financing Modality for DAE Support", url: "https://www.greenclimate.fund/readiness/dae-window" },
      { title: "Revised Readiness Results Management Framework (RRMF)", url: "https://www.greenclimate.fund/document/revised-readiness-results-management-framework-rrmf" },
      { title: "List of FWA holders", url: "https://www.greenclimate.fund/document/list-fwa-holders" },
    ]
  },
  {
    category: "Country Support Templates & Guides",
    links: [
      { title: "Guide for Countries to Access Readiness Support", url: "https://www.greenclimate.fund/document/guide-countries-access-readiness-support" },
      { title: "Guide for Countries on Strategic Planning of Readiness Support", url: "https://www.greenclimate.fund/document/guide-countries-strategic-planning-readiness-support" },
      { title: "Confirmation of Government Designated Agency Letter Template", url: "https://www.greenclimate.fund/document/confirmation-government-designated-agency-letter-template" },
      { title: "Country Readiness TOR Template", url: "https://www.greenclimate.fund/document/country-readiness-tor-template" },
      { title: "Direct Access Proposal Template - Country Support Window", url: "https://www.greenclimate.fund/document/direct-access-proposal-template-country-support-window" },
      { title: "Direct Access Financial Proposal Template", url: "https://www.greenclimate.fund/document/direct-access-financial-proposal-template" },
      { title: "Mini Tender Proposal Template", url: "https://www.greenclimate.fund/document/mini-tender-proposal-template" },
      { title: "Country Outcome Logframe", url: "https://www.greenclimate.fund/document/country-outcome-logframe" },
      { title: "Country and DAE Output Logframe", url: "https://www.greenclimate.fund/document/country-and-dae-output-logframe" },
      { title: "Letter of Financial Support for Multi-Country Proposals", url: "https://www.greenclimate.fund/document/letter-financial-support-multi-country-proposals" },
    ]
  },
  {
    category: "DAE (Direct Access Entity) Support",
    links: [
      { title: "Guide for Direct Access Entities to Access Readiness Support", url: "https://www.greenclimate.fund/document/guide-direct-access-entities-access-readiness-support" },
      { title: "DAE Readiness TOR Template", url: "https://www.greenclimate.fund/document/dae-readiness-tor-template" },
      { title: "Direct Access Proposal Template – DAE Support Window", url: "https://www.greenclimate.fund/document/direct-access-proposal-template-dae-support-window" },
    ]
  },
  {
    category: "Reporting, Audits & Compliance",
    links: [
      { title: "Readiness and Preparatory Support Completion Report Template", url: "https://www.greenclimate.fund/document/readiness-and-preparatory-support-completion-report-template" },
      { title: "Readiness Audit Terms of Reference Template", url: "https://www.greenclimate.fund/document/readiness-audit-terms-reference-template" },
      { title: "Readiness Audit Report Template", url: "https://www.greenclimate.fund/document/readiness-audit-report-template" },
      { title: "Letter of Request for Change of Approved Programme Proposal", url: "https://www.greenclimate.fund/document/letter-request-change-approved-readiness-and-preparatory-support-programme-proposal" },
      { title: "Financial Management Capacity Assessment Template (FMCA)", url: "https://www.greenclimate.fund/document/financial-management-capacity-assessment-template" },
      { title: "Guidance on Standardized Deliverables", url: "https://www.greenclimate.fund/document/guide-standardized-deliverables" },
      { title: "TOR for GCF Liaison Officer", url: "https://www.greenclimate.fund/document/tor-gcf-liaison-officer" },
    ]
  },
  {
    category: "Information Sessions & Events",
    links: [
      { title: "Info Session 1: Overview of Operational Modalities (2024-2027)", url: "https://www.greenclimate.fund/event/information-session-1-operational-modalities-2024-2027-strategy" },
      { title: "Info Session 3: Placement Scheme and Access Modalities", url: "https://www.greenclimate.fund/event/information-session-3-operational-modalities-2024-2027-strategy" },
    ]
  },
  {
    category: "Data Repository",
    links: [
      { title: "Readiness Data Repository", url: "https://data.greenclimate.fund/public/data/readiness" },
    ]
  }
]
// ---------------------------------

const ProjectReadiness = () => {
  const [activeTab, setActiveTab] = useState<'documents' | 'resources'>('documents')
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProjectReadinessDocuments()
  }, [])

  const fetchProjectReadinessDocuments = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/docs/manifest.json')
      const readinessDocs = response.data['project-readiness'] || []
      setDocuments(readinessDocs)
      setError('')
    } catch (err) {
      console.error('Error fetching project readiness documents:', err)
      setError('Failed to load project readiness documents. Please try again later.')
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
        .flip-card-front, .flip-card-back {
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
              <span className="text-sm font-semibold tracking-wider uppercase">Project Readiness</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Resources & Documents
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Access comprehensive frameworks, templates, and GCF-compliant guidelines to support your project readiness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 max-w-md">
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'documents'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Documents</span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'resources'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Resources</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* === DOCUMENTS TAB === */}
          {activeTab === 'documents' && (
            <>
              {/* Search Bar */}
              <div className="mb-8 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search documents..."
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
                  <p className="mt-6 font-body text-xl text-text-secondary font-medium">Loading documents...</p>
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
                    onClick={fetchProjectReadinessDocuments}
                    className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Documents Grid */}
              {!loading && !error && (
                <>
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
                        <Filter className="w-12 h-12 text-primary" />
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                        {searchTerm ? 'No Matching Documents' : 'No Documents Found'}
                      </h3>
                      <p className="font-body text-lg text-text-secondary">
                        {searchTerm ? 'Try adjusting your search terms' : 'No documents have been uploaded yet.'}
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
                              {/* Front Side */}
                              <div className="flip-card-front bg-gradient-to-br from-primary/5 to-primary-light/5">
                                {doc.thumbnail ? (
                                  <img src={doc.thumbnail} alt={doc.displayName} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FileText className="w-16 h-16 text-primary" />
                                  </div>
                                )}
                              </div>
                              {/* Back Side */}
                              <div className="flip-card-back bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-6">
                                {doc.description ? (
                                  <p className="font-body text-base text-white leading-relaxed text-center">{doc.description}</p>
                                ) : (
                                  <p className="font-body text-base text-white/70 italic text-center">No description available</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="font-heading font-bold text-xl text-primary mb-4 line-clamp-2 group-hover:text-primary-dark transition-colors">
                              {doc.displayName}
                            </h3>
                            <div className="flex items-center justify-between mb-4 text-xs font-body text-text-muted">
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                                Document
                              </span>
                              <div className="flex items-center space-x-4">
                                <span>{formatFileSize(doc.size)}</span>
                                <span>{formatDate(doc.modified)}</span>
                              </div>
                            </div>
                            <Link
                              to={`/project-readiness/${doc.id}`}
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
            </>
          )}

          {/* === RESOURCES TAB === */}
          {activeTab === 'resources' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
              <div className="text-center mb-10">
                <h2 className="font-heading text-3xl font-bold text-primary mb-3">External GCF Resources</h2>
                <p className="text-text-secondary text-lg">Official guides, templates, and strategies from the Green Climate Fund.</p>
              </div>

              {RESOURCES_DATA.map((category, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center">
                    <Folder className="w-5 h-5 text-primary mr-3" />
                    <h3 className="font-heading text-lg font-bold text-text-primary">{category.category}</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {category.links.map((link, linkIdx) => (
                      <a
                        key={linkIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-6 py-4 hover:bg-primary/5 transition-colors group"
                      >
                        <span className="font-body text-text-primary group-hover:text-primary transition-colors">
                          {link.title}
                        </span>
                        <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}

export default ProjectReadiness