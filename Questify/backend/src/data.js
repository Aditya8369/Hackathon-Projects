const USERS = [
  {
    id: "u1",
    name: "Rushabh",
    email: "rushabh@questify.dev",
    xp: 180,
    streak: 4,
    level: 2,
    badges: ["Fast Starter"],
    topicAccuracy: {
      javascript: 0.82,
      react: 0.58,
      dsa: 0.51,
      database: 0.74,
    },
    completedQuests: ["q-react-1", "q-js-1"],
  },
  {
    id: "u2",
    name: "Aarav",
    email: "aarav@questify.dev",
    xp: 260,
    streak: 7,
    level: 3,
    badges: ["Consistency King", "Speed Runner"],
    topicAccuracy: {
      javascript: 0.73,
      react: 0.69,
      dsa: 0.84,
      database: 0.61,
    },
    completedQuests: ["q-dsa-1", "q-js-1", "q-db-1"],
  },
  {
    id: "u3",
    name: "Siya",
    email: "siya@questify.dev",
    xp: 210,
    streak: 6,
    level: 3,
    badges: ["Night Grinder"],
    topicAccuracy: {
      javascript: 0.88,
      react: 0.77,
      dsa: 0.64,
      database: 0.56,
    },
    completedQuests: ["q-react-1", "q-react-2", "q-db-1"],
  },
]

const QUESTS = [
  {
    id: "q-react-1",
    title: "React State Survival",
    topic: "react",
    difficulty: "medium",
    baseXp: 60,
    questions: [
      {
        id: "q1",
        prompt: "Which Hook is used for local component state?",
        options: ["useMemo", "useEffect", "useState", "useRef"],
        answer: "useState",
      },
      {
        id: "q2",
        prompt: "What triggers a React component re-render?",
        options: [
          "State or props changes",
          "CSS updates only",
          "DOM inspection",
          "Page refresh only",
        ],
        answer: "State or props changes",
      },
      {
        id: "q3",
        prompt: "What is the key purpose of keys in lists?",
        options: [
          "Enable routing",
          "Help React identify changed list items",
          "Style list elements",
          "Add event listeners",
        ],
        answer: "Help React identify changed list items",
      },
    ],
  },
  {
    id: "q-dsa-1",
    title: "DSA Speed Arena",
    topic: "dsa",
    difficulty: "hard",
    baseXp: 80,
    questions: [
      {
        id: "q1",
        prompt: "Average time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        answer: "O(log n)",
      },
      {
        id: "q2",
        prompt: "Which data structure uses FIFO ordering?",
        options: ["Stack", "Queue", "Tree", "Heap"],
        answer: "Queue",
      },
      {
        id: "q3",
        prompt: "Quick sort worst case time complexity?",
        options: ["O(log n)", "O(n)", "O(n^2)", "O(n log n)"],
        answer: "O(n^2)",
      },
    ],
  },
  {
    id: "q-react-2",
    title: "React Performance Lab",
    topic: "react",
    difficulty: "hard",
    baseXp: 90,
    questions: [
      {
        id: "q1",
        prompt: "Which Hook memoizes a computed value?",
        options: ["useEffect", "useMemo", "useState", "useId"],
        answer: "useMemo",
      },
      {
        id: "q2",
        prompt: "React.memo helps mainly by...",
        options: [
          "Avoiding unnecessary re-renders",
          "Managing form state",
          "Fetching API data",
          "Creating context",
        ],
        answer: "Avoiding unnecessary re-renders",
      },
      {
        id: "q3",
        prompt: "Which tool detects unnecessary React re-renders best?",
        options: [
          "React DevTools Profiler",
          "Chrome bookmarks",
          "Redux store",
          "JSON.stringify",
        ],
        answer: "React DevTools Profiler",
      },
    ],
  },
  {
    id: "q-dsa-2",
    title: "Graph Boss Battle",
    topic: "dsa",
    difficulty: "hard",
    baseXp: 100,
    questions: [
      {
        id: "q1",
        prompt: "Which traversal uses a queue?",
        options: ["DFS", "BFS", "Inorder", "Postorder"],
        answer: "BFS",
      },
      {
        id: "q2",
        prompt: "Dijkstra's algorithm requires non-negative...",
        options: ["nodes", "edges", "weights", "heaps"],
        answer: "weights",
      },
      {
        id: "q3",
        prompt: "Cycle detection in directed graph often uses...",
        options: [
          "Sliding window",
          "Recursion stack with DFS",
          "Binary search",
          "Trie",
        ],
        answer: "Recursion stack with DFS",
      },
    ],
  },
  {
    id: "q-js-1",
    title: "JavaScript Async Sprint",
    topic: "javascript",
    difficulty: "medium",
    baseXp: 70,
    questions: [
      {
        id: "q1",
        prompt: "Which object manages asynchronous operations with states?",
        options: ["Map", "Promise", "Set", "Date"],
        answer: "Promise",
      },
      {
        id: "q2",
        prompt: "await can only be used inside...",
        options: ["for loop", "async function", "switch", "constructor"],
        answer: "async function",
      },
      {
        id: "q3",
        prompt: "Which queue executes before macrotasks?",
        options: ["Render queue", "Microtask queue", "Animation queue", "Fetch queue"],
        answer: "Microtask queue",
      },
    ],
  },
  {
    id: "q-db-1",
    title: "Database Defender",
    topic: "database",
    difficulty: "medium",
    baseXp: 75,
    questions: [
      {
        id: "q1",
        prompt: "Which SQL keyword removes duplicate rows from result sets?",
        options: ["UNIQUE", "DISTINCT", "ONLY", "FILTER"],
        answer: "DISTINCT",
      },
      {
        id: "q2",
        prompt: "An index mostly improves...",
        options: ["Storage usage", "Read query speed", "Table creation", "Column naming"],
        answer: "Read query speed",
      },
      {
        id: "q3",
        prompt: "Which normal form removes transitive dependency?",
        options: ["1NF", "2NF", "3NF", "BCNF only"],
        answer: "3NF",
      },
    ],
  },
]

