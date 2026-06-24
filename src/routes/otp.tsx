import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlowButton,
} from "@/components/resqnet/kit";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";

// Accept optional ?email= query param
const searchSchema = z.object({
  email: z.string().email().optional(),
});

export const Route = createFileRoute("/otp")({
  head: () => ({ meta: [{ title: "Forgot Password — ResQNet" }] }),
  validateSearch: searchSchema,
  component: ForgotPasswordFlow,
});

type Step = "email" | "otp" | "password";

function ForgotPasswordFlow() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, updatePassword } = useAuth();
  const search = Route.useSearch();

  // State Machine
  const [step, setStep] = useState<Step>(search.email ? "otp" : "email");
  const [email, setEmail] = useState(search.email || "");

  // OTP State
  const [vals, setVals] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Password State
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // General State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer effect for OTP
  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  // ── Step 1: Send Email ────────────────────────────────────────────────
  const handleSendEmail = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await sendOtp(email);
    setLoading(false);

    if (error) {
      setError(error.message || "Failed to send code. Please try again.");
    } else {
      setStep("otp");
      setTimer(30);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const token = vals.join("");
    if (token.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);
    const { error } = await verifyOtp(email, token);
    setLoading(false);

    if (error) {
      setError("Invalid or expired code. Please try again.");
    } else {
      // Verified! User is now logged in. Move to set new password.
      setStep("password");
    }
  };

  const handleResend = async () => {
    setError(null);
    const { error } = await sendOtp(email);
    if (error) {
      setError(error.message || "Failed to resend code.");
    } else {
      setTimer(30);
      setVals(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
    }
  };

  const setOtpVal = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...vals];
    n[i] = v;
    setVals(n);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  // ── Step 3: Set New Password ──────────────────────────────────────────
  const handleSetPassword = async () => {
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    const { error } = await updatePassword(newPassword);
    setLoading(false);

    if (error) {
      setError(error.message || "Failed to update password.");
    } else {
      // Success! Go to home.
      navigate({ to: "/role" });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <Aura />
      <TopBar
        title={
          step === "email"
            ? "Forgot Password"
            : step === "otp"
              ? "Verify your email"
              : "Create New Password"
        }
        subtitle={
          step === "email"
            ? "Enter your email to receive a reset code"
            : step === "otp"
              ? `Code sent to ${email}`
              : "Set a strong password for your account"
        }
        onBack={() => {
          if (step === "password") setStep("otp");
          else if (step === "otp") setStep("email");
          else navigate({ to: "/login" });
        }}
      />
      <Screen>
        {error && (
          <div className="mx-5 mt-4 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* STEP 1: EMAIL */}
        {step === "email" && (
          <div className="px-5 mt-8 space-y-6">
            <label className="block w-full">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Email Address
              </span>
              <span className="flex items-center gap-3 rounded-[16px] border border-border bg-white/[0.03] px-4 focus-within:border-primary/60 transition-colors">
                <Mail className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className="h-13 w-full bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                  autoComplete="email"
                />
              </span>
            </label>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === "otp" && (
          <>
            <div className="mt-8 flex justify-center gap-2 sm:gap-4 px-4">
              {vals.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  value={v}
                  onChange={(e) => {
                    setOtpVal(i, e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !v && i > 0) {
                      refs.current[i - 1]?.focus();
                    }
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-14 w-12 sm:h-16 sm:w-14 rounded-[12px] sm:rounded-[16px] border border-border bg-white/[0.03] text-center text-xl sm:text-2xl font-bold text-foreground outline-none focus:border-primary"
                />
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {timer > 0 ? (
                <>
                  Resend code in{" "}
                  <span className="font-semibold text-foreground">
                    0:{timer.toString().padStart(2, "0")}
                  </span>
                </>
              ) : (
                <button
                  onClick={handleResend}
                  className="font-semibold text-primary hover:underline"
                >
                  Resend code
                </button>
              )}
            </p>
          </>
        )}

        {/* STEP 3: PASSWORD */}
        {step === "password" && (
          <div className="px-5 mt-8 space-y-6">
            <label className="block w-full">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                New Password
              </span>
              <span className="flex items-center gap-3 rounded-[16px] border border-border bg-white/[0.03] px-4 focus-within:border-primary/60 transition-colors">
                <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(null);
                  }}
                  className="h-13 w-full bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>
          </div>
        )}
      </Screen>

      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlowButton
          onClick={() => {
            if (step === "email") handleSendEmail();
            else if (step === "otp") handleVerifyOtp();
            else handleSetPassword();
          }}
          disabled={loading}
          className="w-full h-12"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : step === "email" ? (
            "Send Code"
          ) : step === "otp" ? (
            "Verify Code"
          ) : (
            "Save Password"
          )}
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
