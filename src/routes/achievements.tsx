import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  Stat,
} from "@/components/resqnet/kit";
import { BADGES } from "@/lib/resqnet-data";

export const Route = createFileRoute("/achievements")({
  head: () => ({ meta: [{ title: "Achievements — ResQNet" }] }),
  component: Achievements,
});

function Achievements() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Achievements" />
      <Screen>
        <GlassCard className="grid grid-cols-3 divide-x divide-border">
          <Stat value="243" label="Total helps" />
          <Stat value="12" label="Lives saved" />
          <Stat value="3" label="Badges" />
        </GlassCard>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {BADGES.map((b, i) => (
            <GlassCard
              key={i}
              className="flex flex-col items-center text-center"
            >
              <span className="text-3xl">{b.emoji}</span>
              <p className="mt-2 text-[11px] font-semibold">{b.name}</p>
            </GlassCard>
          ))}
        </div>
      </Screen>
    </DashboardLayout>
  );
}
