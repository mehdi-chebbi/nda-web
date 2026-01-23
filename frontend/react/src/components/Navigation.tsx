import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

 const navLinks = [
    { path: '/resources', label: 'Resources – Offline Library' },
    { path: '/press-release', label: 'Press Release' }
  ]

  const gcfLinks = [
    { path: '/mission', label: 'Mission' },
    { path: '/gcf-project', label: 'GCF & Climate Finance' },
    { path: '/gcf-stages', label: 'GCF stages' },
    { path: '/sustainable-development', label: 'Sustainable Development' },
    { path: '/learning-modules', label: 'Learning Modules' },
    { path: '/project-development', label: 'Project Development' }
  ]
  return (
    <nav className="bg-primary shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
           <img 
              src="https://cdn.britannica.com/09/09-050-E3476052/Flag-Eritrea.jpg" 
              alt="Eritrea Flag" 
              className="h-10 w-16 object-cover rounded shadow-sm"
            />
          <Link to="/" className="flex items-center space-x-3">
           
            <span className="text-white font-heading font-semibold text-xl">
              Readiness Eritrea
            </span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {/* Home Link */}
            <Link
              to="/"
              className={`${
                location.pathname === '/'
                  ? 'text-secondary-light'
                  : 'text-white hover:text-secondary-light'
              } font-body text-sm font-medium transition-colors duration-200`}
            >
              Home
            </Link>

            {/* About NDA Link - Standalone */}
            <Link
              to="/about"
              className={`${
                location.pathname === '/about'
                  ? 'text-secondary-light'
                  : 'text-white hover:text-secondary-light'
              } font-body text-sm font-medium transition-colors duration-200`}
            >
              About NDA
            </Link>

            {/* Readiness Dropdown */}
            <div
              className="relative group"
            >
              <button
                className={`${
                  gcfLinks.some(link => location.pathname === link.path)
                    ? 'text-secondary-light'
                    : 'text-white hover:text-secondary-light'
                } font-body text-sm font-medium transition-colors duration-200 flex items-center space-x-1`}
              >
                <span>Readiness</span>
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {gcfLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${
                      location.pathname === link.path
                        ? 'bg-primary-light text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    } block px-4 py-3 font-body text-sm font-medium transition-colors duration-200`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative group"
            >
              <button
                className={`${
                  navLinks.some(link => location.pathname === link.path)
                    ? 'text-secondary-light'
                    : 'text-white hover:text-secondary-light'
                } font-body text-sm font-medium transition-colors duration-200 flex items-center space-x-1`}
              >
                <span>Resources</span>
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${
                      location.pathname === link.path
                        ? 'bg-primary-light text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    } block px-4 py-3 font-body text-sm font-medium transition-colors duration-200`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Partners & Coordination Link - Standalone */}
            <Link
              to="/partners-coordination"
              className={`${
                location.pathname === '/partners-coordination'
                  ? 'text-secondary-light'
                  : 'text-white hover:text-secondary-light'
              } font-body text-sm font-medium transition-colors duration-200`}
            >
              Partners & Coordination
            </Link>

            {/* Contact & Support Link - Standalone */}
            <Link
              to="/contact"
              className={`${
                location.pathname === '/contact'
                  ? 'text-secondary-light'
                  : 'text-white hover:text-secondary-light'
              } font-body text-sm font-medium transition-colors duration-200`}
            >
              Contact & Support
            </Link>

            {/* Workspace Link - Standalone */}
            <Link
              to="/admin"
              className={`${
                location.pathname === '/admin'
                  ? 'text-secondary-light'
                  : 'text-white hover:text-secondary-light'
              } font-body text-sm font-medium transition-colors duration-200`}
            >
              Workspace
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-secondary-light">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden hidden bg-primary-dark">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* Home */}
          <Link
            to="/"
            className={`${
              location.pathname === '/'
                ? 'text-secondary-light bg-primary'
                : 'text-white hover:text-secondary-light'
            } block px-3 py-2 rounded-md text-base font-body font-medium`}
          >
            Home
          </Link>

          {/* About NDA */}
          <Link
            to="/about"
            className={`${
              location.pathname === '/about'
                ? 'text-secondary-light bg-primary'
                : 'text-white hover:text-secondary-light'
            } block px-3 py-2 rounded-md text-base font-body font-medium`}
          >
            About NDA
          </Link>

          {/* Mobile Readiness Section */}
          <div className="border-t border-primary-light/30 pt-2 mt-2">
            <div className="px-3 py-1 text-xs text-secondary-light uppercase tracking-wider font-semibold">
              Readiness
            </div>
            {gcfLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  location.pathname === link.path
                    ? 'text-secondary-light bg-primary'
                    : 'text-white hover:text-secondary-light'
                } block px-3 py-2 pl-6 rounded-md text-base font-body font-medium`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Resources Section */}
          <div className="border-t border-primary-light/30 pt-2 mt-2">
            <div className="px-3 py-1 text-xs text-secondary-light uppercase tracking-wider font-semibold">
              Resources
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  location.pathname === link.path
                    ? 'text-secondary-light bg-primary'
                    : 'text-white hover:text-secondary-light'
                } block px-3 py-2 pl-6 rounded-md text-base font-body font-medium`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Partners & Coordination */}
          <Link
            to="/partners-coordination"
            className={`${
              location.pathname === '/partners-coordination'
                ? 'text-secondary-light bg-primary'
                : 'text-white hover:text-secondary-light'
            } block px-3 py-2 rounded-md text-base font-body font-medium`}
          >
            Partners & Coordination
          </Link>

          {/* Contact & Support */}
          <Link
            to="/contact"
            className={`${
              location.pathname === '/contact'
                ? 'text-secondary-light bg-primary'
                : 'text-white hover:text-secondary-light'
            } block px-3 py-2 rounded-md text-base font-body font-medium`}
          >
            Contact & Support
          </Link>

          {/* Workspace */}
          <Link
            to="/admin"
            className={`${
              location.pathname === '/admin'
                ? 'text-secondary-light bg-primary'
                : 'text-white hover:text-secondary-light'
            } block px-3 py-2 rounded-md text-base font-body font-medium`}
          >
            Workspace
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation