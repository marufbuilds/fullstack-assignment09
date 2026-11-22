"use client";

// Create an account through the Express API (Better Auth).

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";

import { authClient, nextPath, useAuth } from "@/lib/auth";
import { Notice, Spinner } from "@/components/ui";

export default function Register() {
  const router = useRouter();
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

  const [target, setTarget] = useState("/dashboard");

  useEffect(() => {
    setTarget(nextPath());
  }, []);

  useEffect(() => {
    if (status === "authenticated") router.replace(target);
  }, [status, target, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (password !== confirm) {
      setMessage("Both passwords must match.");
      return;
    }
    if (password.length < 8) {
      setMessage("Your password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.signUp.email({ name, email, password });
      if (result.error) {
        setMessage(result.error.message || "Could not create your account.");
        return;
      }
      // Owners still need an admin to grant the owner role.
      router.replace(goal === "owner" ? "/add-equipment" : target);
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
        callbackURL: target,
      });
    } catch {
      setMessage("Google sign-up could not be started.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="wrap section authwrap">
      <div className="authside">
        <p className="eyebrow">Join the marketplace</p>
        <h1 className="h2">
          Rent what you need.
          <br />
          Share what you own.
        </h1>
        <p>
          One account to discover equipment, request rentals or start earning from the
          gear already sitting in your garage.
        </p>
        <div className="authpill">✓ Free to join · No listing fees to start</div>

        <div className="notice" style={{ marginTop: 24 }}>
          <strong style={{ display: "block", marginBottom: 4 }}>How roles work</strong>
          New accounts start as <b>customers</b>. Choose “list equipment” and an
          administrator will enable owner tools for your account from the admin panel.
        </div>
      </div>

      <div className="card authcard">
        <p className="eyebrow">Get started</p>
        <h2 className="h2" style={{ fontSize: "1.9rem", marginTop: 6 }}>
          Create account
        </h2>
        <p className="muted" style={{ marginTop: 6 }}>
          Fill in your details to join Equiply.
        </p>

        <form className="authform" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              required
              minLength={2}
              placeholder="Your name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

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
                autoComplete="new-password"
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

          <label>
            Confirm password
            <input
              type={show ? "text" : "password"}
              required
              minLength={8}
              placeholder="Repeat your password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
            />
          </label>

          <label>
            I want to…
            <select value={goal} onChange={(event) => setGoal(event.target.value)}>
              <option value="customer">Rent equipment from other people</option>
              <option value="owner">List my own equipment for rent</option>
            </select>
          </label>

          <button className="btn btn-block" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner /> Creating account…
              </>
            ) : (
              <>
                <UserPlus size={18} /> Create account
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
            Sign up with Google
          </button>

          {message && <Notice kind="error">{message}</Notice>}
        </form>

        <p className="authfoot">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
