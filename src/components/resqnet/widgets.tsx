import { Link } from "@tanstack/react-router";
import { Phone, MessageSquare, Navigation, MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard, Rating, Pill } from "./kit";
import type { ReactNode } from "react";

/* Glowing SOS button */
export function SOSButton({
  to = "/emergency-type",
  size = 220,
}: {
  to?: string;
  size?: number;
}) {
  return (
    <Link
      to={to}
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
      <span className="absolute inset-4 rounded-full bg-primary/25 animate-pulse-ring [animation-delay:0.8s]" />
      <span
        className="relative grid place-items-center rounded-full bg-gradient-to-br from-[#ff4d4f] to-[#b71721] text-white animate-sos"
        style={{ width: size * 0.62, height: size * 0.62 }}
      >
        <span className="text-3xl font-extrabold tracking-wider">SOS</span>
      </span>
    </Link>
  );
}

/* Radar pulse for searching volunteers */
export function Radar({ size = 260 }: { size?: number }) {
  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute rounded-full border border-brand-blue/40 animate-pulse-ring"
          style={{ width: size, height: size, animationDelay: `${i * 0.8}s` }}
        />
      ))}
      <div
        className="relative grid place-items-center overflow-hidden rounded-full border border-brand-blue/30 bg-brand-blue/5"
        style={{ width: size * 0.8, height: size * 0.8 }}
      >
        <div
          className="absolute inset-0 animate-radar"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(59,130,246,0.45) 60deg, transparent 90deg)",
          }}
        />
        <span className="relative grid h-14 w-14 place-items-center rounded-full bg-primary glow-red">
          <MapPin className="h-7 w-7 text-white" />
        </span>
      </div>
    </div>
  );
}

/* Dark Google-Maps style mock with route line + markers */
export function MapMock({
  className,
  route = true,
  markers,
  children,
}: {
  className?: string;
  route?: boolean;
  markers?: Array<{ lat: number; lng: number; tone: "red" | "blue" | "green"; label: string }>;
  children?: ReactNode;
}) {
  const mapCenter = { lat: 13.0827, lng: 80.2707 }; // Chennai center
  const mapScale = 2000; // Multiplier to map lat/lng diff to percentages

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[22px] border border-border bg-[#0a1c30] map-grid",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#04101d]/70" />
      {/* fake roads */}
      <div className="absolute left-0 top-1/3 h-[3px] w-full bg-white/5" />
      <div className="absolute left-1/4 top-0 h-full w-[3px] bg-white/5" />
      <div className="absolute right-1/4 top-0 h-full w-[3px] bg-white/5" />
      {route && !markers && (
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M 18% 82% C 35% 60%, 30% 40%, 55% 38% S 80% 25%, 82% 18%"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="1 12"
          />
          <path
            d="M 18% 82% C 35% 60%, 30% 40%, 55% 38% S 80% 25%, 82% 18%"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.35"
          />
        </svg>
      )}
      {route && !markers && (
        <>
          <Marker className="bottom-[14%] left-[14%]" tone="blue" label="You (Chennai)" />
          <Marker className="right-[14%] top-[12%]" tone="red" label="Help Needed" />
          <Marker className="right-[40%] top-[30%]" tone="green" label="ResQ Fleet 1" />
          <Marker className="left-[30%] bottom-[40%]" tone="green" label="ResQ Fleet 2" />
        </>
      )}
      
      {markers && markers.map((m, i) => {
        const left = Math.max(5, Math.min(95, 50 + (m.lng - mapCenter.lng) * mapScale));
        const top = Math.max(5, Math.min(95, 50 - (m.lat - mapCenter.lat) * mapScale));
        return (
          <Marker 
            key={i} 
            tone={m.tone} 
            label={m.label} 
            style={{ left: `${left}%`, top: `${top}%` }} 
          />
        );
      })}
      {children}
    </div>
  );
}

export function Marker({
  className,
  tone = "red",
  label,
  style,
}: {
  className?: string;
  tone?: "red" | "blue" | "green";
  label?: string;
  style?: React.CSSProperties;
}) {
  const c =
    tone === "red"
      ? "bg-primary"
      : tone === "blue"
        ? "bg-brand-blue"
        : "bg-success";
  return (
    <div className={cn("absolute flex flex-col items-center", className)} style={style}>
      {label && (
        <span className="mb-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
          {label}
        </span>
      )}
      <span
        className={cn(
          "grid h-7 w-7 place-items-center rounded-full ring-4 ring-white/10",
          c,
        )}
      >
        <MapPin className="h-4 w-4 text-white" />
      </span>
    </div>
  );
}

/* Volunteer profile card */
export type Volunteer = {
  name: string;
  distance: string;
  rating: number;
  eta: string;
  skill?: string;
};
export function VolunteerCard({
  v,
  actions,
  onClick,
}: {
  v: Volunteer;
  actions?: boolean;
  onClick?: () => void;
}) {
  return (
    <GlassCard onClick={onClick}>
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-blue/40 to-brand-blue/10 text-sm font-bold">
          {v.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold">{v.name}</p>
            <Rating value={v.rating} />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {v.skill ?? "Certified responder"} • {v.distance}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Pill tone="green">ETA {v.eta}</Pill>
        {actions && (
          <div className="flex gap-2">
            <a href="tel:+919876543210" onClick={() => alert("Push notification triggered to responder!")} className="grid h-9 w-9 place-items-center rounded-full bg-success/15 text-success hover:bg-success/25 transition-colors">
              <Phone className="h-4 w-4" />
            </a>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-blue/15 text-brand-blue">
              <MessageSquare className="h-4 w-4" />
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary">
              <Navigation className="h-4 w-4" />
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

/* Emergency progress timeline */
export type Step = {
  label: string;
  time?: string;
  state: "done" | "active" | "todo";
};
export function Timeline({ steps }: { steps: Step[] }) {
  return (
    <div className="relative pl-2">
      {steps.map((s, i) => (
        <div key={i} className="relative flex gap-4 pb-7 last:pb-0">
          {i < steps.length - 1 && (
            <span
              className={cn(
                "absolute left-[14px] top-7 h-full w-[2px]",
                s.state === "done" ? "bg-success" : "bg-border",
              )}
            />
          )}
          <span
            className={cn(
              "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full",
              s.state === "done" && "bg-success text-[#04101d]",
              s.state === "active" && "bg-primary text-white animate-sos",
              s.state === "todo" &&
                "border border-border bg-secondary text-muted-foreground",
            )}
          >
            {s.state === "done" ? (
              <Check className="h-4 w-4" />
            ) : (
              <span className="text-xs font-bold">{i + 1}</span>
            )}
          </span>
          <div className="pt-0.5">
            <p
              className={cn(
                "font-medium",
                s.state === "todo" && "text-muted-foreground",
              )}
            >
              {s.label}
            </p>
            {s.time && (
              <p className="text-xs text-muted-foreground">{s.time}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Voice waveform */
export function Waveform() {
  return (
    <div className="flex h-16 items-center justify-center gap-1.5">
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-primary animate-wave"
          style={{ height: "100%", animationDelay: `${(i % 8) * 0.1}s` }}
        />
      ))}
    </div>
  );
}
