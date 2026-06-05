import { useEffect, useRef } from 'react'

export default function ParticleGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      const spacing = 80
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          particles.push({
            x: x + Math.random() * 20,
            y: y + Math.random() * 20,
            baseX: x,
            baseY: y,
            size: Math.random() * 1.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
          })
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY

        const dx = p.x - p.baseX
        const dy = p.y - p.baseY
        if (Math.abs(dx) > 30) p.speedX *= -1
        if (Math.abs(dy) > 30) p.speedY *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(139, 92, 246, 0.3)'
        ctx.fill()
      })

      particles.forEach((p, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    resize()
    createParticles()
    animate()

    window.addEventListener('resize', () => {
      resize()
      createParticles()
    })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
