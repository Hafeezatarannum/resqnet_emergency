import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  GlowButton,
} from "@/components/resqnet/kit";
import { Timeline, type Step } from "@/components/resqnet/widgets";

export const Route = createFileRoute("/help-provided")({
  head: () => ({ meta: [{ title: "Help Provided — ResQNet" }] }),
  component: HelpProvided,
});

const STEPS: Step[] = [
  { label: "Accepted request", state: "done" },
  { label: "Reached victim", state: "done" },
  { label: "First aid provided", state: "active" },
  { label: "Help completed", state: "todo" },
];

function HelpProvided() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Help in progress" subtitle="Heart Attack • MG Road" />
      <Screen>
        <GlassCard className="mb-5">
          <p className="text-sm">
            Follow AI guidance and stabilise the victim until the ambulance
            arrives.
          </p>
        </GlassCard>
        <Timeline steps={STEPS} />
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlowButton to="/volunteer-history" variant="success">
          Complete
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
