import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout, Aura, GlowButton } from "@/components/resqnet/kit";
import { Bell, Search, Filter, Loader2, MapPin, Trash2 } from "lucide-react";
import { getLiveSosEvents, acceptSosRequest, SosEvent, clearAllSosEvents } from "@/lib/api/resqnet.api";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts — ResQNet" }] }),
  component: Alerts,
});

function Alerts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SosEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    getLiveSosEvents().then((data) => {
      setAlerts(data);
      setLoading(false);
    });

    const channel = supabase
      .channel('public:sos_events')
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
  }, []);

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
    <DashboardLayout withNav>
      <Aura />
      <div className="relative z-10 w-full max-w-[1400px] mx-auto p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="h-10 w-10 bg-warning/20 text-warning rounded-xl flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </span>
              Emergency Alerts
            </h1>
            <p className="text-muted-foreground mt-2">
              Live monitoring of incidents in your area.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search alerts..."
                className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <button 
              onClick={() => clearAllSosEvents()}
              className="p-2 border border-border bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20"
              title="Clear Test Data"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button className="p-2 border border-border bg-card rounded-xl hover:bg-secondary transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          ) : visibleAlerts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <Bell className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-xl font-bold mb-2">No active alerts</h3>
              <p className="text-muted-foreground">Your area is currently safe.</p>
            </div>
          ) : (
            visibleAlerts.map((a) => {
              const isCritical = a.severity === 'critical';
              return (
                <div
                  key={a.id}
                  className="flex flex-col bg-card border border-border rounded-3xl p-6 hover:border-primary/30 transition-colors shadow-lg animate-in fade-in zoom-in duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        isCritical
                          ? "bg-primary/20 text-primary"
                          : "bg-warning/20 text-warning"
                      }`}
                    >
                      <Bell
                        className={`h-6 w-6 ${isCritical ? "animate-pulse" : ""}`}
                      />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isCritical
                          ? "bg-primary text-white"
                          : "bg-warning text-white"
                      }`}
                    >
                      {new Date(a.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-1 uppercase">{a.emergency_type} EMERGENCY</h3>
                  
                  {a.latitude && a.longitude ? (
                    <a 
                      href={`https://maps.google.com/?q=${a.latitude},${a.longitude}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm text-primary mb-6 flex items-center gap-1 hover:underline"
                    >
                      <MapPin className="h-4 w-4" /> Live Location Available
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                      {a.address || 'Location unknown'}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button
                      onClick={() => handleAccept(a.id)}
                      disabled={acceptingId === a.id}
                      className={`h-12 w-full text-sm font-semibold rounded-xl flex items-center justify-center ${
                        isCritical ? 'bg-primary text-white hover:bg-primary/90' : 'bg-transparent border border-primary text-primary hover:bg-primary/10'
                      }`}
                    >
                      {acceptingId === a.id ? <Loader2 className="h-5 w-5 animate-spin" /> : "I can help"}
                    </button>
                    <button
                      onClick={() => setDismissedIds(prev => [...prev, a.id])}
                      className="h-12 w-full text-sm font-semibold bg-secondary/50 rounded-xl hover:bg-secondary transition-colors text-foreground"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
