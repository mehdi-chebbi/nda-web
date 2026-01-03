import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Mission = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Hide scrollbar on parent body when Mission page is mounted
    document.body.style.overflow = 'hidden'

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'navigate' && event.data.path) {
        navigate(event.data.path)
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      // Restore scrollbar when unmounting
      document.body.style.overflow = ''
      window.removeEventListener('message', handleMessage)
    }
  }, [navigate])

  return (
    <div className="w-full" style={{ height: 'calc(100vh - 4rem)' }}>
      <iframe
        src="/mission.html"
        title="mission"
        className="w-full h-full border-0"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  )
}
export default Mission