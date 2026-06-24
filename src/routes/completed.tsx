import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, Aura, GlowButton } from "@/components/resqnet/kit";
import { HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/completed")({
  head: () => ({ meta: [{ title: "Emergency Completed — ResQNet" }] }),
  component: Completed,
});

function Completed() {
  return (
    <DashboardLayout>
      <Aura />
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative grid h-40 w-40 place-items-center">
          <span className="absolute inset-0 rounded-full bg-success/20 animate-pulse-ring" />
          <span className="relative grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-success to-success/50 text-[#04101d] animate-heartbeat">
            <HeartHandshake className="h-14 w-14" />
          </span>
        </div>
        <h1 className="mt-10 text-3xl font-bold">Help completed</h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          You're safe now. Thank you to the ResQNet community for the rapid
          response. Stay strong! 💙
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-6 pb-10">
        <GlowButton to="/feedback">Rate your experience</GlowButton>
        <GlowButton to="/home" variant="dark">
          Back to Home
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
