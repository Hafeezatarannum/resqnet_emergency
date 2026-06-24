import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GlowButton, Logo } from "@/components/resqnet/kit";
import { Mail, Lock, AlertTriangle, Loader2, Eye, EyeOff, CircleAlert } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — ResQNet" }] }),
  component: Login,
});

// ── Email format validator ────────────────────────────────────────────────
const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// ── Inline error message component ────────────────────────────────────────
function FieldError({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1 duration-200">
      <CircleAlert className="h-3.5 w-3.5 shrink-0" />
      {msg}
    </p>
  );
}

// ── Supabase error message mapper ─────────────────────────────────────────
function mapSupabaseError(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes("invalid login credentials") || msg.includes("invalid credentials"))
    return "Incorrect email or password. Please try again.";
  if (msg.includes("email not confirmed"))
    return "Please verify your email first. Check your inbox.";
  if (msg.includes("too many requests"))
    return "Too many attempts. Please wait a moment and try again.";
  if (msg.includes("user not found") || msg.includes("no user"))
    return "No account found with this email address.";
  if (msg.includes("invalid email"))
    return "Invalid email address.";
  if (msg.includes("network") || msg.includes("fetch"))
    return "Network error. Check your internet connection.";
  return message;
}

function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Field-level errors
  const [emailErr, setEmailErr]     = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);
  // Top-level server error
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);

  // ── Real-time field validation ───────────────────────────────────────────
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setServerError(null);
    if (!val) {
      setEmailErr("Email address is required.");
    } else if (!isValidEmail(val)) {
      setEmailErr("Please enter a valid email address.");
    } else {
      setEmailErr(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setServerError(null);
    if (!val) {
      setPasswordErr("Password is required.");
    } else if (val.length < 6) {
      setPasswordErr("Password must be at least 6 characters.");
    } else {
      setPasswordErr(null);
    }
  };

  // ── Submit validation ────────────────────────────────────────────────────
  const validate = (): boolean => {
    let valid = true;

    if (!email.trim()) {
      setEmailErr("Email address is required.");
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailErr("Please enter a valid email address (e.g. you@example.com).");
      valid = false;
    }

    if (!password) {
      setPasswordErr("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordErr("Password must be at least 6 characters.");
      valid = false;
    }

    return valid;
  };

  // ── Login handler ────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      const mapped = mapSupabaseError(error.message ?? "");
      // If it's specifically about password, show under password field
      if (
        error.message?.toLowerCase().includes("credentials") ||
        error.message?.toLowerCase().includes("password")
      ) {
        setPasswordErr("Incorrect password. Please try again.");
      } else if (error.message?.toLowerCase().includes("email")) {
        setEmailErr("Invalid email address.");
      } else {
        setServerError(mapped);
      }
    } else {
      navigate({ to: "/role" });
    }
  };

  // ── Google Login ─────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setLoading(true);
    setServerError(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setServerError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  const hasFieldErrors = !!emailErr || !!passwordErr;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background text-foreground overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-10">
        <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-2xl p-8 shadow-2xl">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Logo size={48} />
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-center text-sm text-muted-foreground">
              Sign in to manage your emergency profile and active alerts.
            </p>
          </div>

          {/* Server-level Error Banner */}
          {serverError && (
            <div className="mb-5 flex items-start gap-3 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CircleAlert className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive font-medium">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-1" noValidate>

            {/* ── Email Field ── */}
            <div className="mb-1">
              <label className="block max-w-[360px] mx-auto w-full">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Email
                </span>
                <span className={`flex items-center gap-3 rounded-[16px] border bg-white/[0.03] px-4 transition-colors focus-within:border-primary/60 ${
                  emailErr ? "border-destructive/60 bg-destructive/5" : "border-border"
                }`}>
                  <Mail className={`h-5 w-5 shrink-0 ${emailErr ? "text-destructive" : "text-muted-foreground"}`} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => {
                      if (!email.trim()) setEmailErr("Email address is required.");
                      else if (!isValidEmail(email)) setEmailErr("Please enter a valid email address.");
                    }}
                    className="h-13 w-full bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                    autoComplete="email"
                    inputMode="email"
                  />
                </span>
                <FieldError msg={emailErr} />
              </label>
            </div>

            {/* ── Password Field ── */}
            <div className="mb-1">
              <label className="block max-w-[360px] mx-auto w-full">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Password
                </span>
                <span className={`flex items-center gap-3 rounded-[16px] border bg-white/[0.03] px-4 transition-colors focus-within:border-primary/60 ${
                  passwordErr ? "border-destructive/60 bg-destructive/5" : "border-border"
                }`}>
                  <Lock className={`h-5 w-5 shrink-0 ${passwordErr ? "text-destructive" : "text-muted-foreground"}`} />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => {
                      if (!password) setPasswordErr("Password is required.");
                    }}
                    className="h-13 w-full bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                    autoComplete="current-password"
                  />
                  {/* Show / hide password toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPass
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />
                    }
                  </button>
                </span>
                <FieldError msg={passwordErr} />
              </label>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end max-w-[360px] mx-auto pt-1">
              <Link
                to="/otp"
                className="text-xs text-primary font-medium hover:underline transition-colors"
              >
                Forgot password? Use OTP →
              </Link>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <GlowButton
                type="submit"
                className="w-full h-12 text-base shadow-xl shadow-primary/20"
                disabled={loading || hasFieldErrors}
              >
                {loading
                  ? <Loader2 className="h-5 w-5 animate-spin" />
                  : "Log in"
                }
              </GlowButton>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 py-5 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-3 text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        {/* Emergency Shortcut */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/power-sos"
            className="group flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            <AlertTriangle className="h-4 w-4" />
            Emergency Access (No Login)
          </Link>
        </div>
      </div>
    </div>
  );
}
