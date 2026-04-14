import { replaceCustomLevels } from "./levels";
import type { Level, SkillType } from "./types";

const VALID_TYPES: SkillType[] = [
  "spelling",
  "homophone",
  "prefix",
  "suffix",
  "multiple-meaning",
  "word-relationships",
  "compound-word",
  "context-clues"
];

type ImportResult = {
  ok: boolean;
  count: number;
  message: string;
};

export function importLevelsFromJson(text: string): ImportResult {
  try {
    const raw = JSON.parse(text);
    if (!Array.isArray(raw)) {
      return { ok: false, count: 0, message: "JSON must be an array of level objects." };
    }
    const levels = raw.map((entry, i) => normalizeRow(entry as Record<string, string>, i)).filter(Boolean) as Level[];
    if (!levels.length) {
      return { ok: false, count: 0, message: "No valid levels were found in JSON." };
    }
    replaceCustomLevels(levels);
    return { ok: true, count: levels.length, message: `Imported ${levels.length} custom levels from JSON.` };
  } catch {
    return { ok: false, count: 0, message: "Invalid JSON file." };
  }
}

export function importLevelsFromCsv(text: string): ImportResult {
  const rows = parseCsv(text);
  if (!rows.length) {
    return { ok: false, count: 0, message: "CSV has no rows." };
  }
  const headers = rows[0].map((value) => value.trim());
  const body = rows.slice(1);

  const levels: Level[] = [];
  body.forEach((row, i) => {
    const entry: Record<string, string> = {};
    headers.forEach((header, idx) => {
      entry[header] = row[idx] ?? "";
    });
    const normalized = normalizeRow(entry, i);
    if (normalized) {
      levels.push(normalized);
    }
  });

  if (!levels.length) {
    return { ok: false, count: 0, message: "No valid levels were found in CSV." };
  }

  replaceCustomLevels(levels);
  return { ok: true, count: levels.length, message: `Imported ${levels.length} custom levels from CSV.` };
}

function normalizeRow(entry: Record<string, unknown>, index: number): Level | null {
  const word = toStr(entry.word);
  const prompt = toStr(entry.prompt);
  if (!word || !prompt) {
    return null;
  }

  const gradeRaw = Number(toStr(entry.grade));
  const grade = gradeRaw === 4 ? 4 : 3;
  const typeRaw = toStr(entry.type) as SkillType;
  const type = VALID_TYPES.includes(typeRaw) ? typeRaw : "spelling";

  const choicesPipe = toStr(entry.choices)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
  const choicesCols = [toStr(entry.choice1), toStr(entry.choice2), toStr(entry.choice3)].filter(Boolean);
  const choices = choicesPipe.length ? choicesPipe : choicesCols;
  if (!choices.length) {
    choices.push(word, `${word}x`, `${word}y`);
  }

  const answer = toStr(entry.answer) || choices[0];
  if (!choices.includes(answer)) {
    choices.push(answer);
  }

  const hint1 = toStr(entry.hint1) || "Look for context clues.";
  const hint2 = toStr(entry.hint2) || "Break the word into parts.";

  return {
    id: toStr(entry.id) || `custom-${Date.now()}-${index}`,
    grade,
    type,
    word,
    prompt,
    choices,
    answer,
    definition: toStr(entry.definition) || "Teacher supplied word.",
    contextSentence: toStr(entry.contextSentence) || "Use this word in a sentence.",
    hints: [hint1, hint2],
    coach: toStr(entry.coach) || "Try using the sentence clues and meaning clues together."
  };
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") {
        i += 1;
      }
      row.push(field);
      if (row.some((col) => col.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      field = "";
      continue;
    }

    field += ch;
  }

  if (field.length || row.length) {
    row.push(field);
    if (row.some((col) => col.trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function toStr(value: unknown): string {
  return String(value ?? "").trim();
}

export function reportToCsv(report: ReportShape): string {
  const lines: string[] = [];
  lines.push("metric,value");
  lines.push(`generatedAt,${escapeCsv(report.generatedAt)}`);
  lines.push(`xp,${report.stats.xp}`);
  lines.push(`stars,${report.stats.stars}`);
  lines.push(`tokens,${report.stats.tokens}`);
  lines.push(`streak,${report.stats.streak}`);
  lines.push(`gradeUnlocked,${report.stats.gradeUnlocked}`);
  lines.push(`masteryPercent,${report.masteryPercent}`);
  lines.push(`totalLevelsLoaded,${report.totalLevelsLoaded}`);
  lines.push(`customLevelsLoaded,${report.customLevelsLoaded}`);
  lines.push("");
  lines.push("levelId,grade,type,word,attempts,masteryHits");
  report.levelProgress.forEach((entry) => {
    lines.push(
      [
        entry.id,
        String(entry.grade),
        entry.type,
        entry.word,
        String(entry.attempts),
        String(entry.masteryHits)
      ]
        .map(escapeCsv)
        .join(",")
    );
  });
  return lines.join("\n");
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export type ReportShape = {
  generatedAt: string;
  masteryPercent: number;
  totalLevelsLoaded: number;
  customLevelsLoaded: number;
  stats: {
    xp: number;
    stars: number;
    tokens: number;
    streak: number;
    gradeUnlocked: 3 | 4;
  };
  levelProgress: Array<{
    id: string;
    grade: number;
    type: string;
    word: string;
    attempts: number;
    masteryHits: number;
  }>;
};
