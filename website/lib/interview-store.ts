import { sql } from "./db";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type RuntimeState = {
  phase: "core" | "function" | "project" | "output" | "done";
  coreIndex: number;
  functionTrack: "sales" | "marketing" | "cs" | null;
  functionIndex: number;
  projectWanted: boolean | null;
  projectIndex: number;
  followUpAsked: number;
  pendingFollowUps: string[];
};

export type FileSignal = {
  fileName: string;
  mimeType: string;
  uploadedAt: string;
  entities?: string[];
  keyFacts?: string[];
  relationships?: string[];
  dates?: string[];
  decisions?: string[];
};

export type SessionData = {
  sessionId: string;
  updatedAt: string;
  messages: ChatMessage[];
  runtime?: RuntimeState;
  fileSignals: FileSignal[];
  summary?: Record<string, unknown>;
  summarizedAt?: string;
};

export async function loadSession(sessionId: string): Promise<SessionData | null> {
  const rows = await sql`
    SELECT session_id, updated_at, messages, runtime, file_signals, summary, summarized_at
    FROM interview_sessions
    WHERE session_id = ${sessionId}
  `;
  if (!rows.length) return null;
  const r = rows[0];
  return {
    sessionId: r.session_id as string,
    updatedAt: (r.updated_at as Date).toISOString(),
    messages: (r.messages as ChatMessage[]) ?? [],
    runtime: (r.runtime as RuntimeState) ?? undefined,
    fileSignals: (r.file_signals as FileSignal[]) ?? [],
    summary: (r.summary as Record<string, unknown>) ?? undefined,
    summarizedAt: r.summarized_at ? (r.summarized_at as Date).toISOString() : undefined,
  };
}

export async function saveSession(sessionId: string, data: Partial<Omit<SessionData, "sessionId">>): Promise<void> {
  await sql`
    INSERT INTO interview_sessions (session_id, updated_at, messages, runtime, file_signals, summary, summarized_at)
    VALUES (
      ${sessionId},
      NOW(),
      ${JSON.stringify(data.messages ?? [])}::jsonb,
      ${data.runtime ? JSON.stringify(data.runtime) : null}::jsonb,
      ${JSON.stringify(data.fileSignals ?? [])}::jsonb,
      ${data.summary ? JSON.stringify(data.summary) : null}::jsonb,
      ${data.summarizedAt ?? null}
    )
    ON CONFLICT (session_id) DO UPDATE SET
      updated_at    = NOW(),
      messages      = COALESCE(EXCLUDED.messages,      interview_sessions.messages),
      runtime       = COALESCE(EXCLUDED.runtime,       interview_sessions.runtime),
      file_signals  = COALESCE(EXCLUDED.file_signals,  interview_sessions.file_signals),
      summary       = COALESCE(EXCLUDED.summary,       interview_sessions.summary),
      summarized_at = COALESCE(EXCLUDED.summarized_at, interview_sessions.summarized_at)
  `;
}

export async function appendFileSignal(sessionId: string, signal: FileSignal): Promise<FileSignal[]> {
  const rows = await sql`
    INSERT INTO interview_sessions (session_id, updated_at, file_signals)
    VALUES (${sessionId}, NOW(), ${JSON.stringify([signal])}::jsonb)
    ON CONFLICT (session_id) DO UPDATE SET
      updated_at   = NOW(),
      file_signals = interview_sessions.file_signals || ${JSON.stringify([signal])}::jsonb
    RETURNING file_signals
  `;
  return (rows[0].file_signals as FileSignal[]) ?? [];
}

export async function saveSummary(sessionId: string, summary: Record<string, unknown>): Promise<void> {
  await sql`
    UPDATE interview_sessions
    SET summary = ${JSON.stringify(summary)}::jsonb,
        summarized_at = NOW(),
        updated_at = NOW()
    WHERE session_id = ${sessionId}
  `;
}
