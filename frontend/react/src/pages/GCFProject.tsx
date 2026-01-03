import Card from '../components/Card'
import Cycle from '../components/cycle'

const GCFProject = () => {
  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-heading font-bold text-4xl text-primary mb-4">
            GCF Activities
          </h1>
          <p className="font-body text-text-secondary text-lg">
            Green Climate Fund Project Cycle
          </p>
        </div>
      <Cycle/>

        {/* Project Cycle */}
        <section className="mb-16">
          <Card className="p-8 md:p-12">
            <h2 className="font-heading font-semibold text-3xl text-primary mb-6">
              Green Climate Fund Project Cycle
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p className="leading-relaxed">
                The Green Climate Fund follows a structured project cycle to ensure that climate finance
                investments deliver transformative impacts and align with country priorities.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default GCFProject
