import { Calendar, User, Trash2, Edit } from 'lucide-react'

interface NewsCardProps {
  id: number
  title: string
  content: string
  images: string[]
  createdAt: string
  createdBy: string
  onDelete: (id: number) => void
  onUpdate: (news: any) => void
}

const NewsCard = ({ id, title, content, images, createdAt, createdBy, onDelete, onUpdate }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id)
    }
  }

  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-100 hover:border-secondary/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl">
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Card Content */}
      <div className="relative p-6">
        {/* Image Preview */}
        {images.length > 0 && (
          <div className="mb-4 -mx-6 -mt-6">
            <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-100 relative overflow-hidden">
              <img
                src={`/news-imgs/${images[0]}`}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                  +{images.length - 1} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Title */}
        <div className="mb-3">
          <h3 className="font-heading font-semibold text-text-primary text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>

        {/* Content Preview */}
        <div className="mb-4">
          <p className="font-body text-sm text-text-secondary line-clamp-3 leading-relaxed">
            {content}
          </p>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-text-secondary text-sm">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center text-text-secondary text-sm">
            <User className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{createdBy}</span>
          </div>
          {images.length > 0 && (
            <div className="flex items-center text-text-secondary text-sm">
              <div className="w-4 h-4 mr-2 flex-shrink-0 bg-secondary/20 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-secondary">IMG</span>
              </div>
              <span className="truncate">{images.length} image{images.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onUpdate({ id, title, content, images })}
            className="flex items-center justify-center p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-gray-800 transition-all duration-300 transform hover:-translate-y-0.5"
            title="Edit news"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-50 text-red-500 rounded-xl font-medium text-sm hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Bottom Gradient Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
  )
}

export default NewsCard
