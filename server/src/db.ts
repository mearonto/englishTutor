import { Pool } from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://wordquest:wordquest@localhost:5432/wordquest";

export const pool = new Pool({ connectionString: DATABASE_URL });

pool.on("error", (err) => {
  console.error("Unexpected DB pool error:", err);
});

import type { QueryResultRow } from "pg";

export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params?: unknown[]
) {
  const result = await pool.query<T>(sql, params);
  return result;
}
