import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const SESSION_ID_RE = /^[a-zA-Z0-9_-]{1,100}$/;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 50;

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Grove's company brain interviewer. Your job is to deeply understand a company through conversation.

You ask focused questions to extract:
- What the company does and who it serves
- How decisions actually get made (not just the org chart)
- Key processes, tools, and workflows
- What makes this company different
- Where the informal knowledge lives

Rules:
- Ask ONE clear question at a time
- Build on previous answers
- Go deeper when you sense there's more
- After 6-8 exchanges, offer to summarize what you've learned about their company brain
- Be warm but focused — you're building something that will serve them for years

Start by warmly welcoming them and asking your first question about what their company does.`;

const DATA_DIR = path.join(process.cwd(), "data", "interviews");

async function saveInterview(sessionId: string, data: object) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, `${sessionId}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    if (!SESSION_ID_RE.test(sessionId)) {
      console.warn("Interview API: invalid sessionId format rejected");
      return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "messages must be an array" }, { status: 400 });
    }

    if (messages.length > MAX_MESSAGES) {
      console.warn(`Interview API: message history limit exceeded (${messages.length})`);
      return NextResponse.json({ error: "Message limit reached" }, { status: 400 });
    }

    for (const msg of messages) {
      if (typeof msg.content === "string" && msg.content.length > MAX_MESSAGE_LENGTH) {
        console.warn(`Interview API: oversized message rejected (${msg.content.length} chars)`);
        return NextResponse.json({ error: "Message too long" }, { status: 400 });
      }
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: "user" | "assistant"; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const assistantMessage = response.content[0];
    if (assistantMessage.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
    }

    const updatedMessages = [
      ...messages,
      { role: "assistant", content: assistantMessage.text },
    ];

    await saveInterview(sessionId, {
      sessionId,
      updatedAt: new Date().toISOString(),
      messages: updatedMessages,
    });

    return NextResponse.json({ message: assistantMessage.text });
  } catch (error) {
    console.error("Interview API error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Failed to process interview" }, { status: 500 });
  }
}
