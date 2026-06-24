import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  GlowButton,
  Stat,
} from "@/components/resqnet/kit";
import { Watch, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/smartwatch")({
  head: () => ({ meta: [{ title: "Smartwatch Sync — ResQNet" }] }),
  component: Smartwatch,
});

function Smartwatch() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Smartwatch sync" subtitle="Health monitoring & auto SOS" />
      <Screen>
        <GlassCard className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-blue/15 text-brand-blue">
            <Watch className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="font-semibold">ResQ Watch</p>
            <p className="text-xs text-success">Connected</p>
          </div>
        </GlassCard>
        <GlassCard className="mt-4 grid grid-cols-3 divide-x divide-border">
          <Stat value="78" label="BPM" />
          <Stat value="98%" label="SpO₂" />
          <Stat value="On" label="Auto SOS" />
        </GlassCard>
        <GlassCard className="mt-4 flex items-center gap-3">
          <HeartPulse className="h-6 w-6 text-primary animate-heartbeat" />
          <p className="text-sm text-muted-foreground">
            Abnormal heart rate triggers an automatic SOS.
          </p>
        </GlassCard>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlowButton variant="outline">Manage Device</GlowButton>
      </div>
    </DashboardLayout>
  );
}
