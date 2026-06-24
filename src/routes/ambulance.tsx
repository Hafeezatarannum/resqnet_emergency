import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  GlowButton,
  Stat,
  Pill,
} from "@/components/resqnet/kit";
import { Ambulance as AmbIcon } from "lucide-react";

export const Route = createFileRoute("/ambulance")({
  head: () => ({ meta: [{ title: "Ambulance — ResQNet" }] }),
  component: Ambulance,
});

function Ambulance() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar
        title="Auto ambulance booking"
        subtitle="Dispatched automatically"
      />
      <Screen>
        <GlassCard>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary animate-heartbeat">
              <AmbIcon className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <p className="font-bold">Ambulance #108-A4</p>
              <p className="text-xs text-muted-foreground">
                Apollo Emergency Care
              </p>
            </div>
            <Pill tone="green">Confirmed</Pill>
          </div>
          <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-2xl bg-white/[0.03] py-3">
            <Stat value="6 min" label="ETA" />
            <Stat value="1.2 km" label="Distance" />
            <Stat value="ALS" label="Type" />
          </div>
        </GlassCard>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-5 pb-8">
        <GlowButton to="/live-tracking">Track Ambulance</GlowButton>
        <GlowButton to="/home" variant="dark">
          Cancel Booking
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
