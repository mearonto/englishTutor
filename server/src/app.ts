import express from "express";
import cors from "cors";
import { runMigrations } from "./migrate";
import { seedQuestions, seedStudents } from "./seed";
import { pool } from "./db";
import questionsRouter from "./routes/questions";
import studentsRouter from "./routes/students";
import testsRouter from "./routes/tests";

const app = express();
const PORT = parseInt(process.env.PORT ?? "3001", 10);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/questions", questionsRouter);
app.use("/api/students", studentsRouter);
app.use("/api/test-sessions", testsRouter);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[api] Unhandled error:", err.message);
  res.status(500).json({ error: err.message });
});

async function main() {
  // Wait for Postgres to accept connections
  let retries = 20;
  while (retries > 0) {
    try {
      await pool.query("SELECT 1");
      break;
    } catch {
      retries--;
      if (retries === 0) throw new Error("Could not connect to database");
      console.log(`[db] Waiting for database... (${retries} retries left)`);
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  await runMigrations();
  await seedQuestions();
  await seedStudents();

  app.listen(PORT, () => {
    console.log(`[api] Word Quest API listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});

export default app;
