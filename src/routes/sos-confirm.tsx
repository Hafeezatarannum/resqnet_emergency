import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout, Aura, GlowButton } from "@/components/resqnet/kit";

export const Route = createFileRoute("/sos-confirm")({
  head: () => ({ meta: [{ title: "Confirm SOS — ResQNet" }] }),
  component: SosConfirm,
});

function SosConfirm() {
  const [count, setCount] = useState(10);
  const navigate = useNavigate();
  useEffect(() => {
    if (count <= 0) {
      navigate({ to: "/searching" });
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);
  return (
    <DashboardLayout>
      <Aura />
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Sending SOS in
        </p>
        <div className="relative mt-6 grid h-56 w-56 place-items-center">
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
          <span className="relative grid h-44 w-44 place-items-center rounded-full bg-gradient-to-br from-[#ff4d4f] to-[#b71721] glow-red animate-sos">
            <span className="text-6xl font-extrabold">{count}</span>
          </span>
        </div>
        <p className="mt-8 max-w-xs text-sm text-muted-foreground">
          Your location and emergency details will be sent to nearby volunteers
          and emergency contacts.
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-6 pb-10">
        <GlowButton to="/searching">Send SOS Now</GlowButton>
        <GlowButton to="/home" variant="dark">
          Cancel SOS
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
