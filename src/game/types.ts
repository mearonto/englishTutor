export type Grade = 3 | 4;

export type Subject = "english" | "astronomy" | "canada" | "math-kangaroo" | "leon";

export type SkillType =
  | "spelling"
  | "homophone"
  | "prefix"
  | "suffix"
  | "multiple-meaning"
  | "word-relationships"
  | "compound-word"
  | "context-clues"
  | "solar-system"
  | "stars-galaxies"
  | "space-exploration"
  | "nasa-ksc"
  | "earth-space"
  | "fun-fact"
  | "astronomy-vocab"
  | "kangaroo-g5"
  | "kangaroo-g6"
  | "kangaroo-g7"
  | "kangaroo-g8"
  | "math"
  | "science"
  | "social-studies"
  | "language-arts"
  | "health";

export interface Level {
  id: string;
  grade: number;
  type: SkillType;
  word: string;
  prompt: string;
  choices: string[];
  answer: string;
  definition: string;
  contextSentence: string;
  hints: [string, string];
  coach: string;
  imageUrl?: string;
}

export interface PlayerState {
  xp: number;
  stars: number;
  tokens: number;
  streak: number;
  gradeUnlocked: Grade;
  mastery3: Record<string, number>;
  learned: Record<string, number>;
  inventory: string[];
  subject: Subject;
  astronomyCategories: string[];
  canadaCategories: string[];
  mathKangarooCategories: string[];
}

export interface ShopItem {
  id: string;
  label: string;
  cost: number;
}

export interface Reward {
  xp: number;
  stars: number;
  tokens: number;
}
