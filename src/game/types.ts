export type Grade = 3 | 4;

export type SkillType = "spelling" | "homophone" | "prefix" | "suffix" | "multiple-meaning";

export interface Level {
  id: string;
  grade: Grade;
  type: SkillType;
  word: string;
  prompt: string;
  choices: string[];
  answer: string;
  definition: string;
  contextSentence: string;
  hints: [string, string];
  coach: string;
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
