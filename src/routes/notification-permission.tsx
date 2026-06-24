import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  Screen,
  GlowButton,
} from "@/components/resqnet/kit";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/notification-permission")({
  head: () => ({ meta: [{ title: "Notifications — ResQNet" }] }),
  component: NotificationPermission,
});

function NotificationPermission() {
  return (
    <DashboardLayout>
      <Aura />
      <Screen className="flex flex-col items-center justify-center text-center">
        <div className="relative grid h-44 w-44 place-items-center">
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
          <span className="absolute inset-6 rounded-full bg-primary/20 animate-pulse-ring [animation-delay:0.8s]" />
          <span className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary to-[#b71721] glow-red">
            <Bell className="h-12 w-12 text-white animate-heartbeat" />
          </span>
        </div>
        <h1 className="mt-10 text-2xl font-bold">Stay alert, save lives</h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          Get instant alerts when someone nearby needs help, when a volunteer is
          assigned, and emergency status updates.
        </p>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-5 pb-10">
        <GlowButton to="/home">Enable Notifications</GlowButton>
        <GlowButton to="/home" variant="ghost">
          Skip for now
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
