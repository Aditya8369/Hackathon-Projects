// AI Conversational and Grammar Feedback Service

// Common grammar rules for local mock checks
const GRAMMAR_RULES = [
  {
    regex: /\bi\s+has\b/i,
    original: "I has",
    corrected: "I have",
    explanation: "Use 'have' with the first-person singular pronoun 'I'."
  },
  {
    regex: /\b(he|she|it)\s+have\b/i,
    original: "have",
    corrected: "has",
    explanation: "Use 'has' for third-person singular pronouns (he, she, it)."
  },
  {
    regex: /\b(he|she|it)\s+do\b/i,
    original: "do",
    corrected: "does",
    explanation: "Use 'does' for third-person singular pronouns (he, she, it) in positive/negative statements or questions."
  },
  {
    regex: /\b(you|we|they)\s+is\b/i,
    original: "is",
    corrected: "are",
    explanation: "Use 'are' for plural or second-person pronouns (you, we, they)."
  },
  {
    regex: /\bi\s+is\b/i,
    original: "I is",
    corrected: "I am",
    explanation: "Use 'am' with 'I'."
  },
  {
    regex: /\bmore\s+better\b/i,
    original: "more better",
    corrected: "better",
    explanation: "'Better' is already comparative. Do not use 'more' with comparative adjectives."
  },
  {
    regex: /\bi\s+am\s+agree\b/i,
    original: "I am agree",
    corrected: "I agree",
    explanation: "In English, 'agree' is a verb. Simply say 'I agree' rather than 'I am agree'."
  },
  {
    regex: /\bevery\s+people\b/i,
    original: "every people",
    corrected: "everyone / every person",
    explanation: "'Every' is followed by a singular noun. Use 'everyone' or 'every person'."
  },
  {
    regex: /\bno\s+have\b/i,
    original: "no have",
    corrected: "don't have",
    explanation: "Use 'don't have' or 'do not have' to express negation in the present simple tense."
  },
  {
    regex: /\b(he|she|it)\s+speak\b/i,
    original: "speak",
    corrected: "speaks",
    explanation: "Add an '-s' to verbs in the present simple tense for third-person singular subjects (he/she/it)."
  },
  {
    regex: /\bi\s+am\s+student\b/i,
    original: "I am student",
    corrected: "I am a student",
    explanation: "Remember to use the indefinite article 'a' before singular countable jobs/titles."
  }
];

// Vocabulary upgrade suggestions
const VOCAB_UPGRADES = [
  { words: [/\bvery\s+good\b/i], suggestions: ["excellent", "superb", "outstanding"] },
  { words: [/\bvery\s+bad\b/i], suggestions: ["terrible", "awful", "dreadful"] },
  { words: [/\bvery\s+happy\b/i], suggestions: ["thrilled", "delighted", "ecstatic"] },
  { words: [/\bvery\s+sad\b/i], suggestions: ["devastated", "heartbroken", "downcast"] },
  { words: [/\bvery\s+big\b/i], suggestions: ["huge", "massive", "gigantic"] },
  { words: [/\bvery\s+small\b/i], suggestions: ["tiny", "minute", "microscopic"] },
  { words: [/\blike\b/i], suggestions: ["appreciate", "adore", "have a passion for"] },
  { words: [/\bimportant\b/i], suggestions: ["crucial", "essential", "vital"] },
  { words: [/\binteresting\b/i], suggestions: ["fascinating", "intriguing", "captivating"] }
];

