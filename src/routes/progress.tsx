import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlowButton,
  GlassCard,
} from "@/components/resqnet/kit";
import { Timeline, type Step } from "@/components/resqnet/widgets";
import { updateSosStatus } from "@/lib/api/resqnet.api";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "Emergency Progress — ResQNet" }] }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      sosId: search.sosId as string | undefined,
    };
  },
  component: Progress,
});

function Progress() {
  const { sosId } = Route.useSearch();
  const navigate = useNavigate();
  const [completing, setCompleting] = useState(false);
  const [volunteerName, setVolunteerName] = useState("A Volunteer");
  
  const STEPS: Step[] = [
    { label: "SOS Sent", time: "Just now", state: "done" },
    {
      label: "Volunteer Assigned",
      time: volunteerName,
      state: "done",
    },
    { label: "On The Way", time: "Live Tracking Active", state: "active" },
    { label: "Arrived", state: "todo" },
    { label: "Help Completed", state: "todo" },
  ];

  useEffect(() => {
    if (!sosId) return;

    // Fetch the assigned volunteer's name
    supabase
      .from("sos_assignments")
      .select("*, profiles(full_name)")
      .eq("sos_id", sosId)
      .single()
      .then(({ data }) => {
        // Handle PostgREST array join vs single object relation mapping quirks
        const profName = Array.isArray(data?.profiles) ? data?.profiles[0]?.full_name : data?.profiles?.full_name;
        if (profName) {
          setVolunteerName(profName);
        }
      });
  }, [sosId]);

  const handleComplete = async () => {
    setCompleting(true);
    if (sosId) {
      await updateSosStatus(sosId, 'completed');
    }
    navigate({ to: "/completed" });
  };

  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Emergency Progress" subtitle="Live status of your SOS" />
      <Screen>
        <GlassCard className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary animate-heartbeat">
            ●
          </span>
          <div className="flex-1">
            <p className="font-semibold">{volunteerName} is on the way</p>
            <p className="text-xs text-muted-foreground">
              Check live tracking for exact location
            </p>
          </div>
        </GlassCard>
        <Timeline steps={STEPS} />
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-5 pb-8">
        <GlowButton onClick={() => navigate({ to: "/live-tracking", search: { sosId } })}>View Live Tracking</GlowButton>
        <GlowButton onClick={handleComplete} variant="outline" disabled={completing}>
          {completing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Mark as Completed"}
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
