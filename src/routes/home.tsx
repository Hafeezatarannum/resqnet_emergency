import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/resqnet/kit";
import { 
  Bot, 
  Users, 
  Map as MapIcon, 
  Clock, 
  ShieldCheck,
  Navigation,
  Star,
  Activity,
  AlertTriangle,
  Hospital,
  User,
  HeartPulse,
  Mic,
  SmartphoneNfc
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { useRole } from "@/lib/role";
import { cn } from "@/lib/utils";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/lib/auth";
import { getLiveSosEvents, acceptSosRequest, SosEvent } from "@/lib/api/resqnet.api";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — ResQNet" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { role } = useRole();
  const { user, loading } = useRequireAuth(); // 🔒 Redirect if not logged in

  if (loading) {
    return (
      <DashboardLayout withNav>
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout withNav>
      <div className="relative z-10 w-full max-w-md mx-auto p-4 md:p-6 space-y-6 pt-8 pb-20">
        {role === "volunteer" ? <VolunteerHome user={user} /> : <UserHome user={user} />}
      </div>
    </DashboardLayout>
  );
}

function UserHome({ user }: { user: ReturnType<typeof useAuth>['user'] }) {
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] 
    ?? user?.email?.split('@')[0] 
    ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting & Status */}
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{greeting}, {firstName} 👋</h1>
        <p className="text-muted-foreground">Current Status: <span className="text-success font-medium">Safe</span></p>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
          <MapIcon className="h-3 w-3" /> Locating...
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Link to="/power-sos" className="col-span-2 flex flex-col items-center justify-center bg-primary text-white border border-primary/20 rounded-3xl p-6 transition-all active:scale-95 shadow-xl shadow-primary/30 aspect-[3/1] gap-2">
          <AlertTriangle className="h-8 w-8 animate-pulse" />
          <span className="font-bold text-lg">Trigger SOS</span>
        </Link>
        <Link to="/voice-sos" className="col-span-2 flex items-center justify-between bg-card border border-border rounded-2xl p-4 hover:bg-secondary transition-colors shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
              <Mic className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm">Voice SOS</span>
              <span className="text-xs text-muted-foreground">Say "Help" to trigger</span>
            </div>
          </div>
          <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">→</span>
          </div>
        </Link>
        <Link to="/shake-sos" className="col-span-2 flex items-center justify-between bg-card border border-border rounded-2xl p-4 hover:bg-secondary transition-colors shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
              <SmartphoneNfc className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm">Fall / Shake SOS</span>
              <span className="text-xs text-muted-foreground">Drop phone to trigger</span>
            </div>
          </div>
          <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">→</span>
          </div>
        </Link>
        <Link to="/searching" className="flex flex-col items-center justify-center bg-card border border-border rounded-3xl p-6 hover:bg-secondary transition-colors aspect-square gap-3">
          <div className="h-12 w-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <span className="font-semibold text-sm text-center">Find<br/>Volunteers</span>
        </Link>
        <Link to="/hospitals" className="flex flex-col items-center justify-center bg-card border border-border rounded-3xl p-6 hover:bg-secondary transition-colors aspect-square gap-3">
          <div className="h-12 w-12 rounded-full bg-success/10 text-success flex items-center justify-center">
            <Hospital className="h-6 w-6" />
          </div>
          <span className="font-semibold text-sm text-center">Nearby<br/>Hospitals</span>
        </Link>
        <Link to="/contacts-setup" className="flex flex-col items-center justify-center bg-card border border-border rounded-3xl p-6 hover:bg-secondary transition-colors aspect-square gap-3">
          <div className="h-12 w-12 rounded-full bg-secondary text-foreground flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <span className="font-semibold text-sm text-center">Emergency<br/>Contacts</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center bg-card border border-border rounded-3xl p-6 hover:bg-secondary transition-colors aspect-square gap-3">
          <div className="h-12 w-12 rounded-full bg-secondary text-foreground flex items-center justify-center">
            <HeartPulse className="h-6 w-6" />
          </div>
          <span className="font-semibold text-sm text-center">Medical<br/>Profile</span>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="mt-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">Recent Activity</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-secondary flex items-center justify-center">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">System Check</p>
              <p className="text-xs text-muted-foreground truncate">All systems operational</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">2h ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VolunteerHome({ user }: { user: ReturnType<typeof useAuth>['user'] }) {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const [alerts, setAlerts] = useState<SosEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    // Only listen if they are available
    if (!isAvailable) {
      setAlerts([]);
      return;
    }

    setLoading(true);
    getLiveSosEvents().then((data) => {
      setAlerts(data);
      setLoading(false);
    });

    const channel = supabase
      .channel('public:sos_events:home')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_events' }, (payload) => {
        if (payload.new.status === 'active') {
          setAlerts((prev) => [payload.new as SosEvent, ...prev]);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sos_events' }, (payload) => {
        if (payload.new.status !== 'active') {
          setAlerts((prev) => prev.filter(a => a.id !== payload.new.id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); }
  }, [isAvailable]);

  const handleAccept = async (sosId: string) => {
    if (!user) return;
    setAcceptingId(sosId);
    const { error } = await acceptSosRequest(sosId, user.id);
    if (!error) {
      navigate({ to: "/live-tracking", search: { sosId } });
    } else {
      console.error(error);
      setAcceptingId(null);
    }
  };

  const visibleAlerts = alerts.filter(a => !dismissedIds.includes(a.id));

  return (
    <div className="flex flex-col gap-6">
      {/* Volunteer Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">First Responder Mode</p>
        </div>
        <div 
          onClick={() => setIsAvailable(!isAvailable)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors border ${isAvailable ? 'bg-success/10 border-success/30 text-success' : 'bg-secondary border-border text-muted-foreground'}`}
        >
          <div className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
          <span className="text-xs font-bold">{isAvailable ? 'Available' : 'Offline'}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground">Cases Assigned</span>
          </div>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-brand-blue" />
            <span className="text-xs font-semibold text-muted-foreground">People Helped</span>
          </div>
          <p className="text-2xl font-bold">45</p>
        </div>
        <div className="col-span-2 bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-xs font-semibold text-muted-foreground">Avg. Response Time</span>
          </div>
          <p className="font-bold">4.2 mins</p>
        </div>
      </div>

      {/* Active Emergencies */}
      <div>
        <div className="flex items-center justify-between mb-3 px-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Nearby Emergencies</h2>
          {isAvailable && visibleAlerts.length > 0 && <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{visibleAlerts.length} Active</span>}
        </div>
        
        {isAvailable ? (
          loading ? (
            <div className="bg-secondary/30 border border-border rounded-3xl p-8 flex flex-col items-center justify-center">
              <span className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></span>
              <p className="text-sm text-muted-foreground">Scanning for emergencies...</p>
            </div>
          ) : visibleAlerts.length === 0 ? (
            <div className="bg-success/5 border border-success/20 border-dashed rounded-3xl p-8 flex flex-col items-center text-center gap-2">
              <ShieldCheck className="h-8 w-8 text-success/60" />
              <p className="text-sm font-medium text-success/80 mt-2">All clear right now.</p>
              <p className="text-xs text-muted-foreground">Listening for incoming alerts.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {visibleAlerts.map((alert) => (
                <div key={alert.id} className="bg-primary/5 border border-primary/20 rounded-3xl p-5 flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="animate-pulse h-2 w-2 rounded-full bg-primary block" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-lg">{alert.emergency_type || "Medical Emergency"}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.ai_context?.summary || "Immediate assistance requested."}
                    </p>
                  </div>
                  
                  <div className="flex gap-3 mt-2">
                    <button 
                      onClick={() => handleAccept(alert.id)}
                      disabled={acceptingId === alert.id}
                      className="flex-1 flex justify-center items-center bg-primary text-white font-bold h-12 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      {acceptingId === alert.id ? "Accepting..." : "Accept"}
                    </button>
                    <button 
                      onClick={() => setDismissedIds(prev => [...prev, alert.id])}
                      className="flex-1 bg-secondary text-foreground font-bold h-12 rounded-2xl active:scale-95 transition-transform"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-secondary/30 border border-border border-dashed rounded-3xl p-8 flex flex-col items-center text-center gap-2">
            <ShieldCheck className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground mt-2">You are currently offline.</p>
            <p className="text-xs text-muted-foreground">Toggle your availability to receive emergency alerts.</p>
          </div>
        )}
      </div>
      
      {/* Response History */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-3 px-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Recent Missions</h2>
          <Link to="/history" className="text-xs font-semibold text-primary">View All</Link>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-4 opacity-75 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="h-10 w-10 shrink-0 rounded-full bg-success/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">First Aid Provided</p>
              <p className="text-xs text-muted-foreground truncate">Jayanagar, Bangalore</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0 font-medium bg-secondary px-2 py-1 rounded-md">2d ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
