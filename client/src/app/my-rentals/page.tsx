 
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  PackageOpen,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { errorMessage, fetchMyBookings, startCheckout } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDateRange, money } from "@/lib/format";
import type { Booking } from "@/lib/types";
import { AuthGuard } from "@/components/AuthGuard";
import { Spinner } from "@/components/ui";

const TABS = ["All", "Upcoming", "Completed", "Cancelled"] as const;

function matchesTab(booking: Booking, tab: string): boolean {
  if (tab === "All") return true;

  if (tab === "Upcoming") {
    return booking.status === "pending" || booking.status === "confirmed";
  }

  if (tab === "Completed") {
    return booking.status === "completed";
  }

  return booking.status === "cancelled" || booking.status === "rejected";
}

function paymentLabel(booking: Booking) {
  if (booking.paymentStatus === "paid") return "Paid";
  if (booking.paymentStatus === "refunded") return "Refunded";
  return "Unpaid";
}

function bookingStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    rejected: "Rejected",
  };

  return labels[status] || status;
}

function bookingStatusStyle(status: string) {
  if (status === "confirmed" || status === "completed") {
    return "bg-[#eaf0e6] text-[#58704b]";
  }

  if (status === "cancelled" || status === "rejected") {
    return "bg-[#f6eae5] text-[#9a604c]";
  }

  return "bg-[#f3eee5] text-[#91734e]";
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
    (booking) =>
      booking.status === "pending" && booking.paymentStatus !== "paid",
  );

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "paid",
  );

  return (
    <main className="min-h-screen bg-[#f5f1eb] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">

        {/* Page heading */}
        <div className="flex flex-col gap-6 border-b border-[#ded5ca] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#98795e]">
              Your Equiply account
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#302a23] sm:text-4xl">
              My rentals
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#82786c]">
              Everything you've rented, all in one place. Manage your bookings
              and keep track of your rental journey.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center justify-center gap-2 self-start bg-[#806247] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#684e39] sm:self-auto"
          >
            Explore equipment
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Overview cards */}
        {!loading && !error && (
          <section className="grid grid-cols-2 gap-3 py-7 sm:grid-cols-3 sm:gap-5">
            <div className="border border-[#e6ddd2] bg-[#fffdfa] p-5">
              <div className="flex items-center gap-2 text-[#98795e]">
                <PackageOpen size={17} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                  Total rentals
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-[#302a23]">
                {bookings.length}
              </p>
            </div>

            <div className="border border-[#e6ddd2] bg-[#fffdfa] p-5">
              <div className="flex items-center gap-2 text-[#98795e]">
                <Clock3 size={17} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                  Awaiting payment
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-[#302a23]">
                {needsPayment.length}
              </p>
            </div>

            <div className="col-span-2 border border-[#e6ddd2] bg-[#fffdfa] p-5 sm:col-span-1">
              <div className="flex items-center gap-2 text-[#98795e]">
                <CheckCircle2 size={17} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                  Payments completed
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-[#302a23]">
                {paidBookings.length}
              </p>
            </div>
          </section>
        )}

        {/* Payment reminder */}
        {needsPayment.length > 0 && (
          <div className="mb-6 flex items-start gap-3 border border-[#e7d9c5] bg-[#faf4e9] p-4 sm:p-5">
            <div className="mt-0.5 text-[#98734c]">
              <CreditCard size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#604a32]">
                Payment required
              </p>
              <p className="mt-1 text-xs leading-6 text-[#8c7964]">
                You have {needsPayment.length} booking
                {needsPayment.length === 1 ? "" : "s"} waiting for payment.
                Complete checkout to continue the rental process.
              </p>
            </div>
          </div>
        )}

        {/* Error notice */}
        {notice && (
          <div className="mb-6 border border-[#e7cfc5] bg-[#fbf0eb] p-4 text-sm text-[#965b49]">
            {notice}
          </div>
        )}

        {/* Booking section heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#98795e]">
              Rental management
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#302a23] sm:text-2xl">
              Your booking history
            </h2>
          </div>

          <p className="text-xs text-[#928779]">
            {filtered.length} booking{filtered.length === 1 ? "" : "s"} found
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto border-b border-[#ded5ca] pb-3">
          {TABS.map((value) => {
            const active = tab === value;

            return (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`shrink-0 px-5 py-2.5 text-xs font-semibold transition ${
                  active
                    ? "bg-[#806247] text-white"
                    : "border border-[#ded5ca] bg-[#faf8f4] text-[#766b5e] hover:bg-[#eee7dd]"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse border border-[#e6ddd2] bg-[#fffdfa]"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 border border-[#e6ddd2] bg-[#fffdfa] px-6 py-12 text-center">
            <p className="text-lg font-semibold text-[#302a23]">
              Unable to load your rentals
            </p>
            <p className="mt-2 text-sm text-[#82786c]">{error}</p>

            <button
              onClick={() => void load()}
              className="mt-6 bg-[#806247] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#684e39]"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="mt-8 border border-[#e6ddd2] bg-[#fffdfa] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3eee6] text-[#98795e]">
              <PackageOpen size={28} strokeWidth={1.5} />
            </div>

            <h3 className="mt-6 text-xl font-semibold text-[#302a23]">
              {tab === "All"
                ? "Your rental journey starts here"
                : `No ${tab.toLowerCase()} rentals`}
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#82786c]">
              {tab === "All"
                ? "Discover useful equipment, choose your rental dates and manage everything from this page."
                : "There are no bookings in this category right now."}
            </p>

            <Link
              href="/equipment"
              className="mt-7 inline-flex items-center gap-2 bg-[#806247] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#684e39]"
            >
              Discover equipment
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Booking list */}
        {!loading && !error && filtered.length > 0 && (
          <div className="mt-6 space-y-4">
            {filtered.map((booking) => {
              const awaitingPayment =
                booking.status === "pending" &&
                booking.paymentStatus !== "paid";

              return (
                <article
                  key={booking._id}
                  className="border border-[#e6ddd2] bg-[#fffdfa] p-5 transition-shadow hover:shadow-[0_8px_30px_rgba(73,57,39,0.05)] sm:p-7"
                >
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

                    {/* Booking information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-[#f3eee6] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#806247]">
                          Rental booking
                        </span>

                        <span
                          className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${bookingStatusStyle(booking.status)}`}
                        >
                          {bookingStatusLabel(booking.status)}
                        </span>

                        <span
                          className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                            booking.paymentStatus === "paid"
                              ? "bg-[#eaf0e6] text-[#58704b]"
                              : booking.paymentStatus === "refunded"
                                ? "bg-[#eee9f2] text-[#766188]"
                                : "bg-[#f8eee2] text-[#98734c]"
                          }`}
                        >
                          {paymentLabel(booking)}
                        </span>
                      </div>

                      <h3 className="mt-4 break-words text-xl font-semibold tracking-tight text-[#302a23]">
                        {booking.equipmentTitle || "Equipment rental"}
                      </h3>

                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[#82786c]">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={15} className="text-[#98795e]" />
                          {formatDateRange(
                            booking.startDate,
                            booking.endDate,
                          )}
                        </span>

                        <span className="flex items-center gap-2">
                          <MapPin size={15} className="text-[#98795e]" />
                          {booking.days} day{booking.days === 1 ? "" : "s"}
                        </span>
                      </div>

                      <p className="mt-3 text-[11px] text-[#a09587]">
                        Requested{" "}
                        {booking.createdAt
                          ? new Date(booking.createdAt).toLocaleDateString()
                          : "—"}
                        {awaitingPayment && booking.expiresAt
                          ? ` · Payment hold until ${new Date(booking.expiresAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : ""}
                      </p>
                    </div>

                    {/* Price and actions */}
                    <div className="flex flex-row items-center justify-between gap-4 border-t border-[#eee7de] pt-5 lg:min-w-[230px] lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                      <div className="lg:text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a09587]">
                          Rental total
                        </p>

                        <p className="mt-1 text-2xl font-semibold tracking-tight text-[#302a23]">
                          {money(booking.amount)}
                        </p>
                      </div>

                      <div className="flex flex-col items-stretch gap-2">
                        {/* View Details */}
                        <Link
                          href={`/equipment/${booking.equipmentId}`}
                          className="inline-flex items-center justify-center gap-2 border border-[#dcd2c6] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#806247] transition hover:bg-[#f5f0e9]"
                        >
                          View details
                          <ArrowRight size={15} />
                        </Link>

                        {/* Payment action */}
                        {awaitingPayment ? (
                          <button
                            onClick={() => void handlePay(booking)}
                            disabled={payingId === booking._id}
                            className="inline-flex items-center justify-center gap-2 bg-[#806247] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#684e39] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {payingId === booking._id ? (
                              <>
                                <Spinner />
                                Redirecting
                              </>
                            ) : (
                              <>
                                <CreditCard size={15} />
                                Pay now
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="inline-flex items-center justify-center gap-2 border border-[#e6ddd2] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#806b55]">
                            <Wallet size={14} />
                            {booking.paymentStatus === "paid"
                              ? "Payment received"
                              : "No payment due"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center justify-center gap-2 border-t border-[#ded5ca] pt-6 text-center sm:flex-row">
          <ShieldCheck size={15} className="text-[#98795e]" />
          <p className="text-[10px] uppercase tracking-[0.13em] text-[#988c7e]">
            Your bookings are securely managed by Equiply · Payments powered by Stripe
          </p>
        </div>
      </div>
    </main>
  );
}

export default function MyRentalsPage() {
  return (
    <AuthGuard>
      <RentalsContent />
    </AuthGuard>
  );
}
