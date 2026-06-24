import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  Stat,
  Pill,
} from "@/components/resqnet/kit";
import { ALERTS_FEED } from "@/lib/resqnet-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/volunteer-dashboard")({
  head: () => ({ meta: [{ title: "Volunteer Dashboard — ResQNet" }] }),
  component: VolunteerDashboard,
});

function VolunteerDashboard() {
  const [online, setOnline] = useState(true);
  return (
    <DashboardLayout withNav>
      <Aura />
      <TopBar
        title="Volunteer dashboard"
        subtitle="Arjun Mehta"
        back={false}
        right={
          <button
            onClick={() => setOnline(!online)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold",
              online
                ? "bg-success/15 text-success"
                : "bg-white/10 text-muted-foreground",
            )}
          >
            {online ? "Online" : "Offline"}
          </button>
        }
      />
      <Screen>
        <GlassCard className="grid grid-cols-3 divide-x divide-border">
          <Stat value="243" label="Total helps" />
          <Stat value="4.9" label="Rating" />
          <Stat value="12" label="Lives saved" />
        </GlassCard>
        <h2 className="mb-3 mt-6 text-sm font-semibold text-muted-foreground">
          Recent alerts near you
        </h2>
        <div className="space-y-3">
          {ALERTS_FEED.map((a, i) => (
            <Link key={i} to="/incoming-alert" className="block">
              <GlassCard>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{a.type}</p>
                  <Pill tone={a.tone as "red"}>{a.time}</Pill>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.area}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </Screen>
    </DashboardLayout>
  );
}
