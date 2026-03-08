import type { Level, ShopItem, SkillType } from "./types";

const CUSTOM_LEVELS_KEY = "word-quest-custom-levels-v1";

export const SHOP_ITEMS: ShopItem[] = [
  { id: "hat", label: "Maple Explorer Hat", cost: 20 },
  { id: "pet", label: "Beaver Companion", cost: 35 },
  { id: "boost", label: "Hint Compass (x3)", cost: 15 }
];

export const BASE_LEVELS: Level[] = [
  {
    id: "g3-spelling-colour",
    grade: 3,
    type: "spelling",
    word: "colour",
    prompt: "Spell the Canadian word for this clue: The sky has a bright blue ____. ",
    choices: ["color", "colour", "collour"],
    answer: "colour",
    definition: "how something looks, like red or blue",
    contextSentence: "My favourite colour is green.",
    hints: ["Canadian spelling uses -our here.", "Look for the word ending with -our."],
    coach: "In Canada, many words keep the -our ending: colour, favourite, neighbour."
  },
  {
    id: "g3-spelling-centre",
    grade: 3,
    type: "spelling",
    word: "centre",
    prompt: "Choose the correct Canadian spelling: We met at the town ____. ",
    choices: ["center", "centre", "centr"],
    answer: "centre",
    definition: "the middle point",
    contextSentence: "The stage is in the centre of the room.",
    hints: ["Canadian spelling often uses -re.", "Think: centre, metre, theatre."],
    coach: "Canadian English uses centre, while American English often uses center."
  },
  {
    id: "g3-homophone-their",
    grade: 3,
    type: "homophone",
    word: "their",
    prompt: "Pick the right word: That is ____ backpack by the canoe.",
    choices: ["there", "their", "they're"],
    answer: "their",
    definition: "belonging to them",
    contextSentence: "Their dog is very friendly.",
    hints: ["This sentence needs an ownership word.", "Try: belonging to them backpack."],
    coach: "Their = ownership. There = place. They're = they are."
  },
  {
    id: "g3-homophone-theyre",
    grade: 3,
    type: "homophone",
    word: "they're",
    prompt: "Pick the right word: ____ going to the skating rink.",
    choices: ["There", "Their", "They're"],
    answer: "They're",
    definition: "short form of they are",
    contextSentence: "They're ready for class.",
    hints: ["Expand it: they are going.", "Look for the apostrophe."],
    coach: "They're is a contraction of they are."
  },
  {
    id: "g4-prefix-preview",
    grade: 4,
    type: "prefix",
    word: "preview",
    prompt: "Which word means to view something before it happens?",
    choices: ["review", "preview", "viewer"],
    answer: "preview",
    definition: "to look at something before the full event",
    contextSentence: "We watched a preview of the school play.",
    hints: ["Prefix pre- means before.", "Find the word with pre-."],
    coach: "pre- = before. preview = view before."
  },
  {
    id: "g4-suffix-careless",
    grade: 4,
    type: "suffix",
    word: "careless",
    prompt: "Fill in the blank: Leaving your lunch outside is ____. ",
    choices: ["careful", "careless", "carely"],
    answer: "careless",
    definition: "not careful",
    contextSentence: "A careless choice can cause a mistake.",
    hints: ["Suffix -less means without.", "Without care = ?"],
    coach: "-less means without. careless = without care."
  },
  {
    id: "g4-multiple-meaning-bark",
    grade: 4,
    type: "multiple-meaning",
    word: "bark",
    prompt: "Choose the sentence where bark means tree covering.",
    choices: [
      "The bark of the tree feels rough.",
      "Our dog will bark at strangers.",
      "Bark your command loudly."
    ],
    answer: "The bark of the tree feels rough.",
    definition: "outer covering of a tree (or a dog sound)",
    contextSentence: "The bark protected the trunk.",
    hints: ["Look for tree clues.", "Dog bark is a sound, not a covering."],
    coach: "Some words have more than one meaning. Use context clues in the sentence."
  },
  {
    id: "g4-spelling-travelled",
    grade: 4,
    type: "spelling",
    word: "travelled",
    prompt: "Choose the Canadian spelling: We ____ across Ontario last summer.",
    choices: ["traveled", "travelled", "traveld"],
    answer: "travelled",
    definition: "went from place to place",
    contextSentence: "We travelled by train.",
    hints: ["Canadian spelling often doubles the l.", "Look for two l letters."],
    coach: "In Canadian English, travelled usually uses double l."
  }
];

let customLevels: Level[] = loadCustomLevels();

export function getLevels(): Level[] {
  return [...BASE_LEVELS, ...customLevels];
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
  const validTypes: SkillType[] = ["spelling", "homophone", "prefix", "suffix", "multiple-meaning"];
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
