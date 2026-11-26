"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Heart,
  ListChecks,
  PackagePlus,
  Wallet,
  BriefcaseBusiness,
  Search,
  UserRound,
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

import { EmptyState, ErrorState, StatusBadge } from "@/components/ui";

function DashboardContent() {
  const { user, role, status } = useAuth();
  const { ids } = useFavorites();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Equipment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userRole = String(user?.role ?? role ?? "")
    .trim()
    .toLowerCase();

  const isOwner = userRole === "owner";
  const isAdmin = userRole === "admin";

  useEffect(() => {
    if (status === "authenticated" && isAdmin) {
      router.replace("/admin");
    }
  }, [status, isAdmin, router]);

  async function load() {
    setLoading(true);
    setError("");

    try {
      if (isOwner) {
        const [ownerBookings, myListings] = await Promise.all([
          fetchOwnerBookings(),
          fetchMyListings(),
        ]);

        setBookings(ownerBookings);
        setListings(myListings);
      } else {
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

  useEffect(() => {
    if (status !== "authenticated" || isAdmin) {
      return;
    }

    void load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isOwner, isAdmin]);

  if (status === "loading" || status !== "authenticated" || isAdmin) {
    return null;
  }

  const active = bookings.filter(
    (booking) => booking.status === "pending" || booking.status === "confirmed",
  );

  const completed = bookings.filter((booking) => booking.status === "completed");

  const paidAmount = bookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((sum, booking) => sum + Number(booking.amount || 0), 0);

  const stats = [
    {
      label: isOwner ? "Incoming requests" : "Active rentals",
      value: loading ? "…" : active.length,
      hint: isOwner ? "Pending or confirmed requests" : "Pending or confirmed",
      icon: CalendarDays,
    },
    {
      label: "Saved equipment",
      value: loading ? "…" : ids.length,
      hint: "In your favorites",
      icon: Heart,
    },
    {
      label: "Completed rentals",
      value: loading ? "…" : completed.length,
      hint: "All time",
      icon: ListChecks,
    },
    isOwner
      ? {
          label: "My listings",
          value: loading ? "…" : listings.length,
          hint: "Equipment you own",
          icon: PackagePlus,
        }
      : {
          label: "Total spent",
          value: loading ? "…" : money(paidAmount),
          hint: "Successful payments",
          icon: Wallet,
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
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-[1160px]">
        {/* Welcome header */}
        <section className="mb-9 flex flex-col justify-between gap-6 border-b border-border pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {isOwner ? "Owner workspace" : "Customer dashboard"}
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Welcome back, {(user?.name || "there").split(" ")[0]}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {isOwner
                ? "Manage your equipment, incoming customer bookings and business activity."
                : "Track your rental requests, payments and saved equipment."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {isOwner && (
              <Link
                href="/owner"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-primary transition hover:border-primary hover:bg-secondary"
              >
                <BriefcaseBusiness size={16} />
                Owner workspace
              </Link>
            )}

            <Link
              href="/equipment"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Search size={16} />
              Find equipment
            </Link>

            <Link
              href="/profile"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-primary transition hover:border-primary hover:bg-secondary"
            >
              <UserRound size={16} />
              Edit profile
            </Link>
          </div>
        </section>

        {/* Error state */}
        {error && (
          <div className="mb-7">
            <ErrorState message={error} onRetry={() => void load()} />
          </div>
        )}

        {!error && (
          <>
            {/* Statistics */}
            <section>
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Overview
                </p>

                <h2 className="mt-2 text-xl font-semibold text-foreground">
                  Your activity
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <article
                      key={stat.label}
                      className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.label}
                        </p>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                          <Icon size={19} />
                        </div>
                      </div>

                      <h3 className="mt-5 break-words text-3xl font-semibold tracking-tight text-foreground">
                        {stat.value}
                      </h3>

                      <p className="mt-2 text-xs text-muted-foreground">{stat.hint}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Main dashboard */}
            <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Recent bookings */}
              <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex flex-col justify-between gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:px-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {isOwner ? "Customer activity" : "Recent activity"}
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-card-foreground">
                      {isOwner ? "Incoming rental requests" : "Your latest bookings"}
                    </h2>
                  </div>

                  <Link
                    href={isOwner ? "/owner" : "/my-rentals"}
                    className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary transition hover:opacity-80"
                  >
                    View all
                    <ArrowUpRight size={16} />
                  </Link>
                </div>

                <div className="p-5 sm:p-7">
                  {loading && (
                    <div className="grid gap-3">
                      {[0, 1, 2].map((row) => (
                        <div
                          key={row}
                          className="h-[76px] animate-pulse rounded-xl bg-secondary"
                        />
                      ))}
                    </div>
                  )}

                  {!loading && bookings.length === 0 && (
                    <EmptyState
                      icon={<CalendarDays size={28} />}
                      title={isOwner ? "No rental requests yet" : "No bookings yet"}
                      description={
                        isOwner
                          ? "When customers request your equipment, their bookings will appear here."
                          : "When you request a rental, it will show up here with its live status."
                      }
                      action={
                        <Link
                          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                          href="/equipment"
                        >
                          Explore equipment
                          <ArrowRight size={16} />
                        </Link>
                      }
                    />
                  )}

                  {!loading && bookings.length > 0 && (
                    <div className="divide-y divide-border">
                      {bookings.slice(0, 5).map((booking) => (
                        <div
                          key={booking._id}
                          className="flex flex-col justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                        >
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-card-foreground">
                              {booking.equipmentTitle || "Equipment"}
                            </h3>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatDateRange(booking.startDate, booking.endDate)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <strong className="text-sm font-semibold text-primary">
                              {money(booking.amount)}
                            </strong>

                            <StatusBadge status={booking.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Right column */}
              <div className="space-y-6">
                {/* Quick actions */}
                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Shortcuts
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-card-foreground">
                      Quick actions
                    </h2>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Everything you need, in one place.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {quickLinks.map(({ title, description, href, icon: Icon }) => (
                      <Link
                        key={title}
                        href={href}
                        className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-border hover:bg-background"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-card-foreground">
                            {title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {description}
                          </p>
                        </div>

                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary"
                        />
                      </Link>
                    ))}
                  </div>
                </section>

                {/* Role information */}
                {isOwner ? (
                  <section className="rounded-2xl border border-border bg-secondary p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-primary">
                        <BriefcaseBusiness size={19} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-primary">
                          Owner tools are active
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Your owner workspace is ready.
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      Manage incoming rental requests and your equipment from your owner
                      workspace.
                    </p>

                    <Link
                      href="/owner"
                      className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      Manage bookings and listings
                      <ArrowUpRight size={16} />
                    </Link>
                  </section>
                ) : (
                  <section className="rounded-2xl border border-border bg-secondary p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-primary">
                        <PackagePlus size={19} />
                      </div>

                      <h3 className="font-semibold text-primary">
                        Earn from your equipment
                      </h3>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      Have equipment you don't use every day? Ask an administrator to
                      enable owner tools for your account, then list your first item.
                    </p>
                  </section>
                )}

                {/* Account note */}
                <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />

                  <p className="text-xs leading-5 text-muted-foreground">
                    Your dashboard keeps your rental activity, saved equipment and account
                    shortcuts together.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
