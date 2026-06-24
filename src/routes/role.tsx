import { createFileRoute } from "@tanstack/react-router";
import { GlowButton, Logo, Wordmark } from "@/components/resqnet/kit";
import { ShieldAlert, HeartHandshake } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/role")({
  head: () => ({ meta: [{ title: "Choose Role — ResQNet" }] }),
  component: Role,
});

function Role() {
  const { t } = useTranslation();
  const { setRole } = useRole();
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background text-foreground relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      </div>
      
      {/* Centered Card */}
      <div className="relative z-10 w-full max-w-[700px] mx-4 bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Logo size={40} />
            <Wordmark className="text-xl" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Choose Your Role</h1>
          <p className="text-muted-foreground">
            How would you like to use ResQNet?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <label className="relative flex cursor-pointer rounded-2xl border border-border bg-secondary/30 p-6 hover:border-primary/50 hover:bg-secondary/50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input
              type="radio"
              name="role"
              className="peer sr-only"
              defaultChecked
              onChange={() => setRole("user")}
            />
            <div className="flex flex-col items-center text-center w-full">
              <div className="h-16 w-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4 peer-checked:bg-primary peer-checked:text-white transition-colors">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Need Help</h3>
              <p className="text-sm text-muted-foreground">
                I want to be protected and access emergency services.
              </p>
            </div>
            <div className="absolute top-4 right-4 h-5 w-5 rounded-full border-2 border-muted-foreground peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-colors">
              <div className="h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
            </div>
          </label>

          <label className="relative flex cursor-pointer rounded-2xl border border-border bg-secondary/30 p-6 hover:border-brand-blue/50 hover:bg-secondary/50 transition-all has-[:checked]:border-brand-blue has-[:checked]:bg-brand-blue/5">
            <input
              type="radio"
              name="role"
              className="peer sr-only"
              onChange={() => setRole("volunteer")}
            />
            <div className="flex flex-col items-center text-center w-full">
              <div className="h-16 w-16 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center mb-4 peer-checked:bg-brand-blue peer-checked:text-white transition-colors">
                <HeartHandshake className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Volunteer</h3>
              <p className="text-sm text-muted-foreground">
                I want to respond to emergencies and help others.
              </p>
            </div>
            <div className="absolute top-4 right-4 h-5 w-5 rounded-full border-2 border-muted-foreground peer-checked:border-brand-blue peer-checked:bg-brand-blue flex items-center justify-center transition-colors">
              <div className="h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
            </div>
          </label>
        </div>

        <div className="flex justify-center">
          <GlowButton to="/location-permission" className="w-full sm:w-64 h-12">
            {t("general.continue")}
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
