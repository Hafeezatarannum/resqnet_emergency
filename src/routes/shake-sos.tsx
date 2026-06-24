import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  GlowButton,
} from "@/components/resqnet/kit";
import { Activity, SmartphoneNfc } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/shake-sos")({
  head: () => ({ meta: [{ title: "Shake / Fall SOS — ResQNet" }] }),
  component: ShakeSos,
});

function ShakeSos() {
  const navigate = useNavigate();
  const [isArmed, setIsArmed] = useState(false);
  const [debugLog, setDebugLog] = useState<string>("Initializing Sensor...");

  useEffect(() => {
    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;
    
    // Threshold for detecting a violent shake or drop
    const threshold = 15; 

    const handleMotion = (event: DeviceMotionEvent) => {
      const currentX = event.accelerationIncludingGravity?.x;
      const currentY = event.accelerationIncludingGravity?.y;
      const currentZ = event.accelerationIncludingGravity?.z;

      if (currentX === null || currentY === null || currentZ === null) {
        setDebugLog("Sensor data missing.");
        return;
      }
      
      if (currentX === undefined || currentY === undefined || currentZ === undefined) return;

      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(currentX - lastX);
        const deltaY = Math.abs(currentY - lastY);
        const deltaZ = Math.abs(currentZ - lastZ);

        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
          // Fall / Shake detected!
          window.removeEventListener("devicemotion", handleMotion);
          navigate({ to: "/fall-detection" });
        }
      }

      lastX = currentX;
      lastY = currentY;
      lastZ = currentZ;
    };

    const enableSensor = async () => {
      // Some iOS devices require permission
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceMotionEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener("devicemotion", handleMotion);
            setIsArmed(true);
            setDebugLog("Sensor Armed! Drop or shake your phone violently.");
          } else {
            setDebugLog("Permission to use sensor was denied.");
          }
        } catch (error) {
          setDebugLog(`Sensor error: ${error}`);
        }
      } else {
        // Non-iOS or older devices that don't need explicit permission
        window.addEventListener("devicemotion", handleMotion);
        setIsArmed(true);
        setDebugLog("Sensor Armed! Drop or shake your phone violently.");
      }
    };

    enableSensor();

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [navigate]);

  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Shake / Fall SOS" subtitle={isArmed ? "Sensor Armed" : "Initializing..."} />
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative grid h-56 w-56 place-items-center">
          <span className="absolute inset-0 rounded-full bg-brand-blue/20 animate-pulse-ring" />
          <span className="absolute inset-8 rounded-full bg-brand-blue/20 animate-pulse-ring [animation-delay:0.8s]" />
          <span className="relative grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-blue-600 shadow-lg shadow-brand-blue/30">
            <SmartphoneNfc className="h-14 w-14 text-white" />
          </span>
        </div>
        <h1 className="mt-10 text-2xl font-bold">Device Armed</h1>
        <p className="mt-2 text-sm text-muted-foreground h-10 overflow-hidden italic">
          We're monitoring for violent shakes or drops...
        </p>

        {/* Debug Console */}
        <div className="mt-4 w-full bg-secondary/50 rounded-xl p-3 border border-border text-left">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Sensor Log</span>
          </div>
          <p className="text-xs text-foreground font-mono">{debugLog}</p>
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-6 pb-10">
        <GlowButton 
          onClick={() => navigate({ to: "/fall-detection" })} 
          className="bg-warning border-warning/50 text-white shadow-warning/20"
        >
          [Simulate Phone Drop]
        </GlowButton>
        <GlowButton to="/fall-detection">Trigger SOS Manually</GlowButton>
        <GlowButton to="/home" variant="ghost">
          Cancel
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
