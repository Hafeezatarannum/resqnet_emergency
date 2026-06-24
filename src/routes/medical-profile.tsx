import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlowButton,
  Field,
} from "@/components/resqnet/kit";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { getProfile, updateProfile } from "@/lib/api/resqnet.api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/medical-profile")({
  head: () => ({ meta: [{ title: "Medical Profile — ResQNet" }] }),
  component: MedicalProfile,
});

const BLOOD = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function MedicalProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [blood, setBlood] = useState("O+");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profile) {
      if (profile.blood_group) setBlood(profile.blood_group);
      if (profile.allergies) setAllergies(profile.allergies);
      if (profile.conditions) setConditions(profile.conditions);
      if (profile.medications) setMedications(profile.medications);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateProfile(user!.id, {
        blood_group: blood,
        allergies,
        conditions,
        medications,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      // Proceed to next onboarding step or home
      navigate({ to: "/location-permission" });
    },
  });

  const handleSave = () => {
    if (!user) return;
    updateMutation.mutate();
  };

  return (
    <DashboardLayout>
      <Aura />
      <TopBar
        title="Medical profile"
        subtitle="Shared with responders during emergencies"
      />
      <Screen>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Blood group
            </p>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD.map((b) => (
                <button
                  key={b}
                  onClick={() => setBlood(b)}
                  className={cn(
                    "rounded-[14px] border py-3 text-sm font-bold transition",
                    blood === b
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-white/[0.03]"
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
            <div className="mt-5 space-y-4">
              <Field
                label="Allergies"
                placeholder="e.g. Penicillin, peanuts"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
              <Field
                label="Medical conditions"
                placeholder="e.g. Asthma, diabetes"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
              />
              <Field
                label="Current medications"
                placeholder="e.g. Insulin, inhaler"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
              />
            </div>
          </>
        )}
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlowButton 
          onClick={handleSave}
          disabled={updateMutation.isPending || isLoading}
        >
          {updateMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save & Continue"}
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
