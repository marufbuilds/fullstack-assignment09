 
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ListChecks,
  LogOut,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { errorMessage, fetchProfile, updateProfile } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate, initials } from "@/lib/format";
import type { AuthUser } from "@/lib/types";
import { AuthGuard } from "@/components/AuthGuard";
import { ErrorState, Notice, PageHeader, Spinner } from "@/components/ui";

function ProfileContent() {
  const { user, role, refresh, signOut } = useAuth();

  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const profileImage = profile?.image || user?.image;

  useEffect(() => {
    setImageFailed(false);
  }, [profileImage]);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchProfile();
      setProfile(data);
      setName(data.name);
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaved(false);
    setSaving(true);

    try {
      await updateProfile(name.trim());
      setSaved(true);
      await refresh();
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  const displayName = profile?.name || user?.name || "Equiply member";
  const email = profile?.email || user?.email || "";
  const currentRole = role || profile?.role || "customer";

  const isOwner = currentRole === "owner" || currentRole === "admin";
  const isAdmin = currentRole === "admin";

  function Avatar({ size = 64 }: { size?: number }) {
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
        description="Manage your personal details and account."
      />

      {error && (
        <div style={{ marginBottom: 20 }}>
          <ErrorState message={error} onRetry={() => void load()} />
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
          <form className="card card-pad profileform" onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                flexWrap: "wrap",
              }}
            >
              <Avatar size={76} />

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
                  setSaved(false);
                }}
                minLength={2}
                maxLength={80}
                required
                autoComplete="name"
              />
            </label>

            <label>
              Email address
              <input value={email} disabled readOnly type="email" />
            </label>

            <label>
              Member since
              <input
                value={formatDate(profile?.createdAt || user?.createdAt)}
                disabled
                readOnly
              />
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn" type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner /> Saving…
                  </>
                ) : (
                  <>
                    <Save size={17} /> Save changes
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => void signOut()}
              >
                <LogOut size={17} /> Sign out
              </button>
            </div>

            {saved && (
              <Notice kind="success">
                Your profile was updated successfully.
              </Notice>
            )}
          </form>

          <div className="stack">
            <div className="card card-pad">
              <div className="eyebrow">Account access</div>

              <h2 className="h3" style={{ marginTop: 8, marginBottom: 14 }}>
                What you can do
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
                <strong>{isOwner ? "Allowed" : "Owner role needed"}</strong>
              </div>

              <div className="spec-row">
                <span>Admin panel</span>
                <strong>{isAdmin ? "Allowed" : "Admin role needed"}</strong>
              </div>

              {!isOwner && (
                <div className="notice notice-info" style={{ marginTop: 16 }}>
                  Ask an administrator to switch your role to <b>owner</b> so
                  you can list equipment and earn.
                </div>
              )}
            </div>

            <div className="card card-pad">
              <div className="eyebrow">Quick access</div>

              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                <Link className="btn btn-outline btn-block" href="/my-rentals">
                  <CalendarDays size={16} /> My rentals
                </Link>

                <Link className="btn btn-outline btn-block" href="/owner/listings">
                  <ListChecks size={16} /> My listings
                </Link>

                <Link className="btn btn-outline btn-block" href="/dashboard">
                  <UserRound size={16} /> Dashboard
                </Link>

                {isAdmin && (
                  <Link className="btn btn-block" href="/admin">
                    <ShieldCheck size={16} /> Admin panel
                  </Link>
                )}
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
