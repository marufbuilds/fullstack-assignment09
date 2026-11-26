"use client";

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
  ArrowUpRight,
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
      <div className="mb-7">
        {title && (
          <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {title}
          </p>
        )}

        <nav className="space-y-1">
          {items.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-200 ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-primary"}`}
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  className={
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-primary"
                  }
                />

                <span>{label}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#292723]/40 backdrop-blur-[2px] lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col border-r border-border bg-background px-5 py-6 transition-transform duration-300 lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
              E
            </span>

            <span className="text-[22px] font-bold tracking-tight text-foreground">
              Equiply<span className="text-primary">.</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-primary lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
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
        </div>

        <div className="mt-4 border-t border-border pt-5">
          <div className="mb-5 rounded-2xl border border-border bg-secondary p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-card text-primary">
              <CircleHelp size={18} />
            </div>

            <h3 className="text-sm font-semibold text-foreground">Need a hand?</h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Find answers about bookings, payments and listings.
            </p>

            <Link
              href="/help"
              onClick={onClose}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary"
            >
              Get help
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {status === "authenticated" && user ? (
            <div className="space-y-3">
              <div className="flex min-w-0 items-center gap-3 px-1">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary">
                  {(user.name || "E").charAt(0).toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </p>

                  <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                    {role || "member"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void signOut()}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-destructive"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-semibold text-primary transition hover:bg-secondary"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
              >
                Create account
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
