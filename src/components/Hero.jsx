import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function PetalsCanvas() {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: 0.5, y: 0.5 })
  const petals = useRef([])
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const init = () => {
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      petals.current = Array.from({ length: 220 }, () => ({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.2) * 0.6 - 0.2,
        r: Math.random() * 8 + 3,
        a: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.03,
      }))
    }
    init()

    const onResize = () => init()
    window.addEventListener('resize', onResize)

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      for (const p of petals.current) {
        // gentle attraction to mouse
        p.vx += ((mouse.current.x * canvas.clientWidth) - p.x) * 0.00005
        p.vy += ((mouse.current.y * canvas.clientHeight) - p.y) * 0.00005
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy = p.vy * 0.99 + 0.02
        p.a += p.spin

        // wrap
        if (p.x < -20) p.x = canvas.clientWidth + 20
        if (p.x > canvas.clientWidth + 20) p.x = -20
        if (p.y > canvas.clientHeight + 20) p.y = -20

        // draw petal (tilted ellipse)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.a)
        ctx.scale(1.4, 1)
        ctx.beginPath()
        ctx.ellipse(0, 0, p.r, p.r * 0.45, 0, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,0,0,0.85)'
        ctx.fill()
        ctx.restore()
      }

      // paper grain overlay
      ctx.fillStyle = 'rgba(0,0,0,0.02)'
      for (let i = 0; i < 80; i++) {
        ctx.fillRect(Math.random() * canvas.clientWidth, Math.random() * canvas.clientHeight, 1, 1)
      }
    }
    loop()

    const move = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = (e.clientX - rect.left) / rect.width
      mouse.current.y = (e.clientY - rect.top) / rect.height
      const root = canvas.parentElement
      if (root) {
        root.style.setProperty('--mx', `${mouse.current.x * 100}%`)
        root.style.setProperty('--my', `${mouse.current.y * 100}%`)
      }
    }
    window.addEventListener('mousemove', move)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', move)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] bg-white text-black overflow-hidden">
      {/* Interactive background */}
      <PetalsCanvas />

      {/* Gradient/texture overlay that doesn't block interactions */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,0,0,0.08), transparent 32%), repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 2px)'
        }}
      />

      {/* Torii mark (SVG) with subtle parallax */}
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center select-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="mb-6"
          animate={{ x: ['-1%', '1%', '-1%'] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          <svg width="220" height="140" viewBox="0 0 220 140" role="img" aria-label="Torii gate">
            <g fill="#000">
              <rect x="30" y="20" width="160" height="14" />
              <rect x="50" y="40" width="120" height="10" />
              <rect x="60" y="50" width="20" height="70" />
              <rect x="140" y="50" width="20" height="70" />
            </g>
          </svg>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-black tracking-tight"
          animate={{ rotateZ: [0, 0.3, 0], filter: ['contrast(100%)', 'contrast(120%)', 'contrast(100%)'] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          和 Tech
        </motion.h1>
        <motion.p className="mt-4 max-w-2xl text-lg md:text-xl opacity-80" animate={{ y: [0, -2, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          A monochrome Japanese-inspired interactive showcase. Move your mouse — everything responds.
        </motion.p>
        <motion.div className="mt-8 inline-flex items-center gap-4">
          <motion.button
            className="px-6 py-3 border border-black bg-white text-black font-semibold shadow-[8px_8px_0_0_#000]"
            whileHover={{ x: 2, y: -2, boxShadow: '14px 14px 0 0 #000', rotate: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore
          </motion.button>
          <motion.button
            className="px-6 py-3 border border-black bg-black text-white font-semibold shadow-[8px_8px_0_0_#000]"
            whileHover={{ x: -2, y: 2, boxShadow: '14px 14px 0 0 #000', rotate: 1 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}
