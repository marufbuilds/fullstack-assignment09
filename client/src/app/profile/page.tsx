 
"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import {
  CalendarDays,
  ListChecks,
  LogOut,
  Save,
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
  Mail,
  Clock,
  PackagePlus,
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

import {
  ErrorState,
  Notice,
  PageHeader,
  Spinner,
} from "@/components/ui";

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
    role ?? profile?.role ?? user?.role ?? "customer"
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

    if (trimmedName === profile?.name) {
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
        current
          ? { ...current, name: trimmedName }
          : current
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

  function Avatar({ size = 76 }: { size?: number }) {
    return (
      <div
        className="avatar"
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          fontSize: size > 50 ? 22 : 16,
        }}
      >
        {profileImage && !imageFailed ? (
          <img
            src={profileImage}
            alt="Profile"
            onError={() => setImageFailed(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          initials(displayName)
        )}
      </div>
    );
  }

  return (
    <div className="wrap section" style={{ maxWidth: 1000 }}>
      <PageHeader
        eyebrow="Account settings"
        title="My profile"
        description="Manage your personal information and account access."
        actions={
          <span
            className="badge badge-brand"
            style={{ textTransform: "capitalize" }}
          >
            <UserRound size={14} />
            {currentRole} account
          </span>
        }
      />

      {error && (
        <div style={{ marginBottom: 20 }}>
          <ErrorState
            message={error}
            onRetry={() => void load()}
          />
        </div>
      )}

      {success && (
        <div style={{ marginBottom: 20 }}>
          <Notice kind="success">{success}</Notice>
        </div>
      )}

      {loading && (
        <div className="stack">
          <div className="skeleton" style={{ height: 120 }} />
          <div className="skeleton" style={{ height: 260 }} />
        </div>
      )}

      {!loading && !error && (
        <div className="grid2" style={{ alignItems: "start" }}>
          {/* Profile information */}
          <form
            className="card card-pad profileform"
            onSubmit={handleSubmit}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                flexWrap: "wrap",
              }}
            >
              <Avatar />

              <div style={{ flex: 1, minWidth: 180 }}>
                <h2 className="h3">{displayName}</h2>

                <p className="muted" style={{ margin: "5px 0" }}>
                  {email}
                </p>

                <span
                  className="badge badge-brand"
                  style={{
                    marginTop: 6,
                    textTransform: "capitalize",
                  }}
                >
                  {currentRole}
                </span>
              </div>
            </div>

            <hr className="divider" />

            <label>
              Full name

              <input
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
              />
            </label>

            <label>
              Email address

              <input
                value={email}
                disabled
                readOnly
                type="email"
              />
            </label>

            <label>
              Member since

              <input
                value={formatDate(
                  profile?.createdAt || user?.createdAt
                )}
                disabled
                readOnly
              />
            </label>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn"
                type="submit"
                disabled={saving || name.trim().length < 2}
              >
                {saving ? (
                  <>
                    <Spinner />
                    Saving…
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
                className="btn btn-outline"
                onClick={() => void handleSignOut()}
                disabled={signingOut}
              >
                {signingOut ? (
                  <Spinner />
                ) : (
                  <LogOut size={17} />
                )}

                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </form>

          {/* Account access */}
          <div className="stack">
            <div className="card card-pad">
              <div className="eyebrow">Account access</div>

              <h2
                className="h3"
                style={{ marginTop: 8, marginBottom: 14 }}
              >
                Your permissions
              </h2>

              <div className="spec-row">
                <span>Rent equipment</span>
                <strong>Allowed</strong>
              </div>

              <div className="spec-row">
                <span>Save favorites</span>
                <strong>Allowed</strong>
              </div>

              <div className="spec-row">
                <span>List equipment</span>
                <strong>
                  {isOwner ? "Allowed" : isAdmin ? "Admin access" : "Owner role needed"}
                </strong>
              </div>

              <div className="spec-row">
                <span>Owner workspace</span>
                <strong>{isOwner ? "Allowed" : "Not available"}</strong>
              </div>

              <div className="spec-row">
                <span>Admin panel</span>
                <strong>{isAdmin ? "Allowed" : "Not available"}</strong>
              </div>

              {!isOwner && !isAdmin && (
                <div
                  className="notice notice-info"
                  style={{ marginTop: 16 }}
                >
                  <strong>Become an equipment owner</strong>

                  <p style={{ margin: "6px 0 0" }}>
                    Ask an administrator to change your role to
                    owner to list equipment and manage rental requests.
                  </p>
                </div>
              )}

              {isOwner && (
                <div className="notice" style={{ marginTop: 16 }}>
                  <strong>Owner account active</strong>

                  <p style={{ margin: "6px 0 0" }}>
                    You can list equipment and manage your rental business.
                  </p>
                </div>
              )}

              {isAdmin && (
                <div className="notice" style={{ marginTop: 16 }}>
                  <strong>Administrator account active</strong>

                  <p style={{ margin: "6px 0 0" }}>
                    You have access to platform administration and management.
                  </p>
                </div>
              )}
            </div>

            {/* Quick access */}
            <div className="card card-pad">
              <div className="eyebrow">Quick access</div>

              <div
                style={{
                  display: "grid",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <Link
                  className="btn btn-outline btn-block"
                  href="/my-rentals"
                >
                  <CalendarDays size={16} />
                  My rentals
                </Link>

                {isOwner && (
                  <>
                    <Link
                      className="btn btn-outline btn-block"
                      href="/owner"
                    >
                      <BriefcaseBusiness size={16} />
                      Owner workspace
                    </Link>

                    <Link
                      className="btn btn-outline btn-block"
                      href="/owner/listings"
                    >
                      <ListChecks size={16} />
                      My listings
                    </Link>

                    <Link
                      className="btn btn-outline btn-block"
                      href="/add-equipment"
                    >
                      <PackagePlus size={16} />
                      Add equipment
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    className="btn btn-block"
                    href="/admin"
                  >
                    <ShieldCheck size={16} />
                    Admin panel
                  </Link>
                )}

                <Link
                  className="btn btn-outline btn-block"
                  href="/dashboard"
                >
                  <UserRound size={16} />
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
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
