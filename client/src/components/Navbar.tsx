 
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

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => {
        if (mounted) {
          setTheme(isDark ? "light" : "dark");
        }
      }}
      aria-label="Toggle theme"
      title={!mounted ? "Toggle theme" : isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DFD6] bg-white text-[#79563E] transition hover:border-[#79563E] hover:bg-[#F7F1EB] dark:border-[#66503F] dark:bg-[#30251E] dark:text-[#F0D4B8] dark:hover:border-[#C49A73] dark:hover:bg-[#453326]"
    >
      {!mounted || !isDark ? <Moon size={17} /> : <Sun size={17} />}
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
        ? "text-[#79563E] dark:text-[#F0CBA6]"
        : "text-[#766E65] hover:text-[#79563E] dark:text-[#E0C8B2] dark:hover:text-[#FFFFFF]"
    }`;

  const dropdownLinkClass =
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#55483D] transition hover:bg-[#F7F1EB] hover:text-[#79563E] dark:text-[#F0DFCF] dark:hover:bg-[#453326] dark:hover:text-[#FFFFFF]";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8DFD6] bg-[#FFFCFA]/95 backdrop-blur-md dark:border-[#5B4637] dark:bg-[#211914]/95">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Equiply home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#79563E] text-xl font-bold text-white dark:bg-[#A77A55] dark:text-white">
            E
          </span>

          <span className="text-[23px] font-bold tracking-[-1px] text-[#292723] dark:text-[#F8EDE2]">
            Equiply
            <span className="text-[#94765B] dark:text-[#D2A77E]">.</span>
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
                <span className="absolute -bottom-[2px] left-0 h-[2px] w-full rounded-full bg-[#79563E] dark:bg-[#D2A77E]" />
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
            <div className="h-10 w-24 animate-pulse rounded-full bg-[#F0EAE4] dark:bg-[#453326]" />
          )}

          {/* Guest actions */}
          {status === "unauthenticated" && (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-5 py-2.5 text-[13px] font-semibold text-[#79563E] transition hover:bg-[#F7F1EB] dark:text-[#F0D4B8] dark:hover:bg-[#453326] sm:inline-flex"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#79563E] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5D402E] dark:bg-[#A77A55] dark:text-white dark:hover:bg-[#BD9068] sm:px-6"
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
                className="flex h-11 items-center gap-2 rounded-full border border-[#E8DFD6] bg-white py-1 pl-1 pr-3 transition hover:border-[#CDBBA8] hover:bg-[#FDF9F5] dark:border-[#66503F] dark:bg-[#30251E] dark:hover:border-[#A77A55] dark:hover:bg-[#453326]"
              >
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#EDE2D6] text-xs font-semibold text-[#79563E] dark:bg-[#514033] dark:text-[#F0D4B8]">
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

                <span className="hidden max-w-[100px] truncate text-[12px] font-semibold text-[#302A24] dark:text-[#F8EDE2] sm:block">
                  {user.name.split(" ")[0]}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-[#8B837A] transition-transform dark:text-[#E0C8B2] ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[280px] overflow-hidden rounded-2xl border border-[#E8DFD6] bg-[#FFFCFA] shadow-[0_15px_45px_rgba(55,40,28,0.13)] dark:border-[#66503F] dark:bg-[#30251E] dark:shadow-black/40">
                  <div className="border-b border-[#E8DFD6] bg-[#F7F1EB] p-4 dark:border-[#66503F] dark:bg-[#453326]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E6D8C9] text-sm font-semibold text-[#79563E] dark:bg-[#514033] dark:text-[#F0D4B8]">
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
                        <p className="truncate text-sm font-semibold text-[#302A24] dark:text-[#F8EDE2]">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-[#82776D] dark:text-[#E0C8B2]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-semibold capitalize tracking-wide text-[#79563E] dark:bg-[#30251E] dark:text-[#F0D4B8]">
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
                        <div className="my-2 border-t border-[#E8DFD6] dark:border-[#66503F]" />

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

                    <div className="my-2 border-t border-[#E8DFD6] dark:border-[#66503F]" />

                    <button
                      type="button"
                      onClick={async () => {
                        setMenuOpen(false);
                        await signOut();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-[#A34D40] transition hover:bg-[#FCEFEB] dark:text-[#F0A99C] dark:hover:bg-[#512F28]"
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DFD6] bg-white text-[#79563E] transition hover:bg-[#F7F1EB] dark:border-[#66503F] dark:bg-[#30251E] dark:text-[#F0D4B8] dark:hover:bg-[#453326] lg:hidden"
          >
            {mobileLinksOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation links */}
      {mobileLinksOpen && (
        <div className="border-t border-[#E8DFD6] bg-[#FFFCFA] px-5 py-4 dark:border-[#5B4637] dark:bg-[#211914] lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col gap-1">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-[#F7F1EB] text-[#79563E] dark:bg-[#453326] dark:text-[#F0CBA6]"
                    : "text-[#766E65] hover:bg-[#F7F1EB] hover:text-[#79563E] dark:text-[#E0C8B2] dark:hover:bg-[#453326] dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex items-center justify-between border-t border-[#E8DFD6] pt-3 dark:border-[#66503F]">
              <span className="text-xs font-medium text-[#82776D] dark:text-[#E0C8B2]">
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
