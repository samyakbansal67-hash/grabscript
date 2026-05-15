import { motion } from 'framer-motion'
import { IconArrowRight } from '../icons'

const NAV = [
  { l: 'Features',     h: '#features'    },
  { l: 'How it works', h: '#how-it-works' },
  { l: 'About',        h: '/about'        },
  { l: 'Contact',      h: '/contact'      },
]

export default function TopNav({ onJump }) {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1180px,calc(100%-32px))]"
    >
      <div className="glass rounded-2xl px-5 py-2.5 flex items-center justify-between shadow-[0_8px_30px_-12px_rgba(60,40,120,0.18)]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative h-9 w-9 shrink-0"
          >
            <img src="/logo.svg" alt="GrabScript" className="h-full w-full" />
          </motion.div>
          <span className="font-display text-[20px] tracking-tight italic">GrabScript</span>
        </a>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-4 md:gap-6 text-[13.5px] text-[#2d2654] mx-4">
          {NAV.map(it => (
            <a key={it.l} href={it.h} className="ul-draw whitespace-nowrap">{it.l}</a>
          ))}
        </nav>

        {/* CTA */}
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="relative overflow-hidden shine rounded-full bg-[#1a1530] text-[#fbf8f4] text-sm font-medium pl-4 pr-3 py-2 flex items-center gap-1.5 shrink-0"
          onClick={onJump}
        >
          <span className="relative z-10">Try it free</span>
          <IconArrowRight size={14} className="relative z-10" />
        </motion.button>
      </div>
    </motion.header>
  )
}
