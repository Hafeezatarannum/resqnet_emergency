import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  Pill,
} from "@/components/resqnet/kit";
import { MapMock } from "@/components/resqnet/widgets";
import { FAMILY } from "@/lib/resqnet-data";
import { Phone, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/family-tracking")({
  head: () => ({ meta: [{ title: "Family Tracking — ResQNet" }] }),
  component: FamilyTracking,
});

function FamilyTracking() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar
        title="Family live tracking"
        subtitle="Everyone stays connected"
      />
      <Screen>
        <MapMock className="h-36" />
        <div className="mt-4 space-y-3">
          {FAMILY.map((f, i) => (
            <GlassCard key={i}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-blue/15 text-sm font-bold">
                  {f.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {f.relation} • {f.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-success/15 text-success">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-blue/15 text-brand-blue">
                    <MessageSquare className="h-4 w-4" />
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <Pill tone="green">{f.distance} away</Pill>
              </div>
            </GlassCard>
          ))}
        </div>
      </Screen>
    </DashboardLayout>
  );
}
