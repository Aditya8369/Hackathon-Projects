# Learna.ai Clone — AI English Speaking Tutor

Learna.ai is a premium, interactive web-based English Speaking Tutor clone. It allows language learners to practice speaking English in real-time, get instant grammar corrections, receive pronunciation feedback, study vocabulary, and monitor their scores on an interactive analytics dashboard.

---

## 🚀 Key Features

### 1. Tailored Onboarding & Personalization
- **CEFR Level Selection:** Choose your proficiency level—Beginner (A1-A2), Intermediate (B1-B2), or Advanced (C1-C2).
- **Goal Alignment:** Target your practice towards Job Interview Prep, Daily Social Conversations, Travel & Tourism, or Exam/IELTS Prep.
- **Tutor Profiles:**
  - **Emma:** Patient and supportive conversationalist, speaking standard British English. Ideal for beginners.
  - **Marcus:** Professional business coach and career mentor, speaking American English. Great for mock interview runs.
  - **Sophia:** Energetic travel and culture enthusiast, speaking American English. Focuses on daily life and idiom integration.

### 2. Conversational Arena (Voice Chat)
- **Speech-to-Text Transcription:** Press the microphone button to dictate naturally. The app transcribes your speech live.
- **Text-to-Speech Playback:** Listen to the AI tutor speak responses aloud using natural synthesized voice overlays.
- **Dynamic Suggested Replies:** Stuck on what to say? Click any of the AI-recommended context-appropriate responses to speak or edit them.
- **Real-Time Speech Waveforms:** Visual equalizer animations trigger during active voice recording.

### 3. Granular Grammar & Vocabulary Feedback
- **Instant Corrections:** If you slip up (e.g. *"I has a dog"*), Learna highlights the mistake, provides the corrected sentence (*"I have a dog"*), and details why it occurred.
- **Vocabulary Upgrades:** Automatically suggests advanced synonyms to replace basic expressions (e.g. replacing *"very big"* with *"huge"* or *"massive"*).
- **Pronunciation Tips:** Suggests specific phonetic reminders like primary syllable stress and linking.

### 4. Pronunciation Lab
- **Listen & Mimic:** Listen to correct pronunciation models of tricky phrases and tongue-twisters.
- **Attempt Recording:** Record yourself trying to read the card.
- **Word-by-word Highlights:** The lab compares your transcription to the model and color-codes the outcome—correct words in **green** and missed/poorly spoken words in **red**.
- **Accuracy Grading:** Calculates an overall percentage score for pronunciation clarity.

### 5. Vocabulary Builder & Flashcards
- **3D Flip Flashcards:** Flip cards to reveal vocabulary definitions, levels, and practical example sentences.
- **Retention Quizzes:** Test your recall with multiple-choice questions. High scores directly boost your vocabulary metrics on the main dashboard.

### 6. Metrics & Progress Dashboard
- **Day Streak Indicator:** Track consecutive practice days to maintain habits.
- **Skill Breakdown:** Circular progress charts for Grammar, Vocabulary, Fluency, and Pronunciation scores.
- **Mistakes Log:** Displays an aggregated list of recent grammatical mistakes you made during chat sessions so you know what to focus on.

### 7. Dual Engine Settings
- **Smart Simulator Mode:** Fully functional, context-aware rule-based conversation engine. Works 100% free, offline, and out of the box.
- **Gemini API Integration:** Add your Google AI Studio Gemini API Key in Settings to instantly upgrade the tutor to natural, infinite, LLM-generated conversations.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite 8
- **Icons:** Lucide React
- **Styling:** Vanilla CSS (Modern dark midnight theme, CSS Variables, Glassmorphism, Responsive Grid, 3D CSS Transitions)
- **Voice Synthesis & Recognition:** Web Speech API (`webkitSpeechRecognition` & `speechSynthesis`)
- **Intelligence:** Google Gemini API integration (optional) + custom rule-based fallback model

---

## ⚙️ Installation & Running

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 2. Clone and Setup
Extract this project folder or initialize npm, then install the dependencies:
```bash
# Navigate to the workspace
cd "Ai tutor"

# Install all packages
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open the local server URL (usually `http://localhost:5173`) in your browser.

### 4. Build for Production
To generate optimized production assets:
```bash
npm run build
```
Production assets will be outputted to the `dist/` directory.

---

## 🌐 Browser Compatibility & Microphone Access

This application utilizes browser native components for Speech Recognition and Synthesis:
- **Speech Recognition:** Supported in **Google Chrome**, **Microsoft Edge**, and **Safari** (desktop/iOS).
- **Microphone Access:** Make sure to grant **Microphone Permissions** to the browser window when prompted.
- **Local Voices:** Available voices depend on your operating system (Windows/macOS/iOS/Linux) and browser settings.

---

## 🔑 How to Get a Free Gemini API Key

To unlock the full conversational intelligence:
1. Visit the [Google AI Studio Console](https://aistudio.google.com/).
2. Log in with your Google account.
3. Click on **Create API Key**.
4. Copy the generated key.
5. In Learna.ai, go to **Settings**, paste the key under **Gemini AI Connection**, and click **Save**.
