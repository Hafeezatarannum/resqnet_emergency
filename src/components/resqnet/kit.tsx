import { Link, useRouter } from "@tanstack/react-router";
import {
  ChevronLeft,
  Home,
  Map as MapIcon,
  Bot,
  Bell,
  User,
  Star,
  ShieldPlus,
  Moon,
  Sun,
  Users,
  Hospital,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { type ReactNode } from "react";
import { useTranslation } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/* DashboardLayout — renders a premium SaaS dashboard layout with sidebar */
/* ------------------------------------------------------------------ */
export function DashboardLayout({
  children,
  withNav,
}: {
  children: ReactNode;
  withNav?: boolean;
}) {
  return (
    <div className="relative flex h-screen w-full flex-col md:flex-row overflow-hidden bg-background">
      {withNav && <SideNav />}
      <div className="flex-1 relative flex flex-col min-w-0 w-full h-full overflow-hidden">
        {withNav && <GlobalHeader />}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-16 md:pb-0">
          {children}
        </div>
      </div>
    </div>
  );
}

/* App background glow layer */
export function Aura() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-[90px]" />
      <div className="absolute bottom-10 -right-20 h-64 w-64 rounded-full bg-brand-blue/15 blur-[90px]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */
export function Logo({ size = 56 }: { size?: number }) {
  return (
    <div
      className="grid place-items-center rounded-[22px] bg-gradient-to-br from-primary to-[#b71721] glow-red"
      style={{ width: size, height: size }}
    >
      <ShieldPlus
        className="text-white"
        style={{ width: size * 0.5, height: size * 0.5 }}
      />
    </div>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-bold tracking-tight", className)}>
      Res<span className="text-primary">Q</span>Net
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */
type BtnProps = {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "success" | "dark";
  full?: boolean;
  className?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};
export function GlowButton({
  children,
  to,
  onClick,
  variant = "primary",
  full = true,
  className,
  icon: Icon,
  disabled,
  type = "button",
}: BtnProps) {
  const styles = {
    primary: "bg-primary text-primary-foreground shadow-md glow-red",
    outline:
      "border border-border bg-white/[0.03] text-foreground hover:bg-white/[0.08]",
    ghost: "text-muted-foreground hover:text-foreground",
    success: "bg-success text-success-foreground shadow-lg shadow-success/30",
    dark: "bg-secondary text-foreground hover:bg-secondary/70 border border-border",
  };
  const cls = cn(
    "flex h-14 items-center justify-center gap-2 rounded-[18px] px-6 text-[15px] font-semibold transition active:scale-[0.98] mx-auto max-w-[360px]",
    full && "w-full",
    styles[variant as keyof typeof styles],
    className,
  );
  const inner = (
    <>
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </>
  );
  if (to && !disabled) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {inner}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Cards & layout                                                      */
/* ------------------------------------------------------------------ */
export function GlassCard({
  children,
  className,
  onClick,
  to,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  to?: string;
}) {
  const cls = cn(
    "rounded-[22px] border border-border bg-card text-card-foreground p-4 shadow-sm transition-all duration-300",
    (onClick || to) &&
      "cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:border-primary/30",
    className,
  );
  if (to)
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  return (
    <div className={cls} onClick={onClick}>
      {children}
    </div>
  );
}

/* Screen scaffold with safe scroll area */
export function Screen({
  children,
  className,
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative z-10 flex-1 overflow-y-auto no-scrollbar",
        pad && "px-5 pb-8 pt-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Global Header & Breadcrumbs                                         */
/* ------------------------------------------------------------------ */
import { Search, LogOut, Settings, HelpCircle, MessageSquare, Menu, ShieldAlert, HeartPulse, Medal, History } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useRole } from "@/lib/role";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export function SmartSearch() {
  const { role } = useRole();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const needHelpResults = [
    { label: "Nearby Hospitals", to: "/hospitals", keywords: ["hospital", "clinic", "doctor"] },
    { label: "Emergency Contacts", to: "/contacts-setup", keywords: ["contact", "family", "number"] },
    { label: "Find Volunteers", to: "/searching", keywords: ["volunteer", "help", "responder"] },
    { label: "Blood Banks (Mock)", to: "/hospitals", keywords: ["blood", "o+", "donor"] },
    { label: "Emergency Services", to: "/map", keywords: ["police", "fire", "ambulance"] },
  ];

  const volunteerResults = [
    { label: "Nearby Cases", to: "/alerts", keywords: ["accident", "case", "emergency"] },
    { label: "Emergency Requests", to: "/alerts", keywords: ["assigned", "request", "task"] },
    { label: "Response History", to: "/history", keywords: ["history", "previous", "mission"] },
  ];

  const rawResults = role === "volunteer" ? volunteerResults : needHelpResults;
  const filteredResults = query 
    ? rawResults.filter(r => r.label.toLowerCase().includes(query.toLowerCase()) || r.keywords.some(k => query.toLowerCase().includes(k)))
    : [];

  return (
    <div className="relative flex-1 mx-2 md:mx-4 max-w-2xl" ref={searchRef}>
      <div className="relative group">
        <Search className="pointer-events-none absolute inset-y-0 left-4 h-full w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={role === "volunteer" ? "Search tasks, history..." : "Search hospitals, help..."}
          className="block h-10 w-full rounded-full border border-border bg-secondary/50 py-1.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
        />
        {query && (
          <button 
            onClick={() => { setQuery(""); setIsOpen(false); }}
            className="absolute inset-y-0 right-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Smart Search Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 flex flex-col gap-1">
            {filteredResults.length > 0 ? (
              <>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 py-1">Quick Results</p>
                {filteredResults.map((result, i) => (
                  <Link
                    key={i}
                    to={result.to}
                    onClick={() => { setQuery(""); setIsOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/80 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Search className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{result.label}</span>
                  </Link>
                ))}
              </>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No results found</p>
                <p className="text-xs mt-1">Try a different keyword.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function GlobalHeader() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [profileName, setProfileName] = useState<string>("Loading...");

  useEffect(() => {
    if (!user?.id) return;
    
    // Fetch real profile name
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.full_name) {
          setProfileName(data.full_name);
        } else {
          setProfileName(user.user_metadata?.full_name || user.email?.split('@')[0] || "User");
        }
      });
  }, [user]);

  // Compute initials safely
  const getInitials = (name: string) => {
    if (name === "Loading...") return "...";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-border bg-background/80 backdrop-blur-md px-4 shadow-sm sm:px-6 lg:px-8 w-full">
      
      {/* Left: Back & Logo */}
      <div className="flex items-center gap-1 md:gap-3 md:w-64 shrink-0">
        <button
          onClick={() => router.history.back()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-transparent hover:bg-secondary text-foreground active:scale-95 transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <Logo size={24} />
        <Wordmark className="text-xl tracking-tight hidden lg:block" />
      </div>

      {/* Center: Smart Search */}
      <SmartSearch />



      {/* Right: Actions */}
      <div className="flex items-center gap-x-2 md:gap-x-4 shrink-0 ml-auto">
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="grid h-10 w-10 place-items-center rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <Link to="/alerts" className="relative grid h-10 w-10 place-items-center rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background animate-pulse"></span>
          <Bell className="h-5 w-5" />
        </Link>

        <div className="hidden md:block h-6 w-px bg-border mx-1" aria-hidden="true" />

        <Link to="/profile" className="flex items-center gap-x-3 ml-1 md:ml-0 p-1 md:pr-4 rounded-full border border-transparent md:border-border hover:bg-secondary/50 transition-colors">
          <div className="h-8 w-8 md:h-8 md:w-8 rounded-full bg-gradient-to-tr from-brand-blue to-primary flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
            {getInitials(profileName)}
          </div>
          <span className="hidden md:block text-sm font-semibold text-foreground max-w-[120px] truncate">
            {profileName}
          </span>
        </Link>
      </div>
    </header>
  );
}

/* Legacy TopBar (Keep for backward compatibility in non-dashboard screens) */
export function TopBar({
  title,
  subtitle,
  back = true,
  onBack,
  right,
}: {
  title?: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <div className="relative z-10 flex items-center gap-3 px-5 pb-3 pt-6 bg-background/80 backdrop-blur-md border-b border-border mb-4">
      {back && (
        <button
          onClick={onBack || (() => window.history.back())}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-secondary text-foreground active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        {title && <h1 className="truncate text-lg font-semibold">{title}</h1>}
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mb-3 mt-6 text-sm font-semibold text-muted-foreground",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* Form fields                                                         */
/* ------------------------------------------------------------------ */
export function Field({
  label,
  icon: Icon,
  ...props
}: {
  label?: string;
  icon?: LucideIcon;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block max-w-[360px] mx-auto w-full">
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
          {label}
        </span>
      )}
      <span className="flex items-center gap-3 rounded-[16px] border border-border bg-white/[0.03] px-4 focus-within:border-primary/60">
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        <input
          className="h-13 w-full bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          {...props}
        />
      </span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Side navigation                                                      */
/* ------------------------------------------------------------------ */
const NEED_HELP_NAV = [
  { to: "/home", labelKey: "Home", icon: Home },
  { to: "/power-sos", labelKey: "Emergency SOS", icon: ShieldAlert },
  { to: "/searching", labelKey: "Find Volunteers", icon: Users },
  { to: "/hospitals", labelKey: "Hospitals", icon: Hospital },
  { to: "/contacts-setup", labelKey: "Emergency Contacts", icon: User },
  { to: "/profile", labelKey: "Medical Profile", icon: HeartPulse },
  { to: "/ai-help", labelKey: "AI First Aid", icon: Bot },
  { to: "/settings", labelKey: "Settings", icon: Settings },
] as const;

const VOLUNTEER_NAV = [
  { to: "/home", labelKey: "Home", icon: Home },
  { to: "/alerts", labelKey: "Emergency Requests", icon: Bell },
  { to: "/map", labelKey: "Nearby Cases", icon: MapIcon },
  { to: "/route-navigation", labelKey: "Navigation", icon: Compass },
  { to: "/history", labelKey: "Response History", icon: History },
  { to: "/rewards", labelKey: "Achievements", icon: Medal },
  { to: "/profile", labelKey: "Volunteer Profile", icon: User },
  { to: "/settings", labelKey: "Settings", icon: Settings },
] as const;

const SECONDARY_NAV = [
  { to: "/help", labelKey: "Help Center", icon: HelpCircle },
  { to: "/feedback", labelKey: "Feedback", icon: MessageSquare },
  { to: "/", labelKey: "Logout", icon: LogOut },
] as const;

export function SideNav() {
  const { role } = useRole();
  const navList = role === "volunteer" ? VOLUNTEER_NAV : NEED_HELP_NAV;

  return (
    <nav className="relative z-20 flex w-full md:w-[260px] shrink-0 flex-row md:flex-col justify-around md:justify-start border-t md:border-t-0 md:border-r border-border bg-card/95 md:bg-card px-2 py-2.5 md:p-0 md:h-screen order-last md:order-first shadow-xl md:shadow-none fixed md:static bottom-0 left-0 right-0">
      {/* Header Area */}
      <div className="hidden md:flex items-center gap-3 px-6 h-16 border-b border-border w-full shrink-0">
        <Logo size={28} />
        <Wordmark className="text-xl tracking-tight" />
      </div>

      {/* Main Nav (Scrollable) */}
      <div className="flex w-full md:flex-1 md:flex-col md:overflow-y-auto no-scrollbar md:px-3 md:py-4 gap-1">
        {/* Mobile shows only top 5 icons, Desktop shows full list */}
        {navList.map((item, idx) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-1 md:flex-none flex-col md:flex-row items-center gap-1 md:gap-3 px-2 py-2 md:px-3 md:py-2.5 text-[10px] md:text-[13px] font-medium text-muted-foreground md:rounded-xl hover:bg-secondary transition-all",
              idx > 4 && "hidden md:flex" // Hide beyond 5 on mobile
            )}
            activeProps={{
              className:
                "!text-primary md:!bg-primary/10 font-bold",
            }}
          >
            <item.icon className="h-5 w-5 md:h-4 md:w-4" />
            <span className="md:inline">{item.labelKey}</span>
          </Link>
        ))}
      </div>

      {/* Footer Area */}
      <div className="hidden md:flex flex-col gap-1 p-3 border-t border-border bg-secondary/20 shrink-0">
        {SECONDARY_NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-muted-foreground rounded-xl hover:bg-secondary transition-all"
            activeProps={{ className: "!text-primary md:!bg-primary/10 font-bold" }}
          >
            <item.icon className="h-4 w-4" />
            {item.labelKey}
          </Link>
        ))}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Reusable bits                                                       */
/* ------------------------------------------------------------------ */
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-warning">
      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
      {value.toFixed(1)}
    </span>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "red" | "green" | "orange" | "blue";
}) {
  const tones: Record<string, string> = {
    default: "bg-white/10 text-muted-foreground",
    red: "bg-primary/15 text-primary",
    green: "bg-success/15 text-success",
    orange: "bg-warning/15 text-warning",
    blue: "bg-brand-blue/15 text-brand-blue",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
