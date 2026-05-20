import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Sliders, RefreshCw, Volume2, Save } from 'lucide-react';
import { speechService } from '../services/speech';

export default function Settings({ userStats, updateStats, onResetProgress }) {
  const [apiKey, setApiKey] = useState(userStats.geminiKey || '');
  const [speechRate, setSpeechRate] = useState(userStats.speechRate || 0.95);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(userStats.tutorVoice || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load browser voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechService.getVoices();
      // Filter for English voices to prevent confusion
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      setAvailableVoices(englishVoices);
      
      // Select default voice if none set
      if (!selectedVoice && englishVoices.length > 0) {
        setSelectedVoice(englishVoices[0].name);
      }
    };

    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    
    updateStats({
      geminiKey: apiKey,
      speechRate: parseFloat(speechRate),
      tutorVoice: selectedVoice
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="settings-container fade-in">
      <header className="page-header">
        <h1>Settings ⚙️</h1>
        <p>Configure speech rate, tutor voice accent, and Gemini API keys for advanced conversations.</p>
      </header>

      <form onSubmit={handleSaveSettings} className="settings-form">
        
        {/* Gemini API Section */}
        <section className="settings-section card-gradient-glow">
          <div className="section-title">
            <Key className="section-icon glow-blue" />
            <h2>Gemini AI Connection</h2>
          </div>
          <p className="section-desc">
            By default, Learna uses a local Smart Simulator. Paste a Gemini API Key to enable infinite, natural conversations with real-time feedback driven by Gemini 1.5/2.5 Flash.
          </p>

          <div className="input-group">
            <label htmlFor="gemini-key">Gemini API Key</label>
            <input
              id="gemini-key"
              type="password"
              placeholder="Paste AI Studio API Key (AIzaSy...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-input"
            />
          </div>

          <div className="connection-status">
            <span className="status-label">Engine Status:</span>
            {userStats.geminiKey ? (
              <span className="status-badge status-active">Gemini API Connected</span>
            ) : (
              <span className="status-badge status-sim">Smart Simulator Mode (Free)</span>
            )}
          </div>

          <div className="help-box">
            <p>💡 Get a free API Key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.</p>
          </div>
        </section>

        {/* Text to Speech Section */}
        <section className="settings-section card-gradient-glow">
          <div className="section-title">
            <Sliders className="section-icon glow-purple" />
            <h2>Voice & Speech Synthesis</h2>
          </div>
          <p className="section-desc">
            Adjust the accent and reading rate of your English tutor.
          </p>

          <div className="input-group">
            <label htmlFor="voice-select">Tutor Voice Accent</label>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="select-input"
            >
              {availableVoices.length === 0 ? (
                <option value="">Browser Default Voice</option>
              ) : (
                availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="input-group">
            <div className="label-slider-row">
              <label htmlFor="rate-slider">Speech Speed Rate</label>
              <span className="slider-value">{speechRate}x</span>
            </div>
            <input
              id="rate-slider"
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(e.target.value)}
              className="slider-input"
            />
            <div className="slider-labels">
              <span>Slow (0.5x)</span>
              <span>Normal (1.0x)</span>
              <span>Fast (1.5x)</span>
            </div>
          </div>
        </section>

        {/* Actions bar */}
        <div className="settings-actions-bar">
          <button type="submit" className="btn btn-primary btn-icon btn-glow">
            <Save size={18} />
            Save Configuration
          </button>
          
          {saveSuccess && (
            <span className="success-toast fade-in">✓ Settings saved successfully!</span>
          )}
        </div>

      </form>

      {/* Danger Zone */}
      <section className="settings-section danger-zone card-gradient-glow">
        <div className="section-title">
          <RefreshCw className="section-icon glow-red" />
          <h2>Danger Zone</h2>
        </div>
        <p className="section-desc">
          Permanently clear your dashboard history, level configuration, and vocabulary bank. This cannot be undone.
        </p>
        <button 
          onClick={onResetProgress}
          className="btn btn-danger btn-lg"
          type="button"
        >
          Reset All Statistics
        </button>
      </section>
    </div>
  );
}
