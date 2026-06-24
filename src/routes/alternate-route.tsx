import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  GlassCard,
  GlowButton,
  Pill,
} from "@/components/resqnet/kit";
import { MapMock } from "@/components/resqnet/widgets";

export const Route = createFileRoute("/alternate-route")({
  head: () => ({ meta: [{ title: "Alternate Route — ResQNet" }] }),
  component: AlternateRoute,
});

function AlternateRoute() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Faster route found" subtitle="Save 4 minutes" />
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 px-5 py-2">
        <MapMock className="h-full min-h-[320px]" />
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlassCard className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-semibold">Via Ring Road</p>
            <p className="text-xs text-muted-foreground">5.1 km • 9 min</p>
          </div>
          <Pill tone="green">-4 min</Pill>
        </GlassCard>
        <GlowButton to="/route-navigation">Take This Route</GlowButton>
      </div>
    </DashboardLayout>
  );
}
