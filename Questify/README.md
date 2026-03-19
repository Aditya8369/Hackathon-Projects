# 🎮 Questify
> **Transform Learning into an Addiction — Game-First Education with AI Personalization**

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Status](https://img.shields.io/badge/status-actively%20developed-brightgreen)](https://github.com)

---

## 🚀 The Hook

Questify is a **gamified learning platform** that turns education into an irresistible gameplay loop. We combine:
- 🎯 **Gaming Psychology** (instant rewards, leaderboards, streaks)
- 🧠 **AI Personalization** (recommends topics based on weakness detection)
- ⚡ **Quest-Based Learning** (structured, bite-sized challenges)

**Result:** Students stay engaged. Knowledge sticks. Learning becomes fun.

---

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| 🎪 **Quest-Based Learning** | Complete quests → earn XP → unlock progress |
| 📈 **XP + Level Progression** | Instant feedback with satisfying rank-ups |
| 🏆 **Leaderboard** | Compete with peers (friendly competition drives engagement) |
| 🔥 **Daily Challenges** | Streaks & recurring engagement loops |
| 🤖 **AI Recommendation** | Smart topic suggestions based on your weak areas |
| 🎨 **Dark/Light Theme** | Sleek, modern UI with smooth animations |

---

## 🛠️ Tech Stack

```
Frontend        │  Backend          │  Data & Auth
──────────────────────────────────────────────────
React.js        │  Node.js          │  Firebase
Tailwind CSS    │  Express.js       │  Firestore
Framer Motion   │  (Local Fallback) │  (Optional)
```

---

## ⚡ Quick Start

### 1️⃣ Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run start
```
✅ API running on **http://localhost:5000**

### 2️⃣ Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
✅ App running on **http://localhost:5173**

---

## 🎬 Demo Script (For Judges)

Perfect your pitch in **3 minutes**:

1. 🔐 **Login** → Use name: `Rushabh`, `Aarav`, or `Siya` (seeded data)
2. 📊 **Dashboard** → Show XP, level, streak, badges
3. 🎯 **Start Quest** → Pick a learning topic
4. ❓ **Solve Quiz** → Answer questions
5. 🎉 **Level Up!** → Watch XP gain & level-up animation
6. 🏅 **Full Loop** → Back to dashboard
7. 🌟 **Extras** → Leaderboard + daily challenge + AI recommendations

---

## 📋 Development Roadmap

| Phase | Duration | What Gets Built |
|-------|----------|-----------------|
| 🏗️ **Phase 1** | 0-4h | Login UI, Dashboard, Quiz Layout |
| ⚙️ **Phase 2** | 4-10h | Quiz Scoring, XP System, Progression |
| 🎯 **Phase 3** | 10-16h | Leaderboard, Daily Challenge, Badges |
| 🤖 **Phase 4** | 16-20h | AI Recommendations, Animations, Bug Fixes |
| 🎤 **Final Push** | Last Hours | Seed Data, Demo Rehearsal, Pitch |

---

## 🎤 Pitch Script (2-3 min)

**Problem:** 📚 Learning apps are boring. Students disengage. Traditional education = passive consumption.

**Solution:** 🎮 Game-first learning loops with instant gratification. Every answer = XP. Every milestone = celebration.

**Demo:** 🚀 Watch a quest completion → level-up moment → XP bar filling up.

**Innovation:** 🧠 AI layer recommends next topic based on **detected weak areas** (not random).

**Impact:** 💪 Drives daily consistency + stronger retention through intrinsic motivation.

---

## 🔥 Firebase Setup (Optional but Recommended)

To persist user data & leaderboards:

1. Add Firebase Admin credentials to `backend/.env`:
   ```env
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   ```

2. If credentials are missing → app runs on **in-memory data** (great for demos!)

---

## 🎨 Features Highlight

🔄 **Real-time Progression** — See XP updates instantly  
🌙 **Theme Toggle** — Dark mode for late-night study sessions  
📱 **Responsive Design** — Works on mobile, tablet, desktop  
⚡ **No Lag** — Optimized animations & smooth transitions  
🎯 **Smart AI** — Learns your weak areas and adapts  

---

## 💡 Pro Tips for Judges

- **Seed data** is pre-loaded: Demo with `Rushabh`, `Aarav`, or `Siya`
- **No Firebase needed** for quick demos (local mode works great)
- **Mobile-friendly** — Show it on your phone too
- **Smooth animations matter** — Framer Motion makes the magic happen

---

## 📞 Questions?

Check the [issues](https://github.com) or reach out. Happy hacking! 🚀

---

**Made with ❤️ for learning.**
