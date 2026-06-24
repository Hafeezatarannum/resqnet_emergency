import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout, Aura, GlassCard } from "@/components/resqnet/kit";
import { LeafletMap } from "@/components/resqnet/LeafletMap";
import {
  Navigation,
  Layers,
  Flame,
  MapPin,
  Search,
  Filter,
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { getLiveSosEvents, SosEvent, clearAllSosEvents } from "@/lib/api/resqnet.api";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "Live Map — ResQNet" }] }),
  component: MapScreen,
});

const TOOLS = [
  { icon: Navigation, label: "Route", to: "/route-navigation" },
  { icon: Layers, label: "Traffic", to: "/traffic" },
  { icon: Flame, label: "Heatmap", to: "/heatmap" },
  { icon: MapPin, label: "Resources", to: "/resources" },
];

function MapScreen() {
  const [alerts, setAlerts] = useState<SosEvent[]>([]);

  useEffect(() => {
    getLiveSosEvents().then((data) => {
      setAlerts(data);
    });

    const channel = supabase
      .channel('public:sos_events:map')
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

  // Convert SOS events into Map markers
  // MapMock center is roughly 13.0827, 80.2707. Let's map real coordinates.
  const dynamicMarkers = alerts.map((a) => ({
    lat: a.latitude || 13.0827 + (Math.random() - 0.5) * 0.02, 
    lng: a.longitude || 80.2707 + (Math.random() - 0.5) * 0.02,
    tone: "red" as const,
    label: "Help Needed"
  }));

  // Add the base static markers so the map doesn't look empty
  const allMarkers = [
    { lat: 13.078, lng: 80.265, tone: "blue" as const, label: "You (Chennai)" },
    { lat: 13.086, lng: 80.280, tone: "green" as const, label: "ResQ Fleet 1" },
    { lat: 13.075, lng: 80.275, tone: "green" as const, label: "ResQ Fleet 2" },
    ...dynamicMarkers
  ];

  return (
    <DashboardLayout withNav>
      <Aura />
      <div className="relative z-10 w-full max-w-[1400px] mx-auto p-6 md:p-8 h-screen flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Chennai Fleet Live Map</h1>
            <p className="text-muted-foreground">
              Monitor real-time incidents and responder locations.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Chennai locations..."
                className="pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <button 
              onClick={() => clearAllSosEvents()}
              className="p-2 border border-border bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20"
              title="Clear Test Data"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button className="p-2 border border-border bg-secondary/50 rounded-xl hover:bg-secondary">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
          {/* Main Map Area */}
          <div className="flex-1 border border-border rounded-3xl overflow-hidden relative shadow-2xl">
            <LeafletMap className="w-full h-full" markers={allMarkers} />

            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md border border-border p-2 rounded-2xl flex flex-col gap-2">
              <button className="h-10 w-10 bg-secondary rounded-xl flex items-center justify-center hover:bg-secondary/80">
                +
              </button>
              <button className="h-10 w-10 bg-secondary rounded-xl flex items-center justify-center hover:bg-secondary/80">
                -
              </button>
            </div>
          </div>

          {/* Side Panel for Tools & Info */}
          <div className="w-full md:w-80 flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              Map Layers
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {TOOLS.map((t) => (
                <Link
                  key={t.label}
                  to={t.to}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm font-medium hover:bg-secondary/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <t.icon className="h-5 w-5" />
                  </div>
                  {t.label}
                </Link>
              ))}
            </div>

            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              Live Route
            </h3>
            <GlassCard
              to="/alternate-route"
              className="flex items-center gap-3 p-5"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-success/15 text-success">
                <Navigation className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="font-bold">Faster route available</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Save 4 min via Ring Road. Traffic is clear.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-3 p-5 border-warning/30 bg-warning/5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-warning/15 text-warning">
                <Flame className="h-6 w-6 animate-pulse" />
              </span>
              <div className="flex-1">
                <p className="font-bold text-warning">High Risk Zone</p>
                <p className="text-sm text-warning/80 mt-1">
                  Multiple accidents reported ahead. Drive carefully.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
