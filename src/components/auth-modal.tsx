import { useState, type FormEvent } from "react";
import { X, Lock, Mail, User as UserIcon, Phone, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import brandIcon from "@/assets/affordable-laundry-icon.jpg";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, defaultMode = "signin", onSuccess }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        if (!name.trim()) {
          setError("Please tell us your name.");
          setSubmitting(false);
          return;
        }
        await signUpWithEmail(email, password, name.trim(), phone.trim());
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not sign in";
      if (msg.includes("email-already-in-use")) {
        setError("This email already has an account. Please click 'Sign In' below.");
      } else if (msg.includes("wrong-password") || msg.includes("Incorrect password")) {
        setError("The password was not correct. Please try again.");
      } else if (msg.includes("weak-password")) {
        setError("Please choose a password with at least 6 letters or numbers.");
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign in was cancelled");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden bg-card/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-5">
          <img
            src={brandIcon}
            alt="Affordable Laundry"
            className="w-14 h-14 rounded-2xl border border-primary/20 shadow-md mb-2 object-cover"
          />
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            {mode === "signin" ? "Welcome Back" : "Create Your Account"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            {mode === "signin"
              ? "See your washed clothes, track the rider, and check your past orders."
              : "Save your hall or house address and book fast pickups anytime."}
          </p>
        </div>

        {/* Easy Google Sign-In */}
        <div className="mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            disabled={loading || submitting}
            className="w-full h-11 flex items-center justify-center gap-3 rounded-2xl text-xs font-bold border border-border hover:bg-muted transition-all shadow-xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-foreground">Continue with Google</span>
          </Button>
        </div>

        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-border w-full" />
          <span className="bg-card px-3 text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
            or use email
          </span>
        </div>

        {/* Tab switch between Sign In and Sign Up */}
        <div className="flex bg-muted/60 p-1 rounded-xl mb-4 border border-border/50">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "signin"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create Account
          </button>
        </div>

        {error ? (
          <div className="p-3 mb-3 text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in">
            {error}
          </div>
        ) : null}

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kwame Mensah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Phone Number (so the rider can call you)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="053 233 1150"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 mt-2 rounded-2xl text-xs font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "signin" ? (
              "Sign In to Your Account"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-4 pt-3 border-t border-border/60 text-center">
          <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            Your account works on your phone, tablet, and laptop.
          </p>
        </div>
      </div>
    </div>
  );
}
