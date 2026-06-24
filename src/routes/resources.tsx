import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  Pill,
} from "@/components/resqnet/kit";
import { RESOURCES } from "@/lib/resqnet-data";
import { Shield, Hospital, Pill as PillIcon, Flame } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({ meta: [{ title: "Emergency Resources — ResQNet" }] }),
  component: Resources,
});

const ICONS: Record<string, typeof Shield> = {
  Police: Shield,
  Hospital: Hospital,
  Pharmacy: PillIcon,
  "Fire Station": Flame,
};

function Resources() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Nearby resources" subtitle="Help points around you" />
      <Screen>
        <div className="space-y-3">
          {RESOURCES.map((r, i) => {
            const Icon = ICONS[r.type] ?? Shield;
            return (
              <GlassCard key={i}>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.type}</p>
                  </div>
                  <Pill tone="blue">{r.distance}</Pill>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </Screen>
    </DashboardLayout>
  );
}
