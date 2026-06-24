import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  Pill,
} from "@/components/resqnet/kit";
import { FAMILY } from "@/lib/resqnet-data";

export const Route = createFileRoute("/family-mode")({
  head: () => ({ meta: [{ title: "Family Mode — ResQNet" }] }),
  component: FamilyMode,
});

function FamilyMode() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Family mode" subtitle="Shared live location access" />
      <Screen>
        <div className="space-y-3">
          {FAMILY.map((f, i) => (
            <GlassCard key={i}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-blue/15 text-sm font-bold">
                  {f.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.relation}</p>
                </div>
                <Pill tone="green">Sharing</Pill>
              </div>
            </GlassCard>
          ))}
        </div>
      </Screen>
    </DashboardLayout>
  );
}
