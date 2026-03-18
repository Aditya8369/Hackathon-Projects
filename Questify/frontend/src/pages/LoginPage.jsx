import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Zap, Flame } from "lucide-react"
import { api } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import ThemeToggle from "../components/ThemeToggle"
import Footer from "../components/Footer"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { signIn } = useAuth()

  const handleLogin = async (event) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const data = await api.login(name)
      signIn(data)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_8%_8%,#06b6d4_0%,transparent_35%),radial-gradient(circle_at_90%_22%,#f59e0b_0%,transparent_35%),#f8fafc] text-slate-900 dark:bg-[radial-gradient(circle_at_10%_10%,#0e7490_0%,transparent_38%),radial-gradient(circle_at_90%_20%,#f97316_0%,transparent_35%),#020617] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:linear-gradient(120deg,rgba(15,23,42,0.08)_1px,transparent_1px)_0_0/32px_32px] dark:opacity-50 dark:[background:linear-gradient(120deg,rgba(255,255,255,0.06)_1px,transparent_1px)_0_0/32px_32px]" />
      <section className="relative mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-200">Questify Arena</p>
          <ThemeToggle />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-cyan-500/25 bg-white/80 p-8 backdrop-blur-md dark:border-cyan-500/30 dark:bg-slate-950/60"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-200">Questify</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight text-slate-900 dark:text-white">
            Learning that feels
            <span className="block text-transparent bg-gradient-to-r from-cyan-300 to-orange-300 bg-clip-text">
              impossible to quit.
            </span>
          </h1>
          <p className="mt-4 max-w-md text-slate-700 dark:text-slate-300">
            Gamified quests, XP loops, streak pressure, and AI nudges turn study sessions into an addictive gameplay cycle.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-300/80 bg-white/90 p-4 dark:border-slate-700/70 dark:bg-slate-900/70">
              <Zap className="text-cyan-300" size={20} />
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">XP + Levels</p>
            </div>
            <div className="rounded-2xl border border-slate-300/80 bg-white/90 p-4 dark:border-slate-700/70 dark:bg-slate-900/70">
              <Trophy className="text-orange-300" size={20} />
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">Live Leaderboard</p>
            </div>
            <div className="rounded-2xl border border-slate-300/80 bg-white/90 p-4 dark:border-slate-700/70 dark:bg-slate-900/70">
              <Flame className="text-pink-300" size={20} />
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">Daily Challenge</p>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleLogin}
          className="rounded-3xl border border-orange-400/25 bg-white/85 p-8 backdrop-blur-md dark:bg-slate-950/75"
        >
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Start Your Quest</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">Create your player profile and enter the dashboard.</p>

          <label className="mt-8 block text-sm text-slate-700 dark:text-slate-300" htmlFor="name">
            Gamer Tag
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Rushabh"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:focus:border-cyan-300"
            required
            minLength={2}
          />

          {error && <p className="mt-4 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-orange-400 px-4 py-3 font-semibold text-slate-900 transition hover:brightness-110 disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? "Booting Arena..." : "Enter Dashboard"}
          </button>

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Tip for judges: use names Rushabh, Aarav, or Siya to load sample progression instantly.</p>
        </motion.form>
        </div>
      </section>
      <Footer />
    </main>
  )
}
