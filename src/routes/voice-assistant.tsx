import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  GlowButton,
} from "@/components/resqnet/kit";
import { Waveform } from "@/components/resqnet/widgets";
import { Mic } from "lucide-react";

export const Route = createFileRoute("/voice-assistant")({
  head: () => ({ meta: [{ title: "Voice Assistant — ResQNet" }] }),
  component: VoiceAssistant,
});

function VoiceAssistant() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Voice AI assistant" subtitle="Listening…" />
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative grid h-48 w-48 place-items-center">
          <span className="absolute inset-0 rounded-full bg-brand-blue/20 animate-pulse-ring" />
          <span className="relative grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-brand-blue/40">
            <Mic className="h-12 w-12 text-white" />
          </span>
        </div>
        <div className="mt-10 w-64">
          <Waveform />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          “How do I stop heavy bleeding?”
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-6 pb-10">
        <GlowButton to="/chatbot" variant="outline">
          Switch to chat
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
