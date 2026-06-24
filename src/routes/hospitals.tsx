import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  Pill,
  GlowButton,
} from "@/components/resqnet/kit";
import { HOSPITALS } from "@/lib/resqnet-data";
import { Phone, Navigation } from "lucide-react";

export const Route = createFileRoute("/hospitals")({
  head: () => ({ meta: [{ title: "Nearby Hospitals — ResQNet" }] }),
  component: Hospitals,
});

function Hospitals() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Nearby hospitals" subtitle="Sorted by distance" />
      <Screen>
        <div className="space-y-3">
          {HOSPITALS.map((h, i) => (
            <GlassCard key={i}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{h.name}</p>
                <Pill tone="blue">{h.distance}</Pill>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{h.beds}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <GlowButton variant="success" icon={Phone} className="h-11">
                  Call
                </GlowButton>
                <GlowButton
                  variant="outline"
                  icon={Navigation}
                  className="h-11"
                >
                  Navigate
                </GlowButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </Screen>
    </DashboardLayout>
  );
}
