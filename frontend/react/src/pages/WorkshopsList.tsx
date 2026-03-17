import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

interface Workshop {
  id: number
  title: string
  content: string
  images: string[]
  createdAt: string
  createdBy: string
}

const WorkshopsList = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWorkshops()
  }, [])

  const fetchWorkshops = async () => {
    try {
      const response = await axios.get<Workshop[]>('/api/workshops')
      setWorkshops(response.data)
      setError('')
    } catch (err) {
      console.error('Error fetching workshops:', err)
      setError('Failed to load workshops')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div className="w-full bg-bg-primary min-h-screen">
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        .workshop-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .workshop-card::before {
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

        .workshop-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(13, 74, 46, 0.35);
        }

        .workshop-card:hover::before {
          transform: scaleX(1);
        }

        .workshop-card:hover .card-image {
          transform: scale(1.05);
        }

        .card-image {
          transition: transform 0.4s ease;
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
      </div>

      {/* Hero Section */}
      <section className="hero-gradient min-h-[40vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="animate-on-scroll">
            <span className="inline-block px-6 py-2 rounded-full bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 text-yellow-300 text-sm font-semibold tracking-wider uppercase mb-6">
              Training & Events
            </span>
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Workshops
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
              Stay informed about the latest workshops, training sessions, and capacity-building events from Eritrea's National Designated Authority
            </p>
            <div className="flex items-center gap-4">
              <div className="h-px w-20 bg-gradient-to-r from-yellow-400 to-transparent" />
              <span className="text-yellow-300 font-medium">Capacity Building Programs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light/30 to-primary/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative inline-block h-16 w-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
              <p className="mt-6 font-body text-xl text-text-secondary font-medium">
                Loading workshops...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                Oops! Something went wrong
              </h3>
              <p className="font-body text-text-secondary mb-8 text-lg">{error}</p>
              <button
                onClick={fetchWorkshops}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
            </div>
          ) : workshops.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-white/50 to-gray-50/50 backdrop-blur-sm rounded-3xl border border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
                <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                No Workshops Yet
              </h3>
              <p className="font-body text-text-secondary text-lg">
                Check back later for upcoming workshops and training sessions
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workshops.map((ws, index) => (
                <Link
                  key={ws.id}
                  to={`/workshops/${ws.id}`}
                  className="workshop-card bg-white rounded-2xl shadow-lg overflow-hidden animate-on-scroll"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  {ws.images.length > 0 && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`/workshop-imgs/${ws.images[0]}`}
                        alt={ws.title}
                        className="card-image w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-br from-primary-light/20 to-primary/20 text-primary-light text-xs font-semibold tracking-wider uppercase">
                        Workshop
                      </span>
                      <span className="font-body text-xs text-text-muted">
                        {formatDate(ws.createdAt)}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-primary mb-3 line-clamp-2">
                      {ws.title}
                    </h3>

                    <p className="font-body text-text-secondary text-sm line-clamp-3 mb-4">
                      {truncateContent(ws.content, 150)}
                    </p>

                    <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                      <span>Read More</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default WorkshopsList
