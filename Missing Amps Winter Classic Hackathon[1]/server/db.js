const fs = require('fs');
const path = require('path');

const leaderboardPath = path.join(__dirname, 'data', 'leaderboard.json');
const challengesPath = path.join(__dirname, 'data', 'challenges.json');

function readJson(filePath) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  getLeaderboard() {
    return readJson(leaderboardPath);
  },
  addScore(row) {
    const data = readJson(leaderboardPath);
    data.push(row);
    data.sort((a, b) => b.score - a.score);
    writeJson(leaderboardPath, data.slice(0, 100)); // keep top 100
    return row;
  },
  getChallenges() {
    // If file missing, fallback to bundled defaults
    try {
      return JSON.parse(fs.readFileSync(challengesPath, 'utf-8'));
    } catch {
      return [];
    }
  }
};
