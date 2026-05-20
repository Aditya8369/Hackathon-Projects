import React, { useState } from 'react';
import { BookOpen, HelpCircle, Check, X, RefreshCw, ChevronRight, Award } from 'lucide-react';

const VOCAB_BANK = [
  { word: 'cappuccino', definition: 'A type of coffee drink prepared with double espresso and hot frothed milk.', sentence: 'I ordered a medium cappuccino with oat milk.', level: 'A1' },
  { word: 'croissant', definition: 'A flaky, buttery, crescent-shaped pastry of French origin.', sentence: 'Nothing is better than a fresh warm croissant in the morning.', level: 'A2' },
  { word: 'outstanding', definition: 'Exceptionally good; clearly superior or distinguished.', sentence: 'The AI gave an outstanding suggestion for my resume summary.', level: 'B2' },
  { word: 'crucial', definition: 'Extremely important, critical, or vital to resolve a situation.', sentence: 'Clear pronunciation is crucial for effective communication.', level: 'B1' },
  { word: 'boarding pass', definition: 'A document provided by an airline that gives permission to get on the aircraft.', sentence: 'Show your boarding pass and passport to the gate agent.', level: 'A2' },
  { word: 'collaborative', definition: 'Produced or conducted by two or more parties working together.', sentence: 'Software development is a collaborative effort among team members.', level: 'B2' },
  { word: 'fascinating', definition: 'Extremely interesting, captivating, or charming.', sentence: 'The culture of Japan is absolutely fascinating to study.', level: 'B1' },
  { word: 'ecstatic', definition: 'Feeling or expressing overwhelming happiness or joyful excitement.', sentence: 'She was ecstatic when she passed her job interview.', level: 'C1' }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which word means 'extremely important, critical, or vital'?",
    options: ["cappuccino", "crucial", "collaborative", "croissant"],
    correctIndex: 1
  },
  {
    id: 2,
    question: "Complete the sentence: 'Software engineering is a ________ process involving developers and designers.'",
    options: ["cappuccino", "boarding pass", "ecstatic", "collaborative"],
    correctIndex: 3
  },
  {
    id: 3,
    question: "What is the definition of 'outstanding'?",
    options: [
      "Extremely interesting and charming",
      "Exceptionally good; clearly superior",
      "A crescent-shaped flaky French bread",
      "A document used to board a plane"
    ],
    correctIndex: 1
  },
  {
    id: 4,
    question: "Which word describes feeling 'overwhelmingly happy or excited'?",
    options: ["ecstatic", "crucial", "cappuccino", "fascinating"],
    correctIndex: 0
  }
];

