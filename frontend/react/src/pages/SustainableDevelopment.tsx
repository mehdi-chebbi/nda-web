import { useEffect } from 'react'

const SustainableDevelopment = () => {
  useEffect(() => {

    // Animate elements on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="sustainable-development-page" style={{ minHeight: '100vh' }}>
      <style>{`
        /* ===== Base Styles ===== */
        :root {
          --color-primary: #0d4a2e;
          --color-primary-dark: #07331f;
          --color-primary-light: #156642;
          --color-secondary: #c9a227;
          --color-secondary-light: #dbb84a;
          --color-bg-page: #f9fafb;
          --color-bg-alt: #f3f4f6;
          --color-text-main: #1a1a1a;
          --color-text-muted: #5a5a5a;
          --color-white: #ffffff;
          --color-border-light: #e5e7eb;
        }

        /* ===== Animations ===== */
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }

        .animate-on-scroll.animate-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }
        .delay-400 { transition-delay: 0.4s; }
        .delay-500 { transition-delay: 0.5s; }
        .delay-600 { transition-delay: 0.6s; }

        /* ===== Background Effects ===== */
        .gcf-bg-effects {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.3;
          animation: float 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: var(--color-primary);
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: var(--color-secondary);
          bottom: 20%;
          left: -50px;
          animation-delay: -7s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: var(--color-primary-light);
          top: 40%;
          right: 20%;
          animation-delay: -14s;
        }

        /* ===== Hero Section ===== */
        .gcf-hero {
          min-height: 60vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0d1b13 0%, #0d4a2e 25%, #0a1a0f 50%, #156642 75%, #0d1b13 100%);
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        .gcf-hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .gcf-hero-content {
          position: relative;
          z-index: 10;
          max-width: 1200px;
          margin: 0 auto;
          padding: 5rem 2rem;
          width: 100%;
        }

        .gcf-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(201, 162, 39, 0.2);
          border: 1px solid rgba(201, 162, 39, 0.4);
          border-radius: 2rem;
          color: var(--color-secondary-light);
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1.5rem;
        }

        .gcf-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 700;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .gcf-hero-subtitle {
          font-size: 1.5rem;
          color: #e5e7eb;
          margin-bottom: 0.5rem;
          line-height: 1.6;
          max-width: 800px;
        }

        .gcf-hero-subtext {
          font-size: 1.125rem;
          color: #d1d5db;
          line-height: 1.6;
          max-width: 800px;
        }

        .gcf-hero-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .gcf-divider-line {
          height: 1px;
          width: 80px;
          background: linear-gradient(90deg, #fbbf24, transparent);
        }

        .gcf-hero-divider span {
          color: #fcd34d;
          font-weight: 500;
        }

        .gcf-scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.6);
          animation: float 2s ease-in-out infinite;
        }

        /* ===== Section Styles ===== */
        .gcf-section {
          padding: 5rem 0;
          position: relative;
        }

        .gcf-section-light {
          background: linear-gradient(180deg, #f9fafb, #f3f4f6);
        }

        .gcf-section-dark {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          overflow: hidden;
        }

        .gcf-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 10;
        }

        .gcf-section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .gcf-section-header-light {
          color: white;
        }

        .gcf-section-header-light h2,
        .gcf-section-header-light p {
          color: white;
        }

        .gcf-section-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(13, 74, 46, 0.1);
          border: 1px solid rgba(13, 74, 46, 0.2);
          border-radius: 2rem;
          color: var(--color-primary);
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }

        .gcf-badge-yellow {
          background: rgba(245, 191, 24, 0.15);
          border-color: rgba(245, 191, 24, 0.3);
          color: #fbbf24;
        }

        .gcf-badge-gold {
          background: rgba(201, 162, 39, 0.15);
          border: 1px solid rgba(201, 162, 39, 0.4);
          color: var(--color-secondary);
        }

        .gcf-section h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 2.5rem);
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--color-primary);
        }

        .gcf-section p {
          font-size: 1.125rem;
          line-height: 1.7;
          color: var(--color-text-muted);
          max-width: 700px;
          margin: 0 auto;
        }

        /* ===== Two Column Layout ===== */
        .gcf-two-column {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          margin-top: 3rem;
        }

        @media (min-width: 768px) {
          .gcf-two-column {
            grid-template-columns: 1fr 1fr;
          }
        }

        .gcf-text-content p {
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--color-text-muted);
        }

        /* ===== Mission Card ===== */
        .gcf-mission-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .gcf-mission-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 1.5rem;
        }

        .gcf-mission-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .gcf-mission-card li {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          transition: background-color 0.2s ease;
        }

        .gcf-mission-card li:hover {
          background-color: rgba(13, 74, 46, 0.05);
        }

        .gcf-check-icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          background: rgba(13, 74, 46, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
        }

        .gcf-check-icon svg {
          width: 14px;
          height: 14px;
        }

        .gcf-mission-card li span {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-text-main);
        }

        /* ===== Cards Grid ===== */
        .gcf-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .gcf-info-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .gcf-info-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .gcf-card-icon {
          width: 64px;
          height: 64px;
          background: rgba(13, 74, 46, 0.1);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: var(--color-primary);
        }

        .gcf-info-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
        }

        .gcf-info-card p {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-text-muted);
          margin: 0;
        }

        /* ===== Background Orbs ===== */
        .gcf-bg-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .gcf-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
        }

        .gcf-bg-orb.orb-yellow {
          width: 500px;
          height: 500px;
          background: var(--color-secondary);
          top: -100px;
          right: -100px;
        }

        .gcf-bg-orb.orb-green {
          width: 400px;
          height: 400px;
          background: var(--color-primary-light);
          bottom: -100px;
          left: -100px;
        }

        /* ===== Resources Grid ===== */
        .gcf-resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        @media (max-width: 768px) {
          .gcf-resources-grid {
            grid-template-columns: 1fr;
          }
        }

        .gcf-resource-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-left: 4px solid var(--color-secondary);
        }

        .gcf-resource-icon {
          width: 56px;
          height: 56px;
          background: rgba(201, 162, 39, 0.1);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: var(--color-secondary);
        }

        .gcf-resource-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
        }

        .gcf-resource-card p {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-text-muted);
          margin-bottom: 1rem;
        }

        .gcf-resource-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .gcf-bullet {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: var(--color-secondary);
          border-radius: 50%;
          margin-right: 0.75rem;
        }

        .gcf-resource-card li {
          padding: 0.5rem 0;
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }

        /* ===== Subsection Title ===== */
        .gcf-subsection-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-primary);
          margin: 4rem 0 2rem;
          text-align: center;
        }

        /* ===== Category Grid ===== */
        .gcf-category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .gcf-category-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .gcf-category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .gcf-category-emoji {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .gcf-category-card h4 {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
        }

        .gcf-category-card p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--color-text-muted);
          margin: 0;
        }

        /* ===== Pathways Section ===== */
        .sd-pathways-section {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
        }

        .sd-pathways-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .sd-pathways-grid {
            grid-template-columns: 1fr;
          }
        }

        .sd-pathway-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .sd-pathway-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--color-secondary), var(--color-secondary-light));
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .sd-pathway-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(13, 74, 46, 0.2);
        }

        .sd-pathway-card:hover::after {
          transform: scaleX(1);
        }

        .sd-pathway-number {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-secondary);
          opacity: 0.3;
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .sd-pathway-number {
            font-size: 2.5rem;
          }
        }

        .sd-pathway-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
        }

        .sd-pathway-card p {
          color: #4b5563;
          line-height: 1.7;
          margin: 0;
        }

        /* ===== Responsive Typography ===== */
        @media (max-width: 768px) {
          .gcf-section {
            padding: 3rem 0;
          }

          .gcf-container {
            padding: 0 1rem;
          }

          .gcf-hero-content {
            padding: 3rem 1rem;
          }

          .gcf-hero h1 {
            font-size: 2rem;
          }

          .gcf-hero-subtitle {
            font-size: 1.125rem;
          }

          .gcf-hero-subtext {
            font-size: 1rem;
          }

          .gcf-cards-grid {
            grid-template-columns: 1fr;
          }

          .gcf-category-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Background Effects */}
      <div className="gcf-bg-effects">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <div className="gcf-hero">
        <div className="gcf-hero-overlay"></div>
        <div className="gcf-hero-content">
          <span className="gcf-badge animate-on-scroll">Sustainable Development</span>
          <h1 className="animate-on-scroll delay-100">Building a Resilient Future</h1>
          <p className="gcf-hero-subtitle animate-on-scroll delay-200">
            Integrating climate action with sustainable development goals for a prosperous Eritrea
          </p>
          <p className="gcf-hero-subtext animate-on-scroll delay-200">
            Aligning national priorities with global frameworks to achieve lasting positive change
          </p>
          <div className="gcf-hero-divider animate-on-scroll delay-300">
            <div className="gcf-divider-line"></div>
            <span>Sustainable Development Pathway</span>
          </div>
        </div>
        <div className="gcf-scroll-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      {/* About Sustainable Development Section */}
      <section className="gcf-section gcf-section-light">
        <div className="gcf-container">
          <div className="gcf-section-header animate-on-scroll">
            <span className="gcf-section-badge">Overview</span>
            <h2>Sustainable Development in Eritrea</h2>
            <p>Eritrea is committed to achieving sustainable development while addressing the challenges of climate change, balancing economic growth with environmental protection and social equity.</p>
          </div>

          <div className="gcf-two-column">
            <div className="gcf-text-content animate-on-scroll delay-100">
              <p>Sustainable development in Eritrea is rooted in the principle of meeting present needs without compromising the ability of future generations to meet their own needs. This approach integrates economic prosperity, environmental stewardship, and social well-being.</p>
              <p>The National Designated Authority plays a crucial role in aligning climate finance with sustainable development objectives, ensuring that every climate project contributes to broader national development goals.</p>
            </div>

            <div className="gcf-mission-card animate-on-scroll delay-200">
              <h3>Core Principles</h3>
              <ul>
                <li>
                  <div className="gcf-check-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Integrate climate action with development planning</span>
                </li>
                <li>
                  <div className="gcf-check-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Promote inclusive and equitable growth</span>
                </li>
                <li>
                  <div className="gcf-check-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Protect natural resources and ecosystems</span>
                </li>
                <li>
                  <div className="gcf-check-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Build resilience in vulnerable communities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Priority Areas Section */}
      <section className="gcf-section gcf-section-dark">
        <div className="gcf-bg-orbs">
          <div className="gcf-bg-orb orb-yellow"></div>
          <div className="gcf-bg-orb orb-green"></div>
        </div>
        <div className="gcf-container">
          <div className="gcf-section-header gcf-section-header-light animate-on-scroll">
            <span className="gcf-section-badge gcf-badge-yellow">Priority Areas</span>
            <h2>Key Sectors for Sustainable Development</h2>
            <p>Focusing on critical sectors that drive sustainable growth and climate resilience across Eritrea</p>
          </div>

          <div className="gcf-cards-grid">
            <div className="gcf-info-card animate-on-scroll delay-100">
              <div className="gcf-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3>Agriculture & Food Security</h3>
              <p>Transforming agricultural practices to ensure food security while adapting to climate variability. Promoting climate-smart agriculture and sustainable land management.</p>
            </div>

            <div className="gcf-info-card animate-on-scroll delay-200">
              <div className="gcf-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
              <h3>Water Resources</h3>
              <p>Sustainable water management including conservation, efficient irrigation, and watershed protection. Building resilience against drought and water scarcity.</p>
            </div>

            <div className="gcf-info-card animate-on-scroll delay-300">
              <div className="gcf-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3>Renewable Energy</h3>
              <p>Expanding access to clean energy through solar, wind, and other renewable sources. Reducing carbon emissions while powering development.</p>
            </div>

            <div className="gcf-info-card animate-on-scroll delay-400">
              <div className="gcf-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3>Public Health</h3>
              <p>Strengthening health systems to address climate-related health risks. Building adaptive capacity for disease prevention and health service delivery.</p>
            </div>

            <div className="gcf-info-card animate-on-scroll delay-500">
              <div className="gcf-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3>Climate-Resilient Infrastructure</h3>
              <p>Building infrastructure that can withstand climate impacts. Designing roads, buildings, and utilities for long-term sustainability.</p>
            </div>

            <div className="gcf-info-card animate-on-scroll delay-600">
              <div className="gcf-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3>Ecosystem Conservation</h3>
              <p>Protecting and restoring natural ecosystems. Preserving biodiversity and enhancing ecosystem services for climate adaptation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Alignment with Global Frameworks Section */}
      <section className="gcf-section gcf-section-light">
        <div className="gcf-container">
          <div className="gcf-section-header animate-on-scroll">
            <span className="gcf-section-badge gcf-badge-gold">Global Alignment</span>
            <h2>Alignment with Global Frameworks</h2>
            <p>Eritrea's sustainable development agenda is aligned with international frameworks and commitments</p>
          </div>

          <div className="gcf-resources-grid">
            <div className="gcf-resource-card animate-on-scroll delay-100">
              <div className="gcf-resource-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3>Sustainable Development Goals (SDGs)</h3>
              <p>Eritrea's development priorities are mapped to the UN Sustainable Development Goals, ensuring contributions to global targets while addressing local needs.</p>
              <ul>
                <li><span className="gcf-bullet"></span>SDG 13: Climate Action</li>
                <li><span className="gcf-bullet"></span>SDG 2: Zero Hunger</li>
                <li><span className="gcf-bullet"></span>SDG 6: Clean Water</li>
                <li><span className="gcf-bullet"></span>SDG 7: Affordable Energy</li>
              </ul>
            </div>

            <div className="gcf-resource-card animate-on-scroll delay-200">
              <div className="gcf-resource-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <h3>Nationally Determined Contributions</h3>
              <p>Eritrea's NDC under the Paris Agreement outlines national commitments to reduce emissions and adapt to climate change impacts.</p>
              <ul>
                <li><span className="gcf-bullet"></span>Emission reduction targets</li>
                <li><span className="gcf-bullet"></span>Adaptation priorities</li>
                <li><span className="gcf-bullet"></span>Implementation roadmap</li>
                <li><span className="gcf-bullet"></span>Support requirements</li>
              </ul>
            </div>
          </div>

          <h3 className="gcf-subsection-title animate-on-scroll">National Planning Instruments</h3>

          <div className="gcf-category-grid">
            <div className="gcf-category-card animate-on-scroll delay-100">
              <div className="gcf-category-emoji">📋</div>
              <h4>National Adaptation Plan</h4>
              <p>Comprehensive strategy for adapting to climate change impacts across all sectors</p>
            </div>

            <div className="gcf-category-card animate-on-scroll delay-200">
              <div className="gcf-category-emoji">🎯</div>
              <h4>National Development Plan</h4>
              <p>Strategic framework guiding Eritrea's long-term development trajectory</p>
            </div>

            <div className="gcf-category-card animate-on-scroll delay-300">
              <div className="gcf-category-emoji">🌱</div>
              <h4>Climate Change Policy</h4>
              <p>Policy framework for climate action and sustainable resource management</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pathways Section */}
      <section className="gcf-section sd-pathways-section">
        <div className="gcf-container">
          <div className="gcf-section-header gcf-section-header-light animate-on-scroll">
            <span className="gcf-section-badge gcf-badge-yellow">Our Approach</span>
            <h2>Pathways to Sustainability</h2>
            <p>The Readiness Programme supports Eritrea's journey toward sustainable development through strategic interventions</p>
          </div>

          <div className="sd-pathways-grid">
            <div className="sd-pathway-card animate-on-scroll delay-100">
              <div className="sd-pathway-number">01</div>
              <h3>Capacity Building</h3>
              <p>Strengthening institutional and human capacity to plan, implement, and monitor sustainable development initiatives.</p>
            </div>

            <div className="sd-pathway-card animate-on-scroll delay-200">
              <div className="sd-pathway-number">02</div>
              <h3>Stakeholder Engagement</h3>
              <p>Engaging government, civil society, private sector, and communities in sustainable development planning and implementation.</p>
            </div>

            <div className="sd-pathway-card animate-on-scroll delay-300">
              <div className="sd-pathway-number">03</div>
              <h3>Knowledge Management</h3>
              <p>Documenting lessons learned, sharing best practices, and building a knowledge base for informed decision-making.</p>
            </div>

            <div className="sd-pathway-card animate-on-scroll delay-400">
              <div className="sd-pathway-number">04</div>
              <h3>Finance Mobilization</h3>
              <p>Facilitating access to climate finance and investment for sustainable development projects and programs.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SustainableDevelopment;