import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/resqnet/kit";
import { Medal, Star, ShieldCheck, Trophy, TrendingUp, Users } from "lucide-react";

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getVolunteerHistory, SosEvent } from "@/lib/api/resqnet.api";

export const Route = createFileRoute("/rewards")({
  head: () => ({ meta: [{ title: "Achievements — ResQNet" }] }),
  component: Rewards,
});

function Rewards() {
  const { user } = useAuth();
  const [history, setHistory] = useState<SosEvent[]>([]);

  useEffect(() => {
    if (!user) return;
    getVolunteerHistory(user.id).then(setHistory);
  }, [user]);

  // Calculate stats based on history length
  const impactScore = history.length * 100;
  const level = Math.floor(impactScore / 500) + 1;
  const pointsToNext = 500 - (impactScore % 500);
  const progressPercent = ((impactScore % 500) / 500) * 100;

  return (
    <DashboardLayout withNav>
      <div className="max-w-md mx-auto p-4 md:p-6 w-full space-y-6 pt-8 pb-20">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Medal className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Volunteer Achievements</h1>
            <p className="text-sm text-muted-foreground">Your impact on the community</p>
          </div>
        </div>

        {/* Level Card */}
        <div className="bg-gradient-to-tr from-brand-blue to-emerald-500 rounded-3xl p-6 text-white shadow-xl shadow-brand-blue/20 relative overflow-hidden">
          <Medal className="absolute -right-6 -bottom-6 h-32 w-32 opacity-20" />
          <div className="relative z-10 flex flex-col gap-1">
            <p className="font-bold text-sm text-white/80 uppercase tracking-widest">Current Rank</p>
            <h2 className="text-3xl font-extrabold flex items-center gap-2">
              Level {level} <ShieldCheck className="h-6 w-6" />
            </h2>
            <p className="text-sm mt-1">{pointsToNext} points to Level {level + 1}</p>
            
            <div className="w-full h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-3xl p-5 flex flex-col items-center justify-center text-center gap-2">
            <div className="h-10 w-10 rounded-full bg-success/10 text-success flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-xl">{impactScore.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground font-semibold">Impact Score</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-3xl p-5 flex flex-col items-center justify-center text-center gap-2">
            <div className="h-10 w-10 rounded-full bg-warning/10 text-warning flex items-center justify-center">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-xl">Top {Math.max(1, 100 - history.length * 5)}%</p>
              <p className="text-xs text-muted-foreground font-semibold">City Leaderboard</p>
            </div>
          </div>
        </div>

        {/* Badges Earned */}
        <div>
          <h3 className="text-sm font-bold text-muted-foreground px-2 mb-3">Badges Earned</h3>
          <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-4 p-4 border-b border-border">
              <div className="h-12 w-12 rounded-2xl bg-warning/10 text-warning flex items-center justify-center text-2xl border border-warning/20">
                ⭐
              </div>
              <div>
                <p className="font-bold text-sm">First Responder</p>
                <p className="text-xs text-muted-foreground">Completed your first emergency response.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border-b border-border">
              <div className="h-12 w-12 rounded-2xl bg-success/10 text-success flex items-center justify-center text-2xl border border-success/20">
                🛡️
              </div>
              <div>
                <p className="font-bold text-sm">Guardian Angel</p>
                <p className="text-xs text-muted-foreground">Saved 10 people in critical condition.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center text-2xl border border-brand-blue/20">
                ⚡
              </div>
              <div>
                <p className="font-bold text-sm">Lightning Fast</p>
                <p className="text-xs text-muted-foreground">Average response time under 5 minutes.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
