import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Slideshow from '../components/Slideshow'

const Home = () => {
  const slides = [
    {
      title: 'Readiness Eritrea',
      description: 'National Designated Authority - Advancing climate action, building resilience, and securing a sustainable future for Eritrea through Green Climate Fund',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1920&q=80',
      link: '/about',
      linkText: 'Learn More'
    },
    {
      title: 'Climate Finance',
      description: 'Facilitating access to climate finance and supporting transformative projects that enhance climate resilience across Eritrea',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1920&q=80',
      link: '/resources',
      linkText: 'Explore Resources'
    },
    {
      title: 'Sustainable Development',
      description: 'Building climate-resilient communities through strategic partnerships and effective climate finance mechanisms',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1920&q=80',
      link: '/about',
      linkText: 'Discover More'
    },
    {
      title: 'Water Security',
      description: 'Enhancing water management and access across Eritrea through innovative climate-resilient solutions',
      image: 'https://images.unsplash.com/photo-1541185934-01b600ea069c?auto=format&fit=crop&w=1920&q=80',
      link: '/resources',
      linkText: 'View Projects'
    }
  ]

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
      <Slideshow slides={slides} />

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <h2 className="font-heading font-semibold text-3xl text-primary mb-4">
                Our Mission
              </h2>
              <p className="font-body text-text-secondary leading-relaxed">
                To serve as Eritrea's National Designated Authority for Green Climate Fund,
                facilitating access to climate finance and supporting the implementation of
                transformative projects that enhance climate resilience and promote low-emission
                development across the nation.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="font-heading font-semibold text-3xl text-primary mb-4">
                Our Vision
              </h2>
              <p className="font-body text-text-secondary leading-relaxed">
                A climate-resilient Eritrea where sustainable development, environmental
                stewardship, and adaptive capacity are strengthened through strategic
                partnerships and effective climate finance mechanisms for the benefit of
                current and future generations.
              </p>
            </Card>
          </div>
        </div>
      </section>

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
