import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  GlowButton,
  Pill,
} from "@/components/resqnet/kit";

export const Route = createFileRoute("/accept-request")({
  head: () => ({ meta: [{ title: "Request Details — ResQNet" }] }),
  component: AcceptRequest,
});

function AcceptRequest() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Request details" />
      <Screen>
        <GlassCard>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">Heart Attack</p>
            <Pill tone="red">Critical</Pill>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Location: MG Road, near Metro Station
          </p>
          <p className="text-sm text-muted-foreground">
            Distance: 0.4 km • ETA 2 min
          </p>
          <p className="text-sm text-muted-foreground">
            Victim: conscious, not breathing
          </p>
        </GlassCard>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto grid grid-cols-2 gap-3 px-5 pb-8">
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
