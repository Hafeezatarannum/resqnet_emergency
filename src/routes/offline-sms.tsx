import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlassCard,
  GlowButton,
} from "@/components/resqnet/kit";
import { WifiOff } from "lucide-react";

export const Route = createFileRoute("/offline-sms")({
  head: () => ({ meta: [{ title: "Offline SMS Mode — ResQNet" }] }),
  component: OfflineSms,
});

function OfflineSms() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Offline SMS mode" />
      <Screen className="flex flex-col items-center text-center">
        <span className="mt-6 grid h-24 w-24 place-items-center rounded-full bg-warning/15 text-warning">
          <WifiOff className="h-12 w-12" />
        </span>
        <h1 className="mt-6 text-xl font-bold">No internet connection</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          ResQNet can still send your SOS and live location to emergency
          contacts via SMS.
        </p>
        <GlassCard className="mt-6 w-full text-left text-xs text-muted-foreground">
          SMS will include your coordinates, emergency type and medical profile
          summary.
        </GlassCard>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlowButton to="/contacts-alerted">Send SMS Alert</GlowButton>
      </div>
    </DashboardLayout>
  );
}
