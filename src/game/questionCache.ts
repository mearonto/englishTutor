/**
 * Async question pool cache.
 * Fetches from the API and stores results so pickNextLevel() can stay synchronous.
 * Falls back to the static level functions if the API is unavailable.
 */
import type { Level, SkillType } from "./types";
import { getAstronomyLevels, getCanadaLevels, getMathKangarooLevels, getLevels } from "./levels";

// Module-level cache
let cachedPool: Level[] = [];
let cacheReady = false;

/** Map API snake_case row to the Level interface */
function rowToLevel(row: Record<string, unknown>): Level {
  return {
    id: String(row.id),
    grade: Number(row.grade ?? 0),
    type: String(row.type) as SkillType,
    word: String(row.word),
    prompt: String(row.prompt),
    choices: Array.isArray(row.choices)
      ? (row.choices as string[])
      : JSON.parse(String(row.choices)),
    answer: String(row.answer),
    definition: String(row.definition),
    contextSentence: String(row.context_sentence ?? ""),
    hints: (() => {
      const h = Array.isArray(row.hints)
        ? (row.hints as string[])
        : JSON.parse(String(row.hints ?? '["",""]'));
      return [String(h[0] ?? ""), String(h[1] ?? "")] as [string, string];
    })(),
    coach: String(row.coach ?? ""),
  };
}

/**
 * Fetch the question pool for a student + subject from the API.
 * Populates the cache. Falls back to static data on error.
 */
export async function loadQuestionPool(
  studentId: number | null,
  subject: string,
  categories: string[]
): Promise<void> {
  cacheReady = false;

  try {
    const params: Record<string, string> = {
      subject,
      limit: "2000",
      active: "true",
    };
    if (studentId && studentId > 0) {
      params.student_id = String(studentId);
    }
    // Send categories as comma-separated type filter if narrowed
    if (categories.length === 1) {
      params.type = categories[0];
    }

    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`/api/questions?${qs}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = (await res.json()) as { questions: Record<string, unknown>[] };
    let levels = data.questions.map(rowToLevel);

    // Client-side multi-category filter (API only supports single type param)
    if (categories.length > 1) {
      const catSet = new Set(categories);
      levels = levels.filter((l) => catSet.has(l.type));
    }

    cachedPool = levels;
  } catch {
    // API unavailable — fall back to static data
    console.warn("[questionCache] API unavailable, falling back to static levels");
    cachedPool = staticPool(subject, categories);
  }

  cacheReady = true;
}

/** Returns the cached pool (or empty array if not ready) */
export function getCachedPool(): Level[] {
  return cachedPool;
}

export function isCacheReady(): boolean {
  return cacheReady;
}

/** Invalidate cache (forces next pickNextLevel to use fallback until re-fetched) */
export function invalidateCache(): void {
  cacheReady = false;
  cachedPool = [];
}

function staticPool(subject: string, categories: string[]): Level[] {
  let pool: Level[];
  if (subject === "astronomy") {
    pool = getAstronomyLevels();
    if (categories.length > 0) {
      const s = new Set(categories);
      const filtered = pool.filter((l) => s.has(l.type));
      if (filtered.length) pool = filtered;
    }
  } else if (subject === "canada") {
    pool = getCanadaLevels();
    if (categories.length > 0) {
      const s = new Set(categories);
      const filtered = pool.filter((l) => s.has(l.type));
      if (filtered.length) pool = filtered;
    }
  } else if (subject === "math-kangaroo") {
    pool = getMathKangarooLevels();
    if (categories.length > 0) {
      const s = new Set(categories);
      const filtered = pool.filter((l) => s.has(l.type));
      if (filtered.length) pool = filtered;
    }
  } else {
    pool = getLevels();
  }
  return pool;
}
