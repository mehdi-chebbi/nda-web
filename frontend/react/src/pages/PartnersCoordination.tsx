import { useEffect, useRef } from 'react'

const PartnersCoordination = () => {
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

        .partner-card {
          position: relative;
          transition: all 0.4s ease;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 140px;
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

        .partner-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: all 0.4s ease;
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
                  Partnerships
                </span>
              </div>

              <h1 className="animate-on-scroll delay-100 font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Partners & Coordination
              </h1>

              <p className="animate-on-scroll delay-200 text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
                Building strategic partnerships for effective climate action
                <br />
                <span className="text-gray-300">Stakeholder engagement and collaboration framework</span>
              </p>

              <div className="animate-on-scroll delay-300 flex items-center gap-4">
                <div className="h-px w-20 bg-gradient-to-r from-yellow-400 to-transparent" />
                <span className="text-yellow-300 font-medium">Collaborative Climate Finance</span>
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

        {/* Stakeholder Mapping Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
                Stakeholder Mapping & Engagement
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Identifying and engaging key stakeholders across government, civil society, private sector, and vulnerable groups for inclusive climate action
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="animate-on-scroll delay-100 info-card bg-white rounded-2xl shadow-lg p-8 gradient-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary">Government Agencies</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Line ministries and government institutions responsible for climate-relevant sectors, including agriculture, water, energy, health, and planning.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2"></div>
                    <span>Ministry of Land, Water and Environment</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2"></div>
                    <span>Other line ministries</span>
                  </li>
                </ul>
              </div>

              <div className="animate-on-scroll delay-200 info-card bg-white rounded-2xl shadow-lg p-8 gradient-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary">Civil Society</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  NGOs, community-based organizations, and civil society groups working on climate, environment, and development issues.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2"></div>
                    <span>Environmental NGOs</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2"></div>
                    <span>Community organizations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16 md:py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold tracking-wider uppercase">
                Collaboration
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6 mt-4">
                Our Strategic Partners
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We collaborate with international organizations and partners to achieve our climate readiness objectives
              </p>
            </div>

                  {/* Partners Section - UPDATED WITH LOGOS */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                { 
                  name: 'Green Climate Fund',
                  logoUrl: 'data:image/jpeg;base64,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'
                },
                { 
                  name: 'UNDP',
                  logoUrl: 'data:image/jpeg;base64,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'
                },
                { 
                  name: 'World Bank',
                  logoUrl: 'data:image/jpeg;base64,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'
                },
                { 
                  name: 'UNEP',
                  logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAMAAAAt85rTAAAAb1BMVEX///8An+MAnOIAmOEAmuIAneIAl+Ht9/3x+v3F5Pey2/SOyO5atumNy+8AlODh8ft/xO3Q6fi93vWo1vL3/P7e8PprvOtEr+eYz/DM5fd2wezn9PwAkuDK5/dBruee0vEopeQwqeaIyO5Xs+gAjd8C+FqxAAASX0lEQVR4nO1diXajurIVmrAJxswQSDCY8//f+FQlBmFjx9hO97u9tO9atx0hhDaSSqUaOIRYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYbEa6n5GtXK+N6+6jNylERpUHurHD/4u+3Z8qbsYuYCPkeeW6N18P4rHQ/ZoKuUxX2+3lXOOnPhyrQhFM2q+gKC8Z1uvNP44dd0bQj5Xr3nydTUPhMme+K19t1xdzjR+6UAUdITENnJMiUx8Kx+k+Jp5u1SbDAD+Hlwk6Mlpr93GCHac7cuAhNnP48j/Op31mTPyYOnVd1E9wQ7xOULRr7T5EcKcmfUODiBzCgnNaeIRkHEYsO5rV9rm7/y++1civE3R4+STBSBByZlTPAPfkt8wpidt8FSTNg1kguFAhD55cjG8g6PAV2fcAwegrIVnQeB+53/fGAB3LKiVR60ytxpLmbnf4ewSp/wxBlzNCiq6RMuiuhCfQaubCAw/OHfG2kgO8g6Ajr7e6nwkWPCf7Lycv97cmn7nFRvmXWouP85rwFoLCubrvR4KfksfpYcPGHnnpf6sC+z7eQtDhVwvkR4K94PDP8cF5d4atkDWPVTbxHoIOu9yn7hPcu6mkBxKHTvdgP7Ovw44Uwfbt8E0ERXFx312CqRIYzIkcFlTLC9EpL7qu8w/X6zIJZBIHyd8i6LCLjfguQf9EQh5Syhbzc3dwGKVUKFDO88v1dpDS6y5eyB8kKC5o3CNY/3ckftfKfjHhDowKo0F6cZmQUtJzQ7aeN95F0KHhwwTDYEf6oF8MUebwyxaFvJiQe9q2ZO3I80cIOnJxMrxH0JE1aePFGSGWY33K+PRIuZiRKUkbhzgbh/B9BOlCht8hWDO2z9TgJLMOG8upcu6mydQ8M7d22Ck6Ejxyfv4Vgg43RcYdgp+cJzuS9v9NYxFN/ARuGyWd2jRm5F4dq3bZVkH6+oF3+iWoIdvvEqQlyeg8OqmYKlMklM0PNbVAQY9k807xKkHqzwypsWTuEMwYLVMq5jNIZbyk/uKhphaYMKG2w40Hw5cJns5z94zD/T0hw2iSUzlN6OM0QeEhJ/UGzP3CPG22PEy2KjMvEzyQuTtiVrzuEex5Sdm8uHL1hmBzV7s7420Tkb7jYKyCTX95u1qrh2u9/tcJxvNf8P5/InhWMjM3NoA0ULycJj8n+2zaONLjp1dWfas2jXnRpUr/KT42bvVvIEiKmQwfu3ibYKukhVBawTid6zi70+U023+Pv9WjOrkjaxaS3yVYG3+OovEmweNXSnI1z7JR8yk/ks/jrTNvHXnlJG2luksp9fyPEyQHQ6x//0DwO/DISS1AZxyIlsOKo01+8L5nnlGsZqijViKnwWhi+zqR3YmUf4EgcWY50/5AMGIdiY4knxTNQQhrITMU1u0kY4znMmhpJ7edet9DcD9L+kGs3yToSjhZ1ZIPQ50utCKJu1xKqVHGx52vg+NVzraZ195DkBjbPXPvEiQtVRrPibJBsqTmLjjs66HJz+HjWFe8UDuFvOHu+V2CrqF79PcJnriSRDlthz/T5TGJwcAu+M0jGDNJCtpv4vcugmrpT0WoPt7Z6IWQu2I2UwnzmIvtZRd25XGfSBnPmPzzmoxGO8sZ5z7BvaSJP2tczWK8YJ/ZLwnKaZvMWRKU5Ei24G0E5yMPHgluE3RJKf2qI8mwJ5wXBGGCe4tZK8Rw44FEwvfJxjP92wiiSjm+8/oOQXVD5eQJaQa1br+kc0VwPKMkamzhUB1vOy+9j6DRkijuEKzUkioCl/BRM18sQqGGKF4QZMMSbFV9WpM6+EtTVL1is2p+W4pSULCVfjeurYM5R8F2FZkER83hKNVUrchuxU3wpwiSjs696m8SzIJuR7w046P4X2wU6rBv6rbqqd74XkBFS9uN+zzZGX19lWA2yxlz2l1KUbXTR/pcPxScDIb4EONvMSpmPhLsqNxoVTM0JbpmNjbm3bQf3SJo2h7MQbl8Zwwsnq5UL3QQpMZOIeG8VRh60bidtHCa7uiF+fUBGKJhxY9pLhA26Ui3CKYL2/QtgqQRoHMKNYKhHo7Z6nRpVZPDNFYySVHzlY66ld/lBn0JQ1jI6bx9iyC4VB4guBPUkcdQnsip1SW1GCjpaVuPc308cjRpKllWcrHV7EsWO/KVD4yYMtzwPtwkeKGW3CBIaocKcVS9j+VwmnVbfeOggutmxGiY8h3Fuckk656IRCgNs9/p6mp0qUT/QHBhIbtF0CVpLnkXVuTIxhOgOiCK2SAAyprg7bDjndRrcAOPMTW82/300dzZlTlarNK/TfBC8boxgjlENOEFZzaPRh2bRWRB+fQ8dXZUMumr88Cx+ETMkyEYrsKyDBmqVs0jBI3D/W2CEYXFsO8+lQwzZHeUT++wbuah6gVPSQKXvOCZQAvznbPlTuEZE870rdwjGF/JmRUX9jkYqKRcsB/WVSS1MbIuna+nYmVcc9nQbtrsSO0vNArDSXCPIOkvh3AtCCEPnLCMj+BX4tcrf9keODGOB5jAW32DAxbbs2BO6O2jvXfopNlTakYL3CV45XpajbIIJaWccX+fUHp3CKOgJ/tGKrF76Q99GOnyTC3gwYxf7NkLS8hdgqYR8TZBJVOg05Q7VXtP+Ne8+m4YFVQ2204RJvYrsv0Cy0CY+wQv5cytWLWs7FvHac6nEoYmdV13Jjr+lYaHvKVSOlcxCZtQ/sSQL7W4Hwh+L5v7KSBWjWapJCXEHMuu8uq46iTEC3PRHz5foWXgfJ8hu9BSfyBoGhHvEdzDplZ7udrz1CqB0JE4OzUfRXmMVRns+1CWwNRMNzqur5DI1YMAQshLDf4ngruFnLk9gqGgTAITtRYlhMN+FkAkKpSKHfcS5YDgkqnN8tXQbXLs+NpJAKanuHp7PxEkJ5PhnSmaelUjpJRtnoAO04+KRtgoQjsvb9WspWravkwP4DkrFCmnK96qHwmS7s6B9xaOct4Rk2Cb/fox7H2Oq2GYmWr+sGJVNzLSCm5svlHAHk8r0Mi+zH3OeyZ08gF8l3mnpLKaGbz1P26Fqj6QGPK9LTFEoVi+qvLROMRnsHN3b5n1FhYWFhYWFhYWfx7pzeCyfwNewFYSzv4hMLHuivpnIK8zXf4ETlVVPZkHuhGVfNrK/ApyTvkTCXbPIC7/xhLM6UX2yb8GIHiZxvcY0iTv+2p0h59Op5KQfaWK0BMTq4LBHJSoX4mSouofMNZE+O+xKrTddAfN5KMJrNa3xaqdMJtK4O6898/gPzue/T43DDHRh9/7h8EG8qkqx9gzvwT76e6UNEq2dclp++QpJadUUC7QjnwMKA3cAj0HGBzvQQGagHbqFyy+Ri0G8PcmkrIuCqhgcPUwNDM4bT8DymXaMSgLyrGEui3WCmJyVjdSypzBp7mDR4ITwsc39KHa9iPVKVXE1NPrAL0lgrLNqcr5aAQUuLkdwX08uMwd8JJDoI42HkKMFcRaFFSHZIB/tEXbqfrDv0ga+8R2BhsdpoxgyZgLRMPhscOsczHKFxMlWiRIoRf6dhDZtRx/b02ShFwvwcDPo7OPgKAjOKdMDGEdvhh6UVEdWWUShB7BCELAKDTDhteCdKAdzkfn+1yCd1Gm/ueMjiuwpKqboQQpfGC6CKNYmSekHt+f2EoQX3SmhwcCrpEghbhqeP3wNRWIdsKvqsD7P1wSFLz3G7TWCyeCHLFhk9TjpVZxpP7BmEhdkg1eYAEfAgD3Mjrj4RlALIWgRXDVI0H4RgdewWn5nJDx+BjiU1IcMCCoM+XGGQnRUODghfAVrGoSHMKHTlMzeFes6XBcuieqXxCWYB2IXdF+T67j72AAh8Qg9Q4gShsIamWip8Ol57aJXIzxYJkeKCT4PRZgF3uBvVB8tIZmEhzs1v7UQRznStPRkTdIeWeWhHSMIux05Z2c8g/VNRiwmeBU+TmCLRAsPz4+Soh1V8+fCUKQDP5SowyP8IcZukawFVMWb66X7CaCEc5Q7Eavb8cpilXOrxFE2UURDs6gC4KwdUDoP3Ohqp6FKwTpKGmn3m8iiDGwuheDaPsNghT3uxWCMEe5l7GxV79KUIG/k6BQU7Q4jDhfTVEkqOYorZSs0BmoawRh4Q3697CqNxGE2C1aTd0o30gQOru4a41gCoNXCIdFtwgWswiH5ZhvJAgxbnyRvPo2ghAQOsZ9J7cIwhwV8yl3hWBJx85D8BvI+U0EYQaM0dmpd4fg9n0QA50o6Gi7MPBvEdSRzeMkXCEIe6SAUDlUD1i6lSAE19AC/NhRh6ny6wSd+1FDqziDWsGdQqnFDg9vENRhBcMMXSNIKugha9DVjxlo2whicI3gXeEoDRGUtxWCB1SS2s2e0R4VJxTPEEG8ShDUidkOs0ZQx9yjAxxPGlsJHrkYu0HbdJWgTq4R212/Zzl84wR0STwu6TzOaPoFgYdKOR7DSYzjEg2mZnIJ30qhdEhA/oSLmiD82pklIR+jr1u1Kej6Lgakwf14XvpQ5yyd6xmysXIlocITvm237Nu2y7UUc6swrHA/r6dfao4av0kZhiFoyHsonJvJwqZtm/MQU5bBRQxwjeBXapZ4qgG9ng/q13jm/a46uF8/xVOVw4tfJFb9bP6M3cnCwsLCwsLCwsLibdhdpR7OaQzu5bWrAgKpDvPV61Pp9EHw6+fMJZdfDXdf+L72hH3XdD45OVKyPptKCnKi8guf5zVMXTOyweqcSikqUqp6cBBo1L9R3cgA1Xyv4JLJ9qD7elLXKhJ3TBV5cCYRUnJfJ2J2cB8J4cm54rhvVCXHCNuGm6j/cuZEzAR1coanTZ1xiSUnKfAsu+s41dHp3fCiv5m2NLYFFXh0V6dcXgptFAbnGJ5KucBT04EL2oeYsyBkUg/f2dKnXnX64ydHl1A4lEKlMUVDNSS0x2v7FzcvCHIdgI4PwhxBbaN08LCeoiVBW2MdHJSa6R4JOLxTTVCf5BVBTIOiDP1SAqqXaGUQ+gM4ohVCO/nQdIR1hTY4046OXUD/JjakS9iL0QCaThtWkCeMaaz6SwuC82Cw87RhCP5C/bVpH7tchR3eNxLE1I4DOot4FX1DJRxdTKDlTZgP4+qH6EbETE/kwPOwGGwdVdhOWa7QAO3OIXRq47cd1giiVSRFb5k7EGS+FyfaVoYWFsgKBFsQlrS7oe8TQeqUsRcRRy0bfA3d4FKcKuHnCvEzsuBrwmREtEMCU8jv05aWdjBNwicHkCl0arPH85ogQ2n1zbWHJ548utraiWsPzGqwyJLRIYOOxZGgaLVMmfIMwKrkjATJSLkfW8KvGMGyxceAcUubZqE6GGIO020ed16MOUKCWn5w/bkHLNEd9iffGpjVYEyq6dEmweXnAupjXV0R7OnoSoTRWRDMJr8hjC5PMc1caFf8cXr/byDYaZs7unp1m8YEOesu9+NALAlOn8HIKgdS40Yj40yw2EIQrY8tAsTMS4vQIDi85HnSmn0/aDvl3M9VgiEGZ6BkfIWgNoAinDcSNEaQzSM4SGmIeqDmTFsjWEKZE55O/dUU3UQQTdFT9tPXS4laBkGhvbQGwWamk2tPeT67qlcITj7782aCkzcfCILcyutsxEvBqTNBSJqDiAeDIAjD4ZtRjh5edEalNwhGU09fJOjPvqaXgXT2Q6fQvWIQhA9K6Q/TYTCGp/0L2hlfXxPE6jifcvESQdyMBsncPP2fe5kJqgfWNTiwsFMGQdzEeVnXkNKpxxJLwqMbO+KKYIZ6Qap0ar5ZyCwI4vcneB65x0St6dfCp7ViRpkOOvIuCGJC9XgRfRfxUIK68OUaRLWUOTohmL9AEDPfITNbMb1IAX+K4BATppsyCZJk/B6CkEOMQcWGmLEVgtFQGxVoiP15lqCRNc3b10eQf7fgrBqyreOA869JeYhaCCLkrJ2iGDGqkNPvUc2E7/COjrUI/4MDMo9UG/DpkEOAOrtCI7lWU8mXKoJjn5oF+giZQQkSLKG65pM18Bj14FdDi4fx2pcfyXDgc6Mo+jZqZElZJmZG7c4ry1hrdtBRVT2at2LV0En99a0La7ioW1E/9H4Gl+rhPhQgqSr5xjdam4+uPdXU65HFxj74IKL5Rv4/kFywmWCpv1pzBIHCfqlT78RWgpF0uJNXPZzat36l7q9gK8Gz1KFfeFL/vW69D7ESe5s+p5dwDmfxKdjg/zv2XdN0m4RMmvhKvSg+XlShLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCzejP8DMQcPHBnYmHgAAAAASUVORK5CYII='
                },
                { 
                  name: 'FAO',
                  logoUrl: 'data:image/png;base64,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'
                },
                { 
                  name: 'AfDB',
                  logoUrl: 'https://landportal.org/sites/default/files/2024-03/African_Development_Bank_AfDB_logo.jpg'
                },
                { 
                  name: 'IGAD',
                  logoUrl: 'data:image/png;base64,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'
                },
                { 
                  name: 'Local NGOs',
                  logoUrl: 'https://www.oss-online.org/sites/default/files/2025-08/Logo-OSS_Vect_En.png'
                }
              ].map((partner, index) => (
                <div
                  key={index}
                  className={`partner-card animate-on-scroll delay-${((index % 8) + 1) * 100} rounded-2xl p-6 shadow-lg`}
                >
                  <div className="flex items-center justify-center h-full">
                    <img 
                      src={partner.logoUrl} 
                      alt={`${partner.name} logo`}
                      className="partner-logo"
                    />
                  </div>
                </div>
              ))}
            </div>


          </div>
        </section>
          </div>
        </section>

        {/* Coordination Mechanisms Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-400 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-400 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-semibold tracking-wider uppercase">
                Framework
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 mt-4">
                Coordination Mechanisms
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Structured approaches to ensure effective stakeholder collaboration and project coordination
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  title: 'Steering Committee',
                  description: 'High-level inter-ministerial committee providing strategic guidance, policy direction, and coordination for climate finance initiatives.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: 'Technical Review',
                  description: 'Technical working groups and expert panels reviewing project proposals to ensure alignment with GCF criteria and national priorities.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8c0 1.574-.512 3.042-1.395 4.28l1.395 3.72-5.745-1.949A9.863 9.863 0 0121 4z" />
                    </svg>
                  ),
                  title: 'Stakeholder Forums',
                  description: 'Regular consultation forums and workshops ensuring inclusive participation of civil society, private sector, and vulnerable communities.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  ),
                  title: 'Documentation & Communication',
                  description: 'Clear processes for document sharing, information dissemination, and maintaining transparent communication channels with all stakeholders.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ),
                  title: 'Feedback Mechanisms',
                  description: 'Established feedback loops and grievance mechanisms allowing stakeholders to provide input and raise concerns throughout project cycles.'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ),
                  title: 'Capacity Building',
                  description: 'Joint capacity building activities strengthening stakeholder understanding of GCF processes, climate finance, and project development requirements.'
                }
              ].map((mechanism, index) => (
                <div key={index} className={`glass-dark rounded-2xl p-6 animate-on-scroll delay-${(index + 1) * 100}`}>
                  <div className="text-yellow-400 mb-4">{mechanism.icon}</div>
                  <h3 className="font-heading text-xl font-bold text-white mb-3">
                    {mechanism.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {mechanism.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Engagement Process Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll">
                <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold tracking-wider uppercase mb-4">
                  Process
                </span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                  Stakeholder Engagement Process
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Our stakeholder engagement follows a structured approach ensuring meaningful participation, transparency, and inclusive decision-making throughout climate finance processes.
                </p>

                <div className="space-y-6">
                  {[
                    { step: '01', title: 'Mapping & Analysis', desc: 'Identify and analyze key stakeholders, their interests, capacities, and potential roles in climate action.' },
                    { step: '02', title: 'Consultation', desc: 'Conduct targeted consultations to gather inputs, concerns, and suggestions from stakeholder groups.' },
                    { step: '03', title: 'Collaboration', desc: 'Work together with stakeholders in project design, ensuring ownership and alignment with needs.' },
                    { step: '04', title: 'Feedback & Learning', desc: 'Establish mechanisms for continuous feedback, learning, and adaptation based on stakeholder input.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-start">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {item.step}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-heading text-xl font-bold text-primary mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-600">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="animate-on-scroll delay-200">
                <div className="glass-card rounded-3xl p-8 gradient-border shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-primary">Inclusive Engagement</h3>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    We are committed to ensuring that vulnerable groups, including women, youth, and marginalized communities, have meaningful participation in climate finance decision-making processes.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                      <p className="text-gray-700">Gender-responsive consultation approaches</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                      <p className="text-gray-700">Representation from all stakeholder groups</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                      <p className="text-gray-700">Accessible information and communication channels</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                      <p className="text-gray-700">Transparent and accountable processes</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                      <p className="text-gray-700">Continuous learning and improvement</p>
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

export default PartnersCoordination