export default function VocabularyBuilder({ userStats, updateStats }) {
  const [activeSubTab, setActiveSubTab] = useState('cards'); // 'cards' or 'quiz'
  const [flippedCardId, setFlippedCardId] = useState(null);
  
  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const handleCardClick = (index) => {
    if (flippedCardId === index) {
      setFlippedCardId(null);
    } else {
      setFlippedCardId(index);
    }
  };

  const handleOptionSelect = (optionIndex) => {
    if (selectedOptionIndex !== null) return; // Answer already lock-in
    setSelectedOptionIndex(optionIndex);
    
    const isCorrect = optionIndex === QUIZ_QUESTIONS[currentQuestionIndex].correctIndex;
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionIndex(null);
    if (currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
      
      // Update global Vocabulary Score
      const quizPercentage = Math.round(( (correctAnswersCount + (selectedOptionIndex === QUIZ_QUESTIONS[currentQuestionIndex].correctIndex ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100);
      const oldVocabScore = userStats.scores.vocabulary || 80;
      const newVocabScore = Math.round((oldVocabScore + quizPercentage) / 2);
      
      updateStats({
        scores: {
          ...userStats.scores,
          vocabulary: Math.min(newVocabScore, 100)
        }
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setQuizFinished(false);
    setCorrectAnswersCount(0);
  };

  return (
    <div className="vocab-container fade-in">
      
      <header className="page-header">
        <h1>Vocabulary Builder 📖</h1>
        <p>Review keywords added during conversations, flip flashcards, and test your retention with quizzes.</p>
      </header>

      {/* Sub tabs */}
      <div className="subtab-selector">
        <button 
          onClick={() => setActiveSubTab('cards')}
          className={`subtab-btn ${activeSubTab === 'cards' ? 'active' : ''}`}
        >
          <BookOpen size={16} />
          Flashcards
        </button>
        <button 
          onClick={() => setActiveSubTab('quiz')}
          className={`subtab-btn ${activeSubTab === 'quiz' ? 'active' : ''}`}
        >
          <HelpCircle size={16} />
          Retention Quiz
        </button>
      </div>

      {/* FLASHCARDS VIEWER */}
      {activeSubTab === 'cards' && (
        <section className="flashcards-section fade-in">
          <div className="flashcards-grid">
            {VOCAB_BANK.map((vocab, index) => {
              const isFlipped = flippedCardId === index;
              return (
                <div 
                  key={index} 
                  className={`flashcard-3d-wrapper ${isFlipped ? 'flipped' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="flashcard-inner">
                    {/* Front side */}
                    <div className="flashcard-front">
                      <div className="card-badge">{vocab.level}</div>
                      <h2>{vocab.word}</h2>
                      <span className="tap-hint">Tap to flip &rarr;</span>
                    </div>

                    {/* Back side */}
                    <div className="flashcard-back">
                      <h2>{vocab.word}</h2>
                      <p className="definition">{vocab.definition}</p>
                      <div className="sentence-example">
                        <strong>Example:</strong>
                        <p>"{vocab.sentence}"</p>
                      </div>
                      <span className="tap-hint">&larr; Tap to return</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* RETENTION QUIZ VIEWER */}
      {activeSubTab === 'quiz' && (
        <section className="quiz-section fade-in">
          {!quizFinished ? (
            <div className="quiz-card card-gradient-glow">
              {/* Quiz Header */}
              <div className="quiz-header">
                <span>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                <div className="score-badge">Correct: {correctAnswersCount}</div>
              </div>

              {/* Progress Line */}
              <div className="quiz-progress-line">
                <div 
                  className="quiz-progress-fill" 
                  style={{ width: `${((currentQuestionIndex) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="question-box">
                <h2>{QUIZ_QUESTIONS[currentQuestionIndex].question}</h2>
              </div>

              {/* Options Grid */}
              <div className="options-grid">
                {QUIZ_QUESTIONS[currentQuestionIndex].options.map((option, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const isCorrect = idx === QUIZ_QUESTIONS[currentQuestionIndex].correctIndex;
                  const isLocked = selectedOptionIndex !== null;
                  
                  let optionClass = "";
                  if (isLocked) {
                    if (isCorrect) optionClass = "correct-opt";
                    else if (isSelected) optionClass = "incorrect-opt";
                    else optionClass = "disabled-opt";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isLocked}
                      onClick={() => handleOptionSelect(idx)}
                      className={`option-btn ${optionClass}`}
                    >
                      <span className="opt-letter">{String.fromCharCode(65 + idx)}.</span>
                      <span className="opt-text">{option}</span>
                      {isLocked && isCorrect && <Check size={18} className="opt-status-icon icon-green" />}
                      {isLocked && isSelected && !isCorrect && <X size={18} className="opt-status-icon icon-red" />}
                    </button>
                  );
                })}
              </div>

              {/* Navigation button */}
              {selectedOptionIndex !== null && (
                <div className="quiz-actions fade-in">
                  <button 
                    onClick={handleNextQuestion}
                    className="btn btn-primary btn-icon-right"
                  >
                    {currentQuestionIndex + 1 === QUIZ_QUESTIONS.length ? 'Finish Quiz' : 'Next Question'}
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="quiz-finished-card card-gradient-glow text-center fade-in">
              <div className="award-badge-wrapper">
                <Award size={64} className="award-icon glow-gold animate-bounce" />
              </div>
              <h2>Quiz Completed!</h2>
              <p className="quiz-summary-desc">
                You answered <strong>{correctAnswersCount}</strong> out of <strong>{QUIZ_QUESTIONS.length}</strong> questions correctly.
              </p>
              
              <div className="quiz-metric-results">
                <div className="score-percentage-circle">
                  <h3>{Math.round((correctAnswersCount / QUIZ_QUESTIONS.length) * 100)}%</h3>
                  <span>Score</span>
                </div>
                <div className="score-feedback-text">
                  <p>Your vocabulary score stats have been updated on the dashboard!</p>
                </div>
              </div>

              <button onClick={resetQuiz} className="btn btn-primary-glow btn-lg btn-icon">
                <RefreshCw size={18} />
                Try Quiz Again
              </button>
            </div>
          )}
        </section>
      )}

    </div>
  );
}
export { VOCAB_BANK };
