import React from 'react';
import { 
  Flame, 
  Calendar, 
  ArrowRight, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { TUTORS } from './Onboarding';

export default function Dashboard({ 
  userStats, 
  history = [], 
  setActiveTab, 
  setSelectedScenario,
  onResetProgress
}) {
  const { streak = 1, level = 'A2', goal = 'daily', tutor = 'emma', scores = {} } = userStats;

  // Get current tutor details
  const activeTutor = TUTORS.find(t => t.id === tutor) || TUTORS[0];

  // Circle progress generator
  const renderCircleProgress = (score = 75, color = '#aa3bff') => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="circular-progress-wrapper">
        <svg className="circular-progress" width="90" height="90">
          <circle 
            className="progress-bg"
            cx="45" 
            cy="45" 
            r={radius} 
            strokeWidth="8"
          />
          <circle 
            className="progress-fill"
            cx="45" 
            cy="45" 
            r={radius} 
            strokeWidth="8"
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 45 45)"
          />
        </svg>
        <span className="progress-value">{score}%</span>
      </div>
    );
  };

  // Compile grammar mistakes from history
  const recentMistakes = [];
  history.forEach(item => {
    if (item.sender === 'user' && item.feedback && item.feedback.hasErrors) {
      recentMistakes.push({
        id: item.id || Math.random().toString(),
        original: item.feedback.originalText,
        corrected: item.feedback.correctedText,
        explanation: item.feedback.explanation,
        time: item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Recently'
      });
    }
  });

  const handleStartPractice = (scenario) => {
    setSelectedScenario(scenario);
    setActiveTab('conversation');
  };

  const goalLabels = {
    career: 'Job Interview Prep',
    daily: 'Daily Social Talk',
    travel: 'Travel & Tourism',
    academic: 'Exams & IELTS Prep'
  };

  return (
    <div className="dashboard-container fade-in">
      {/* Top Banner section */}
      <header className="dashboard-header">
        <div className="welcome-text">
          <h1>Hello, English Learner! 👋</h1>
          <p>Ready to level up your English? Let's start speaking with {activeTutor.name}.</p>
        </div>
        
        <div className="header-meta">
          <div className="meta-card">
            <Flame className="meta-icon icon-orange" />
            <div>
              <span className="meta-num">{streak}</span>
              <span className="meta-lbl">Day Streak</span>
            </div>
          </div>
          <div className="meta-card">
            <Calendar className="meta-icon icon-purple" />
            <div>
              <span className="meta-num">{level}</span>
              <span className="meta-lbl">Your Level</span>
            </div>
          </div>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="dashboard-grid">
        
        {/* Tutor Profile Widget */}
        <section className="dashboard-widget tutor-widget card-gradient-glow">
          <div className="widget-header">
            <span className="badge">Active AI Tutor</span>
          </div>
          <div className="tutor-brief">
            <div className="tutor-avatar-circle" style={{ background: activeTutor.avatarColor }}>
              {activeTutor.initial}
            </div>
            <div className="tutor-brief-details">
              <h2>{activeTutor.name}</h2>
              <p className="role">{activeTutor.role}</p>
              <p className="accent">{activeTutor.accent}</p>
            </div>
          </div>
          <p className="tutor-quote">"{activeTutor.desc}"</p>
          
          <div className="tutor-footer-actions">
            <button 
              onClick={() => handleStartPractice('freetalk')}
              className="btn btn-primary btn-icon-right"
            >
              Start Free Chat <MessageSquare size={16} />
            </button>
          </div>
        </section>

        {/* Circular Progress Scores */}
        <section className="dashboard-widget scores-widget">
          <h2>Your Speaking Breakdown</h2>
          <p className="widget-subtitle">Based on your practice history and fluency analytics.</p>
          
          <div className="scores-grid">
            <div className="score-card">
              {renderCircleProgress(scores.grammar || 75, '#aa3bff')}
              <span className="score-label">Grammar</span>
            </div>
            <div className="score-card">
              {renderCircleProgress(scores.vocabulary || 80, '#3b82f6')}
              <span className="score-label">Vocabulary</span>
            </div>
            <div className="score-card">
              {renderCircleProgress(scores.fluency || 82, '#10b981')}
              <span className="score-label">Fluency</span>
            </div>
            <div className="score-card">
              {renderCircleProgress(scores.pronunciation || 70, '#f59e0b')}
              <span className="score-label">Pronunciation</span>
            </div>
          </div>
        </section>

        {/* Practice Scenarios */}
        <section className="dashboard-widget scenarios-widget span-two-cols">
          <div className="section-title-wrapper">
            <h2>Recommended Scenarios</h2>
            <span className="title-desc">Goal: {goalLabels[goal] || goal}</span>
          </div>
          
          <div className="scenarios-list-grid">
            <div className="scenario-item-card">
              <div className="scenario-icon-box bg-pink">☕</div>
              <div className="scenario-item-details">
                <h3>At the Coffee Shop</h3>
                <p>Learn to order espresso, inquire about size, and pay by card. (A1-A2)</p>
              </div>
              <button 
                onClick={() => handleStartPractice('coffee')}
                className="btn btn-secondary-glow btn-sm"
              >
                Practice <ArrowRight size={14} />
              </button>
            </div>

            <div className="scenario-item-card">
              <div className="scenario-icon-box bg-blue">💻</div>
              <div className="scenario-item-details">
                <h3>Software Developer Interview</h3>
                <p>Practice answering career background, difficult projects, and team conflict questions. (B2-C1)</p>
              </div>
              <button 
                onClick={() => handleStartPractice('interview')}
                className="btn btn-secondary-glow btn-sm"
              >
                Practice <ArrowRight size={14} />
              </button>
            </div>

            <div className="scenario-item-card">
              <div className="scenario-icon-box bg-green">✈️</div>
              <div className="scenario-item-details">
                <h3>Airport Check-in</h3>
                <p>Answer questions about bag weights, seating preferences, and boarding times. (A2-B1)</p>
              </div>
              <button 
                onClick={() => handleStartPractice('airport')}
                className="btn btn-secondary-glow btn-sm"
              >
                Practice <ArrowRight size={14} />
              </button>
            </div>

            <div className="scenario-item-card">
              <div className="scenario-icon-box bg-purple">💬</div>
              <div className="scenario-item-details">
                <h3>General Conversations</h3>
                <p>Talk about hobbies, movie recommendations, travel, and personal experiences. (All levels)</p>
              </div>
              <button 
                onClick={() => handleStartPractice('freetalk')}
                className="btn btn-secondary-glow btn-sm"
              >
                Practice <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Live Corrections / Mistakes Focus */}
        <section className="dashboard-widget mistakes-widget">
          <h2>Focus Areas & Corrections</h2>
          <p className="widget-subtitle">Learna analyzed spelling, phrasing and grammar slips here.</p>
          
          {recentMistakes.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={36} className="empty-icon" />
              <p>No mistakes detected yet! Speak in the chat to see real-time corrections here.</p>
            </div>
          ) : (
            <div className="mistakes-log">
              {recentMistakes.slice(0, 4).map((mistake) => (
                <div key={mistake.id} className="mistake-item">
                  <div className="mistake-header">
                    <span className="mistake-badge">Correction</span>
                    <span className="mistake-time">{mistake.time}</span>
                  </div>
                  <p className="incorrect">❌ <span>{mistake.original}</span></p>
                  <p className="correct">✅ <span>{mistake.corrected}</span></p>
                  <p className="explanation">{mistake.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Vocabulary Bank Widget */}
        <section className="dashboard-widget vocab-widget">
          <h2>Your Vocabulary Bank</h2>
          <p className="widget-subtitle">Words you encountered during speaking lessons.</p>
          
          <div className="vocab-brief-wrapper">
            <div className="vocab-stats-inline">
              <BookOpen className="vocab-book-icon" />
              <div>
                <span className="vocab-count">8 words</span>
                <span className="vocab-lbl">Saved to notebook</span>
              </div>
            </div>
            
            <div className="vocab-tag-cloud">
              <span className="tag">cappuccino</span>
              <span className="tag">croissant</span>
              <span className="tag font-bold">outstanding</span>
              <span className="tag">crucial</span>
              <span className="tag">boarding pass</span>
              <span className="tag">collaborative</span>
              <span className="tag">fascinating</span>
              <span className="tag">ecstatic</span>
            </div>

            <button 
              onClick={() => setActiveTab('vocabulary')}
              className="btn btn-text-link"
            >
              Study Vocab Cards &rarr;
            </button>
          </div>
        </section>
      </div>

      <div className="dashboard-reset-row">
        <button 
          onClick={onResetProgress}
          className="btn btn-danger-text"
        >
          Reset Level & Settings
        </button>
      </div>
    </div>
  );
}
