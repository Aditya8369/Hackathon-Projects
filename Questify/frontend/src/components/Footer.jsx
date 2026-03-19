export default function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-300/80 bg-white/70 px-6 py-6 text-slate-700 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3 md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Questify</p>
          <p className="mt-1 text-sm">Gamified learning engine for hackathon demos.</p>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <p>Core loop: Quest to XP to Level Up to Recommendation</p>
        </div>
        <div className="text-sm md:text-right">
          <p>Built with React, Tailwind, Express, Firebase-ready APIs.</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Copyright {new Date().getFullYear()} Questify Team</p>
        </div>
      </div>
    </footer>
  )
}
