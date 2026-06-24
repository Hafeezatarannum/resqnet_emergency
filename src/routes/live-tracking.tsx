import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  DashboardLayout,
  Aura,
  TopBar,
  GlowButton,
  GlassCard,
} from "@/components/resqnet/kit";
import { LiveMap } from "@/components/resqnet/LiveMap";
import { supabase } from "@/lib/supabase";
import { Share2, Navigation, PlayCircle, Loader2 } from "lucide-react";
import { useRef } from "react";
import { useAuth } from "@/lib/auth";
import { Geolocation } from "@capacitor/geolocation";

export const Route = createFileRoute("/live-tracking")({
  head: () => ({ meta: [{ title: "Live GPS Tracking — ResQNet" }] }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      sosId: search.sosId as string | undefined,
    };
  },
  component: LiveTracking,
});

function LiveTracking() {
  const { sosId } = Route.useSearch();
  const { user } = useAuth();
  
  const [victimLocation, setVictimLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [volunteerLocation, setVolunteerLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [deviceLocation, setDeviceLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [locationReady, setLocationReady] = useState(false);

  const [isTracking, setIsTracking] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [role, setRole] = useState<'victim' | 'volunteer' | null>(null);

  const channelRef = useRef<any>(null);
  const watchIdRef = useRef<string | null>(null);

  // ── ON MOUNT: get current location immediately to center the map ──────────
  useEffect(() => {
    const initLocation = async () => {
      try {
        // On web, Geolocation.requestPermissions() is a no-op so this is safe
        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });
        const myLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setDeviceLocation(myLocation);
        setVictimLocation(myLocation); // Temporarily center map
      } catch (err) {
        console.warn("Could not get initial location, using IP fallback:", err);
        // Try IP-based geolocation as a last resort
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          if (data.latitude && data.longitude) {
            setDeviceLocation({ lat: data.latitude, lng: data.longitude });
            setVictimLocation({ lat: data.latitude, lng: data.longitude });
          } else {
            setDeviceLocation({ lat: 28.6139, lng: 77.2090 });
            setVictimLocation({ lat: 28.6139, lng: 77.2090 }); // final fallback
          }
        } catch {
          setDeviceLocation({ lat: 28.6139, lng: 77.2090 });
          setVictimLocation({ lat: 28.6139, lng: 77.2090 }); // final fallback
        }
      } finally {
        setLocationReady(true);
      }
    };
    initLocation();
  }, []);

  // ── SOS CHANNEL & ROLE DETERMINATION ─────────────────────────────────────
  useEffect(() => {
    if (!sosId || !user) return;

    // 1. Determine role and load stored victim location from DB
    supabase
      .from("sos_events")
      .select("user_id, latitude, longitude")
      .eq("id", sosId)
      .single()
      .then(({ data }) => {
        if (data) {
          const isVictim = data.user_id === user.id;
          setRole(isVictim ? 'victim' : 'volunteer');
          
          if (data.latitude && data.longitude) {
            setVictimLocation({ lat: data.latitude, lng: data.longitude });
          }
        }
      });

    // 2. Subscribe to real-time location broadcasts
    channelRef.current = supabase.channel(`sos_channel_${sosId}`);
    channelRef.current
      .on('broadcast', { event: 'location_update' }, (payload: any) => {
        if (payload.payload) {
          const { lat, lng, senderRole } = payload.payload;
          if (senderRole === 'victim') setVictimLocation({ lat, lng });
          else if (senderRole === 'volunteer') setVolunteerLocation({ lat, lng });
        }
      })
      .subscribe();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      if (watchIdRef.current) {
        Geolocation.clearWatch({ id: watchIdRef.current });
        watchIdRef.current = null;
      }
    };
  }, [sosId, user]);

  // Sync volunteerLocation with deviceLocation once role is known
  useEffect(() => {
    if (role === 'volunteer' && deviceLocation && !volunteerLocation) {
      setVolunteerLocation(deviceLocation);
    }
  }, [role, deviceLocation, volunteerLocation]);

  // ── REAL DEVICE GPS TRACKING ──────────────────────────────────────────────
  const startRealTracking = async () => {
    setTrackingLoading(true);

    try {
      await Geolocation.requestPermissions();

      const watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 10000 },
        (position, err) => {
          if (err || !position) {
            console.error("Watch position error:", err);
            setTrackingLoading(false);
            setIsTracking(true);
            return;
          }

          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (role === 'victim' || !role) setVictimLocation(newLocation);
          else if (role === 'volunteer') setVolunteerLocation(newLocation);

          setIsTracking(true);
          setTrackingLoading(false);

          if (channelRef.current && channelRef.current.state === 'joined') {
            channelRef.current.send({
              type: 'broadcast',
              event: 'location_update',
              payload: {
                lat: newLocation.lat,
                lng: newLocation.lng,
                senderRole: role ?? 'victim',
                timestamp: new Date().toISOString(),
              },
            }).catch((e: any) => console.error("Broadcast failed:", e));
          }
        }
      );

      watchIdRef.current = watchId;
    } catch (error) {
      console.error("Error starting GPS watch:", error);
      setTrackingLoading(false);
      setIsTracking(true);
    }
  };

  // ── SIMULATOR (MOCK) ──────────────────────────────────────────────────────
  const startSimulation = () => {
    if (!victimLocation) return;
    setSimulating(true);
    let currentLat = volunteerLocation?.lat ?? (victimLocation.lat - 0.01);
    let currentLng = volunteerLocation?.lng ?? (victimLocation.lng - 0.01);
    const targetLat = victimLocation.lat;

    const interval = setInterval(() => {
      currentLat += 0.0005;
      currentLng += 0.0005;
      const newLoc = { lat: currentLat, lng: currentLng };
      setVolunteerLocation(newLoc);

      if (channelRef.current && channelRef.current.state === 'joined') {
        channelRef.current.send({
          type: 'broadcast',
          event: 'location_update',
          payload: { lat: newLoc.lat, lng: newLoc.lng, senderRole: 'volunteer', timestamp: new Date().toISOString() }
        }).catch((e: any) => console.error("Broadcast failed:", e));
      }

      if (currentLat >= targetLat + 0.01) {
        clearInterval(interval);
        setSimulating(false);
      }
    }, 2000);
  };

  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Live GPS Tracking" subtitle="Real-time Map" />
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-3">
        <div className="h-[300px] rounded-3xl overflow-hidden shadow-2xl border-2 border-border/50 bg-secondary/50">
          {locationReady ? (
            <LiveMap
              victimLocation={victimLocation || { lat: 13.0827, lng: 80.2707 }}
              volunteerLocation={volunteerLocation}
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-secondary/50">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Acquiring your location...</p>
            </div>
          )}
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-24 space-y-3">
        <GlassCard className="flex items-center gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-full ${isTracking ? 'bg-success/20 text-success animate-pulse' : 'bg-brand-blue/15 text-brand-blue'}`}>
            <Navigation className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold">
              {isTracking ? "Live Tracking Active" : (volunteerLocation ? "Volunteer Approaching" : "GPS Status")}
            </p>
            <p className="text-xs text-muted-foreground">
              {isTracking ? "Broadcasting your exact position" : (volunteerLocation ? "Volunteer is moving towards you" : "Ready to share location")}
            </p>
          </div>
        </GlassCard>

        <div className="flex gap-2">
          <GlowButton
            onClick={startRealTracking}
            disabled={isTracking || trackingLoading}
            className={`flex-1 ${isTracking ? 'opacity-50 cursor-not-allowed' : ''}`}
            icon={isTracking ? Navigation : Share2}
          >
            {trackingLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Locating...</>
            ) : isTracking ? (
              "Sharing Location..."
            ) : (
              "Share Live Location"
            )}
          </GlowButton>

          {/* Simulation button for testing */}
          {!simulating && !volunteerLocation && (
            <button
              onClick={startSimulation}
              className="px-4 bg-secondary border border-border rounded-xl flex items-center justify-center text-primary font-bold hover:bg-secondary/80 transition-colors"
              title="Test Live Tracking Simulation"
            >
              <PlayCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
