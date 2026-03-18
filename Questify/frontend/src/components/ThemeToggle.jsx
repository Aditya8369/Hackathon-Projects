import { Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300/80 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
      aria-label="Toggle dark and light mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={16} className="text-amber-300" /> : <Moon size={16} className="text-sky-600" />}
      {isDark ? "Light" : "Dark"}
    </button>
  )
}
