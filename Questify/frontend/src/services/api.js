const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.")
  }

  return data
}

export const api = {
  login: (name) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  dashboard: (userId) => request(`/dashboard/${userId}`),
  quests: () => request("/quests"),
  submitQuest: (payload) =>
    request("/quests/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  leaderboard: () => request("/leaderboard"),
  dailyChallenge: () => request("/daily-challenge"),
  submitDailyChallenge: (payload) =>
    request("/daily-challenge/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  recommendation: (userId) => request(`/recommendation/${userId}`),
}
