import { TICKER } from '../data'

export default function Ticker() {
  const items = [...TICKER, ...TICKER]
  return (
    <section className="py-10 overflow-hidden">
      <div className="flex gap-12 marquee-track whitespace-nowrap">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-12 text-[#5a527e]">
            <span className="font-display italic text-[28px] md:text-[36px]">{it}</span>
            <span className="text-[#ffb3c8] text-2xl">✶</span>
          </div>
        ))}
      </div>
    </section>
  )
}
