import { motion } from 'framer-motion'
import { IconArrowRight } from '../icons'

export default function FinalCTA({ onJump }) {
  return (
    <section className="px-6 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.8 }}
        className="relative max-w-[1100px] mx-auto rounded-[28px] md:rounded-[40px] overflow-hidden p-8 md:p-20 text-center"
        style={{ background: 'linear-gradient(135deg, #efe7ff 0%, #ffe1ec 50%, #e0eeff 100%)' }}
      >
        {/* Animated blobs */}
        <motion.div className="absolute -left-20 -top-20 h-72 w-72 rounded-full"
          style={{ background: 'radial-gradient(circle, #b6a8ff, transparent 70%)', filter: 'blur(40px)' }}
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full"
          style={{ background: 'radial-gradient(circle, #ffb3c8, transparent 70%)', filter: 'blur(40px)' }}
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative">
          <h2 className="font-display text-[32px] md:text-[80px] leading-[1] tracking-[-0.02em]">
            Now — try it on <em className="italic">your</em> video.
          </h2>
          <p className="mt-5 text-[#5a527e] text-[17px] max-w-[480px] mx-auto">
            Paste a link. Choose your language. We'll fetch the captions.
          </p>
          <motion.button onClick={onJump} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden shine mt-9 inline-flex items-center gap-2 rounded-full bg-[#1a1530] text-[#fbf8f4] pl-6 pr-5 py-4 font-medium shadow-[0_22px_44px_-18px_rgba(40,20,80,0.55)]"
          >
            <span className="relative z-10">Generate a transcript</span>
            <span className="relative z-10 grid place-items-center h-7 w-7 rounded-full bg-[rgba(255,255,255,0.15)]">
              <IconArrowRight size={14}/>
            </span>
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}
