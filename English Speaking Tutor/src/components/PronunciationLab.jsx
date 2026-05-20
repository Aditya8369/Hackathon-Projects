import React, { useState } from 'react';
import { Play, Mic, MicOff, RefreshCw, Volume2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { speechService } from '../services/speech';

const PRACTICE_CARDS = [
  { id: '1', phrase: 'Hello, nice to meet you.', difficulty: 'Easy', category: 'Social' },
  { id: '2', phrase: 'How much does this cappuccino cost?', difficulty: 'Easy', category: 'Shopping' },
  { id: '3', phrase: 'The software installation was successful.', difficulty: 'Medium', category: 'Business' },
  { id: '4', phrase: 'Particularly, we must prioritize cloud architecture.', difficulty: 'Medium', category: 'Technology' },
  { id: '5', phrase: 'She sells seashells by the seashore.', difficulty: 'Hard', category: 'Tongue Twister' },
  { id: '6', phrase: 'Red leather, yellow leather, red leather, yellow leather.', difficulty: 'Hard', category: 'Tongue Twister' },
  { id: '7', phrase: 'Could you tell me the directions to the nearest subway station?', difficulty: 'Medium', category: 'Travel' }
];

export default function PronunciationLab({ userStats, updateStats }) {
  const [selectedCard, setSelectedCard] = useState(PRACTICE_CARDS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [comparisonResults, setComparisonResults] = useState(null);
  const [pronounceScore, setPronounceScore] = useState(null);

  // Play standard audio
  const handlePlayAudio = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    // Fallback to active tutor voice
    speechService.speak(selectedCard.phrase, {
      rate: 0.9,
      voiceName: userStats.tutorVoice
    }).then(() => {
      setIsPlaying(false);
    }).catch(() => {
      setIsPlaying(false);
    });
  };

  // Clean strings for match comparison
  const cleanWord = (word) => word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");

  // Compare spoken words to target words
  const evaluatePronunciation = (spoken) => {
    const targetWords = selectedCard.phrase.split(/\s+/);
    const spokenWords = spoken.split(/\s+/);

    let matchCount = 0;
    const wordEvaluations = targetWords.map((targetW) => {
      const cleanedTarget = cleanWord(targetW);
      
      // Look for a close match in spoken words
      const isMatched = spokenWords.some(spokenW => cleanWord(spokenW) === cleanedTarget);
      
      if (isMatched) {
        matchCount++;
        return { word: targetW, status: 'correct' };
      } else {
        return { word: targetW, status: 'incorrect' };
      }
    });

    const score = Math.round((matchCount / targetWords.length) * 100);
    setPronounceScore(score);
    setComparisonResults(wordEvaluations);

    // Save average pronunciation score in user stats
    const oldPronScore = userStats.scores.pronunciation || 70;
    const newPronScore = Math.round((oldPronScore + score) / 2);
    
    updateStats({
      scores: {
        ...userStats.scores,
        pronunciation: newPronScore
      }
    });
  };

  // Toggle Recording
  const handleToggleRecord = () => {
    if (isRecording) {
      speechService.stopListening();
      setIsRecording(false);
    } else {
      setRecordedText('');
      setComparisonResults(null);
      setPronounceScore(null);
      setIsRecording(true);

      speechService.startListening({
        lang: 'en-US',
        onResult: ({ finalTranscript }) => {
          if (finalTranscript) {
            const resultText = finalTranscript.trim();
            setRecordedText(resultText);
            evaluatePronunciation(resultText);
          }
        },
        onEnd: () => {
          setIsRecording(false);
        },
        onError: (err) => {
          console.error("Pronunciation mic error:", err);
          setIsRecording(false);
        }
      });
    }
  };

  const handleCardChange = (card) => {
    setSelectedCard(card);
    setRecordedText('');
    setComparisonResults(null);
    setPronounceScore(null);
    speechService.cancel();
  };

  return (
    <div className="pronounce-container fade-in">
      
      <header className="page-header">
        <h1>Pronunciation Lab 🎙️</h1>
        <p>Listen to correct accents, practice speech cards, and receive word-by-word correctness reports.</p>
      </header>

      <div className="pronounce-layout">
        
        {/* Left Side: Cards selector */}
        <section className="pronounce-sidebar-cards">
          <h2>Select a Card</h2>
          <div className="cards-list">
            {PRACTICE_CARDS.map((card) => {
              const isSelected = card.id === selectedCard.id;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardChange(card)}
                  className={`practice-card-item ${isSelected ? 'active' : ''}`}
                >
                  <div className="card-top">
                    <span className={`diff-badge diff-${card.difficulty.toLowerCase()}`}>
                      {card.difficulty}
                    </span>
                    <span className="category-badge">{card.category}</span>
                  </div>
                  <p className="card-preview-text">{card.phrase}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Right Side: Training Board */}
        <section className="pronounce-board-widget">
          <div className="training-card">
            
            {/* Card Header */}
            <div className="training-card-header">
              <span className="current-difficulty-badge">
                {selectedCard.difficulty} Level
              </span>
              <span className="current-category">Category: {selectedCard.category}</span>
            </div>

            {/* Target phrase bubble */}
            <div className="target-phrase-bubble">
              <h2>"{selectedCard.phrase}"</h2>
            </div>

            {/* Speaking controls */}
            <div className="practice-action-buttons">
              <button 
                onClick={handlePlayAudio}
                className={`btn btn-secondary-glow btn-lg btn-icon ${isPlaying ? 'playing' : ''}`}
              >
                <Volume2 size={20} />
                {isPlaying ? 'Speaking...' : 'Listen Teacher'}
              </button>

              <button 
                onClick={handleToggleRecord}
                className={`btn btn-primary-glow btn-lg btn-icon ${isRecording ? 'recording-active' : ''}`}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                {isRecording ? 'Listening... Click to stop' : 'Record Attempt'}
              </button>
            </div>

            {/* Waveform graphic when recording */}
            {isRecording && (
              <div className="record-wave-container">
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
            )}

            {/* Evaluation Results */}
            {recordedText && (
              <div className="evaluation-panel fade-in">
                <div className="eval-scores-row">
                  <div className="score-summary">
                    <span className="score-num">{pronounceScore}%</span>
                    <span className="score-label">Accuracy Score</span>
                  </div>
                  <div className="eval-status-indicator">
                    {pronounceScore >= 80 ? (
                      <div className="status-message correct-msg">
                        <CheckCircle2 className="icon-green" />
                        <span>Fantastic! Your pronunciation is very native and clear.</span>
                      </div>
                    ) : (
                      <div className="status-message retry-msg">
                        <AlertCircle className="icon-yellow" />
                        <span>Good try! Focus on red words and try again to improve.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="transcribed-result-box">
                  <h3>What you said:</h3>
                  <p className="transcribed-text">"{recordedText}"</p>
                </div>

                {/* Word breakdown display */}
                {comparisonResults && (
                  <div className="comparison-box">
                    <h3>Pronunciation Analysis:</h3>
                    <div className="word-comparison-flow">
                      {comparisonResults.map((item, index) => (
                        <span 
                          key={index} 
                          className={`comparison-word ${item.status === 'correct' ? 'matched' : 'missed'}`}
                          title={item.status === 'correct' ? 'Correctly pronounced' : 'Check pronunciation'}
                        >
                          {item.word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

      </div>
    </div>
  );
}
