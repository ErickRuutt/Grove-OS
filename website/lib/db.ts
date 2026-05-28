import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const sql = neon(process.env.DATABASE_URL);

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS interview_sessions (
      session_id   TEXT        PRIMARY KEY,
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      messages     JSONB       NOT NULL DEFAULT '[]',
      runtime      JSONB,
      file_signals JSONB       NOT NULL DEFAULT '[]',
      summary      JSONB,
      summarized_at TIMESTAMPTZ
    )
  `;
}
