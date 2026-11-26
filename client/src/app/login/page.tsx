 
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { authClient, useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { Spinner } from "@/components/ui";

export default function Login() {
  const router = useRouter();
  const { status } = useAuth();
  const { showToast } = useToast();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [target, setTarget] = useState("/");
  const [loginSucceeded, setLoginSucceeded] = useState(false);

  // Get redirect destination from URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");

    if (next && next.startsWith("/") && !next.startsWith("//")) {
      setTarget(next);
    }
  }, []);

  // Redirect authenticated users.
  useEffect(() => {
    if (status === "authenticated" && !loginSucceeded) {
      router.replace(target);
    }
  }, [status, target, router, loginSucceeded]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        const errorText =
          result.error.message || "Could not sign you in.";

        setMessage(errorText);
        showToast(errorText, "error");
        return;
      }

      setLoginSucceeded(true);

      showToast(
        "You have signed in successfully. Redirecting...",
        "success"
      );

      window.setTimeout(() => {
        router.replace(target);
      }, 1200);
    } catch (error) {
      console.error("Login error:", error);

      const errorText =
        "Could not reach the Equiply API. Is the backend running?";

      setMessage(errorText);
      showToast(errorText, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setMessage("");
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${target}`,
      });
    } catch (error) {
      console.error("Google sign-in error:", error);

      const errorText = "Google sign-in could not be started.";

      setMessage(errorText);
      showToast(errorText, "error");
      setGoogleLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-[#FFFCFA] px-4 py-6 text-[#292723] sm:px-6 lg:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-[1250px] items-center gap-6 lg:grid-cols-2 lg:gap-12">

        {/* LEFT: Equipment image */}
        <section className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl bg-[#6C5543] p-6 sm:min-h-[380px] sm:p-9 lg:min-h-[680px] lg:p-11">
          <img
            src="/images/equiply-login.jpg"
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
              Your next project starts here
            </p>

            <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Get the gear.
              <br />
              Get it done.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/85 sm:text-base">
              Sign in to request rentals, track bookings, manage your listings
              and keep your favorites in sync across devices.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-white/90">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                Flexible rentals
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                Verified owners
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                Secure checkout
              </span>
            </div>
          </div>
        </section>

        {/* RIGHT: Login form */}
        <section className="mx-auto w-full max-w-[480px] py-4 lg:py-10">
          <div className="rounded-3xl border border-[#E8DFD6] bg-white p-6 shadow-[0_12px_45px_rgba(60,40,20,0.055)] sm:p-9">

            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#9A7656]">
                Welcome back
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Sign in
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#82776D]">
                Enter your details to access your Equiply account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

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
                    autoComplete="current-password"
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
                    {show ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember and forgot password */}
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs text-[#82776D]">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 accent-[#79563E]"
                  />
                  Keep me signed in
                </label>

                <a
                  href="mailto:support@equiply.example"
                  className="text-xs font-medium text-[#79563E] transition hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Email sign in */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#79563E] text-sm font-semibold text-white transition hover:bg-[#62432F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={17} />
                    Sign in
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

              {/* Google sign in */}
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

                    Continue with Google
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

            {/* Register link */}
            <p className="mt-7 text-center text-sm text-[#82776D]">
              New to Equiply?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#79563E] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Security message */}
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-[#A0968D]">
            <ShieldCheck size={15} className="text-[#79563E]" />
            Your account and booking information are protected.
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
