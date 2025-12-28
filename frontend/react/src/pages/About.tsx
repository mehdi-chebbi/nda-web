import Card from '../components/Card'

const About = () => {
  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-heading font-bold text-4xl text-primary mb-4">
            About Us
          </h1>
          <p className="font-body text-text-secondary text-lg">
            Learn about the National Designated Authority and our mission to advance climate action in Eritrea
          </p>
        </div>

        {/* About NDA */}
        <section className="mb-16">
          <Card className="p-8 md:p-12">
            <h2 className="font-heading font-semibold text-3xl text-primary mb-6">
              National Designated Authority
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p className="leading-relaxed">
                The National Designated Authority (NDA) for Eritrea is the official entity accredited
                by the Green Climate Fund (GCF) to serve as the focal point for climate finance
                coordination and engagement. Operating under the Ministry of Land, Water and Environment,
                the NDA plays a critical role in advancing Eritrea's climate resilience and sustainable
                development objectives.
              </p>
              <p className="leading-relaxed">
                As the NDA, we are responsible for facilitating access to GCF resources, coordinating
                with national stakeholders, ensuring alignment with national priorities, and overseeing
                the implementation of climate projects that deliver transformative impacts for communities
                across Eritrea.
              </p>
            </div>
          </Card>
        </section>

        {/* Role & Responsibilities */}
        <section className="mb-16">
          <h2 className="font-heading font-semibold text-3xl text-primary mb-8 text-center">
            Our Role & Responsibilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Strategic Coordination',
                description: 'Coordinate with government agencies, civil society, and private sector to align climate initiatives with national development priorities.'
              },
              {
                title: 'Project Facilitation',
                description: 'Support the development and submission of funding proposals to the GCF, ensuring high-quality, impactful projects.'
              },
              {
                title: 'Stakeholder Engagement',
                description: 'Engage with diverse stakeholders to build consensus and ensure inclusive participation in climate action.'
              },
              {
                title: 'Capacity Building',
                description: 'Strengthen institutional and technical capacities to effectively manage climate finance and implement projects.'
              },
              {
                title: 'Knowledge Management',
                description: 'Document and share lessons learned, best practices, and innovations in climate resilience and adaptation.'
              },
              {
                title: 'Policy Alignment',
                description: 'Ensure all climate interventions align with Eritrea\'s National Adaptation Plan and Nationally Determined Contributions.'
              }
            ].map((item, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-heading font-semibold text-xl text-primary mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Readiness Program */}
        <section className="mb-16">
          <Card className="p-8 md:p-12">
            <h2 className="font-heading font-semibold text-3xl text-primary mb-6">
              The Readiness Program
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p className="leading-relaxed">
                The Readiness Program is a GCF initiative designed to strengthen countries' institutional
                capacities, governance frameworks, and planning processes to effectively engage with climate
                finance. Through this program, Eritrea is building the foundation for sustained climate action
                and long-term resilience.
              </p>
              <p className="leading-relaxed">
                Our Readiness activities focus on enhancing institutional arrangements, developing robust
                project pipelines, strengthening monitoring and evaluation systems, and fostering partnerships
                that maximize the impact of climate investments in Eritrea.
              </p>
            </div>
          </Card>
        </section>

        {/* Partners */}
        <section>
          <h2 className="font-heading font-semibold text-3xl text-primary mb-8 text-center">
            Our Partners
          </h2>
          <Card className="p-8">
            <p className="font-body text-text-secondary text-center mb-8 max-w-3xl mx-auto">
              We collaborate with a diverse range of partners to achieve our climate readiness objectives,
              including international organizations, development partners, academic institutions, and civil
              society organizations.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                'Green Climate Fund',
                'UNDP',
                'World Bank',
                'UNEP',
                'FAO',
                'AfDB',
                'IGAD',
                'Local NGOs'
              ].map((partner, index) => (
                <div
                  key={index}
                  className="bg-bg-secondary rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                >
                  <span className="font-body font-medium text-primary text-sm">
                    {partner}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default About