// Local Simulator Responses
const SIMULATED_SCENARIOS = {
  coffee: {
    welcome: "Welcome to Brew & Blend! ☕ I'm Emma, your barista today. What can I get started for you?",
    responses: [
      {
        keywords: [/hello/i, /hi/i, /hey/i],
        reply: "Hi there! Welcome. Ready to order, or do you need a moment to look at the menu?",
        suggestions: ["I'd like to see the menu, please.", "Hi, I'm ready to order."]
      },
      {
        keywords: [/menu/i, /what\s+do\s+you\s+have/i],
        reply: "We have espresso, cappuccinos, lattes, cold brew, and some delicious pastries like croissants and muffins. What sounds good?",
        suggestions: ["Can I get a cappuccino, please?", "I'll have a chocolate croissant."]
      },
      {
        keywords: [/coffee/i, /cappuccino/i, /latte/i, /espresso/i, /tea/i, /americano/i, /cold brew/i],
        reply: "Excellent choice! What size would you like for that? We have small, medium, and large.",
        suggestions: ["A medium size, please.", "I'll take a large one."]
      },
      {
        keywords: [/small/i, /medium/i, /large/i, /size/i],
        reply: "Got it. And would you like any milk alternatives like oat or almond milk, or regular milk is fine?",
        suggestions: ["Oat milk, please.", "Regular whole milk is fine."]
      },
      {
        keywords: [/oat/i, /almond/i, /soy/i, /milk/i, /regular/i, /whole/i],
        reply: "Perfect. Would you like anything to eat with that, like a croissant, muffin, or a cookie?",
        suggestions: ["No thank you, just the drink.", "Yes, I'll take a butter croissant."]
      },
      {
        keywords: [/croissant/i, /muffin/i, /cookie/i, /pastry/i, /food/i, /eat/i, /yes/i],
        reply: "Delicious! I'll warm that up for you. Will that be for here or to go?",
        suggestions: ["For here, please.", "To go, thank you."]
      },
      {
        keywords: [/here/i, /go/i, /takeaway/i],
        reply: "Awesome! Your total comes to $7.50. You can tap your card right here whenever you're ready.",
        suggestions: ["Here is my card.", "Can I pay with Apple Pay?"]
      },
      {
        keywords: [/card/i, /pay/i, /cash/i, /apple/i, /google/i, /here\s+is/i],
        reply: "All set! Thank you so much. You can pick up your order at the counter on the left in just a minute. Have a wonderful day!",
        suggestions: ["Thank you! You too.", "Thanks, appreciate it."]
      }
    ],
    fallback: "That sounds delicious! I've added that to your order. Would you like anything else, or are we ready to checkout?"
  },
  interview: {
    welcome: "Hello, welcome! I'm Marcus, the hiring manager here. Thank you for coming. Let's start with a brief introduction. Can you tell me about yourself and your background?",
    responses: [
      {
        keywords: [/myself/i, /background/i, /experience/i, /developer/i, /engineer/i, /years/i],
        reply: "That's a very solid background. Why are you interested in joining our company specifically?",
        suggestions: ["I admire your company's focus on innovation.", "I want to work with modern technologies and grow my skills."]
      },
      {
        keywords: [/why/i, /interested/i, /company/i, /join/i, /culture/i, /reputation/i],
        reply: "Excellent. Can you tell me about a challenging project you worked on recently? How did you handle difficulties?",
        suggestions: ["I recently rebuilt a legacy app and optimized database queries.", "I resolved a major performance bug by refactoring context state."]
      },
      {
        keywords: [/challenge/i, /project/i, /difficult/i, /problem/i, /solved/i, /team/i],
        reply: "It sounds like you have strong problem-solving skills. How do you handle conflict or differing opinions within a development team?",
        suggestions: ["I listen to all perspectives and look at data to find the best compromise.", "I initiate open discussions to align on goals."]
      },
      {
        keywords: [/conflict/i, /disagreement/i, /team/i, /listen/i, /discuss/i, /manager/i],
        reply: "That's a mature approach. Where do you see yourself professionally in the next three to five years?",
        suggestions: ["I hope to take on a technical leadership role.", "I want to become an expert in cloud architecture."]
      },
      {
        keywords: [/future/i, /years/i, /goal/i, /lead/i, /grow/i, /career/i],
        reply: "Fantastic. Do you have any questions for me about the role or the team?",
        suggestions: ["What does a typical day look like in this role?", "What is the onboarding process like?"]
      },
      {
        keywords: [/question/i, /what/i, /how/i, /day/i, /onboarding/i, /team/i],
        reply: "Great questions! A typical day involves standups, collaborative coding, and code reviews. We have an agile team. I'll pass your feedback to HR, and they will get in touch with you by Friday. Thank you for your time today!",
        suggestions: ["Thank you very much!", "I look forward to hearing from you."]
      }
    ],
    fallback: "Interesting! That makes a lot of sense. How does that relate to your career goals and what you hope to achieve here?"
  },
  airport: {
    welcome: "Good morning! I'm Sophia, your check-in agent. May I please have your passport and ticket?",
    responses: [
      {
        keywords: [/passport/i, /ticket/i, /here/i, /go/i, /hello/i],
        reply: "Thank you. I see your flight is to London Heathrow. Are you checking in any bags today, or do you just have carry-on luggage?",
        suggestions: ["I have one bag to check.", "Just carry-on luggage today."]
      },
      {
        keywords: [/bag/i, /luggage/i, /suitcase/i, /check/i, /carry/i],
        reply: "Alright, please place your checked bags on the scale to weigh them. We need to make sure they are under 23 kilograms.",
        suggestions: ["Sure, here it is.", "Is the weight okay?"]
      },
      {
        keywords: [/scale/i, /weigh/i, /weight/i, /okay/i, /kilograms/i],
        reply: "The weight is perfect! Would you prefer a window seat or an aisle seat for this flight?",
        suggestions: ["A window seat, please.", "An aisle seat, please."]
      },
      {
        keywords: [/window/i, /aisle/i, /seat/i],
        reply: "Got it. I've secured that seat for you. Here is your boarding pass. Your gate is B12, and boarding will begin at 10:15 AM. Do you have any questions?",
        suggestions: ["Where is gate B12?", "What time does the flight land?"]
      },
      {
        keywords: [/gate/i, /where/i, /security/i, /direction/i],
        reply: "To get to Gate B12, just go through security and turn left. It's about a 5-minute walk. Have a safe and pleasant flight!",
        suggestions: ["Thank you so much!", "Have a nice day."]
      }
    ],
    fallback: "No problem at all! Let me finalize your boarding details. Is there anything else I can help you with today?"
  },
  freetalk: {
    welcome: "Hey there! I'm Sophia. I'm super excited to chat with you today! We can talk about hobbies, travel, movies, or anything else you like. What's on your mind today?",
    responses: [
      {
        keywords: [/hobby/i, /hobbies/i, /free time/i, /fun/i],
        reply: "I love reading, traveling, and experimenting with new recipes in the kitchen! How about you? What do you enjoy doing in your free time?",
        suggestions: ["I like playing video games and reading.", "I enjoy running and outdoor activities."]
      },
      {
        keywords: [/travel/i, /trip/i, /country/i, /vacation/i, /visit/i],
        reply: "Travel is amazing! It opens up so many perspectives. What's the most interesting country or city you've ever visited, and why?",
        suggestions: ["I loved visiting Japan because of the food.", "I really enjoyed visiting Paris for the art."]
      },
      {
        keywords: [/movie/i, /film/i, /watch/i, /series/i, /netflix/i],
        reply: "Oh, I watch a lot of movies! My favorite genre is sci-fi and mystery. What's the last good movie or TV show you watched? Would you recommend it?",
        suggestions: ["I watched Interstellar recently; it was incredible.", "I'm currently watching a documentary series."]
      },
      {
        keywords: [/english/i, /learn/i, /study/i, /practice/i, /tutor/i],
        reply: "English can be challenging, but you're doing a fantastic job practicing! What do you find hardest about learning English?",
        suggestions: ["Speaking and pronunciation are hardest for me.", "Remembering vocabulary is a bit difficult."]
      }
    ],
    fallback: "That's really cool! Tell me more about that. What got you interested in it, and how often do you get to do it?"
  }
};

