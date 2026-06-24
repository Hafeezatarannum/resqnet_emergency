import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  Screen,
  GlowButton,
} from "@/components/resqnet/kit";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/location-permission")({
  head: () => ({ meta: [{ title: "Location Access — ResQNet" }] }),
  component: LocationPermission,
});

function LocationPermission() {
  return (
    <DashboardLayout>
      <Aura />
      <Screen className="flex flex-col items-center justify-center text-center">
        <div className="relative grid h-44 w-44 place-items-center">
          <span className="absolute inset-0 rounded-full bg-brand-blue/20 animate-pulse-ring" />
          <span className="absolute inset-6 rounded-full bg-brand-blue/20 animate-pulse-ring [animation-delay:0.8s]" />
          <span className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-brand-blue/40">
            <MapPin className="h-12 w-12 text-white" />
          </span>
        </div>
        <h1 className="mt-10 text-2xl font-bold">Enable location access</h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          ResQNet needs your precise location to connect you with the nearest
          volunteers and share live tracking during an emergency.
        </p>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-5 pb-10">
        <GlowButton to="/notification-permission">Allow Location</GlowButton>
        <GlowButton to="/notification-permission" variant="ghost">
          Maybe later
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
