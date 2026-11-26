"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  ShieldCheck,
  Users,
  XCircle,
  TrendingUp,
  Wallet,
  CalendarDays,
  RefreshCw,
  Clock3,
  CheckCircle2,
  LayoutDashboard,
} from "lucide-react";

import {
  errorMessage,
  fetchAdminBookings,
  fetchAdminEquipment,
  fetchAdminStats,
  fetchAdminUsers,
  setEquipmentStatus,
  setUserRole,
} from "@/lib/api";

import { useAuth } from "@/lib/auth";
import { formatDate, formatDateRange, money, LISTING_STATUS_LABELS } from "@/lib/format";

import type { AdminStats, Booking, Equipment } from "@/lib/types";
import { AuthGuard } from "@/components/AuthGuard";

import { EmptyState, ErrorState, Notice, Spinner, StatusBadge } from "@/components/ui";

const TABS = ["Overview", "Listings", "Bookings", "Users"] as const;
type Tab = (typeof TABS)[number];

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
};

type ExtendedStats = AdminStats & {
  totalUsers?: number;
  totalEquipment?: number;
  totalBookings?: number;
  pendingApprovals?: number;
  completedRentals?: number;
  totalRevenue?: number;
  monthlyBookings?: {
    year: number;
    month: number;
    count: number;
  }[];
};

