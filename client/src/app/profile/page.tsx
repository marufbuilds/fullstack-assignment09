"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import {
  CalendarDays,
  Check,
  ChevronRight,
  ListChecks,
  LogOut,
  Save,
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
  PackagePlus,
  LockKeyhole,
  CircleUserRound,
} from "lucide-react";

import { errorMessage, fetchProfile, updateProfile } from "@/lib/api";

import { useAuth } from "@/lib/auth";
import { formatDate, initials } from "@/lib/format";
import { useToast } from "@/lib/toast";

import type { AuthUser } from "@/lib/types";

import { AuthGuard } from "@/components/AuthGuard";
import { Spinner } from "@/components/ui";

function ProfileContent() {
  const { user, role, refresh, signOut } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [name, setName] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [imageFailed, setImageFailed] = useState(false);

  const profileImage = profile?.image || user?.image;

  const currentRole = String(user?.role || profile?.role || role || "customer")
    .trim()
    .toLowerCase();

  const isAdmin = currentRole === "admin";
  const isOwner = currentRole === "owner";

  const displayName = profile?.name || user?.name || "Equiply member";

  const email = profile?.email || user?.email || "";

  useEffect(() => {
    setImageFailed(false);
  }, [profileImage]);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchProfile();

      setProfile(data);
      setName(data.name || "");
    } catch (caught) {
      const message = errorMessage(caught);

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 80) {
      showToast("Name must contain between 2 and 80 characters.", "error");
      return;
    }

    if (trimmedName === (profile?.name || user?.name || "")) {
      showToast("Your profile is already up to date.", "info");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await updateProfile(trimmedName);

      setProfile((current) => (current ? { ...current, name: trimmedName } : current));

      setName(trimmedName);

      showToast("Your profile was updated successfully.", "success");

      void refresh().catch((caught) => {
        console.error("Profile refresh failed:", caught);
      });
    } catch (caught) {
      showToast(errorMessage(caught), "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await signOut();
    } catch (caught) {
      showToast(errorMessage(caught), "error");
      setSigningOut(false);
    }
  }

  function Avatar({ size = 88 }: { size?: number }) {
    return (
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-accent font-semibold text-primary shadow-sm"
        style={{
          width: size,
          height: size,
          fontSize: size > 50 ? 25 : 16,
        }}
      >
        {profileImage && !imageFailed ? (
          <img
            src={profileImage}
            alt="Profile"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          initials(displayName)
        )}
      </div>
    );
  }

  const quickLinks = [
    {
      label: "My rentals",
      description: "View your rental bookings",
      href: "/my-rentals",
      icon: CalendarDays,
      visible: true,
    },
    {
      label: "Owner workspace",
      description: "Manage your rental business",
      href: "/owner",
      icon: BriefcaseBusiness,
      visible: isOwner || isAdmin,
    },
    {
      label: "My listings",
      description: "Manage your equipment listings",
      href: "/owner/listings",
      icon: ListChecks,
      visible: isOwner || isAdmin,
    },
    {
      label: "Add equipment",
      description: "List new equipment for rent",
      href: "/add-equipment",
      icon: PackagePlus,
      visible: isOwner || isAdmin,
    },
    {
      label: "Admin panel",
      description: "Manage the Equiply platform",
      href: "/admin",
      icon: ShieldCheck,
      visible: isAdmin,
    },
    {
      label: "Dashboard",
      description: "View your account overview",
      href: "/dashboard",
      icon: UserRound,
      visible: true,
    },
  ];

  const permissions = [
    { label: "Rent equipment", allowed: true },
    { label: "Save favorites", allowed: true },
    { label: "List equipment", allowed: isOwner || isAdmin },
    { label: "Owner workspace", allowed: isOwner || isAdmin },
    { label: "Admin panel", allowed: isAdmin },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-[1120px]">
        {/* Page heading */}
        <div className="mb-9 flex flex-col justify-between gap-5 border-b border-border pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Account settings
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              My profile
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage your personal information, account permissions, and Equiply
              experience.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium capitalize text-primary">
            <ShieldCheck size={16} />
            {currentRole} account
          </div>
        </div>

        {/* Profile loading error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <p className="font-medium">{error}</p>

            <button
              type="button"
              onClick={() => void load()}
              className="mt-2 font-semibold underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
            <div className="h-[460px] animate-pulse rounded-2xl border border-border bg-card" />

            <div className="space-y-6">
              <div className="h-[260px] animate-pulse rounded-2xl border border-border bg-card" />
              <div className="h-[240px] animate-pulse rounded-2xl border border-border bg-card" />
            </div>
          </div>
        )}

        {!loading && (
          <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_0.8fr]">
            {/* Profile information */}
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_4px_24px_rgba(60,40,20,0.035)]">
              <div className="border-b border-border px-6 py-5 sm:px-8">
                <h2 className="text-lg font-semibold text-foreground">
                  Personal information
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update your profile details and personal information.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                {/* Profile identity */}
                <div className="mb-8 flex flex-wrap items-center gap-5">
                  <Avatar />

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-xl font-semibold text-foreground">
                      {displayName}
                    </h3>

                    <p className="mt-1 break-all text-sm text-muted-foreground">
                      {email}
                    </p>

                    <span className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold capitalize text-primary">
                      {currentRole}
                    </span>
                  </div>
                </div>

                <div className="mb-7 h-px bg-border" />

                {/* Form fields */}
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Full name
                    </label>

                    <input
                      id="profile-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      minLength={2}
                      maxLength={80}
                      required
                      autoComplete="name"
                      placeholder="Enter your full name"
                      className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-email"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Email address
                    </label>

                    <input
                      id="profile-email"
                      value={email}
                      disabled
                      readOnly
                      type="email"
                      className="h-12 w-full cursor-not-allowed rounded-xl border border-border bg-secondary px-4 text-sm text-muted-foreground outline-none"
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                      Your email address cannot be changed here.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="profile-date"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Member since
                    </label>

                    <input
                      id="profile-date"
                      value={formatDate(profile?.createdAt || user?.createdAt)}
                      disabled
                      readOnly
                      className="h-12 w-full cursor-not-allowed rounded-xl border border-border bg-secondary px-4 text-sm text-muted-foreground outline-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving || name.trim().length < 2}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Spinner />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Save changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleSignOut()}
                    disabled={signingOut}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-semibold text-primary transition hover:border-primary hover:bg-secondary disabled:opacity-60"
                  >
                    {signingOut ? <Spinner /> : <LogOut size={17} />}

                    {signingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </form>
            </section>

            {/* Right column */}
            <div className="space-y-6">
              {/* Account permissions */}
              <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_4px_24px_rgba(60,40,20,0.035)] sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <LockKeyhole size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-foreground">Account permissions</h2>

                    <p className="text-xs text-muted-foreground">Your account access</p>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {permissions.map((permission) => (
                    <div
                      key={permission.label}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <span className="text-sm text-foreground">{permission.label}</span>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold ${
                          permission.allowed ? "text-[#66805D]" : "text-muted-foreground"
                        }`}
                      >
                        {permission.allowed ? (
                          <Check size={14} />
                        ) : (
                          <LockKeyhole size={13} />
                        )}

                        {permission.allowed ? "Allowed" : "Restricted"}
                      </span>
                    </div>
                  ))}
                </div>

                {!isOwner && !isAdmin && (
                  <div className="mt-5 rounded-xl border border-border bg-secondary p-4">
                    <h3 className="text-sm font-semibold text-primary">
                      Become an equipment owner
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Ask an administrator to change your role to owner to list equipment
                      and manage rental requests.
                    </p>
                  </div>
                )}

                {isOwner && (
                  <div className="mt-5 rounded-xl border border-border bg-secondary p-4">
                    <h3 className="text-sm font-semibold text-primary">
                      Owner account active
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      You can list equipment and manage your rental business.
                    </p>
                  </div>
                )}

                {isAdmin && (
                  <div className="mt-5 rounded-xl border border-border bg-secondary p-4">
                    <h3 className="text-sm font-semibold text-primary">
                      Administrator account active
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      You have access to platform administration and management.
                    </p>
                  </div>
                )}
              </section>

              {/* Quick access */}
              <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_4px_24px_rgba(60,40,20,0.035)] sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <CircleUserRound size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-foreground">Quick access</h2>

                    <p className="text-xs text-muted-foreground">
                      Manage your Equiply activities
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {quickLinks
                    .filter((item) => item.visible)
                    .map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-border hover:bg-background"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                            <Icon size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground">
                              {item.label}
                            </p>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>

                          <ChevronRight
                            size={17}
                            className="shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary"
                          />
                        </Link>
                      );
                    })}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
