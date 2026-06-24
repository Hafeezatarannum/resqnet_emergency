import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout, Aura, GlowButton } from "@/components/resqnet/kit";
import { Waveform } from "@/components/resqnet/widgets";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/voice-detected")({
  head: () => ({ meta: [{ title: "Voice Detected — ResQNet" }] }),
  component: VoiceDetected,
});

function VoiceDetected() {
  const [count, setCount] = useState(5);
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
        <span className="grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-10 w-10" />
        </span>
        <h1 className="mt-6 text-2xl font-bold">Voice command detected</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Triggering SOS in {count}s…
        </p>
        <div className="mt-8 w-56">
          <Waveform />
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-6 pb-10">
        <GlowButton onClick={() => navigate({ to: "/power-sos", search: { auto: true } })}>Send SOS Now</GlowButton>
        <GlowButton to="/home" variant="dark">
          Cancel
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
