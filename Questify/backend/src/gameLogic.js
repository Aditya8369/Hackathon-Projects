const XP_PER_LEVEL = 120

function calculateLevel(xp) {
  return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1)
}

function progressToNextLevel(xp) {
  const currentLevel = calculateLevel(xp)
  const currentLevelStart = (currentLevel - 1) * XP_PER_LEVEL
  const nextLevelThreshold = currentLevel * XP_PER_LEVEL
  const progress = Math.round(((xp - currentLevelStart) / XP_PER_LEVEL) * 100)

  return {
    currentLevel,
    nextLevelThreshold,
    progress: Math.min(100, Math.max(0, progress)),
  }
}

function scoreQuestSubmission(quest, answers) {
  const total = quest.questions.length
  let correct = 0

  for (const question of quest.questions) {
    const candidateAnswer = answers[question.id]
    if (candidateAnswer === question.answer) {
      correct += 1
    }
  }

  const accuracy = correct / total
  const earnedXp = Math.round(quest.baseXp * (0.6 + accuracy * 0.8))

  return {
    total,
    correct,
    accuracy,
    earnedXp,
  }
}

function updateTopicAccuracy(previous, topic, latestAccuracy) {
  const previousAccuracy = previous[topic] ?? 0.5
  const blended = previousAccuracy * 0.7 + latestAccuracy * 0.3

  return {
    ...previous,
    [topic]: Number(blended.toFixed(2)),
  }
}

function recommendNextTopic(topicAccuracy) {
  const sortedTopics = Object.entries(topicAccuracy).sort((a, b) => a[1] - b[1])

  if (sortedTopics.length === 0) {
    return {
      topic: "react",
      reason: "Start with React fundamentals to build momentum.",
    }
  }

  const [weakestTopic, weakestScore] = sortedTopics[0]
  const scorePercent = Math.round(weakestScore * 100)

  return {
    topic: weakestTopic,
    reason: `Your ${weakestTopic.toUpperCase()} confidence is ${scorePercent}%. Focus here next to level up faster.`,
  }
}

module.exports = {
  calculateLevel,
  progressToNextLevel,
  scoreQuestSubmission,
  updateTopicAccuracy,
  recommendNextTopic,
}
