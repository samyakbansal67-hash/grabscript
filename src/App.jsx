import { useRef, useEffect, memo } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import AnimatedBackdrop from './components/AnimatedBackdrop'
import TopNav from './components/TopNav'
import Hero from './components/Hero'
import TranscriptCard from './components/TranscriptCard'
import Ticker from './components/Ticker'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import QuoteBand from './components/QuoteBand'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

// Cursor lives outside App so its spring updates NEVER re-render the tree
function CustomCursor({ mx, my }) {
  const x = useSpring(mx, { stiffness: 250, damping: 30, mass: 0.4 })
  const y = useSpring(my, { stiffness: 250, damping: 30, mass: 0.4 })
  return (
    <motion.div
      className="hidden md:block pointer-events-none fixed top-0 left-0 z-[80] mix-blend-multiply"
      style={{ x, y, translateX: '-50%', translateY: '-50%', willChange: 'transform' }}
    >
      <div className="h-6 w-6 rounded-full border border-[#1a1530]/50 bg-white/20" />
    </motion.div>
  )
}

// Memo-ize sections that never need to re-render
const MemoTicker     = memo(Ticker)
const MemoFeatures   = memo(Features)
const MemoHowItWorks = memo(HowItWorks)
const MemoQuoteBand  = memo(QuoteBand)
const MemoFooter     = memo(Footer)

export default function App() {
  const cardRef = useRef(null)
  // Motion values — changing them does NOT cause React re-renders
  const cmx = useMotionValue(0)
  const cmy = useMotionValue(0)

  useEffect(() => {
    let rafId
    const onMove = (e) => {
      // Batch cursor updates inside rAF so we never block the main thread
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        cmx.set(e.clientX)
        cmy.set(e.clientY)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const jumpToCard = () =>
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  return (
    <>
      <AnimatedBackdrop />
      <CustomCursor mx={cmx} my={cmy} />
      <TopNav onJump={jumpToCard} />
      <main className="relative">
        <Hero onJump={jumpToCard} />
        <TranscriptCard anchorRef={cardRef} />
        <MemoTicker />
        <MemoFeatures />
        <MemoHowItWorks />
        <MemoQuoteBand />
        <FinalCTA onJump={jumpToCard} />
        <MemoFooter />
      </main>
    </>
  )
}
