import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const client = new Anthropic();

const SUMMARY_PROMPT = `Based on this interview conversation, extract a structured company brain summary.

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
  "openQuestions": ["gap 1", "gap 2", ...]
}

Only include fields you have evidence for from the conversation. Return ONLY valid JSON.`;

const DATA_DIR = path.join(process.cwd(), "data", "interviews");

export async function POST(req: NextRequest) {
  try {
    const { sessionId, messages } = await req.json();

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: SUMMARY_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here is the interview transcript:\n\n${messages
            .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
            .join("\n\n")}`,
        },
      ],
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
          JSON.stringify({ ...existing, summary, summarizedAt: new Date().toISOString() }, null, 2)
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
