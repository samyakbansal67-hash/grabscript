import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { IconArrowRight, IconPlay } from '../icons'

function StaggerLine({ text, delay = 0 }) {
  return (
    <span className="inline-block overflow-hidden align-baseline leading-[1.05] pb-1">
      {String(text).split('').map((ch, i) => (
        <motion.span key={i}
          initial={{ y: '110%', opacity: 0, rotate: 6 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.035 }}
          className="inline-block" style={{ whiteSpace: 'pre' }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}

function FloatingChips() {
  const chips = [
    { txt: '00:00',                      x: '6%',  y: '10%', rot: -8, delay: 0,   big: false },
    { txt: 'auto-detect',                x: '88%', y: '12%', rot: 6,  delay: 0.4, big: false },
    { txt: '✶ with timestamps',          x: '4%',  y: '70%', rot: 4,  delay: 0.8, big: false },
    { txt: '"pleasant is underrated."',  x: '86%', y: '64%', rot: -6, delay: 1.2, big: true  },
  ]
  return (
    <>
      {chips.map((c, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: c.rot }}
          transition={{ delay: 1.2 + c.delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`hidden md:block absolute select-none ${c.big ? 'font-display italic text-[20px] text-[#1a1530]' : 'font-mono text-[12px] text-[#5a527e]'} bg-white/90 border border-white/80 shadow-sm px-3 py-1.5 rounded-full`}
          style={{ left: c.x, top: c.y }}
        >
          <motion.span className="block" animate={{ y: [0, -6, 0] }} transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}>
            {c.txt}
          </motion.span>
        </motion.div>
      ))}
    </>
  )
}

export default function Hero({ onJump }) {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const parY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const parO = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={heroRef} className="relative pt-36 pb-12 md:pt-44 md:pb-20">
      <motion.div style={{ y: parY, opacity: parO, willChange: 'transform, opacity' }} className="max-w-[1180px] mx-auto px-6 text-center will-anim">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-[#2d2654]"
        >
          <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 text-emerald-400 pulse-ring" />
          <span className="font-medium">Auto language detection</span>
          <span className="text-[#9a93b8]">·</span>
          <span className="text-[#5a527e]">v2.5</span>
        </motion.div>

        {/* Headline */}
        <h1 className="font-display mt-7 leading-[0.95] tracking-[-0.02em]" style={{ fontSize: 'clamp(54px,11.5vw,112px)' }}>
          <StaggerLine delay={0.35} text="YouTube" />
          <span className="block overflow-hidden leading-[1.05] pb-2">
            <motion.span
              initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block grad-text italic"
            >
              Transcript
            </motion.span>
          </span>
          <span className="inline-flex items-baseline">
            <StaggerLine delay={0.85} text="Generator" />
            <motion.span
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: 'spring', stiffness: 220 }}
              className="text-[#ffb3c8]"
            >.</motion.span>
          </span>
        </h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="mx-auto mt-7 max-w-[560px] text-[17px] md:text-[19px] leading-[1.5] text-[#5a527e]"
        >
          Generate clean, timestamped transcripts from any YouTube video — language is auto-detected instantly.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.button onClick={onJump} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden shine group rounded-full bg-[#1a1530] text-[#fbf8f4] pl-6 pr-5 py-3.5 text-[15px] font-medium flex items-center gap-2 shadow-[0_18px_40px_-12px_rgba(40,20,80,0.45)]"
          >
            <span className="relative z-10">Generate a transcript</span>
            <span className="relative z-10 grid place-items-center h-7 w-7 rounded-full bg-[rgba(255,255,255,0.15)]">
              <IconArrowRight size={14} />
            </span>
          </motion.button>
          <motion.a href="#how-it-works" whileHover={{ y: -2 }}
            className="rounded-full bg-white border border-[#ede9ff] text-[#2d2654] pl-5 pr-5 py-3.5 text-[15px] font-medium flex items-center gap-2"
          >
            <IconPlay size={14} stroke={2.4} />
            See how it works
          </motion.a>
        </motion.div>

        {/* "free, forever" with arrow */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="relative mt-2 flex items-center justify-center gap-2 text-[#5a527e] text-sm"
        >
          <span className="font-display italic text-[18px]">free, forever</span>
          <svg width="64" height="36" viewBox="0 0 64 36" fill="none" className="text-[#9a93b8]">
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.7, duration: 1.2, ease: 'easeInOut' }}
              d="M2 4 C 20 30, 40 30, 58 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.6, duration: 0.4 }}
              d="M58 14 L 52 12 M58 14 L 56 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </svg>
        </motion.div>

        <FloatingChips />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-14 inline-flex flex-col items-center text-[#9a93b8] text-xs gap-1"
        >
          <span className="uppercase tracking-[0.2em]">scroll</span>
          <span className="caret-down">↓</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
