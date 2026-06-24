import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, Aura, TopBar } from "@/components/resqnet/kit";
import { MapMock } from "@/components/resqnet/widgets";

export const Route = createFileRoute("/heatmap")({
  head: () => ({ meta: [{ title: "Emergency Heatmap — ResQNet" }] }),
  component: Heatmap,
});

function Heatmap() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Emergency heatmap" subtitle="Hotspots in the last 24h" />
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 px-5 py-2">
        <MapMock route={false} className="h-full min-h-[420px]">
          <span className="absolute left-[20%] top-[30%] h-24 w-24 rounded-full bg-primary/40 blur-2xl" />
          <span className="absolute right-[18%] top-[45%] h-32 w-32 rounded-full bg-primary/50 blur-2xl" />
          <span className="absolute bottom-[18%] left-[40%] h-20 w-20 rounded-full bg-warning/40 blur-2xl" />
        </MapMock>
      </div>
    </DashboardLayout>
  );
}
