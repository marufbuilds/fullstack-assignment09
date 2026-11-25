 
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Moon,
  PackagePlus,
  ShieldCheck,
  Sun,
  UserRound,
  Wallet,
  X,
  ArrowUpRight,
} from "lucide-react";

import { useAuth } from "@/lib/auth";
import { initials } from "@/lib/format";

const primaryLinks = [
  { label: "Browse Equipment", href: "/equipment" },
  { label: "List Your Equipment", href: "/add-equipment" },
  { label: "About", href: "/about" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DFD6] bg-white text-[#79563E] transition hover:border-[#79563E] hover:bg-[#F7F1EB]"
    >
      {!mounted || !isDark ? (
        <Moon size={17} />
      ) : (
        <Sun size={17} />
      )}
    </button>
  );
}

export function Navbar({
  onToggleMenu,
}: {
  onToggleMenu: () => void;
}) {
  const pathname = usePathname();
  const { user, status, role, signOut } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileLinksOpen, setMobileLinksOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const normalizedRole = String(role || user?.role || "")
    .trim()
    .toLowerCase();

  const isOwner = ["owner", "admin"].includes(normalizedRole);
  const isAdmin = normalizedRole === "admin";

  const profileImage = (
    user as (typeof user & { image?: string | null }) | null
  )?.image;

  useEffect(() => {
    setMenuOpen(false);
    setMobileLinksOpen(false);
  }, [pathname]);

  useEffect(() => {
    setImageFailed(false);
  }, [profileImage]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8DFD6] bg-[#FFFCFA]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Equiply home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#79563E] text-xl font-bold text-white">
            E
          </span>

          <span className="text-[23px] font-bold tracking-[-1px] text-[#292723]">
            Equiply
            <span className="text-[#94765B]">.</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-2 text-[13px] font-medium transition-colors ${
                isActive(link.href)
                  ? "text-[#79563E]"
                  : "text-[#766E65] hover:text-[#79563E]"
              }`}
            >
              {link.label}

              {isActive(link.href) && (
                <span className="absolute -bottom-[2px] left-0 h-[2px] w-full rounded-full bg-[#79563E]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {status === "loading" && (
            <div className="h-10 w-24 animate-pulse rounded-full bg-[#F0EAE4]" />
          )}

          {/* Guest actions */}
          {status === "unauthenticated" && (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-5 py-2.5 text-[13px] font-semibold text-[#79563E] transition hover:bg-[#F7F1EB] sm:inline-flex"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#79563E] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5D402E] sm:px-6"
              >
                Get Started
                <ArrowUpRight size={15} />
              </Link>
            </>
          )}

          {/* Authenticated user */}
          {status === "authenticated" && user && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex h-11 items-center gap-2 rounded-full border border-[#E8DFD6] bg-white py-1 pl-1 pr-3 transition hover:border-[#CDBBA8] hover:bg-[#FDF9F5]"
              >
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#EDE2D6] text-xs font-semibold text-[#79563E]">
                  {profileImage && !imageFailed ? (
                    <img
                      src={profileImage}
                      alt={`${user.name}'s profile`}
                      onError={() => setImageFailed(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(user.name)
                  )}
                </span>

                <span className="hidden max-w-[100px] truncate text-[12px] font-semibold text-[#302A24] sm:block">
                  {user.name.split(" ")[0]}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-[#8B837A] transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[280px] overflow-hidden rounded-2xl border border-[#E8DFD6] bg-[#FFFCFA] shadow-[0_15px_45px_rgba(55,40,28,0.13)]">
                  <div className="border-b border-[#E8DFD6] bg-[#F7F1EB] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E6D8C9] text-sm font-semibold text-[#79563E]">
                        {profileImage && !imageFailed ? (
                          <img
                            src={profileImage}
                            alt={`${user.name}'s profile`}
                            onError={() => setImageFailed(true)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initials(user.name)
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#302A24]">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-[#82776D]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-semibold capitalize tracking-wide text-[#79563E]">
                      {normalizedRole || "member"}
                    </span>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#55483D] transition hover:bg-[#F7F1EB] hover:text-[#79563E]"
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>

                    <Link
                      href="/my-rentals"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#55483D] transition hover:bg-[#F7F1EB] hover:text-[#79563E]"
                    >
                      <Wallet size={17} />
                      My rentals
                    </Link>

                    <Link
                      href="/favorites"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#55483D] transition hover:bg-[#F7F1EB] hover:text-[#79563E]"
                    >
                      <Heart size={17} />
                      Favorites
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#55483D] transition hover:bg-[#F7F1EB] hover:text-[#79563E]"
                    >
                      <UserRound size={17} />
                      Profile settings
                    </Link>

                    {isOwner && (
                      <>
                        <div className="my-2 border-t border-[#E8DFD6]" />

                        <Link
                          href="/add-equipment"
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#55483D] transition hover:bg-[#F7F1EB] hover:text-[#79563E]"
                        >
                          <PackagePlus size={17} />
                          Add equipment
                        </Link>

                        <Link
                          href="/owner/listings"
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#55483D] transition hover:bg-[#F7F1EB] hover:text-[#79563E]"
                        >
                          <ListChecks size={17} />
                          My listings
                        </Link>

                        <Link
                          href="/owner"
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#55483D] transition hover:bg-[#F7F1EB] hover:text-[#79563E]"
                        >
                          <LayoutDashboard size={17} />
                          Owner workspace
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#55483D] transition hover:bg-[#F7F1EB] hover:text-[#79563E]"
                      >
                        <ShieldCheck size={17} />
                        Admin panel
                      </Link>
                    )}

                    <div className="my-2 border-t border-[#E8DFD6]" />

                    <button
                      type="button"
                      onClick={async () => {
                        setMenuOpen(false);
                        await signOut();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-[#A34D40] transition hover:bg-[#FCEFEB]"
                    >
                      <LogOut size={17} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => {
              setMobileLinksOpen((open) => !open);
              onToggleMenu();
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileLinksOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DFD6] bg-white text-[#79563E] transition hover:bg-[#F7F1EB] lg:hidden"
          >
            {mobileLinksOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation links */}
      {mobileLinksOpen && (
        <div className="border-t border-[#E8DFD6] bg-[#FFFCFA] px-5 py-4 lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col gap-1">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-[#F7F1EB] text-[#79563E]"
                    : "text-[#766E65] hover:bg-[#F7F1EB] hover:text-[#79563E]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex items-center justify-between border-t border-[#E8DFD6] pt-3">
              <span className="text-xs font-medium text-[#82776D]">
                Appearance
              </span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
