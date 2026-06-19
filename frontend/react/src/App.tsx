import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import Resources from './pages/Resources'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import UploadDocuments from './pages/UploadDocuments'
import Mission from './pages/Mission'
import GCFProject from './pages/GCFProject'
import GCFstage from './pages/CGFstage'
import SustainableDevelopment from './pages/SustainableDevelopment'
import WorkshopsList from './pages/WorkshopsList'
import WorkshopsDetail from './pages/WorkshopDetail'
import LearningModules from './pages/LearningModules'
import ProjectDevelopment from './pages/ProjectDevelopment'
import PartnersCoordination from './pages/PartnersCoordination'
import PolicyDocuments from './pages/PolicyDocuments'
import PolicyDocumentDetail from './pages/PolicyDocumentDetail'
import ProjectReadiness from './pages/ProjectReadiness'
import ProjectReadinessDetail from './pages/ProjectReadinessDetail'
import TemplateDocuments from './pages/TemplateDocuments'
import TemplateDetail from './pages/TemplateDetail'
import Deliverables from './pages/Deliverables'
import DeliverableDetail from './pages/DeliverableDetail'
import ChatBubble from './components/ChatBubble'

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/upload-documents" element={<UploadDocuments />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/gcf-project" element={<GCFProject />} />
            <Route path="/sustainable-development" element={<SustainableDevelopment />} />
            <Route path="/workshops" element={<WorkshopsList />} />
            <Route path="/workshops/:id" element={<WorkshopsDetail />} />
            <Route path="/learning-modules" element={<LearningModules />} />
            <Route path="/project-development" element={<ProjectDevelopment />} />
            <Route path="/partners-coordination" element={<PartnersCoordination />} />
            <Route path="/gcf-stages" element={<GCFstage />} />
            <Route path="/gcf-policies" element={<PolicyDocuments />} />
            <Route path="/gcf-policies/:id" element={<PolicyDocumentDetail />} />
               <Route path="/project-readiness" element={<ProjectReadiness />} />
            <Route path="/project-readiness/:id" element={<ProjectReadinessDetail />} />
            <Route path="/gcf-template" element={<TemplateDocuments />} />
            <Route path="/gcf-template/:id" element={<TemplateDetail />} />
            <Route path="/deliverables" element={<Deliverables />} />
            <Route path="/deliverables/:id" element={<DeliverableDetail />} />
          </Routes>
        </main>
        <Footer />
        <ChatBubble />
      </div>
    </Router>
  )
}

export default App