import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { loadSession, appendFileSignal } from "@/lib/interview-store";
import type { FileSignal } from "@/lib/interview-store";

export const maxDuration = 60;

const client = new Anthropic();

const ANALYSIS_PROMPT = `You are analyzing a document to extract structured signals for a company brain.

Extract from the document:
- entities: People, companies, organizations, projects mentioned (with brief context)
- keyFacts: Important facts, metrics, status updates, decisions recorded
- relationships: How things/people/companies relate to each other
- dates: Important dates and timelines mentioned
- decisions: Decisions that were made or need to be made

Return ONLY valid JSON in this format:
{
  "entities": ["Entity Name - context", ...],
  "keyFacts": ["fact 1", "fact 2", ...],
  "relationships": ["A relates to B by...", ...],
  "dates": ["date - event description", ...],
  "decisions": ["decision description", ...]
}

Only include fields with actual content from the document. If a category has nothing relevant, omit it.`;

const TEXT_EXTENSIONS = new Set([".txt", ".md", ".json", ".csv"]);

async function readAsText(buffer: Buffer, fileName: string): Promise<string | null> {
  const ext = path.extname(fileName).toLowerCase();
  if (TEXT_EXTENSIONS.has(ext)) {
    return buffer.toString("utf-8");
  }
  return null;
}

export type { FileSignal };

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const sessionId = formData.get("sessionId") as string | null;
    const pasteText = formData.get("pasteText") as string | null;

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const existing = await loadSession(sessionId);
    const existingSignals = existing?.fileSignals ?? [];
    if (existingSignals.length >= 5) {
      return NextResponse.json({ error: "Max 5 files per session" }, { status: 400 });
    }

    let fileName: string;
    let fileBuffer: Buffer;
    let mimeType: string;

    if (pasteText) {
      fileName = `paste-${Date.now()}.txt`;
      mimeType = "text/plain";
      fileBuffer = Buffer.from(pasteText, "utf-8");
    } else if (file) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
      }
      const ext = path.extname(file.name).toLowerCase();
      const allowed = new Set([".txt", ".md", ".json", ".csv", ".pdf"]);
      if (!allowed.has(ext)) {
        return NextResponse.json(
          { error: "Unsupported file type. Allowed: .txt, .md, .json, .csv, .pdf" },
          { status: 400 }
        );
      }
      fileName = file.name;
      mimeType = file.type || "application/octet-stream";
      fileBuffer = Buffer.from(await file.arrayBuffer());
    } else {
      return NextResponse.json({ error: "No file or text provided" }, { status: 400 });
    }

    const textContent = await readAsText(fileBuffer, fileName);
    let messageContent: Anthropic.MessageParam["content"];

    if (textContent !== null) {
      messageContent = [
        {
          type: "text",
          text: `Document: ${fileName}\n\nContent:\n${textContent.slice(0, 120000)}`,
        },
      ];
    } else {
      const base64 = fileBuffer.toString("base64");
      messageContent = [
        {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: base64,
          },
        } as Anthropic.DocumentBlockParam,
        {
          type: "text",
          text: `Extract structured signals from this document (${fileName}).`,
        },
      ];
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: ANALYSIS_PROMPT,
      messages: [{ role: "user", content: messageContent }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    let extracted: Partial<FileSignal> = {};
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      extracted = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      // extraction failed — still store the record
    }

    const fileSignal: FileSignal = {
      fileName,
      mimeType,
      uploadedAt: new Date().toISOString(),
      ...extracted,
    };

    await appendFileSignal(sessionId, fileSignal);

    return NextResponse.json({ signal: fileSignal });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
  }
}
