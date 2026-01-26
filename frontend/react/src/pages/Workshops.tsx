import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Play, Calendar, Search, Filter } from 'lucide-react'
import axios from 'axios'

interface Workshop {
  id: string
  title: string
  description: string
  video_filename: string
  video_url: string
  event_date: string | null
  tags: string[]
  created_at: string
}

const Workshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchWorkshops()
  }, [])

  const fetchWorkshops = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/workshops')
      setWorkshops(response.data)
      setError('')
    } catch (err) {
      console.error('Error fetching workshops:', err)
      setError('Failed to load workshops. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkshops = workshops.filter(workshop =>
    workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-sm border border-secondary/40 mb-6">
              <Play className="w-5 h-5 text-secondary-light mr-2" />
              <span className="text-sm font-semibold tracking-wider uppercase">Workshops</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Workshop Videos
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Watch recorded workshops, training sessions, and educational videos on climate readiness and sustainable development
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
                placeholder="Search workshops by title, description, or tags..."
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
                Loading workshops...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-8 rounded-xl font-body text-base text-center max-w-2xl mx-auto shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Play className="w-8 h-8 text-red-500" />
              </div>
              <p className="font-semibold text-lg mb-2">Unable to Load Workshops</p>
              <p>{error}</p>
              <button
                onClick={fetchWorkshops}
                className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Workshops Grid */}
          {!loading && !error && (
            <>
              {filteredWorkshops.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
                    <Filter className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                    {searchTerm ? 'No Matching Workshops' : 'No Workshops'}
                  </h3>
                  <p className="font-body text-lg text-text-secondary">
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'No workshop videos have been uploaded yet. Check back later!'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredWorkshops.map((workshop, index) => (
                    <div
                      key={workshop.id}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/30 flex flex-col"
                    >
                      {/* Video Preview */}
                      <div className="relative aspect-video bg-gray-900 overflow-hidden">
                        <video
                          src={workshop.video_url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                          onMouseEnter={(e) => {
                            const video = e.target as HTMLVideoElement
                            try {
                              if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
                                video.currentTime = 0
                                video.play().catch(err => {
                                  // Ignore play errors (might not be supported or ready)
                                })
                              }
                            } catch (err) {
                              // Ignore errors
                            }
                          }}
                          onMouseLeave={(e) => {
                            const video = e.target as HTMLVideoElement
                            try {
                              video.pause()
                              video.currentTime = 0
                            } catch (err) {
                              // Ignore pause errors
                            }
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLVideoElement
                            target.style.display = 'none'
                          }}
                        />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-heading font-bold text-xl text-primary mb-3 line-clamp-2 group-hover:text-primary-dark transition-colors">
                          {workshop.title}
                        </h3>

                        {/* Description */}
                        {workshop.description && (
                          <p className="font-body text-sm text-text-secondary mb-4 line-clamp-3 flex-1">
                            {workshop.description}
                          </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center justify-between mb-4 text-xs font-body text-text-muted">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(workshop.event_date)}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {workshop.tags && workshop.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {workshop.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                              >
                                {tag}
                              </span>
                            ))}
                            {workshop.tags.length > 3 && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-text-muted text-xs font-semibold">
                                +{workshop.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Watch Now Button */}
                        <Link
                          to={`/workshops/${workshop.id}`}
                          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                        >
                          <Play className="w-5 h-5" />
                          <span>Watch Now</span>
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

export default Workshops
