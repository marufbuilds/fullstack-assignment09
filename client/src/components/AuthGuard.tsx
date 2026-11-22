"use client";

// Protects pages that need a signed-in user (and optionally a role).

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ShieldAlert, Lock } from "lucide-react";

import { useAuth } from "@/lib/auth";
import { LoadingPage } from "./ui";

export function AuthGuard({
  children,
  require,
}: {
  children: ReactNode;
  /** Minimum role needed: "customer" (any user), "owner" or "admin". */
  require?: "owner" | "admin";
}) {
  const { status, role } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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

  if (require === "admin" && role !== "admin") {
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
            Your account does not have the admin role. Sign in with an admin account to
            open the administration panel.
          </p>
          <Link className="btn" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (require === "owner" && role !== "owner" && role !== "admin") {
    return (
      <div className="wrap section" style={{ maxWidth: 720 }}>
        <div className="card empty">
          <span
            className="empty-icon"
            style={{ background: "#fff6e6", color: "#9a6700" }}
          >
            <Lock size={28} />
          </span>
          <h1 className="h3">Owner tools only</h1>
          <p className="muted" style={{ maxWidth: 500, margin: 0 }}>
            Listing equipment requires the <b>owner</b> role. Your account is currently a{" "}
            <b>{role || "customer"}</b> — ask an administrator to promote you from the
            Admin panel, then reload this page.
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
            <Link className="btn-outline" href="/help">
              Read the guide
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
