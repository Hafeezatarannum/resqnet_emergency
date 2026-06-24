import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout, Aura, GlowButton } from "@/components/resqnet/kit";
import { Radar } from "@/components/resqnet/widgets";

export const Route = createFileRoute("/expanding-radius")({
  head: () => ({ meta: [{ title: "Expanding Search — ResQNet" }] }),
  component: ExpandingRadius,
});

const STEPS = ["2 km", "5 km", "10 km"];

function ExpandingRadius() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (i >= STEPS.length - 1) {
      const t = setTimeout(() => navigate({ to: "/no-volunteer" }), 1500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI((v) => v + 1), 1500);
    return () => clearTimeout(t);
  }, [i, navigate]);
  return (
    <DashboardLayout>
      <Aura />
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Radar size={260} />
        <h1 className="mt-8 text-2xl font-bold">Expanding search radius</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Looking further to find a responder…
        </p>
        <div className="mt-6 flex items-center gap-3">
          {STEPS.map((s, idx) => (
            <span
              key={s}
              className={
                idx <= i
                  ? "rounded-full bg-primary/15 px-4 py-2 text-sm font-bold text-primary"
                  : "rounded-full bg-white/5 px-4 py-2 text-sm text-muted-foreground"
              }
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-6 pb-10">
        <GlowButton to="/home" variant="dark">
          Cancel SOS
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
