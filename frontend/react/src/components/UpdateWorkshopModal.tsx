import { useState } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'
import axios from 'axios'

interface UpdateWorkshopModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  workshop: {
    id: number
    title: string
    content: string
    images: string[]
  }
}

const UpdateWorkshopModal = ({ isOpen, onClose, onSuccess, workshop }: UpdateWorkshopModalProps) => {
  const [form, setForm] = useState({
    title: workshop.title,
    content: workshop.content,
    images: [] as File[]
  })
  const [removedExistingImages, setRemovedExistingImages] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const existingImages = workshop.images.filter(img => !removedExistingImages.has(img))

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imageFiles = Array.from(e.dataTransfer.files).filter(f =>
        f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/jpg'
      )
      if (imageFiles.length !== e.dataTransfer.files.length) {
        setError('Only PNG and JPEG images are allowed')
        return
      }
      processNewImages(imageFiles)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setError('')
      processNewImages(Array.from(e.target.files))
    }
  }

  const processNewImages = (newFiles: File[]) => {
    const totalImages = form.images.length + newFiles.length
    if (totalImages > 10) {
      setError('Maximum 10 images allowed')
      return
    }

    // Create previews
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })

    setForm({ ...form, images: [...form.images, ...newFiles] })
  }

  const removeImage = (index: number) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index)
    })
    setPreviewImages(previewImages.filter((_, i) => i !== index))
  }

  const handleRemoveExistingImage = (imageName: string) => {
    setRemovedExistingImages(prev => new Set([...prev, imageName]))
  }

  const handleRestoreExistingImage = (imageName: string) => {
    setRemovedExistingImages(prev => {
      const newSet = new Set(prev)
      newSet.delete(imageName)
      return newSet
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('title', form.title.trim())
      formData.append('content', form.content.trim())

      // Combine existing images (not removed) with new images
      const finalImages = [...existingImages]
      form.images.forEach((image) => {
        formData.append('images', image)
      })

      // Send the list of existing images to keep
      formData.append('keepExistingImages', JSON.stringify(finalImages))

      await axios.put(`/api/admin/workshops/${workshop.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update workshop')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl font-body text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Input */}
        <div>
          <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter workshop title"
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 placeholder:text-text-muted"
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
            Content
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Enter workshop content"
            rows={6}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 placeholder:text-text-muted resize-none"
          />
        </div>

        {/* Image Section */}
        <div>
          <label className="font-body text-sm font-semibold text-text-primary mb-2 block">
            Images
          </label>

          {/* Existing Images */}
          {workshop.images.length > 0 && (
            <div className="mb-4">
              <p className="font-body text-xs text-text-muted mb-2">
                {workshop.images.length} existing image{workshop.images.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-4 gap-3">
                {workshop.images.map((imageName, index) => {
                  const isRemoved = removedExistingImages.has(imageName)
                  return (
                    <div
                      key={index}
                      className={`relative group ${
                        isRemoved
                          ? 'opacity-40 grayscale'
                          : ''
                      }`}
                    >
                      <img
                        src={`/workshop-imgs/${imageName}`}
                        alt={`Existing image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => isRemoved ? handleRestoreExistingImage(imageName) : handleRemoveExistingImage(imageName)}
                        className={`absolute top-1 right-1 p-1.5 rounded-lg transition-all duration-200 ${
                          isRemoved
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        title={isRemoved ? 'Restore image' : 'Remove image'}
                      >
                        {isRemoved ? (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <X size={12} />
                        )}
                      </button>
                      {isRemoved && (
                        <div className="absolute inset-0 bg-green-500/10 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-green-600">Removed</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {removedExistingImages.size > 0 && (
                <p className="font-body text-xs text-orange-600 mt-2">
                  {removedExistingImages.size} image{removedExistingImages.size !== 1 ? 's' : ''} will be deleted on update
                </p>
              )}
            </div>
          )}

          {/* New Images Upload */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
                form.images.length < 10
                  ? 'border-gray-300 hover:border-secondary hover:bg-gray-50 cursor-pointer'
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              multiple
              onChange={handleImageChange}
              disabled={form.images.length >= 10}
              className="absolute inset-0 w-full h-full cursor-pointer disabled:cursor-not-allowed opacity-0"
            />
            <div className="space-y-2">
              <div className={`mx-auto w-14 h-14 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center ${form.images.length >= 10 ? 'opacity-50' : ''}`}>
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-text-primary">
                  Add new images
                </p>
                <p className="font-body text-xs text-text-muted mt-1">
                  PNG, JPEG • Max 10 images total • Max 10MB each
                </p>
              </div>
            </div>
          </div>

          {/* New Image Previews */}
          {previewImages.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              <p className="col-span-4 font-body text-xs font-semibold text-text-primary mb-2">
                New images to add:
              </p>
              {previewImages.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border-2 border-secondary/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:to-secondary text-white font-body font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Updating...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Update Workshop</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default UpdateWorkshopModal
