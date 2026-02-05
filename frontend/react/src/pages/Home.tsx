import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Slideshow from '../components/Slideshow'

interface StatType {
  label: string;
  value: string;
}

const AnimatedStat = ({ stat, index }: { stat: StatType; index: number }) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const targetValue = parseFloat(stat.value.replace(/[^0-9.]/g, ''))
    const duration = 2000
    const steps = 60
    const increment = targetValue / steps
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      if (currentStep <= steps) {
        setCount(increment * currentStep)
      } else {
        clearInterval(timer)
        setCount(targetValue)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [isVisible, stat.value])

  const formatValue = (value: number) => {
    const originalValue = stat.value
    if (originalValue.includes('M')) {
      return `$${value.toFixed(1)}M`
    } else if (originalValue.includes('+')) {
      return `${Math.floor(value)}+`
    }
    return Math.floor(value)
  }

  return (
    <div
      ref={ref}
      className="relative group cursor-default"
      style={{
        animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none'
      }}
    >
      <div className="relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:border-secondary/20 group-hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
        
        <div className="relative z-10">
          <div className="font-heading font-bold text-5xl md:text-6xl bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent mb-3 transition-all duration-300 group-hover:scale-105">
            {isVisible ? formatValue(count) : stat.value}
          </div>
          
          <div className="h-px w-12 bg-gradient-to-r from-secondary to-transparent mb-3 transition-all duration-500 group-hover:w-full" />
          
          <div className="font-body text-xs text-text-secondary uppercase tracking-widest transition-all duration-300 group-hover:text-primary group-hover:tracking-[0.2em]">
            {stat.label}
          </div>
        </div>
        
        <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -bottom-1 -left-1 w-20 h-20 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  )
}