function AdminContent() {
  const { user } = useAuth();

  const [tab, setTab] = useState<Tab>("Overview");

  const [stats, setStats] = useState<ExtendedStats | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeKind, setNoticeKind] = useState<"success" | "error">("success");
  const [actingId, setActingId] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const [statRows, listingRows, bookingRows, userRows] = await Promise.all([
        fetchAdminStats(),
        fetchAdminEquipment(),
        fetchAdminBookings(),
        fetchAdminUsers(),
      ]);

      setStats(statRows as ExtendedStats);
      setEquipment(listingRows);
      setBookings(bookingRows);
      setUsers(userRows);
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

  const pending = equipment.filter((item) => item.status === "pending");

  const completed = bookings.filter((booking) => booking.status === "completed");

  async function moderate(item: Equipment, status: "approved" | "rejected") {
    const confirmed = window.confirm(
      `Are you sure you want to ${status} "${item.title}"?`,
    );

    if (!confirmed) return;

    setNotice("");
    setActingId(item._id);

    try {
      await setEquipmentStatus(item._id, status);

      setEquipment((current) =>
        current.map((row) => (row._id === item._id ? { ...row, status } : row)),
      );

      setNoticeKind("success");
      setNotice(`"${item.title}" ${status} successfully.`);
    } catch (caught) {
      setNoticeKind("error");
      setNotice(errorMessage(caught));
    } finally {
      setActingId("");
    }
  }

  async function changeRole(row: AdminUser, role: string) {
    if (row._id === user?.id) {
      setNoticeKind("error");
      setNotice("You cannot change your own administrator role.");
      return;
    }

    const confirmed = window.confirm(`Change ${row.name}'s role to ${role}?`);

    if (!confirmed) return;

    setNotice("");
    setActingId(row._id);

    try {
      await setUserRole(row._id, role);

      setUsers((current) =>
        current.map((item) => (item._id === row._id ? { ...item, role } : item)),
      );

      setNoticeKind("success");
      setNotice(`${row.name}'s role updated to ${role}.`);
    } catch (caught) {
      setNoticeKind("error");
      setNotice(errorMessage(caught));
    } finally {
      setActingId("");
    }
  }

  const totalUsers = stats?.totalUsers ?? stats?.users ?? 0;
  const totalEquipment = stats?.totalEquipment ?? stats?.equipment ?? 0;
  const totalBookings = stats?.totalBookings ?? stats?.bookings ?? 0;

  const pendingApprovals = stats?.pendingApprovals ?? pending.length;
  const completedRentals = stats?.completedRentals ?? completed.length;

  const paidPayments = stats?.paidPayments ?? 0;
  const totalRevenue = stats?.totalRevenue;
  const monthlyBookings = stats?.monthlyBookings ?? [];

  const statCards = [
    {
      label: "Total users",
      value: totalUsers,
      description: "Registered accounts",
      icon: Users,
    },
    {
      label: "Total listings",
      value: totalEquipment,
      description: `${pendingApprovals} awaiting review`,
      icon: BookOpen,
    },
    {
      label: "Total bookings",
      value: totalBookings,
      description: "All time bookings",
      icon: CalendarDays,
    },
    {
      label: "Completed rentals",
      value: completedRentals,
      description: "Successfully completed",
      icon: BadgeCheck,
    },
    {
      label: "Paid payments",
      value: paidPayments,
      description: "Successful payments",
      icon: Wallet,
    },
    {
      label: "Total revenue",
      value: totalRevenue !== undefined ? money(totalRevenue) : "—",
      description: "From paid transactions",
      icon: TrendingUp,
    },
  ];

  const tabs = [
    { name: "Overview" as Tab, icon: LayoutDashboard },
    { name: "Listings" as Tab, icon: BookOpen, count: pending.length },
    { name: "Bookings" as Tab, icon: CalendarDays },
    { name: "Users" as Tab, icon: Users },
  ];

  return (
    <main className="min-h-screen bg-background px-4 py-7 text-foreground sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1440px] space-y-8">
        {/* Header */}
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <ShieldCheck size={15} />
              Equiply administration
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Platform overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage users, equipment listings, bookings and platform activity from one
              place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Administrator
            </span>

            <button
              onClick={() => void load()}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-primary transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </section>

        {/* Notice */}
        {notice && <Notice kind={noticeKind}>{notice}</Notice>}

        {/* Navigation tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-border pb-3">
          {tabs.map(({ name, icon: Icon, count }) => (
            <button
              key={name}
              onClick={() => setTab(name)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                tab === name
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-secondary hover:text-primary"
              }`}
            >
              <Icon size={16} />
              {name}

              {name === "Listings" && count !== undefined && count > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    tab === name
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <ErrorState message={error} onRetry={() => void load()} />}

        {/* Loading */}
        {!error && loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="h-36 animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
        )}

        {/* Dashboard content */}
        {!error && !loading && (
          <div className="space-y-7">
            {/* Overview */}
            {tab === "Overview" && (
              <>
                {/* Stats */}
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {statCards.map(({ label, value, description, icon: Icon }) => (
                    <div
                      key={label}
                      className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-muted-foreground">
                          {label}
                        </p>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon size={20} />
                        </div>
                      </div>

                      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-card-foreground">
                        {value}
                      </h2>

                      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                    </div>
                  ))}
                </section>

                {/* Attention and recent activity */}
                <section className="grid items-start gap-5 xl:grid-cols-2">
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                            Needs attention
                          </p>
                          <h2 className="mt-2 text-xl font-semibold text-card-foreground">
                            Listings awaiting review
                          </h2>
                        </div>

                        <span className="rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground">
                          {pending.length}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-border px-5 sm:px-6">
                      {pending.length === 0 ? (
                        <p className="py-8 text-sm text-muted-foreground">
                          Nothing to review. All listings are up to date.
                        </p>
                      ) : (
                        pending.slice(0, 5).map((item) => (
                          <div
                            key={item._id}
                            className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-card-foreground">
                                {item.title}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {item.category} · {item.location}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              <button
                                disabled={actingId === item._id}
                                onClick={() => void moderate(item, "approved")}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                              >
                                {actingId === item._id ? (
                                  <Spinner />
                                ) : (
                                  <CheckCircle2 size={14} />
                                )}
                                Approve
                              </button>

                              <button
                                disabled={actingId === item._id}
                                onClick={() => void moderate(item, "rejected")}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border p-5 sm:p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        Recent activity
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-card-foreground">
                        Latest bookings
                      </h2>
                    </div>

                    <div className="divide-y divide-border px-5 sm:px-6">
                      {bookings.length === 0 ? (
                        <p className="py-8 text-sm text-muted-foreground">
                          No bookings have been created yet.
                        </p>
                      ) : (
                        bookings.slice(0, 5).map((booking) => (
                          <div
                            key={booking._id}
                            className="flex items-center justify-between gap-3 py-4"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-card-foreground">
                                {booking.equipmentTitle || "Equipment"}
                              </p>
                              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock3 size={12} />
                                {formatDate(booking.createdAt)}
                              </p>
                            </div>

                            <div className="shrink-0 text-right">
                              <p className="font-semibold text-card-foreground">
                                {money(booking.amount)}
                              </p>
                              <div className="mt-1">
                                <StatusBadge status={booking.status} />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </section>

                {/* Monthly analytics */}
                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Platform analytics
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-card-foreground">
                      Monthly booking statistics
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Booking activity across the platform.
                    </p>
                  </div>

                  {monthlyBookings.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No monthly statistics available yet.
                    </p>
                  ) : (
                    <div className="space-y-5">
                      {monthlyBookings.map((item) => {
                        const maximum = Math.max(
                          ...monthlyBookings.map((row) => row.count),
                          1,
                        );

                        const monthName = new Date(
                          item.year,
                          item.month - 1,
                        ).toLocaleString("en", {
                          month: "short",
                        });

                        return (
                          <div key={`${item.year}-${item.month}`}>
                            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                              <span className="font-semibold text-card-foreground">
                                {monthName} {item.year}
                              </span>
                              <span className="text-muted-foreground">
                                {item.count} bookings
                              </span>
                            </div>

                            <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                              <div
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{
                                  width: `${(item.count / maximum) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* Listings */}
            {tab === "Listings" && (
              <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="border-b border-border p-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-card-foreground">
                    Equipment listings
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review and manage equipment submitted by owners.
                  </p>
                </div>

                {equipment.length === 0 ? (
                  <div className="p-6">
                    <EmptyState
                      icon={<BookOpen size={28} />}
                      title="No listings yet"
                      description="Equipment submitted by owners will appear here."
                    />
                  </div>
                ) : (
                  <>
                    <div className="hidden grid-cols-[minmax(180px,1.5fr)_minmax(120px,1fr)_100px_110px_190px] gap-4 border-b border-border bg-muted px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:grid">
                      <span>Equipment</span>
                      <span>Owner</span>
                      <span>Price</span>
                      <span>Status</span>
                      <span>Action</span>
                    </div>

                    <div className="divide-y divide-border">
                      {equipment.map((item) => (
                        <div
                          key={item._id}
                          className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(180px,1.5fr)_minmax(120px,1fr)_100px_110px_190px] lg:items-center"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-card-foreground">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.category} · {item.location}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground lg:hidden">
                              Owner
                            </p>
                            <span className="text-sm text-muted-foreground">
                              {item.ownerId || "—"}
                            </span>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground lg:hidden">
                              Price
                            </p>
                            <span className="text-sm font-semibold text-card-foreground">
                              {money(item.price)}/day
                            </span>
                          </div>

                          <div>
                            <p className="mb-1 text-xs text-muted-foreground lg:hidden">
                              Status
                            </p>
                            <StatusBadge
                              status={item.status || "pending"}
                              label={LISTING_STATUS_LABELS[item.status || "pending"]}
                            />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {item.status !== "approved" && (
                              <button
                                disabled={actingId === item._id}
                                onClick={() => void moderate(item, "approved")}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                              >
                                {actingId === item._id ? (
                                  <Spinner />
                                ) : (
                                  <BadgeCheck size={14} />
                                )}
                                Approve
                              </button>
                            )}

                            {item.status !== "rejected" && (
                              <button
                                disabled={actingId === item._id}
                                onClick={() => void moderate(item, "rejected")}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            {/* Bookings */}
            {tab === "Bookings" && (
              <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="border-b border-border p-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-card-foreground">
                    All bookings
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    View rental dates, booking amounts and payment status.
                  </p>
                </div>

                {bookings.length === 0 ? (
                  <div className="p-6">
                    <EmptyState
                      icon={<BadgeCheck size={28} />}
                      title="No bookings yet"
                      description="Booking requests will appear here."
                    />
                  </div>
                ) : (
                  <>
                    <div className="hidden grid-cols-[minmax(150px,1.5fr)_minmax(140px,1fr)_100px_110px_100px] gap-4 border-b border-border bg-muted px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:grid">
                      <span>Equipment</span>
                      <span>Dates</span>
                      <span>Amount</span>
                      <span>Status</span>
                      <span>Payment</span>
                    </div>

                    <div className="divide-y divide-border">
                      {bookings.map((booking) => (
                        <div
                          key={booking._id}
                          className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(150px,1.5fr)_minmax(140px,1fr)_100px_110px_100px] lg:items-center"
                        >
                          <div>
                            <p className="text-xs text-muted-foreground lg:hidden">
                              Equipment
                            </p>
                            <p className="font-semibold text-card-foreground">
                              {booking.equipmentTitle || "Equipment"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground lg:hidden">
                              Rental dates
                            </p>
                            <span className="text-sm text-muted-foreground">
                              {formatDateRange(booking.startDate, booking.endDate)}
                            </span>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground lg:hidden">
                              Amount
                            </p>
                            <span className="text-sm font-semibold text-card-foreground">
                              {money(booking.amount)}
                            </span>
                          </div>

                          <div>
                            <p className="mb-1 text-xs text-muted-foreground lg:hidden">
                              Status
                            </p>
                            <StatusBadge status={booking.status} />
                          </div>

                          <div>
                            <p className="mb-1 text-xs text-muted-foreground lg:hidden">
                              Payment
                            </p>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                booking.paymentStatus === "paid"
                                  ? "bg-secondary text-secondary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            {/* Users */}
            {tab === "Users" && (
              <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="border-b border-border p-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-card-foreground">
                    User management
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage registered accounts and their platform roles.
                  </p>
                </div>

                {users.length === 0 ? (
                  <div className="p-6">
                    <EmptyState
                      icon={<Users size={28} />}
                      title="No users found"
                      description="Registered accounts will appear here."
                    />
                  </div>
                ) : (
                  <>
                    <div className="hidden grid-cols-[minmax(130px,1fr)_minmax(180px,1.5fr)_120px_100px_150px] gap-4 border-b border-border bg-muted px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:grid">
                      <span>Name</span>
                      <span>Email</span>
                      <span>Joined</span>
                      <span>Role</span>
                      <span>Change role</span>
                    </div>

                    <div className="divide-y divide-border">
                      {users.map((row) => (
                        <div
                          key={row._id}
                          className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(130px,1fr)_minmax(180px,1.5fr)_120px_100px_150px] lg:items-center"
                        >
                          <div>
                            <p className="text-xs text-muted-foreground lg:hidden">
                              Name
                            </p>
                            <p className="font-semibold text-card-foreground">
                              {row.name}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground lg:hidden">
                              Email
                            </p>
                            <p className="break-all text-sm text-muted-foreground">
                              {row.email}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground lg:hidden">
                              Joined
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(row.createdAt)}
                            </p>
                          </div>

                          <div>
                            <p className="mb-1 text-xs text-muted-foreground lg:hidden">
                              Current role
                            </p>
                            <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold capitalize text-secondary-foreground">
                              {row.role || "customer"}
                            </span>
                          </div>

                          <div>
                            <p className="mb-1 text-xs text-muted-foreground lg:hidden">
                              Change role
                            </p>
                            <select
                              value={row.role || "customer"}
                              disabled={actingId === row._id || row._id === user?.id}
                              onChange={(event) =>
                                void changeRole(row, event.target.value)
                              }
                              className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="customer">Customer</option>
                              <option value="owner">Owner</option>
                              <option value="admin">Admin</option>
                            </select>

                            {row._id === user?.id && (
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Your account
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}
          </div>
        )}

        {/* Footer note */}
        <div className="flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" />
            Equiply administration panel
          </span>
          <span>Manage the platform responsibly.</span>
        </div>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard require="admin">
      <AdminContent />
    </AuthGuard>
  );
}
