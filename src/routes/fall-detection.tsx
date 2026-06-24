import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout, Aura, GlowButton } from "@/components/resqnet/kit";
import { PersonStanding, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/fall-detection")({
  head: () => ({ meta: [{ title: "Fall Detected — ResQNet" }] }),
  component: FallDetection,
});

function FallDetection() {
  const [count, setCount] = useState(15);
  const navigate = useNavigate();
  useEffect(() => {
    if (count <= 0) {
      navigate({ to: "/power-sos", search: { auto: true } });
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);
  return (
    <DashboardLayout>
      <Aura />
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-warning/15 text-warning animate-heartbeat">
          <AlertTriangle className="h-10 w-10" />
        </span>
        <h1 className="mt-6 text-2xl font-bold">Fall / crash detected</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sending SOS automatically in
        </p>
        <div className="mt-6 grid h-36 w-36 place-items-center rounded-full border-4 border-primary glow-red">
          <span className="text-5xl font-extrabold">{count}</span>
        </div>
        <PersonStanding className="mt-6 h-8 w-8 text-muted-foreground" />
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-6 pb-10">
        <GlowButton to="/home" variant="success">
          I’m Okay
        </GlowButton>
        <GlowButton onClick={() => navigate({ to: "/power-sos", search: { auto: true } })}>Send SOS Now</GlowButton>
      </div>
    </DashboardLayout>
  );
}
