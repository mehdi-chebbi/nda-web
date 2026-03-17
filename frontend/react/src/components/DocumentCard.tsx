import { FileText, Calendar, Download, Trash2, Edit } from 'lucide-react'

interface Document {
  id: string
  name: string
  displayName: string
  size: number
  modified: string
  category: string
  description?: string
}

interface DocumentCardProps {
  document: Document
  onDelete: (id: string) => void
  onUpdate: (document: Document) => void
}

const DocumentCard = ({ document, onDelete, onUpdate }: DocumentCardProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    })
  }

  const handleDownload = () => {
    window.open(`/docs/${document.category}/${document.name}`, '_blank')
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete "${document.displayName}"?`)) {
      onDelete(document.id)
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'policy': 'Policy Document',
      'project-readiness': 'Project Readiness',
      'templates': 'Template',
      'deliverable': 'Deliverable',
      'gcf': 'GCF Document'
    }
    return labels[category] || 'Document'
  }

  const getCategoryStyles = (category: string) => {
    const styles: { [key: string]: string } = {
      'policy': 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20',
      'project-readiness': 'bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary border border-secondary/20',
      'templates': 'bg-gradient-to-r from-blue-500/20 to-blue-400/10 text-blue-600 border border-blue-500/20',
      'deliverable': 'bg-gradient-to-r from-purple-500/20 to-purple-400/10 text-purple-600 border border-purple-500/20',
      'gcf': 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20'
    }
    return styles[category] || 'bg-gradient-to-r from-gray-200/20 to-gray-100/10 text-gray-600 border border-gray-200/20'
  }

  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-100 hover:border-primary/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl">
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Card Content */}
      <div className="relative p-6">
        {/* Category Badge */}
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryStyles(document.category)}`}
          >
            {getCategoryLabel(document.category)}
          </span>
        </div>

        {/* Document Icon & Title */}
        <div className="mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-text-primary text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {document.displayName}
              </h3>
              <p className="font-body text-xs text-text-muted mt-1 truncate">
                {document.name}
              </p>
            </div>
          </div>
        </div>

        {/* Document Info */}
        <div className="space-y-2 mb-6">
          {document.description && (
            <p className="font-body text-sm text-text-secondary leading-relaxed line-clamp-2">
              {document.description}
            </p>
          )}
          <div className="flex items-center text-text-secondary text-sm">
            <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatFileSize(document.size)}</span>
          </div>
          <div className="flex items-center text-text-secondary text-sm">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatDate(document.modified)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium text-xs hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group-hover:scale-[1.02]"
            title="Download document"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onUpdate(document)}
            className="flex items-center justify-center p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-gray-800 transition-all duration-300 transform hover:-translate-y-0.5"
            title="Edit document"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5"
            title="Delete document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Gradient Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
  )
}

export default DocumentCard
