 
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
  Clock,
  Wallet,
} from "lucide-react";

import {
  errorMessage,
  fetchMyListings,
  fetchOwnerAnalytics,
  fetchOwnerBookings,
  updateBookingStatus,
} from "@/lib/api";

import { formatDateRange, money } from "@/lib/format";

import type {
  Booking,
  Equipment,
  OwnerAnalytics,
} from "@/lib/types";

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
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type BookingAction = "confirmed" | "rejected" | "completed";

function getRentalUnit(rentalType: string) {
  const units: Record<string, string> = {
    hourly: "hour",
    daily: "day",
    weekly: "week",
    monthly: "month",
  };

  return units[rentalType] || rentalType || "day";
}

function OwnerContent() {
  const [analytics, setAnalytics] = useState<OwnerAnalytics | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Equipment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeKind, setNoticeKind] = useState<"success" | "error">("success");

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

  async function act(booking: Booking, status: BookingAction) {
    if (actingId) return;

    if (status === "confirmed" && booking.paymentStatus !== "paid") {
      setNoticeKind("error");
      setNotice("This booking must be paid before you can approve it.");
      return;
    }

    if (status === "rejected" && booking.paymentStatus === "paid") {
      setNoticeKind("error");
      setNotice("A refund must be processed before rejecting a paid booking.");
      return;
    }

    if (status === "completed") {
      if (new Date(booking.endDate) > new Date()) {
        setNoticeKind("error");
        setNotice("You can complete this rental after its end date.");
        return;
      }
    }

    const actionLabel =
      status === "confirmed"
        ? "approve"
        : status === "rejected"
          ? "reject"
          : "mark as completed";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabel} this booking?`,
    );

    if (!confirmed) return;

    setNotice("");
    setActingId(booking._id);

    try {
      await updateBookingStatus(booking._id, status);

      setBookings((current) =>
        current.map((row) =>
          row._id === booking._id
            ? { ...row, status }
            : row,
        ),
      );

      setNoticeKind("success");
      setNotice(`Booking ${status} successfully.`);
    } catch (caught) {
      setNoticeKind("error");
      setNotice(errorMessage(caught));
    } finally {
      setActingId("");
    }
  }

  const pending = bookings.filter(
    (booking) => booking.status === "pending",
  );

  const paidPending = pending.filter(
    (booking) => booking.paymentStatus === "paid",
  );

  const recent = bookings.slice(0, 6);

  const monthly = (analytics?.monthlyEarnings || []).slice(-6);

  const bestSeller = [...listings]
    .sort((a, b) => b.price - a.price)
    .slice(0, 4);

  const maxMonthlyEarnings = Math.max(
    ...monthly.map((row) => row.earnings),
    1,
  );

  return (
    <div className="wrap section">
      <PageHeader
        eyebrow="Owner workspace"
        title="Manage your equipment"
        description="Approve paid rental requests, monitor your earnings and manage your equipment listings."
        actions={
          <>
            <Link className="btn" href="/add-equipment">
              <PackagePlus size={17} />
              Add equipment
            </Link>

            <Link className="btn btn-outline" href="/owner/listings">
              My listings
            </Link>
          </>
        }
      />

      {notice && (
        <div style={{ marginBottom: 20 }}>
          <Notice kind={noticeKind}>
            {notice}
          </Notice>
        </div>
      )}

      {error && (
        <ErrorState
          message={error}
          onRetry={() => void load()}
        />
      )}

      {!error && loading && (
        <div className="grid4">
          {[0, 1, 2, 3].map((row) => (
            <div
              className="card"
              key={row}
              style={{ padding: 24 }}
            >
              <div
                className="skeleton"
                style={{ height: 16, width: "60%" }}
              />

              <div
                className="skeleton"
                style={{
                  height: 32,
                  width: "80%",
                  marginTop: 14,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {!error && !loading && (
        <>
          {/* Overview statistics */}
          <div className="grid4">
            <div className="card stat">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p>Total listings</p>

                <span className="stat-icon">
                  <Package size={19} />
                </span>
              </div>

              <h2>{analytics?.listingCount ?? listings.length}</h2>

              <small className="muted">
                Equipment you own
              </small>
            </div>

            <div className="card stat">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p>Total earnings</p>

                <span className="stat-icon">
                  <BadgeDollarSign size={19} />
                </span>
              </div>

              <h2>
                {money(analytics?.totalEarnings || 0)}
              </h2>

              <small className="muted">
                From paid bookings
              </small>
            </div>

            <div className="card stat">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p>Requests waiting</p>

                <span className="stat-icon">
                  <Trophy size={19} />
                </span>
              </div>

              <h2>{pending.length}</h2>

              <small className="muted">
                {paidPending.length} paid and ready for review
              </small>
            </div>
          </div>

          {/* Main dashboard */}
          <div
            className="grid2"
            style={{
              marginTop: 30,
              alignItems: "start",
            }}
          >
            {/* Incoming bookings */}
            <div className="card card-pad">
              <div
                className="section-head"
                style={{ marginBottom: 8 }}
              >
                <div>
                  <div className="eyebrow">
                    Rental requests
                  </div>

                  <h2
                    className="h3"
                    style={{ marginTop: 8 }}
                  >
                    Incoming bookings
                  </h2>
                </div>

                <span className="muted" style={{ fontSize: 13 }}>
                  {bookings.length} total
                </span>
              </div>

              {recent.length === 0 && (
                <EmptyState
                  icon={<CalendarCheck size={28} />}
                  title="No requests yet"
                  description="Once renters book your equipment, their requests will appear here."
                  action={
                    <Link className="btn" href="/add-equipment">
                      Add equipment
                    </Link>
                  }
                />
              )}

              {recent.map((booking) => {
                const isPaid = booking.paymentStatus === "paid";
                const isPending = booking.status === "pending";
                const isConfirmed = booking.status === "confirmed";

                const rentalEnded =
                  new Date(booking.endDate) <= new Date();

                const isActing = actingId === booking._id;

                return (
                  <div
                    key={booking._id}
                    style={{
                      padding: "16px 0",
                      borderBottom: "1px solid var(--line)",
                      display: "grid",
                      gap: 12,
                    }}
                  >
                    {/* Booking information */}
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
                        <strong>
                          {booking.equipmentTitle || "Equipment"}
                        </strong>

                        <small
                          className="muted"
                          style={{
                            display: "block",
                            fontSize: 13,
                            marginTop: 4,
                          }}
                        >
                          {formatDateRange(
                            booking.startDate,
                            booking.endDate,
                          )}
                          {" · "}
                          {booking.days} day
                          {booking.days === 1 ? "" : "s"}
                        </small>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: 6,
                          justifyItems: "end",
                        }}
                      >
                        <strong>
                          {money(booking.amount)}
                        </strong>

                        <StatusBadge status={booking.status} />
                      </div>
                    </div>

                    {/* Payment information */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <Wallet size={15} />

                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        Payment:
                      </span>

                      <StatusBadge
                        status={booking.paymentStatus || "unpaid"}
                      />

                      {isPending && !isPaid && (
                        <span
                          className="muted"
                          style={{ fontSize: 12.5 }}
                        >
                          Waiting for customer payment
                        </span>
                      )}

                      {isPending && isPaid && (
                        <span
                          className="muted"
                          style={{ fontSize: 12.5 }}
                        >
                          Ready for your approval
                        </span>
                      )}
                    </div>

                    {/* Booking actions */}
                    {isPending && (
                      <div className="adminbuttons">
                        <button
                          type="button"
                          className="btn btn-sm"
                          disabled={!isPaid || Boolean(actingId)}
                          onClick={() =>
                            void act(booking, "confirmed")
                          }
                          title={
                            isPaid
                              ? "Approve booking"
                              : "Customer must pay first"
                          }
                        >
                          {isActing ? (
                            <Spinner />
                          ) : (
                            <CheckCircle2 size={15} />
                          )}

                          Approve
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          disabled={!isPaid && Boolean(actingId)}
                          onClick={() =>
                            void act(booking, "rejected")
                          }
                          title={
                            isPaid
                              ? "Refund required before rejection"
                              : "Reject unpaid request"
                          }
                        >
                          <XCircle size={15} />
                          Reject
                        </button>

                        {isPaid && (
                          <span
                            className="muted"
                            style={{
                              fontSize: 12,
                              alignSelf: "center",
                            }}
                          >
                            Refund required before rejection
                          </span>
                        )}
                      </div>
                    )}

                    {isConfirmed && (
                      <div className="adminbuttons">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          disabled={
                            !rentalEnded || Boolean(actingId)
                          }
                          onClick={() =>
                            void act(booking, "completed")
                          }
                          title={
                            rentalEnded
                              ? "Mark rental as completed"
                              : "Available after the rental end date"
                          }
                        >
                          {isActing ? (
                            <Spinner />
                          ) : (
                            <CheckCircle2 size={15} />
                          )}

                          Mark completed
                        </button>

                        {!rentalEnded && (
                          <span
                            className="muted"
                            style={{
                              fontSize: 12,
                              alignSelf: "center",
                            }}
                          >
                            <Clock
                              size={13}
                              style={{
                                display: "inline",
                                verticalAlign: "middle",
                                marginRight: 4,
                              }}
                            />
                            Rental in progress
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {bookings.length > 6 && (
                <p
                  className="muted"
                  style={{
                    fontSize: 13,
                    marginTop: 16,
                    marginBottom: 0,
                  }}
                >
                  Showing the 6 most recent bookings.
                </p>
              )}
            </div>

            {/* Earnings and catalogue */}
            <div className="stack">
              {/* Monthly earnings */}
              <div className="card card-pad">
                <div className="eyebrow">
                  Earnings
                </div>

                <h2
                  className="h3"
                  style={{
                    marginTop: 8,
                    marginBottom: 16,
                  }}
                >
                  Last {monthly.length} months
                </h2>

                {monthly.length === 0 ? (
                  <p
                    className="muted"
                    style={{ margin: 0 }}
                  >
                    Earnings appear here after your first successful payment.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {monthly.map((row) => (
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
                            {MONTHS[row.month - 1] || "Unknown"}{" "}
                            {row.year}
                          </span>

                          <strong>
                            {money(row.earnings)}
                          </strong>
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
                              width: `${
                                Math.max(
                                  0,
                                  (row.earnings / maxMonthlyEarnings) * 100,
                                )
                              }%`,
                              height: "100%",
                              borderRadius: 999,
                              background:
                                "linear-gradient(90deg, var(--brand-400), var(--brand-600))",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Equipment catalogue */}
              <div className="card card-pad">
                <div
                  className="section-head"
                  style={{ marginBottom: 12 }}
                >
                  <div>
                    <div className="eyebrow">
                      Your catalogue
                    </div>

                    <h2
                      className="h3"
                      style={{ marginTop: 8 }}
                    >
                      Your listings
                    </h2>
                  </div>

                  <Link
                    href="/owner/listings"
                    className="btn btn-ghost btn-sm"
                  >
                    Manage
                  </Link>
                </div>

                {bestSeller.length === 0 ? (
                  <p
                    className="muted"
                    style={{ margin: 0 }}
                  >
                    No listings yet. Add your first item to get started.
                  </p>
                ) : (
                  bestSeller.map((item) => (
                    <div
                      className="spec-row"
                      key={item._id}
                    >
                      <span style={{ color: "var(--ink)" }}>
                        {item.title}
                      </span>

                      <strong>
                        {money(item.price)}
                        <small className="muted">
                          {" / "}
                          {getRentalUnit(item.rentalType)}
                        </small>
                      </strong>
                    </div>
                  ))
                )}

                <Link
                  href="/add-equipment"
                  className="btn btn-outline"
                  style={{
                    marginTop: 16,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <PackagePlus size={16} />
                  Add another listing
                </Link>
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