const DAILY_CHALLENGE = {
  id: "daily-1",
  title: "Two-Minute React Recall",
  topic: "react",
  xpReward: 40,
  question: "Which hook should fetch API data after first render?",
  options: ["useCallback", "useEffect", "useMemo", "useState"],
  answer: "useEffect",
}

const BADGE_RULES = [
  {
    name: "Fast Starter",
    description: "Crossed 150 XP",
    check: (user) => user.xp >= 150,
  },
  {
    name: "Consistency King",
    description: "Maintained a 7-day streak",
    check: (user) => user.streak >= 7,
  },
  {
    name: "Boss Level",
    description: "Reached level 5",
    check: (user) => user.level >= 5,
  },
  {
    name: "First Blood",
    description: "Completed your first quest",
    check: (user) => (user.completedQuests?.length || 0) >= 1,
  },
  {
    name: "Quest Grinder",
    description: "Completed 3 unique quests",
    check: (user) => (user.completedQuests?.length || 0) >= 3,
  },
  {
    name: "React Ranger",
    description: "Completed both React quests",
    check: (user) => {
      const completed = new Set(user.completedQuests || [])
      return completed.has("q-react-1") && completed.has("q-react-2")
    },
  },
  {
    name: "Algorithm Ace",
    description: "Completed both DSA quests",
    check: (user) => {
      const completed = new Set(user.completedQuests || [])
      return completed.has("q-dsa-1") && completed.has("q-dsa-2")
    },
  },
  {
    name: "Full Stack Pilot",
    description: "Finished quests in React, JavaScript, DSA, and Database",
    check: (user) => {
      const completed = new Set(user.completedQuests || [])
      return (
        completed.has("q-react-1") &&
        completed.has("q-js-1") &&
        completed.has("q-dsa-1") &&
        completed.has("q-db-1")
      )
    },
  },
]

module.exports = {
  USERS,
  QUESTS,
  DAILY_CHALLENGE,
  BADGE_RULES,
}
