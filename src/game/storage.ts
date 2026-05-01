import type { PlayerState } from "./types";

const STORAGE_KEY = "word-quest-react-save-v1";

export function defaultState(): PlayerState {
  return {
    xp: 0,
    stars: 0,
    tokens: 0,
    streak: 0,
    gradeUnlocked: 3,
    mastery3: {},
    learned: {},
    inventory: [],
    subject: "english",
    astronomyCategories: [],
    canadaCategories: [],
    mathKangarooCategories: []
  };
}

export function loadState(): PlayerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState();
    }
    return { ...defaultState(), ...JSON.parse(raw) } as PlayerState;
  } catch {
    return defaultState();
  }
}

export function saveState(state: PlayerState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
