import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = parseInt(value)
    const increment = end / (duration * 60)
    let current = start

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [isInView, value, duration])

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="font-mono text-xl sm:text-3xl font-bold gradient-text"
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  )
}
