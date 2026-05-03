import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

// ── GET /api/students ───────────────────────────────────────────────────────
router.get("/", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    "SELECT * FROM students ORDER BY id ASC"
  );
  res.json(rows);
});

// ── GET /api/students/:id ───────────────────────────────────────────────────
router.get("/:id", async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    "SELECT * FROM students WHERE id = $1",
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Student not found" });
  res.json(rows[0]);
});

// ── POST /api/students ──────────────────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  const { name, grade_unlocked = 3, subject = "english" } = req.body;
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name is required" });
  }
  const { rows } = await pool.query(
    `INSERT INTO students (name, grade_unlocked, subject)
     VALUES ($1, $2, $3)
     ON CONFLICT (name) DO UPDATE SET grade_unlocked = EXCLUDED.grade_unlocked
     RETURNING *`,
    [name.trim(), grade_unlocked, subject]
  );
  res.status(201).json(rows[0]);
});

// ── PUT /api/students/:id — update any fields (progress sync) ───────────────
router.put("/:id", async (req: Request, res: Response) => {
  const allowed = [
    "name", "grade_unlocked", "xp", "stars", "tokens", "streak",
    "mastery3", "learned", "inventory", "subject",
    "astronomy_categories", "canada_categories", "math_kangaroo_categories", "leon_categories",
    "difficulty_min", "difficulty_max",
    "font_size", "test_length", "audio_enabled", "audio_rate",
    "lottery_cost", "lottery_prizes", "lottery_history",
    "enabled_subjects",
  ];
  const jsonFields = new Set(["mastery3", "learned", "inventory",
    "astronomy_categories", "canada_categories", "math_kangaroo_categories", "leon_categories",
    "lottery_prizes", "lottery_history", "enabled_subjects"]);

  const fields: string[] = [];
  const values: unknown[] = [];

  for (const key of allowed) {
    if (key in req.body) {
      values.push(jsonFields.has(key) ? JSON.stringify(req.body[key]) : req.body[key]);
      fields.push(`${key} = $${values.length}`);
    }
  }

  if (fields.length === 0) return res.status(400).json({ error: "No valid fields to update" });

  values.push(req.params.id);
  const { rows } = await pool.query(
    `UPDATE students SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values
  );
  if (!rows[0]) return res.status(404).json({ error: "Student not found" });
  res.json(rows[0]);
});

// ── DELETE /api/students/:id ────────────────────────────────────────────────
router.delete("/:id", async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    "DELETE FROM students WHERE id = $1 RETURNING id, name",
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Student not found" });
  res.json({ deleted: rows[0] });
});

// ── POST /api/students/:id/reset ────────────────────────────────────────────
router.post("/:id/reset", async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    `UPDATE students SET
       xp=0, stars=0, tokens=0, streak=0,
       grade_unlocked=3, mastery3='{}', learned='{}', inventory='[]'
     WHERE id = $1 RETURNING *`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Student not found" });
  res.json(rows[0]);
});

// ── GET /api/students/:id/questions ─────────────────────────────────────────
// Returns the student's assigned question pool.
// If they have no custom assignments, returns all active questions.
router.get("/:id/questions", async (req: Request, res: Response) => {
  const studentId = Number(req.params.id);
  const { subject, type, difficulty_min = "1", difficulty_max = "5" } =
    req.query as Record<string, string>;

  // Check if student has a custom pool
  const { rows: poolCheck } = await pool.query(
    "SELECT COUNT(*)::int AS count FROM student_questions WHERE student_id = $1 AND assigned = true",
    [studentId]
  );
  const hasCustomPool = poolCheck[0].count > 0;

  const conditions = [
    "q.active = true",
    "q.difficulty >= $1",
    "q.difficulty <= $2",
  ];
  const params: unknown[] = [Number(difficulty_min), Number(difficulty_max)];

  if (subject) { params.push(subject); conditions.push(`q.subject = $${params.length}`); }
  if (type)    { params.push(type);    conditions.push(`q.type = $${params.length}`); }

  const joinClause = hasCustomPool
    ? `JOIN student_questions sq ON sq.question_id = q.id AND sq.student_id = ${studentId} AND sq.assigned = true`
    : "";

  const { rows } = await pool.query(
    `SELECT q.* FROM questions q ${joinClause}
     WHERE ${conditions.join(" AND ")}
     ORDER BY q.subject, q.type, q.id`,
    params
  );

  res.json({ questions: rows, total: rows.length, custom_pool: hasCustomPool });
});

// ── POST /api/students/:id/questions ─────────────────────────────────────────
// Assign question IDs to a student's custom pool.
// Body: { question_ids: number[] }
router.post("/:id/questions", async (req: Request, res: Response) => {
  const studentId = Number(req.params.id);
  const { question_ids } = req.body as { question_ids: number[] };

  if (!Array.isArray(question_ids) || question_ids.length === 0) {
    return res.status(400).json({ error: "question_ids must be a non-empty array" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let inserted = 0;
    for (const qid of question_ids) {
      await client.query(
        `INSERT INTO student_questions (student_id, question_id, assigned)
         VALUES ($1, $2, true)
         ON CONFLICT (student_id, question_id) DO UPDATE SET assigned = true`,
        [studentId, qid]
      );
      inserted++;
    }
    await client.query("COMMIT");
    res.json({ assigned: inserted });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

// ── DELETE /api/students/:id/questions/:qid ───────────────────────────────
router.delete("/:id/questions/:qid", async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    `UPDATE student_questions SET assigned = false
     WHERE student_id = $1 AND question_id = $2
     RETURNING question_id`,
    [req.params.id, req.params.qid]
  );
  if (!rows[0]) return res.status(404).json({ error: "Assignment not found" });
  res.json({ unassigned: rows[0].question_id });
});

// ── DELETE /api/students/:id/questions — clear entire custom pool ──────────
router.delete("/:id/questions", async (req: Request, res: Response) => {
  const { rowCount } = await pool.query(
    "DELETE FROM student_questions WHERE student_id = $1",
    [req.params.id]
  );
  res.json({ cleared: rowCount });
});

// ── GET /api/students/:id/stats ──────────────────────────────────────────────
router.get("/:id/stats", async (req: Request, res: Response) => {
  const studentId = req.params.id;

  const [studentRes, testRes, poolRes] = await Promise.all([
    pool.query("SELECT * FROM students WHERE id = $1", [studentId]),
    pool.query(
      `SELECT COUNT(*)::int AS total_sessions,
              COALESCE(SUM(score), 0)::int AS total_correct,
              COALESCE(SUM(total), 0)::int AS total_answered
       FROM test_sessions WHERE student_id = $1 AND finished_at IS NOT NULL`,
      [studentId]
    ),
    pool.query(
      "SELECT COUNT(*)::int AS pool_size FROM student_questions WHERE student_id = $1 AND assigned = true",
      [studentId]
    ),
  ]);

  if (!studentRes.rows[0]) return res.status(404).json({ error: "Student not found" });

  res.json({
    ...studentRes.rows[0],
    test_stats: testRes.rows[0],
    custom_pool_size: poolRes.rows[0].pool_size,
  });
});

export default router;
