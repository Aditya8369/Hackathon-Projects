import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Sparkles } from "lucide-react"
import { api } from "../services/api"
import { useAuth } from "../context/AuthContext"
import ThemeToggle from "../components/ThemeToggle"
import Footer from "../components/Footer"

export default function QuestPage() {
  const { questId } = useParams()
  const { session } = useAuth()
  const navigate = useNavigate()

  const [quest, setQuest] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const handleMissingUser = () => {
    localStorage.removeItem("questify-session")
    navigate("/", {
      replace: true,
      state: {
        message: "Session expired because your local backend data was reset. Please login again.",
      },
    })
  }

  useEffect(() => {
    const loadQuest = async () => {
      setLoading(true)
      setError("")
      try {
        const data = await api.quests()
        const selected = data.quests.find((item) => item.id === questId)

        if (!selected) {
          throw new Error("Quest not found")
        }

        setQuest(selected)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadQuest()
  }, [questId])

  const allAnswered = useMemo(() => {
    if (!quest) {
      return false
    }
    return quest.questions.every((question) => answers[question.id])
  }, [answers, quest])

  const submitQuest = async (event) => {
    event.preventDefault()
    if (!allAnswered) {
      return
    }

    try {
      const payload = await api.submitQuest({
        userId: session.userId,
        questId: quest.id,
        answers,
      })
      setResult(payload)
    } catch (err) {
      if (err.message === "User not found.") {
        handleMissingUser()
        return
      }
      setError(err.message)
    }
  }

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-slate-100 text-cyan-700 dark:bg-slate-950 dark:text-cyan-200">Loading quest...</main>
  }

  if (error || !quest) {
    return <main className="grid min-h-screen place-items-center bg-slate-100 px-6 text-rose-600 dark:bg-slate-950 dark:text-rose-300">{error || "Unable to load quest"}</main>
  }

  return (
    <main className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_12%_10%,#06b6d4_0%,transparent_33%),radial-gradient(circle_at_88%_12%,#f59e0b_0%,transparent_30%),#f8fafc] px-6 py-8 text-slate-900 dark:bg-[radial-gradient(circle_at_15%_12%,#115e59_0%,transparent_33%),radial-gradient(circle_at_88%_12%,#ea580c_0%,transparent_30%),#020617] dark:text-slate-100">
      <section className="mx-auto max-w-4xl flex-1">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <ThemeToggle />
        </div>

        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-cyan-500/25 bg-white/85 p-6 dark:border-cyan-500/30 dark:bg-slate-950/75"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200">{quest.difficulty}</p>
          <h1 className="mt-2 text-3xl font-semibold">{quest.title}</h1>
          <p className="mt-2 text-slate-700 dark:text-slate-300">Topic: {quest.topic.toUpperCase()} • Base reward: {quest.baseXp} XP</p>

          <form onSubmit={submitQuest} className="mt-6 space-y-5">
            {quest.questions.map((question, index) => (
              <div key={question.id} className="rounded-xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/70">
                <p className="text-sm text-slate-600 dark:text-slate-300">Question {index + 1}</p>
                <h2 className="mt-1 text-lg font-medium">{question.prompt}</h2>
                <div className="mt-3 space-y-2">
                  {question.options.map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(event) =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: event.target.value,
                          }))
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={!allAnswered}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-orange-400 py-3 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Complete Quest
            </button>
          </form>

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-4"
            >
              <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-emerald-200">
                <Sparkles size={18} /> Quest Complete
              </h3>
              <p className="mt-2 text-sm text-slate-900 dark:text-slate-100">
                Score: {result.score.correct}/{result.score.total} • +{result.score.earnedXp} XP
              </p>
              <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">New level: {result.user.level}</p>
              {result.levelUp && <p className="mt-1 text-sm font-semibold text-amber-200">Level Up Unlocked!</p>}
              {result.newlyUnlockedBadges?.length > 0 && (
                <div className="mt-3 rounded-lg border border-fuchsia-300/30 bg-fuchsia-500/10 p-3">
                  <p className="text-sm font-semibold text-fuchsia-900 dark:text-fuchsia-100">New badges unlocked:</p>
                  <p className="mt-1 text-sm text-fuchsia-800 dark:text-fuchsia-200">{result.newlyUnlockedBadges.join(", ")}</p>
                </div>
              )}
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">AI Tip: {result.recommendation.reason}</p>
              <button onClick={() => navigate("/dashboard")} className="mt-4 rounded-lg border border-emerald-300/40 px-3 py-2 text-sm text-emerald-100">
                Return to Dashboard
              </button>
            </motion.div>
          )}
        </motion.article>
      </section>
      <Footer />
    </main>
  )
}
