import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Slideshow from '../components/Slideshow'
import Carousel from '../components/carousel'; // adjust path as needed


const Home = () => {


  const focusAreas = [
    { title: 'Water Security', description: 'Enhancing water management and access across Eritrea' },
    { title: 'Agriculture', description: 'Building climate-resilient agricultural systems' },
    { title: 'Renewable Energy', description: 'Promoting clean energy solutions and sustainability' },
    { title: 'Coastal Resilience', description: 'Protecting coastal communities and ecosystems' },
    { title: 'Forest Conservation', description: 'Preserving and restoring forest ecosystems' },
    { title: 'Urban Development', description: 'Creating sustainable and resilient cities' }
  ]

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
            our commitment
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-secondary ml-3 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </span>

          <h1 className="text-white text-4xl md:text-5xl xl:text-6xl font-semibold max-w-3xl mx-auto mb-16 leading-snug">
            Building a Resilient Future
          </h1>

          <div className="text-left grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="card bg-primary-dark p-10 relative group">
              <div className="circle"></div>
              <div className="relative lg:pr-52">
                <h2 className="font-serif capitalize text-white mb-4 text-2xl xl:text-3xl">
                  Climate <br />Finance
                </h2>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-500">
                  Accessing Green Climate Fund resources for transformative projects across Eritrea's priority sectors.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card bg-primary-dark p-10 relative group">
              <div className="circle"></div>
              <div className="relative lg:pl-48">
                <h2 className="font-serif capitalize text-white mb-4 text-2xl xl:text-3xl">
                  Capacity <br />Building
                </h2>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-500">
                  Strengthening institutional frameworks and technical expertise for effective climate action.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card bg-primary-dark p-10 relative group">
              <div className="circle"></div>
              <div className="relative lg:pr-44">
                <h2 className="font-serif capitalize text-white mb-4 text-2xl xl:text-3xl">
                  Adaptation <br />Strategies
                </h2>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-500">
                  Implementing climate-resilient solutions that protect communities and ecosystems.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="card bg-primary-dark p-10 relative group">
              <div className="circle"></div>
              <div className="relative lg:pl-48">
                <h2 className="font-serif capitalize text-white mb-4 text-2xl xl:text-3xl">
                  Sustainable<br />Development
                </h2>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-500">
                  Promoting low-emission development pathways for a sustainable future.
                </p>
              </div>
            </div>
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
          `}</style>
        </section>
        {/* END MISSION SECTION */}
<Carousel/>

      {/* Focus Areas */}
      <section className="py-16 md:py-24 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-primary mb-4">
              Key Focus Areas
            </h2>
            <p className="font-body text-text-secondary max-w-2xl mx-auto">
              Our strategic priorities align with Eritrea's National Adaptation Plan and
              Nationally Determined Contributions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {focusAreas.map((area, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow duration-200">
                <h3 className="font-heading font-semibold text-xl text-primary mb-3">
                  {area.title}
                </h3>
                <p className="font-body text-text-secondary text-sm">
                  {area.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-heading font-bold text-4xl md:text-5xl text-primary mb-2">
                  {stat.value}
                </div>
                <div className="font-body text-sm text-text-secondary uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
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
