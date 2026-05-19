// eslint-disable-next-line @typescript-eslint/no-require-imports
const archiver = require("archiver") as typeof import("archiver");
import crypto from "crypto";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "interviews");
const EXPORTS_DIR = path.join(process.cwd(), "data", "exports");

export type ExportResult = {
  filePath: string;
  filename: string;
};

function sha256(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function slugify(name: string): string {
  return (name || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function generateExportZip(sessionId: string): Promise<ExportResult> {
  await fs.mkdir(EXPORTS_DIR, { recursive: true });

  const sessionPath = path.join(DATA_DIR, `${sessionId}.json`);
  let sessionData: Record<string, unknown>;
  try {
    sessionData = JSON.parse(await fs.readFile(sessionPath, "utf-8"));
  } catch {
    throw new Error(`Session not found: ${sessionId}`);
  }

  const summary = (sessionData.summary as Record<string, unknown>) || {};
  const messages = (sessionData.messages as Array<{ role: string; content: string }>) || [];
  const fileSignals = (sessionData.fileSignals as Array<Record<string, unknown>>) || [];
  const companyName = (summary.companyName as string) || "unknown";
  const slug = slugify(companyName);
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `brain-protocol-export_${slug}_${dateStr}_v1.zip`;
  const outputPath = path.join(EXPORTS_DIR, `${sessionId}_${dateStr}.zip`);

  // Build file contents
  const readmeContent = buildReadme(companyName, summary);
  const summaryMdContent = buildSummaryMd(summary);
  const insightsJson = buildInsightsJson(sessionId, companyName, summary);
  const entitiesJson = buildEntitiesJson(summary);
  const claimsJson = buildClaimsJson(summary, messages);
  const edgesJson = buildEdgesJson();
  const conflictsJson = buildConflictsJson();
  const transcriptMd = buildTranscriptMd(messages);
  const turnsJson = buildTurnsJson(messages);
  const sourceIndexJson = buildSourceIndexJson(fileSignals, messages);

  const files: Record<string, string> = {
    "README.md": readmeContent,
    "summary.md": summaryMdContent,
    "insights.json": JSON.stringify(insightsJson, null, 2),
    "context-graph/entities.json": JSON.stringify(entitiesJson, null, 2),
    "context-graph/claims.json": JSON.stringify(claimsJson, null, 2),
    "context-graph/edges.json": JSON.stringify(edgesJson, null, 2),
    "context-graph/conflicts.json": JSON.stringify(conflictsJson, null, 2),
    "transcripts/interview.md": transcriptMd,
    "transcripts/turns.json": JSON.stringify(turnsJson, null, 2),
    "sources/source-index.json": JSON.stringify(sourceIndexJson, null, 2),
  };

  // Add source doc excerpts from file signals
  for (let i = 0; i < fileSignals.length; i++) {
    const sig = fileSignals[i] as Record<string, unknown>;
    const sigSlug = slugify((sig.fileName as string) || `source-${i}`);
    const docContent = buildSourceDoc(sig);
    files[`sources/docs/${String(i + 1).padStart(3, "0")}_${sigSlug}.md`] = docContent;
  }

  // Compute hashes and build manifest
  const hashes: Record<string, string> = {};
  for (const [name, content] of Object.entries(files)) {
    hashes[name] = sha256(content);
  }

  const manifest = {
    schemaVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    interviewId: sessionId,
    sourceCount: fileSignals.length + (messages.length > 0 ? 1 : 0),
    hashes,
  };
  files["manifest.json"] = JSON.stringify(manifest, null, 2);

  await new Promise<void>((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);

    for (const [name, content] of Object.entries(files)) {
      archive.append(content, { name });
    }

    archive.finalize();
  });

  return { filePath: outputPath, filename };
}

function buildReadme(companyName: string, summary: Record<string, unknown>): string {
  return `# Brain Protocol Export — ${companyName}

This package contains the structured company-brain output from a Brain Protocol interview session.

## Package contents

- **manifest.json** — schema version, generated timestamp, file checksums
- **summary.md** — executive synthesis for human review
- **insights.json** — structured highlights, risks, and opportunities
- **context-graph/** — entities, claims, edges, and conflicts
- **transcripts/** — human-readable and machine-readable interview transcript
- **sources/** — source index and uploaded document excerpts

## How to read this package

Start with \`summary.md\` for the executive synthesis. Use \`insights.json\` to integrate
with downstream tools. The \`context-graph/\` files provide traceable entity and claim
provenance back to sources.

## Data freshness

Generated: ${new Date().toISOString()}
Subject: ${(summary.companyName as string) || companyName}

This snapshot reflects a single interview session. Re-run the interview or add more
source documents to increase depth and reduce open questions.
`;
}

function buildSummaryMd(summary: Record<string, unknown>): string {
  const lines = [
    `# Company Brain Summary — ${summary.companyName || "Unknown"}`,
    "",
    "## Key findings",
    "",
  ];

  if (summary.whatTheyDo) lines.push(`**What they do:** ${summary.whatTheyDo}`, "");
  if (summary.whoTheyServe) lines.push(`**Who they serve:** ${summary.whoTheyServe}`, "");
  if (summary.whatMakesThemDifferent)
    lines.push(`**Differentiator:** ${summary.whatMakesThemDifferent}`, "");

  if (Array.isArray(summary.keyProcesses) && summary.keyProcesses.length > 0) {
    lines.push("", "## Strategic processes", "");
    for (const p of summary.keyProcesses) lines.push(`- ${p}`);
  }

  if (summary.howDecisionsAreMade) {
    lines.push("", "## Decision-making", "", summary.howDecisionsAreMade as string);
  }

  if (Array.isArray(summary.informalKnowledge) && summary.informalKnowledge.length > 0) {
    lines.push("", "## Informal knowledge", "");
    for (const k of summary.informalKnowledge) lines.push(`- ${k}`);
  }

  if (Array.isArray(summary.openQuestions) && summary.openQuestions.length > 0) {
    lines.push("", "## Open questions", "");
    for (const q of summary.openQuestions) lines.push(`- ${q}`);
  }

  lines.push(
    "",
    "## Sources",
    "",
    "See `sources/source-index.json` for full provenance.",
    ""
  );

  return lines.join("\n");
}

function buildInsightsJson(
  sessionId: string,
  companyName: string,
  summary: Record<string, unknown>
): unknown {
  const classification = (summary.classification as Record<string, Array<{ label: string; confidence: number; value: string }>>) || {};
  const facts = classification.fact || [];

  return {
    interview: {
      id: sessionId,
      title: `Brain Protocol Interview — ${companyName}`,
      subject: companyName,
      completedAt: new Date().toISOString(),
    },
    highlights: facts.slice(0, 10).map((f, i) => ({
      id: `highlight-${i + 1}`,
      statement: f.value || f.label,
      confidence: f.confidence || 0.8,
      sourceIds: ["interview-transcript"],
      entityIds: [],
    })),
    risks: (Array.isArray(summary.openQuestions) ? (summary.openQuestions as string[]) : [])
      .slice(0, 5)
      .map((q, i) => ({
        id: `risk-${i + 1}`,
        statement: q,
        severity: "medium",
        sourceIds: ["interview-transcript"],
      })),
    opportunities: [],
  };
}

function buildEntitiesJson(summary: Record<string, unknown>): unknown[] {
  const entities: unknown[] = [];
  const now = new Date().toISOString();

  if (summary.companyName) {
    entities.push({
      id: "entity-company",
      canonicalName: summary.companyName,
      aliases: [],
      type: "org",
      lastConfirmedAt: now,
      sourceIds: ["interview-transcript"],
    });
  }

  if (Array.isArray(summary.keyTools)) {
    (summary.keyTools as string[]).forEach((tool, i) => {
      entities.push({
        id: `entity-tool-${i + 1}`,
        canonicalName: tool,
        aliases: [],
        type: "product",
        lastConfirmedAt: now,
        sourceIds: ["interview-transcript"],
      });
    });
  }

  return entities;
}

function buildClaimsJson(
  summary: Record<string, unknown>,
  messages: Array<{ role: string; content: string }>
): unknown[] {
  const claims: unknown[] = [];
  const now = new Date().toISOString();
  const classification = (summary.classification as Record<string, Array<{ label: string; confidence: number; value: string }>>) || {};

  const allItems = [
    ...(classification.fact || []).map((f) => ({ ...f, tag: "FACT" })),
    ...(classification.inference || []).map((f) => ({ ...f, tag: "INFERENCE" })),
  ];

  allItems.forEach((item, i) => {
    claims.push({
      id: `claim-${i + 1}`,
      text: item.value || item.label,
      speaker: "interviewee",
      entityIds: ["entity-company"],
      confidence: item.confidence || 0.7,
      sourceIds: ["interview-transcript"],
      lastConfirmedAt: now,
      tag: item.tag,
    });
  });

  messages
    .filter((m) => m.role === "user")
    .slice(0, 5)
    .forEach((m, i) => {
      claims.push({
        id: `claim-transcript-${i + 1}`,
        text: m.content.slice(0, 200),
        speaker: "interviewee",
        entityIds: ["entity-company"],
        confidence: 1.0,
        sourceIds: ["interview-transcript"],
        lastConfirmedAt: now,
        tag: "FACT",
      });
    });

  return claims;
}

function buildEdgesJson(): unknown[] {
  return [];
}

function buildConflictsJson(): unknown[] {
  return [];
}

function buildTranscriptMd(messages: Array<{ role: string; content: string }>): string {
  const lines = ["# Interview Transcript", ""];
  messages.forEach((m, i) => {
    const speaker = m.role === "user" ? "Interviewee" : "Brain Protocol";
    lines.push(`**${speaker}** _(turn ${i + 1})_`, "", m.content, "");
  });
  return lines.join("\n");
}

function buildTurnsJson(messages: Array<{ role: string; content: string }>): unknown[] {
  return messages.map((m, i) => ({
    turnId: `turn-${i + 1}`,
    speaker: m.role === "user" ? "interviewee" : "interviewer",
    timestamp: null,
    text: m.content,
    entityMentions: [],
    claimIds: [],
  }));
}

function buildSourceIndexJson(
  fileSignals: Array<Record<string, unknown>>,
  messages: Array<{ role: string; content: string }>
): unknown {
  const sources = fileSignals.map((sig, i) => ({
    id: `source-file-${i + 1}`,
    title: sig.fileName || `Document ${i + 1}`,
    url: null,
    retrievedAt: sig.uploadedAt || new Date().toISOString(),
    contentType: sig.mimeType || "application/octet-stream",
    checksum: sha256(JSON.stringify(sig)),
    excerptFile: `sources/docs/${String(i + 1).padStart(3, "0")}_${slugify((sig.fileName as string) || `source-${i}`)}.md`,
  }));

  if (messages.length > 0) {
    sources.push({
      id: "interview-transcript",
      title: "Interview transcript",
      url: null,
      retrievedAt: new Date().toISOString(),
      contentType: "text/plain",
      checksum: sha256(messages.map((m) => m.content).join("\n")),
      excerptFile: "transcripts/interview.md",
    });
  }

  return sources;
}

function buildSourceDoc(sig: Record<string, unknown>): string {
  const lines = [
    `# Source: ${sig.fileName || "Unknown"}`,
    `**Type:** ${sig.mimeType || "unknown"}`,
    `**Uploaded:** ${sig.uploadedAt || "unknown"}`,
    "",
  ];
  if (Array.isArray(sig.entities) && sig.entities.length > 0) {
    lines.push("## Entities", "", ...(sig.entities as string[]).map((e) => `- ${e}`), "");
  }
  if (Array.isArray(sig.keyFacts) && sig.keyFacts.length > 0) {
    lines.push("## Key facts", "", ...(sig.keyFacts as string[]).map((f) => `- ${f}`), "");
  }
  if (Array.isArray(sig.relationships) && sig.relationships.length > 0) {
    lines.push(
      "## Relationships",
      "",
      ...(sig.relationships as string[]).map((r) => `- ${r}`),
      ""
    );
  }
  if (Array.isArray(sig.decisions) && sig.decisions.length > 0) {
    lines.push("## Decisions", "", ...(sig.decisions as string[]).map((d) => `- ${d}`), "");
  }
  return lines.join("\n");
}
