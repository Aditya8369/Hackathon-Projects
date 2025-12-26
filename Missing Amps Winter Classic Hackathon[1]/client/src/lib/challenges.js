// Optional client-side fallback challenges (used if backend is unavailable)
export const localChallenges = [
  {
    id: "sum-array",
    title: "Sum Array",
    prompt: "Given an array of numbers, return the sum of all elements.",
    signature: "function sumArray(nums) { /* your code */ }",
    starterCode: "function sumArray(nums){\n  // TODO: sum values\n}\nmodule.exports = sumArray;",
    tests: [
      { input: [[1,2,3]], output: 6 },
      { input: [[10,-5,5]], output: 10 },
      { input: [[]], output: 0 }
    ],
    points: 100
  },
  {
    id: "is-anagram",
    title: "Is Anagram",
    prompt: "Check if two strings are anagrams (case-insensitive, ignore spaces).",
    signature: "function isAnagram(a,b) { /* your code */ }",
    starterCode: "function isAnagram(a,b){\n  // TODO: check anagram\n}\nmodule.exports = isAnagram;",
    tests: [
      { input: ["listen","silent"], output: true },
      { input: ["rail safety","fairy tales"], output: true },
      { input: ["hello","world"], output: false }
    ],
    points: 120
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz Range",
    prompt: "Return an array for numbers 1..n with Fizz/Buzz/FizzBuzz rules.",
    signature: "function fizzBuzz(n) { /* your code */ }",
    starterCode: "function fizzBuzz(n){\n  // TODO: classic fizzbuzz\n}\nmodule.exports = fizzBuzz;",
    tests: [
      { input: [5], output: ["1","2","Fizz","4","Buzz"] },
      { input: [1], output: ["1"] },
      { input: [15], output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"] }
    ],
    points: 80
  }
];