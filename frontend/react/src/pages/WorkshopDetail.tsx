import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Play, Calendar, Tag, ArrowLeft, Clock } from 'lucide-react'
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

const WorkshopDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchWorkshop(id)
    }
  }, [id])

  const fetchWorkshop = async (workshopId: string) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/workshops/${workshopId}`)
      setWorkshop(response.data)
      setError('')
    } catch (err) {
      console.error('Error fetching workshop:', err)
      setError('Failed to load workshop. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCreatedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 blur-2xl rounded-full animate-pulse" />
            <div className="relative inline-block h-16 w-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
          <p className="mt-6 font-body text-xl text-text-secondary font-medium">
            Loading workshop...
          </p>
        </div>
      </div>
    )
  }

  if (error || !workshop) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-8 rounded-xl font-body text-base text-center max-w-2xl shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Play className="w-8 h-8 text-red-500" />
          </div>
          <p className="font-semibold text-lg mb-2">Unable to Load Workshop</p>
          <p>{error || 'Workshop not found.'}</p>
          <Link
            to="/workshops"
            className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Workshops</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Breadcrumb/Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/workshops"
            className="inline-flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200 font-body text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workshops</span>
          </Link>
        </div>
      </div>

      {/* Video Player Section */}
      <section className="bg-gray-900 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <video
              src={workshop.video_url}
              controls
              controlsList="nodownload"
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            {workshop.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-200">
            {/* Event Date */}
            <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-body text-sm font-semibold text-primary">
                {formatDate(workshop.event_date)}
              </span>
            </div>

            {/* Created Date */}
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 text-text-muted" />
              <span className="font-body text-sm font-medium text-text-muted">
                Uploaded {formatCreatedDate(workshop.created_at)}
              </span>
            </div>

            {/* Tags */}
            {workshop.tags && workshop.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-text-muted" />
                <div className="flex flex-wrap gap-2">
                  {workshop.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="font-heading text-2xl font-bold text-primary mb-4">
              About This Workshop
            </h2>
            {workshop.description ? (
              <p className="font-body text-lg text-text-secondary leading-relaxed whitespace-pre-wrap">
                {workshop.description}
              </p>
            ) : (
              <p className="font-body text-lg text-text-muted italic">
                No description available for this workshop.
              </p>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <Link
              to="/workshops"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to All Workshops</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default WorkshopDetail
