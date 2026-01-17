import { useEffect, useRef } from 'react'

const LearningModules = () => {
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observerTarget.current
        .querySelectorAll('.animate-on-scroll')
        .forEach((el) => observer.observe(el))
    }

    return () => observer.disconnect()
  }, [])

  const modules = [
    {
      id: 1,
      title: 'Introduction to Climate Finance',
      description: 'Understanding the fundamentals of climate finance, including GCF operational policies, accreditation modalities, and the Readiness and Preparatory Support Programme framework.',
      duration: '4 hours',
      topics: ['Climate Fundamentals', 'GCF Policies', 'Financial Instruments', 'Case Studies']
    },
    {
      id: 2,
      title: 'NDA Mandate and Governance',
      description: 'Strengthening institutional mandate, governance structures, and coordination mechanisms. Covers the NDA\'s role, responsibilities, and decision-making processes for effective climate finance coordination.',
      duration: '3 hours',
      topics: ['NDA Structure', 'Governance Framework', 'Coordination Mechanisms', 'Stakeholder Engagement']
    },
    {
      id: 3,
      title: 'GCF Project Concept Notes & Funding Proposals',
      description: 'Learning to develop high-quality, GCF-compliant concept notes. Covers investment criteria, environmental and social safeguards, gender considerations, and project preparation best practices.',
      duration: '4 hours',
      topics: ['Concept Note Structure', 'Funding Criteria', 'ESS & Gender', 'Case Study Analysis']
    },
    {
      id: 4,
      title: 'Stakeholder Mapping & Engagement',
      description: 'Identifying and engaging key stakeholders across government, civil society, private sector, and vulnerable groups. Developing strategies for inclusive consultation and participation in climate action.',
      duration: '3 hours',
      topics: ['Stakeholder Analysis', 'Engagement Strategies', 'Communication Planning', 'Multi-stakeholder Coordination']
    },
    {
      id: 5,
      title: 'Monitoring, Reporting & Learning Systems',
      description: 'Establishing frameworks for monitoring project impacts, reporting to GCF, and institutional learning. Covers performance indicators, reporting templates, and adaptive management approaches.',
      duration: '3 hours',
      topics: ['M&E Framework', 'Reporting Templates', 'Lessons Learned', 'Knowledge Management']
    },
    {
      id: 6,
      title: 'Climate Action Project Development',
      description: 'Full cycle of climate project development, from identification to funding approval. Covers project design, financing models, implementation management, and risk mitigation strategies.',
      duration: '6 hours',
      topics: ['Project Design', 'Financing Options', 'Implementation Planning', 'Risk Management']
    }
  ]

  return (
    <div className="w-full relative overflow-x-hidden">
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-on-scroll {
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          animation: slide-up 0.8s ease-out forwards;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }

        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .glass-dark {
          background: rgba(13, 74, 46, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(13, 74, 46, 0.5);
        }

        .gradient-border {
          position: relative;
        }

        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          background: linear-gradient(135deg, #c9a227, #dbb84a, #c9a227);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .gradient-border:hover::before {
          opacity: 1;
        }

        .hero-gradient {
          background: linear-gradient(135deg, #0d1b13 0%, #0d4a2e 25%, #0a1a0f 50%, #156642 75%, #0d1b13 100%);
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: float-up 8s ease-in-out infinite;
        }

        .role-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .role-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c9a227, #dbb84a);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .role-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(13, 74, 46, 0.35);
        }

        .role-card:hover::after {
          transform: scaleX(1);
        }

        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="floating-orb w-96 h-96 bg-gradient-to-br from-green-600/30 to-green-800/20"
          style={{ top: '-10%', right: '-10%', animationDelay: '0s' }}
        />
        <div
          className="floating-orb w-[500px] h-[500px] bg-gradient-to-br from-yellow-500/20 to-green-700/20"
          style={{ bottom: '-15%', left: '-15%', animationDelay: '2s' }}
        />
        <div
          className="floating-orb w-80 h-80 bg-gradient-to-br from-green-500/25 to-green-600/15"
          style={{ top: '40%', left: '20%', animationDelay: '4s' }}
        />
      </div>

      <div ref={observerTarget} className="relative z-10">
        {/* Hero Section */}
        <section className="hero-gradient min-h-[60vh] flex items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="max-w-4xl">
              <div className="animate-on-scroll mb-6 inline-block">
                <span className="inline-block px-6 py-2 rounded-full bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 text-yellow-300 text-sm font-semibold tracking-wider uppercase">
                  Learning Modules
                </span>
              </div>

              <h1 className="animate-on-scroll delay-100 font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Readiness Learning Modules
              </h1>

              <p className="animate-on-scroll delay-200 text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
                Deliverables from ClimFin for strengthening national technical capacities.
                <br />
                <span className="text-gray-300">Modules 1–6 (capacités techniques)</span>
              </p>

              <div className="animate-on-scroll delay-300 flex items-center gap-4">
                <div className="h-px w-20 bg-gradient-to-r from-yellow-400 to-transparent" />
                <span className="text-yellow-300 font-medium">ClimFin Capacity Building Programme</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Modules Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
                Technical Capacity Building Modules
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Comprehensive training materials to strengthen national expertise for effective climate finance engagement and project development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  className={`role-card bg-white rounded-2xl shadow-lg overflow-hidden animate-on-scroll delay-${(index + 1) * 100}`}
                >
                  <div className="relative h-full">
                    {/* Module Number Badge */}
                    <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                      Module {module.id}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-8 pt-12">
                      <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                        {module.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed mb-6">
                        {module.description}
                      </p>

                      {/* Module Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3l3 3h-6" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-primary mb-1">Duration</div>
                            <div className="text-2xl font-bold text-secondary">{module.duration}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012 2h2a2 2 0 002-2m0 0V9a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-primary mb-1">Key Topics</div>
                            <ul className="space-y-2">
                              {module.topics.map((topic, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-700">
                                  <div className="w-2 h-2 rounded-full bg-secondary/20 flex-shrink-0 mt-1.5"></div>
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LearningModules
