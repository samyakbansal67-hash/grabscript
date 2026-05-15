import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconSpark } from '../icons'

const phrases = ['Connecting to server', 'Fetching caption track', 'Parsing timestamps', 'Cleaning text', 'Almost there…']

function Waveform() {
  return (
    <div className="flex items-end gap-[3px] h-9">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span key={i}
          className="block w-[3px] rounded-full bg-gradient-to-t from-[#7b6cf2] to-[#ffb3c8]"
          style={{ transformOrigin: 'bottom', height: '100%' }}
          animate={{ scaleY: [0.2, 0.95, 0.4, 1, 0.3] }}
          transition={{ duration: 1.1 + (i % 5) * 0.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
        />
      ))}
    </div>
  )
}

export default function LoadingPanel() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % phrases.length), 700)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: 'auto', marginTop: 28 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="rounded-2xl bg-[#f6f1ea]/70 p-5 border border-[#f6f1ea]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-[#7b6cf2] to-[#a17af0] text-white">
              <IconSpark size={16} stroke={2.4} />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] text-[#2d2654] font-medium">
                <AnimatePresence mode="wait">
                  <motion.span key={idx}
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.35 }} className="inline-block"
                  >
                    {phrases[idx]}
                  </motion.span>
                </AnimatePresence>
                <span className="cursor-blink ml-1">▍</span>
              </div>
              <div className="text-[11px] text-[#9a93b8] mt-0.5 font-mono">grabscript · fetching captions</div>
            </div>
          </div>
          <Waveform />
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-1 rounded-full bg-[#f6f1ea] overflow-hidden">
          <motion.div
            initial={{ width: '0%' }} animate={{ width: '100%' }}
            transition={{ duration: 8, ease: [0.4, 0, 0.2, 1] }}
            className="h-full bg-gradient-to-r from-[#7b6cf2] via-[#a17af0] to-[#ffb3c8]"
          />
        </div>

        {/* Shimmer skeleton rows */}
        <div className="mt-6 space-y-3">
          {[100, 92, 78, 96, 70].map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }} className="flex items-start gap-3"
            >
              <div className="shimmer h-3 w-12 rounded-md mt-1.5 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="shimmer h-3 rounded-md" style={{ width: w + '%' }} />
                <div className="shimmer h-3 rounded-md" style={{ width: (w - 14) + '%' }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
