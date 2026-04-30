import express from "express";
import cors from "cors";
import { runMigrations } from "./migrate";
import { pool } from "./db";

const app = express();
const PORT = parseInt(process.env.PORT ?? "3001", 10);

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
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

  app.listen(PORT, () => {
    console.log(`[api] Word Quest API listening on port ${PORT}`);
    console.log(`[api] DB ready`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});

export default app;
