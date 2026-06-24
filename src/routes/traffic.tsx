import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  GlassCard,
} from "@/components/resqnet/kit";
import { MapMock } from "@/components/resqnet/widgets";

export const Route = createFileRoute("/traffic")({
  head: () => ({ meta: [{ title: "Traffic Overlay — ResQNet" }] }),
  component: Traffic,
});

function Traffic() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Traffic overlay" subtitle="Live road conditions" />
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 px-5 py-2">
        <MapMock className="h-full min-h-[380px]" />
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlassCard className="flex items-center justify-around text-xs font-medium">
          <span className="flex items-center gap-2">
            <span className="h-2 w-6 rounded bg-success" /> Clear
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-6 rounded bg-warning" /> Moderate
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-6 rounded bg-primary" /> Heavy
          </span>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