// Grammar feedback helper
export function checkGrammar(text) {
  if (!text) return { hasErrors: false };

  const trimmed = text.trim();
  const feedback = {
    hasErrors: false,
    originalText: trimmed,
    correctedText: trimmed,
    explanation: "",
    betterExpressions: [],
    pronunciationTips: []
  };

  // 1. Check grammar rules
  for (const rule of GRAMMAR_RULES) {
    if (rule.regex.test(trimmed)) {
      feedback.hasErrors = true;
      feedback.correctedText = trimmed.replace(rule.regex, (match) => {
        // Keep capitalization if matched at start
        const isCapitalized = match[0] === match[0].toUpperCase();
        const replacement = rule.corrected;
        return isCapitalized ? replacement[0].toUpperCase() + replacement.slice(1) : replacement;
      });
      feedback.explanation = rule.explanation;
      break;
    }
  }

  // 2. Suggest better/advanced vocabulary
  for (const upgrade of VOCAB_UPGRADES) {
    let matched = false;
    for (const rx of upgrade.words) {
      if (rx.test(trimmed)) {
        matched = true;
        break;
      }
    }
    if (matched) {
      feedback.betterExpressions = [...feedback.betterExpressions, ...upgrade.suggestions];
    }
  }

  // Add default suggestions if none matched
  if (feedback.betterExpressions.length === 0) {
    feedback.betterExpressions = [
      "To express this more formally, you could say: 'Indeed, that makes perfect sense.'",
      "Try adding descriptive adjectives to sound more native."
    ];
  }

  // Pronunciation tips based on length/vowels
  if (trimmed.length > 5) {
    feedback.pronunciationTips = [
      "Pay attention to the stress on primary syllables.",
      "Practice linking words together smoothly without pauses."
    ];
  } else {
    feedback.pronunciationTips = [
      "Ensure vowel sounds are fully enunciated.",
      "Speak clearly and project your voice."
    ];
  }

  return feedback;
}

