import { motion } from 'framer-motion'

const items = [
  { title: 'Origami Engine', tag: 'R&D' },
  { title: 'Zen Commerce', tag: 'E‑comm' },
  { title: 'Kanji OCR', tag: 'AI' },
  { title: 'Sumi-e Renderer', tag: 'Graphics' },
  { title: 'Kami Cloud', tag: 'Cloud' },
  { title: 'Koi Recsys', tag: 'ML' },
]

function PortfolioCard({ title, tag }) {
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    e.currentTarget.style.setProperty('--mx', `${x * 100}%`)
    e.currentTarget.style.setProperty('--my', `${y * 100}%`)
  }
  return (
    <motion.div
      className="relative border border-black bg-white p-6 overflow-hidden cursor-pointer"
      onMouseMove={onMove}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(0,0,0,0.08), transparent 40%)',
        }}
      />
      <div className="relative z-10">
        <span className="text-xs px-2 py-1 border border-black bg-black text-white">{tag}</span>
        <h3 className="mt-3 text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-sm opacity-70">Interactive, performant, and crafted with precision.</p>
      </div>
      <motion.div
        className="absolute -right-10 -bottom-10 w-40 h-40 border-4 border-black"
        animate={{ rotate: [0, 6, 0], x: ['0%', '-5%', '0%'] }}
        transition={{ repeat: Infinity, duration: 10 }}
        style={{ mixBlendMode: 'multiply' }}
      />
      <motion.div
        className="absolute -left-8 -top-8 w-20 h-20 border-2 border-black rounded-full"
        animate={{ x: ['0%', '10%', '0%'], y: ['0%', '8%', '0%'] }}
        transition={{ repeat: Infinity, duration: 7 }}
        style={{ mixBlendMode: 'multiply' }}
      />
    </motion.div>
  )
}

export default function Portfolio() {
  return (
    <section className="relative bg-white text-black py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black">Portfolio</h2>
        <p className="mt-2 opacity-70">Parallax depth and magnetic ink shapes that chase your cursor.</p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <PortfolioCard key={i} title={it.title} tag={it.tag} />
          ))}
        </div>
      </div>
    </section>
  )
}
