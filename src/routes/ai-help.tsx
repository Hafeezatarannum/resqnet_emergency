import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout, Aura } from "@/components/resqnet/kit";
import { FIRST_AID } from "@/lib/resqnet-data";
import {
  Bot,
  Mic,
  MessageSquare,
  ChevronRight,
  Activity,
  Info,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/ai-help")({
  head: () => ({ meta: [{ title: "AI Help — ResQNet" }] }),
  component: AiHelp,
});

function AiHelp() {
  return (
    <DashboardLayout withNav>
      <Aura />
      <div className="relative z-10 w-full max-w-[1400px] mx-auto p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-blue/20 text-brand-blue">
              <Bot className="h-8 w-8" />
            </span>
            <div>
              <h1 className="text-3xl font-bold">AI Emergency Assistant</h1>
              <p className="text-muted-foreground mt-1">
                Voice and text-based crisis management and first-aid guidance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-success/20 text-success rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />{" "}
              AI Systems Online
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/voice-assistant"
            className="group relative overflow-hidden bg-card border border-border rounded-3xl p-8 hover:border-primary/50 transition-colors shadow-lg flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="h-20 w-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Mic className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Voice Assistant</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Hands-free guidance. Just speak and the AI will analyze the
                emergency and guide you through life-saving steps.
              </p>
            </div>
          </Link>

          <Link
            to="/chatbot"
            className="group relative overflow-hidden bg-card border border-border rounded-3xl p-8 hover:border-brand-blue/50 transition-colors shadow-lg flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="h-20 w-20 mx-auto bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Text Chatbot</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Discreet, text-based guidance for situations where speaking is
                unsafe or impossible.
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">First-aid Guides Library</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIRST_AID.map((f) => (
              <Link
                key={f.key}
                to={f.to}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:bg-secondary/50 transition-colors group"
              >
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{f.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {f.desc}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
