"use client";

import { useMemo, useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const PROMPTS = [
  "Explain your work at StageKeep",
  "What projects have you built?",
  "What are you currently focused on?",
  "What technologies do you use?",
  "How do you approach building AI systems?",
];

const ANSWERS: Record<string, string> = {
  "Explain your work at StageKeep":
    "At StageKeep, I focus on AI interaction systems that make workflows more conversational and actionable. The work blends product thinking, applied ML, and reliable frontend experiences so users can move from questions to decisions quickly.",
  "What projects have you built?":
    "I have built interactive demos including Tic-Tac-Toe AI, Flappy Bird neuroevolution, and a Chapter Ops dashboard. This portfolio itself is also a product project, designed as a fast, polished App Router experience with live demos.",
  "What are you currently focused on?":
    "I am currently focused on shipping AI interaction systems, improving this portfolio as a product surface, and deepening practical ML + full-stack engineering skills. The emphasis is building systems that are useful in real workflows.",
  "What technologies do you use?":
    "My stack centers on Python and JavaScript/TypeScript, plus React and Next.js for product interfaces. For data and ML workflows, I commonly use NumPy, Pandas, and scikit-learn alongside solid software engineering fundamentals.",
  "How do you approach building AI systems?":
    "I start with the user workflow first, then scope the smallest high-value loop that can be shipped quickly and measured. From there, I iterate on interaction quality, reliability, and performance so the AI feels useful rather than novelty-driven.",
};

export default function AskRjAi() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Ask about experience, projects, or current focus. This is a lightweight on-site AI interaction demo.",
    },
  ]);

  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const promptList = useMemo(() => PROMPTS, []);

  const respond = (input: string): string => {
    const normalized = input.trim().toLowerCase();
    const exact = ANSWERS[input];
    if (exact) return exact;

    if (normalized.includes("stagekeep")) return ANSWERS["Explain your work at StageKeep"];
    if (normalized.includes("project")) return ANSWERS["What projects have you built?"];
    if (normalized.includes("focus") || normalized.includes("currently")) {
      return ANSWERS["What are you currently focused on?"];
    }
    if (
      normalized.includes("tech") ||
      normalized.includes("stack") ||
      normalized.includes("language")
    ) {
      return ANSWERS["What technologies do you use?"];
    }
    if (normalized.includes("approach") || normalized.includes("system")) {
      return ANSWERS["How do you approach building AI systems?"];
    }

    return "Great question. Try asking about StageKeep, projects, current focus, technologies, or AI system design approach.";
  };

  const runPrompt = (prompt: string) => {
    setActivePrompt(prompt);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: prompt },
      { role: "assistant", text: respond(prompt) },
    ]);
    window.setTimeout(() => setActivePrompt(null), 220);
  };

  const sendMessage = () => {
    const input = draft.trim();
    if (!input) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "assistant", text: respond(input) },
    ]);
    setDraft("");
  };

  return (
    <div className="panel ask-ai ui-lift" data-animate>
      <div className="ask-ai-head">
        <strong>Ask RJ&apos;s AI</strong>
        <span className="pill">Interactive Demo</span>
      </div>

      <p className="section-sub ask-ai-sub">
        Lightweight, frontend-only assistant for quick context about experience, projects, and current
        engineering focus.
      </p>

      <div className="ask-ai-prompts" aria-label="Suggested prompts">
        {promptList.map((prompt) => (
          <button
            key={prompt}
            className="chip ask-chip ui-lift"
            type="button"
            onClick={() => runPrompt(prompt)}
            aria-label={`Ask: ${prompt}`}
            disabled={activePrompt === prompt}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="ask-ai-compose">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask a question and press Enter..."
          aria-label="Ask RJ AI input"
        />
        <button className="button secondary" type="button" onClick={sendMessage}>
          Send
        </button>
      </div>

      <div className="ask-ai-thread" aria-live="polite" aria-label="AI conversation">
        {messages.slice(-6).map((m, idx) => (
          <div key={`${m.role}-${idx}`} className={`msg ${m.role}`}>
            <span className="msg-role">{m.role === "assistant" ? "RJ AI" : "You"}</span>
            <p>{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
