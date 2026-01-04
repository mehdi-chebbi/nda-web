import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Mission = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Hide scrollbar on parent body when Mission page is mounted
    document.body.style.overflow = 'hidden'

    const handleMessage = (event) => {
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
    <div className="w-full" style={{ height: 'calc(100vh - 4rem)', overflow: 'auto' }}>
      <style>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: linear-gradient(180deg, #0d1b13 0%, #0a1a0f 25%, #0d2819 50%, #0a1a0f 75%, #0d1b13 100%);
            overflow-x: hidden;
            position: relative;
        }

        body::before {
            content: '';
            position: fixed;
            width: 800px;
            height: 800px;
            background: radial-gradient(circle, rgba(13, 74, 46, 0.4) 0%, rgba(21, 102, 66, 0.2) 40%, transparent 70%);
            border-radius: 50%;
            top: -200px;
            right: -200px;
            z-index: 0;
            pointer-events: none;
            animation: float 15s infinite ease-in-out;
        }

        body::after {
            content: '';
            position: fixed;
            width: 1000px;
            height: 1000px;
            background: radial-gradient(circle, rgba(201, 162, 39, 0.2) 0%, rgba(13, 74, 46, 0.15) 40%, transparent 70%);
            border-radius: 50%;
            bottom: -400px;
            left: -400px;
            z-index: 0;
            pointer-events: none;
            animation: float 20s infinite ease-in-out reverse;
        }

        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(150px, -150px) scale(1.1); }
        }

        section {
            position: relative;
            z-index: 1;
        }

        /* Hero Section - Split layout with image */
        .hero {
            min-height: 100vh;
            display: grid;
            grid-template-columns: 1fr;
            gap: 3rem;
            padding: 3rem 2rem;
            align-items: center;
            background: linear-gradient(135deg, rgba(13, 27, 19, 0.6) 0%, rgba(13, 74, 46, 0.3) 100%);
            position: relative;
        }

        @media (min-width: 1024px) {
            .hero {
                grid-template-columns: 1.2fr 1fr;
                padding: 3rem 4rem;
                gap: 4rem;
            }
        }

        .hero-content {
            position: relative;
            z-index: 2;
            order: 2;
        }

        @media (min-width: 1024px) {
            .hero-content {
                order: 1;
            }
        }

        .hero-visual {
            position: relative;
            height: 500px;
            border-radius: 24px;
            overflow: hidden;
            order: 1;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        @media (min-width: 1024px) {
            .hero-visual {
                height: 600px;
                order: 2;
            }
        }

        .hero-visual img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: grayscale(100%);
            transition: transform 0.6s ease;
        }

        .hero:hover .hero-visual img {
            transform: scale(1.05);
        }

        .hero-visual::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(13, 74, 46, 0.6) 0%, rgba(201, 162, 39, 0.3) 100%);
            mix-blend-mode: color;
        }

        .hero-inner {
            max-width: 700px;
            animation: fadeInUp 1s ease-out;
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

        .hero-label {
            display: inline-block;
            padding: 0.5rem 1.5rem;
            background: rgba(201, 162, 39, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(201, 162, 39, 0.3);
            border-radius: 50px;
            color: #dbb84a;
            font-size: 0.875rem;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 2rem;
        }

        .hero-inner h1 {
            font-family: "Playfair Display", Georgia, serif;
            font-size: clamp(2.5rem, 8vw, 4.5rem);
            color: white;
            margin-bottom: 1.5rem;
            line-height: 1.1;
            font-weight: 700;
        }

        .hero-inner p {
            font-size: clamp(1.0625rem, 2vw, 1.25rem);
            margin-bottom: 2.5rem;
            color: rgba(255, 255, 255, 0.85);
            line-height: 1.8;
        }

        .hero-cta {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, #c9a227 0%, #dbb84a 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 30px rgba(201, 162, 39, 0.3);
            position: relative;
            overflow: hidden;
            border: none;
            cursor: pointer;
        }

        .btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #dbb84a 0%, #c9a227 100%);
            opacity: 0;
            transition: opacity 0.4s;
        }

        .btn:hover::before {
            opacity: 1;
        }

        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(201, 162, 39, 0.4);
        }

        .btn span {
            position: relative;
            z-index: 1;
        }

        .btn-outline {
            background: transparent;
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            box-shadow: none;
        }

        .btn-outline:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: white;
        }

        .scroll-indicator {
            position: absolute;
            bottom: 3rem;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
            animation: bounce 2s infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(10px); }
        }

        .scroll-indicator svg {
            width: 30px;
            height: 30px;
            color: rgba(255, 255, 255, 0.6);
        }

        /* Pillars Section - Bento Grid Style */
        .pillars {
            padding: 8rem 2rem;
            background: linear-gradient(180deg, rgba(13, 40, 28, 0.7) 0%, rgba(10, 26, 15, 0.8) 100%);
            position: relative;
        }

        .pillars::after {
            content: '';
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(21, 102, 66, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            top: 20%;
            right: 10%;
            z-index: 0;
            pointer-events: none;
        }

        .pillars::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.3), transparent);
        }

        .section-header {
            text-align: center;
            margin-bottom: 5rem;
            position: relative;
            z-index: 1;
        }

        .section-label {
            display: inline-block;
            padding: 0.5rem 1.5rem;
            background: rgba(13, 74, 46, 0.3);
            border: 1px solid rgba(13, 74, 46, 0.5);
            border-radius: 50px;
            color: #5fc79d;
            font-size: 0.875rem;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
        }

        .section-header h2 {
            font-family: "Playfair Display", Georgia, serif;
            font-size: clamp(2.5rem, 6vw, 4rem);
            color: white;
            margin-bottom: 1.5rem;
            font-weight: 700;
        }

        .section-header p {
            font-size: 1.25rem;
            color: rgba(255, 255, 255, 0.7);
            max-width: 800px;
            margin: 0 auto;
        }

        .pillar-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }

        .pillar-card {
            padding: 3rem;
            background: linear-gradient(135deg, rgba(13, 74, 46, 0.25) 0%, rgba(13, 74, 46, 0.15) 100%);
            border: 1px solid rgba(13, 74, 46, 0.4);
            border-radius: 24px;
            backdrop-filter: blur(10px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .pillar-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #c9a227, #dbb84a);
            transform: scaleX(0);
            transition: transform 0.4s;
        }

        .pillar-card:hover {
            transform: translateY(-8px);
            border-color: rgba(201, 162, 39, 0.6);
            background: linear-gradient(135deg, rgba(13, 74, 46, 0.35) 0%, rgba(13, 74, 46, 0.2) 100%);
            box-shadow: 0 20px 40px rgba(13, 74, 46, 0.3);
        }

        .pillar-card:hover::before {
            transform: scaleX(1);
        }

        .pillar-icon {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #0d4a2e 0%, #156642 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(13, 74, 46, 0.3);
            transition: all 0.4s;
        }

        .pillar-card:hover .pillar-icon {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 15px 40px rgba(201, 162, 39, 0.4);
        }

        .pillar-card h3 {
            font-size: 1.75rem;
            color: white;
            margin-bottom: 1rem;
            font-weight: 600;
        }

        .pillar-card p {
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.8;
            font-size: 1.0625rem;
        }

        /* Vision Section - Split Layout */
        .vision {
            padding: 8rem 2rem;
            background: linear-gradient(180deg, rgba(10, 26, 15, 0.8) 0%, rgba(13, 40, 28, 0.7) 100%);
            position: relative;
        }

        .vision::before {
            content: '';
            position: absolute;
            width: 700px;
            height: 700px;
            background: radial-gradient(circle, rgba(13, 74, 46, 0.25) 0%, rgba(21, 102, 66, 0.1) 50%, transparent 70%);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 0;
            pointer-events: none;
        }

        .vision-container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr;
            gap: 4rem;
            align-items: center;
            position: relative;
            z-index: 1;
        }

        @media (min-width: 1024px) {
            .vision-container {
                grid-template-columns: 1fr 1fr;
            }
        }

        .vision-content h2 {
            font-family: "Playfair Display", Georgia, serif;
            font-size: clamp(2.5rem, 5vw, 3.5rem);
            color: white;
            margin-bottom: 2rem;
            line-height: 1.2;
        }

        .vision-text {
            font-size: 1.125rem;
            line-height: 1.9;
            margin-bottom: 2rem;
            color: rgba(255, 255, 255, 0.8);
        }

        .focus-box {
            background: linear-gradient(135deg, rgba(13, 74, 46, 0.3) 0%, rgba(13, 74, 46, 0.15) 100%);
            padding: 3rem;
            border-radius: 24px;
            border-left: 4px solid #c9a227;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(13, 74, 46, 0.2);
        }

        .focus-box h3 {
            color: #dbb84a;
            font-size: 1.5rem;
            margin-bottom: 2rem;
            font-weight: 600;
        }

        .focus-list {
            display: grid;
            gap: 1.5rem;
        }

        .focus-item {
            display: flex;
            gap: 1rem;
            align-items: start;
            transition: all 0.3s;
            padding: 1rem;
            border-radius: 12px;
        }

        .focus-item:hover {
            background: rgba(201, 162, 39, 0.05);
            transform: translateX(8px);
        }

        .focus-item span {
            color: #c9a227;
            font-weight: 700;
            font-size: 1.25rem;
            flex-shrink: 0;
        }

        .focus-item p {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.7;
        }

        /* Stats Section - Compact */
        .stats-section {
            padding: 5rem 2rem;
            background: linear-gradient(135deg, rgba(13, 74, 46, 0.95) 0%, rgba(21, 102, 66, 0.95) 100%);
            position: relative;
            overflow: hidden;
        }

        .stats-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: -50%;
            width: 200%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(201, 162, 39, 0.15) 0%, transparent 60%);
            animation: pulse 8s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }

        .stats-container {
            max-width: 1400px;
            margin: 0 auto;
            text-align: center;
            position: relative;
            z-index: 1;
        }

        .stats-container h2 {
            font-family: "Playfair Display", Georgia, serif;
            font-size: clamp(2rem, 4vw, 2.75rem);
            color: white;
            margin-bottom: 1rem;
        }

        .stats-container > p {
            font-size: 1.0625rem;
            max-width: 700px;
            margin: 0 auto 3rem;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.7;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .stat-card {
            padding: 1.5rem;
            transition: transform 0.4s;
        }

        .stat-card:hover {
            transform: translateY(-10px);
        }

        .stat-number {
            font-size: clamp(2.5rem, 6vw, 3.5rem);
            font-weight: 800;
            color: #dbb84a;
            margin-bottom: 0.5rem;
            line-height: 1;
            text-shadow: 0 0 30px rgba(201, 162, 39, 0.3);
        }

        .stat-label {
            color: rgba(255, 255, 255, 0.95);
            font-size: 0.9375rem;
            font-weight: 500;
            line-height: 1.5;
        }

        /* CTA Section - Modern centered */
        .cta {
            padding: 8rem 2rem;
            background: linear-gradient(180deg, rgba(13, 40, 28, 0.7) 0%, rgba(10, 26, 15, 0.8) 100%);
            text-align: center;
            position: relative;
        }

        .cta::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.5), transparent);
        }

        .cta::after {
            content: '';
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(201, 162, 39, 0.2) 0%, rgba(13, 74, 46, 0.15) 50%, transparent 70%);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 0;
            pointer-events: none;
        }

        .cta-content {
            max-width: 900px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }

        .cta h2 {
            font-family: "Playfair Display", Georgia, serif;
            font-size: clamp(2.5rem, 6vw, 4rem);
            color: white;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }

        .cta p {
            font-size: 1.25rem;
            margin-bottom: 3rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.8;
        }

        .cta-buttons {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        /* Smooth scrolling */
        html {
            scroll-behavior: smooth;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .hero-inner h1 {
                font-size: 2.5rem;
            }

            .pillar-grid {
                grid-template-columns: 1fr;
            }

            .stats-grid {
                gap: 2rem;
            }

            .vision-container {
                gap: 3rem;
            }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-inner">
            <div className="hero-label">Our Mission</div>
            <h1>Advancing Climate Resilience</h1>
            <p>
              Serving as Eritrea's National Designated Authority for the Green Climate Fund, we facilitate access to transformative climate finance and champion projects that build resilience and drive sustainable, low-emission development across our nation.
            </p>
            <div className="hero-cta">
              <button onClick={() => document.getElementById('pillars').scrollIntoView({ behavior: 'smooth' })} className="btn">
                <span>Explore Our Work</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </button>
              <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="btn btn-outline">
                <span>Get In Touch</span>
              </button>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=800&fit=crop" 
               alt="Eritrea landscape showing climate resilience"/>
        </div>
        <div className="scroll-indicator">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </div>
      </section>

      {/* Strategic Pillars */}
      <section id="pillars" className="pillars">
        <div className="section-header">
          <div className="section-label">Strategic Framework</div>
          <h2>Four Pillars of Impact</h2>
          <p>Our work is anchored in these foundational pillars that guide our approach to climate action and sustainable development.</p>
        </div>
        <div className="pillar-grid">
          <div className="pillar-card">
            <div className="pillar-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <h3>Climate Finance Access</h3>
            <p>Mobilizing international climate finance through strategic partnerships with the Green Climate Fund to support Eritrea's adaptation and mitigation priorities.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3>Project Development</h3>
            <p>Designing, implementing, and monitoring transformative climate projects that deliver measurable, lasting impact across communities.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <h3>Capacity Building</h3>
            <p>Strengthening institutional and technical capabilities to effectively access, manage climate finance, and implement sustainable solutions.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <h3>Stakeholder Coordination</h3>
            <p>Fostering collaboration among government entities, civil society, private sector, and international partners for cohesive climate action.</p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision">
        <div className="vision-container">
          <div className="vision-content">
            <h2>Our Vision for Climate Resilience</h2>
            <p className="vision-text">
              Eritrea faces significant climate challenges—from prolonged droughts affecting agriculture to coastal vulnerabilities threatening communities and ecosystems. As the National Designated Authority, we envision a future where climate resilience is woven into every sector of Eritrean society.
            </p>
            <p className="vision-text">
              Our approach is holistic and participatory. We ensure that climate projects not only reduce emissions and build adaptive capacity, but also create economic opportunities, enhance food security, and improve quality of life for all Eritreans—especially the most vulnerable.
            </p>
          </div>

          <div className="focus-box">
            <h3>Key Focus Areas</h3>
            <div className="focus-list">
              <div className="focus-item">
                <span>→</span>
                <p>Water resource management and sustainable irrigation systems</p>
              </div>
              <div className="focus-item">
                <span>→</span>
                <p>Renewable energy deployment and energy access expansion</p>
              </div>
              <div className="focus-item">
                <span>→</span>
                <p>Climate-smart agriculture and land restoration</p>
              </div>
              <div className="focus-item">
                <span>→</span>
                <p>Coastal zone management and marine ecosystem protection</p>
              </div>
              <div className="focus-item">
                <span>→</span>
                <p>Early warning systems and disaster risk reduction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Commitment */}
      <section className="stats-section">
        <div className="stats-container">
          <h2>Our Commitment to Excellence</h2>
          <p>
            We are dedicated to ensuring transparency, accountability, and effectiveness in all our climate finance operations—aligning with both national priorities and international best practices.
          </p>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Alignment with National Climate Strategy</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">∞</div>
              <div className="stat-label">Commitment to Sustainable Development</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Dedication to Climate Action</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="contact" className="cta">
        <div className="cta-content">
          <h2>Join Us in Building a Resilient Future</h2>
          <p>
            Together, we can transform climate challenges into opportunities for sustainable development and create lasting positive change for generations to come.
          </p>
          <div className="cta-buttons">
            <button className="btn">
              <span>Get Involved</span>
            </button>
            <button className="btn btn-outline">
              <span>View Our Projects</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Mission