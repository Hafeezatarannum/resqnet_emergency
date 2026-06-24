import { createFileRoute, Link } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
} from "@/components/resqnet/kit";
import { FIRST_AID } from "@/lib/resqnet-data";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/ai-first-aid")({
  head: () => ({ meta: [{ title: "AI First Aid — ResQNet" }] }),
  component: AiFirstAid,
});

function AiFirstAid() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="AI First Aid" subtitle="Step-by-step emergency guides" />
      <Screen>
        <div className="space-y-3">
          {FIRST_AID.map((f) => (
            <Link
              key={f.key}
              to={f.to}
              className="flex items-center gap-3 rounded-[20px] border border-border bg-white/[0.03] p-4 active:scale-[0.99] hover:border-primary/40"
            >
              <div className="flex-1">
                <p className="font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </Screen>
    </DashboardLayout>
  );
}
