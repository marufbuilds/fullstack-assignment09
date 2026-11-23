 
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowUpRight,
  CalendarDays,
  Heart,
  ListChecks,
  PackagePlus,
  Wallet,
  BriefcaseBusiness,
} from "lucide-react";

import {
  errorMessage,
  fetchMyBookings,
  fetchMyListings,
  fetchOwnerBookings,
} from "@/lib/api";

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
  const { user, role, status } = useAuth();
  const { ids } = useFavorites();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Equipment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Determine the current user's role.
  const userRole = String(user?.role ?? role ?? "")
    .trim()
    .toLowerCase();

  const isOwner = userRole === "owner";
  const isAdmin = userRole === "admin";

  // Redirect administrators to their dashboard.
  useEffect(() => {
    if (status === "authenticated" && isAdmin) {
      router.replace("/admin");
    }
  }, [status, isAdmin, router]);

  // Load dashboard information according to the user's role.
  async function load() {
    setLoading(true);
    setError("");

    try {
      if (isOwner) {
        // Owners see incoming booking requests for their equipment.
        const [ownerBookings, myListings] = await Promise.all([
          fetchOwnerBookings(),
          fetchMyListings(),
        ]);

        setBookings(ownerBookings);
        setListings(myListings);
      } else {
        // Customers see the rentals they requested.
        const myBookings = await fetchMyBookings();

        setBookings(myBookings);
        setListings([]);
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  // Load data after authentication is complete.
  useEffect(() => {
    if (status !== "authenticated" || isAdmin) {
      return;
    }

    void load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isOwner, isAdmin]);

  // Avoid showing the wrong dashboard during authentication.
  if (status === "loading" || status !== "authenticated" || isAdmin) {
    return null;
  }

  // Calculate booking statistics.
  const active = bookings.filter(
    (booking) =>
      booking.status === "pending" ||
      booking.status === "confirmed"
  );

  const completed = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const paidAmount = bookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce(
      (sum, booking) => sum + Number(booking.amount || 0),
      0
    );

  // Dashboard statistics.
  const stats = [
    {
      label: isOwner ? "Incoming requests" : "Active rentals",
      value: loading ? "…" : active.length,
      hint: isOwner
        ? "Pending or confirmed requests"
        : "Pending or confirmed",
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
          value: loading ? "…" : money(paidAmount),
          hint: "Successful payments",
          icon: <Wallet size={19} />,
        },
  ];

  // Dashboard quick links.
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
    ...(isOwner
      ? [
          {
            title: "List equipment",
            description: "Share your gear and start earning.",
            href: "/add-equipment",
            icon: ListChecks,
          },
        ]
      : []),
  ];

  return (
    <div className="wrap section">
      <PageHeader
        eyebrow={isOwner ? "Owner workspace" : "Customer dashboard"}
        title={`Welcome back, ${(user?.name || "there").split(" ")[0]}`}
        description={
          isOwner
            ? "Manage your equipment, incoming customer bookings and business activity."
            : "Track your rental requests, payments and saved equipment."
        }
        actions={
          <>
            {isOwner && (
              <Link className="btn" href="/owner">
                <BriefcaseBusiness size={16} />
                Owner workspace
              </Link>
            )}

            <Link className="btn" href="/equipment">
              Find equipment
            </Link>

            <Link className="btn btn-outline" href="/profile">
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
          {/* Statistics */}
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

          {/* Main dashboard content */}
          <div
            className="grid2"
            style={{ marginTop: 30, alignItems: "start" }}
          >
            {/* Recent bookings */}
            <div className="card card-pad">
              <div
                className="section-head"
                style={{ marginBottom: 14 }}
              >
                <div>
                  <div className="eyebrow">
                    {isOwner ? "Customer activity" : "Recent activity"}
                  </div>

                  <h2 className="h3" style={{ marginTop: 8 }}>
                    {isOwner
                      ? "Incoming rental requests"
                      : "Your latest bookings"}
                  </h2>
                </div>

                <Link
                  href={isOwner ? "/owner" : "/my-rentals"}
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
                  title={
                    isOwner
                      ? "No rental requests yet"
                      : "No bookings yet"
                  }
                  description={
                    isOwner
                      ? "When customers request your equipment, their bookings will appear here."
                      : "When you request a rental, it will show up here with its live status."
                  }
                  action={
                    <Link className="btn" href="/equipment">
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

            {/* Quick actions and role information */}
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

                  Manage incoming rental requests and your equipment
                  from your owner workspace.

                  <div style={{ marginTop: 12 }}>
                    <Link href="/owner" className="btn">
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
