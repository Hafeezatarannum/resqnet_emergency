import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/resqnet/kit";
import { ShieldAlert, MapPin, Activity, CheckCircle2, ChevronRight, Download } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Activity History — ResQNet" }] }),
  component: HistoryPage,
});

import { useAuth } from "@/lib/auth";
import { useRole } from "@/lib/role";
import { useEffect, useState } from "react";
import { getSosHistory, getVolunteerHistory, SosEvent } from "@/lib/api/resqnet.api";

function HistoryPage() {
  const { user } = useAuth();
  const { role } = useRole();
  const [events, setEvents] = useState<SosEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    if (role === "volunteer") {
      getVolunteerHistory(user.id).then(data => {
        setEvents(data);
        setLoading(false);
      });
    } else {
      getSosHistory(user.id).then(data => {
        setEvents(data);
        setLoading(false);
      });
    }
  }, [user, role]);

  return (
    <DashboardLayout withNav>
      <div className="max-w-[1000px] mx-auto p-4 md:p-8 w-full space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Activity History</h1>
            <p className="text-muted-foreground text-sm mt-1">Review your past SOS events, volunteer responses, and account activities.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary/80 hover:bg-secondary rounded-xl text-sm font-medium transition-colors border border-border shrink-0 w-fit">
            <Download className="w-4 h-4" /> Export Log
          </button>
        </div>

        <div className="bg-card/50 border border-border rounded-3xl p-4 md:p-8 min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-full pt-20">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 opacity-50">
              <CheckCircle2 className="h-12 w-12 mb-4" />
              <p>No activity history yet.</p>
            </div>
          ) : (
            <div className="relative before:absolute before:inset-0 before:ml-[1.75rem] md:before:ml-[2.25rem] before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border before:z-0">
              <div className="space-y-8 relative z-10">
                {events.map((item) => {
                  const isUser = role === "user";
                  const bg = isUser ? "bg-primary/10" : "bg-brand-blue/10";
                  const color = isUser ? "text-primary" : "text-brand-blue";
                  const border = isUser ? "border-primary/20" : "border-brand-blue/20";
                  const Icon = isUser ? ShieldAlert : Activity;
                  const title = isUser ? "Emergency SOS Triggered" : "Responded to SOS Alert";

                  return (
                    <div key={item.id} className="flex gap-4 md:gap-6 items-start group cursor-pointer">
                      <div className={`shrink-0 h-14 w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center border-4 border-background ${bg} ${color} shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 md:h-7 md:w-7" />
                      </div>
                      
                      <div className={`flex-1 bg-background border ${border} rounded-2xl p-4 md:p-5 shadow-sm group-hover:shadow-md transition-shadow relative`}>
                        {/* Tiny arrow pointing to timeline */}
                        <div className={`absolute top-6 -left-2 w-4 h-4 bg-background border-l border-b ${border} rotate-45 transform`} />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                          <h3 className="font-bold text-base md:text-lg">{title}</h3>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground w-fit">
                            {new Date(item.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium">
                          <MapPin className="h-3.5 w-3.5" /> {item.address || "Location unavailable"}
                        </div>
                        
                        <p className="text-sm text-foreground/80 leading-relaxed mb-4 uppercase font-bold text-muted-foreground">
                          Type: {item.emergency_type} • Status: {item.status}
                        </p>

                        <Link to={`/report/${item.id}`} className="flex items-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          View Full Report <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
