import { getCustomLevelsCount, getLevels, SHOP_ITEMS } from "./levels";
import { clearState, defaultState, loadState, saveState } from "./storage";
import type { Level, PlayerState, Reward } from "./types";

type Listener = (state: PlayerState) => void;

let state: PlayerState = loadState();
const listeners = new Set<Listener>();

function emit(): void {
  saveState(state);
  for (const listener of listeners) {
    listener(state);
  }
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

export function getState(): PlayerState {
  return state;
}

export function masteryPercent(): number {
  const grade3 = getLevels().filter((level) => level.grade === 3).map((level) => level.id);
  if (!grade3.length) {
    return 0;
  }
  const mastered = grade3.filter((id) => (state.mastery3[id] ?? 0) >= 2).length;
  return Math.round((mastered / grade3.length) * 100);
}

export function zoneLabel(): string {
  if (state.gradeUnlocked === 3) {
    return "Grade 3 Trail: master homophones and Canadian spellings to unlock Grade 4.";
  }
  return "Grade 4 Ridge unlocked: prefixes, suffixes, and multiple-meaning words are live.";
}

export function maybeUnlockGrade4(): void {
  if (masteryPercent() >= 80) {
    state = { ...state, gradeUnlocked: 4 };
  }
}

function availableLevels(): Level[] {
  const unlocked = getLevels().filter((level) => level.grade <= state.gradeUnlocked);
  return unlocked.sort((a, b) => (state.learned[a.id] ?? 0) - (state.learned[b.id] ?? 0));
}

export function pickNextLevel(): Level {
  maybeUnlockGrade4();
  const pool = availableLevels();
  const maxWindow = Math.min(pool.length, 4);
  return pool[Math.floor(Math.random() * maxWindow)];
}

export function rewardForAttempt(correct: boolean, triesUsed: number): Reward {
  if (!correct) {
    return { xp: 1, stars: 0, tokens: 0 };
  }
  if (triesUsed === 1) {
    return { xp: 10, stars: 3, tokens: 2 };
  }
  if (triesUsed === 2) {
    return { xp: 7, stars: 2, tokens: 1 };
  }
  return { xp: 5, stars: 1, tokens: 1 };
}

export function applyCorrect(level: Level, tries: number): Reward {
  const reward = rewardForAttempt(true, tries);
  const mastery3 = { ...state.mastery3 };
  if (level.grade === 3) {
    mastery3[level.id] = (mastery3[level.id] ?? 0) + 1;
  }

  state = {
    ...state,
    xp: state.xp + reward.xp,
    stars: state.stars + reward.stars,
    tokens: state.tokens + reward.tokens,
    streak: state.streak + 1,
    mastery3,
    learned: {
      ...state.learned,
      [level.id]: (state.learned[level.id] ?? 0) + 1
    }
  };

  maybeUnlockGrade4();
  emit();
  return reward;
}

export function applyFailedRound(level: Level, tries: number): Reward {
  const reward = rewardForAttempt(false, tries);
  state = {
    ...state,
    xp: state.xp + reward.xp,
    streak: 0,
    learned: {
      ...state.learned,
      [level.id]: (state.learned[level.id] ?? 0) + 1
    }
  };
  emit();
  return reward;
}

export function breakStreak(): void {
  state = { ...state, streak: 0 };
  emit();
}

export function purchase(itemId: string): { ok: boolean; message: string } {
  const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
  if (!item) {
    return { ok: false, message: "Item not found." };
  }
  if (state.inventory.includes(itemId)) {
    return { ok: false, message: "Already owned." };
  }
  if (state.tokens < item.cost) {
    return { ok: false, message: "Not enough tokens yet." };
  }

  state = {
    ...state,
    tokens: state.tokens - item.cost,
    inventory: [...state.inventory, itemId]
  };
  emit();
  return { ok: true, message: `Purchased ${item.label}.` };
}

export function resetAll(): void {
  clearState();
  state = defaultState();
  emit();
}

export function refreshAfterContentImport(): void {
  maybeUnlockGrade4();
  emit();
}

export function buildReport() {
  const levels = getLevels();
  return {
    generatedAt: new Date().toISOString(),
    masteryPercent: masteryPercent(),
    totalLevelsLoaded: levels.length,
    customLevelsLoaded: getCustomLevelsCount(),
    stats: {
      xp: state.xp,
      stars: state.stars,
      tokens: state.tokens,
      streak: state.streak,
      gradeUnlocked: state.gradeUnlocked
    },
    levelProgress: levels.map((level) => ({
      id: level.id,
      grade: level.grade,
      type: level.type,
      word: level.word,
      attempts: state.learned[level.id] ?? 0,
      masteryHits: state.mastery3[level.id] ?? 0
    }))
  };
}
