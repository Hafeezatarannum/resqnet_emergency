import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { DashboardLayout, Aura, GlowButton } from "@/components/resqnet/kit";
import { Radar } from "@/components/resqnet/widgets";

export const Route = createFileRoute("/no-response")({
  head: () => ({ meta: [{ title: "No Response Detected — ResQNet" }] }),
  component: NoResponse,
});

function NoResponse() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/auto-sos-sent" }), 3500);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <DashboardLayout>
      <Aura />
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Radar size={240} />
        <h1 className="mt-8 text-2xl font-bold">No response detected</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          You didn’t respond to the safety check. Auto-triggering SOS to keep
          you safe…
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-6 pb-10">
        <GlowButton to="/home" variant="dark">
          I’m Okay, Cancel
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