// Generate Scores based on grammatical correctness and length
function calculateScores(feedback, originalText) {
  const textLength = originalText.trim().split(/\s+/).length;
  
  // Base scores
  let grammarScore = feedback.hasErrors ? 75 : 95;
  let vocabScore = textLength > 8 ? 90 : 80;
  let fluencyScore = textLength > 5 ? 88 : 78;
  
  // Add slight randomization for realism
  grammarScore += Math.floor(Math.random() * 5);
  vocabScore += Math.floor(Math.random() * 5);
  fluencyScore += Math.floor(Math.random() * 5);

  // Clamp to 100
  grammarScore = Math.min(grammarScore, 100);
  vocabScore = Math.min(vocabScore, 100);
  fluencyScore = Math.min(fluencyScore, 100);

  const overall = Math.round((grammarScore + vocabScore + fluencyScore) / 3);

  return {
    grammar: grammarScore,
    vocabulary: vocabScore,
    fluency: fluencyScore,
    overall
  };
}

// Main AI Service class
export class AIService {
  static async generateReply(userMessage, scenarioKey, chatHistory, apiKey = "") {
    // If API key is provided, use Gemini
    if (apiKey && apiKey.trim() !== "") {
      try {
        return await this.callGeminiAPI(userMessage, scenarioKey, chatHistory, apiKey);
      } catch (err) {
        console.error("Gemini API error, falling back to simulator:", err);
        // Fail over to simulator
      }
    }

    // Default Simulator
    return this.runSimulator(userMessage, scenarioKey);
  }

