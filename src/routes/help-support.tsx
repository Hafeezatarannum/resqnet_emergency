import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  GlowButton,
} from "@/components/resqnet/kit";
import { FAQ } from "@/lib/resqnet-data";

export const Route = createFileRoute("/help-support")({
  head: () => ({ meta: [{ title: "Help & Support — ResQNet" }] }),
  component: HelpSupport,
});

function HelpSupport() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Help & support" />
      <Screen>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          FAQ
        </h2>
        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <GlassCard key={i}>
              <p className="font-semibold">{f.q}</p>
              <p className="mt-1 text-xs text-muted-foreground">{f.a}</p>
            </GlassCard>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <GlowButton variant="primary" className="h-12">
            Contact support
          </GlowButton>
          <GlowButton variant="outline" className="h-12">
            Report issue
          </GlowButton>
        </div>
      </Screen>
    </DashboardLayout>
  );
}
