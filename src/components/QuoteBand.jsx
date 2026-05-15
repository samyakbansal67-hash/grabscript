import { motion } from 'framer-motion'

export default function QuoteBand() {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="max-w-[860px] mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7 }}
          className="text-[#ffb3c8] text-[60px] md:text-[80px] font-display leading-none"
        >"</motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-[26px] md:text-[48px] leading-[1.1] tracking-[-0.01em] -mt-6 md:-mt-8"
        >
          Honestly the only transcript tool I've kept open in a tab for a whole quarter. It just <em className="italic">works</em>, and it's <em className="italic">kind</em> about it.
        </motion.p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#a17af0] via-[#ffb3c8] to-[#ffd6b3] shadow-md" />
          <div className="text-left">
            <div className="text-sm font-medium">Maya Okafor</div>
            <div className="text-xs text-[#9a93b8]">Senior PM · Substrate Studios</div>
          </div>
        </div>
      </div>
    </section>
  )
}
