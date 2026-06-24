import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, Aura, GlowButton } from "@/components/resqnet/kit";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/auto-sos-sent")({
  head: () => ({ meta: [{ title: "SOS Sent — ResQNet" }] }),
  component: AutoSosSent,
});

function AutoSosSent() {
  return (
    <DashboardLayout>
      <Aura />
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative grid h-40 w-40 place-items-center">
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
          <span className="relative grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-primary to-[#b71721] glow-red animate-sos">
            <ShieldCheck className="h-14 w-14 text-white" />
          </span>
        </div>
        <h1 className="mt-10 text-3xl font-bold">SOS sent automatically</h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          Help is on the way. Nearby volunteers and your emergency contacts have
          been alerted with your live location.
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-6 pb-10">
        <GlowButton to="/searching">Track Response</GlowButton>
        <GlowButton to="/expanding-radius" variant="outline">
          View Search Radius
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
