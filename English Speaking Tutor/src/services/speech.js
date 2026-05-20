// Speech service for handling Text-to-Speech (TTS) and Speech-to-Text (STT)

class SpeechService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.RecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = null;
    this.isListening = false;
    this.currentUtterance = null;
  }

  // Text to Speech
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error("Speech synthesis not supported in this browser."));
        return;
      }

      this.cancel(); // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Apply options
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Select voice based on lang/gender/accent preference
      if (options.voiceName) {
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(v => v.name === options.voiceName);
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      } else if (options.lang) {
        const voices = this.synthesis.getVoices();
        // Try to match language code
        const matchingVoice = voices.find(v => v.lang.startsWith(options.lang));
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        if (event.error !== 'interrupted') {
          reject(event);
        } else {
          resolve(); // Interrupted is expected when user skips
        }
      };

      this.synthesis.speak(utterance);
    });
  }

  cancel() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  getVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  // Speech to Text (Recognition)
  startListening({ onResult, onEnd, onError, lang = 'en-US' }) {
    if (!this.RecognitionClass) {
      if (onError) onError(new Error("Speech recognition not supported in this browser. Use Chrome, Edge, or Safari."));
      return null;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      const rec = new this.RecognitionClass();
      this.recognition = rec;
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = lang;

      rec.onstart = () => {
        this.isListening = true;
      };

      rec.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (onResult) {
          onResult({ finalTranscript, interimTranscript });
        }
      };

      rec.onerror = (event) => {
        if (onError) onError(event);
      };

      rec.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      rec.start();
      return rec;
    } catch (err) {
      if (onError) onError(err);
      return null;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const speechService = new SpeechService();
