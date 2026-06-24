import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  GlowButton,
  GlassCard,
  Pill,
} from "@/components/resqnet/kit";
import { MapMock } from "@/components/resqnet/widgets";

export const Route = createFileRoute("/incoming-alert")({
  head: () => ({ meta: [{ title: "Incoming Alert — ResQNet" }] }),
  component: IncomingAlert,
});

function IncomingAlert() {
  return (
    <DashboardLayout>
      <Aura />
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-8">
        <div className="mb-4 text-center">
          <Pill tone="red">🚨 Incoming emergency</Pill>
        </div>
        <MapMock className="h-40" />
        <GlassCard className="mt-4">
          <p className="text-xl font-bold">Heart Attack</p>
          <p className="mt-1 text-sm text-muted-foreground">
            MG Road, near Metro Station
          </p>
          <div className="mt-3 flex gap-2">
            <Pill tone="blue">0.4 km away</Pill>
            <Pill tone="orange">ETA 2 min</Pill>
          </div>
        </GlassCard>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto grid grid-cols-2 gap-3 px-5 pb-10">
        <GlowButton to="/navigate-user" variant="primary">
          Accept
        </GlowButton>
        <GlowButton to="/volunteer-dashboard" variant="dark">
          Decline
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
