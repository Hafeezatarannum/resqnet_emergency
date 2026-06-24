import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  GlowButton,
  GlassCard,
  Stat,
} from "@/components/resqnet/kit";
import { MapMock } from "@/components/resqnet/widgets";

export const Route = createFileRoute("/navigate-user")({
  head: () => ({ meta: [{ title: "Navigate to User — ResQNet" }] }),
  component: NavigateUser,
});

function NavigateUser() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Navigate to victim" subtitle="Fastest route" />
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 px-5 pb-3">
        <MapMock className="h-full min-h-[360px]" />
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlassCard className="mb-3 grid grid-cols-3 divide-x divide-border">
          <Stat value="0.4 km" label="Distance" />
          <Stat value="2 min" label="ETA" />
          <Stat value="Clear" label="Traffic" />
        </GlassCard>
        <GlowButton to="/reached">Start Navigation</GlowButton>
      </div>
    </DashboardLayout>
  );
}
