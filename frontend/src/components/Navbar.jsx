import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { path: '/', label: 'Home' },
  { path: '/detector', label: 'Detector' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white text-sm font-bold">FG</span>
          </div>
          <span className="text-white font-semibold text-lg">FakeGuard</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`relative px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                location.pathname === path
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {location.pathname === path && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 bg-surface-lighter rounded-lg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-5 h-0.5 bg-slate-300 rounded-full"
            animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="block w-5 h-0.5 bg-slate-300 rounded-full"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="block w-5 h-0.5 bg-slate-300 rounded-full"
            animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
          />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-surface-lighter"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium no-underline transition-colors ${
                    location.pathname === path
                      ? 'text-white bg-surface-lighter'
                      : 'text-slate-400 hover:text-white hover:bg-surface-light'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
