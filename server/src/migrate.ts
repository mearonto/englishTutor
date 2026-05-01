import fs from "fs";
import path from "path";
import { pool } from "./db";

export async function runMigrations() {
  const migrationsDir = path.join(__dirname, "..", "migrations");

  // Ensure migrations tracking table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      filename TEXT PRIMARY KEY,
      run_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const { rows } = await pool.query(
      "SELECT filename FROM _migrations WHERE filename = $1",
      [file]
    );
    if (rows.length > 0) {
      console.log(`[migrate] Already applied: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`[migrate] Applying: ${file}`);
    await pool.query(sql);
    await pool.query("INSERT INTO _migrations (filename) VALUES ($1)", [file]);
    console.log(`[migrate] Done: ${file}`);
  }
}
