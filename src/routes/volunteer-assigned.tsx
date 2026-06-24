import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlowButton,
  GlassCard,
  Rating,
  Stat,
} from "@/components/resqnet/kit";
import { LiveMap } from "@/components/resqnet/LiveMap";
import { Phone, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/volunteer-assigned")({
  head: () => ({ meta: [{ title: "Volunteer Assigned — ResQNet" }] }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      sosId: search.sosId as string | undefined,
    };
  },
  component: VolunteerAssigned,
});

function VolunteerAssigned() {
  const { sosId } = Route.useSearch();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Aura />
      <TopBar
        title="Volunteer assigned"
        subtitle="Help is on the way"
        back={false}
      />
      <Screen>
        <div className="h-40 rounded-2xl overflow-hidden pointer-events-none">
          <LiveMap 
            victimLocation={{ lat: 28.6139, lng: 77.2090 }} 
            volunteerLocation={{ lat: 28.6180, lng: 77.2050 }} 
          />
        </div>
        <GlassCard className="mt-4">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand-blue/40 to-brand-blue/10 text-lg font-bold">
              AM
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold">Arjun Mehta</p>
              <p className="text-xs text-muted-foreground">
                Paramedic • Certified responder
              </p>
            </div>
            <Rating value={4.9} />
          </div>
          <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-2xl bg-white/[0.03] py-3">
            <Stat value="0.4 km" label="Distance" />
            <Stat value="2 min" label="ETA" />
            <Stat value="240+" label="Helps" />
          </div>
        </GlassCard>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <GlowButton variant="success" icon={Phone}>
            Call
          </GlowButton>
          <GlowButton variant="outline" icon={MessageSquare}>
            Chat
          </GlowButton>
        </div>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlowButton onClick={() => navigate({ to: "/progress", search: { sosId } })}>
          Track Progress
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
