import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  Logo,
  Wordmark,
  GlowButton,
} from "@/components/resqnet/kit";
import { Share2 } from "lucide-react";

export const Route = createFileRoute("/share")({
  head: () => ({ meta: [{ title: "Share ResQNet" }] }),
  component: ShareApp,
});

function ShareApp() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Share app" />
      <Screen className="flex flex-col items-center text-center">
        <div className="mt-8">
          <Logo size={88} />
        </div>
        <Wordmark className="mt-4 text-2xl" />
        <h1 className="mt-6 text-xl font-bold">Invite friends & save lives</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          The more people on ResQNet, the faster help reaches everyone in your
          community.
        </p>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlowButton icon={Share2}>Share ResQNet</GlowButton>
      </div>
    </DashboardLayout>
  );
}
