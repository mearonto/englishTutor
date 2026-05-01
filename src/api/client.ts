/**
 * Typed API client for the Word Quest backend.
 * All calls are fire-and-forget safe — callers handle errors.
 */

const BASE = "/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── Student types ────────────────────────────────────────────────────────────
export interface ApiStudent {
  id: number;
  name: string;
  grade_unlocked: number;
  xp: number;
  stars: number;
  tokens: number;
  streak: number;
  mastery3: Record<string, number>;
  learned: Record<string, number>;
  inventory: string[];
  subject: string;
  astronomy_categories: string[];
  canada_categories: string[];
  math_kangaroo_categories: string[];
  difficulty_min: number;
  difficulty_max: number;
  created_at: string;
}

export interface ApiQuestion {
  id: number;
  subject: string;
  type: string;
  grade: number;
  word: string;
  prompt: string;
  choices: string[];
  answer: string;
  definition: string;
  context_sentence: string;
  hints: [string, string];
  coach: string;
  difficulty: number;
  active: boolean;
}

// ── Students ─────────────────────────────────────────────────────────────────
export const studentsApi = {
  list(): Promise<ApiStudent[]> {
    return apiFetch("/students");
  },

  get(id: number): Promise<ApiStudent> {
    return apiFetch(`/students/${id}`);
  },

  create(name: string): Promise<ApiStudent> {
    return apiFetch("/students", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  update(id: number, data: Partial<ApiStudent>): Promise<ApiStudent> {
    return apiFetch(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  resetProgress(id: number): Promise<ApiStudent> {
    return apiFetch(`/students/${id}/reset`, { method: "POST" });
  },

  remove(id: number): Promise<{ deleted: unknown }> {
    return apiFetch(`/students/${id}`, { method: "DELETE" });
  },
};

// ── Questions ─────────────────────────────────────────────────────────────────
export interface QuestionListResult {
  questions: ApiQuestion[];
  total: number;
}

export const questionsApi = {
  list(params?: Record<string, string>): Promise<QuestionListResult> {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch(`/questions${qs}`);
  },

  get(id: number): Promise<ApiQuestion> {
    return apiFetch(`/questions/${id}`);
  },

  create(q: Partial<ApiQuestion>): Promise<ApiQuestion> {
    return apiFetch("/questions", { method: "POST", body: JSON.stringify(q) });
  },

  update(id: number, q: Partial<ApiQuestion>): Promise<ApiQuestion> {
    return apiFetch(`/questions/${id}`, { method: "PUT", body: JSON.stringify(q) });
  },

  remove(id: number): Promise<{ deleted: number }> {
    return apiFetch(`/questions/${id}`, { method: "DELETE" });
  },

  bulk(questions: Partial<ApiQuestion>[]): Promise<{ inserted: number }> {
    return apiFetch("/questions/bulk", { method: "POST", body: JSON.stringify(questions) });
  },
};

// ── Health check ─────────────────────────────────────────────────────────────
export async function isApiAvailable(): Promise<boolean> {
  try {
    await apiFetch<{ status: string }>("/health");
    return true;
  } catch {
    return false;
  }
}
