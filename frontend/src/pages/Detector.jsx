import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Detector() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [health, setHealth] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(setHealth)
      .catch(() => setHealth(null))
  }, [])

  const handlePredict = async () => {
    if (text.trim().length < 10) {
      setError('Please enter at least 10 characters.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Prediction failed')
      }

      setResult(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              News <span className="gradient-text">Analyzer</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-lg">
              Paste any news article below to analyze its authenticity
            </p>
            {health && (
              <motion.div
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full glass text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className={`w-2 h-2 rounded-full ${health.model_loaded ? 'bg-success' : 'bg-danger'} animate-pulse`} />
                <span className={health.model_loaded ? 'text-success' : 'text-danger'}>
                  {health.model_loaded ? 'Model Ready' : 'Model Loading...'}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Input Area */}
          <motion.div
            className="glass rounded-2xl p-4 sm:p-6 lg:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a news article here to check if it's fake or real..."
              rows={6}
              className="w-full bg-surface rounded-xl border border-surface-lighter p-3 sm:p-4 text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm sm:text-base"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3">
              <div className="flex gap-4 text-xs sm:text-sm text-slate-500">
                <span>{text.length} characters</span>
                <span>{wordCount} words</span>
              </div>

              <motion.button
                onClick={handlePredict}
                disabled={loading || text.trim().length < 10}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm sm:text-base disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Article'
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className={`glass rounded-2xl p-6 sm:p-8 border ${
                  result.prediction === 'Real'
                    ? 'border-success/30'
                    : 'border-danger/30'
                }`}
              >
                {/* Verdict */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-lg font-bold ${
                      result.prediction === 'Real'
                        ? 'bg-success/10 text-success'
                        : 'bg-danger/10 text-danger'
                    }`}
                  >
                    <span className="text-2xl">
                      {result.prediction === 'Real' ? '✓' : '✗'}
                    </span>
                    {result.prediction === 'Real' ? 'Likely Real' : 'Likely Fake'}
                  </motion.div>

                  <motion.p
                    className="mt-3 text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {(result.confidence * 100).toFixed(1)}% confidence
                  </motion.p>
                </div>

                {/* Probability Bars */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-success font-medium">Real</span>
                      <span className="text-slate-400">{(result.real_probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-surface-lighter overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-success/80 to-success"
                        initial={{ width: 0 }}
                        animate={{ width: `${result.real_probability * 100}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-danger font-medium">Fake</span>
                      <span className="text-slate-400">{(result.fake_probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-surface-lighter overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-danger/80 to-danger"
                        initial={{ width: 0 }}
                        animate={{ width: `${result.fake_probability * 100}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-4 justify-center text-sm text-slate-500 pt-4 border-t border-surface-lighter">
                  <span className="flex items-center gap-1">
                    ⚡ {result.inference_time_ms}ms inference
                  </span>
                  <span className="flex items-center gap-1">
                    📝 {result.word_count} words analyzed
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}
