import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/resqnet/kit";
import { ShieldAlert, X, CheckCircle2, Loader2, Navigation, Users, ShieldCheck, MapPin, Phone, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { createSosEvent, cancelSosEvent, getEmergencyContacts } from "@/lib/api/resqnet.api";
import { triggerEmergencySms } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Geolocation } from "@capacitor/geolocation";
export const Route = createFileRoute("/power-sos")({
  head: () => ({ meta: [{ title: "Emergency SOS — ResQNet" }] }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      auto: search.auto as boolean | undefined,
    };
  },
  component: SOSActivation,
});

function SOSActivation() {
  const { auto } = Route.useSearch();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activated, setActivated] = useState(auto || false);
  const [activeStep, setActiveStep] = useState(0);
  const [respondersFound, setRespondersFound] = useState(false);
  const [sosId, setSosId] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { user } = useAuth();
  
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  const steps = [
    { id: 0, label: "Finding Nearby Volunteers", icon: Users },
    { id: 1, label: "Sending Alert Details", icon: ShieldAlert },
    { id: 2, label: "Sharing Live Location", icon: Navigation },
    { id: 3, label: "Responders Accepted", icon: ShieldCheck },
  ];

  const handlePointerDown = () => {
    if (activated) return;
    setHolding(true);
    setProgress(0);
    
    // Increment progress over 3 seconds
    holdIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current!);
          setActivated(true);
          return 100;
        }
        return prev + (100 / (3000 / 50));
      });
    }, 50);
  };

  const handlePointerUp = () => {
    if (activated) return;
    setHolding(false);
    setProgress(0);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
  };

  useEffect(() => {
    if (activated) {
      setLocationStatus("loading");

      const triggerSos = async (latitude?: number, longitude?: number) => {
        // 1. Actually hit the Database!
        if (user) {
          createSosEvent({ 
            userId: user.id, 
            emergencyType: 'medical', 
            severity: 'critical',
            latitude,
            longitude
          }).then(({ id, error }) => {
            if (id) {
              setSosId(id);
              // Listen for a volunteer to accept this exact SOS
              supabase
                .channel(`sos_assignment_power_${id}`)
                .on(
                  'postgres_changes',
                  { event: 'INSERT', schema: 'public', table: 'volunteer_assignments', filter: `sos_id=eq.${id}` },
                  (payload) => {
                    // A volunteer accepted! Move UI to responders found
                    setActiveStep(4);
                    setRespondersFound(true);
                  }
                )
                .subscribe();
            }
            if (error) console.error("Failed to create SOS:", error);
          });

          // Fetch emergency contacts and trigger SMS
          getEmergencyContacts(user.id).then((contacts) => {
            const phones = contacts.map(c => c.phone).filter(Boolean);
            if (phones.length > 0) {
              triggerEmergencySms(phones, latitude, longitude);
            }
          });
        }

        // 2. Start looking for volunteers (Step 0)
        setActiveStep(0);

        // We need to wait for the SOS ID before listening
        // So we will set up the listener inside the .then() below.
      };

      const getLocation = async () => {
        try {
          await Geolocation.requestPermissions();
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
          });
          setLocationStatus("success");
          triggerSos(position.coords.latitude, position.coords.longitude);
        } catch (error) {
          console.error("Geolocation error:", error);
          setLocationStatus("error");
          triggerSos(); // Fallback without location
        }
      };

      getLocation();

      return () => { 
        timeoutsRef.current.forEach(clearTimeout); 
      };
    }
  }, [activated, user]);

  const handleCancel = async () => {
    if (sosId) {
      await cancelSosEvent(sosId);
    }
    setActivated(false);
    setRespondersFound(false);
    setActiveStep(0);
    setSosId(null);
  };

  return (
    <DashboardLayout withNav>
      <div className="flex flex-col min-h-[calc(100vh-100px)] w-full items-center justify-center p-4 md:p-8 relative pb-20">
        
        {!activated ? (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
            <h1 className="text-3xl font-bold mb-2">Emergency SOS</h1>
            <p className="text-muted-foreground mb-12 max-w-sm">
              Press and hold the button for 3 seconds to immediately alert authorities and your emergency contacts.
            </p>

            <div 
              className="relative select-none touch-none"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Progress Ring */}
              <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90 pointer-events-none">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-secondary"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-75 ease-linear"
                />
              </svg>

              <button 
                className={`
                  relative h-48 w-48 rounded-full flex flex-col items-center justify-center gap-2
                  transition-all duration-300 shadow-2xl
                  ${holding ? 'bg-primary scale-95 shadow-[0_0_60px_rgba(239,68,68,0.8)]' : 'bg-card border-4 border-primary/20 glow-red'}
                `}
              >
                <ShieldAlert className={`h-16 w-16 transition-colors ${holding ? 'text-white' : 'text-primary'}`} />
                <span className={`text-xl font-bold tracking-widest transition-colors ${holding ? 'text-white' : 'text-primary'}`}>SOS</span>
              </button>
            </div>

            <p className="mt-12 text-sm text-muted-foreground animate-pulse">
              {holding ? "Keep holding..." : "Voice Activation is also active."}
            </p>
          </div>
        ) : !respondersFound ? (
          <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-primary/30 rounded-3xl p-8 shadow-[0_0_100px_rgba(239,68,68,0.2)] animate-in slide-in-from-bottom-8 duration-500">
            {locationStatus === "loading" ? (
              <div className="text-center mb-8 animate-in fade-in zoom-in duration-300">
                <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                  <MapPin className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Acquiring GPS...</h2>
                <p className="text-muted-foreground text-sm mt-2">Please allow location access if prompted</p>
              </div>
            ) : (
              <div className="text-center mb-8 animate-in fade-in zoom-in duration-300">
                <div className="inline-flex h-16 w-16 rounded-full bg-primary/20 items-center justify-center mb-4">
                  <ShieldAlert className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-primary">SOS ACTIVATED</h2>
                <p className="text-muted-foreground text-sm mt-2">Connecting you with nearby volunteers...</p>
              </div>
            )}

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px before:h-[calc(100%-2rem)] before:w-0.5 before:bg-border before:z-0">
              {steps.map((step, idx) => {
                const isActive = activeStep === step.id;
                const isCompleted = activeStep > step.id;
                
                return (
                  <div key={step.id} className="relative z-10 flex items-center gap-4">
                    <div className={`
                      flex items-center justify-center w-9 h-9 rounded-full border-2 
                      ${isCompleted ? 'bg-success border-success text-white' : 
                        isActive ? 'bg-background border-primary text-primary shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 
                        'bg-background border-border text-muted-foreground'}
                    `}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                       isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                       <step.icon className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className={`font-semibold ${isActive ? 'text-foreground' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {isActive && <p className="text-xs text-primary animate-pulse">In progress...</p>}
                      {isCompleted && <p className="text-xs text-success">Completed</p>}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 pt-6 border-t border-border flex justify-center">
              <button 
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold transition-colors"
              >
                <X className="w-5 h-5" /> Cancel SOS
              </button>
            </div>
          </div>
        ) : (
          /* Match Found UI */
          <div className="w-full max-w-md flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-500">
            <div className="bg-success/10 border border-success/30 rounded-3xl p-6 text-center shadow-[0_0_100px_rgba(34,197,94,0.15)]">
               <div className="inline-flex h-16 w-16 rounded-full bg-success/20 items-center justify-center mb-4">
                 <ShieldCheck className="h-8 w-8 text-success" />
               </div>
               <h2 className="text-2xl font-bold text-success mb-1">Volunteers En Route</h2>
               <p className="text-sm font-medium text-foreground">Help will arrive in approximately <span className="font-bold text-success">4 minutes</span>.</p>
            </div>

            {/* Mock Map Area */}
            <div className="h-48 w-full bg-secondary/50 border border-border rounded-3xl relative overflow-hidden flex items-center justify-center">
               <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
               <div className="absolute top-1/4 left-1/4 h-4 w-4 bg-brand-blue rounded-full ring-4 ring-brand-blue/30 animate-pulse" />
               <div className="absolute top-1/3 right-1/4 h-4 w-4 bg-brand-blue rounded-full ring-4 ring-brand-blue/30 animate-pulse" />
               <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
               <p className="absolute bottom-3 right-4 text-xs font-bold bg-background/80 px-2 py-1 rounded-md backdrop-blur">Live Tracking</p>
            </div>

            {/* Responders List */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-muted-foreground px-2">Responding Volunteers (2)</h3>
              
              <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand-blue to-emerald-500 text-white flex items-center justify-center font-bold text-lg">VK</div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Vikram K. <span className="text-xs bg-success/10 text-success px-1.5 py-0.5 rounded-md ml-1 border border-success/20">Verified</span></p>
                  <p className="text-xs text-muted-foreground mt-0.5">EMT Basic • 1.2 km away</p>
                </div>
                <div className="flex gap-2">
                  <a href="tel:+919876543210" onClick={() => alert("Push notification triggered to Vikram K.!")} className="h-10 w-10 bg-success/10 text-success rounded-full flex items-center justify-center hover:bg-success/20 transition-colors">
                    <Phone className="h-4 w-4" />
                  </a>
                  <button className="h-10 w-10 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center hover:bg-brand-blue/20 transition-colors">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary text-foreground flex items-center justify-center font-bold text-lg">RS</div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Rahul S.</p>
                  <p className="text-xs text-muted-foreground mt-0.5">CPR Certified • 2.5 km away</p>
                </div>
                <div className="flex gap-2">
                  <a href="tel:+919876543210" onClick={() => alert("Push notification triggered to Rahul S.!")} className="h-10 w-10 bg-success/10 text-success rounded-full flex items-center justify-center hover:bg-success/20 transition-colors">
                    <Phone className="h-4 w-4" />
                  </a>
                  <button className="h-10 w-10 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center hover:bg-brand-blue/20 transition-colors">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCancel}
              className="w-full mt-4 py-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel Request
            </button>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
