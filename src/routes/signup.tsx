import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GlowButton, Field, Logo } from "@/components/resqnet/kit";
import {
  User,
  Mail,
  Lock,
  Phone,
  Users,
  Activity,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create Account — ResQNet" }] }),
  component: Signup,
});

// ── Form state shape ────────────────────────────────────────────────────────
type FormData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  contactName: string;
  contactPhone: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
};

function Signup() {
  const navigate = useNavigate();
  const { signUp, sendOtp } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    contactName: "",
    contactPhone: "",
    bloodGroup: "",
    allergies: "",
    conditions: "",
  });

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const nextStep = () => {
    setError(null);
    // Validate before advancing
    if (step === 1) {
      if (!form.fullName || !form.email || !form.phone) {
        setError("Please fill in all fields.");
        return;
      }
    }
    if (step === 2) {
      if (!form.password || !form.confirmPassword) {
        setError("Please enter and confirm your password.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const prevStep = () => { setError(null); setStep((s) => Math.max(1, s - 1)); };

  // ── Final submit → create Supabase account ──────────────────────────────
  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    const { error } = await signUp(form.email, form.password, {
      full_name: form.fullName,
      phone: form.phone,
      contact_name: form.contactName,
      contact_phone: form.contactPhone,
      blood_group: form.bloodGroup,
      allergies: form.allergies,
      conditions: form.conditions,
    });

    if (error) {
      setError(error.message ?? "Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    // Send OTP to email for verification
    await sendOtp(form.email);
    setLoading(false);

    // Navigate to OTP verification with the email in state
    navigate({ to: "/otp", search: { email: form.email } });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground overflow-hidden py-12 px-4">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="flex justify-center mb-8">
          <Link to="/"><Logo size={48} /></Link>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 px-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 ${
                  step >= i
                    ? "bg-primary text-white shadow-[0_0_15px_rgba(245,34,45,0.5)]"
                    : "bg-card border-2 border-border text-muted-foreground"
                }`}
              >
                {step > i ? <CheckCircle2 className="h-5 w-5" /> : i}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold px-1">
            <span>Profile</span><span>Security</span><span>Contacts</span><span>Medical</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-2xl p-8 shadow-2xl min-h-[400px] flex flex-col">

          {/* Error Banner */}
          {error && (
            <div className="mb-4 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive font-medium">
              {error}
            </div>
          )}

          <div className="flex-1">
            {/* Step 1 — Personal Info */}
            {step === 1 && (
              <div className="animate-fade-up space-y-4">
                <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
                <p className="text-muted-foreground text-sm mb-6">Let's start with the basics.</p>
                <Field label="Full name" icon={User} placeholder="Aarav Sharma" value={form.fullName} onChange={set("fullName")} />
                <Field label="Email" icon={Mail} type="email" placeholder="aarav@example.com" value={form.email} onChange={set("email")} />
                <Field label="Phone number" icon={Phone} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
              </div>
            )}

            {/* Step 2 — Security */}
            {step === 2 && (
              <div className="animate-fade-up space-y-4">
                <h2 className="text-2xl font-bold mb-2">Account Security</h2>
                <p className="text-muted-foreground text-sm mb-6">Create a strong password (min. 8 characters).</p>
                <Field label="Password" icon={Lock} type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
                <Field label="Confirm Password" icon={Lock} type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set("confirmPassword")} />
              </div>
            )}

            {/* Step 3 — Emergency Contacts */}
            {step === 3 && (
              <div className="animate-fade-up space-y-4">
                <h2 className="text-2xl font-bold mb-2">Emergency Contacts</h2>
                <p className="text-muted-foreground text-sm mb-6">Add a primary contact to alert during SOS.</p>
                <Field label="Contact Name" icon={Users} placeholder="e.g., Mother, Spouse" value={form.contactName} onChange={set("contactName")} />
                <Field label="Contact Phone" icon={Phone} type="tel" placeholder="+91 98765 43210" value={form.contactPhone} onChange={set("contactPhone")} />
              </div>
            )}

            {/* Step 4 — Medical */}
            {step === 4 && (
              <div className="animate-fade-up space-y-4">
                <h2 className="text-2xl font-bold mb-2">Medical Profile</h2>
                <p className="text-muted-foreground text-sm mb-6">Shared with first responders during emergencies.</p>
                <Field label="Blood Group" icon={Activity} placeholder="e.g., O+, A-" value={form.bloodGroup} onChange={set("bloodGroup")} />
                <Field label="Allergies (Optional)" icon={Activity} placeholder="e.g., Penicillin, Peanuts" value={form.allergies} onChange={set("allergies")} />
                <Field label="Medical Conditions (Optional)" icon={Activity} placeholder="e.g., Asthma, Diabetes" value={form.conditions} onChange={set("conditions")} />
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
            {step > 1 ? (
              <button onClick={prevStep} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            )}

            {step < 4 ? (
              <GlowButton onClick={nextStep} className="px-8 flex items-center gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </GlowButton>
            ) : (
              <GlowButton onClick={handleComplete} className="px-8 shadow-xl shadow-primary/20" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete Registration"}
              </GlowButton>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline transition-colors">Log in</Link>
        </p>
      </div>
    </div>
  );
}
