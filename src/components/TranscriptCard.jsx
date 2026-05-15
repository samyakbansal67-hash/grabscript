import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconLink, IconArrowRight, IconSpark, IconGlobe, IconCheck, IconPaste, IconX, IconAlert } from '../icons'
import LoadingPanel from './LoadingPanel'
import TranscriptOutput from './TranscriptOutput'

function Corners() {
  const C = ({ pos }) => (
    <div className={`absolute ${pos} text-[#9a93b8] opacity-50`}>
      <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.2" fill="none">
        <path d="M7 0v14M0 7h14" />
      </svg>
    </div>
  )
  return <><C pos="top-3 left-3"/><C pos="top-3 right-3"/><C pos="bottom-3 left-3"/><C pos="bottom-3 right-3"/></>
}

function BelowCardChips() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#5a527e]">
      {[['✶','no login'],['◐','no watermark'],['✦','auto language'],['◇','export anywhere']].map(([s,t],i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1*i, duration: 0.6 }} className="flex items-center gap-1.5"
        >
          <span className="text-[#ffb3c8]">{s}</span> {t}
        </motion.div>
      ))}
    </div>
  )
}

function Spinner() {
  return <span className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
}

export default function TranscriptCard({ anchorRef }) {
  const inputRef = useRef(null)
  const btnRef   = useRef(null)
  const [focused,    setFocused]    = useState(false)
  const [pasted,     setPasted]     = useState(false)
  const [timestamps, setTimestamps] = useState(true)
  const [phase,      setPhase]      = useState('idle')
  const [url,        setUrl]        = useState('')
  const [results,    setResults]    = useState(null)
  const [error,      setError]      = useState('')

  const onPaste = async () => {
    try { const t = await navigator.clipboard.readText(); if (t) setUrl(t) }
    catch { setUrl('https://youtu.be/dQw4w9WgXcQ') }
    setPasted(true); setTimeout(() => setPasted(false), 1200)
    inputRef.current?.focus()
  }

  const generate = async () => {
    setError('')
    const trimmed = url.trim()
    if (!trimmed) { setError('Please paste a YouTube URL first.'); return }
    setPhase('loading')
    try {
      const res = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed, timestamps }),
      })
      const json = await res.json()
      if (!res.ok || json.error) {
        setError(json.error || 'Something went wrong. Please try again.')
        setPhase('idle')
        return
      }
      setResults({ data: json.transcript, meta: json.meta })
      setPhase('done')
    } catch {
      setError('Network error — is the server running?')
      setPhase('idle')
    }
  }

  return (
    <section id="transcript-card" ref={anchorRef} className="relative px-6 -mt-2">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[920px] mx-auto"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
          className="anim-border-frame p-1.5 shadow-[0_40px_80px_-30px_rgba(60,40,120,0.35)]"
        >
          <div className="relative rounded-[24px] bg-white p-6 md:p-9 overflow-hidden">
            <Corners />

            {/* Window chrome */}
            <div className="flex items-center justify-between text-xs text-[#5a527e]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-300" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                <span className="ml-2 font-mono tracking-wider">grabscript / new transcript</span>
              </div>
              <span className="font-mono opacity-70 hidden sm:inline">⌘ + ⏎ to generate</span>
            </div>

            {/* URL input */}
            <div className="mt-6">
              <label className="block text-[13px] text-[#5a527e] mb-2 font-medium">Paste a YouTube link</label>
              <motion.div
                animate={focused
                  ? { boxShadow: '0 0 0 6px rgba(123,108,242,0.12), 0 20px 50px -20px rgba(80,60,180,0.35)' }
                  : { boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl bg-[#fbf8f4] border border-[#f6f1ea] px-4 py-3.5 flex items-center gap-3"
              >
                <IconLink size={18} className="text-[#9a93b8] shrink-0" />
                <input
                  ref={inputRef} value={url} onChange={e => setUrl(e.target.value)}
                  onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') btnRef.current?.click() }}
                  placeholder="youtube.com/watch?v=..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-[15px] placeholder:text-[#9a93b8]"
                />
                <AnimatePresence>
                  {url && (
                    <motion.button initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
                      onClick={() => { setUrl(''); setError('') }} className="text-[#9a93b8] hover:text-[#1a1530]" aria-label="Clear"
                    >
                      <IconX size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} onClick={onPaste}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-[#f6f1ea] text-[#1a1530] flex items-center gap-1.5"
                >
                  <AnimatePresence mode="wait">
                    {pasted
                      ? <motion.span key="ok" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-1"><IconCheck size={12} stroke={3}/> pasted</motion.span>
                      : <motion.span key="p"  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-1"><IconPaste size={12} stroke={2}/> paste</motion.span>}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </div>

            {/* Options row */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <motion.button onClick={() => setTimestamps(!timestamps)} whileTap={{ scale: 0.95 }}
                animate={{ backgroundColor: timestamps ? '#1a1530' : '#ffffff', color: timestamps ? '#fbf8f4' : '#5a527e', borderColor: timestamps ? '#1a1530' : '#f0e9df' }}
                transition={{ duration: 0.25 }}
                className="rounded-full border px-3 py-1.5 flex items-center gap-1.5 font-medium"
              >
                <motion.span animate={{ scale: timestamps ? 1 : 0, opacity: timestamps ? 1 : 0 }} transition={{ duration: 0.2 }} className="inline-block">
                  <IconCheck size={11} stroke={3} />
                </motion.span>
                with timestamps
              </motion.button>
              <div className="rounded-full border border-[#f6f1ea] px-3 py-1.5 flex items-center gap-1.5 font-medium text-[#9a93b8] bg-white/60 select-none">
                <IconGlobe size={11} stroke={2} />
                auto language
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.3 }} className="mt-4 overflow-hidden"
                >
                  <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-[13px] text-rose-700">
                    <IconAlert size={15} stroke={2} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate button */}
            <motion.button ref={btnRef} onClick={generate} disabled={phase === 'loading'}
              whileHover={phase !== 'loading' ? { y: -2 } : {}} whileTap={phase !== 'loading' ? { scale: 0.98 } : {}}
              className="relative overflow-hidden shine mt-7 w-full rounded-2xl bg-gradient-to-r from-[#7b6cf2] via-[#a17af0] to-[#ffb3c8] text-white py-4 font-medium text-[15px] flex items-center justify-center gap-2 shadow-[0_22px_44px_-18px_rgba(123,108,242,0.65)] disabled:opacity-70"
            >
              <AnimatePresence mode="wait">
                {phase === 'loading'
                  ? <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Spinner /> Fetching transcript…
                    </motion.span>
                  : <motion.span key="g" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 relative z-10">
                      <IconSpark size={16} stroke={2.4} /> Generate transcript
                    </motion.span>
                }
              </AnimatePresence>
            </motion.button>

            <p className="mt-4 text-center text-[12px] text-[#9a93b8]">No login required · no signup · free forever</p>

            <AnimatePresence mode="wait">
              {phase === 'loading' && <LoadingPanel key="ld" />}
              {phase === 'done' && results && (
                <TranscriptOutput key="out" data={results.data} meta={results.meta} showTimestamps={timestamps} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <BelowCardChips />
      </motion.div>
    </section>
  )
}
