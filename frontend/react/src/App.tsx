import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import Resources from './pages/Resources'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Mission from './pages/Mission'
import GCFProject from './pages/GCFProject'
import SustainableDevelopment from './pages/SustainableDevelopment'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/gcf-project" element={<GCFProject />} />
            <Route path="/sustainable-development" element={<SustainableDevelopment />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
