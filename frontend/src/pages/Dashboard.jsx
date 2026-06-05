import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import AnimatedCounter from '../components/AnimatedCounter'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const [modelInfo, setModelInfo] = useState(null)
  const [datasetStats, setDatasetStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/model-info`).then(r => r.json()).catch(() => null),
      fetch(`${API_URL}/dataset-stats`).then(r => r.json()).catch(() => null),
    ]).then(([model, dataset]) => {
      setModelInfo(model)
      setDatasetStats(dataset)
      setLoading(false)
    })
  }, [])

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-10 sm:mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Model <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-lg">
              Explore the model architecture and training dataset statistics
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <motion.div
                className="w-12 h-12 border-3 border-surface-lighter border-t-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          ) : (
            <>
              {/* Dataset Stats */}
              {datasetStats && (
                <motion.section className="mb-10 sm:mb-16" variants={container} initial="hidden" animate="show">
                  <motion.h2 variants={item} className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-xs sm:text-sm">📊</span>
                    Dataset Overview
                  </motion.h2>

                  <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6" variants={container}>
                    <motion.div variants={item} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                      <p className="text-slate-400 text-xs sm:text-sm mb-2">Total Samples</p>
                      <AnimatedCounter value={datasetStats.total_samples} />
                    </motion.div>
                    <motion.div variants={item} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                      <p className="text-slate-400 text-xs sm:text-sm mb-2">Fake Articles</p>
                      <AnimatedCounter value={datasetStats.fake_count} />
                      <div className="mt-3 h-2 rounded-full bg-surface-lighter overflow-hidden">
                        <motion.div
                          className="h-full bg-danger rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(datasetStats.fake_count / datasetStats.total_samples) * 100}%` }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        />
                      </div>
                    </motion.div>
                    <motion.div variants={item} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                      <p className="text-slate-400 text-xs sm:text-sm mb-2">Real Articles</p>
                      <AnimatedCounter value={datasetStats.real_count} />
                      <div className="mt-3 h-2 rounded-full bg-surface-lighter overflow-hidden">
                        <motion.div
                          className="h-full bg-success rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(datasetStats.real_count / datasetStats.total_samples) * 100}%` }}
                          transition={{ duration: 1.5, delay: 0.7 }}
                        />
                      </div>
                    </motion.div>
                    <motion.div variants={item} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                      <p className="text-slate-400 text-xs sm:text-sm mb-2">Avg Text Length</p>
                      <AnimatedCounter value={datasetStats.avg_text_length} suffix=" chars" />
                    </motion.div>
                    <motion.div variants={item} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                      <p className="text-slate-400 text-xs sm:text-sm mb-2">Max Text Length</p>
                      <AnimatedCounter value={datasetStats.max_text_length} suffix=" chars" />
                    </motion.div>
                    <motion.div variants={item} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                      <p className="text-slate-400 text-xs sm:text-sm mb-2">Min Text Length</p>
                      <AnimatedCounter value={datasetStats.min_text_length} suffix=" chars" />
                    </motion.div>
                  </motion.div>

                  {/* Distribution Visual */}
                  <motion.div
                    variants={item}
                    className="glass rounded-2xl p-6 mt-6"
                  >
                    <h3 className="text-white font-semibold mb-4">Class Distribution</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-8 rounded-full bg-surface-lighter overflow-hidden flex">
                          <motion.div
                            className="h-full bg-gradient-to-r from-danger/80 to-danger flex items-center justify-center text-xs font-medium text-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${(datasetStats.fake_count / datasetStats.total_samples) * 100}%` }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                          >
                            Fake
                          </motion.div>
                          <motion.div
                            className="h-full bg-gradient-to-r from-success to-success/80 flex items-center justify-center text-xs font-medium text-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${(datasetStats.real_count / datasetStats.total_samples) * 100}%` }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                          >
                            Real
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-3 text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-danger" /> Fake: {((datasetStats.fake_count / datasetStats.total_samples) * 100).toFixed(1)}%
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-success" /> Real: {((datasetStats.real_count / datasetStats.total_samples) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </motion.div>
                </motion.section>
              )}

              {/* Model Info */}
              {modelInfo && (
                <motion.section variants={container} initial="hidden" animate="show">
                  <motion.h2 variants={item} className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs sm:text-sm">🧠</span>
                    Model Architecture
                  </motion.h2>

                  <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8" variants={container}>
                    <motion.div variants={item} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
                      <p className="text-slate-400 text-xs sm:text-sm mb-1">Architecture</p>
                      <p className="text-white text-sm sm:text-xl font-semibold">{modelInfo.model_type}</p>
                    </motion.div>
                    <motion.div variants={item} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
                      <p className="text-slate-400 text-xs sm:text-sm mb-1">Total Parameters</p>
                      <AnimatedCounter value={modelInfo.total_params} />
                    </motion.div>
                    <motion.div variants={item} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
                      <p className="text-slate-400 text-xs sm:text-sm mb-1">Trainable Params</p>
                      <AnimatedCounter value={modelInfo.trainable_params} />
                    </motion.div>
                    <motion.div variants={item} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
                      <p className="text-slate-400 text-xs sm:text-sm mb-1">Vocabulary Size</p>
                      <AnimatedCounter value={modelInfo.vocab_size} />
                    </motion.div>
                    <motion.div variants={item} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
                      <p className="text-slate-400 text-xs sm:text-sm mb-1">Max Sequence Length</p>
                      <p className="font-mono text-xl sm:text-3xl font-bold gradient-text">{modelInfo.max_sequence_length}</p>
                    </motion.div>
                    <motion.div variants={item} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
                      <p className="text-slate-400 text-xs sm:text-sm mb-1">Input Shape</p>
                      <p className="font-mono text-sm sm:text-xl font-bold text-accent">{modelInfo.input_shape}</p>
                    </motion.div>
                  </motion.div>

                  {/* Layers Table */}
                  <motion.div
                    variants={item}
                    className="glass rounded-xl sm:rounded-2xl overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-surface-lighter">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Layer Details</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[500px]">
                        <thead>
                          <tr className="border-b border-surface-lighter">
                            <th className="px-3 sm:px-6 py-3 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                            <th className="px-3 sm:px-6 py-3 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                            <th className="px-3 sm:px-6 py-3 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Output Shape</th>
                            <th className="px-3 sm:px-6 py-3 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Params</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modelInfo.layers.map((layer, i) => (
                            <motion.tr
                              key={i}
                              className="border-b border-surface-lighter/50 hover:bg-surface-light/30 transition-colors"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <td className="px-6 py-3 text-white text-sm">{layer.name}</td>
                              <td className="px-6 py-3">
                                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary-light font-mono">
                                  {layer.type}
                                </span>
                              </td>
                              <td className="px-6 py-3 font-mono text-sm text-slate-400">{layer.output_shape}</td>
                              <td className="px-6 py-3 font-mono text-sm text-accent">{layer.params.toLocaleString()}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </motion.section>
              )}

              {/* Backend not connected message */}
              {!modelInfo && !datasetStats && (
                <motion.div
                  className="glass rounded-2xl p-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-5xl mb-4">🔌</div>
                  <h3 className="text-white text-xl font-semibold mb-2">Backend Not Connected</h3>
                  <p className="text-slate-400">
                    Start the FastAPI backend server to see model and dataset statistics.
                  </p>
                  <code className="inline-block mt-4 px-4 py-2 rounded-lg bg-surface-lighter text-primary-light text-sm">
                    cd backend && uvicorn main:app --reload
                  </code>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
