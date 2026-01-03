import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const cycle = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'navigate' && event.data.path) {
        navigate(event.data.path)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [navigate])

  return (
    <div className="w-full h-screen">
      <iframe
        src="/cycle.html"
        title="cycle"
        className="w-full h-full border-0"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
        }}
      />
    </div>
  )
}

export default cycle
