import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { FileSignal } from "../upload/route";

const client = new Anthropic();

const DATA_DIR = path.join(process.cwd(), "data", "interviews");

const SUMMARY_PROMPT = `Based on the interview transcript and any uploaded document signals below, extract a unified company brain summary.

Return a JSON object with:
{
  "companyName": "...",
  "whatTheyDo": "1-2 sentence description",
  "whoTheyServe": "target customer description",
  "keyProcesses": ["process 1", "process 2", ...],
  "keyTools": ["tool 1", "tool 2", ...],
  "howDecisionsAreMade": "description of decision-making",
  "informalKnowledge": ["thing 1", "thing 2", ...],
  "whatMakesThemDifferent": "unique value proposition",
  "openQuestions": ["gap 1", "gap 2", ...],
  "sources": [
    { "label": "Interview transcript", "type": "interview", "contribution": "brief description of what this contributed" },
    { "label": "filename.pdf", "type": "file", "contribution": "brief description of what this contributed" }
  ]
}

Only include fields you have evidence for. Merge signals from all sources into one unified brain — do not produce parallel views. In "sources", only include sources that actually contributed signal. Return ONLY valid JSON.`;

function formatFileSignals(signals: FileSignal[]): string {
  if (!signals.length) return "";
  return signals
    .map((s) => {
      const parts = [`--- Uploaded file: ${s.fileName} ---`];
      if (s.entities?.length) parts.push(`Entities: ${s.entities.join("; ")}`);
      if (s.keyFacts?.length) parts.push(`Key facts: ${s.keyFacts.join("; ")}`);
      if (s.relationships?.length) parts.push(`Relationships: ${s.relationships.join("; ")}`);
      if (s.dates?.length) parts.push(`Dates: ${s.dates.join("; ")}`);
      if (s.decisions?.length) parts.push(`Decisions: ${s.decisions.join("; ")}`);
      return parts.join("\n");
    })
    .join("\n\n");
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, messages } = await req.json();

    // Load stored file signals for this session
    let fileSignals: FileSignal[] = [];
    if (sessionId) {
      try {
        const sessionPath = path.join(DATA_DIR, `${sessionId}.json`);
        const sessionData = JSON.parse(await fs.readFile(sessionPath, "utf-8"));
        fileSignals = sessionData.fileSignals || [];
      } catch {
        // no session file yet
      }
    }

    const transcript = messages
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join("\n\n");

    const fileSignalText = formatFileSignals(fileSignals);

    const userContent = fileSignalText
      ? `Interview transcript:\n\n${transcript}\n\n${fileSignalText}`
      : `Interview transcript:\n\n${transcript}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: SUMMARY_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    let summary;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      summary = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      summary = { error: "Could not parse summary" };
    }

    if (sessionId) {
      const filePath = path.join(DATA_DIR, `${sessionId}.json`);
      try {
        const existing = JSON.parse(await fs.readFile(filePath, "utf-8"));
        await fs.writeFile(
          filePath,
          JSON.stringify(
            { ...existing, summary, summarizedAt: new Date().toISOString() },
            null,
            2
          )
        );
      } catch {
        // session file might not exist
      }
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary API error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
