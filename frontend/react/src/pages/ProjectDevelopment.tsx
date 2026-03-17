import { useEffect, useRef } from 'react'

const ProjectDevelopment = () => {
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
                  Project Development
                </span>
              </div>

              <h1 className="animate-on-scroll delay-100 font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                GCF Project Development
              </h1>

              <p className="animate-on-scroll delay-200 text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
                Guidelines and frameworks for developing high-quality, GCF-compliant climate projects
                <br />
                <span className="text-gray-300">Concept Notes, Investment Criteria, ESS & Gender</span>
              </p>

              <div className="animate-on-scroll delay-300 flex items-center gap-4">
                <div className="h-px w-20 bg-gradient-to-r from-yellow-400 to-transparent" />
                <span className="text-yellow-300 font-medium">Project Preparation Framework</span>
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

        {/* Concept Notes Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
                GCF Project Concept Notes
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Understanding the structure and requirements for developing concept notes that align with GCF standards
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="animate-on-scroll delay-100 info-card bg-white rounded-2xl shadow-lg p-8 gradient-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary">Concept Note Structure</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  GCF concept notes provide a comprehensive overview of proposed projects, including context, rationale, theory of change, implementation arrangements, and budget estimates.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2"></div>
                    <span>Problem statement and rationale</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2"></div>
                    <span>Stakeholder engagement and ownership</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2"></div>
                    <span>Climate rationale and impact potential</span>
                  </li>
                </ul>
              </div>

              <div className="animate-on-scroll delay-200 info-card bg-white rounded-2xl shadow-lg p-8 gradient-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary">Funding Proposal Development</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Full funding proposals build on approved concept notes, providing detailed implementation plans, M&E frameworks, and budget justifications.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2"></div>
                    <span>Detailed work plans and timelines</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2"></div>
                    <span>Results-based monitoring and evaluation</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2"></div>
                    <span>Risk assessment and mitigation strategies</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Criteria Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-400 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-400 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 animate-on-scroll">
              <span className="inline-block px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-semibold tracking-wider uppercase mb-4">
                Investment Framework
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                GCF Investment Criteria
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Projects must meet GCF's investment criteria to be considered for funding
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: 'Impact Potential',
                  description: 'Projects should demonstrate significant climate impact potential, both in terms of GHG reduction and adaptation benefits, with clear metrics for measuring results.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: 'Paradigm Shift',
                  description: 'Projects should catalyze change beyond business-as-usual approaches, demonstrating innovation and potential for scaling or replication.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  title: 'Sustainable Development',
                  description: 'Projects must contribute to broader sustainable development goals, delivering social, economic, and environmental co-benefits beyond climate impacts.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Country Ownership',
                  description: 'Projects must align with national priorities and be owned by country stakeholders, ensuring relevance and long-term sustainability.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Needs-Based',
                  description: 'Projects should respond to identified needs and priorities, particularly for vulnerable countries, communities, and groups.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: 'Potential for Scale',
                  description: 'Projects should demonstrate potential for scaling up, replication, or serving as models for broader climate action initiatives.'
                }
              ].map((criteria, index) => (
                <div key={index} className={`glass-dark rounded-2xl p-6 animate-on-scroll delay-${(index + 1) * 100}`}>
                  <div className="text-yellow-400 mb-4">{criteria.icon}</div>
                  <h3 className="font-heading text-xl font-bold text-white mb-3">
                    {criteria.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {criteria.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ESS & Gender Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll">
                <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold tracking-wider uppercase mb-4">
                  Safeguards & Inclusion
                </span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                  Environmental & Social Safeguards
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  GCF projects must adhere to comprehensive Environmental and Social Safeguards (ESS) to ensure positive impacts and avoid harm to people and the environment.
                </p>

                <div className="space-y-6">
                  {[
                    { title: 'ESS1: Environmental & Social Assessment', desc: 'Conduct thorough assessment of potential environmental and social impacts.' },
                    { title: 'ESS2: Stakeholder Engagement', desc: 'Ensure meaningful consultation and participation of affected stakeholders.' },
                    { title: 'ESS3: Emissions Reductions', desc: 'Quantify and verify GHG emissions reductions and removals.' },
                    { title: 'ESS4: Indigenous Peoples', desc: 'Respect rights and ensure free, prior, and informed consent.' },
                    { title: 'ESS5: Gender Equality & Inclusion', desc: 'Promote gender equality and ensure equitable benefits distribution.' },
                    { title: 'ESS6: Grievance Mechanism', desc: 'Establish accessible and effective grievance resolution processes.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mt-0.5">
                        <span className="text-white font-bold text-sm">{idx + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-1">{item.title}</h4>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="animate-on-scroll delay-200">
                <div className="glass-card rounded-3xl p-8 gradient-border shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-primary">Gender Action Plan</h3>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    All GCF-funded projects must develop and implement a Gender Action Plan (GAP) to ensure gender-responsive climate action.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4">
                      <h4 className="font-semibold text-primary mb-2">Key Elements:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Gender analysis and assessment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Specific gender-responsive activities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Gender-disaggregated indicators</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Capacity building for gender mainstreaming</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Monitoring and evaluation of gender outcomes</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProjectDevelopment
