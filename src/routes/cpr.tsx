import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlowButton,
  GlassCard,
} from "@/components/resqnet/kit";
import { CPR_STEPS } from "@/lib/resqnet-data";
import { Volume2 } from "lucide-react";

export const Route = createFileRoute("/cpr")({
  head: () => ({ meta: [{ title: "CPR Guidance — ResQNet" }] }),
  component: Cpr,
});

function Cpr() {
  const [i, setI] = useState(0);
  const s = CPR_STEPS[i];
  return (
    <DashboardLayout>
      <Aura />
      <TopBar
        title="CPR guidance"
        subtitle={`Step ${i + 1} of ${CPR_STEPS.length}`}
        right={
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary">
            <Volume2 className="h-4 w-4" />
          </span>
        }
      />
      <Screen>
        <GlassCard className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-2xl font-bold text-primary">
            {i + 1}
          </div>
          <h2 className="mt-4 text-xl font-bold">{s.t}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
        </GlassCard>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        {i < CPR_STEPS.length - 1 ? (
          <GlowButton onClick={() => setI(i + 1)}>Next Step</GlowButton>
        ) : (
          <GlowButton to="/ai-guidance-active">Finish Guide</GlowButton>
        )}
      </div>
    </DashboardLayout>
  );
}
