import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/resqnet/kit";
import { useTheme } from "@/lib/theme";
import { useRole } from "@/lib/role";
import { 
  User, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  ShieldCheck, 
  Smartphone,
  Eye,
  KeyRound,
  Battery,
  MapPin,
  Briefcase,
  Loader2
} from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getProfile, updateProfile } from "@/lib/api/resqnet.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — ResQNet" }] }),
  component: SettingsPage,
});

const TABS = [
  { id: "account", label: "Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Eye },
  { id: "privacy", label: "Privacy & Security", icon: ShieldCheck },
  { id: "emergency", label: "Emergency", icon: Bell },
  { id: "device", label: "Device", icon: Smartphone },
];

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

function SettingsPage() {
  const { user } = useRequireAuth();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user?.id,
  });

  const [formData, setFormData] = useState({ fullName: "", phone: "" });
  
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || user?.user_metadata?.full_name || "",
        phone: profile.phone || user?.user_metadata?.phone || "",
      });
    } else if (user) {
      setFormData({
        fullName: user.user_metadata?.full_name || "",
        phone: user.user_metadata?.phone || "",
      });
    }
  }, [profile, user]);

  const mutation = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await updateProfile(user!.id, updates);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      alert("Profile updated successfully");
    },
    onError: (error) => {
      alert("Error saving profile: " + error.message);
    }
  });

  const handleSave = () => {
    mutation.mutate({
      full_name: formData.fullName,
      phone: formData.phone,
    });
  };

  const [activeTab, setActiveTab] = useState("account");
  const { theme, setTheme } = useTheme();
  const { role, setRole } = useRole();

  // Functional Toggles State (Persisted)
  const [largeText, setLargeText] = useLocalStorage("resqnet_largeText", false);
  const [highContrast, setHighContrast] = useLocalStorage("resqnet_highContrast", false);
  const [locationServices, setLocationServices] = useLocalStorage("resqnet_location", true);
  const [medicalSharing, setMedicalSharing] = useLocalStorage("resqnet_medical", true);
  const [voiceActivation, setVoiceActivation] = useLocalStorage("resqnet_voice", false);
  const [fakeCall, setFakeCall] = useLocalStorage("resqnet_fakeCall", false);
  const [batteryOptimization, setBatteryOptimization] = useLocalStorage("resqnet_battery", false);
  const [sosCountdown, setSosCountdown] = useLocalStorage("resqnet_countdown", "3 Seconds");

  // Apply Accessibility Settings globally via document class
  useEffect(() => {
    const root = document.documentElement;
    if (largeText) {
      root.style.fontSize = "18px";
    } else {
      root.style.fontSize = "16px";
    }
  }, [largeText]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.style.filter = "contrast(1.2)";
    } else {
      root.style.filter = "none";
    }
  }, [highContrast]);

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
    <div 
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full border relative cursor-pointer transition-colors ${checked ? 'bg-primary border-primary' : 'bg-secondary border-border'}`}
    >
      <div className={`absolute top-1 h-4 w-4 rounded-full transition-all ${checked ? 'bg-white right-1' : 'bg-muted-foreground left-1'}`} />
    </div>
  );

  return (
    <DashboardLayout withNav>
      <div className="max-w-4xl mx-auto p-4 md:p-6 w-full h-full flex flex-col md:flex-row gap-8 pt-8 pb-20 md:pb-8">
        
        {/* Settings Sidebar */}
        <aside className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar md:overflow-visible pb-2 md:pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal text-sm font-medium ${
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Settings Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          
          {activeTab === "account" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-1">Account</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage your personal information.</p>
              </div>
              
              <div className="bg-card border border-border rounded-3xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full h-12 px-4 bg-secondary/50 border border-border rounded-xl outline-none focus:border-primary font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-12 px-4 bg-secondary/50 border border-border rounded-xl outline-none focus:border-primary font-medium" 
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSave}
                    disabled={mutation.isPending}
                    className="text-white text-sm font-bold px-6 py-2.5 bg-primary rounded-xl transition-all hover:bg-primary/90 flex items-center gap-2 shadow-sm"
                  >
                    {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Developer / Role Toggle */}
              <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-bold text-sm">Volunteer Mode</p>
                      <p className="text-xs text-muted-foreground">Switch account to First Responder role.</p>
                    </div>
                  </div>
                  <Toggle checked={role === "volunteer"} onChange={(v) => setRole(v ? "volunteer" : "user")} />
                </div>
              </div>

            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-1">Appearance</h2>
                <p className="text-sm text-muted-foreground mb-6">Customize display and accessibility.</p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground px-2">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center justify-center gap-3 p-6 border rounded-2xl transition-all ${theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-secondary/50'}`}
                  >
                    <Sun className="h-8 w-8" />
                    <span className="font-semibold text-sm">Light</span>
                  </button>
                  <button 
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center justify-center gap-3 p-6 border rounded-2xl transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-secondary/50'}`}
                  >
                    <Moon className="h-8 w-8" />
                    <span className="font-semibold text-sm">Dark</span>
                  </button>
                  <button 
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center justify-center gap-3 p-6 border rounded-2xl transition-all ${theme === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-secondary/50'}`}
                  >
                    <Monitor className="h-8 w-8" />
                    <span className="font-semibold text-sm">System</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground px-2">Accessibility</h3>
                <div className="bg-card border border-border rounded-3xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div>
                      <p className="font-semibold text-sm">Large Text</p>
                      <p className="text-xs text-muted-foreground">Increase text size across the application.</p>
                    </div>
                    <Toggle checked={largeText} onChange={setLargeText} />
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold text-sm">High Contrast</p>
                      <p className="text-xs text-muted-foreground">Make colors more distinct for better visibility.</p>
                    </div>
                    <Toggle checked={highContrast} onChange={setHighContrast} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-1">Privacy & Security</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage your data sharing and security settings.</p>
              </div>
              
              <div className="bg-card border border-border rounded-3xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Location Services</p>
                      <p className="text-xs text-muted-foreground">Allow background location tracking for fast SOS.</p>
                    </div>
                  </div>
                  <Toggle checked={locationServices} onChange={setLocationServices} />
                </div>
                
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-success/10 text-success flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Medical Data Sharing</p>
                      <p className="text-xs text-muted-foreground">Share medical profile with verified responders.</p>
                    </div>
                  </div>
                  <Toggle checked={medicalSharing} onChange={setMedicalSharing} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "emergency" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-1">Emergency Settings</h2>
                <p className="text-sm text-muted-foreground mb-6">Configure how the app responds during an SOS.</p>
              </div>

              <div className="bg-card border border-border rounded-3xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-border">
                  <div>
                    <p className="font-semibold text-sm">Auto SOS Countdown</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Delay before triggering SOS automatically.</p>
                  </div>
                  <select 
                    value={sosCountdown}
                    onChange={(e) => setSosCountdown(e.target.value)}
                    className="bg-secondary border border-border rounded-lg text-sm px-3 py-1.5 outline-none font-medium text-foreground"
                  >
                    <option>3 Seconds</option>
                    <option>5 Seconds</option>
                    <option>10 Seconds</option>
                    <option>Off</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div>
                    <p className="font-semibold text-sm">Voice Activation</p>
                    <p className="text-xs text-muted-foreground">Always listen for "Help Me".</p>
                  </div>
                  <Toggle checked={voiceActivation} onChange={setVoiceActivation} />
                </div>

                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold text-sm">Fake Call Screen</p>
                    <p className="text-xs text-muted-foreground">Show a fake incoming police call when triggered.</p>
                  </div>
                  <Toggle checked={fakeCall} onChange={setFakeCall} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "device" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-1">Device Integration</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage connected devices and battery settings.</p>
              </div>

              <div className="bg-card border border-border rounded-3xl overflow-hidden p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-success/20 text-success flex items-center justify-center">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">Apple Watch Series 8</p>
                    <p className="text-xs text-success flex items-center gap-1 mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Connected
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-secondary text-foreground text-xs font-bold rounded-xl active:scale-95 transition-transform">
                    Disconnect
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-3xl overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                      <Battery className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Battery Optimization</p>
                      <p className="text-xs text-muted-foreground">Reduce background scanning to save battery.</p>
                    </div>
                  </div>
                  <Toggle checked={batteryOptimization} onChange={setBatteryOptimization} />
                </div>
              </div>
            </div>
          )}
          
        </main>
      </div>
    </DashboardLayout>
  );
}
