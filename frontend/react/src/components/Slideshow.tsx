import { useEffect } from 'react'

const Slideshow = () => {
  return (
    <div className="w-full h-screen">
      <iframe
        src="/slideshow.html"
        title="Slideshow"
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

export default Slideshow
