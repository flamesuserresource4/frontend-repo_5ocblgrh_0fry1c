import { useEffect, useRef } from 'react'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'

function ParticleTrail() {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    const add = (x, y) => {
      for (let i = 0; i < 4; i++) {
        particles.current.push({
          x, y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          life: 1,
          size: Math.random() * 2 + 1,
        })
      }
      if (particles.current.length > 400) particles.current.splice(0, particles.current.length - 400)
    }

    let raf
    const loop = () => {
      raf = requestAnimationFrame(loop)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      particles.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vx += (mouse.current.x - p.x) * 0.0008
        p.vy += (mouse.current.y - p.y) * 0.0008
        p.life *= 0.985
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,0,0,${0.6 * p.life})`
        ctx.fill()
      })
      particles.current = particles.current.filter((p) => p.life > 0.05)
    }
    loop()

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      mouse.current = { x, y }
      add(x, y)
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 w-full h-full" />
}

export default function App() {
  useEffect(() => {
    const root = document.documentElement
    const onMove = (e) => {
      root.style.setProperty('--mx', e.clientX + 'px')
      root.style.setProperty('--my', e.clientY + 'px')
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="bg-white text-black min-h-screen">
      <ParticleTrail />
      <Hero />
      <Services />
      <Portfolio />
      <Contact />
      {/* Ink circle cursor follower */}
      <div
        className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 top-0 left-0 w-12 h-12 rounded-full"
        style={{
          transform: 'translate(calc(var(--mx)), calc(var(--my)))',
          boxShadow: '0 0 0 2px #000',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}
