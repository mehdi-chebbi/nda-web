import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

interface Workshop {
  id: number
  title: string
  content: string
  images: string[]
  createdAt: string
  createdBy: string
}

const WorkshopDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchWorkshop()
  }, [id])

  // Auto-advance slideshow every 4 seconds
  useEffect(() => {
    if (!workshop || workshop.images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % workshop.images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [workshop])

  const fetchWorkshop = async () => {
    if (!id) return

    try {
      const response = await axios.get<Workshop>(`/api/workshops/${id}`)
      setWorkshop(response.data)
      setError('')
    } catch (err) {
      console.error('Error fetching workshop:', err)
      setError('Failed to load workshop')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const goToPrevious = () => {
    if (!workshop) return
    setCurrentImageIndex((prev) => (prev - 1 + workshop.images.length) % workshop.images.length)
  }

  const goToNext = () => {
    if (!workshop) return
    setCurrentImageIndex((prev) => (prev + 1) % workshop.images.length)
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(1.05);
          }
          to {
            opacity: 1;
            transform: scale(1);
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

        .animate-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(13, 74, 46, 0.1);
        }

        .slideshow-image {
          animation: slideIn 0.5s ease-out;
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

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light/30 to-primary/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative inline-block h-16 w-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
            <p className="mt-6 font-body text-xl text-text-secondary font-medium">
              Loading workshop...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="glass-card rounded-3xl p-12 text-center shadow-2xl max-w-2xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-heading text-2xl font-bold text-primary mb-3">
              Oops! Something went wrong
            </h3>
            <p className="font-body text-text-secondary mb-8 text-lg">{error}</p>
            <Link
              to="/workshops"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Back to Workshops
            </Link>
          </div>
        </div>
      ) : !workshop ? (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="glass-card rounded-3xl p-12 text-center shadow-2xl max-w-2xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-heading text-2xl font-bold text-primary mb-3">
              Workshop Not Found
            </h3>
            <p className="font-body text-text-secondary mb-8 text-lg">
              The workshop you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/workshops"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Back to Workshops
            </Link>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Hero Section with Background Image */}
          <section className="hero-gradient py-8 md:py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="animate-in">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1.5 rounded-full bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 text-yellow-300 text-xs font-semibold tracking-wider uppercase">
                    Workshop
                  </span>
                  <span className="inline-block px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold">
                    {formatDate(workshop.createdAt)}
                  </span>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {workshop.title}
                </h1>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Slideshow */}
              {workshop.images.length > 0 && (
                <div className="mb-8 animate-in max-w-[730px] mx-auto" style={{ animationDelay: '0.2s' }}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black h-[480px]">
                    {/* Image */}
                    <img
                      key={currentImageIndex}
                      src={`/workshop-imgs/${workshop.images[currentImageIndex]}`}
                      alt={`${workshop.title} ${currentImageIndex + 1}`}
                      className="slideshow-image w-full h-full object-cover"
                    />

                    {/* Navigation Arrows */}
                    {workshop.images.length > 1 && (
                      <>
                        <button
                          onClick={goToPrevious}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                          aria-label="Previous image"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={goToNext}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                          aria-label="Next image"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Dots Indicator */}
                    {workshop.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {workshop.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => goToImage(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              idx === currentImageIndex
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Image Counter */}
                    {workshop.images.length > 1 && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-semibold">
                        {currentImageIndex + 1} / {workshop.images.length}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="glass-card rounded-2xl p-8 md:p-12 shadow-xl animate-in" style={{ animationDelay: '0.4s' }}>
                <div className="prose prose-lg max-w-none">
                  {workshop.content.split('\n').map((paragraph, idx) => (
                    paragraph.trim() && (
                      <p key={idx} className="font-body text-text-secondary leading-relaxed mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>

              {/* Back Button */}
              <div className="mt-8 animate-in" style={{ animationDelay: '0.6s' }}>
                <Link
                  to="/workshops"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light transition-colors duration-200 group"
                >
                  <svg
                    className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Workshops
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default WorkshopDetail
