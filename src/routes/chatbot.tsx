import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, Aura, TopBar } from "@/components/resqnet/kit";
import { Send, Bot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

export const Route = createFileRoute("/chatbot")({
  head: () => ({ meta: [{ title: "AI Chatbot — ResQNet" }] }),
  component: Chatbot,
});

function Chatbot() {
  const [messages, setMessages] = useState<{ me: boolean; t: string }[]>([
    {
      me: false,
      t: "ResQNet AI is online. Please describe your emergency. Provide as much detail as you safely can.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { me: true, t: userMsg }]);
    setLoading(true);

    try {
      // The API Key MUST be in your .env or .env.local file as VITE_GEMINI_API_KEY
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing VITE_GEMINI_API_KEY");
      }

      const ai = new GoogleGenAI({ apiKey });

      // Convert our chat history into the format Gemini expects
      const contents = messages.map((m) => ({
        role: m.me ? "user" : "model",
        parts: [{ text: m.t }],
      }));
      contents.push({ role: "user", parts: [{ text: userMsg }] });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents as any,
        config: {
          systemInstruction:
            "You are ResQNet AI, an expert emergency medical responder. Provide extremely brief, calm, and actionable life-saving advice in bullet points. Do not give disclaimers about not being a doctor. Always instruct them to seek professional medical help but give immediate first aid steps first. Keep responses under 50 words.",
        },
      });

      const reply =
        response.text ||
        "I'm sorry, I couldn't process that. Please stay calm and wait for professional help.";
      setMessages((prev) => [...prev, { me: false, t: reply }]);
    } catch (error: any) {
      console.error(error);
      if (error.message === "Missing VITE_GEMINI_API_KEY") {
        setMessages((prev) => [
          ...prev,
          {
            me: false,
            t: "SYSTEM ERROR: VITE_GEMINI_API_KEY is not set. Please add it to your .env file and restart the server.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { me: false, t: "Network error. Please check your connection." },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout>
      <Aura />
      <TopBar
        title="AI Emergency Assistant"
        subtitle="Powered by Gemini"
        right={
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-blue/15 text-brand-blue">
            <Bot className="h-4 w-4" />
          </span>
        }
      />
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col h-[calc(100vh-140px)]">
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.me ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-[18px] px-4 py-3 text-sm flex flex-col",
                  m.me
                    ? "bg-primary text-white rounded-br-md"
                    : "glass rounded-bl-md text-foreground",
                  !m.me && "border border-border/50 bg-secondary/80 shadow-sm"
                )}
              >
                {/* We use dangerouslySetInnerHTML slightly safely here or just basic formatting */}
                {/* For real apps we'd use a markdown parser, but splitting by newline works for bullets */}
                {m.t.split("\n").map((line, j) => (
                  <span key={j} className="block min-h-[1em]">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="glass rounded-[18px] rounded-bl-md px-4 py-3 text-sm flex items-center gap-2 border border-border/50 bg-secondary/80">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground animate-pulse">Analyzing...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="w-full flex items-center gap-2 border-t border-border bg-secondary/60 p-3 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the emergency…"
            className="h-12 flex-1 rounded-full border border-border bg-white/[0.03] px-4 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white glow-red disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-5 w-5 ml-[-2px]" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
