import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/resqnet/kit";
import { useRole } from "@/lib/role";
import { useAuth } from "@/lib/auth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getProfile, updateProfile } from "@/lib/api/resqnet.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  HeartPulse,
  Users,
  History,
  LogOut,
  ChevronRight,
  Edit2,
  ShieldCheck,
  Award,
  Star,
  MapPin,
  Loader2
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — ResQNet" }] }),
  component: Profile,
});

function Profile() {
  const { role } = useRole();
  const { user, loading } = useRequireAuth();
  const { signOut } = useAuth();

  if (loading || !user) {
    return (
      <DashboardLayout withNav>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout withNav>
      <div className="max-w-md mx-auto p-4 md:p-6 w-full space-y-6 pt-8 pb-20">
        {role === "volunteer" ? (
          <VolunteerProfile user={user} onLogOut={signOut} />
        ) : (
          <NeedHelpProfile user={user} onLogOut={signOut} />
        )}
      </div>
    </DashboardLayout>
  );
}

function NeedHelpProfile({ user, onLogOut }: { user: any; onLogOut: () => void }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Fetch real profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user?.id,
  });

  const [localData, setLocalData] = useState({
    bloodType: "",
    conditions: "",
    allergies: "",
    medications: "",
    organDonor: "No",
  });

  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
  });

  // Sync state when real data arrives
  useEffect(() => {
    if (profile) {
      setLocalData({
        bloodType: profile.blood_group || "Unknown",
        conditions: profile.conditions || "None",
        allergies: profile.allergies || "None",
        medications: profile.medications || "None",
        organDonor: "Yes",
      });
      setProfileData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await updateProfile(user!.id, updates);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setIsEditing(false);
    },
    onError: (error) => {
      alert("Error saving: " + error.message);
    }
  });

  const profileMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await updateProfile(user!.id, updates);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setIsEditingProfile(false);
    },
    onError: (error) => {
      alert("Error saving profile: " + error.message);
    }
  });

  const handleSave = () => {
    mutation.mutate({
      blood_group: localData.bloodType,
      conditions: localData.conditions,
      allergies: localData.allergies,
      medications: localData.medications,
    });
  };

  const handleProfileSave = () => {
    profileMutation.mutate({
      full_name: profileData.full_name,
      phone: profileData.phone,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "US";

  return (
    <>
      <div className="flex flex-col items-center gap-3 text-center mb-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-brand-blue to-primary flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-primary/20">
            {initials}
          </div>
          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="absolute bottom-0 right-0 h-8 w-8 bg-card rounded-full flex items-center justify-center border-2 border-background text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
        <div className="w-full px-4">
          {isEditingProfile ? (
            <div className="flex flex-col gap-2 mt-2">
              <input
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-center text-lg font-bold text-foreground focus:outline-none focus:border-primary"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                placeholder="Full Name"
              />
              <input
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-center text-sm text-foreground focus:outline-none focus:border-primary"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="Phone Number"
              />
              <button
                onClick={handleProfileSave}
                disabled={profileMutation.isPending}
                className="mt-2 w-full text-white text-sm font-bold px-4 py-2 bg-primary rounded-full transition-all hover:bg-primary/90 flex justify-center items-center gap-2"
              >
                {profileMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Profile
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{profile?.full_name || "Unknown User"}</h1>
              <p className="text-muted-foreground text-sm">{profile?.phone || "No phone added"}</p>
            </>
          )}
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-3xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg text-primary">Medical ID</h2>
          </div>
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={mutation.isPending}
              className="text-white text-xs font-bold px-4 py-1.5 bg-primary rounded-full transition-all hover:bg-primary/90 flex items-center gap-1"
            >
              {mutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-primary text-xs font-bold px-4 py-1.5 bg-background rounded-full border border-primary/20 transition-colors hover:bg-primary/10"
            >
              Edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          <div>
            <p className="text-[10px] text-primary/80 uppercase tracking-wider mb-0.5">Blood Type</p>
            {isEditing ? (
              <input
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm font-bold text-foreground focus:outline-none focus:border-primary"
                value={localData.bloodType}
                onChange={(e) => setLocalData({ ...localData, bloodType: e.target.value })}
              />
            ) : (
              <p className="font-bold text-lg text-foreground">{localData.bloodType}</p>
            )}
          </div>
          <div>
            <p className="text-[10px] text-primary/80 uppercase tracking-wider mb-0.5">Organ Donor</p>
            {isEditing ? (
              <input
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm font-bold text-foreground focus:outline-none focus:border-primary"
                value={localData.organDonor}
                onChange={(e) => setLocalData({ ...localData, organDonor: e.target.value })}
              />
            ) : (
              <p className="font-bold text-lg text-foreground">{localData.organDonor}</p>
            )}
          </div>
          <div className="col-span-2">
            <p className="text-[10px] text-primary/80 uppercase tracking-wider mb-0.5">Medical Conditions</p>
            {isEditing ? (
              <input
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm font-semibold text-foreground focus:outline-none focus:border-primary"
                value={localData.conditions}
                onChange={(e) => setLocalData({ ...localData, conditions: e.target.value })}
              />
            ) : (
              <p className="font-semibold text-foreground">{localData.conditions}</p>
            )}
          </div>
          <div className="col-span-2">
            <p className="text-[10px] text-primary/80 uppercase tracking-wider mb-0.5">Allergies</p>
            {isEditing ? (
              <input
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm font-semibold text-foreground focus:outline-none focus:border-primary"
                value={localData.allergies}
                onChange={(e) => setLocalData({ ...localData, allergies: e.target.value })}
              />
            ) : (
              <p className="font-semibold text-foreground">{localData.allergies}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col mt-6">
        <Link to="/contacts-setup" className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors border-b border-border">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-foreground">
            <Users className="h-4 w-4" />
          </div>
          <span className="flex-1 font-semibold">Emergency Contacts</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link to="/settings" className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-foreground">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="flex-1 font-semibold">Location Settings</span>
          <span className="text-xs font-bold text-muted-foreground">Always On</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col mt-6">
        <button onClick={onLogOut} className="w-full flex items-center gap-3 p-4 hover:bg-primary/5 transition-colors text-primary">
          <LogOut className="h-5 w-5" />
          <span className="flex-1 font-bold text-left">Log Out</span>
        </button>
      </div>
    </>
  );
}

function VolunteerProfile({ user, onLogOut }: { user: any; onLogOut: () => void }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Fetch real profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user?.id,
  });

  const [volunteerData, setVolunteerData] = useState({
    certifications: "",
    languages: "English, Hindi",
  });

  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
  });

  useEffect(() => {
    if (profile) {
      setVolunteerData({
        certifications: profile.medications || "CPR Certified", // We store certs in medications for now
        languages: "English, Hindi",
      });
      setProfileData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await updateProfile(user!.id, updates);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setIsEditing(false);
    },
    onError: (error) => {
      alert("Error saving: " + error.message);
    }
  });

  const profileMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await updateProfile(user!.id, updates);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setIsEditingProfile(false);
    },
    onError: (error) => {
      alert("Error saving profile: " + error.message);
    }
  });

  const handleSave = () => {
    mutation.mutate({
      medications: volunteerData.certifications,
    });
  };

  const handleProfileSave = () => {
    profileMutation.mutate({
      full_name: profileData.full_name,
      phone: profileData.phone,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "VO";

  return (
    <>
      <div className="flex flex-col items-center gap-3 text-center mb-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-brand-blue to-emerald-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-brand-blue/20">
            {initials}
          </div>
          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="absolute -top-2 -right-2 h-8 w-8 bg-card rounded-full flex items-center justify-center border-2 border-background text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-success rounded-full flex items-center justify-center border-2 border-background text-white shadow-sm" title="Verified First Responder">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="w-full px-4">
          {isEditingProfile ? (
            <div className="flex flex-col gap-2 mt-2">
              <input
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-center text-lg font-bold text-foreground focus:outline-none focus:border-brand-blue"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                placeholder="Full Name"
              />
              <input
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-center text-sm text-foreground focus:outline-none focus:border-brand-blue"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="Phone Number"
              />
              <button
                onClick={handleProfileSave}
                disabled={profileMutation.isPending}
                className="mt-2 w-full text-white text-sm font-bold px-4 py-2 bg-brand-blue rounded-full transition-all hover:bg-brand-blue/90 flex justify-center items-center gap-2"
              >
                {profileMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Profile
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                {profile?.full_name || "Volunteer"}
              </h1>
              <p className="text-success text-sm font-semibold flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Verified Responder
              </p>
              <p className="text-muted-foreground text-sm mt-1">{profile?.phone || "No phone added"}</p>
            </>
          )}
        </div>
      </div>

      {/* Volunteer Stats Row */}
      <div className="flex items-center justify-between bg-card border border-border rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col items-center gap-1 flex-1">
          <Star className="h-5 w-5 text-warning" />
          <span className="text-lg font-bold">4.9</span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Rating</span>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="flex flex-col items-center gap-1 flex-1">
          <Award className="h-5 w-5 text-brand-blue" />
          <span className="text-lg font-bold">Lvl 12</span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Rank</span>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="flex flex-col items-center gap-1 flex-1">
          <Users className="h-5 w-5 text-success" />
          <span className="text-lg font-bold">45</span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Helped</span>
        </div>
      </div>

      <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-3xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-brand-blue" />
            <h2 className="font-bold text-lg text-brand-blue">Responder Profile</h2>
          </div>
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={mutation.isPending}
              className="text-white text-xs font-bold px-4 py-1.5 bg-brand-blue rounded-full transition-all hover:bg-brand-blue/90 flex items-center gap-1"
            >
              {mutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-brand-blue text-xs font-bold px-4 py-1.5 bg-background rounded-full border border-brand-blue/20 transition-colors hover:bg-brand-blue/10"
            >
              Edit
            </button>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-[10px] text-brand-blue/80 uppercase tracking-wider mb-1">Certifications</p>
            {isEditing ? (
              <input
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-semibold text-foreground focus:outline-none focus:border-brand-blue"
                value={volunteerData.certifications}
                onChange={(e) => setVolunteerData({ ...volunteerData, certifications: e.target.value })}
                placeholder="Comma separated (e.g. CPR, First Aid)"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {volunteerData.certifications.split(",").filter(Boolean).map((cert, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-background border border-border rounded-md text-xs font-semibold text-foreground">
                    {cert.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="text-[10px] text-brand-blue/80 uppercase tracking-wider mb-1">Languages Spoken</p>
            {isEditing ? (
              <input
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-semibold text-foreground focus:outline-none focus:border-brand-blue"
                value={volunteerData.languages}
                onChange={(e) => setVolunteerData({ ...volunteerData, languages: e.target.value })}
              />
            ) : (
              <p className="font-semibold text-foreground text-sm">{volunteerData.languages}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col mt-6">
        <Link to="/history" className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors border-b border-border">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-foreground">
            <History className="h-4 w-4" />
          </div>
          <span className="flex-1 font-semibold">Response History</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link to="/settings" className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-foreground">
            <Settings className="h-4 w-4" />
          </div>
          <span className="flex-1 font-semibold">Settings</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col mt-6">
        <button onClick={onLogOut} className="w-full flex items-center gap-3 p-4 hover:bg-primary/5 transition-colors text-primary">
          <LogOut className="h-5 w-5" />
          <span className="flex-1 font-bold text-left">Log Out</span>
        </button>
      </div>
    </>
  );
}
