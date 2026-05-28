import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { loadSession, saveSummary } from "@/lib/interview-store";
import type { FileSignal } from "@/lib/interview-store";

const client = new Anthropic();

type TaggedItem = {
  label: string;
  tag: "FACT" | "INFERENCE" | "OPEN";
  confidence: number;
  source: "website_crawl" | "user_provided" | "docs_inferred" | "mixed";
  value: string;
};

const SUMMARY_PROMPT = `Based on the interview transcript and uploaded document signals, build a unified company-brain summary aligned to phase outputs.

Return ONLY valid JSON in this exact shape:
{
  "companyName": "...",
  "whatTheyDo": "...",
  "whoTheyServe": "...",
  "keyProcesses": ["..."],
  "keyTools": ["..."],
  "howDecisionsAreMade": "...",
  "informalKnowledge": ["..."],
  "whatMakesThemDifferent": "...",
  "openQuestions": ["..."],
  "classification": {
    "fact": [{"label":"...","confidence":0.0,"source":"user_provided","value":"..."}],
    "inference": [{"label":"...","confidence":0.0,"source":"docs_inferred","value":"..."}],
    "open": [{"label":"...","confidence":0.0,"source":"mixed","value":"..."}]
  },
  "completeness": {
    "classificationComplete": "Yes|No",
    "needsFollowUp": "Yes|No",
    "missingFields": ["..."],
    "ambiguousFields": ["..."]
  },
  "outputArtifacts": [
    {
      "name": "company-brain-summary",
      "derived": true,
      "traceableSourceFields": ["..."]
    }
  ],
  "sources": [
    { "label": "Interview transcript", "type": "interview", "contribution": "..." },
    { "label": "filename.pdf", "type": "file", "contribution": "..." }
  ]
}

Rules:
- Put each classification line into exactly one group: fact, inference, or open.
- Every classification item MUST include confidence and source.
- Mark outputArtifacts as derived=true and include traceable source fields.
- Keep confidence between 0 and 1.`;

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

function normalizeClassification(items: TaggedItem[] | undefined, tag: TaggedItem["tag"]) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({ ...item, tag }));
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, messages } = await req.json();

    let fileSignals: FileSignal[] = [];
    if (sessionId) {
      const session = await loadSession(sessionId);
      fileSignals = session?.fileSignals ?? [];
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

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    let summary: Record<string, unknown>;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      summary = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      summary = { error: "Could not parse summary" };
    }

    const classification = (summary.classification as Record<string, TaggedItem[]>) || {};
    summary.classificationTagged = [
      ...normalizeClassification(classification.fact, "FACT"),
      ...normalizeClassification(classification.inference, "INFERENCE"),
      ...normalizeClassification(classification.open, "OPEN"),
    ];

    if (sessionId) {
      await saveSummary(sessionId, summary);
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary API error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
