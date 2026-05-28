import { NextRequest, NextResponse } from "next/server";
import { FOLLOW_UP_CAP, getLowConfidenceFollowUps } from "@/lib/interview-confidence";
import { loadSession, saveSession } from "@/lib/interview-store";
import type { ChatMessage, RuntimeState } from "@/lib/interview-store";

const SESSION_ID_RE = /^[a-zA-Z0-9_-]{1,100}$/;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 50;

type Phase = "core" | "function" | "project" | "output" | "done";

const CORE_QUESTIONS = [
  "Let's start with core identity. What's your company name, website URL, current stage, and team size?",
  "What is your mission, and just as important, what do you explicitly not do?",
  "Who is your ideal customer, and what are the top pains you solve for them?",
  "What are your core offers and business model fundamentals (pricing and packaging style)?",
  "Which core metrics define success for the next 1-2 quarters?",
  "Classification pass: share business model, industry/sub-industry, sales motion, delivery model, revenue model, customer scope, geography, and whether you operate in a regulated sector.",
];

const FUNCTION_QUESTIONS: Record<"sales" | "marketing" | "cs", string[]> = {
  sales: [
    "Sales deep dive. Based on your core context, describe your primary sales process from first touch to close.",
    "What qualification signals, disqualifiers, and conversion blockers matter most in your sales motion?",
  ],
  marketing: [
    "Marketing deep dive. Based on your core context, what are your primary channels and campaign motions?",
    "Which messages and offers convert best, and where does performance currently break down?",
  ],
  cs: [
    "CS deep dive. Based on your core context, describe onboarding, activation, and renewal workflow.",
    "Which health signals and churn risks are most important right now?",
  ],
};

const PROJECT_QUESTIONS = [
  "Do you want to add project/research context now (for example website relaunch, GTM experiment, or customer research)? If yes, name the project.",
  "Project/research context: what's the project goal, scope, timeline, and key constraints?",
];

function getDefaultState(): RuntimeState {
  return {
    phase: "core",
    coreIndex: 0,
    functionTrack: null,
    functionIndex: 0,
    projectWanted: null,
    projectIndex: 0,
    followUpAsked: 0,
    pendingFollowUps: [],
  };
}

function buildUserTranscript(messages: ChatMessage[]): string {
  return messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join("\n");
}

function maybeInferFunctionTrack(text: string): RuntimeState["functionTrack"] {
  const value = text.toLowerCase();
  if (value.includes("sales")) return "sales";
  if (value.includes("marketing")) return "marketing";
  if (value.includes("customer success") || value.includes("cs")) return "cs";
  return null;
}

function nextAssistantMessage(state: RuntimeState, messages: ChatMessage[]): string {
  const userTranscript = buildUserTranscript(messages);

  if (state.phase === "core") {
    if (state.coreIndex < CORE_QUESTIONS.length) {
      return CORE_QUESTIONS[state.coreIndex];
    }

    if (!state.pendingFollowUps.length && state.followUpAsked < FOLLOW_UP_CAP) {
      const { followUps } = getLowConfidenceFollowUps(userTranscript);
      state.pendingFollowUps = followUps;
    }

    if (state.pendingFollowUps.length && state.followUpAsked < FOLLOW_UP_CAP) {
      const q = state.pendingFollowUps.shift();
      if (q) {
        state.followUpAsked += 1;
        return `Low-confidence follow-up (${state.followUpAsked}/${FOLLOW_UP_CAP}): ${q}`;
      }
    }

    state.phase = "function";
    return "Core overlay captured. Which function should we deep dive next: Sales, Marketing, or CS?";
  }

  if (state.phase === "function") {
    if (!state.functionTrack) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
      state.functionTrack = maybeInferFunctionTrack(lastUser) ?? "sales";
      state.functionIndex = 0;
    }

    const trackQuestions = FUNCTION_QUESTIONS[state.functionTrack];
    if (state.functionIndex < trackQuestions.length) {
      return trackQuestions[state.functionIndex];
    }

    state.phase = "project";
    return PROJECT_QUESTIONS[0];
  }

  if (state.phase === "project") {
    if (state.projectWanted === null) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content.toLowerCase() ?? "";
      state.projectWanted = !/(^|\b)(no|none|skip|not now)(\b|$)/.test(lastUser);
      if (!state.projectWanted) {
        state.phase = "output";
        return "Understood. Skipping project/research branch. Moving to output synthesis: should I generate a derived company-brain summary now?";
      }
      state.projectIndex = 1;
      return PROJECT_QUESTIONS[1];
    }

    state.phase = "output";
    return "Project/research context captured. Moving to output synthesis: should I generate a derived company-brain summary now?";
  }

  if (state.phase === "output") {
    state.phase = "done";
    return "Great. Interview runtime complete across core -> function -> optional project/research -> output synthesis. Use Generate Summary to produce derived artifacts with fact/inference/open tags.";
  }

  return "Interview is complete. If you want to refine any area, reply with the section (core, function, project, or output) and I'll reopen that phase.";
}

function advanceStateFromUserTurn(state: RuntimeState) {
  if (state.phase === "core") {
    if (state.coreIndex < CORE_QUESTIONS.length) {
      state.coreIndex += 1;
    }
    return;
  }

  if (state.phase === "function") {
    if (state.functionTrack && state.functionIndex < FUNCTION_QUESTIONS[state.functionTrack].length) {
      state.functionIndex += 1;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    if (!SESSION_ID_RE.test(sessionId)) {
      return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "messages must be an array" }, { status: 400 });
    }

    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json({ error: "Message limit reached" }, { status: 400 });
    }

    for (const msg of messages) {
      if (typeof msg.content === "string" && msg.content.length > MAX_MESSAGE_LENGTH) {
        return NextResponse.json({ error: "Message too long" }, { status: 400 });
      }
    }

    const existing = await loadSession(sessionId);
    const state = existing?.runtime ?? getDefaultState();

    if (messages.length > 0) {
      advanceStateFromUserTurn(state);
    }

    const assistant = nextAssistantMessage(state, messages as ChatMessage[]);
    const updatedMessages = [...messages, { role: "assistant", content: assistant }];

    await saveSession(sessionId, {
      messages: updatedMessages,
      runtime: state,
      fileSignals: existing?.fileSignals ?? [],
    });

    return NextResponse.json({ message: assistant, runtime: state });
  } catch (error) {
    console.error("Interview API error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Failed to process interview" }, { status: 500 });
  }
}
