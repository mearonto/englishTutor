import { ASTRONOMY_CATEGORY_LABELS, ASTRONOMY_LEVELS } from "./astronomyLevels";
export { ASTRONOMY_CATEGORY_LABELS };
import { CANADA_CATEGORY_LABELS, CANADA_LEVELS } from "./canadaLevels";
export { CANADA_CATEGORY_LABELS };
import { MATH_KANGAROO_CATEGORY_LABELS, MATH_KANGAROO_LEVELS } from "./mathKangarooLevels";
export { MATH_KANGAROO_CATEGORY_LABELS };

export const LEON_CATEGORY_LABELS: Record<string, string> = {
  all: "All Types",
  addition: "Addition",
  subtraction: "Subtraction",
  multiply: "Multiplication",
};
import type { Level, ShopItem, SkillType } from "./types";

const CUSTOM_LEVELS_KEY = "word-quest-custom-levels-v1";

export const SHOP_ITEMS: ShopItem[] = [
  { id: "hat", label: "Maple Explorer Hat", cost: 20 },
  { id: "pet", label: "Beaver Companion", cost: 35 },
  { id: "boost", label: "Hint Compass (x3)", cost: 15 }
];

// English vocabulary questions removed — use custom word packs to import your own.
export const BASE_LEVELS: Level[] = [];

let customLevels: Level[] = loadCustomLevels();

export function getLevels(): Level[] {
  return [...BASE_LEVELS, ...customLevels];
}

export function getAstronomyLevels(): Level[] {
  return ASTRONOMY_LEVELS;
}

export function getCanadaLevels(): Level[] {
  return CANADA_LEVELS;
}

export function getMathKangarooLevels(): Level[] {
  return MATH_KANGAROO_LEVELS;
}

export function getCustomLevelsCount(): number {
  return customLevels.length;
}

export function replaceCustomLevels(levels: Level[]): void {
  customLevels = dedupeById(levels);
  localStorage.setItem(CUSTOM_LEVELS_KEY, JSON.stringify(customLevels));
}

export function clearCustomLevels(): void {
  customLevels = [];
  localStorage.removeItem(CUSTOM_LEVELS_KEY);
}

function loadCustomLevels(): Level[] {
  try {
    const raw = localStorage.getItem(CUSTOM_LEVELS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return dedupeById(parsed.filter(isLevelLike).map(normalizeLevelLike));
  } catch {
    return [];
  }
}

function dedupeById(levels: Level[]): Level[] {
  const map = new Map<string, Level>();
  levels.forEach((level) => map.set(level.id, level));
  return Array.from(map.values());
}

function isLevelLike(value: unknown): value is Partial<Level> {
  return typeof value === "object" && value !== null;
}

function normalizeLevelLike(partial: Partial<Level>, index = 0): Level {
  const fallbackWord = String(partial.word ?? `word-${index + 1}`);
  const id = String(partial.id ?? `custom-${Date.now()}-${index}`);
  const grade = partial.grade === 4 ? 4 : 3;
  const validTypes: SkillType[] = [
    "spelling",
    "homophone",
    "prefix",
    "suffix",
    "multiple-meaning",
    "word-relationships",
    "compound-word",
    "context-clues"
  ];
  const type = validTypes.includes(partial.type as SkillType)
    ? (partial.type as SkillType)
    : "spelling";

  const choices = Array.isArray(partial.choices)
    ? partial.choices.map(String).filter(Boolean)
    : [fallbackWord, `${fallbackWord}x`, `${fallbackWord}y`];
  const answer = String(partial.answer ?? choices[0] ?? fallbackWord);
  const mergedChoices = choices.includes(answer) ? choices : [...choices, answer];
  const hints: [string, string] =
    Array.isArray(partial.hints) && partial.hints.length >= 2
      ? [String(partial.hints[0]), String(partial.hints[1])]
      : ["Look for context clues.", "Break the word into parts."];

  return {
    id,
    grade,
    type,
    word: fallbackWord,
    prompt: String(partial.prompt ?? `Choose the best option for ${fallbackWord}.`),
    choices: mergedChoices,
    answer,
    definition: String(partial.definition ?? "Teacher supplied word."),
    contextSentence: String(partial.contextSentence ?? "Use this word in a sentence."),
    hints,
    coach: String(partial.coach ?? "Think about meaning and sentence clues before retrying.")
  };
}
