"use client";

// Left workspace navigation. Collapses into a drawer on small screens.

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleHelp,
  Heart,
  Info,
  LayoutDashboard,
  ListChecks,
  LogOut,
  PackagePlus,
  PackageSearch,
  CalendarDays,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "@/lib/auth";

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const workspace: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Browse equipment", href: "/equipment", icon: PackageSearch },
  { label: "My rentals", href: "/my-rentals", icon: CalendarDays },
  { label: "Favorites", href: "/favorites", icon: Heart },
];

const ownerItems: NavItem[] = [
  { label: "Add equipment", href: "/add-equipment", icon: PackagePlus },
  { label: "My listings", href: "/owner/listings", icon: ListChecks },
  { label: "Owner workspace", href: "/owner", icon: LayoutDashboard },
];

const secondary: NavItem[] = [
  { label: "About Equiply", href: "/about", icon: Info },
  { label: "Help center", href: "/help", icon: CircleHelp },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, status, role, signOut } = useAuth();

  const isOwner = role === "owner" || role === "admin";
  const isAdmin = role === "admin";

  function renderGroup(items: NavItem[], title?: string) {
    return (
      <div className="sidebar-group">
        {title && <p className="sidebar-caption">{title}</p>}
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`sidebar-link${active ? " active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {open && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside className={`equiply-sidebar${open ? " sidebar-open" : ""}`}>
        <Link href="/" className="sidebar-brand" onClick={onClose}>
          <span className="brand-mark">E</span>
          <span>Equiply</span>
        </Link>

        <button
          className="mobile-toggle"
          style={{ position: "absolute", top: 14, right: 14 }}
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>

        {renderGroup(workspace, "Workspace")}
        {isOwner && renderGroup(ownerItems, "Owner tools")}
        {isAdmin &&
          renderGroup(
            [{ label: "Admin panel", href: "/admin", icon: ShieldCheck }],
            "Administration",
          )}
        {renderGroup(
          [{ label: "Profile", href: "/profile", icon: UserRound }, ...secondary],
          "Account",
        )}

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <strong>Need a hand?</strong>
            <span>Find answers about bookings, payments and listings.</span>
            <Link href="/help" onClick={onClose}>
              Get help →
            </Link>
          </div>

          {status === "authenticated" && user ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "4px 8px",
                }}
              >
                <span className="avatar avatar-sm">
                  {(user.name || "E").charAt(0).toUpperCase()}
                </span>
                <span style={{ minWidth: 0 }}>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 14,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.name}
                  </strong>
                  <span className="muted" style={{ fontSize: 12.5 }}>
                    {role || "member"}
                  </span>
                </span>
              </div>
              <button className="sidebar-link" onClick={() => void signOut()}>
                <LogOut size={18} />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="sidebar-link" onClick={onClose}>
                Sign in
              </Link>
              <Link href="/register" className="sidebar-cta" onClick={onClose}>
                Create account
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
