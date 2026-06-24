import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, Aura, GlowButton } from "@/components/resqnet/kit";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/no-volunteer")({
  head: () => ({ meta: [{ title: "No Volunteer — ResQNet" }] }),
  component: NoVolunteer,
});

function NoVolunteer() {
  return (
    <DashboardLayout>
      <Aura />
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="grid h-24 w-24 place-items-center rounded-full bg-warning/15 text-warning animate-heartbeat">
          <AlertTriangle className="h-12 w-12" />
        </span>
        <h1 className="mt-6 text-2xl font-bold">No volunteer available</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Don’t worry — we’re escalating your emergency to an ambulance and
          alerting your contacts now.
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-6 pb-10">
        <GlowButton to="/ambulance">Book Ambulance</GlowButton>
        <GlowButton to="/contacts-alerted" variant="outline">
          Alert Emergency Contacts
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
