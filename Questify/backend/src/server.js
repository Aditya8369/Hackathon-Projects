require("dotenv").config()

const express = require("express")
const cors = require("cors")

const { USERS, QUESTS, DAILY_CHALLENGE, BADGE_RULES } = require("./data")
const {
  calculateLevel,
  progressToNextLevel,
  scoreQuestSubmission,
  updateTopicAccuracy,
  recommendNextTopic,
} = require("./gameLogic")
const { initializeFirebase, getFirestore } = require("./firebase")

const app = express()
const PORT = process.env.PORT || 5000

initializeFirebase()

app.use(cors())
app.use(express.json())

function sanitizeQuest(quest) {
  return {
    id: quest.id,
    title: quest.title,
    topic: quest.topic,
    difficulty: quest.difficulty,
    baseXp: quest.baseXp,
    questions: quest.questions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: q.options,
    })),
  }
}

function applyBadgeRules(user) {
  const earned = [...user.badges]

  for (const rule of BADGE_RULES) {
    if (rule.check(user) && !earned.includes(rule.name)) {
      earned.push(rule.name)
    }
  }

  return earned
}

function findUser(userId) {
  return USERS.find((u) => u.id === userId)
}

function ensureUserProgressFields(user) {
  if (!Array.isArray(user.completedQuests)) {
    user.completedQuests = []
  }
}

function buildBadgeCatalog(user) {
  return BADGE_RULES.map((rule) => ({
    name: rule.name,
    description: rule.description,
    unlocked: user.badges.includes(rule.name),
  }))
}

async function saveUserSnapshot(user) {
  const db = getFirestore()
  if (!db) {
    return
  }

  await db.collection("users").doc(user.id).set(
    {
      id: user.id,
      name: user.name,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      badges: user.badges,
      completedQuests: user.completedQuests,
      topicAccuracy: user.topicAccuracy,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  )
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "questify-api" })
})

app.post("/api/auth/login", (req, res) => {
  const { name } = req.body

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters." })
  }

  const existing = USERS.find(
    (u) => u.name.toLowerCase() === name.trim().toLowerCase(),
  )

  if (existing) {
    return res.json({ userId: existing.id, name: existing.name })
  }

  const newUser = {
    id: `u${USERS.length + 1}`,
    name: name.trim(),
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@questify.dev`,
    xp: 0,
    streak: 1,
    level: 1,
    badges: [],
    completedQuests: [],
    topicAccuracy: {
      javascript: 0.5,
      react: 0.5,
      dsa: 0.5,
      database: 0.5,
    },
  }

  USERS.push(newUser)
  return res.status(201).json({ userId: newUser.id, name: newUser.name })
})

app.get("/api/dashboard/:userId", async (req, res) => {
  const user = findUser(req.params.userId)

  if (!user) {
    return res.status(404).json({ message: "User not found." })
  }

  ensureUserProgressFields(user)
  user.level = calculateLevel(user.xp)
  user.badges = applyBadgeRules(user)
  await saveUserSnapshot(user)

  const progression = progressToNextLevel(user.xp)
  const recommendation = recommendNextTopic(user.topicAccuracy)

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      badges: user.badges,
      completedQuests: user.completedQuests,
      progress: progression.progress,
      nextLevelThreshold: progression.nextLevelThreshold,
    },
    recommendation,
    badgeCatalog: buildBadgeCatalog(user),
    quests: QUESTS.map((quest) => ({
      id: quest.id,
      title: quest.title,
      topic: quest.topic,
      difficulty: quest.difficulty,
      baseXp: quest.baseXp,
    })),
  })
})

app.get("/api/quests", (_req, res) => {
  const quests = QUESTS.map(sanitizeQuest)
  res.json({ quests })
})

app.post("/api/quests/submit", async (req, res) => {
  const { userId, questId, answers } = req.body

  const user = findUser(userId)
  const quest = QUESTS.find((item) => item.id === questId)

  if (!user || !quest) {
    return res.status(400).json({ message: "Invalid user or quest." })
  }

  ensureUserProgressFields(user)
  const score = scoreQuestSubmission(quest, answers || {})
  const previousLevel = user.level
  const previousBadges = new Set(user.badges)

  user.xp += score.earnedXp
  user.level = calculateLevel(user.xp)
  user.streak += 1
  user.topicAccuracy = updateTopicAccuracy(
    user.topicAccuracy,
    quest.topic,
    score.accuracy,
  )

  if (!user.completedQuests.includes(quest.id)) {
    user.completedQuests.push(quest.id)
  }

  user.badges = applyBadgeRules(user)
  const newlyUnlockedBadges = user.badges.filter((badge) => !previousBadges.has(badge))

  const levelUp = user.level > previousLevel
  const progression = progressToNextLevel(user.xp)

  await saveUserSnapshot(user)

  return res.json({
    score,
    levelUp,
    user: {
      id: user.id,
      name: user.name,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      badges: user.badges,
      completedQuests: user.completedQuests,
      progress: progression.progress,
      nextLevelThreshold: progression.nextLevelThreshold,
    },
    newlyUnlockedBadges,
    recommendation: recommendNextTopic(user.topicAccuracy),
  })
})

app.get("/api/leaderboard", (_req, res) => {
  const leaderboard = [...USERS]
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.name,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
    }))

  res.json({ leaderboard })
})

app.get("/api/daily-challenge", (_req, res) => {
  const challenge = {
    id: DAILY_CHALLENGE.id,
    title: DAILY_CHALLENGE.title,
    topic: DAILY_CHALLENGE.topic,
    xpReward: DAILY_CHALLENGE.xpReward,
    question: DAILY_CHALLENGE.question,
    options: DAILY_CHALLENGE.options,
  }

  res.json({ challenge })
})

app.post("/api/daily-challenge/submit", async (req, res) => {
  const { userId, answer } = req.body
  const user = findUser(userId)

  if (!user) {
    return res.status(404).json({ message: "User not found." })
  }

  ensureUserProgressFields(user)
  const isCorrect = answer === DAILY_CHALLENGE.answer
  const earnedXp = isCorrect ? DAILY_CHALLENGE.xpReward : 10

  user.xp += earnedXp
  user.level = calculateLevel(user.xp)
  user.badges = applyBadgeRules(user)

  await saveUserSnapshot(user)

  return res.json({
    isCorrect,
    earnedXp,
    user: {
      id: user.id,
      name: user.name,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      badges: user.badges,
      completedQuests: user.completedQuests,
      progress: progressToNextLevel(user.xp).progress,
      nextLevelThreshold: progressToNextLevel(user.xp).nextLevelThreshold,
    },
  })
})

app.get("/api/recommendation/:userId", (req, res) => {
  const user = findUser(req.params.userId)

  if (!user) {
    return res.status(404).json({ message: "User not found." })
  }

  const recommendation = recommendNextTopic(user.topicAccuracy)
  return res.json({ recommendation })
})

app.listen(PORT, () => {
  console.log(`Questify API running on port ${PORT}`)
})
