"use client";

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
  ArrowRight,
  TrendingUp,
  MapPin,
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

import { EmptyState, ErrorState, Notice, Spinner, StatusBadge } from "@/components/ui";

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

function normalizeBookings(response: unknown): Booking[] {
  if (Array.isArray(response)) {
    return response as Booking[];
  }

  if (
    response &&
    typeof response === "object" &&
    "bookings" in response &&
    Array.isArray((response as { bookings: unknown }).bookings)
  ) {
    return (response as { bookings: Booking[] }).bookings;
  }

  return [];
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
      const [stats, incomingResponse, mine] = await Promise.all([
        fetchOwnerAnalytics(),
        fetchOwnerBookings(),
        fetchMyListings(),
      ]);

      setAnalytics(stats);
      setBookings(normalizeBookings(incomingResponse));
      setListings(Array.isArray(mine) ? mine : []);
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

    if (status === "completed" && new Date(booking.endDate) > new Date()) {
      setNoticeKind("error");
      setNotice("You can complete this rental after its end date.");
      return;
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
        current.map((row) => (row._id === booking._id ? { ...row, status } : row)),
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

  const pending = bookings.filter((booking) => booking.status === "pending");

  const paidPending = pending.filter((booking) => booking.paymentStatus === "paid");

  const recent = bookings.slice(0, 6);
  const monthly = (analytics?.monthlyEarnings || []).slice(-6);

  const bestSeller = [...listings].sort((a, b) => b.price - a.price).slice(0, 4);

  const maxMonthlyEarnings = Math.max(...monthly.map((row) => row.earnings), 1);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1300px]">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-primary">
              Owner workspace
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Manage your equipment
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Approve paid rental requests, monitor your earnings and manage your
              equipment listings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/add-equipment"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              <PackagePlus size={17} />
              Add equipment
            </Link>

            <Link
              href="/owner/listings"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-primary transition hover:bg-secondary"
            >
              My listings
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Notice */}
        {notice && (
          <div className="mb-6">
            <Notice kind={noticeKind}>{notice}</Notice>
          </div>
        )}

        {/* Error */}
        {error && <ErrorState message={error} onRetry={() => void load()} />}

        {/* Loading */}
        {!error && loading && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="rounded-2xl border border-border bg-card p-6">
                <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
                <div className="mt-5 h-8 w-32 animate-pulse rounded bg-secondary" />
                <div className="mt-4 h-3 w-28 animate-pulse rounded bg-secondary" />
              </div>
            ))}
          </div>
        )}

        {!error && !loading && (
          <>
            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_5px_20px_rgba(60,40,20,0.025)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Total listings
                  </p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Package size={19} />
                  </span>
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                  {analytics?.listingCount ?? listings.length}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">Equipment you own</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_5px_20px_rgba(60,40,20,0.025)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Total earnings
                  </p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <BadgeDollarSign size={19} />
                  </span>
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                  {money(analytics?.totalEarnings || 0)}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">From paid bookings</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_5px_20px_rgba(60,40,20,0.025)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Paid rentals
                  </p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <CalendarCheck size={19} />
                  </span>
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                  {analytics?.paidRentals ?? 0}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  {analytics?.completedRentals ?? 0} completed
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_5px_20px_rgba(60,40,20,0.025)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Requests waiting
                  </p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Trophy size={19} />
                  </span>
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                  {pending.length}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  {paidPending.length} paid and ready for review
                </p>
              </div>
            </div>

            {/* Main dashboard */}
            <div className="mt-7 grid items-start gap-6 xl:grid-cols-[1.5fr_1fr]">
              {/* Incoming bookings */}
              <section className="rounded-3xl border border-border bg-card p-5 shadow-[0_5px_20px_rgba(60,40,20,0.025)] sm:p-7">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[2px] text-primary">
                      Rental requests
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">Incoming bookings</h2>
                  </div>

                  <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-primary">
                    {bookings.length} total
                  </span>
                </div>

                {recent.length === 0 && (
                  <EmptyState
                    icon={<CalendarCheck size={28} />}
                    title="No requests yet"
                    description="Once renters book your equipment, their requests will appear here."
                    action={
                      <Link
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
                        href="/add-equipment"
                      >
                        Add equipment
                      </Link>
                    }
                  />
                )}

                {recent.map((booking) => {
                  const isPaid = booking.paymentStatus === "paid";
                  const isPending = booking.status === "pending";
                  const isConfirmed = booking.status === "confirmed";
                  const rentalEnded = new Date(booking.endDate) <= new Date();
                  const isActing = actingId === booking._id;

                  return (
                    <div
                      key={booking._id}
                      className="border-b border-border py-5 last:border-b-0"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold">
                            {booking.equipmentTitle || "Equipment"}
                          </h3>

                          <p className="mt-2 text-xs text-muted-foreground">
                            {formatDateRange(booking.startDate, booking.endDate)}
                            {" · "}
                            {booking.days} day
                            {booking.days === 1 ? "" : "s"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold">{money(booking.amount)}</p>
                          <div className="mt-2">
                            <StatusBadge status={booking.status} />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Wallet size={15} className="text-primary" />
                        <span className="text-xs font-semibold text-muted-foreground">
                          Payment:
                        </span>
                        <StatusBadge status={booking.paymentStatus || "unpaid"} />

                        {isPending && !isPaid && (
                          <span className="text-xs text-muted-foreground">
                            Waiting for customer payment
                          </span>
                        )}

                        {isPending && isPaid && (
                          <span className="text-xs text-primary">
                            Ready for your approval
                          </span>
                        )}
                      </div>

                      {isPending && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={!isPaid || Boolean(actingId)}
                            onClick={() => void act(booking, "confirmed")}
                            title={isPaid ? "Approve booking" : "Customer must pay first"}
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isActing ? <Spinner /> : <CheckCircle2 size={15} />}
                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={Boolean(actingId) || isPaid}
                            onClick={() => void act(booking, "rejected")}
                            title={
                              isPaid
                                ? "Refund required before rejection"
                                : "Reject unpaid request"
                            }
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-semibold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <XCircle size={15} />
                            Reject
                          </button>

                          {isPaid && (
                            <span className="text-xs text-muted-foreground">
                              Refund required before rejection
                            </span>
                          )}
                        </div>
                      )}

                      {isConfirmed && (
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            disabled={!rentalEnded || Boolean(actingId)}
                            onClick={() => void act(booking, "completed")}
                            title={
                              rentalEnded
                                ? "Mark rental as completed"
                                : "Available after the rental end date"
                            }
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-semibold text-primary transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isActing ? <Spinner /> : <CheckCircle2 size={15} />}
                            Mark completed
                          </button>

                          {!rentalEnded && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock size={13} />
                              Rental in progress
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {bookings.length > 6 && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Showing the 6 most recent bookings.
                  </p>
                )}
              </section>

              {/* Right column */}
              <div className="grid gap-6">
                {/* Earnings chart */}
                <section className="rounded-3xl border border-border bg-card p-5 shadow-[0_5px_20px_rgba(60,40,20,0.025)] sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[2px] text-primary">
                        Earnings
                      </p>
                      <h2 className="mt-2 text-xl font-semibold">
                        Last {monthly.length} months
                      </h2>
                    </div>

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      <TrendingUp size={19} />
                    </span>
                  </div>

                  {monthly.length === 0 ? (
                    <p className="mt-6 text-sm leading-6 text-muted-foreground">
                      Earnings appear here after your first successful payment.
                    </p>
                  ) : (
                    <div className="mt-7 grid gap-4">
                      {monthly.map((row) => (
                        <div key={`${row.year}-${row.month}`}>
                          <div className="mb-2 flex justify-between gap-3 text-xs">
                            <span className="text-muted-foreground">
                              {MONTHS[row.month - 1] || "Unknown"} {row.year}
                            </span>
                            <strong>{money(row.earnings)}</strong>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{
                                width: `${Math.max(
                                  0,
                                  (row.earnings / maxMonthlyEarnings) * 100,
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Listings */}
                <section className="rounded-3xl border border-border bg-card p-5 shadow-[0_5px_20px_rgba(60,40,20,0.025)] sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[2px] text-primary">
                        Your catalogue
                      </p>
                      <h2 className="mt-2 text-xl font-semibold">Your listings</h2>
                    </div>

                    <Link
                      href="/owner/listings"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Manage
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {bestSeller.length === 0 ? (
                    <p className="mt-5 text-sm leading-6 text-muted-foreground">
                      No listings yet. Add your first item to get started.
                    </p>
                  ) : (
                    <div className="mt-5 divide-y divide-border">
                      {bestSeller.map((item) => (
                        <div
                          className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                          key={item._id}
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{item.title}</p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin size={11} />
                              {item.location}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-semibold">{money(item.price)}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              / {getRentalUnit(item.rentalType)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    href="/add-equipment"
                    className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-primary transition hover:bg-secondary"
                  >
                    <PackagePlus size={16} />
                    Add another listing
                  </Link>
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function OwnerPage() {
  return (
    <AuthGuard require="owner">
      <OwnerContent />
    </AuthGuard>
  );
}
