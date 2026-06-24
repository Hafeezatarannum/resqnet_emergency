import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  Pill,
} from "@/components/resqnet/kit";
import { HISTORY } from "@/lib/resqnet-data";

export const Route = createFileRoute("/volunteer-history")({
  head: () => ({ meta: [{ title: "Volunteer History — ResQNet" }] }),
  component: VolunteerHistory,
});

function VolunteerHistory() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Helps history" subtitle="Emergencies you handled" />
      <Screen>
        <div className="space-y-3">
          {HISTORY.map((h, i) => (
            <GlassCard key={i}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{h.type}</p>
                <Pill tone={h.tone as "green"}>{h.status}</Pill>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{h.date}</p>
            </GlassCard>
          ))}
        </div>
      </Screen>
    </DashboardLayout>
  );
}
