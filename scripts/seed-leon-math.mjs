/**
 * Seed script: insert Leon's math questions into the DB.
 * Run with:  node scripts/seed-leon-math.mjs
 * Requires the Express API server to be running on port 3001.
 */

const API = "http://localhost:3001/api/questions/bulk";

// ── helpers ──────────────────────────────────────────────────────────────────

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Generate 4 distinct choices with the correct answer included. */
function choices4(answer, min = 0, max = 100) {
  const set = new Set([answer]);
  const offsets = shuffle([-1, 1, -2, 2, -10, 10, -11, 11, 9, -9, 3, -3]);
  for (const d of offsets) {
    const c = answer + d;
    if (c >= min && c <= max && c !== answer) set.add(c);
    if (set.size === 4) break;
  }
  // fallback if not enough distinct values
  for (let v = min; v <= max && set.size < 4; v++) {
    set.add(v);
  }
  return shuffle([...set].slice(0, 4).map(String));
}

// ── 小九九 — multiplication tables 1×1 … 9×9 (45 unique pairs) ───────────────

const multiplyQuestions = [];

for (let a = 1; a <= 9; a++) {
  for (let b = a; b <= 9; b++) {
    const answer = a * b;
    // difficulty: 1 for ×1/×2, 2 for ×3–×5, 3 for ×6–×9
    const maxFactor = Math.max(a, b);
    const difficulty = maxFactor <= 2 ? 1 : maxFactor <= 5 ? 2 : 3;

    multiplyQuestions.push({
      subject: "leon",
      type: "multiply",
      grade: 2,
      word: String(answer),
      prompt: `${a} × ${b} = ?`,
      choices: choices4(answer, 1, 81),
      answer: String(answer),
      definition: `${a} multiplied by ${b} equals ${answer}.`,
      context_sentence: `In the times table: ${a} × ${b} = ${answer}.`,
      hints: [
        `Count ${a} groups of ${b}.`,
        `${a} × ${b} = ${answer}`,
      ],
      coach: `Correct! ${a} × ${b} = ${answer}.`,
      difficulty,
      active: true,
    });
  }
}

// ── 100以内加减法 — addition & subtraction within 100 ──────────────────────────

const addSubQuestions = [];

// Easy (difficulty 1): single-digit + single-digit, single-digit subtraction
const easyPairs = [
  [3, 5, "+"], [7, 2, "+"], [4, 6, "+"], [8, 1, "+"], [5, 5, "+"],
  [9, 3, "+"], [6, 4, "+"], [2, 8, "+"], [1, 9, "+"], [4, 4, "+"],
  [9, 6, "-"], [8, 3, "-"], [7, 4, "-"], [10, 5, "-"], [6, 2, "-"],
];

for (const [a, b, op] of easyPairs) {
  const answer = op === "+" ? a + b : a - b;
  addSubQuestions.push({
    subject: "leon",
    type: op === "+" ? "addition" : "subtraction",
    grade: 1,
    word: String(answer),
    prompt: `${a} ${op} ${b} = ?`,
    choices: choices4(answer, 0, 20),
    answer: String(answer),
    definition: op === "+" ? `${a} plus ${b} equals ${answer}.` : `${a} minus ${b} equals ${answer}.`,
    context_sentence: `${a} ${op} ${b} = ${answer}`,
    hints: [
      op === "+" ? `Start at ${a} and count up ${b}.` : `Start at ${a} and count down ${b}.`,
      `The answer is ${answer}.`,
    ],
    coach: `Correct! ${a} ${op} ${b} = ${answer}.`,
    difficulty: 1,
    active: true,
  });
}

// Medium (difficulty 2): two-digit ± one-digit, no regrouping complexity
const mediumPairs = [
  [23, 6, "+"], [45, 3, "+"], [31, 8, "+"], [52, 7, "+"], [64, 5, "+"],
  [17, 4, "+"], [38, 9, "+"], [26, 6, "+"], [43, 7, "+"], [55, 4, "+"],
  [29, 5, "-"], [47, 8, "-"], [53, 6, "-"], [66, 9, "-"], [72, 4, "-"],
  [38, 7, "-"], [84, 6, "-"], [91, 3, "-"], [45, 8, "-"], [67, 5, "-"],
];

for (const [a, b, op] of mediumPairs) {
  const answer = op === "+" ? a + b : a - b;
  addSubQuestions.push({
    subject: "leon",
    type: op === "+" ? "addition" : "subtraction",
    grade: 1,
    word: String(answer),
    prompt: `${a} ${op} ${b} = ?`,
    choices: choices4(answer, 0, 100),
    answer: String(answer),
    definition: op === "+" ? `${a} plus ${b} equals ${answer}.` : `${a} minus ${b} equals ${answer}.`,
    context_sentence: `${a} ${op} ${b} = ${answer}`,
    hints: [
      `Look at the ones digit first.`,
      `${a} ${op} ${b} = ${answer}`,
    ],
    coach: `Correct! ${a} ${op} ${b} = ${answer}.`,
    difficulty: 2,
    active: true,
  });
}

// Hard (difficulty 3): two-digit ± two-digit, with regrouping
const hardPairs = [
  [34, 47, "+"], [56, 38, "+"], [27, 64, "+"], [48, 35, "+"], [19, 73, "+"],
  [62, 29, "+"], [45, 36, "+"], [53, 28, "+"], [77, 16, "+"], [38, 54, "+"],
  [82, 37, "-"], [91, 45, "-"], [76, 29, "-"], [63, 38, "-"], [54, 27, "-"],
  [85, 49, "-"], [70, 34, "-"], [93, 56, "-"], [67, 28, "-"], [80, 43, "-"],
];

for (const [a, b, op] of hardPairs) {
  const answer = op === "+" ? a + b : a - b;
  addSubQuestions.push({
    subject: "leon",
    type: op === "+" ? "addition" : "subtraction",
    grade: 2,
    word: String(answer),
    prompt: `${a} ${op} ${b} = ?`,
    choices: choices4(answer, 0, 100),
    answer: String(answer),
    definition: op === "+" ? `${a} plus ${b} equals ${answer}.` : `${a} minus ${b} equals ${answer}.`,
    context_sentence: `${a} ${op} ${b} = ${answer}`,
    hints: [
      `Break it into tens and ones.`,
      `${a} ${op} ${b} = ${answer}`,
    ],
    coach: `Correct! ${a} ${op} ${b} = ${answer}.`,
    difficulty: 3,
    active: true,
  });
}

// ── send to API ───────────────────────────────────────────────────────────────

const all = [...multiplyQuestions, ...addSubQuestions];
console.log(`Inserting ${all.length} questions (${multiplyQuestions.length} multiplication + ${addSubQuestions.length} add/sub)…`);

const res = await fetch(API, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(all),
});

if (!res.ok) {
  const text = await res.text();
  console.error("Error:", res.status, text);
  process.exit(1);
}

const data = await res.json();
console.log(`Done! Inserted ${data.inserted} questions.`);
