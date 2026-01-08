import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

 const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/mission', label: 'Mission' },
    { path: '/gcf-project', label: 'GCF Project' },
    { path: '/sustainable-development', label: 'Sustainable Development' },
    { path: '/resources', label: 'Resources' },
    { path: '/contact', label: 'Contact' },
        { path: '/about', label: 'About Us' },
    { path: '/admin', label: 'Workspace' }
  ]
  return (
    <nav className="bg-primary shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-white font-heading font-semibold text-xl">
              Readiness Eritrea
            </span>
            <span className="text-secondary-light text-sm font-body">NDA</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  location.pathname === link.path
                    ? 'text-secondary-light'
                    : 'text-white hover:text-secondary-light'
                } font-body text-sm font-medium transition-colors duration-200`}
              >
                {link.label}
              </Link>
            ))}
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
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${
                location.pathname === link.path
                  ? 'text-secondary-light bg-primary'
                  : 'text-white hover:text-secondary-light'
              } block px-3 py-2 rounded-md text-base font-body font-medium`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
