 
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

export function AuthGuard({
  children,
  require,
}: AuthGuardProps) {
  const { status, role, user } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  // Check both role sources and normalize the value.
  const currentRole = String(
    role ?? user?.role ?? "customer"
  )
    .trim()
    .toLowerCase();

  const isOwner = currentRole === "owner";
  const isAdmin = currentRole === "admin";

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

          <p className="muted" style={{ maxWidth: 470, margin: 0 }}>
            Your account does not have administrator permissions.
            Please sign in with an admin account to access this page.
          </p>

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

          <p className="muted" style={{ maxWidth: 500, margin: 0 }}>
            Your current account role is{" "}
            <b>{currentRole}</b>. You need an owner or admin
            account to manage equipment and rental requests.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link className="btn" href="/dashboard">
              Back to dashboard
            </Link>

            <Link className="btn btn-outline" href="/help">
              Read the guide
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
