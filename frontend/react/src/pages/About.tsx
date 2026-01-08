import { useEffect, useRef } from 'react'

const About = () => {
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
    <div className="min-h-screen relative overflow-x-hidden">
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

        .partner-card {
          position: relative;
          transition: all 0.4s ease;
        }

        .partner-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.1), rgba(13, 74, 46, 0.1));
          opacity: 0;
          transition: opacity 0.4s;
          border-radius: inherit;
        }

        .partner-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(13, 74, 46, 0.2);
        }

        .partner-card:hover::before {
          opacity: 1;
        }

        .stat-number {
          background: linear-gradient(135deg, #c9a227, #dbb84a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
        <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="max-w-4xl">
              <div className="animate-on-scroll mb-6 inline-block">
                <span className="inline-block px-6 py-2 rounded-full bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 text-yellow-300 text-sm font-semibold tracking-wider uppercase">
                  About Us
                </span>
              </div>

              <h1 className="animate-on-scroll delay-100 font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                National Designated Authority
              </h1>

              <p className="animate-on-scroll delay-200 text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl">
                Championing climate action and resilience building for a sustainable Eritrea
              </p>

              <div className="animate-on-scroll delay-300 flex items-center gap-4">
                <div className="h-px w-20 bg-gradient-to-r from-yellow-400 to-transparent" />
                <span className="text-yellow-300 font-medium">Eritrea's Focal Point for Climate Finance</span>
              </div>
            </div>

            {/* Stats Banner */}
            <div className="animate-on-scroll delay-400 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '8+', label: 'Years of Experience' },
                { value: '15+', label: 'Climate Projects' },
                { value: '$2.5M', label: 'Finance Mobilized' },
                { value: '12+', label: 'Strategic Partners' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`glass-dark rounded-2xl p-6 text-center animate-on-scroll delay-${(index + 1) * 100}`}
                >
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/80 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* About NDA Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold tracking-wider uppercase mb-4">
                  Who We Are
                </span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                  Advancing Climate Action in Eritrea
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  The National Designated Authority (NDA) is Eritrea's official entity accredited by the Green Climate Fund to coordinate climate finance initiatives.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="animate-on-scroll delay-100 space-y-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Operating under the Ministry of Land, Water and Environment, the NDA plays a critical role in advancing Eritrea's climate resilience and sustainable development objectives. We serve as the bridge between international climate finance mechanisms and national implementation priorities.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    As NDA, we are responsible for facilitating access to GCF resources, coordinating with national stakeholders, ensuring alignment with national priorities, and overseeing implementation of climate projects that deliver transformative impacts for communities across Eritrea.
                  </p>
                </div>

                <div className="animate-on-scroll delay-200">
                  <div className="glass-card rounded-3xl p-8 gradient-border shadow-2xl">
                    <h3 className="font-heading text-2xl font-bold text-primary mb-6">
                      Our Core Mission
                    </h3>
                    <ul className="space-y-4">
                      {[
                        'Facilitate access to international climate finance',
                        'Ensure alignment with national development priorities',
                        'Coordinate stakeholders for inclusive climate action',
                        'Support transformative climate projects'
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
          </div>
        </section>

        {/* Role & Responsibilities Section */}
        <section className="py-24 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-400 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-400 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-semibold tracking-wider uppercase">
                What We Do
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 mt-4">
                Our Role & Responsibilities
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We lead Eritrea's climate finance coordination through strategic initiatives and focused interventions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: 'Strategic Coordination',
                  description: 'Coordinate with government agencies, civil society, and private sector to align climate initiatives with national development priorities.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                  title: 'Project Facilitation',
                  description: 'Supports development and submission of funding proposals to GCF, ensuring high-quality, impactful projects.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  title: 'Stakeholder Engagement',
                  description: 'Engage with diverse stakeholders to build consensus and ensure inclusive participation in climate action.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: 'Capacity Building',
                  description: 'Strengthen institutional and technical capacities to effectively manage climate finance and implement projects.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ),
                  title: 'Knowledge Management',
                  description: 'Document and share lessons learned, best practices, and innovations in climate resilience and adaptation.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: 'Policy Alignment',
                  description: "Ensure all climate interventions align with Eritrea's National Adaptation Plan and Nationally Determined Contributions."
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`role-card glass-dark rounded-2xl p-8 animate-on-scroll delay-${(index % 6 + 1) * 100}`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-6 shadow-lg">
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Readiness Program Section */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-on-scroll">
                <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold tracking-wider uppercase mb-6">
                  GCF Initiative
                </span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                  The Readiness Program
                </h2>
                <div className="space-y-6 text-lg text-gray-700">
                  <p className="leading-relaxed">
                    The Readiness Program is a GCF initiative designed to strengthen countries' institutional capacities, governance frameworks, and planning processes to effectively engage with climate finance. Through this program, Eritrea is building the foundation for sustained climate action and long-term resilience.
                  </p>
                  <p className="leading-relaxed">
                    Our Readiness activities focus on enhancing institutional arrangements, developing robust project pipelines, strengthening monitoring and evaluation systems, and fostering partnerships that maximize the impact of climate investments in Eritrea.
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-6">
                  {[
                    'Institutional Strengthening',
                    'Project Pipeline Development',
                    'M&E Systems Enhancement',
                    'Partnership Building'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="animate-on-scroll delay-200">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-yellow-200 to-green-200 rounded-3xl blur-2xl opacity-50" />
                  <div className="relative glass-card rounded-3xl p-10 gradient-border shadow-2xl">
                    <div className="space-y-8">
                      {[
                        {
                          number: '01',
                          title: 'Governance Framework',
                          desc: 'Establishing robust institutional arrangements'
                        },
                        {
                          number: '02',
                          title: 'Capacity Building',
                          desc: 'Strengthening technical expertise'
                        },
                        {
                          number: '03',
                          title: 'Project Development',
                          desc: 'Creating a strong project pipeline'
                        }
                      ].map((step, index) => (
                        <div key={index} className="flex gap-6 items-start">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {step.number}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-heading text-xl font-bold text-primary mb-2">
                              {step.title}
                            </h4>
                            <p className="text-gray-600">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold tracking-wider uppercase">
                Collaboration
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6 mt-4">
                Our Partners
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We collaborate with a diverse range of partners to achieve our climate readiness objectives
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Green Climate Fund', tier: 'primary' },
                { name: 'UNDP', tier: 'primary' },
                { name: 'World Bank', tier: 'primary' },
                { name: 'UNEP', tier: 'secondary' },
                { name: 'FAO', tier: 'secondary' },
                { name: 'AfDB', tier: 'secondary' },
                { name: 'IGAD', tier: 'secondary' },
                { name: 'Local NGOs', tier: 'secondary' }
              ].map((partner, index) => (
                <div
                  key={index}
                  className={`partner-card animate-on-scroll delay-${((index % 8) + 1) * 100} ${
                    partner.tier === 'primary'
                      ? 'bg-gradient-to-br from-primary to-primary-dark'
                      : 'bg-white'
                  } rounded-2xl p-6 text-center shadow-lg`}
                >
                  <div className={`font-heading font-bold text-lg ${
                    partner.tier === 'primary' ? 'text-white' : 'text-primary'
                  }`}>
                    {partner.name}
                  </div>
                  {partner.tier === 'primary' && (
                    <div className="mt-2 w-12 h-1 bg-yellow-400 rounded-full mx-auto" />
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="animate-on-scroll mt-16 text-center">
              <div className="inline-block glass-card rounded-2xl p-8 gradient-border shadow-2xl">
                <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                  Interested in Partnering With Us?
                </h3>
                <p className="text-gray-600 mb-6 max-w-xl">
                  We welcome collaboration with organizations committed to climate action and sustainable development in Eritrea.
                </p>
                <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  Get in Touch
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
