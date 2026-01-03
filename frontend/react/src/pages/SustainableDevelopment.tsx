import Card from '../components/Card'

const SustainableDevelopment = () => {
  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-heading font-bold text-4xl text-primary mb-4">
            Sustainable Development
          </h1>
          <p className="font-body text-text-secondary text-lg">
            Building climate-resilient communities through strategic partnerships
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-16">
          <Card className="p-8 md:p-12">
            <h2 className="font-heading font-semibold text-3xl text-primary mb-6">
              Building Resilient Communities
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p className="leading-relaxed">
                Building climate-resilient communities through strategic partnerships and effective
                climate finance mechanisms.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default SustainableDevelopment
