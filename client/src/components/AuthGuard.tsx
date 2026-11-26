"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ShieldAlert, Lock } from "lucide-react";

import { useAuth } from "@/lib/auth";
import { LoadingPage } from "./ui";

type AuthGuardProps = {
  children: ReactNode;
  require?: "owner" | "admin";
};

export function AuthGuard({ children, require }: AuthGuardProps) {
  const { status, role, user } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const contextRole = String(role ?? "")
    .trim()
    .toLowerCase();
  const userRole = String(user?.role ?? "")
    .trim()
    .toLowerCase();

  // Recognize admin from either auth source.
  const isAdmin = contextRole === "admin" || userRole === "admin";
  const isOwner = contextRole === "owner" || userRole === "owner";

  const currentRole = isAdmin ? "admin" : isOwner ? "owner" : contextRole || userRole;

  useEffect(() => {
    if (status === "unauthenticated") {
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?next=${next}`);
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return <LoadingPage label="Checking your session…" />;
  }

  if (status === "unauthenticated") {
    return <LoadingPage label="Redirecting to sign in…" />;
  }

  if (require === "admin" && !isAdmin) {
    return (
      <div className="wrap section" style={{ maxWidth: 720 }}>
        <div className="card empty">
          <span
            className="empty-icon"
            style={{ background: "#fff6e6", color: "#9a6700" }}
          >
            <ShieldAlert size={28} />
          </span>
          <h1 className="h3">Admin access required</h1>
          <p className="muted">Your account does not have administrator permissions.</p>
          <Link className="btn" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (require === "owner" && !isOwner && !isAdmin) {
    return (
      <div className="wrap section" style={{ maxWidth: 720 }}>
        <div className="card empty">
          <span
            className="empty-icon"
            style={{ background: "#fff6e6", color: "#9a6700" }}
          >
            <Lock size={28} />
          </span>
          <h1 className="h3">Owner access required</h1>
          <p className="muted">
            Your current account role is <b>{currentRole || "unknown"}</b>. You need an
            owner or admin account to access this page.
          </p>
          <Link className="btn" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
