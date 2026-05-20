import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RefreshCw, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  ArrowLeft,
  Settings,
  Flame
} from 'lucide-react';
import { speechService } from '../services/speech';
import { AIService } from '../services/ai';
import { TUTORS } from './Onboarding';

const SCENARIOS = [
  { id: 'freetalk', title: 'Free Chat', desc: 'Informal daily chat', emoji: '💬' },
  { id: 'coffee', title: 'Coffee Shop', desc: 'Order drinks & pay', emoji: '☕' },
  { id: 'interview', title: 'Job Interview', desc: 'Professional software developer role', emoji: '💻' },
  { id: 'airport', title: 'Airport Check-in', desc: 'Tickets, bags, & gates', emoji: '✈️' }
];

export default function ConversationArena({ 
  userStats, 
  history, 
  setHistory, 
  updateStats,
  selectedScenario,
  setSelectedScenario
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const chatEndRef = useRef(null);
  const activeTutor = TUTORS.find(t => t.id === userStats.tutor) || TUTORS[0];

  // Initialize Conversation for Selected Scenario
  useEffect(() => {
    startNewSession(selectedScenario);
  }, [selectedScenario]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript, isThinking]);

  // Auto-speak tutor replies (if not muted)
  const speakResponse = (text) => {
    if (isMuted) return;
    
    // Choose correct voice name based on tutor
    const options = {
      voiceName: userStats.tutorVoice || activeTutor.voiceName,
      rate: userStats.speechRate || 0.95
    };
    
    speechService.speak(text, options).catch(err => {
      console.warn("TTS Speech Synthesis failed/interrupted:", err);
    });
  };

  const startNewSession = async (scenarioId) => {
    speechService.cancel();
    setIsThinking(true);
    
    // Fetch initial tutor greeting
    const result = await AIService.generateReply("", scenarioId, [], userStats.geminiKey);
    
    const greetingMsg = {
      id: 'greeting-' + Date.now(),
      sender: 'tutor',
      text: result.reply,
      timestamp: new Date()
    };
    
    setMessages([greetingMsg]);
    setSuggestions(result.suggestions || []);
    setIsThinking(false);
    
    // Speak welcome
    setTimeout(() => {
      speakResponse(result.reply);
    }, 400);
  };

  // Handle Voice Input
  const handleToggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      speechService.cancel(); // Stop talking before listening
      setInterimTranscript('');
      
      const rec = speechService.startListening({
        lang: 'en-US',
        onResult: ({ finalTranscript, interimTranscript }) => {
          setInterimTranscript(interimTranscript);
          if (finalTranscript) {
            setInputText(prev => prev + ' ' + finalTranscript);
            setInterimTranscript('');
          }
        },
        onEnd: () => {
          setIsListening(false);
        },
        onError: (err) => {
          console.error("Speech Recognition Error:", err);
          setIsListening(false);
        }
      });

      if (rec) {
        setIsListening(true);
      }
    }
  };

  // Submit Message
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const messageText = inputText.trim() || interimTranscript.trim();
    if (!messageText) return;

    // Reset input states
    setInputText('');
    setInterimTranscript('');
    speechService.stopListening();
    setIsListening(false);

    // 1. Add user message
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
      feedback: null
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsThinking(true);

    try {
      // 2. Call AI service for reply + corrections
      const chatHistoryForAPI = newMessages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const result = await AIService.generateReply(
        messageText, 
        selectedScenario, 
        chatHistoryForAPI, 
        userStats.geminiKey
      );

      // Attach feedback to user message
      userMsg.feedback = result.feedback;
      userMsg.scores = result.scores;

      // 3. Add tutor response
      const tutorMsg = {
        id: 'tutor-' + Date.now(),
        sender: 'tutor',
        text: result.reply,
        timestamp: new Date()
      };

      setMessages([...newMessages, tutorMsg]);
      setSuggestions(result.suggestions || []);
      
      // Update global user stats
      if (result.scores) {
        updateStats({
          scores: result.scores,
          history: [...history, userMsg, tutorMsg]
        });
      }

      setIsThinking(false);

      // 4. Speak tutor response
      speakResponse(result.reply);

    } catch (err) {
      console.error("Failed to generate response:", err);
      setIsThinking(false);
    }
  };

  // Select recommended suggestion
  const handleSuggestionClick = (suggestionText) => {
    setInputText(suggestionText);
  };

  return (
    <div className="arena-container fade-in">
      
      {/* Top Header / Scenario Selector */}
      <div className="arena-header">
        <div className="scenario-meta">
          <span className="scenario-emoji">
            {SCENARIOS.find(s => s.id === selectedScenario)?.emoji || '💬'}
          </span>
          <div>
            <h2>{SCENARIOS.find(s => s.id === selectedScenario)?.title}</h2>
            <p className="scenario-sub">Roleplaying with {activeTutor.name}</p>
          </div>
        </div>

        <div className="arena-actions">
          <div className="selector-pills">
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`pill-btn ${selectedScenario === sc.id ? 'active' : ''}`}
              >
                {sc.title}
              </button>
            ))}
          </div>

          <button 
            onClick={() => startNewSession(selectedScenario)}
            className="btn btn-icon-only" 
            title="Restart Scenario"
          >
            <RefreshCw size={16} />
          </button>

          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className={`btn btn-icon-only ${isMuted ? 'muted' : ''}`}
            title={isMuted ? "Unmute Voice Output" : "Mute Voice Output"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* Chat Messages Panel */}
      <div className="chat-messages-panel">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`message-row ${isUser ? 'user-row' : 'tutor-row'}`}>
              
              {/* Avatar indicator */}
              {!isUser && (
                <div className="chat-avatar" style={{ background: activeTutor.avatarColor }}>
                  {activeTutor.initial}
                </div>
              )}
              
              <div className="message-content-wrapper">
                <div className={`message-bubble ${isUser ? 'user-bubble' : 'tutor-bubble'}`}>
                  <p className="message-text">{msg.text}</p>
                </div>

                {/* Real-time Grammatical Feedback Card (User messages only) */}
                {isUser && msg.feedback && (
                  <div className={`feedback-card-inline ${msg.feedback.hasErrors ? 'has-errors' : 'perfect-grammar'}`}>
                    <div className="feedback-card-header">
                      <span className="status-label">
                        {msg.feedback.hasErrors ? '💡 Grammar correction' : '✨ Perfect grammar!'}
                      </span>
                      {msg.scores && (
                        <span className="score-label">Grammar: {msg.scores.grammar}%</span>
                      )}
                    </div>

                    {msg.feedback.hasErrors && (
                      <div className="feedback-details">
                        <div className="correction-line">
                          <span className="cross">❌ {msg.feedback.originalText}</span>
                          <span className="arrow">&rarr;</span>
                          <span className="tick">✅ {msg.feedback.correctedText}</span>
                        </div>
                        <p className="explanation-text">{msg.feedback.explanation}</p>
                      </div>
                    )}

                    {msg.feedback.betterExpressions && msg.feedback.betterExpressions.length > 0 && (
                      <div className="better-expressions">
                        <span className="vocab-tip-label">Vocabulary Upgrades:</span>
                        <div className="upgrade-pills">
                          {msg.feedback.betterExpressions.map((exp, index) => (
                            <span key={index} className="upgrade-pill">{exp}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="chat-avatar user-avatar">
                  U
                </div>
              )}
            </div>
          );
        })}

        {/* Tutor Thinking Indicator */}
        {isThinking && (
          <div className="message-row tutor-row">
            <div className="chat-avatar animate-pulse" style={{ background: activeTutor.avatarColor }}>
              {activeTutor.initial}
            </div>
            <div className="message-bubble tutor-bubble thinking-bubble">
              <span className="thinking-dot"></span>
              <span className="thinking-dot"></span>
              <span className="thinking-dot"></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Voice Assistant / Keyboard Panel */}
      <div className="arena-control-panel">
        
        {/* Recommended Speaking Suggestions */}
        {suggestions.length > 0 && (
          <div className="suggestions-bar">
            <span className="suggestion-title">Tutor suggests:</span>
            <div className="suggestion-pills-container">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(sug)}
                  className="suggestion-pill"
                >
                  {sug} <ChevronRight size={12} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Controls */}
        <form onSubmit={handleSubmit} className="input-form">
          <button
            type="button"
            onClick={handleToggleListening}
            className={`mic-button ${isListening ? 'listening' : ''}`}
            title={isListening ? "Stop listening" : "Start speaking"}
          >
            {isListening ? (
              <>
                <MicOff className="mic-icon animate-pulse" />
                <div className="wave-ring ring-1"></div>
                <div className="wave-ring ring-2"></div>
              </>
            ) : (
              <Mic className="mic-icon" />
            )}
          </button>

          <div className="text-input-wrapper">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening... speak now." : "Type your reply or click mic to talk..."}
              className="text-input"
            />
            {interimTranscript && (
              <div className="interim-overlay">
                <span>{interimTranscript}</span>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!inputText.trim() && !interimTranscript.trim()}
            className="send-button"
          >
            <Send size={18} />
          </button>
        </form>

        {/* Voice recognition helper info */}
        {isListening && (
          <div className="listening-visualizer">
            <div className="waveform-bar"></div>
            <div className="waveform-bar"></div>
            <div className="waveform-bar"></div>
            <div className="waveform-bar"></div>
            <div className="waveform-bar"></div>
            <div className="waveform-bar"></div>
            <span className="status-tip">Speak now... Learna will transcribe automatically. Click mic again to send.</span>
          </div>
        )}
      </div>

    </div>
  );
}
export { SCENARIOS };
