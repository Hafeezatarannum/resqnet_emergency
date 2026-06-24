import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, TopBar, GlassCard } from "@/components/resqnet/kit";
import { LeafletMap } from "@/components/resqnet/LeafletMap";
import { useEffect, useState } from "react";
import { getSosEventById, SosEvent } from "@/lib/api/resqnet.api";
import { ShieldAlert, MapPin, CheckCircle2, Clock, CalendarDays, Activity } from "lucide-react";

export const Route = createFileRoute("/report/$sosId")({
  head: () => ({ meta: [{ title: "Incident Report — ResQNet" }] }),
  component: ReportPage,
});

function ReportPage() {
  const { sosId } = Route.useParams();
  const [event, setEvent] = useState<SosEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSosEventById(sosId).then((data) => {
      setEvent(data);
      setLoading(false);
    });
  }, [sosId]);

  if (loading) {
    return (
      <DashboardLayout>
        <TopBar title="Incident Report" backTo="/history" />
        <div className="flex justify-center items-center h-full pt-20">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <TopBar title="Incident Report" backTo="/history" />
        <div className="p-8 text-center text-muted-foreground">
          Incident not found.
        </div>
      </DashboardLayout>
    );
  }

  const marker = event.latitude && event.longitude 
    ? [{ lat: event.latitude, lng: event.longitude, tone: "red" as const, label: "Incident Location" }] 
    : [];

  return (
    <DashboardLayout>
      <TopBar title="Incident Report" backTo="/history" />
      
      <div className="max-w-xl mx-auto w-full p-4 space-y-6 pb-20 overflow-y-auto no-scrollbar">
        
        {/* Status Header */}
        <div className="flex flex-col items-center justify-center text-center py-6 bg-card border border-border rounded-3xl shadow-sm relative overflow-hidden">
          <div className={`absolute top-0 w-full h-1 ${
            event.status === 'active' ? 'bg-destructive' :
            event.status === 'completed' ? 'bg-success' : 'bg-muted-foreground'
          }`} />
          <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-3 ${
            event.status === 'active' ? 'bg-destructive/10 text-destructive' :
            event.status === 'completed' ? 'bg-success/10 text-success' : 'bg-secondary text-muted-foreground'
          }`}>
            {event.status === 'completed' ? <CheckCircle2 className="h-8 w-8" /> : 
             event.status === 'active' ? <Activity className="h-8 w-8" /> : 
             <ShieldAlert className="h-8 w-8" />}
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-widest">{event.status}</h1>
          <p className="text-sm text-muted-foreground mt-1">Incident ID: {event.id.split('-')[0]}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Emergency Type</span>
            <span className="font-semibold text-lg">{event.emergency_type || 'Unknown'}</span>
          </GlassCard>
          
          <GlassCard className="p-4 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-1"><Activity className="h-3 w-3" /> Severity</span>
            <span className={`font-semibold text-lg ${
              event.severity === 'high' ? 'text-destructive' : 
              event.severity === 'medium' ? 'text-warning' : 'text-success'
            }`}>{event.severity || 'Unknown'}</span>
          </GlassCard>

          <GlassCard className="p-4 flex flex-col gap-1 col-span-2">
            <span className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Date Logged</span>
            <span className="font-semibold">{new Date(event.created_at).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
          </GlassCard>
        </div>

        {/* Location Section */}
        {event.latitude && event.longitude && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase text-muted-foreground tracking-wider px-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Location Snapshot
            </h3>
            <GlassCard className="p-1 overflow-hidden">
              <LeafletMap 
                className="h-[200px] w-full rounded-2xl" 
                markers={marker} 
              />
              <div className="p-3 text-sm font-medium">
                {event.address || "Location mapped by GPS coordinates."}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Timeline (If Resolved) */}
        {event.resolved_at && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase text-muted-foreground tracking-wider px-2 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Resolution Timeline
            </h3>
            <GlassCard className="p-4 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">SOS Triggered:</span>
                <span className="font-semibold">{new Date(event.created_at).toLocaleTimeString([], { timeStyle: 'short' })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Resolved:</span>
                <span className="font-semibold">{new Date(event.resolved_at).toLocaleTimeString([], { timeStyle: 'short' })}</span>
              </div>
              <div className="h-px bg-border w-full" />
              <div className="flex justify-between items-center text-sm text-success">
                <span className="font-bold">Total Duration:</span>
                <span className="font-bold">
                  {Math.round((new Date(event.resolved_at).getTime() - new Date(event.created_at).getTime()) / 60000)} mins
                </span>
              </div>
            </GlassCard>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
