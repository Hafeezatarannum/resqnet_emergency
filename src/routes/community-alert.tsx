import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  GlowButton,
} from "@/components/resqnet/kit";
import { MapMock } from "@/components/resqnet/widgets";

export const Route = createFileRoute("/community-alert")({
  head: () => ({ meta: [{ title: "Community Alert — ResQNet" }] }),
  component: CommunityAlert,
});

function CommunityAlert() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Emergency in your area" />
      <Screen>
        <MapMock className="h-40" />
        <GlassCard className="mt-4">
          <p className="text-lg font-bold">Road accident • MG Road</p>
          <p className="mt-1 text-sm text-muted-foreground">
            1.2 km away • reported 2 min ago. A victim needs first-aid before
            the ambulance arrives.
          </p>
        </GlassCard>
        <p className="mt-6 text-center text-sm font-semibold">Can you help?</p>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto grid grid-cols-2 gap-3 px-5 pb-8">
        <GlowButton to="/navigate-user" variant="primary">
          Yes, I can help
        </GlowButton>
        <GlowButton to="/home" variant="dark">
          No
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
