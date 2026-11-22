"use client";

// Admin panel: platform stats, listing moderation, bookings and user roles.

import { useEffect, useState } from "react";
import { BadgeCheck, BookOpen, ShieldCheck, Users, XCircle } from "lucide-react";

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
import { formatDate, formatDateRange, money } from "@/lib/format";
import { LISTING_STATUS_LABELS } from "@/lib/format";
import type { AdminStats, Booking, Equipment } from "@/lib/types";
import { AuthGuard } from "@/components/AuthGuard";
import {
  EmptyState,
  ErrorState,
  Notice,
  PageHeader,
  Spinner,
  StatusBadge,
} from "@/components/ui";

const TABS = ["Overview", "Listings", "Bookings", "Users"] as const;
type Tab = (typeof TABS)[number];

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
};

function AdminContent() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("Overview");

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
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
      setStats(statRows);
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

  async function moderate(item: Equipment, status: "approved" | "rejected") {
    setNotice("");
    setActingId(item._id);
    try {
      await setEquipmentStatus(item._id, status);
      setEquipment((current) =>
        current.map((row) => (row._id === item._id ? { ...row, status } : row)),
      );
      setNotice(`"${item.title}" ${status}.`);
    } catch (caught) {
      setNotice(errorMessage(caught));
    } finally {
      setActingId("");
    }
  }

  async function changeRole(row: AdminUser, role: string) {
    setNotice("");
    setActingId(row._id);
    try {
      await setUserRole(row._id, role);
      setUsers((current) =>
        current.map((item) => (item._id === row._id ? { ...item, role } : item)),
      );
      setNotice(`${row.name} is now ${role}.`);
    } catch (caught) {
      setNotice(errorMessage(caught));
    } finally {
      setActingId("");
    }
  }

  const pending = equipment.filter((item) => item.status === "pending");

  return (
    <div className="wrap section">
      <PageHeader
        eyebrow="Administration"
        title="Platform overview"
        description="Moderate listings, review bookings and manage user roles across Equiply."
        actions={
          <span className="badge badge-brand">
            <ShieldCheck size={14} /> Signed in as admin
          </span>
        }
      />

      {notice && (
        <div style={{ marginBottom: 20 }}>
          <Notice kind="success">{notice}</Notice>
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
            {value === "Listings" && pending.length > 0 ? ` (${pending.length})` : ""}
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
            <div className="skeleton" key={row} style={{ height: 70 }} />
          ))}
        </div>
      )}

      {!error && !loading && (
        <div style={{ marginTop: 24 }}>
          {tab === "Overview" && (
            <>
              <div className="grid4">
                <div className="card stat">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>Users</p>
                    <span className="stat-icon">
                      <Users size={19} />
                    </span>
                  </div>
                  <h2>{stats?.users ?? 0}</h2>
                  <small className="muted">Registered accounts</small>
                </div>

                <div className="card stat">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>Listings</p>
                    <span className="stat-icon">
                      <BookOpen size={19} />
                    </span>
                  </div>
                  <h2>{stats?.equipment ?? 0}</h2>
                  <small className="muted">{pending.length} awaiting review</small>
                </div>

                <div className="card stat">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>Bookings</p>
                    <span className="stat-icon">
                      <BadgeCheck size={19} />
                    </span>
                  </div>
                  <h2>{stats?.bookings ?? 0}</h2>
                  <small className="muted">All time</small>
                </div>

                <div className="card stat">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>Paid payments</p>
                    <span className="stat-icon">
                      <BadgeCheck size={19} />
                    </span>
                  </div>
                  <h2>{stats?.paidPayments ?? 0}</h2>
                  <small className="muted">Stripe test payments</small>
                </div>
              </div>

              <div className="grid2" style={{ marginTop: 26, alignItems: "start" }}>
                <div className="card card-pad">
                  <div className="eyebrow">Needs attention</div>
                  <h2 className="h3" style={{ marginTop: 8, marginBottom: 14 }}>
                    Listings awaiting review
                  </h2>

                  {pending.length === 0 ? (
                    <p className="muted" style={{ margin: 0 }}>
                      Nothing to review — every submission has been handled.
                    </p>
                  ) : (
                    pending.slice(0, 5).map((item) => (
                      <div className="spec-row" key={item._id}>
                        <span style={{ color: "var(--ink)" }}>
                          {item.title}
                          <small
                            className="muted"
                            style={{ display: "block", fontWeight: 400 }}
                          >
                            {item.category} · {item.location}
                          </small>
                        </span>
                        <span className="adminbuttons">
                          <button
                            className="btn btn-sm"
                            disabled={actingId === item._id}
                            onClick={() => void moderate(item, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={actingId === item._id}
                            onClick={() => void moderate(item, "rejected")}
                          >
                            Reject
                          </button>
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="card card-pad">
                  <div className="eyebrow">Recent activity</div>
                  <h2 className="h3" style={{ marginTop: 8, marginBottom: 14 }}>
                    Latest bookings
                  </h2>

                  {bookings.slice(0, 5).map((booking) => (
                    <div className="spec-row" key={booking._id}>
                      <span style={{ color: "var(--ink)" }}>
                        {booking.equipmentTitle || "Equipment"}
                        <small
                          className="muted"
                          style={{ display: "block", fontWeight: 400 }}
                        >
                          {formatDate(booking.createdAt)}
                        </small>
                      </span>
                      <span style={{ display: "grid", gap: 5, justifyItems: "end" }}>
                        <strong>{money(booking.amount)}</strong>
                        <StatusBadge status={booking.status} />
                      </span>
                    </div>
                  ))}

                  {bookings.length === 0 && (
                    <p className="muted" style={{ margin: 0 }}>
                      No bookings have been created yet.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {tab === "Listings" && (
            <div className="card listingtable">
              <div className="listinghead">
                <span>Equipment</span>
                <span>Owner</span>
                <span>Price</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {equipment.length === 0 && (
                <EmptyState
                  icon={<BookOpen size={28} />}
                  title="No listings yet"
                  description="Equipment submitted by owners will appear here for review."
                />
              )}

              {equipment.map((item) => (
                <div className="listingrow" key={item._id}>
                  <div>
                    <strong>{item.title}</strong>
                    <small
                      className="muted"
                      style={{ display: "block", fontWeight: 400 }}
                    >
                      {item.category} · {item.location}
                    </small>
                  </div>
                  <span className="muted">{item.ownerId || "—"}</span>
                  <span>{money(item.price)}/day</span>
                  <StatusBadge
                    status={item.status || "pending"}
                    label={LISTING_STATUS_LABELS[item.status || "pending"]}
                  />
                  <div className="adminbuttons">
                    {item.status !== "approved" && (
                      <button
                        className="btn btn-sm"
                        disabled={actingId === item._id}
                        onClick={() => void moderate(item, "approved")}
                      >
                        {actingId === item._id ? <Spinner /> : <BadgeCheck size={15} />}
                        Approve
                      </button>
                    )}
                    {item.status !== "rejected" && (
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={actingId === item._id}
                        onClick={() => void moderate(item, "rejected")}
                      >
                        <XCircle size={15} /> Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "Bookings" && (
            <div className="card listingtable">
              <div className="listinghead">
                <span>Equipment</span>
                <span>Dates</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Payment</span>
              </div>

              {bookings.length === 0 && (
                <EmptyState
                  icon={<BadgeCheck size={28} />}
                  title="No bookings yet"
                  description="Booking requests from customers will be listed here."
                />
              )}

              {bookings.map((booking) => (
                <div className="listingrow" key={booking._id}>
                  <strong>{booking.equipmentTitle || "Equipment"}</strong>
                  <span style={{ fontSize: 13.5 }}>
                    {formatDateRange(booking.startDate, booking.endDate)}
                  </span>
                  <span>{money(booking.amount)}</span>
                  <StatusBadge status={booking.status} />
                  <span
                    className={`badge${booking.paymentStatus === "paid" ? " badge-brand" : ""}`}
                  >
                    {booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tab === "Users" && (
            <div className="card listingtable">
              <div className="listinghead">
                <span>Name</span>
                <span>Email</span>
                <span>Joined</span>
                <span>Role</span>
                <span>Change role</span>
              </div>

              {users.map((row) => (
                <div className="listingrow" key={row._id}>
                  <strong>{row.name}</strong>
                  <span style={{ fontSize: 13.5 }}>{row.email}</span>
                  <span style={{ fontSize: 13.5 }}>{formatDate(row.createdAt)}</span>
                  <span
                    className="badge badge-brand"
                    style={{ textTransform: "capitalize" }}
                  >
                    {row.role || "customer"}
                  </span>
                  <select
                    value={row.role || "customer"}
                    disabled={actingId === row._id || row._id === user?.id}
                    onChange={(event) => void changeRole(row, event.target.value)}
                    style={{ padding: "8px 10px", fontSize: 14 }}
                  >
                    <option value="customer">customer</option>
                    <option value="owner">owner</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              ))}

              {users.length === 0 && (
                <EmptyState
                  icon={<Users size={28} />}
                  title="No users found"
                  description="Registered accounts will appear here."
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard require="admin">
      <AdminContent />
    </AuthGuard>
  );
}
