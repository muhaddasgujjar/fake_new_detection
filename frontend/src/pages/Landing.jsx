import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import ArchitectureDiagram from '../components/ArchitectureDiagram'

const features = [
  {
    icon: '🧠',
    title: 'LSTM Neural Network',
    desc: 'Deep learning model trained on thousands of news articles for accurate classification.',
  },
  {
    icon: '⚡',
    title: 'Real-Time Analysis',
    desc: 'Get instant predictions with inference times under 100ms.',
  },
  {
    icon: '📊',
    title: '95%+ Accuracy',
    desc: 'High precision detection powered by advanced NLP techniques.',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    desc: 'All analysis happens server-side. No data is stored or shared.',
  },
]

const techStack = [
  'TensorFlow', 'Keras', 'FastAPI', 'React', 'LSTM', 'NLP',
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Landing() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-20 sm:pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass text-xs sm:text-sm text-primary-light mb-6 sm:mb-8"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              AI-Powered Detection Engine
            </motion.div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6">
              <span className="text-white">Detect </span>
              <span className="gradient-text">Fake News</span>
              <br />
              <span className="text-white">Before It Spreads</span>
            </h1>

            <motion.p
              className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Harness the power of deep learning to instantly identify misinformation.
              Our LSTM model analyzes text patterns to classify news articles with high accuracy.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link
                to="/detector"
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-base sm:text-lg no-underline hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 text-center"
              >
                Try the Detector
              </Link>
              <Link
                to="/how-it-works"
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border border-surface-lighter text-slate-300 font-semibold text-base sm:text-lg no-underline hover:bg-surface-light hover:border-primary/50 transition-all duration-300 text-center"
              >
                Learn How It Works
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-20 -left-10 w-40 sm:w-64 h-40 sm:h-64 rounded-full bg-primary/5 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 -right-10 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-accent/5 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </section>

        {/* Architecture Diagram */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-3 sm:mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            System <span className="gradient-text">Architecture</span>
          </motion.h2>
          <motion.p
            className="text-slate-400 text-center mb-10 sm:mb-14 max-w-xl mx-auto text-sm sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            End-to-end pipeline from raw text to classification result
          </motion.p>

          <motion.div
            className="glass rounded-2xl p-4 sm:p-8 lg:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ArchitectureDiagram />
          </motion.div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-3 sm:mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why Choose <span className="gradient-text">FakeGuard</span>?
          </motion.h2>
          <motion.p
            className="text-slate-400 text-center mb-10 sm:mb-16 max-w-xl mx-auto text-sm sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Built with cutting-edge machine learning technology
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-2xl p-5 sm:p-6 hover:border-primary/40 transition-colors"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{f.icon}</div>
                <h3 className="text-white font-semibold text-base sm:text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Tech Stack */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <motion.div
            className="glass rounded-2xl p-6 sm:p-10 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6">Powered By</h3>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-surface-lighter text-primary-light font-medium text-xs sm:text-sm border border-primary/20"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.1, borderColor: 'rgba(139, 92, 246, 0.6)' }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Ready to Fight Misinformation?
            </h2>
            <p className="text-slate-400 mb-6 sm:mb-8 text-base sm:text-lg">
              Paste any news article and get an instant AI-powered verdict.
            </p>
            <Link
              to="/detector"
              className="inline-flex px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-base sm:text-lg no-underline hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
            >
              Start Detecting Now →
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-surface-lighter py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <span className="text-slate-500 text-xs sm:text-sm">
              FakeGuard — AI-Powered Fake News Detection
            </span>
            <span className="text-slate-500 text-xs sm:text-sm">
              Built with TensorFlow + React
            </span>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
