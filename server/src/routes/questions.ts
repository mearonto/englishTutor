import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

// ── GET /api/questions ─────────────────────────────────────────────────────
// Query params: subject, type, difficulty_min, difficulty_max, student_id,
//               search, active (default=true), limit, offset
router.get("/", async (req: Request, res: Response) => {
  const {
    subject, type, search,
    difficulty_min = "1", difficulty_max = "5",
    active = "true",
    limit = "500", offset = "0",
    student_id,
  } = req.query as Record<string, string>;

  const conditions: string[] = [
    "q.active = $1",
    "q.difficulty >= $2",
    "q.difficulty <= $3",
  ];
  const params: unknown[] = [active !== "false", Number(difficulty_min), Number(difficulty_max)];

  if (subject) {
    params.push(subject);
    conditions.push(`q.subject = $${params.length}`);
  }
  if (type) {
    params.push(type);
    conditions.push(`q.type = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    const n = params.length;
    conditions.push(`(q.word ILIKE $${n} OR q.prompt ILIKE $${n})`);
  }

  // If student_id provided and student has a custom pool, restrict to those questions
  let joinClause = "";
  if (student_id) {
    const { rows: poolRows } = await pool.query(
      "SELECT COUNT(*)::int AS count FROM student_questions WHERE student_id = $1 AND assigned = true",
      [Number(student_id)]
    );
    if (poolRows[0].count > 0) {
      joinClause = `JOIN student_questions sq ON sq.question_id = q.id AND sq.student_id = ${Number(student_id)} AND sq.assigned = true`;
    }
  }

  const where = conditions.join(" AND ");
  params.push(Number(limit), Number(offset));
  const limitN = params.length - 1;
  const offsetN = params.length;

  const sql = `
    SELECT q.* FROM questions q
    ${joinClause}
    WHERE ${where}
    ORDER BY q.subject, q.type, q.id
    LIMIT $${limitN} OFFSET $${offsetN}
  `;

  const { rows } = await pool.query(sql, params);

  // Also return total count (without limit)
  const countParams = params.slice(0, params.length - 2);
  const countSql = `SELECT COUNT(*)::int AS total FROM questions q ${joinClause} WHERE ${where}`;
  const { rows: countRows } = await pool.query(countSql, countParams);

  res.json({ questions: rows, total: countRows[0].total });
});

// ── GET /api/questions/:id ──────────────────────────────────────────────────
router.get("/:id", async (req: Request, res: Response) => {
  const { rows } = await pool.query("SELECT * FROM questions WHERE id = $1", [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

// ── POST /api/questions ─────────────────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  const {
    subject, type, grade = 0, word, prompt, choices, answer,
    definition, context_sentence = "", hints = ["", ""], coach = "",
    difficulty = 3, active = true,
  } = req.body;

  if (!subject || !type || !word || !prompt || !choices || !answer || !definition) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { rows } = await pool.query(
    `INSERT INTO questions
       (subject, type, grade, word, prompt, choices, answer,
        definition, context_sentence, hints, coach, difficulty, active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [
      subject, type, grade, word, prompt,
      JSON.stringify(choices), answer, definition,
      context_sentence, JSON.stringify(hints),
      coach, difficulty, active,
    ]
  );
  res.status(201).json(rows[0]);
});

// ── POST /api/questions/bulk ────────────────────────────────────────────────
router.post("/bulk", async (req: Request, res: Response) => {
  const questions = req.body as Record<string, unknown>[];
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Provide a non-empty array of questions" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const inserted: unknown[] = [];
    for (const q of questions) {
      const { rows } = await client.query(
        `INSERT INTO questions
           (subject, type, grade, word, prompt, choices, answer,
            definition, context_sentence, hints, coach, difficulty, active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         RETURNING *`,
        [
          q.subject, q.type, q.grade ?? 0, q.word, q.prompt,
          JSON.stringify(q.choices), q.answer, q.definition,
          q.context_sentence ?? "", JSON.stringify(q.hints ?? ["", ""]),
          q.coach ?? "", q.difficulty ?? 3, q.active ?? true,
        ]
      );
      inserted.push(rows[0]);
    }
    await client.query("COMMIT");
    res.status(201).json({ inserted: inserted.length, questions: inserted });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

// ── PUT /api/questions/:id ──────────────────────────────────────────────────
router.put("/:id", async (req: Request, res: Response) => {
  const allowed = [
    "subject", "type", "grade", "word", "prompt", "choices", "answer",
    "definition", "context_sentence", "hints", "coach", "difficulty", "active",
  ];
  const fields: string[] = [];
  const values: unknown[] = [];

  for (const key of allowed) {
    if (key in req.body) {
      values.push(
        key === "choices" || key === "hints" ? JSON.stringify(req.body[key]) : req.body[key]
      );
      fields.push(`${key} = $${values.length}`);
    }
  }

  if (fields.length === 0) return res.status(400).json({ error: "No valid fields to update" });

  values.push(req.params.id);
  const { rows } = await pool.query(
    `UPDATE questions SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

// ── DELETE /api/questions/:id — soft delete ─────────────────────────────────
router.delete("/:id", async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    "UPDATE questions SET active = false WHERE id = $1 RETURNING id",
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json({ deleted: rows[0].id });
});

export default router;
