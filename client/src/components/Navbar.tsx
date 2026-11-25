 
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
      <button type="button" className="theme-toggle" aria-label="Toggle theme">
        <Sun size={18} />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function Navbar({ onToggleMenu }: { onToggleMenu: () => void }) {
  const pathname = usePathname();
  const { user, status, role, signOut } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
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

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button
          className="mobile-toggle"
          onClick={onToggleMenu}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <Link href="/" className="brand">
          <span className="brand-mark">E</span>
          <span>Equiply</span>
        </Link>

        <nav className="topnav">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname.startsWith(link.href) ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="topbar-actions">
          <ThemeToggle />

          {status === "loading" && (
            <span
              className="skeleton"
              style={{ width: 132, height: 38, borderRadius: 999 }}
            />
          )}

          {status === "unauthenticated" && (
            <>
              <Link href="/login" className="btn btn-ghost hide-sm">
                Login
              </Link>

              <Link href="/register" className="btn btn-sm">
                Sign Up
              </Link>
            </>
          )}

          {status === "authenticated" && user && (
            <div className="user-menu" ref={menuRef}>
              <button
                className="user-button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <span
                  className="avatar avatar-sm"
                  style={{
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {profileImage && !imageFailed ? (
                    <img
                      src={profileImage}
                      alt={`${user.name}'s profile`}
                      onError={() => setImageFailed(true)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    initials(user.name)
                  )}
                </span>

                <span className="hide-sm">{user.name.split(" ")[0]}</span>
                <ChevronDown size={16} />
              </button>

              {menuOpen && (
                <div className="user-popover">
                  <div
                    style={{
                      padding: "14px 12px",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        className="avatar"
                        style={{
                          width: 48,
                          height: 48,
                          flexShrink: 0,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {profileImage && !imageFailed ? (
                          <img
                            src={profileImage}
                            alt={`${user.name}'s profile`}
                            onError={() => setImageFailed(true)}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          initials(user.name)
                        )}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <strong
                          style={{ display: "block", fontSize: 14.5 }}
                        >
                          {user.name}
                        </strong>

                        <span
                          className="muted"
                          style={{
                            fontSize: 12.5,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <span
                      className="badge badge-brand"
                      style={{ textTransform: "capitalize" }}
                    >
                      {normalizedRole || "member"}
                    </span>
                  </div>

                  <Link href="/dashboard">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>

                  <Link href="/my-rentals">
                    <Wallet size={16} />
                    My rentals
                  </Link>

                  <Link href="/favorites">
                    <Heart size={16} />
                    Favorites
                  </Link>

                  <Link href="/profile">
                    <UserRound size={16} />
                    Profile settings
                  </Link>

                  {isOwner && (
                    <>
                      <Link href="/add-equipment">
                        <PackagePlus size={16} />
                        Add equipment
                      </Link>

                      <Link href="/owner/listings">
                        <ListChecks size={16} />
                        My listings
                      </Link>

                      <Link href="/owner">
                        <LayoutDashboard size={16} />
                        Owner workspace
                      </Link>
                    </>
                  )}

                  {isAdmin && (
                    <Link href="/admin">
                      <ShieldCheck size={16} />
                      Admin panel
                    </Link>
                  )}

                  <button
                    className="danger"
                    onClick={async () => {
                      setMenuOpen(false);
                      await signOut();
                    }}
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
