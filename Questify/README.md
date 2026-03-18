# Questify

Questify is a gamified learning platform built for hackathons with one winning hook:
**addiction-level engagement using gaming psychology + AI personalization**.

## Built Scope (Only What Matters)

- Quest-based learning (main gameplay loop)
- XP + level progression
- Leaderboard
- Daily challenge
- AI recommendation (rule-based topic weakness detection)

## Stack

- Frontend: React + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- Data/Auth/Hosting path: Firebase-ready (Firestore hooks included, local fallback enabled)

## Quick Start

## 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run start
```

API runs on http://localhost:5000

## 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## Demo Flow (Use This for Judges)

1. Login with a name (try Rushabh, Aarav, or Siya for seeded data)
2. Show dashboard stats (XP, level, streak, badges)
3. Start a quest
4. Solve quiz and submit
5. Show XP gain + level-up feedback
6. Return to dashboard
7. Show leaderboard + daily challenge + AI recommendation

## Hackathon Timeline Strategy

- Phase 1 (0-4h): Login UI + dashboard + quiz layout
- Phase 2 (4-10h): Quiz scoring, XP, level progression
- Phase 3 (10-16h): Leaderboard, daily challenge, badges
- Phase 4 (16-20h): AI recommendation + animations + bug fixes
- Final Hours: Seed users, rehearse demo, tighten pitch

## Pitch Script (2-3 min)

1. Problem: learning apps are boring, students are disengaged
2. Solution: game-first learning loops with instant progression feedback
3. Demo: show quest completion and level-up moment
4. Innovation: personalization layer recommends next topic from weak areas
5. Impact: drives consistency and stronger outcomes through engagement

## Firebase Notes

- Add Firebase Admin credentials in `backend/.env` to persist snapshots.
- If credentials are missing, app runs with in-memory data for fast demos.
