import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Brain, Flame, LogOut, Sparkles, Sword, Trophy } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { api } from "../services/api"
import StatCard from "../components/StatCard"
import ThemeToggle from "../components/ThemeToggle"
import Footer from "../components/Footer"

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [dailyChallenge, setDailyChallenge] = useState(null)
  const [dailyAnswer, setDailyAnswer] = useState("")
  const [dailyResult, setDailyResult] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const { session, signOut } = useAuth()

  const loadData = async () => {
    setLoading(true)
    setError("")
    try {
      const [dashboardData, leaderboardData, dailyData] = await Promise.all([
        api.dashboard(session.userId),
        api.leaderboard(),
        api.dailyChallenge(),
      ])

      setDashboard(dashboardData)
      setLeaderboard(leaderboardData.leaderboard)
      setDailyChallenge(dailyData.challenge)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const topThree = useMemo(() => leaderboard.slice(0, 3), [leaderboard])

  const handleChallengeSubmit = async (event) => {
    event.preventDefault()
    if (!dailyAnswer) {
      return
    }

    try {
      const result = await api.submitDailyChallenge({
        userId: session.userId,
        answer: dailyAnswer,
      })

      setDashboard((current) => ({
        ...current,
        user: result.user,
      }))
      setDailyResult(result.isCorrect ? `Perfect! +${result.earnedXp} XP` : `Nice try. +${result.earnedXp} XP`)
      setDailyAnswer("")
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-slate-100 text-cyan-700 dark:bg-slate-950 dark:text-cyan-200">Loading arena...</main>
  }

  if (error || !dashboard) {
    return <main className="grid min-h-screen place-items-center bg-slate-100 px-6 text-rose-600 dark:bg-slate-950 dark:text-rose-300">{error || "Unable to load dashboard"}</main>
  }

  return (
    <main className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_12%_8%,#06b6d4_0%,transparent_33%),radial-gradient(circle_at_85%_14%,#f59e0b_0%,transparent_30%),#f8fafc] px-5 py-8 text-slate-900 dark:bg-[radial-gradient(circle_at_15%_10%,#0f766e_0%,transparent_36%),radial-gradient(circle_at_85%_15%,#fb923c_0%,transparent_30%),#020617] dark:text-slate-100">
      <section className="mx-auto max-w-7xl flex-1">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-500/25 bg-white/80 px-5 py-4 backdrop-blur-md dark:border-cyan-500/30 dark:bg-slate-950/70">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200">Welcome Back</p>
            <h1 className="text-2xl font-semibold">{dashboard.user.name}'s Command Deck</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => {
                signOut()
                navigate("/")
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:border-cyan-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-cyan-400"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard label="XP" value={dashboard.user.xp} hint="Keep grinding quests" />
          <StatCard label="Level" value={dashboard.user.level} hint={`Next at ${dashboard.user.nextLevelThreshold} XP`} />
          <StatCard label="Streak" value={`${dashboard.user.streak} days`} hint="Do not break the chain" />
          <StatCard label="Badges" value={dashboard.user.badges.length} hint="Earn by consistency" />
        </motion.section>

        <section className="mt-6 grid gap-5 xl:grid-cols-3">
          <article className="rounded-2xl border border-cyan-500/25 bg-white/85 p-5 xl:col-span-2 dark:border-cyan-500/30 dark:bg-slate-950/70">
            <div className="flex items-center justify-between gap-3">
              <h2 className="inline-flex items-center gap-2 text-xl font-semibold"><Sword size={18} className="text-cyan-300" /> Quest Board</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">{dashboard.quests.length} quests available</p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {dashboard.quests.map((quest) => (
                <button
                  key={quest.id}
                  onClick={() => navigate(`/quest/${quest.id}`)}
                  className="rounded-xl border border-slate-300 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-cyan-300"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200">{quest.difficulty}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{quest.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Topic: {quest.topic.toUpperCase()}</p>
                  <p className="mt-3 text-sm font-medium text-orange-300">Reward: +{quest.baseXp} XP base</p>
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-orange-400/30 bg-white/85 p-5 dark:bg-slate-950/70">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold"><Brain size={18} className="text-orange-300" /> Recommended For You</h2>
            <p className="mt-3 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
              {dashboard.recommendation.reason}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-300 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-orange-300" style={{ width: `${dashboard.user.progress}%` }} />
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Level progress: {dashboard.user.progress}%</p>
          </article>
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-3">
          <article className="rounded-2xl border border-amber-400/30 bg-white/85 p-5 dark:bg-slate-950/70">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold"><Flame size={18} className="text-amber-300" /> Daily Challenge</h2>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{dailyChallenge?.question}</p>
            <form onSubmit={handleChallengeSubmit} className="mt-3 space-y-2">
              {dailyChallenge?.options.map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                  <input type="radio" value={option} checked={dailyAnswer === option} onChange={(event) => setDailyAnswer(event.target.value)} />
                  {option}
                </label>
              ))}
              <button type="submit" className="w-full rounded-lg bg-amber-300 py-2 font-semibold text-slate-900">
                Submit Daily (+{dailyChallenge?.xpReward} XP)
              </button>
            </form>
            {dailyResult && <p className="mt-3 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200">{dailyResult}</p>}
          </article>

          <article className="rounded-2xl border border-orange-300/30 bg-white/85 p-5 xl:col-span-2 dark:bg-slate-950/70">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold"><Trophy size={18} className="text-orange-300" /> Leaderboard</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {topThree.map((player) => (
                <div key={player.id} className="rounded-xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-200">Rank #{player.rank}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{player.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{player.xp} XP • Lvl {player.level}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
              {leaderboard.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between border-b border-slate-200 py-2 text-sm last:border-none dark:border-slate-800">
                  <p className="text-slate-700 dark:text-slate-200">#{entry.rank} {entry.name}</p>
                  <p className="text-cyan-700 dark:text-cyan-200">{entry.xp} XP</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-fuchsia-400/25 bg-white/85 p-5 dark:bg-slate-950/65">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold"><Sparkles size={18} className="text-fuchsia-300" /> Achievements</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">All badge goals are visible below. Locked ones turn active once completed.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {dashboard.badgeCatalog?.map((badge) => (
              <article
                key={badge.name}
                className={`rounded-xl border p-3 ${
                  badge.unlocked
                    ? "border-fuchsia-300/50 bg-fuchsia-500/10"
                    : "border-slate-300 bg-white/80 dark:border-slate-700 dark:bg-slate-900/50"
                }`}
              >
                <p className={`text-sm font-semibold ${badge.unlocked ? "text-fuchsia-800 dark:text-fuchsia-100" : "text-slate-700 dark:text-slate-200"}`}>
                  {badge.name}
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{badge.description}</p>
                <p className={`mt-2 text-xs font-medium uppercase tracking-[0.15em] ${badge.unlocked ? "text-emerald-600 dark:text-emerald-300" : "text-slate-500 dark:text-slate-500"}`}>
                  {badge.unlocked ? "Unlocked" : "Locked"}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>
      <Footer />
    </main>
  )
}
