import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  Pill,
} from "@/components/resqnet/kit";
import { NOTIFICATIONS } from "@/lib/resqnet-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — ResQNet" }] }),
  component: Notifications,
});

function Notifications() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Notifications" />
      <Screen>
        <div className="space-y-3">
          {NOTIFICATIONS.map((n, i) => (
            <GlassCard key={i}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{n.title}</p>
                <Pill tone={n.tone as "red"}>{n.time}</Pill>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
            </GlassCard>
          ))}
        </div>
      </Screen>
    </DashboardLayout>
  );
}
