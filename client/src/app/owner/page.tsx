"use client";

// Owner workspace: analytics, incoming rental requests and earnings.

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BadgeDollarSign,
  CalendarCheck,
  Package,
  PackagePlus,
  CheckCircle2,
  XCircle,
  Trophy,
} from "lucide-react";

import {
  errorMessage,
  fetchMyListings,
  fetchOwnerAnalytics,
  fetchOwnerBookings,
  updateBookingStatus,
} from "@/lib/api";
import { formatDateRange, money } from "@/lib/format";
import type { Booking, Equipment, OwnerAnalytics } from "@/lib/types";
import { AuthGuard } from "@/components/AuthGuard";
import {
  EmptyState,
  ErrorState,
  Notice,
  PageHeader,
  Spinner,
  StatusBadge,
} from "@/components/ui";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function OwnerContent() {
  const [analytics, setAnalytics] = useState<OwnerAnalytics | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [actingId, setActingId] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [stats, incoming, mine] = await Promise.all([
        fetchOwnerAnalytics(),
        fetchOwnerBookings(),
        fetchMyListings(),
      ]);
      setAnalytics(stats);
      setBookings(incoming);
      setListings(mine);
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

  async function act(booking: Booking, status: string) {
    setNotice("");
    setActingId(booking._id);
    try {
      await updateBookingStatus(booking._id, status);
      setBookings((current) =>
        current.map((row) =>
          row._id === booking._id ? { ...row, status: status as Booking["status"] } : row,
        ),
      );
      setNotice(`Booking ${status} successfully.`);
    } catch (caught) {
      setNotice(errorMessage(caught));
    } finally {
      setActingId("");
    }
  }

  const pending = bookings.filter((booking) => booking.status === "pending");
  const recent = bookings.slice(0, 6);
  const monthly = (analytics?.monthlyEarnings || []).slice(-6);
  const bestSeller = [...listings].sort((a, b) => b.price - a.price).slice(0, 4);

  return (
    <div className="wrap section">
      <PageHeader
        eyebrow="Owner workspace"
        title="Manage your equipment"
        description="Approve rental requests, follow your earnings and keep your listings performing."
        actions={
          <>
            <Link className="btn" href="/add-equipment">
              <PackagePlus size={17} /> Add equipment
            </Link>
            <Link className="btn btn-outline" href="/owner/listings">
              My listings
            </Link>
          </>
        }
      />

      {notice && (
        <div style={{ marginBottom: 20 }}>
          <Notice kind={notice.includes("successfully") ? "success" : "error"}>
            {notice}
          </Notice>
        </div>
      )}

      {error && <ErrorState message={error} onRetry={() => void load()} />}

      {!error && loading && (
        <div className="grid4">
          {[0, 1, 2, 3].map((row) => (
            <div className="card" key={row} style={{ padding: 24 }}>
              <div className="skeleton" style={{ height: 16, width: "60%" }} />
              <div
                className="skeleton"
                style={{ height: 32, width: "80%", marginTop: 14 }}
              />
            </div>
          ))}
        </div>
      )}

      {!error && !loading && (
        <>
          <div className="grid4">
            <div className="card stat">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>Total listings</p>
                <span className="stat-icon">
                  <Package size={19} />
                </span>
              </div>
              <h2>{analytics?.listingCount ?? 0}</h2>
              <small className="muted">Equipment you own</small>
            </div>

            <div className="card stat">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>Total earnings</p>
                <span className="stat-icon">
                  <BadgeDollarSign size={19} />
                </span>
              </div>
              <h2>{money(analytics?.totalEarnings || 0)}</h2>
              <small className="muted">From paid bookings</small>
            </div>

            <div className="card stat">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>Paid rentals</p>
                <span className="stat-icon">
                  <CalendarCheck size={19} />
                </span>
              </div>
              <h2>{analytics?.paidRentals ?? 0}</h2>
              <small className="muted">
                {analytics?.completedRentals ?? 0} completed
              </small>
            </div>

            <div className="card stat">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>Requests waiting</p>
                <span className="stat-icon">
                  <Trophy size={19} />
                </span>
              </div>
              <h2>{pending.length}</h2>
              <small className="muted">Need your decision</small>
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 30, alignItems: "start" }}>
            <div className="card card-pad">
              <div className="section-head" style={{ marginBottom: 8 }}>
                <div>
                  <div className="eyebrow">Rental requests</div>
                  <h2 className="h3" style={{ marginTop: 8 }}>
                    Incoming bookings
                  </h2>
                </div>
              </div>

              {recent.length === 0 && (
                <EmptyState
                  icon={<CalendarCheck size={28} />}
                  title="No requests yet"
                  description="Once renters find your listings, their booking requests will appear here."
                  action={
                    <Link className="btn" href="/add-equipment">
                      Add equipment
                    </Link>
                  }
                />
              )}

              {recent.map((booking) => (
                <div
                  key={booking._id}
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid var(--line)",
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>{booking.equipmentTitle || "Equipment"}</strong>
                      <small className="muted" style={{ display: "block", fontSize: 13 }}>
                        {formatDateRange(booking.startDate, booking.endDate)} ·{" "}
                        {booking.days} day{booking.days === 1 ? "" : "s"}
                      </small>
                    </div>
                    <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
                      <strong>{money(booking.amount)}</strong>
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>

                  {booking.status === "pending" && (
                    <div className="adminbuttons">
                      <button
                        className="btn btn-sm"
                        disabled={actingId === booking._id}
                        onClick={() => void act(booking, "confirmed")}
                      >
                        {actingId === booking._id ? (
                          <Spinner />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={actingId === booking._id}
                        onClick={() => void act(booking, "rejected")}
                      >
                        <XCircle size={15} /> Reject
                      </button>
                      {booking.paymentStatus !== "paid" && (
                        <span
                          className="muted"
                          style={{ fontSize: 12.5, alignSelf: "center" }}
                        >
                          Approve after the renter pays
                        </span>
                      )}
                    </div>
                  )}

                  {booking.status === "confirmed" && (
                    <div className="adminbuttons">
                      <button
                        className="btn btn-outline btn-sm"
                        disabled={actingId === booking._id}
                        onClick={() => void act(booking, "completed")}
                      >
                        Mark completed
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="stack">
              <div className="card card-pad">
                <div className="eyebrow">Earnings</div>
                <h2 className="h3" style={{ marginTop: 8, marginBottom: 16 }}>
                  Last {monthly.length || 0} months
                </h2>

                {monthly.length === 0 ? (
                  <p className="muted" style={{ margin: 0 }}>
                    Earnings appear here after your first paid booking.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {monthly.map((row) => {
                      const max = Math.max(...monthly.map((entry) => entry.earnings), 1);
                      return (
                        <div key={`${row.year}-${row.month}`}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 13.5,
                              marginBottom: 5,
                            }}
                          >
                            <span className="muted">
                              {MONTHS[row.month - 1]} {row.year}
                            </span>
                            <strong>{money(row.earnings)}</strong>
                          </div>
                          <div
                            style={{
                              height: 9,
                              borderRadius: 999,
                              background: "var(--ink-100)",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.max(6, (row.earnings / max) * 100)}%`,
                                height: "100%",
                                background:
                                  "linear-gradient(90deg, var(--brand-400), var(--brand-600))",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="card card-pad">
                <div className="section-head" style={{ marginBottom: 12 }}>
                  <div>
                    <div className="eyebrow">Your catalogue</div>
                    <h2 className="h3" style={{ marginTop: 8 }}>
                      Listings
                    </h2>
                  </div>
                  <Link href="/owner/listings" className="btn btn-ghost btn-sm">
                    Manage
                  </Link>
                </div>

                {bestSeller.length === 0 ? (
                  <p className="muted" style={{ margin: 0 }}>
                    No listings yet — add your first item to get started.
                  </p>
                ) : (
                  bestSeller.map((item) => (
                    <div className="spec-row" key={item._id}>
                      <span style={{ color: "var(--ink)" }}>{item.title}</span>
                      <strong>{money(item.price)}/day</strong>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function OwnerPage() {
  return (
    <AuthGuard require="owner">
      <OwnerContent />
    </AuthGuard>
  );
}
