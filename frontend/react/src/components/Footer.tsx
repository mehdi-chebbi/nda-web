const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-secondary-light">
              Readiness Eritrea
            </h3>
            <p className="text-gray-300 font-body text-sm leading-relaxed">
              National Designated Authority for the Green Climate Fund.
              Advancing climate action and building resilience in Eritrea.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-secondary-light">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/resources" className="text-gray-300 hover:text-secondary-light font-body text-sm transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-secondary-light font-body text-sm transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-secondary-light font-body text-sm transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-secondary-light">
              Contact
            </h3>
            <address className="not-italic text-gray-300 font-body text-sm leading-relaxed">
              <p className="mb-2">Ministry of Land, Water and Environment</p>
              <p className="mb-2">Asmara, Eritrea</p>
              <p className="mb-2">Email: info@readiness-eritrea.er</p>
              <p>Phone: +291 1 123456</p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary">
          <p className="text-center text-gray-400 font-body text-sm">
            © {new Date().getFullYear()} Readiness Eritrea - National Designated Authority.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
