import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout, Aura, GlowButton } from "@/components/resqnet/kit";
import { Radar } from "@/components/resqnet/widgets";
import { useAuth } from "@/lib/auth";
import { createSosEvent, cancelSosEvent, getEmergencyContacts } from "@/lib/api/resqnet.api";
import { triggerEmergencySms } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Geolocation } from "@capacitor/geolocation";

export const Route = createFileRoute("/searching")({
  head: () => ({ meta: [{ title: "Searching Volunteers — ResQNet" }] }),
  component: Searching,
});

function Searching() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sosId, setSosId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let channel: any;

    async function initSos(lat?: number, lng?: number) {
      if (!user) return;
      const { id, error } = await createSosEvent({
        userId: user.id,
        emergencyType: "medical",
        severity: "critical",
        latitude: lat,
        longitude: lng,
      });
      
      if (id) {
        setSosId(id);
        
        // Fetch emergency contacts and trigger SMS
        getEmergencyContacts(user.id).then((contacts) => {
          const phones = contacts.map(c => c.phone).filter(Boolean);
          if (phones.length > 0) {
            triggerEmergencySms(phones, lat, lng);
          }
        });

        // Real-time listener for when a volunteer accepts the SOS!
        channel = supabase
          .channel(`sos_assignment_${id}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'volunteer_assignments', filter: `sos_id=eq.${id}` },
            (payload) => {
              // A volunteer accepted! Navigate to the found screen
              navigate({ to: "/volunteers-found", search: { sosId: id } });
            }
          )
          .subscribe();
      } else {
        console.error("Failed to create SOS:", error);
      }
    }

    async function getLocationAndInit() {
      try {
        await Geolocation.requestPermissions();
        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });
        initSos(pos.coords.latitude, pos.coords.longitude);
      } catch (error) {
        console.error("Geolocation error:", error);
        initSos(); // Fallback without location
      }
    }

    getLocationAndInit();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  const handleCancel = async () => {
    setCancelling(true);
    if (sosId) {
      await cancelSosEvent(sosId);
    }
    navigate({ to: "/home" });
  };

  return (
    <DashboardLayout>
      <Aura />
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Radar size={280} />
        <h1 className="mt-10 text-2xl font-bold">
          Searching nearby volunteers…
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Broadcasting your SOS within 2 km radius
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-success/15 px-4 py-2 text-sm font-semibold text-success">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Waiting for volunteer to accept...
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-6 pb-10 flex flex-col gap-3">
        <GlowButton onClick={handleCancel} variant="dark" disabled={cancelling}>
          {cancelling ? <Loader2 className="h-5 w-5 animate-spin" /> : "Cancel SOS"}
        </GlowButton>
        
        {/* Hidden button to simulate a volunteer accepting the SOS so the user can test the UI by themselves */}
        {sosId && (
          <button 
            onClick={() => navigate({ to: "/volunteers-found", search: { sosId } })}
            className="text-xs text-muted-foreground hover:text-primary transition-colors mt-2"
          >
            [Dev: Force Simulate Match]
          </button>
        )}
      </div>
    </DashboardLayout>
  );
}
