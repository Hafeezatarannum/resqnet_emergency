import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  Logo,
  Wordmark,
} from "@/components/resqnet/kit";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — ResQNet" }] }),
  component: About,
});

function About() {
  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="About ResQNet" />
      <Screen className="flex flex-col items-center text-center">
        <div className="mt-6">
          <Logo size={88} />
        </div>
        <Wordmark className="mt-4 text-2xl" />
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        <p className="mt-6 max-w-xs text-sm text-muted-foreground">
          ResQNet is an AI-powered real-time emergency response network that
          connects victims with nearby trained volunteers, provides AI first-aid
          guidance and escalates to ambulances when needed. Every second saves
          lives.
        </p>
      </Screen>
    </DashboardLayout>
  );
}
