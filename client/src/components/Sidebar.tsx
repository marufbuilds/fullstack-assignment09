 
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

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { user, status, role, signOut } = useAuth();

  const isOwner = role === "owner" || role === "admin";
  const isAdmin = role === "admin";

  function renderGroup(items: NavItem[], title?: string) {
    return (
      <div className="mb-7">
        {title && (
          <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A3978C]">
            {title}
          </p>
        )}

        <nav className="space-y-1">
          {items.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#79563E] text-white shadow-sm"
                    : "text-[#71665D] hover:bg-[#F3EDE7] hover:text-[#79563E]"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  className={
                    active
                      ? "text-white"
                      : "text-[#9A8D80] group-hover:text-[#79563E]"
                  }
                />

                <span>{label}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
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
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col border-r border-[#E8DFD6] bg-[#FFFCFA] px-5 py-6 transition-transform duration-300 lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#79563E] text-xl font-bold text-white">
              E
            </span>

            <span className="text-[22px] font-bold tracking-tight text-[#292723]">
              Equiply<span className="text-[#9A7656]">.</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-[#82776D] transition hover:bg-[#F3EDE7] hover:text-[#79563E] lg:hidden"
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
            [
              { label: "Profile", href: "/profile", icon: UserRound },
              ...secondary,
            ],
            "Account",
          )}
        </div>

        <div className="mt-4 border-t border-[#E8DFD6] pt-5">
          <div className="mb-5 rounded-2xl border border-[#E8DFD6] bg-[#F8F3EE] p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#79563E]">
              <CircleHelp size={18} />
            </div>

            <h3 className="text-sm font-semibold text-[#292723]">
              Need a hand?
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#82776D]">
              Find answers about bookings, payments and listings.
            </p>

            <Link
              href="/help"
              onClick={onClose}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#79563E] hover:text-[#5E402D]"
            >
              Get help
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {status === "authenticated" && user ? (
            <div className="space-y-3">
              <div className="flex min-w-0 items-center gap-3 px-1">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDE2D7] text-sm font-bold text-[#79563E]">
                  {(user.name || "E").charAt(0).toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#292723]">
                    {user.name}
                  </p>

                  <p className="mt-0.5 text-xs capitalize text-[#82776D]">
                    {role || "member"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void signOut()}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#82776D] transition hover:bg-[#F3EDE7] hover:text-[#A34B3F]"
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
                className="flex w-full items-center justify-center rounded-xl border border-[#E8DFD6] px-4 py-3 text-sm font-semibold text-[#79563E] transition hover:bg-[#F3EDE7]"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-xl bg-[#79563E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#65452F]"
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
