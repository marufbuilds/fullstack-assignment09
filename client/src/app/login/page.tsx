 
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { authClient, useAuth } from "@/lib/auth";
import { Notice, Spinner } from "@/components/ui";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@equiply.dev", password: "Admin12345!" },
  { role: "Owner", email: "owner@equiply.dev", password: "Owner12345!" },
  { role: "Customer", email: "renter@equiply.dev", password: "Renter12345!" },
];

export default function Login() {
  const router = useRouter();
  const { status } = useAuth();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [target, setTarget] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");

    if (next && next.startsWith("/") && !next.startsWith("//")) {
      setTarget(next);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(target);
    }
  }, [status, target, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({ email, password });

      if (result.error) {
        setMessage(result.error.message || "Could not sign you in.");
        return;
      }

      router.replace(target);
    } catch {
      setMessage("Could not reach the Equiply API. Is the backend running?");
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
  } catch {
    setMessage("Google sign-in could not be started.");
    setGoogleLoading(false);
  }
}

  return (
    <div className="wrap section authwrap">
      <div className="authside">
        <p className="eyebrow">Your next project starts here</p>

        <h1 className="h2">
          Get the gear.
          <br />
          Get it done.
        </h1>

        <p>
          Sign in to request rentals, track bookings, manage your listings
          and keep your favorites in sync across devices.
        </p>

        <div className="authpill">
          ✓ Flexible rentals · Verified owners · Secure checkout
        </div>

        <div className="notice notice-info" style={{ marginTop: 24 }}>
          <strong style={{ display: "block", marginBottom: 6 }}>
            Demo accounts
          </strong>

          {DEMO_ACCOUNTS.map((account) => (
            <span
              key={account.email}
              style={{ display: "block", fontSize: 13.5, lineHeight: 1.7 }}
            >
              <b>{account.role}:</b> {account.email} · {account.password}
            </span>
          ))}
        </div>
      </div>

      <div className="card authcard">
        <p className="eyebrow">Welcome back</p>

        <h2 className="h2" style={{ fontSize: "1.9rem", marginTop: 6 }}>
          Sign in
        </h2>

        <p className="muted" style={{ marginTop: 6 }}>
          Use your email and password to continue.
        </p>

        <form className="authform" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Password
            <div className="passwordfield">
              <input
                type={show ? "text" : "password"}
                required
                minLength={8}
                placeholder="At least 8 characters"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                type="button"
                className="textbutton"
                onClick={() => setShow((value) => !value)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <div className="authrow">
            <label className="checklabel">
              <input type="checkbox" defaultChecked />
              Keep me signed in
            </label>

            <a
              className="muted"
              href="mailto:support@equiply.example"
              style={{ fontSize: 14 }}
            >
              Forgot password?
            </a>
          </div>

          <button className="btn btn-block" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner /> Signing in…
              </>
            ) : (
              <>
                <LogIn size={18} /> Sign in
              </>
            )}
          </button>

          <button
            className="btn btn-outline btn-block"
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? <Spinner dark /> : null}
            {googleLoading ? "Connecting to Google…" : "Continue with Google"}
          </button>

          {message && <Notice kind="error">{message}</Notice>}
        </form>

        <p className="authfoot">
          New to Equiply? <Link href="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
