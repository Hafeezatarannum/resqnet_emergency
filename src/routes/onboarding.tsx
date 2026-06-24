import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout, Aura, GlowButton } from "@/components/resqnet/kit";
import { Zap, Users, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — ResQNet" }] }),
  component: Onboarding,
});

const SLIDES = [
  {
    icon: Zap,
    title: "One-Tap Emergency SOS",
    desc: "Instantly broadcast your location and emergency to nearby responders with a single tap — no calls, no delays.",
  },
  {
    icon: Users,
    title: "Nearby Volunteers",
    desc: "Trained volunteers near you are alerted in seconds and reach faster than traditional emergency services.",
  },
  {
    icon: Bot,
    title: "AI First-Aid Guidance",
    desc: "Get calm, step-by-step emergency instructions while help is on the way — CPR, bleeding control and more.",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const S = SLIDES[i];
  const next = () => (i < 2 ? setI(i + 1) : navigate({ to: "/language" }));
  return (
    <DashboardLayout>
      <Aura />
      <div className="relative z-10 w-full max-w-md mx-auto flex justify-end px-6 pt-8">
        <button
          onClick={() => navigate({ to: "/language" })}
          className="text-sm text-muted-foreground"
        >
          Skip
        </button>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="grid h-32 w-32 place-items-center rounded-[36px] bg-gradient-to-br from-primary/30 to-brand-blue/10 glow-red">
          <S.icon className="h-14 w-14 text-primary" />
        </div>
        <h1 className="mt-10 text-3xl font-bold text-balance">{S.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground text-balance">
          {S.desc}
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-6 pb-10">
        <div className="mb-6 flex justify-center gap-2">
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all",
                idx === i ? "w-6 bg-primary" : "w-1.5 bg-white/20",
              )}
            />
          ))}
        </div>
        <div className="flex gap-4">
          {i > 0 && (
            <button
              onClick={() => setI(i - 1)}
              className="flex-1 rounded-xl border border-border bg-card font-semibold text-muted-foreground hover:text-white transition-colors"
            >
              Back
            </button>
          )}
          <div className={i > 0 ? "flex-[2]" : "w-full"}>
            <GlowButton onClick={next} className="w-full">{i < 2 ? "Next" : "Get Started"}</GlowButton>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
