// Small building blocks reused by many pages.

import Link from "next/link";
import type { ReactNode } from "react";

export function Spinner({ dark = false }: { dark?: boolean }) {
  return <span className={dark ? "spinner spinner-dark" : "spinner"} aria-hidden />;
}

export function LoadingPage({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="loading-page" role="status">
      <Spinner dark />
      <span>{label}</span>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="h2" style={{ marginTop: 8 }}>
          {title}
        </h1>
        {description && (
          <p className="lead" style={{ maxWidth: 680 }}>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{actions}</div>
      )}
    </div>
  );
}

export function Notice({
  kind = "info",
  children,
}: {
  kind?: "info" | "error" | "warning" | "success";
  children: ReactNode;
}) {
  const className =
    kind === "error"
      ? "notice notice-error"
      : kind === "warning"
        ? "notice notice-warning"
        : kind === "success"
          ? "notice"
          : "notice notice-info";
  return (
    <p className={className} role="status">
      {children}
    </p>
  );
}

const STATUS_CLASS: Record<string, string> = {
  pending: "status status-pending",
  approved: "status status-approved",
  confirmed: "status status-confirmed",
  rejected: "status status-rejected",
  cancelled: "status status-cancelled",
  completed: "status status-completed",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={STATUS_CLASS[status] || "status"}>
      {label || status.replace(/_/g, " ")}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="card empty">
      <span className="empty-icon">{icon}</span>
      <h3 className="h3">{title}</h3>
      <p className="muted" style={{ maxWidth: 460, margin: 0 }}>
        {description}
      </p>
      {action}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="card empty">
      <span className="empty-icon" style={{ background: "#fdf0ee", color: "#c0392b" }}>
        !
      </span>
      <h3 className="h3">We could not load this</h3>
      <p className="muted" style={{ maxWidth: 480, margin: 0 }}>
        {message}
      </p>
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        {onRetry && (
          <button className="btn" onClick={onRetry}>
            Try again
          </button>
        )}
        <Link className="btn-outline" href="/help">
          Get help
        </Link>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="card stat">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <p>{label}</p>
        {icon && <span className="stat-icon">{icon}</span>}
      </div>
      <h2>{value}</h2>
      {hint && <small className="muted">{hint}</small>}
    </div>
  );
}

export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="card" key={index} style={{ padding: 0 }}>
          <div className="skeleton" style={{ height: 190, borderRadius: 0 }} />
          <div style={{ padding: 20, display: "grid", gap: 10 }}>
            <div className="skeleton" style={{ height: 14, width: "45%" }} />
            <div className="skeleton" style={{ height: 20, width: "85%" }} />
            <div className="skeleton" style={{ height: 14, width: "60%" }} />
            <div
              className="skeleton"
              style={{ height: 26, width: "100%", marginTop: 8 }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
