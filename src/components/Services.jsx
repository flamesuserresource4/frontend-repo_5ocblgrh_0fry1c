import { motion, useMotionValue, useTransform } from 'framer-motion'

const services = [
  { title: 'Custom Software', desc: 'Robust systems architected with precision and care.' },
  { title: 'AI & Data', desc: 'Practical intelligence fused with elegant design.' },
  { title: 'Cloud & DevOps', desc: 'Scalable, secure, and automated delivery pipelines.' },
]

function TiltCard({ title, desc }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useTransform(my, [0, 1], [10, -10])
  const rotateY = useTransform(mx, [0, 1], [-10, 10])
  const shadowX = useTransform(mx, [0, 1], [24, -24])
  const shadowY = useTransform(my, [0, 1], [24, -24])

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    mx.set(x)
    my.set(y)
  }

  return (
    <motion.div
      className="group relative border border-black bg-white p-6 cursor-pointer select-none"
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        boxShadow: shadowX.to((sx) => `${sx}px ${shadowY.get()}px 0 0 #000`),
      }}
      onMouseMove={onMove}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,0,0,0.08), transparent 40%)'
      }} />
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-sm opacity-80">{desc}</p>
      <motion.div className="mt-6 inline-block border border-black px-4 py-2 bg-black text-white"
        whileHover={{ x: 4, y: -4, boxShadow: '8px 8px 0 0 #000' }}
      >
        Learn more
      </motion.div>
    </motion.div>
  )
}

export default function Services() {
  return (
    <section className="relative bg-white text-black py-24" onMouseMove={(e)=>{
      const rect=e.currentTarget.getBoundingClientRect();
      const x=((e.clientX-rect.left)/rect.width)*100; const y=((e.clientY-rect.top)/rect.height)*100;
      e.currentTarget.style.setProperty('--mx', x+'%');
      e.currentTarget.style.setProperty('--my', y+'%');
    }}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black">Services</h2>
        <p className="mt-2 opacity-70">Move your mouse — cards tilt, shadows follow, and ink blooms.</p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <TiltCard key={i} title={s.title} desc={s.desc} />
          ))}
        </div>
      </div>
    </section>
  )
}