const Home = () => {
  const statistics = [
    { label: 'Projects Initiated', value: '15+' },
    { label: 'Funding Mobilized', value: '$2.5M' },
    { label: 'Key Sectors', value: '6' },
    { label: 'Strategic Partners', value: '8' }
  ]

  return (
    <div className="bg-bg-primary">
      {/* Slideshow Hero Section */}
      <Slideshow/>

      {/* Mission Showcase Section */}
      <section className="min-h-screen bg-primary text-center py-20 px-8 xl:px-0 flex flex-col justify-center">
        <span className="text-secondary-light text-lg max-w-lg mx-auto mb-2 capitalize flex items-center justify-center">
          gcf readiness programme
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-secondary ml-3 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>
        </span>

        <h1 className="text-white text-4xl md:text-5xl xl:text-6xl font-semibold max-w-3xl mx-auto mb-16 leading-snug">
          Readiness Project & Platform Objectives
        </h1>

        <div className="text-left grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="card bg-primary-dark p-10 relative group">
            <div className="circle"></div>
            <div className="relative lg:pr-52">
              <h2 className="font-serif capitalize text-white mb-4 text-2xl xl:text-3xl">
                Strengthening<br />NDA
              </h2>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-500">
                Reinforcing institutional mandate, governance, and coordination roles
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card bg-primary-dark p-10 relative group">
            <div className="circle"></div>
            <div className="relative lg:pl-48">
              <h2 className="font-serif capitalize text-white mb-4 text-2xl xl:text-3xl">
                Building<br />Capacities
              </h2>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-500">
                Enabling stakeholders to develop high-quality, GCF-compliant projects and programmes
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card bg-primary-dark p-10 relative group">
            <div className="circle"></div>
            <div className="relative lg:pr-44">
              <h2 className="font-serif capitalize text-white mb-4 text-2xl xl:text-3xl">
                Enhancing<br />Coordination
              </h2>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-500">
                Supporting consultation and collaboration among ministries, accredited entities, civil society, and private sector
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="card bg-primary-dark p-10 relative group">
            <div className="circle"></div>
            <div className="relative lg:pl-48">
              <h2 className="font-serif capitalize text-white mb-4 text-2xl xl:text-3xl">
                Supporting<br />Pipeline
              </h2>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-500">
                Improving identification, prioritization, and readiness of climate investment opportunities
              </p>
            </div>
          </div>
        </div>

        {/* Readiness Programme Description */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            The <strong className="text-white">Readiness and Preparatory Support Programme</strong> of <strong className="text-white">Green Climate Fund (GCF)</strong> aims to strengthen national capacities to effectively access climate finance and align climate actions with national development priorities.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            The <strong className="text-white">Climate Finance Platform</strong> is a core output of this Readiness project. It serves as an <strong className="text-white">offline-oriented, knowledge management and capacity-building tool</strong>, providing structured access to GCF guidance, national policies, templates, learning modules, and practical project development resources. Primary users include NDA Secretariat, government agencies, implementing entities, and other stakeholders engaged in climate action. By offering tailored pathways for different users, the platform supports strategic decision-making, technical learning, and strengthened project readiness, thereby contributing to sustained and effective engagement with GCF.
          </p>
        </div>

        {/* Inline Styles for added section */}
        <style>{`
          @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&display=swap");

          .font-serif {
            font-family: "Playfair Display", serif;
          }

          .card {
            position: relative;
            overflow: hidden;
            transition: box-shadow 0.3s ease;
          }

          .card::before {
            position: absolute;
            content: "";
            width: 100%;
            height: 100%;
            transition: 0.6s;
            z-index: 0;
            background-color: #c9a227;
          }

          .card:hover {
            box-shadow: 0.063rem 0.063rem 1.25rem 0.375rem rgb(0 0 0 / 53%);
          }

          /* Specific positioning and clip-path for each card's background overlay */
          .card:nth-child(1)::before {
            bottom: 0;
            right: 0;
            clip-path: circle(calc(6.25rem + 7.5vw) at 100% 100%);
          }

          .card:nth-child(2)::before {
            bottom: 0;
            left: 0;
            clip-path: circle(calc(6.25rem + 7.5vw) at 0% 100%);
          }

          .card:nth-child(3)::before {
            top: 0;
            right: 0;
            clip-path: circle(calc(6.25rem + 7.5vw) at 100% 0%);
          }

          .card:nth-child(4)::before {
            top: 0;
            left: 0;
            clip-path: circle(calc(6.25rem + 7.5vw) at 0% 0%);
          }

          .card:hover::before {
            clip-path: circle(110vw at 100% 100%);
          }

          /* Image Circle Logic */
          .circle {
            display: none;
          }

          @media (min-width: 62.5rem) {
            .circle {
              display: block;
              position: absolute;
              width: 100%;
              height: 100%;
              z-index: 0;
            }
          }

          .card:nth-child(1) .circle {
            background: url("https://c1.wallpaperflare.com/preview/555/211/617/panel-solar-power-energy.jpg")
                no-repeat 50% 50% / cover;
            bottom: 0;
            right: 0;
            clip-path: circle(calc(6.25rem + 7.5vw) at 100% 100%);
          }

          .card:nth-child(2) .circle {
            background: url("https://c1.wallpaperflare.com/preview/625/297/117/faculty-workshop-professional-training-academic.jpg")
                no-repeat 50% 50% / cover;
            bottom: 0;
            left: 0;
            clip-path: circle(calc(6.25rem + 7.5vw) at 0% 100%);
          }

          .card:nth-child(3) .circle {
            background: url("https://c1.wallpaperflare.com/preview/287/387/676/cereals-field-field-crops-agriculture.jpg")
                no-repeat 50% 50% / cover;
            top: 0;
            right: 0;
            clip-path: circle(calc(6.25rem + 7.5vw) at 100% 0%);
          }

          .card:nth-child(4) .circle {
            background: url("https://c0.wallpaperflare.com/preview/72/63/637/coast-wind-turbine-sea-sky.jpg")
                no-repeat 50% 50% / cover;
            top: 0;
            left: 0;
            clip-path: circle(calc(6.25rem + 7.5vw) at 0% 0%);
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
        `}</style>
      </section>
      {/* END MISSION SECTION */}

 
<section className="py-16 md:py-24 bg-bg-primary"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div className="text-center mb-12"> <h2 className="font-heading font-semibold text-3xl md:text-4xl text-primary mb-4"> Climate Action Across Eritrea </h2> <p className="font-body text-lg text-text-secondary max-w-2xl mx-auto"> Our initiatives span the entire nation, bringing sustainable development and climate resilience to communities across all regions. </p> </div> <div className="flex justify-center items-center"> <div className="relative w-full max-w-2xl"> <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl blur-3xl"></div> <div className="relative bg-white p-8 md:p-12 rounded-2xl shadow-xl"> <img src="/Eritrea_location_map.svg" alt="Map of Eritrea" className="w-full h-auto drop-shadow-lg hover:scale-105 transition-transform duration-500" /> </div> </div> </div> </div> </section>
      {/* Statistics */}
<section className="py-16 md:py-24 bg-bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <AnimatedStat key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-semibold text-3xl md:text-4xl text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="font-body text-lg text-gray-300 mb-8">
            Explore our resources to learn more about Eritrea's climate readiness initiatives
            and how you can contribute to our shared vision of a sustainable future.
          </p>
          <Link to="/resources">
            <button className="bg-secondary hover:bg-secondary-light text-white font-body font-medium px-8 py-3 rounded-md transition-colors duration-200 shadow-md">
              Browse Documents
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home