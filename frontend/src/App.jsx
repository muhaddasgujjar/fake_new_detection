import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import ParticleGrid from './components/ParticleGrid'
import Landing from './pages/Landing'
import Detector from './pages/Detector'
import HowItWorks from './pages/HowItWorks'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <ParticleGrid />
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/detector" element={<Detector />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  )
}
