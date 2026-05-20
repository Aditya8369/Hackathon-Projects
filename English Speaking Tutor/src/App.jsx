import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ConversationArena from './components/ConversationArena';
import PronunciationLab from './components/PronunciationLab';
import VocabularyBuilder from './components/VocabularyBuilder';
import Settings from './components/Settings';

const DEFAULT_STATS = {
  streak: 5, // start with a nice streak for feel-good onboarding
  level: 'B1',
  goal: 'daily',
  tutor: 'emma',
  tutorVoice: '',
  speechRate: 0.95,
  geminiKey: '',
  scores: {
    grammar: 76,
    vocabulary: 82,
    fluency: 80,
    pronunciation: 72
  }
};

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('learna_onboarded') === 'true';
  });

  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('learna_user_stats');
    return saved ? JSON.parse(saved) : DEFAULT_STATS;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('learna_chat_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedScenario, setSelectedScenario] = useState('freetalk');

  // Persist state
  useEffect(() => {
    localStorage.setItem('learna_onboarded', isOnboarded.toString());
  }, [isOnboarded]);

  useEffect(() => {
    localStorage.setItem('learna_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('learna_chat_history', JSON.stringify(history));
  }, [history]);

  // Streak counter simulator (increases streak by 1 if first session of the day)
  useEffect(() => {
    if (isOnboarded) {
      const lastPractice = localStorage.getItem('learna_last_practice_date');
      const today = new Date().toDateString();
      if (lastPractice !== today) {
        localStorage.setItem('learna_last_practice_date', today);
        setUserStats(prev => ({
          ...prev,
          streak: prev.streak + 1
        }));
      }
    }
  }, [isOnboarded]);

  const handleOnboardingComplete = (data) => {
    setUserStats(prev => ({
      ...prev,
      level: data.level,
      goal: data.goal,
      tutor: data.tutor,
      tutorVoice: data.tutorVoice
    }));
    setIsOnboarded(true);
  };

  const updateStats = (newData) => {
    setUserStats(prev => {
      const updated = { ...prev, ...newData };
      // Handle special scoring calculation if only sub-scores change
      if (newData.scores) {
        const scoresObj = { ...prev.scores, ...newData.scores };
        updated.scores = scoresObj;
      }
      return updated;
    });

    if (newData.history) {
      setHistory(newData.history);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all your progress, settings, and conversation logs?")) {
      localStorage.clear();
      setUserStats(DEFAULT_STATS);
      setHistory([]);
      setIsOnboarded(false);
      setActiveTab('dashboard');
      setSelectedScenario('freetalk');
    }
  };

  // Render Onboarding Screen if not completed
  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="app-container">
      {/* Navigation panel */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        streak={userStats.streak} 
        level={userStats.level} 
      />

      {/* Main tab content screen */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            userStats={userStats} 
            history={history}
            setActiveTab={setActiveTab} 
            setSelectedScenario={setSelectedScenario}
            onResetProgress={handleResetProgress}
          />
        )}

        {activeTab === 'conversation' && (
          <ConversationArena 
            userStats={userStats} 
            history={history} 
            setHistory={setHistory} 
            updateStats={updateStats}
            selectedScenario={selectedScenario}
            setSelectedScenario={setSelectedScenario}
          />
        )}

        {activeTab === 'pronunciation' && (
          <PronunciationLab 
            userStats={userStats} 
            updateStats={updateStats} 
          />
        )}

        {activeTab === 'vocabulary' && (
          <VocabularyBuilder 
            userStats={userStats} 
            updateStats={updateStats} 
          />
        )}

        {activeTab === 'settings' && (
          <Settings 
            userStats={userStats} 
            updateStats={updateStats} 
            onResetProgress={handleResetProgress}
          />
        )}
      </main>
    </div>
  );
}
