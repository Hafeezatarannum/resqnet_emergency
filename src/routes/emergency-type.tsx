import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
} from "@/components/resqnet/kit";
import { EMERGENCY_TYPES } from "@/lib/resqnet-data";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/emergency-type")({
  head: () => ({ meta: [{ title: "Emergency Type — ResQNet" }] }),
  component: EmergencyType,
});

function EmergencyType() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar
        title="What's the emergency?"
        subtitle="Select to get the right help fast"
      />
      <Screen>
        <div className="space-y-3">
          {EMERGENCY_TYPES.map((t) => (
            <Link
              key={t.key}
              to="/severity"
              className="flex items-center gap-4 rounded-[20px] border border-border bg-white/[0.03] p-4 transition active:scale-[0.99] hover:border-primary/40"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-2xl">
                {t.emoji}
              </span>
              <span className="flex-1 text-base font-semibold">{t.label}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </Screen>
    </DashboardLayout>
  );
}
