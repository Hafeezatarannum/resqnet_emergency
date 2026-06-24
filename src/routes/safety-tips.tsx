import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
} from "@/components/resqnet/kit";
import { SAFETY_TIPS } from "@/lib/resqnet-data";

export const Route = createFileRoute("/safety-tips")({
  head: () => ({ meta: [{ title: "Safety Tips — ResQNet" }] }),
  component: SafetyTips,
});

function SafetyTips() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Safety tips" />
      <Screen>
        <div className="space-y-3">
          {SAFETY_TIPS.map((t, i) => (
            <GlassCard key={i}>
              <p className="font-semibold">{t.t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.d}</p>
            </GlassCard>
          ))}
        </div>
      </Screen>
    </DashboardLayout>
  );
}
