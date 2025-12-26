const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchChallenges() {
  const res = await fetch(`${API_URL}/challenges`);
  return res.json();
}

export async function submitScore({ player, score }) {
  const res = await fetch(`${API_URL}/leaderboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player, score })
  });
  return res.json();
}

export async function fetchLeaderboard() {
  const res = await fetch(`${API_URL}/leaderboard`);
  return res.json();
}