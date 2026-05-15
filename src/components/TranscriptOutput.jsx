import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconCopy, IconDownload, IconSearch, IconCheck, IconClock, IconHash, IconType } from '../icons'

function Stat({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-[#f6f1ea] px-2.5 py-1 text-[12px] text-[#1a1530] font-medium">
      <span className="text-[#9a93b8]">{icon}</span>{label}
    </div>
  )
}

function ActionBtn({ icon, label, onClick, hot }) {
  return (
    <motion.button onClick={onClick} whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}
      animate={hot ? { backgroundColor: '#1a1530', color: '#fbf8f4' } : { backgroundColor: '#ffffff', color: '#1a1530' }}
      transition={{ duration: 0.25 }}
      className="rounded-full border border-[#f6f1ea] px-3.5 py-2 text-sm font-medium flex items-center gap-1.5"
    >
      {icon} {label}
    </motion.button>
  )
}

function Highlight({ text, q }) {
  if (!q.trim()) return text
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.split(re).map((p, i) =>
    re.test(p)
      ? <mark key={i} className="bg-gradient-to-r from-amber-200 to-[rgba(255,179,200,0.8)] text-[#1a1530] rounded px-0.5">{p}</mark>
      : <span key={i}>{p}</span>
  )
}

export default function TranscriptOutput({ data, meta, showTimestamps }) {
  const [query,        setQuery]        = useState('')
  const [copied,       setCopied]       = useState(false)
  const [thumbErr,     setThumbErr]     = useState(false)
  const [ideas,        setIdeas]        = useState(null)
  const [ideasLoading, setIdeasLoading] = useState(false)
  const [ideasError,   setIdeasError]   = useState('')
  const [scriptCount,  setScriptCount]  = useState(0)
  const [activeScript, setActiveScript] = useState(null)
  const [scriptLoading,setScriptLoading]= useState(null)
  const [scriptError,  setScriptError]  = useState('')
  const [showAd,       setShowAd]       = useState(false)
  const [pendingIdea,  setPendingIdea]  = useState(null)
  const [copiedIdea,   setCopiedIdea]   = useState(null)
  const [copiedScript, setCopiedScript] = useState(false)
  const [adTimer,      setAdTimer]      = useState(5)

  const wordCount = useMemo(() => data.reduce((n, b) => n + b.text.split(/\s+/).length, 0), [data])
  const filtered  = useMemo(() => {
    if (!query.trim()) return data
    const q = query.toLowerCase()
    return data.filter(b => b.text.toLowerCase().includes(q))
  }, [query, data])

  useEffect(() => {
    if (!showAd) return
    setAdTimer(5)
    const id = setInterval(() => setAdTimer(t => { if (t <= 1) { clearInterval(id); return 0 } return t - 1 }), 1000)
    return () => clearInterval(id)
  }, [showAd])

  const buildText = () => showTimestamps
    ? data.map(b => `[${b.t}] ${b.text}`).join('\n\n')
    : data.map(b => b.text).join('\n\n')

  const doCopy = (txt, onDone) => {
    const fallback = () => {
      const ta = document.createElement('textarea')
      ta.value = txt; ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta); ta.focus(); ta.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(ta)
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).catch(fallback)
    else fallback()
    onDone()
  }

  const onCopy = () => {
    doCopy(buildText(), () => { setCopied(true); setTimeout(() => setCopied(false), 1600) })
  }

  const onDownload = () => {
    const txt = buildText()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }))
    a.download = `transcript-${meta?.videoId || 'video'}.txt`
    a.click()
  }

  const onGetIdeas = async () => {
    if (ideas) return
    setIdeasLoading(true); setIdeasError('')
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: data, title: meta?.title || 'YouTube Video' }),
      })
      const json = await res.json()
      if (!res.ok || json.error) { setIdeasError(json.error || 'Failed'); setIdeasLoading(false); return }
      setIdeas(json.ideas)
    } catch { setIdeasError('Network error — try again.') }
    setIdeasLoading(false)
  }

  const copyIdea = (idea, i) => {
    doCopy(`${idea.title}\n\n${idea.hook}`, () => { setCopiedIdea(i); setTimeout(() => setCopiedIdea(null), 1600) })
  }

  const fetchScript = async (idea, index) => {
    setScriptLoading(index); setScriptError('')
    try {
      const res = await fetch('/api/script-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, transcript: data, videoTitle: meta?.title }),
      })
      const json = await res.json()
      if (!res.ok || json.error) { setScriptError(json.error || 'Failed'); setScriptLoading(null); return }
      setActiveScript({ ideaIndex: index, idea, data: json })
      setScriptCount(c => c + 1)
    } catch { setScriptError('Network error — try again.') }
    setScriptLoading(null)
  }

  const handleGetScript = (idea, index) => {
    if (scriptLoading !== null) return
    if (activeScript?.ideaIndex === index) {
      document.getElementById('script-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setScriptError('')
    if (scriptCount >= 1) { setPendingIdea({ idea, index }); setShowAd(true); return }
    fetchScript(idea, index)
  }

  const handleAdComplete = () => {
    setShowAd(false)
    if (pendingIdea) { fetchScript(pendingIdea.idea, pendingIdea.index); setPendingIdea(null) }
  }

  const copyScriptPrompt = () => {
    if (!activeScript) return
    const { data: sd, idea } = activeScript
    const lines = [
      `VIDEO IDEA: ${idea.title}`,
      `Hook: ${idea.hook}`,
      `Estimated Duration: ${sd.duration || ''}`,
      '',
      'SECTIONS:',
      ...(sd.sections || []).flatMap(s => [`\n▸ ${s.name}${s.duration ? ` (${s.duration})` : ''}`, ...(s.points || []).map(p => `  • ${p}`)]),
      '',
      'CALL TO ACTION:',
      sd.cta || '',
      '',
      '─── AI SCRIPT PROMPT ───',
      sd.prompt || '',
    ]
    doCopy(lines.join('\n'), () => { setCopiedScript(true); setTimeout(() => setCopiedScript(false), 1600) })
  }

  const title    = meta?.title    || 'YouTube Video'
  const channel  = meta?.channel  || ''
  const views    = meta?.views    || ''
  const duration = meta?.duration || ''
  const langLabel = meta?.detectedLanguage || 'auto-detected'
  const thumbUrl  = meta?.videoId && !thumbErr
    ? `https://img.youtube.com/vi/${meta.videoId}/hqdefault.jpg`
    : null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: 'auto', marginTop: 28 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="rounded-2xl bg-[#f6f1ea]/60 border border-[#f6f1ea]">
        {/* Thumbnail */}
        {thumbUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full overflow-hidden rounded-t-2xl" style={{ aspectRatio: '16/9', maxHeight: '220px' }}
          >
            <img src={thumbUrl} onError={() => setThumbErr(true)} alt={title}
              className="w-full h-full object-cover" style={{ objectPosition: 'center' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </motion.div>
        )}

        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex flex-wrap gap-4 items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#9a93b8]">Source</div>
            <div className="font-display text-[20px] leading-tight mt-1 max-w-[480px] line-clamp-2">{title}</div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-[#5a527e]">
              {channel && <><span className="font-medium">{channel}</span><span>·</span></>}
              {views   && <><span>{views}</span><span>·</span></>}
              {duration&& <><span>{duration}</span><span>·</span></>}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 border border-[#f6f1ea] font-medium text-[#1a1530]">{langLabel}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Stat icon={<IconType size={12}/>}  label={`${wordCount.toLocaleString()} words`} />
            {duration && <Stat icon={<IconClock size={12}/>} label={duration} />}
            <Stat icon={<IconHash size={12}/>}  label={`${data.length} segments`} />
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-5 pb-3 flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-white border border-[#f6f1ea] rounded-full px-3.5 py-2">
            <IconSearch size={14} className="text-[#9a93b8]" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search inside transcript…"
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-[#9a93b8]" />
            {query && <span className="text-[11px] text-[#9a93b8] font-mono">{filtered.length} match{filtered.length === 1 ? '' : 'es'}</span>}
          </div>
          <ActionBtn onClick={onCopy}     icon={copied ? <IconCheck size={14} stroke={3}/> : <IconCopy size={14}/>}     label={copied ? 'Copied' : 'Copy'} hot={copied} />
          <ActionBtn onClick={onDownload} icon={<IconDownload size={14}/>}                                               label=".txt" />
          <motion.button onClick={onGetIdeas} disabled={ideasLoading}
            whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}
            className="rounded-full border border-[#f6f1ea] px-3.5 py-2 text-sm font-medium flex items-center gap-1.5 bg-white text-[#1a1530] disabled:opacity-60"
          >
            {ideasLoading
              ? <><span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-[#9a93b8]/40 border-t-[#7b6cf2] animate-spin mr-1.5"/>Thinking…</>
              : <><span className="mr-1">💡</span>Video Ideas</>}
          </motion.button>
        </div>

        {/* Transcript scroller */}
        <div className="relative max-h-[440px] overflow-y-auto px-5 pb-5">
          <div key={query} className="space-y-2">
            <AnimatePresence>
              {filtered.map((b, i) => (
                <motion.div key={b.t + '-' + i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i, 20) * 0.025, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 4 }}
                  className="group flex gap-3 p-3 rounded-xl hover:bg-white/70 transition-colors cursor-pointer"
                >
                  {showTimestamps && (
                    <div className="shrink-0">
                      <div className="font-mono text-[11px] text-[#9a93b8] group-hover:text-[#1a1530] transition-colors bg-[#f6f1ea]/60 group-hover:bg-[#fbf8f4] rounded-md px-2 py-1">
                        {b.t}
                      </div>
                    </div>
                  )}
                  <p className="text-[15px] leading-[1.55] text-[#2d2654]">
                    <Highlight text={b.text} q={query} />
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-[#9a93b8] text-sm">
                <span className="font-display italic text-[18px]">nothing found.</span><br />try a different query.
              </motion.div>
            )}
          </div>
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-8 bg-gradient-to-b from-[#f6f1ea]/80 to-transparent" />
          <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-t from-[#f6f1ea]/80 to-transparent" />
        </div>
      </div>

      {/* ── Ideas panel ── */}
      <AnimatePresence>
        {(ideas || ideasError) && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
            className="overflow-hidden mt-3"
          >
            <div className="rounded-2xl bg-[#f6f1ea]/60 border border-[#f6f1ea] p-5">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#9a93b8] mb-4">💡 Video Ideas based on this transcript</div>
              {ideasError && <p className="text-rose-600 text-sm">{ideasError}</p>}
              {ideas && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ideas.map((idea, i) => {
                    const isActive   = activeScript?.ideaIndex === i
                    const isLoading  = scriptLoading === i
                    return (
                      <motion.div key={i}
                        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                        transition={{ delay: i*0.06, duration:0.5, ease:[0.22,1,0.36,1] }}
                        className={`rounded-xl bg-white border p-4 flex flex-col gap-2 transition-shadow ${isActive ? 'border-[#7b6cf2] shadow-[0_0_0_2px_rgba(123,108,242,0.15)]' : 'border-[#f0ecff] hover:shadow-[0_4px_20px_-8px_rgba(80,60,180,0.18)]'}`}
                      >
                        {/* Title row with copy button */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-medium text-[14px] text-[#1a1530] leading-snug flex-1">{idea.title}</div>
                          <motion.button onClick={() => copyIdea(idea, i)} whileTap={{ scale: 0.85 }}
                            className="shrink-0 p-1 rounded-md text-[#9a93b8] hover:text-[#1a1530] hover:bg-[#f6f1ea] transition-colors"
                            title="Copy idea"
                          >
                            {copiedIdea === i ? <IconCheck size={13} stroke={3}/> : <IconCopy size={13}/>}
                          </motion.button>
                        </div>
                        <div className="text-[12px] text-[#9a93b8] leading-relaxed">{idea.hook}</div>
                        {/* Get Script button */}
                        <motion.button onClick={() => handleGetScript(idea, i)} disabled={isLoading}
                          whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}
                          className={`mt-1 w-full rounded-lg py-2 text-[12px] font-medium flex items-center justify-center gap-1.5 border transition-colors disabled:opacity-60 ${isActive ? 'bg-[#7b6cf2] text-white border-[#7b6cf2]' : 'bg-[#f6f1ea] text-[#1a1530] border-[#f0ecff] hover:bg-[#ede7ff] hover:border-[#c4b8ff]'}`}
                        >
                          {isLoading
                            ? <><span className="inline-block h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin"/>Generating…</>
                            : isActive
                              ? <>✓ Script Ready — view below</>
                              : <>{scriptCount >= 1 ? '📺 Watch Ad + ' : ''}📝 Get Script Prompt</>}
                        </motion.button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
              {scriptError && (
                <p className="mt-3 text-rose-600 text-sm">{scriptError}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Script blueprint panel ── */}
      <AnimatePresence>
        {activeScript && (
          <motion.div id="script-panel"
            initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }} transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
            className="overflow-hidden mt-3"
          >
            <div className="rounded-2xl border border-[#e0daff] bg-white p-5">
              {/* Panel header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#9a93b8]">📝 Script Blueprint</div>
                  <div className="font-medium text-[15px] text-[#1a1530] mt-0.5 leading-snug">{activeScript.idea.title}</div>
                </div>
                <div className="flex items-center gap-2">
                  {activeScript.data.duration && (
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#f0ecff] text-[#7b6cf2]">
                      ⏱ {activeScript.data.duration}
                    </span>
                  )}
                  <motion.button onClick={() => setActiveScript(null)} whileTap={{ scale: 0.85 }}
                    className="p-1.5 rounded-lg text-[#9a93b8] hover:text-[#1a1530] hover:bg-[#f6f1ea] transition-colors text-[16px] leading-none"
                  >×</motion.button>
                </div>
              </div>

              {/* Hook */}
              {activeScript.data.hook && (
                <div className="mb-4 rounded-xl bg-[#f6f1ea] border border-[#f0ecff] p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#9a93b8] mb-1">Opening Hook</div>
                  <p className="text-[13px] text-[#1a1530] italic leading-relaxed">"{activeScript.data.hook}"</p>
                </div>
              )}

              {/* Sections */}
              {activeScript.data.sections?.length > 0 && (
                <div className="mb-4 space-y-2">
                  {activeScript.data.sections.map((s, si) => (
                    <motion.div key={si} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                      transition={{ delay: si*0.05, duration:0.4 }}
                      className="rounded-xl border border-[#f0ecff] p-3.5"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#ede7ff] text-[#7b6cf2] text-[10px] font-bold shrink-0">{si + 1}</span>
                        <span className="text-[13px] font-semibold text-[#1a1530]">{s.name}</span>
                        {s.duration && <span className="text-[11px] text-[#9a93b8]">· {s.duration}</span>}
                      </div>
                      <ul className="space-y-1 pl-7">
                        {(s.points || []).map((p, pi) => (
                          <li key={pi} className="text-[12px] text-[#5a527e] leading-relaxed flex gap-1.5">
                            <span className="text-[#c4b8ff] mt-0.5">•</span><span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* CTA */}
              {activeScript.data.cta && (
                <div className="mb-4 rounded-xl bg-[#f0ecff] border border-[#e0daff] p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#9a93b8] mb-1">Call to Action</div>
                  <p className="text-[13px] text-[#1a1530] leading-relaxed">{activeScript.data.cta}</p>
                </div>
              )}

              {/* Copy prompt button */}
              <motion.button onClick={copyScriptPrompt}
                whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                className="w-full rounded-xl py-3 font-medium text-[13px] flex items-center justify-center gap-2 bg-[#1a1530] text-white hover:bg-[#2d2654] transition-colors"
              >
                {copiedScript
                  ? <><IconCheck size={14} stroke={3}/> Copied to clipboard!</>
                  : <><IconCopy size={14}/> Copy Full AI Prompt (paste into ChatGPT / Claude)</>}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ad modal ── */}
      <AnimatePresence>
        {showAd && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(26,21,48,0.6)', backdropFilter: 'blur(6px)' }}
          >
            <motion.div initial={{ scale:0.9, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }}
              exit={{ scale:0.9, opacity:0, y:20 }} transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
            >
              {/* Ad label */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f6f1ea]">
                <span className="text-[11px] uppercase tracking-widest text-[#9a93b8] font-medium">Advertisement</span>
                <button onClick={() => { setShowAd(false); setPendingIdea(null) }}
                  className="text-[#9a93b8] hover:text-[#1a1530] text-lg leading-none transition-colors">×</button>
              </div>

              {/* Ad slot placeholder */}
              <div className="mx-4 my-4 rounded-xl bg-[#f6f1ea] border-2 border-dashed border-[#e0daff] flex flex-col items-center justify-center gap-2 text-[#c4b8ff]"
                style={{ height: '200px' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
                <span className="text-[12px] text-[#9a93b8]">Ad space — Google Ads coming soon</span>
              </div>

              {/* Footer */}
              <div className="px-4 pb-4 flex flex-col gap-2">
                <p className="text-center text-[12px] text-[#9a93b8]">
                  Watch a short ad to unlock another script prompt for free.
                </p>
                <motion.button onClick={adTimer === 0 ? handleAdComplete : undefined}
                  disabled={adTimer > 0}
                  whileHover={adTimer === 0 ? { y: -1 } : {}} whileTap={adTimer === 0 ? { scale: 0.97 } : {}}
                  className="w-full rounded-xl py-3 text-[13px] font-semibold flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
                  style={{ backgroundColor: adTimer === 0 ? '#1a1530' : '#e8e4f0', color: adTimer === 0 ? '#fff' : '#9a93b8' }}
                >
                  {adTimer > 0 ? `Continue in ${adTimer}s…` : '✓ Continue — Get Script Prompt'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
