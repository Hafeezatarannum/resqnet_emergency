import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  Logo,
  Wordmark,
  GlowButton,
} from "@/components/resqnet/kit";
import { SOSButton } from "@/components/resqnet/widgets";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Welcome — ResQNet" }] }),
  component: Welcome,
});

function Welcome() {
  return (
    <DashboardLayout>
      <Aura />
      <div className="relative z-10 w-full max-w-md mx-auto flex items-center gap-3 px-6 pt-10">
        <Logo size={44} />
        <Wordmark className="text-xl" />
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <SOSButton to="/onboarding" size={200} />
        <h1 className="mt-10 text-3xl font-bold text-balance">
          Help is closer than you think
        </h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground text-balance">
          Trigger an instant SOS and connect with nearby trained volunteers, AI
          first-aid guidance and live tracking.
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-6 pb-10">
        <GlowButton to="/onboarding">Get Started</GlowButton>
        <GlowButton to="/login" variant="ghost">
          I already have an account
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
