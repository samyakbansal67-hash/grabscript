import { motion } from 'framer-motion'
import { STEPS } from '../data'
import { ICONS } from '../icons'

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

function Step({ s, i }) {
  const Icon = ICONS[s.icon]
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative text-center"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        style={{ willChange: 'transform' }}
        className="mx-auto relative grid place-items-center h-[120px] w-[120px] rounded-[36px] bg-white border border-[#ede9ff] shadow-[0_24px_50px_-20px_rgba(80,60,180,0.3)]"
      >
        {Icon && <Icon size={36} stroke={1.8} className="text-[#1a1530]" />}
        <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}>
          <span className="absolute left-1/2 -top-1.5 -translate-x-1/2 h-3 w-3 rounded-full bg-gradient-to-br from-[#7b6cf2] to-[#ffb3c8] shadow-md" />
        </motion.div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[11px] bg-[#1a1530] text-[#fbf8f4] px-2 py-0.5 rounded-full">
          step {s.n}
        </div>
      </motion.div>
      <h3 className="mt-10 font-display text-[28px] leading-tight">{s.title}</h3>
      <p className="mt-2 mx-auto max-w-[280px] text-[#5a527e] text-[15px] leading-[1.55]">{s.desc}</p>
    </motion.div>
  )
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-16 md:py-24">
      <div className="max-w-[960px] mx-auto">
        <SectionHeader
          eyebrow="How it works"
          title={<>Three steps. <em className="font-display italic">No menus.</em></>}
          sub="The whole flow takes less time than it does to read this sentence."
        />
        <div className="mt-16 relative">
          {/* SVG path connector */}
          <svg className="hidden md:block absolute left-[10%] right-[10%] top-[68px] pointer-events-none"
            width="80%" height="80" viewBox="0 0 800 80" preserveAspectRatio="none" style={{ margin: '0 auto' }}>
            <motion.path d="M 50 40 C 180 -10, 320 90, 400 40 S 620 -10, 750 40"
              fill="none" stroke="url(#howGrad)" strokeWidth="1.6" strokeDasharray="2 8"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="howGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7b6cf2"/>
                <stop offset="50%" stopColor="#c66dd6"/>
                <stop offset="100%" stopColor="#ff8aaa"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-[900px] mx-auto">
            {STEPS.map((s, i) => <Step key={i} s={s} i={i} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
