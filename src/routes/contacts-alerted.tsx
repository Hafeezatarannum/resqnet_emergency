import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  GlowButton,
  Pill,
} from "@/components/resqnet/kit";
import { FAMILY } from "@/lib/resqnet-data";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contacts-alerted")({
  head: () => ({ meta: [{ title: "Contacts Alerted — ResQNet" }] }),
  component: ContactsAlerted,
});

function ContactsAlerted() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar
        title="Emergency contacts alerted"
        subtitle="They received your live location"
      />
      <Screen>
        <div className="space-y-3">
          {FAMILY.map((f, i) => (
            <GlassCard key={i}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white/5 text-sm font-bold">
                  {f.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.relation}</p>
                </div>
                <Pill tone="green">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Notified
                </Pill>
              </div>
            </GlassCard>
          ))}
        </div>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlowButton to="/live-tracking">View Live Tracking</GlowButton>
      </div>
    </DashboardLayout>
  );
}
