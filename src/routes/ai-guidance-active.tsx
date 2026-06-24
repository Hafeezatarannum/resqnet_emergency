import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  GlowButton,
} from "@/components/resqnet/kit";
import { Bot } from "lucide-react";

export const Route = createFileRoute("/ai-guidance-active")({
  head: () => ({ meta: [{ title: "AI Guidance Active — ResQNet" }] }),
  component: AiGuidanceActive,
});

function AiGuidanceActive() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="AI guidance active" subtitle="Stay with the victim" />
      <Screen>
        <GlassCard className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-blue/15 text-brand-blue animate-heartbeat">
            <Bot className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold">AI assistant is guiding you</p>
            <p className="text-xs text-muted-foreground">
              Help is on the way • ETA 2 min
            </p>
          </div>
        </GlassCard>
        <GlassCard className="mt-4">
          <p className="text-sm">
            Keep the person calm and still. Monitor their breathing. Do not give
            food or water. I'll alert you if anything changes.
          </p>
        </GlassCard>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlowButton to="/progress">Continue</GlowButton>
      </div>
    </DashboardLayout>
  );
}
