 
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
  Mail,
  Calendar,
  LockKeyhole,
  CircleUserRound,
} from "lucide-react";

import {
  errorMessage,
  fetchProfile,
  updateProfile,
} from "@/lib/api";

import { useAuth } from "@/lib/auth";
import { formatDate, initials } from "@/lib/format";

import type { AuthUser } from "@/lib/types";

import { AuthGuard } from "@/components/AuthGuard";
import { Spinner } from "@/components/ui";

function ProfileContent() {
  const { user, role, refresh, signOut } = useAuth();

  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [imageFailed, setImageFailed] = useState(false);

  const profileImage = profile?.image || user?.image;

  const currentRole = String(
    user?.role || profile?.role || role || "customer"
  )
    .trim()
    .toLowerCase();

  const isAdmin = currentRole === "admin";
  const isOwner = currentRole === "owner";

  const displayName =
    profile?.name || user?.name || "Equiply member";

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
      setError(errorMessage(caught));
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
      setError("Name must contain between 2 and 80 characters.");
      return;
    }

    if (trimmedName === (profile?.name || user?.name || "")) {
      setSuccess("Your profile is already up to date.");
      setError("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile(trimmedName);

      setProfile((current) =>
        current ? { ...current, name: trimmedName } : current
      );

      setName(trimmedName);

      await refresh();

      setSuccess("Your profile was updated successfully.");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await signOut();
    } catch (caught) {
      setError(errorMessage(caught));
      setSigningOut(false);
    }
  }

  function Avatar({ size = 88 }: { size?: number }) {
    return (
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#EDE3D9] font-semibold text-[#79563E] shadow-sm"
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
    <div className="min-h-screen bg-[#FFFCFA] px-4 py-8 text-[#292723] sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-[1120px]">

        {/* Page heading */}
        <div className="mb-9 flex flex-col justify-between gap-5 border-b border-[#E8DFD6] pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A7656]">
              Account settings
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-[#292723] sm:text-4xl">
              My profile
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#82776D] sm:text-base">
              Manage your personal information, account permissions,
              and Equiply experience.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E8DFD6] bg-white px-4 py-2 text-sm font-medium capitalize text-[#79563E]">
            <ShieldCheck size={16} />
            {currentRole} account
          </div>
        </div>

        {/* Error and success messages */}
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

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
            <Check size={18} />
            {success}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
            <div className="h-[460px] animate-pulse rounded-2xl border border-[#E8DFD6] bg-white" />
            <div className="space-y-6">
              <div className="h-[260px] animate-pulse rounded-2xl border border-[#E8DFD6] bg-white" />
              <div className="h-[240px] animate-pulse rounded-2xl border border-[#E8DFD6] bg-white" />
            </div>
          </div>
        )}

        {!loading && (
          <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_0.8fr]">

            {/* Profile information */}
            <section className="overflow-hidden rounded-2xl border border-[#E8DFD6] bg-white shadow-[0_4px_24px_rgba(60,40,20,0.035)]">

              <div className="border-b border-[#E8DFD6] px-6 py-5 sm:px-8">
                <h2 className="text-lg font-semibold text-[#292723]">
                  Personal information
                </h2>

                <p className="mt-1 text-sm text-[#82776D]">
                  Update your profile details and personal information.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8">

                {/* Profile identity */}
                <div className="mb-8 flex flex-wrap items-center gap-5">
                  <Avatar />

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-xl font-semibold text-[#292723]">
                      {displayName}
                    </h3>

                    <p className="mt-1 break-all text-sm text-[#82776D]">
                      {email}
                    </p>

                    <span className="mt-3 inline-flex rounded-full bg-[#F5EEE8] px-3 py-1 text-xs font-semibold capitalize text-[#79563E]">
                      {currentRole}
                    </span>
                  </div>
                </div>

                <div className="mb-7 h-px bg-[#E8DFD6]" />

                {/* Form fields */}
                <div className="space-y-5">

                  <div>
                    <label
                      htmlFor="profile-name"
                      className="mb-2 block text-sm font-medium text-[#443B34]"
                    >
                      Full name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8D80]"
                      />

                      <input
                        id="profile-name"
                        value={name}
                        onChange={(event) => {
                          setName(event.target.value);
                          setSuccess("");
                        }}
                        minLength={2}
                        maxLength={80}
                        required
                        autoComplete="name"
                        placeholder="Enter your full name"
                        className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] pl-11 pr-4 text-sm text-[#292723] outline-none transition placeholder:text-[#A99D92] focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="profile-email"
                      className="mb-2 block text-sm font-medium text-[#443B34]"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8D80]"
                      />

                      <input
                        id="profile-email"
                        value={email}
                        disabled
                        readOnly
                        type="email"
                        className="h-12 w-full cursor-not-allowed rounded-xl border border-[#E8DFD6] bg-[#F8F5F1] pl-11 pr-4 text-sm text-[#82776D] outline-none"
                      />
                    </div>

                    <p className="mt-2 text-xs text-[#9A8D80]">
                      Your email address cannot be changed here.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="profile-date"
                      className="mb-2 block text-sm font-medium text-[#443B34]"
                    >
                      Member since
                    </label>

                    <div className="relative">
                      <Calendar
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8D80]"
                      />

                      <input
                        id="profile-date"
                        value={formatDate(
                          profile?.createdAt || user?.createdAt
                        )}
                        disabled
                        readOnly
                        className="h-12 w-full cursor-not-allowed rounded-xl border border-[#E8DFD6] bg-[#F8F5F1] pl-11 pr-4 text-sm text-[#82776D] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3 border-t border-[#E8DFD6] pt-6 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving || name.trim().length < 2}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#79563E] px-6 text-sm font-semibold text-white transition hover:bg-[#62432F] disabled:cursor-not-allowed disabled:opacity-60"
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
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#E8DFD6] bg-white px-6 text-sm font-semibold text-[#79563E] transition hover:border-[#79563E] hover:bg-[#F8F3EE] disabled:opacity-60"
                  >
                    {signingOut ? (
                      <Spinner />
                    ) : (
                      <LogOut size={17} />
                    )}

                    {signingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </form>
            </section>

            {/* Right column */}
            <div className="space-y-6">

              {/* Account permissions */}
              <section className="rounded-2xl border border-[#E8DFD6] bg-white p-6 shadow-[0_4px_24px_rgba(60,40,20,0.035)] sm:p-7">

                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EEE8] text-[#79563E]">
                    <LockKeyhole size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#292723]">
                      Account permissions
                    </h2>

                    <p className="text-xs text-[#82776D]">
                      Your account access
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-[#EEE7E0]">
                  {permissions.map((permission) => (
                    <div
                      key={permission.label}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <span className="text-sm text-[#62584F]">
                        {permission.label}
                      </span>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold ${
                          permission.allowed
                            ? "text-[#66805D]"
                            : "text-[#9A8D80]"
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
                  <div className="mt-5 rounded-xl border border-[#E8DFD6] bg-[#F8F3EE] p-4">
                    <h3 className="text-sm font-semibold text-[#79563E]">
                      Become an equipment owner
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-[#82776D]">
                      Ask an administrator to change your role to owner
                      to list equipment and manage rental requests.
                    </p>
                  </div>
                )}

                {isOwner && (
                  <div className="mt-5 rounded-xl border border-[#E8DFD6] bg-[#F8F3EE] p-4">
                    <h3 className="text-sm font-semibold text-[#79563E]">
                      Owner account active
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-[#82776D]">
                      You can list equipment and manage your rental business.
                    </p>
                  </div>
                )}

                {isAdmin && (
                  <div className="mt-5 rounded-xl border border-[#E8DFD6] bg-[#F8F3EE] p-4">
                    <h3 className="text-sm font-semibold text-[#79563E]">
                      Administrator account active
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-[#82776D]">
                      You have access to platform administration and management.
                    </p>
                  </div>
                )}
              </section>

              {/* Quick access */}
              <section className="rounded-2xl border border-[#E8DFD6] bg-white p-6 shadow-[0_4px_24px_rgba(60,40,20,0.035)] sm:p-7">

                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EEE8] text-[#79563E]">
                    <CircleUserRound size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#292723]">
                      Quick access
                    </h2>

                    <p className="text-xs text-[#82776D]">
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
                          className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-[#E8DFD6] hover:bg-[#FFFCFA]"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5EEE8] text-[#79563E] transition group-hover:bg-[#79563E] group-hover:text-white">
                            <Icon size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#443B34]">
                              {item.label}
                            </p>

                            <p className="mt-0.5 text-xs text-[#96897D]">
                              {item.description}
                            </p>
                          </div>

                          <ChevronRight
                            size={17}
                            className="shrink-0 text-[#B5A89B] transition group-hover:translate-x-1 group-hover:text-[#79563E]"
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
