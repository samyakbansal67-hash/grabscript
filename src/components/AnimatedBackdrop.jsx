import { memo } from 'react'

// Pure CSS animations — zero JS per-frame cost, fully GPU-composited
const AnimatedBackdrop = memo(function AnimatedBackdrop() {
  return (
    <>
      <style>{`
        @keyframes blob1 {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          33%      { transform: translate3d(40px,-30px,0) scale(1.08); }
          66%      { transform: translate3d(-20px,20px,0) scale(0.96); }
        }
        @keyframes blob2 {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          33%      { transform: translate3d(-40px,25px,0) scale(0.95); }
          66%      { transform: translate3d(25px,-20px,0) scale(1.06); }
        }
        @keyframes blob3 {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          33%      { transform: translate3d(30px,35px,0) scale(1.05); }
          66%      { transform: translate3d(-35px,-15px,0) scale(0.97); }
        }
        @keyframes blob4 {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          33%      { transform: translate3d(-30px,-25px,0) scale(1.07); }
          66%      { transform: translate3d(20px,30px,0) scale(0.94); }
        }
        .blob { position:absolute; border-radius:9999px; will-change:transform; }
        .blob-1 { animation: blob1 22s ease-in-out infinite; }
        .blob-2 { animation: blob2 26s ease-in-out infinite 3s; }
        .blob-3 { animation: blob3 30s ease-in-out infinite 6s; }
        .blob-4 { animation: blob4 24s ease-in-out infinite 9s; }
      `}</style>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fbf8f4] via-[#f6f1ea] to-[#fbf8f4]" />
        <div className="absolute inset-0 grid-dots opacity-50" />

        <div className="blob blob-1" style={{ left:'8%', top:'12%', width:520, height:520,
          background:'radial-gradient(circle at 30% 30%, #b6a8ff, #7b6cf2 60%, transparent 70%)',
          filter:'blur(60px)', opacity:0.55 }} />
        <div className="blob blob-2" style={{ left:'78%', top:'6%', width:460, height:460,
          background:'radial-gradient(circle at 30% 30%, #ffd1de, #ff8aaa 60%, transparent 70%)',
          filter:'blur(60px)', opacity:0.55 }} />
        <div className="blob blob-3" style={{ left:'70%', top:'70%', width:600, height:600,
          background:'radial-gradient(circle at 30% 30%, #bfe0ff, #7cb8ff 60%, transparent 70%)',
          filter:'blur(60px)', opacity:0.55 }} />
        <div className="blob blob-4" style={{ left:'4%', top:'78%', width:420, height:420,
          background:'radial-gradient(circle at 30% 30%, #ffe4c8, #ffbf94 60%, transparent 70%)',
          filter:'blur(60px)', opacity:0.55 }} />

        <div className="noise" />
      </div>
    </>
  )
})

export default AnimatedBackdrop
