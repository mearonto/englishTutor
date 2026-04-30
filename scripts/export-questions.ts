/**
 * Export all built-in level data to JSON for DB seeding.
 * Run with: npx tsx scripts/export-questions.ts > server/seed/questions.json
 */
import { ASTRONOMY_LEVELS } from "../src/game/astronomyLevels";
import { CANADA_LEVELS } from "../src/game/canadaLevels";
import { MATH_KANGAROO_LEVELS } from "../src/game/mathKangarooLevels";

type RawLevel = {
  id: string;
  grade: number;
  type: string;
  word: string;
  prompt: string;
  choices: string[];
  answer: string;
  definition: string;
  contextSentence: string;
  hints: [string, string];
  coach: string;
};

function inferSubject(type: string): string {
  const astronomyTypes = new Set([
    "solar-system", "stars-galaxies", "space-exploration",
    "nasa-ksc", "earth-space", "fun-fact", "astronomy-vocab"
  ]);
  const kangarooTypes = new Set(["kangaroo-g5", "kangaroo-g6", "kangaroo-g7", "kangaroo-g8"]);
  const canadaTypes = new Set(["math", "science", "social-studies", "language-arts", "health"]);

  if (astronomyTypes.has(type)) return "astronomy";
  if (kangarooTypes.has(type)) return "math-kangaroo";
  if (canadaTypes.has(type)) return "canada";
  return "english";
}

function mapLevel(level: RawLevel) {
  return {
    subject: inferSubject(level.type),
    type: level.type,
    grade: level.grade,
    word: level.word,
    prompt: level.prompt,
    choices: level.choices,
    answer: level.answer,
    definition: level.definition,
    context_sentence: level.contextSentence,
    hints: level.hints,
    coach: level.coach,
    difficulty: 3,
    active: true,
  };
}

const all = [
  ...ASTRONOMY_LEVELS,
  ...CANADA_LEVELS,
  ...MATH_KANGAROO_LEVELS,
].map(mapLevel);

process.stdout.write(JSON.stringify(all, null, 2) + "\n");
console.error(`Exported ${all.length} questions.`);
