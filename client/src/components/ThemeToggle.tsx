 
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
  Sun,
  PackagePlus,
  ShieldCheck,
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

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        title="Toggle theme"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted"
      >
        <Moon size={17} />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted"
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
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

  const navLinkClass = (href: string) =>
    `relative py-2 text-[13px] font-medium transition-colors ${
      isActive(href)
        ? "text-primary"
        : "text-muted-foreground hover:text-primary"
    }`;

  const dropdownLinkClass =
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-card-foreground transition hover:bg-muted hover:text-primary";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Equiply home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
            E
          </span>

          <span className="text-[23px] font-bold tracking-[-1px] text-foreground">
            Equiply
            <span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navLinkClass(link.href)}
            >
              {link.label}

              {isActive(link.href) && (
                <span className="absolute -bottom-[2px] left-0 h-[2px] w-full rounded-full bg-primary" />
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
            <div className="h-10 w-24 animate-pulse rounded-full bg-muted" />
          )}

          {/* Guest actions */}
          {status === "unauthenticated" && (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-5 py-2.5 text-[13px] font-semibold text-primary transition hover:bg-muted sm:inline-flex"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-[12px] font-semibold text-primary-foreground transition hover:opacity-90 sm:px-6"
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
                className="flex h-11 items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-card-foreground transition hover:bg-muted"
              >
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold text-primary">
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

                <span className="hidden max-w-[100px] truncate text-[12px] font-semibold text-card-foreground sm:block">
                  {user.name.split(" ")[0]}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-muted-foreground transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[280px] overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                  <div className="border-b border-border bg-muted p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background text-sm font-semibold text-primary">
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
                        <p className="truncate text-sm font-semibold text-card-foreground">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <span className="mt-3 inline-flex rounded-full bg-background px-3 py-1 text-[10px] font-semibold capitalize tracking-wide text-primary">
                      {normalizedRole || "member"}
                    </span>
                  </div>

                  <div className="p-2">
                    <Link href="/dashboard" className={dropdownLinkClass}>
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>

                    <Link href="/my-rentals" className={dropdownLinkClass}>
                      <Wallet size={17} />
                      My rentals
                    </Link>

                    <Link href="/favorites" className={dropdownLinkClass}>
                      <Heart size={17} />
                      Favorites
                    </Link>

                    <Link href="/profile" className={dropdownLinkClass}>
                      <UserRound size={17} />
                      Profile settings
                    </Link>

                    {isOwner && (
                      <>
                        <div className="my-2 border-t border-border" />

                        <Link href="/add-equipment" className={dropdownLinkClass}>
                          <PackagePlus size={17} />
                          Add equipment
                        </Link>

                        <Link href="/owner/listings" className={dropdownLinkClass}>
                          <ListChecks size={17} />
                          My listings
                        </Link>

                        <Link href="/owner" className={dropdownLinkClass}>
                          <LayoutDashboard size={17} />
                          Owner workspace
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <Link href="/admin" className={dropdownLinkClass}>
                        <ShieldCheck size={17} />
                        Admin panel
                      </Link>
                    )}

                    <div className="my-2 border-t border-border" />

                    <button
                      type="button"
                      onClick={async () => {
                        setMenuOpen(false);
                        await signOut();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-destructive transition hover:bg-destructive/10"
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted lg:hidden"
          >
            {mobileLinksOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation links */}
      {mobileLinksOpen && (
        <div className="border-t border-border bg-background px-5 py-4 lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col gap-1">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs font-medium text-muted-foreground">
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
