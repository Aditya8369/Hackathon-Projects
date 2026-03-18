export default function StatCard({ label, value, hint }) {
  return (
    <article className="rounded-2xl border border-cyan-500/25 bg-white/80 p-4 shadow-[0_12px_40px_-28px_rgba(8,145,178,0.9)] backdrop-blur-sm dark:border-cyan-400/30 dark:bg-slate-900/70 dark:shadow-[0_0_30px_-18px_rgba(34,211,238,0.9)]">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200/70">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-cyan-900 dark:text-cyan-100">{value}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{hint}</p>
    </article>
  )
}
