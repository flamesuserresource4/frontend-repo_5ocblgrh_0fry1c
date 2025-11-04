import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function Torii({ mouse }) {
  const group = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (!group.current) return
    const targetX = (mouse.current.x - 0.5) * 1.5
    const targetY = (0.5 - mouse.current.y) * 0.8
    group.current.position.x += (targetX - group.current.position.x) * 0.1
    group.current.position.y += (targetY - group.current.position.y) * 0.1
    const rot = hovered ? 0.6 : 0.2
    group.current.rotation.y += delta * rot
  })

  return (
    <group ref={group} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh position={[-0.8, -0.2, 0]}>
        <boxGeometry args={[0.15, 1.2, 0.15]} />
        <meshStandardMaterial color={hovered ? 'black' : 'white'} roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0.8, -0.2, 0]}>
        <boxGeometry args={[0.15, 1.2, 0.15]} />
        <meshStandardMaterial color={hovered ? 'black' : 'white'} roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2.2, 0.12, 0.2]} />
        <meshStandardMaterial color={'white'} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.9, 0.1, 0.18]} />
        <meshStandardMaterial color={'white'} roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={'#efefef'} />
      </mesh>
    </group>
  )
}

function PetalField({ mouse, count = 300 }) {
  const points = useMemo(() => {
    const p = []
    for (let i = 0; i < count; i++) {
      p.push({
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 4,
        s: Math.random() * 0.02 + 0.005,
      })
    }
    return p
  }, [count])
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    ref.current.children.forEach((m) => {
      const dx = (mouse.current.x - 0.5) * 6 - m.position.x
      const dy = (0.5 - mouse.current.y) * 4 - m.position.y
      const dz = Math.sin((mouse.current.x + mouse.current.y) * Math.PI) - m.position.z
      m.position.x += dx * 0.002
      m.position.y += dy * 0.002
      m.position.z += dz * 0.002
      m.rotation.z += m.userData.s * 5
      m.scale.setScalar(1 + Math.max(0, 0.6 - m.position.distanceTo({ x: 0, y: 0, z: 0 })))
    })
  })
  return (
    <group ref={ref}>
      {points.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} userData={{ s: p.s }}>
          <planeGeometry args={[0.05, 0.02]} />
          <meshStandardMaterial color={'white'} roughness={1} metalness={0} />
        </mesh>
      ))}
    </group>
  )
}

export default function Hero() {
  const mouse = useRef({ x: 0.5, y: 0.5 })

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouse.current.x = (e.clientX - rect.left) / rect.width
    mouse.current.y = (e.clientY - rect.top) / rect.height
    const root = e.currentTarget
    root.style.setProperty('--mx', `${mouse.current.x * 100}%`)
    root.style.setProperty('--my', `${mouse.current.y * 100}%`)
  }

  return (
    <section className="relative w-full h-screen bg-white text-black overflow-hidden" onMouseMove={onMouseMove}>
      <div className="absolute inset-0" aria-hidden>
        <Canvas camera={{ position: [0, 0.6, 3], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 3, 2]} intensity={0.6} />
          <Torii mouse={mouse} />
          <PetalField mouse={mouse} />
          <Stars radius={50} depth={20} count={2000} factor={2} saturation={0} fade speed={0.4} />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,0,0,0.08), transparent 30%), repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 2px)',
          backgroundBlendMode: 'multiply',
        }}
      />

      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center select-none"
        style={{ textShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-black tracking-tight"
          animate={{ x: ['-1%', '1%'], rotateZ: [0, 0.2, 0], filter: ['contrast(100%)', 'contrast(120%)'] }}
          transition={{ repeat: Infinity, repeatType: 'mirror', duration: 8 }}
        >
          和 Tech
        </motion.h1>
        <motion.p
          className="mt-4 max-w-2xl text-lg md:text-xl"
          animate={{ x: ['1%', '-1%'] }}
          transition={{ repeat: Infinity, repeatType: 'mirror', duration: 6 }}
        >
          A monochrome Japanese-inspired interactive showcase. Move your mouse—everything responds.
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
