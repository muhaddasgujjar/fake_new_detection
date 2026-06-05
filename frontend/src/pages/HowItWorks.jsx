import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const steps = [
  {
    number: '01',
    title: 'Text Input',
    desc: 'The user submits a news article or text snippet for analysis.',
    icon: '📝',
    detail: 'Raw text is received via the FastAPI endpoint and validated for minimum length.',
  },
  {
    number: '02',
    title: 'Tokenization',
    desc: 'Text is converted into numerical sequences using a trained tokenizer.',
    icon: '🔤',
    detail: 'Keras Tokenizer maps words to integers from a 50,000-word vocabulary built from training data.',
  },
  {
    number: '03',
    title: 'Padding & Encoding',
    desc: 'Sequences are padded or truncated to a fixed length of 300 tokens.',
    icon: '📐',
    detail: 'Ensures uniform input shape for the neural network regardless of article length.',
  },
  {
    number: '04',
    title: 'LSTM Processing',
    desc: 'The deep learning model analyzes sequential patterns in the text.',
    icon: '🧠',
    detail: 'Long Short-Term Memory layers capture long-range dependencies and writing style patterns.',
  },
  {
    number: '05',
    title: 'Classification',
    desc: 'Dense layers produce a probability score for real vs. fake.',
    icon: '⚖️',
    detail: 'Sigmoid activation outputs a value between 0 (fake) and 1 (real) with confidence scores.',
  },
  {
    number: '06',
    title: 'Result',
    desc: 'The prediction and confidence are returned to the user instantly.',
    icon: '✅',
    detail: 'Complete inference pipeline runs in under 100ms for real-time feedback.',
  },
]

const architecture = [
  { layer: 'Embedding', params: '5M+', purpose: 'Converts word IDs to dense vectors' },
  { layer: 'LSTM', params: '500K+', purpose: 'Captures sequential text patterns' },
  { layer: 'Dropout', params: '0', purpose: 'Prevents overfitting during training' },
  { layer: 'Dense', params: '128+', purpose: 'Feature compression and classification' },
  { layer: 'Output', params: '1', purpose: 'Sigmoid probability (0=fake, 1=real)' },
]

export default function HowItWorks() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-20 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12 sm:mb-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              How It <span className="gradient-text">Works</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto">
              A deep dive into the AI pipeline that powers our fake news detection system
            </p>
          </motion.div>

          {/* Pipeline Steps */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-5 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary/0 hidden sm:block" />

            <div className="space-y-4 sm:space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="relative flex flex-row gap-3 sm:gap-6 items-start"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  {/* Step number bubble */}
                  <motion.div
                    className="flex-shrink-0 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-surface-light border border-primary/30 flex items-center justify-center text-lg sm:text-2xl z-10"
                    whileHover={{ scale: 1.1, borderColor: 'rgba(139, 92, 246, 0.7)' }}
                  >
                    {step.icon}
                  </motion.div>

                  {/* Content card */}
                  <motion.div
                    className="flex-1 glass rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-primary/30 transition-colors"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <span className="text-[10px] sm:text-xs font-mono text-primary-light bg-primary/10 px-2 py-1 rounded">
                        STEP {step.number}
                      </span>
                      <h3 className="text-white font-semibold text-sm sm:text-lg">{step.title}</h3>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-base mb-1 sm:mb-2">{step.desc}</p>
                    <p className="text-slate-500 text-xs sm:text-sm hidden sm:block">{step.detail}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Architecture Section */}
          <motion.section
            className="mt-16 sm:mt-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3 sm:mb-4">
              Model <span className="gradient-text">Architecture</span>
            </h2>
            <p className="text-slate-400 text-center mb-8 sm:mb-12 max-w-xl mx-auto text-sm sm:text-base">
              A Sequential LSTM network optimized for text classification
            </p>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-surface-lighter">
                      <th className="px-6 py-4 text-sm font-semibold text-primary-light">Layer</th>
                      <th className="px-6 py-4 text-sm font-semibold text-primary-light">Parameters</th>
                      <th className="px-6 py-4 text-sm font-semibold text-primary-light">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {architecture.map((row, i) => (
                      <motion.tr
                        key={i}
                        className="border-b border-surface-lighter/50 hover:bg-surface-light/50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <td className="px-6 py-4 text-white font-medium">{row.layer}</td>
                        <td className="px-6 py-4 font-mono text-accent text-sm">{row.params}</td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{row.purpose}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* Key Concepts */}
          <motion.section
            className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📚</div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Training Data</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Trained on a balanced dataset of real and fake news articles spanning multiple topics and sources.
              </p>
            </div>
            <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔄</div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">LSTM Memory</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Long Short-Term Memory networks retain context over long sequences, ideal for understanding article narratives.
              </p>
            </div>
            <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Binary Output</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Sigmoid activation produces a probability between 0 and 1, giving both a verdict and confidence score.
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </PageTransition>
  )
}
