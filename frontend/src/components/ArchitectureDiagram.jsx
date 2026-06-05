import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const nodeVariant = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 15 } },
}

function ArrowRight({ className = '' }) {
  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      variants={nodeVariant}
    >
      <motion.svg
        width="40" height="20" viewBox="0 0 40 20" fill="none"
        className="text-primary"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <path d="M0 10H35M35 10L28 4M35 10L28 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  )
}

function ArrowDown({ className = '' }) {
  return (
    <motion.div
      className={`flex items-center justify-center py-2 ${className}`}
      variants={nodeVariant}
    >
      <motion.svg
        width="20" height="32" viewBox="0 0 20 32" fill="none"
        className="text-primary"
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <path d="M10 0V27M10 27L4 21M10 27L16 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  )
}

function SystemNode({ icon, title, subtitle, items, color, borderColor }) {
  return (
    <motion.div
      variants={nodeVariant}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`glass rounded-2xl p-4 sm:p-5 border ${borderColor} transition-all`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${color} flex items-center justify-center text-xl sm:text-2xl shadow-lg flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm sm:text-base">{title}</h4>
          <p className="text-slate-500 text-[11px] sm:text-xs">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="text-[10px] sm:text-xs px-2 py-1 rounded-md bg-surface-lighter/80 text-slate-300 font-mono"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function ArchitectureDiagram() {
  return (
    <motion.div
      className="w-full"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* === DESKTOP / TABLET: Horizontal 3-tier layout === */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 lg:gap-4">
          {/* Frontend */}
          <SystemNode
            icon="⚛️"
            title="React Frontend"
            subtitle="User Interface"
            items={['Vite', 'Framer Motion', 'Tailwind', 'React Router']}
            color="bg-gradient-to-br from-cyan-500 to-blue-600"
            borderColor="border-cyan-500/20 hover:border-cyan-500/40"
          />

          <ArrowRight />

          {/* Backend */}
          <SystemNode
            icon="🚀"
            title="FastAPI Backend"
            subtitle="REST API Server"
            items={['POST /predict', 'GET /model-info', 'GET /dataset-stats', 'CORS']}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            borderColor="border-emerald-500/20 hover:border-emerald-500/40"
          />

          <ArrowRight />

          {/* ML Model */}
          <SystemNode
            icon="🧠"
            title="LSTM Model"
            subtitle="TensorFlow / Keras"
            items={['Tokenizer', 'Embedding', 'LSTM', 'Dense + Sigmoid']}
            color="bg-gradient-to-br from-purple-500 to-violet-600"
            borderColor="border-purple-500/20 hover:border-purple-500/40"
          />
        </div>

        {/* Data flow description */}
        <div className="mt-6 lg:mt-8 grid grid-cols-3 gap-4 text-center">
          <motion.div variants={nodeVariant} className="text-slate-500 text-xs">
            <span className="text-primary font-semibold">1.</span> User pastes article text
          </motion.div>
          <motion.div variants={nodeVariant} className="text-slate-500 text-xs">
            <span className="text-primary font-semibold">2.</span> API validates & preprocesses
          </motion.div>
          <motion.div variants={nodeVariant} className="text-slate-500 text-xs">
            <span className="text-primary font-semibold">3.</span> Model classifies Real / Fake
          </motion.div>
        </div>

        {/* Response arrow (bottom) */}
        <motion.div
          variants={nodeVariant}
          className="mt-6 flex items-center justify-center"
        >
          <div className="glass rounded-xl px-5 py-3 flex items-center gap-3 border border-success/20">
            <motion.svg
              width="20" height="14" viewBox="0 0 20 14" fill="none"
              className="text-success rotate-180"
              animate={{ x: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <path d="M0 7H17M17 7L11 1M17 7L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
            <span className="text-xs sm:text-sm text-success font-medium">
              JSON Response: prediction, confidence, probabilities, inference time
            </span>
          </div>
        </motion.div>
      </div>

      {/* === MOBILE: Vertical stacked layout === */}
      <div className="md:hidden">
        <div className="flex flex-col items-center">
          {/* User */}
          <motion.div
            variants={nodeVariant}
            className="glass rounded-xl px-4 py-3 border border-slate-500/20 flex items-center gap-3 w-full"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-lg flex-shrink-0">
              👤
            </div>
            <div>
              <p className="text-white font-semibold text-sm">User</p>
              <p className="text-slate-500 text-[11px]">Pastes news article text</p>
            </div>
          </motion.div>

          <ArrowDown />

          {/* Frontend */}
          <SystemNode
            icon="⚛️"
            title="React Frontend"
            subtitle="User Interface — Port 5173"
            items={['Vite', 'Framer Motion', 'Tailwind']}
            color="bg-gradient-to-br from-cyan-500 to-blue-600"
            borderColor="border-cyan-500/20"
          />

          <ArrowDown />

          {/* Backend */}
          <SystemNode
            icon="🚀"
            title="FastAPI Backend"
            subtitle="REST API — Port 8000"
            items={['POST /predict', 'Validation', 'CORS']}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            borderColor="border-emerald-500/20"
          />

          <ArrowDown />

          {/* ML Pipeline */}
          <SystemNode
            icon="🧠"
            title="LSTM Model"
            subtitle="TensorFlow / Keras"
            items={['Tokenize', 'Pad (300)', 'LSTM', 'Classify']}
            color="bg-gradient-to-br from-purple-500 to-violet-600"
            borderColor="border-purple-500/20"
          />

          <ArrowDown />

          {/* Result */}
          <motion.div
            variants={nodeVariant}
            className="glass rounded-xl px-4 py-3 border border-success/20 flex items-center gap-3 w-full"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-lg flex-shrink-0">
              ✅
            </div>
            <div>
              <p className="text-success font-semibold text-sm">Result</p>
              <p className="text-slate-500 text-[11px]">Real/Fake + confidence score</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tech note */}
      <motion.div
        className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-slate-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5 }}
      >
        <motion.span
          className="inline-block w-1.5 h-1.5 rounded-full bg-success"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        Full request → response cycle completes in under 100ms
      </motion.div>
    </motion.div>
  )
}
