import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, Aura, GlowButton } from "@/components/resqnet/kit";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/reached")({
  head: () => ({ meta: [{ title: "Reached Location — ResQNet" }] }),
  component: Reached,
});

function Reached() {
  return (
    <DashboardLayout>
      <Aura />
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="grid h-24 w-24 place-items-center rounded-full bg-success/15 text-success animate-heartbeat">
          <MapPin className="h-12 w-12" />
        </span>
        <h1 className="mt-6 text-2xl font-bold">You’ve reached the victim</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Confirm your arrival so the family and AI assistant can guide you
          through the next steps.
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-6 pb-10">
        <GlowButton to="/help-provided">Mark Arrived</GlowButton>
      </div>
    </DashboardLayout>
  );
}
