import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlowButton,
  Pill,
} from "@/components/resqnet/kit";
import { VolunteerCard } from "@/components/resqnet/widgets";
import { VOLUNTEERS } from "@/lib/resqnet-data";
import { updateSosStatus } from "@/lib/api/resqnet.api";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/volunteers-found")({
  head: () => ({ meta: [{ title: "Volunteers Found — ResQNet" }] }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      sosId: search.sosId as string | undefined,
    };
  },
  component: VolunteersFound,
});

function VolunteersFound() {
  const { sosId } = Route.useSearch();
  const navigate = useNavigate();
  const [assigning, setAssigning] = useState(false);

  const handleAssign = async () => {
    setAssigning(true);
    if (sosId) {
      await updateSosStatus(sosId, 'assigned');
    }
    navigate({ to: "/volunteer-assigned", search: { sosId } });
  };

  return (
    <DashboardLayout>
      <Aura />
      <TopBar
        title="Volunteers found"
        subtitle={`${VOLUNTEERS.length} responders nearby`}
        back={false}
      />
      <Screen>
        <div className="mb-3 flex items-center gap-2">
          <Pill tone="green">Assigning best volunteer…</Pill>
        </div>
        <div className="space-y-3">
          {VOLUNTEERS.map((v, i) => (
            <VolunteerCard key={i} v={v} />
          ))}
        </div>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlowButton onClick={handleAssign} disabled={assigning}>
          {assigning ? <Loader2 className="h-5 w-5 animate-spin" /> : "Assign Arjun Mehta (closest)"}
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
