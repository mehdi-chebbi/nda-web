import Card from '../components/Card'

const Mission = () => {
  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-heading font-bold text-4xl text-primary mb-4">
            Our Mission
          </h1>
          <p className="font-body text-text-secondary text-lg">
            Advancing Eritrea Climate Resilience
          </p>
        </div>

        {/* Mission Statement */}
        <section className="mb-16">
          <Card className="p-8 md:p-12">
            <h2 className="font-heading font-semibold text-3xl text-primary mb-6">
              Advancing Climate Resilience
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p className="leading-relaxed">
                To serve as Eritrea's National Designated Authority for Green Climate Fund,
                facilitating access to climate finance and supporting the implementation of
                transformative projects that enhance climate resilience and promote low-emission
                development across the nation.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default Mission
