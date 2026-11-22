"use client";

// Customer bookings: statuses, dates, totals and Stripe checkout.

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, CreditCard, MapPin, Wallet } from "lucide-react";

import { errorMessage, fetchMyBookings, startCheckout } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDateRange, money } from "@/lib/format";
import type { Booking } from "@/lib/types";
import { AuthGuard } from "@/components/AuthGuard";
import {
  EmptyState,
  ErrorState,
  Notice,
  PageHeader,
  Spinner,
  StatusBadge,
} from "@/components/ui";

const TABS = ["All", "Upcoming", "Completed", "Cancelled"] as const;

function matchesTab(booking: Booking, tab: string): boolean {
  if (tab === "All") return true;
  if (tab === "Upcoming")
    return booking.status === "pending" || booking.status === "confirmed";
  if (tab === "Completed") return booking.status === "completed";
  return booking.status === "cancelled" || booking.status === "rejected";
}

function RentalsContent() {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setBookings(await fetchMyBookings());
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  async function handlePay(booking: Booking) {
    setNotice("");
    setPayingId(booking._id);
    try {
      const url = await startCheckout(booking._id);
      window.location.href = url;
    } catch (caught) {
      setNotice(errorMessage(caught));
      setPayingId("");
    }
  }

  const filtered = bookings.filter((booking) => matchesTab(booking, tab));
  const needsPayment = bookings.filter(
    (booking) => booking.status === "pending" && booking.paymentStatus !== "paid",
  );

  return (
    <div className="wrap section">
      <PageHeader
        eyebrow="Customer workspace"
        title="My rentals"
        description="Review your rental requests, complete payment and keep an eye on every booking."
        actions={
          <Link className="btn" href="/equipment">
            Browse equipment
          </Link>
        }
      />

      {needsPayment.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Notice kind="warning">
            {needsPayment.length} booking
            {needsPayment.length === 1 ? " is" : "s are"} waiting for payment. Complete
            checkout so the owner can confirm your dates.
          </Notice>
        </div>
      )}

      {notice && (
        <div style={{ marginBottom: 20 }}>
          <Notice kind="error">{notice}</Notice>
        </div>
      )}

      <div className="tabs">
        {TABS.map((value) => (
          <button
            key={value}
            className={tab === value ? "tabactive" : "tab"}
            onClick={() => setTab(value)}
          >
            {value}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ marginTop: 22 }}>
          <ErrorState message={error} onRetry={() => void load()} />
        </div>
      )}

      {!error && loading && (
        <div className="stack" style={{ marginTop: 22 }}>
          {[0, 1, 2].map((row) => (
            <div className="skeleton" key={row} style={{ height: 96 }} />
          ))}
        </div>
      )}

      {!error && !loading && filtered.length === 0 && (
        <div style={{ marginTop: 22 }}>
          <EmptyState
            icon={<CalendarDays size={30} />}
            title={
              tab === "All"
                ? "You have not rented anything yet"
                : `No ${tab.toLowerCase()} rentals`
            }
            description="Pick your rental dates on any listing and send a request — it will appear here instantly."
            action={
              <Link className="btn" href="/equipment">
                Explore equipment
              </Link>
            }
          />
        </div>
      )}

      {!error && !loading && filtered.length > 0 && (
        <div className="stack" style={{ marginTop: 22 }}>
          {filtered.map((booking) => {
            const awaitingPayment =
              booking.status === "pending" && booking.paymentStatus !== "paid";
            return (
              <article className="card card-pad" key={booking._id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 18,
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ minWidth: 240 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <h3 className="h3" style={{ fontSize: 18 }}>
                        {booking.equipmentTitle || "Equipment rental"}
                      </h3>
                      <StatusBadge status={booking.status} />
                      <span
                        className={`badge${booking.paymentStatus === "paid" ? " badge-brand" : ""}`}
                      >
                        {booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </div>

                    <p
                      className="muted"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 10,
                        fontSize: 14.5,
                        marginBlock: "10px 0",
                      }}
                    >
                      <MapPin size={15} />
                      {formatDateRange(booking.startDate, booking.endDate)}
                      <span>
                        · {booking.days} day{booking.days === 1 ? "" : "s"}
                      </span>
                    </p>

                    <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>
                      Requested{" "}
                      {booking.createdAt
                        ? new Date(booking.createdAt).toLocaleDateString()
                        : "—"}
                      {awaitingPayment && booking.expiresAt
                        ? ` · hold until ${new Date(booking.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                        : ""}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: 10,
                      justifyItems: "end",
                    }}
                  >
                    <strong style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
                      {money(booking.amount)}
                    </strong>

                    {awaitingPayment ? (
                      <button
                        className="btn"
                        onClick={() => void handlePay(booking)}
                        disabled={payingId === booking._id}
                      >
                        {payingId === booking._id ? (
                          <>
                            <Spinner /> Redirecting…
                          </>
                        ) : (
                          <>
                            <CreditCard size={17} /> Pay now
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="badge">
                        <Wallet size={14} />
                        {booking.paymentStatus === "paid"
                          ? "Payment received"
                          : "No payment due"}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="muted" style={{ marginTop: 22, fontSize: 13.5 }}>
        Bookings are stored on the Equiply server. Payment uses Stripe Checkout in test
        mode.
      </p>
    </div>
  );
}

export default function MyRentalsPage() {
  return (
    <AuthGuard>
      <RentalsContent />
    </AuthGuard>
  );
}
