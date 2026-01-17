import { useEffect, useRef } from 'react'

const GCFProject = () => {
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

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
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

        .info-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .info-card::after {
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

        .info-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(13, 74, 46, 0.35);
        }

        .info-card:hover::after {
          transform: scaleX(1);
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
                  Green Climate Fund
                </span>
              </div>

              <h1 className="animate-on-scroll delay-100 font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                GCF & Climate Finance
              </h1>

              <p className="animate-on-scroll delay-200 text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
                Strategic mastery of Green Climate Fund mechanisms and resources for effective climate finance access
                <br />
                <span className="text-gray-300">Centralizing GCF policies, templates, and tools for project development</span>
              </p>

              <div className="animate-on-scroll delay-300 flex items-center gap-4">
                <div className="h-px w-20 bg-gradient-to-r from-yellow-400 to-transparent" />
                <span className="text-yellow-300 font-medium">Climate Finance Framework</span>
              </div>
            </div>

            {/* CTA Button - Link to GCF */}
            <div className="animate-on-scroll delay-400 mt-12">
              <a
                href="https://www.greenclimate.fund/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-secondary to-secondary-light text-white font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 10l6-6m0 0l6 6m-6 0v10" />
                </svg>
                Visit GCF Official Website
              </a>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* About GCF Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold tracking-wider uppercase mb-4">
                Overview
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                About the Green Climate Fund
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The Green Climate Fund (GCF) is the world's largest climate fund, helping developing countries reduce their greenhouse gas emissions and enhance their resilience to climate change.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll delay-100 space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Established by 194 countries under the United Nations Framework Convention on Climate Change (UNFCCC), GCF responds to climate change by investing billions of dollars in climate adaptation and mitigation projects.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  GCF places particular emphasis on the needs of societies that are highly vulnerable to the effects of climate change, in particular Least Developed Countries (LDCs), Small Island Developing States (SIDS), and African States.
                </p>
              </div>

              <div className="animate-on-scroll delay-200">
                <div className="glass-card rounded-3xl p-8 gradient-border shadow-2xl">
                  <h3 className="font-heading text-2xl font-bold text-primary mb-6">
                    GCF's Mission
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'Support low-emission and climate-resilient development',
                      'Mobilize climate finance at significant scale',
                      'Promote paradigm shift towards low-carbon development',
                      'Facilitate transformational climate action'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Mastery Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-400 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-400 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-semibold tracking-wider uppercase mb-4">
                Core Focus
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Strategic Mastery of GCF Mechanisms
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Understanding and leveraging GCF's funding mechanisms, investment criteria, and project cycle for successful climate finance access
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: 'Readiness Support',
                  description: 'Build capacity for GCF project preparation through Readiness and Preparatory Support Programme, enabling countries to transform project ideas into fundable proposals.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2a2 2 0 012 2m0 0v2h2M9 5a2 2 0 012 2h2a2 2 0 012 2" />
                    </svg>
                  ),
                  title: 'Investment Criteria',
                  description: 'Master GCF\'s six investment criteria: paradigm shift potential, impact potential, country ownership, and sustainable development.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: 'Project Cycle',
                  description: 'Navigate GCF\'s structured project cycle from concept note development through funding proposal submission, review, and approval.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Funding Modalities',
                  description: 'Access diverse funding modalities including grants, concessional loans, equity, and guarantees to match project needs.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.623 5H8.08c-1.578 0-3.071.932-4.467 2.352-6.467C2.467 2.352 1.578 2 0 5c0-1.578.932-3.071 2.352-4.467 2.352-6.467C5.477 9.246 5 10.832 5 12.253v13C5 18.128 5.928 19.246 7 21c1.578 0 3.071-.932 4.467-2.352 6.467 2.352 4.467 7.928 9.547 9 10.832 9 12.253v13z" />
                    </svg>
                  ),
                  title: 'Results Management',
                  description: 'Implement robust monitoring and evaluation frameworks to track results, impacts, and ensure accountability of funded projects.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  title: 'Safeguards',
                  description: 'Ensure environmental and social safeguards are integrated throughout project design and implementation.'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`animate-on-scroll delay-${(index + 1) * 100} info-card bg-white rounded-2xl shadow-lg p-8`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-primary">{item.title}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Centralization Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 border border-secondary/40 text-secondary font-semibold tracking-wider uppercase mb-4">
                Resources
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                Centralization of GCF Policies and Resources
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Structured access to GCF tools, policies, and templates aligned with national development priorities
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="animate-on-scroll delay-100 info-card bg-white rounded-2xl shadow-lg p-8 gradient-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2a2 2 0 012 2m0 0v2h2M9 5a2 2 0 012 2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary">GCF Templates</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Access standardized GCF templates for concept notes, funding proposals, and project documents. These templates ensure alignment with GCF requirements and streamline proposal development.
                </p>
                <ul className="space-y-2">
                  {[
                    'Concept Note Templates',
                    'Funding Proposal Forms',
                    'Results Management Frameworks',
                    'M&E Reporting Formats'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="animate-on-scroll delay-200 info-card bg-white rounded-2xl shadow-lg p-8 gradient-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary">Policy Documents</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Comprehensive access to GCF policies, guidelines, and frameworks that govern project funding and implementation.
                </p>
                <ul className="space-y-2">
                  {[
                    'Environmental and Social Safeguards',
                    'Gender Policy and Action Plan',
                    'Indigenous Peoples Policy',
                    'Grievance Redress Mechanism'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center mb-12 animate-on-scroll">
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                Key Resource Categories
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'National Policies',
                  description: 'Eritrea\'s climate and development policies ensuring alignment with GCF requirements',
                  icon: '📋'
                },
                {
                  title: 'GCF Guidelines',
                  description: 'Official guidance documents for project development and implementation',
                  icon: '📖'
                },
                {
                  title: 'Learning Modules',
                  description: 'Capacity-building resources for stakeholders and project developers',
                  icon: '📚'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`animate-on-scroll delay-${(index + 1) * 100} info-card bg-white rounded-2xl shadow-lg p-6 text-center`}
                >
                  <div className="text-5xl mb-4">
                    {item.icon}
                  </div>
                  <h4 className="font-heading text-lg font-bold text-primary mb-3">
                    {item.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-white mb-6">
              Ready to Explore GCF Resources?
            </h2>
            <p className="font-body text-lg text-gray-300 mb-8">
              Visit our Resources section to access the complete library of GCF documents, templates, and learning materials.
            </p>
            <a
              href="/resources"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-secondary to-secondary-light text-white font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2m-4-4m0 6l6 6m-6 0v10" />
              </svg>
              Browse Resources
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default GCFProject
