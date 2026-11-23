 
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Heart,
  ListChecks,
  PackagePlus,
  Wallet,
  BriefcaseBusiness,
} from "lucide-react";

import { errorMessage, fetchMyBookings, fetchMyListings } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useFavorites } from "@/lib/favorites";
import { formatDateRange, money } from "@/lib/format";
import type { Booking, Equipment } from "@/lib/types";
import { AuthGuard } from "@/components/AuthGuard";
import {
  EmptyState,
  ErrorState,
  PageHeader,
  StatusBadge,
} from "@/components/ui";

function DashboardContent() {
  const { user, role } = useAuth();
  const { ids } = useFavorites();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check both possible role sources.
  const userRole = String(
    role ?? (user as { role?: string } | null)?.role ?? ""
  )
    .trim()
    .toLowerCase();

  const isOwner = userRole === "owner" || userRole === "admin";

  async function load() {
    setLoading(true);
    setError("");

    try {
      const myBookings = await fetchMyBookings();
      setBookings(myBookings);

      if (isOwner) {
        const myListings = await fetchMyListings();
        setListings(myListings);
      } else {
        setListings([]);
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner]);

  const active = bookings.filter(
    (booking) =>
      booking.status === "pending" ||
      booking.status === "confirmed"
  );

  const completed = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const spent = bookings
    .filter((booking) => booking.status !== "rejected")
    .reduce(
      (sum, booking) => sum + Number(booking.amount || 0),
      0
    );

  const stats = [
    {
      label: "Active rentals",
      value: loading ? "…" : active.length,
      hint: "Pending or confirmed",
      icon: <CalendarDays size={19} />,
    },
    {
      label: "Saved equipment",
      value: loading ? "…" : ids.length,
      hint: "In your favorites",
      icon: <Heart size={19} />,
    },
    {
      label: "Completed rentals",
      value: loading ? "…" : completed.length,
      hint: "All time",
      icon: <ListChecks size={19} />,
    },
    isOwner
      ? {
          label: "My listings",
          value: loading ? "…" : listings.length,
          hint: "Equipment you own",
          icon: <PackagePlus size={19} />,
        }
      : {
          label: "Total spent",
          value: loading ? "…" : money(spent),
          hint: "Across all bookings",
          icon: <Wallet size={19} />,
        },
  ];

  const quickLinks = [
    {
      title: "Browse equipment",
      description: "Search the marketplace for your next tool.",
      href: "/equipment",
      icon: PackagePlus,
    },
    {
      title: "My rentals",
      description: "Track requests, payments and active rentals.",
      href: "/my-rentals",
      icon: CalendarDays,
    },
    {
      title: "Favorites",
      description: "Equipment you saved for later.",
      href: "/favorites",
      icon: Heart,
    },
    {
      title: "List equipment",
      description: "Share your gear and start earning.",
      href: "/add-equipment",
      icon: ListChecks,
    },
  ];

  return (
    <div className="wrap section">
      <PageHeader
        eyebrow="Workspace"
        title={`Welcome back, ${(user?.name || "there").split(" ")[0]}`}
        description={
          isOwner
            ? "Manage your equipment, rental requests and business activity."
            : "Here is everything happening with your rentals, saved equipment and listings."
        }
        actions={
          <>
            {isOwner && (
              <Link className="btn" href="/owner">
                <BriefcaseBusiness size={16} />
                Owner workspace
              </Link>
            )}

            <Link
              className="btn"
              href="/equipment"
            >
              Find equipment
            </Link>

            <Link
              className="btn btn-outline"
              href="/profile"
            >
              Edit profile
            </Link>
          </>
        }
      />

      {error && (
        <div style={{ marginBottom: 22 }}>
          <ErrorState
            message={error}
            onRetry={() => void load()}
          />
        </div>
      )}

      {!error && (
        <>
          <div className="grid4">
            {stats.map((stat) => (
              <div className="card stat" key={stat.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <p>{stat.label}</p>
                  <span className="stat-icon">
                    {stat.icon}
                  </span>
                </div>

                <h2>{stat.value}</h2>
                <small className="muted">{stat.hint}</small>
              </div>
            ))}
          </div>

          <div
            className="grid2"
            style={{ marginTop: 30, alignItems: "start" }}
          >
            <div className="card card-pad">
              <div
                className="section-head"
                style={{ marginBottom: 14 }}
              >
                <div>
                  <div className="eyebrow">
                    Recent activity
                  </div>

                  <h2
                    className="h3"
                    style={{ marginTop: 8 }}
                  >
                    Your latest bookings
                  </h2>
                </div>

                <Link
                  href="/my-rentals"
                  className="btn btn-ghost btn-sm"
                >
                  View all <ArrowUpRight size={15} />
                </Link>
              </div>

              {loading && (
                <div style={{ display: "grid", gap: 12 }}>
                  {[0, 1, 2].map((row) => (
                    <div
                      className="skeleton"
                      key={row}
                      style={{ height: 56 }}
                    />
                  ))}
                </div>
              )}

              {!loading && bookings.length === 0 && (
                <EmptyState
                  icon={<CalendarDays size={28} />}
                  title="No bookings yet"
                  description="When you request a rental it will show up here with its live status."
                  action={
                    <Link
                      className="btn"
                      href="/equipment"
                    >
                      Explore equipment
                    </Link>
                  }
                />
              )}

              {!loading &&
                bookings.slice(0, 5).map((booking) => (
                  <div
                    className="rentrow"
                    key={booking._id}
                    style={{
                      gridTemplateColumns: "1.4fr 1fr auto",
                    }}
                  >
                    <div>
                      <strong>
                        {booking.equipmentTitle || "Equipment"}
                      </strong>

                      <small
                        className="muted"
                        style={{
                          display: "block",
                          fontSize: 13,
                        }}
                      >
                        {formatDateRange(
                          booking.startDate,
                          booking.endDate
                        )}
                      </small>
                    </div>

                    <strong>{money(booking.amount)}</strong>

                    <StatusBadge status={booking.status} />
                  </div>
                ))}
            </div>

            <div className="stack">
              <div className="card card-pad">
                <div className="eyebrow">
                  Quick actions
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 10,
                    marginTop: 14,
                  }}
                >
                  {quickLinks.map(
                    ({ title, description, href, icon: Icon }) => (
                      <Link
                        key={title}
                        href={href}
                        style={{
                          display: "flex",
                          gap: 14,
                          alignItems: "center",
                          padding: "12px 14px",
                          border: "1px solid var(--line)",
                          borderRadius: 14,
                          transition:
                            "border-color .16s ease, background .16s ease",
                        }}
                      >
                        <span className="stat-icon">
                          <Icon size={18} />
                        </span>

                        <span style={{ minWidth: 0 }}>
                          <strong
                            style={{
                              display: "block",
                              fontSize: 14.5,
                            }}
                          >
                            {title}
                          </strong>

                          <span
                            className="muted"
                            style={{ fontSize: 13 }}
                          >
                            {description}
                          </span>
                        </span>

                        <ArrowUpRight
                          size={16}
                          style={{
                            marginLeft: "auto",
                            color: "var(--muted)",
                          }}
                        />
                      </Link>
                    )
                  )}
                </div>
              </div>

              {isOwner ? (
                <div className="notice">
                  <strong
                    style={{
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Owner tools are active
                  </strong>

                  Manage incoming rental requests and your
                  equipment from your{" "}

                  <Link
                    href="/owner"
                    style={{ fontWeight: 700 }}
                  >
                    owner workspace
                  </Link>
                  .

                  <div style={{ marginTop: 12 }}>
                    <Link
                      href="/owner"
                      className="btn"
                    >
                      Manage bookings and listings
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="notice notice-info">
                  <strong
                    style={{
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Want to earn from your gear?
                  </strong>

                  Ask an administrator to enable owner tools
                  for your account, then list your first item.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
