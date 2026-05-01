import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

// ── POST /api/test-sessions — start a new test session ──────────────────────
router.post("/", async (req: Request, res: Response) => {
  const { student_id, subject } = req.body as { student_id: number; subject?: string };
  if (!student_id) return res.status(400).json({ error: "student_id is required" });

  const { rows } = await pool.query(
    `INSERT INTO test_sessions (student_id, subject)
     VALUES ($1, $2)
     RETURNING *`,
    [student_id, subject ?? null]
  );
  res.status(201).json(rows[0]);
});

// ── PATCH /api/test-sessions/:id — finish a test session ────────────────────
router.patch("/:id", async (req: Request, res: Response) => {
  const { score, total, wrong_words } = req.body as {
    score: number;
    total: number;
    wrong_words?: string[];
  };

  const { rows } = await pool.query(
    `UPDATE test_sessions
     SET score = $1, total = $2, wrong_words = $3, finished_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [score, total, JSON.stringify(wrong_words ?? []), req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Session not found" });
  res.json(rows[0]);
});

// ── GET /api/test-sessions?student_id=X — sessions for a student ─────────────
router.get("/", async (req: Request, res: Response) => {
  const { student_id, limit = "50" } = req.query as Record<string, string>;
  if (!student_id) return res.status(400).json({ error: "student_id is required" });

  const { rows } = await pool.query(
    `SELECT * FROM test_sessions
     WHERE student_id = $1 AND finished_at IS NOT NULL
     ORDER BY finished_at DESC
     LIMIT $2`,
    [Number(student_id), Number(limit)]
  );
  res.json({ sessions: rows, total: rows.length });
});

export default router;
