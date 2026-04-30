import fs from "fs";
import path from "path";
import { pool } from "./db";

interface SeedQuestion {
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

export async function seedQuestions() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM questions");
  if (rows[0].count > 0) {
    console.log(`[seed] questions table already has ${rows[0].count} rows — skipping`);
    return;
  }

  const seedFile = path.join(__dirname, "..", "..", "seed", "questions.json");
  if (!fs.existsSync(seedFile)) {
    console.warn("[seed] questions.json not found — skipping question seed");
    return;
  }

  const questions: SeedQuestion[] = JSON.parse(fs.readFileSync(seedFile, "utf8"));
  console.log(`[seed] Inserting ${questions.length} questions...`);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const q of questions) {
      await client.query(
        `INSERT INTO questions
           (subject, type, grade, word, prompt, choices, answer,
            definition, context_sentence, hints, coach, difficulty, active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          q.subject, q.type, q.grade, q.word, q.prompt,
          JSON.stringify(q.choices), q.answer, q.definition,
          q.context_sentence, JSON.stringify(q.hints),
          q.coach, q.difficulty, q.active,
        ]
      );
    }
    await client.query("COMMIT");
    console.log(`[seed] ✓ Inserted ${questions.length} questions`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function seedStudents() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM students");
  if (rows[0].count > 0) {
    console.log(`[seed] students table already has ${rows[0].count} rows — skipping`);
    return;
  }

  const defaultStudents = ["Matthew", "Leon"];
  for (const name of defaultStudents) {
    await pool.query("INSERT INTO students (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", [name]);
  }
  console.log(`[seed] ✓ Created default students: ${defaultStudents.join(", ")}`);
}