  static runSimulator(userMessage, scenarioKey) {
    const scenario = SIMULATED_SCENARIOS[scenarioKey] || SIMULATED_SCENARIOS.freetalk;
    
    // Check if it's the very first message
    if (!userMessage) {
      return {
        reply: scenario.welcome,
        feedback: { hasErrors: false, originalText: "", correctedText: "", explanation: "", betterExpressions: [], pronunciationTips: [] },
        scores: { grammar: 100, vocabulary: 100, fluency: 100, overall: 100 }
      };
    }

    // Analyze grammar
    const feedback = checkGrammar(userMessage);
    const scores = calculateScores(feedback, userMessage);

    // Find best match in preloaded responses
    let replyText = "";
    let matchedResponse = scenario.responses.find(res => {
      return res.keywords.some(rx => rx.test(userMessage));
    });

    let suggestions = [];
    if (matchedResponse) {
      replyText = matchedResponse.reply;
      suggestions = matchedResponse.suggestions;
    } else {
      replyText = scenario.fallback;
      suggestions = [
        "That is very interesting, tell me more.",
        "Could you explain what you mean?",
        "Yes, I understand."
      ];
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          reply: replyText,
          suggestions,
          feedback,
          scores
        });
      }, 800); // Add a small latency to feel realistic
    });
  }

  static async callGeminiAPI(userMessage, scenarioKey, chatHistory, apiKey) {
    // Scenario instructions for the LLM
    const scenarioPrompts = {
      coffee: "You are Emma, a warm and polite barista at a local coffee shop called 'Brew & Blend'. Practice ordering food/drinks. Speak simply and naturally. Be conversational.",
      interview: "You are Marcus, an experienced tech hiring manager conducting a mock interview for a software development position. Keep questions professional, encouraging but challenging.",
      airport: "You are Sophia, a check-in gate representative at London Heathrow airport. Help the user check-in, choose a seat, weigh bags, and provide boarding details.",
      freetalk: "You are Sophia, a friendly, encouraging companion who enjoys chatting about general topics like hobbies, travel, movies, and language learning. Help the user express themselves."
    };

    const systemInstruction = `
      ${scenarioPrompts[scenarioKey] || scenarioPrompts.freetalk}
      Your goal is to act as an English-speaking tutor. Speak in 1-3 natural conversational sentences.
      Along with your conversational reply, you must analyze the user's last message for grammar, punctuation, and phrasing errors, and suggest improvements.
      
      You MUST respond ONLY with a JSON object matching this schema:
      {
        "reply": "Your next conversational response speaking as the persona",
        "suggestions": ["A helpful recommended user reply option 1", "A helpful recommended user reply option 2"],
        "feedback": {
          "hasErrors": true or false,
          "originalText": "The exact user message evaluated",
          "correctedText": "The corrected version of the user message (or same text if perfect)",
          "explanation": "If hasErrors is true, a concise 1-sentence grammatical explanation. If false, leave blank.",
          "betterExpressions": ["A more native, formal, or rich way to say it", "Another alternative phrase"],
          "pronunciationTips": ["1-2 tips about stressing syllables, vowel sounds, or linking in the user's sentence"]
        },
        "scores": {
          "grammar": integer between 50 and 100,
          "vocabulary": integer between 50 and 100,
          "fluency": integer between 50 and 100,
          "overall": integer between 50 and 100
        }
      }
    `;

    // Map chat history to Gemini structure
    const formattedContents = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add current user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: formattedContents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON output from the model
    try {
      return JSON.parse(textResponse);
    } catch (e) {
      console.warn("Gemini response is not valid JSON, parsing raw text:", textResponse);
      // Fallback manual parser in case JSON model output has minor errors
      return {
        reply: textResponse.substring(0, 150),
        suggestions: ["Okay, let's keep going.", "Can you explain that?"],
        feedback: {
          hasErrors: false,
          originalText: userMessage,
          correctedText: userMessage,
          explanation: "",
          betterExpressions: ["Sounds good!"],
          pronunciationTips: ["Project your voice clearly."]
        },
        scores: { grammar: 90, vocabulary: 90, fluency: 90, overall: 90 }
      };
    }
  }
}
