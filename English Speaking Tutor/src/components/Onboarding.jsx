import React, { useState } from 'react';
import { Sparkles, Trophy, Target, ArrowRight, UserCheck } from 'lucide-react';

const TUTORS = [
  {
    id: 'emma',
    name: 'Emma',
    role: 'Friendly Conversationalist',
    accent: 'British Accent',
    desc: 'Emma is patient, supportive, and speaks clearly. Perfect for beginners and casual daily conversation practice.',
    avatarColor: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    initial: 'E',
    voiceName: 'Microsoft Hazel - English (Great Britain)' // Typical standard voice matching hazel/zira/google UK
  },
  {
    id: 'marcus',
    name: 'Marcus',
    role: 'Career Coach & Mentor',
    accent: 'American Accent',
    desc: 'Marcus focuses on vocabulary precision, interviews, business terminology, and formal presentation skills.',
    avatarColor: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    initial: 'M',
    voiceName: 'Microsoft David - English (United States)'
  },
  {
    id: 'sophia',
    name: 'Sophia',
    role: 'Energetic Culture Explorer',
    accent: 'American Accent',
    desc: 'Sophia loves sharing stories about travel, cuisine, music, and art. Great for active and advanced learners.',
    avatarColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    initial: 'S',
    voiceName: 'Microsoft Zira - English (United States)'
  }
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [tutor, setTutor] = useState(TUTORS[0]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        level,
        goal,
        tutor: tutor.id,
        tutorVoice: tutor.voiceName
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        {/* Progress header */}
        <div className="onboarding-progress">
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
          <span className="step-counter">Step {step} of 3</span>
        </div>

        {/* Step 1: English Level */}
        {step === 1 && (
          <div className="onboarding-step-content fade-in">
            <div className="icon-badge">
              <Trophy className="badge-icon glow-pink" />
            </div>
            <h2>What is your English level?</h2>
            <p className="subtitle">This helps us tailor the vocabulary and speed of the conversation.</p>
            
            <div className="selection-grid">
              <button 
                onClick={() => setLevel('A1-A2')}
                className={`select-btn ${level === 'A1-A2' ? 'selected' : ''}`}
              >
                <span className="level-code">A1 - A2</span>
                <span className="level-title">Beginner</span>
                <span className="level-desc">Simple dialogues, slow speaking speed, basic words.</span>
              </button>
              
              <button 
                onClick={() => setLevel('B1-B2')}
                className={`select-btn ${level === 'B1-B2' ? 'selected' : ''}`}
              >
                <span className="level-code">B1 - B2</span>
                <span className="level-title">Intermediate</span>
                <span className="level-desc">Workplace talk, normal speed, standard grammar feedback.</span>
              </button>

              <button 
                onClick={() => setLevel('C1-C2')}
                className={`select-btn ${level === 'C1-C2' ? 'selected' : ''}`}
              >
                <span className="level-code">C1 - C2</span>
                <span className="level-title">Advanced</span>
                <span className="level-desc">Complex discussions, idiom explanations, fast dialogue.</span>
              </button>
            </div>
            
            <div className="onboarding-actions">
              <button 
                disabled={!level} 
                onClick={handleNext} 
                className="btn btn-primary btn-next"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div className="onboarding-step-content fade-in">
            <div className="icon-badge">
              <Target className="badge-icon glow-blue" />
            </div>
            <h2>What is your primary goal?</h2>
            <p className="subtitle">Select the topic focus you want to emphasize during training.</p>
            
            <div className="selection-grid">
              {[
                { id: 'career', label: 'Job Interview Prep', desc: 'Mock interviews, CV review, professional wording' },
                { id: 'daily', label: 'Daily Social Talk', desc: 'Making friends, hobbies, eating out, expressing thoughts' },
                { id: 'travel', label: 'Travel & Tourism', desc: 'Hotels, check-in, ordering food, asking directions' },
                { id: 'academic', label: 'Exams & IELTS Prep', desc: 'Structured long responses, formal vocab building' },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setGoal(item.id)}
                  className={`select-btn ${goal === item.id ? 'selected' : ''}`}
                >
                  <span className="goal-title">{item.label}</span>
                  <span className="level-desc">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="onboarding-actions">
              <button onClick={handleBack} className="btn btn-secondary">Back</button>
              <button 
                disabled={!goal} 
                onClick={handleNext} 
                className="btn btn-primary btn-next"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Tutor Selection */}
        {step === 3 && (
          <div className="onboarding-step-content fade-in">
            <div className="icon-badge">
              <Sparkles className="badge-icon glow-purple" />
            </div>
            <h2>Choose your AI Tutor</h2>
            <p className="subtitle">Each tutor has a distinct personality and teaching style.</p>
            
            <div className="tutor-cards-container">
              {TUTORS.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setTutor(item)}
                  className={`tutor-select-card ${tutor.id === item.id ? 'selected' : ''}`}
                >
                  <div className="tutor-avatar-circle" style={{ background: item.avatarColor }}>
                    {item.initial}
                  </div>
                  <div className="tutor-card-details">
                    <h3>{item.name}</h3>
                    <span className="tutor-accent">{item.accent} • {item.role}</span>
                    <p className="tutor-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="onboarding-actions">
              <button onClick={handleBack} className="btn btn-secondary">Back</button>
              <button 
                onClick={handleNext} 
                className="btn btn-primary btn-next btn-glow"
              >
                Enter Learna.ai <UserCheck size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export { TUTORS };
