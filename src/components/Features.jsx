import { useState, useRef, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { FEATURES } from '../data'
import { ICONS, IconArrowRight } from '../icons'

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div className="text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#5a527e]"
      >
        <span className="h-px w-8 bg-[#9a93b8]/60"/>{eyebrow}<span className="h-px w-8 bg-[#9a93b8]/60"/>
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.05 }}
        className="font-display mt-5 text-[32px] md:text-[64px] leading-[1.05] tracking-[-0.02em] max-w-[820px] mx-auto"
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-5 max-w-[540px] mx-auto text-[#5a527e] text-[16.5px] leading-[1.5]"
        >
          {sub}
        </motion.p>
      )}
    </div>
  )
}

function FeatureCard({ f, i }) {
  const cardRef  = useRef(null)
  const glowRef  = useRef(null)
  const [hot, setHot] = useState(false)
  const Icon = ICONS[f.icon]

  // Direct DOM mutation — zero React re-renders on mouse move
  const onMove = useCallback((e) => {
    if (!cardRef.current || !glowRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    const mx = ((e.clientX - r.left) / r.width) * 100
    const my = ((e.clientY - r.top)  / r.height) * 100
    glowRef.current.style.background =
      `radial-gradient(420px circle at ${mx}% ${my}%, ${f.accent}22, transparent 50%)`
  }, [f.accent])

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => { setHot(false); if (glowRef.current) glowRef.current.style.background = 'none' }}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      style={{ willChange: 'transform' }}
      className="relative rounded-3xl bg-white border border-[#f0ecff] p-7 overflow-hidden group"
    >
      {/* Glow layer — mutated directly, no state */}
      <div ref={glowRef} className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute top-4 right-5 font-mono text-[11px] text-[#9a93b8]">0{i + 1}</div>

      <motion.div
        animate={hot ? { rotate: [0, -8, 8, 0], y: [-2, -6, -2] } : { rotate: 0, y: 0 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        className={`relative inline-grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br ${f.tint} shadow-[0_12px_24px_-12px_rgba(80,60,180,0.35)]`}
      >
        {Icon && <Icon size={22} stroke={2} className="text-[#1a1530]" />}
        <motion.span
          className="absolute -right-1 -top-1 text-[#ffb3c8]"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        >✶</motion.span>
      </motion.div>

      <h3 className="mt-6 text-[22px] font-display leading-tight">{f.title}</h3>
      <p className="mt-2 text-[14.5px] leading-[1.55] text-[#5a527e]">{f.desc}</p>
      <div className="mt-5 flex items-center gap-1.5 text-[13px] text-[#1a1530]">
        <span className="ul-draw">Learn more</span>
        <motion.span animate={hot ? { x: 4 } : { x: 0 }} transition={{ type: 'spring', stiffness: 300 }}>
          <IconArrowRight size={14}/>
        </motion.span>
      </div>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section id="features" className="relative px-6 py-16 md:py-24">
      <div className="max-w-[1180px] mx-auto">
        <SectionHeader
          eyebrow="What's inside"
          title={<>Quietly, almost <em className="font-display italic">stubbornly</em> good.</>}
          sub="Six things we got obsessive about so you don't have to think about them."
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => <FeatureCard key={i} f={f} i={i} />)}
        </div>
      </div>
    </section>
  )
}
