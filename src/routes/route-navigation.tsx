import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  GlassCard,
  GlowButton,
} from "@/components/resqnet/kit";
import { LeafletMap } from "@/components/resqnet/LeafletMap";
import { CornerUpRight } from "lucide-react";

export const Route = createFileRoute("/route-navigation")({
  head: () => ({ meta: [{ title: "Route Navigation — ResQNet" }] }),
  component: RouteNavigation,
});

function RouteNavigation() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Turn-by-turn" subtitle="0.4 km • 2 min" />
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pt-1">
        <GlassCard className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-blue/15 text-brand-blue">
            <CornerUpRight className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold">Turn right onto MG Road</p>
            <p className="text-xs text-muted-foreground">in 200 m</p>
          </div>
        </GlassCard>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 px-5 py-3">
        <LeafletMap 
          className="h-full min-h-[340px]" 
          markers={[
            { lat: 13.0827, lng: 80.2707, tone: "blue", label: "You (Chennai)" },
            { lat: 13.0900, lng: 80.2800, tone: "red", label: "Help Needed" },
            { lat: 13.0860, lng: 80.2750, tone: "green", label: "ResQ Fleet 1" },
          ]}
        />
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlowButton to="/reached">End Navigation</GlowButton>
      </div>
    </DashboardLayout>
  );
}
