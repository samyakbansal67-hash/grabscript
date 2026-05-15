const COLS = [
  { t: 'Product', items: [{ l: 'Features', h: '#features' }, { l: 'How it works', h: '#how-it-works' }] },
  { t: 'Company', items: [{ l: 'About', h: '/about' }, { l: 'Contact', h: '/contact' }] },
  { t: 'Legal',   items: [{ l: 'Privacy Policy', h: '/privacy' }, { l: 'Terms of Service', h: '/terms' }, { l: 'Cookie Policy', h: '/cookies' }, { l: 'Disclaimer', h: '/disclaimer' }, { l: 'FAQ', h: '/faq' }] },
]

export default function Footer() {
  return (
    <footer className="relative px-6 pt-16 pb-10">
      <div className="max-w-[1180px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Logo col */}
          <div className="col-span-2 sm:col-span-1">
            <a href="/" className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="GrabScript" className="h-9 w-9" />
              <span className="font-display text-[26px] italic">GrabScript</span>
            </a>
            <p className="mt-4 text-sm text-[#5a527e] leading-[1.55] max-w-[280px]">
              A clean, fast transcript tool. Supports English, Hindi, and more. Free forever.
            </p>
          </div>

          {/* Link cols */}
          {COLS.map(col => (
            <div key={col.t}>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#9a93b8]">{col.t}</div>
              <ul className="mt-3 space-y-2 text-[14px] text-[#1a1530]">
                {col.items.map(it => (
                  <li key={it.l}><a href={it.h} className="ul-draw">{it.l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-5 border-t border-[#f6f1ea] flex flex-wrap items-center justify-between gap-4">
          <div className="text-[12.5px] text-[#5a527e]">© {new Date().getFullYear()} GrabScript · free forever</div>
          <a href="mailto:s.bansaluptowork@gmail.com" className="text-[12.5px] text-[#5a527e] ul-draw">
            s.bansaluptowork@gmail.com
          </a>
        </div>

        {/* Big "GrabScript" watermark text */}
        <div className="mt-6 overflow-hidden">
          <div className="font-display italic leading-[0.85] tracking-[-0.03em] text-center select-none"
            style={{
              fontSize: 'clamp(60px,18vw,280px)',
              background: 'linear-gradient(180deg,rgba(26,21,48,0.12) 0%,rgba(26,21,48,0) 90%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>
            GrabScript
          </div>
        </div>
      </div>
    </footer>
  )
}
