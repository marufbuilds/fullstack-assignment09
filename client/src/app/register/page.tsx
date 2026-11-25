 
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  X,
  AlertCircle,
} from "lucide-react";

import { authClient, nextPath, useAuth } from "@/lib/auth";
import { Spinner } from "@/components/ui";

type ToastType = "success" | "error" | "info";

type ToastData = {
  type: ToastType;
  title: string;
  description: string;
};

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [goal, setGoal] = useState("customer");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const target = nextPath(searchParams.get("next"));

  // Automatically hide toast after 4 seconds.
  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(target);
    }
  }, [status, target, router]);

  function showToast(type: ToastType, title: string, description: string) {
    setToast({ type, title, description });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setToast(null);

    if (password !== confirm) {
      setMessage("Both passwords must match.");
      showToast("error", "Password mismatch", "Both passwords must match.");
      return;
    }

    if (password.length < 8) {
      setMessage("Your password must be at least 8 characters.");
      showToast(
        "error",
        "Weak password",
        "Your password must be at least 8 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        const errorText =
          result.error.message || "Could not create your account.";

        setMessage(errorText);
        showToast("error", "Registration failed", errorText);
        return;
      }

      showToast(
        "success",
        "Account created successfully!",
        "Welcome to Equiply. Redirecting you now..."
      );

      // New accounts start as customers.
      // Admin approval is required for owner permissions.
      window.setTimeout(() => {
        router.replace(goal === "owner" ? "/add-equipment" : target);
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);

      const errorText =
        "Could not reach the Equiply API. Is the backend running?";

      setMessage(errorText);
      showToast("error", "Registration failed", errorText);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setMessage("");
    setToast(null);
    setGoogleLoading(true);

    showToast(
      "info",
      "Connecting to Google",
      "Please wait while we redirect you..."
    );

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: target,
      });
    } catch (error) {
      console.error("Google registration error:", error);

      const errorText = "Google sign-up could not be started.";

      setMessage(errorText);
      showToast("error", "Google sign-up failed", errorText);
      setGoogleLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-[#FFFCFA] px-4 py-6 text-[#292723] sm:px-6 lg:py-10">

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-5 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-[0_12px_40px_rgba(60,40,20,0.12)] animate-in slide-in-from-top-3 fade-in duration-300"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              toast.type === "success"
                ? "bg-[#F1F5EF] text-[#54734D]"
                : toast.type === "error"
                  ? "bg-[#FDF0ED] text-[#B65E4B]"
                  : "bg-[#F8F3EE] text-[#79563E]"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={21} />
            ) : (
              <AlertCircle size={21} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#292723]">
              {toast.title}
            </p>

            <p className="mt-1 text-xs leading-5 text-[#82776D]">
              {toast.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Close notification"
            className="rounded-lg p-1 text-[#A0968D] transition hover:bg-[#F8F3EE] hover:text-[#79563E]"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-[1250px] items-center gap-6 lg:grid-cols-2 lg:gap-12">

        {/* LEFT: Equipment image */}
        <section className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl bg-[#6C5543] p-6 sm:min-h-[380px] sm:p-9 lg:min-h-[680px] lg:p-11">
          <img
            src="/images/equiply-register.jpg"
            alt="Equipment and tools ready for rental"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#211A15]/90 via-[#292723]/25 to-[#292723]/10" />

          <Link
            href="/"
            className="relative z-10 inline-flex w-fit items-center gap-3 text-white"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-xl font-bold backdrop-blur-sm">
              E
            </span>

            <span className="text-2xl font-bold tracking-tight">
              Equiply
            </span>
          </Link>

          <div className="relative z-10 mt-12 max-w-lg text-white">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[2.5px] text-[#E9C9A9] sm:text-xs">
              Join the marketplace
            </p>

            <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Rent what you need.
              <br />
              Share what you own.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/85 sm:text-base">
              Discover useful equipment, connect with owners, and make your
              next project easier with Equiply.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-white/90">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                Easy booking
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                Flexible rentals
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                Secure checkout
              </span>
            </div>
          </div>
        </section>

        {/* RIGHT: Registration form */}
        <section className="mx-auto w-full max-w-[480px] py-4 lg:py-8">
          <div className="rounded-3xl border border-[#E8DFD6] bg-white p-6 shadow-[0_12px_45px_rgba(60,40,20,0.055)]">

            <div className="mb-7">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#9A7656]">
                Get started
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Create account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#82776D]">
                Fill in your details to join the Equiply community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-semibold text-[#463B32]"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  required
                  minLength={2}
                  placeholder="Your name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 text-sm outline-none transition placeholder:text-[#B0A69D] focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold text-[#463B32]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 text-sm outline-none transition placeholder:text-[#B0A69D] focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold text-[#463B32]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 pr-12 text-sm outline-none transition placeholder:text-[#B0A69D] focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShow((value) => !value)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#82776D] transition hover:text-[#79563E]"
                  >
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirm"
                  className="mb-2 block text-xs font-semibold text-[#463B32]"
                >
                  Confirm password
                </label>

                <input
                  id="confirm"
                  type={show ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 text-sm outline-none transition placeholder:text-[#B0A69D] focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
                />
              </div>

              {/* Account goal */}
              <div>
                <label
                  htmlFor="goal"
                  className="mb-2 block text-xs font-semibold text-[#463B32]"
                >
                  I want to...
                </label>

                <select
                  id="goal"
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 text-sm text-[#463B32] outline-none transition focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
                >
                  <option value="customer">
                    Rent equipment from other people
                  </option>

                  <option value="owner">
                    List my own equipment for rent
                  </option>
                </select>
              </div>

              {/* Create account */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#79563E] text-sm font-semibold text-white transition hover:bg-[#62432F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={17} />
                    Create account
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E8DFD6]" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[10px] font-medium uppercase tracking-wider text-[#A0968D]">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google sign up */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading || loading}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#E8DFD6] bg-white text-sm font-semibold text-[#463B32] transition hover:bg-[#F8F3EE] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {googleLoading ? (
                  <>
                    <Spinner dark />
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 48 48"
                      className="h-[18px] w-[18px]"
                      aria-hidden="true"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                        transform="translate(0 4)"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.77 7.18l7.73 6C44.41 38.05 46.98 31.91 46.98 24.55Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
                      />
                    </svg>

                    Sign up with Google
                  </>
                )}
              </button>

              {/* Error message */}
              {message && (
                <p className="text-xs leading-5 text-[#B65E4B]">
                  {message}
                </p>
              )}
            </form>

            {/* Login link */}
            <p className="mt-7 text-center text-sm text-[#82776D]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#79563E] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Security message */}
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-[#A0968D]">
            <ShieldCheck size={15} className="text-[#79563E]" />
            Your account and personal information are protected.
          </p>

          {/* Back home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#82776D] transition hover:text-[#79563E]"
            >
              Back to home
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function Register() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFFCFA] text-sm text-[#82776D]">
          <Spinner />
          <span className="ml-3">Loading registration...</span>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
