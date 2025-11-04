import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function ZenGarden() {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.scale(dpr, dpr)
      // Paper base
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      // Subtle paper fiber
      for (let i = 0; i < 120; i++) {
        ctx.fillStyle = 'rgba(0,0,0,0.02)'
        ctx.fillRect(Math.random() * canvas.clientWidth, Math.random() * canvas.clientHeight, 1, 1)
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const start = (e) => {
    setDrawing(true)
    const rect = e.currentTarget.getBoundingClientRect()
    last.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  const move = (e) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = e.currentTarget.getBoundingClientRect()
    if (!drawing) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.globalCompositeOperation = 'multiply'
    // Wavy rake teeth
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(x, y)
    ctx.stroke()

    for (let i = -1; i <= 1; i++) {
      ctx.beginPath()
      ctx.moveTo(last.current.x + i * 12, last.current.y + Math.sin(last.current.x * 0.05) * 3)
      ctx.lineTo(x + i * 12, y + Math.sin(x * 0.05) * 3)
      ctx.stroke()
    }

    last.current = { x, y }
  }
  const end = () => setDrawing(false)

  return (
    <div className="relative w-full h-64 border border-black bg-white overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
      />
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(0,0,0,0.06), transparent 40%)' }}
      />
    </div>
  )
}

export default function Contact() {
  return (
    <section className="relative bg-white text-black py-24" onMouseMove={(e)=>{
      const rect=e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty('--mx', ((e.clientX-rect.left)/rect.width)*100+'%');
      e.currentTarget.style.setProperty('--my', ((e.clientY-rect.top)/rect.height)*100+'%');
    }}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black">Contact</h2>
        <p className="mt-2 opacity-70">Draw in the zen garden. Every input follows your cursor.</p>
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <form className="space-y-4 border border-black p-6 bg-white">
            <div>
              <label className="text-sm">Name</label>
              <input className="mt-1 w-full border border-black p-3 bg-white outline-none focus:shadow-[6px_6px_0_0_#000]" placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm">Email</label>
              <input className="mt-1 w-full border border-black p-3 bg-white outline-none focus:shadow-[6px_6px_0_0_#000]" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm">Message</label>
              <textarea className="mt-1 w-full border border-black p-3 bg-white min-h-[120px] outline-none focus:shadow-[6px_6px_0_0_#000]" placeholder="Tell us about your idea" />
            </div>
            <motion.button
              className="px-6 py-3 border border-black bg-black text-white font-semibold shadow-[8px_8px_0_0_#000]"
              whileHover={{ x: 2, y: -2, boxShadow: '14px 14px 0 0 #000', rotate: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Send
            </motion.button>
          </form>
          <div>
            <ZenGarden />
          </div>
        </div>
      </div>
    </section>
  )
}
