# HackCode Arena

An interactive coding game for hackathons. Solve challenges in the browser, pass tests, and climb the leaderboard.

## Features
- Live editor with instant test feedback
- Timed runs with streak bonuses
- Simple JSON leaderboard
- Easy challenge format: add one object → new level

## Quick start
1. `cd server && npm install && npm start`
2. `cd client && npm install && npm run dev`
3. Open `http://localhost:5173`

## Add a challenge
Edit `server/data/challenges.json` or `client/src/lib/challenges.js`. Define:
- `id`, `title`, `prompt`
- `signature` (function name), `starterCode`
- `tests`: array of inputs and expected outputs

## Deploy
- Docker: `docker-compose up --build`
- Static front-end can be hosted on any static host; backend on any Node host.

## License
MIT


