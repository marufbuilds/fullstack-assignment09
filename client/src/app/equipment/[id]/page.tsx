"use client";

// Equipment details + the rental request (booking) flow.

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  MapPin,
  PackageSearch,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  ApiError,
  createBooking,
  errorMessage,
  fetchEquipment,
  fetchEquipmentById,
} from "@/lib/api";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { demoEquipment } from "@/lib/demo-equipment";
import { useAuth } from "@/lib/auth";
import { daysBetween, formatDate, money, rentalUnit } from "@/lib/format";
import type { Equipment } from "@/lib/types";
import { FavoriteButton } from "@/components/FavoriteButton";
import { EquipmentCard } from "@/components/EquipmentCard";
import { LoadingPage, Notice, Spinner } from "@/components/ui";

/** The API only accepts bookings that start in the future. */
function tomorrow(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export default function EquipmentDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useAuth();

  const [item, setItem] = useState<Equipment | null>(null);
  const [related, setRelated] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"success" | "error">("error");
  const [booked, setBooked] = useState(false);

  const minStart = tomorrow();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const data = await fetchEquipmentById(params.id);
        if (cancelled) return;
        setItem(data);
        const similar = await fetchEquipment({
          category: data.category,
          limit: 6,
        });
        if (cancelled) return;
        setRelated(similar.items.filter((row) => row._id !== data._id).slice(0, 3));
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 0) {
          // Backend offline: fall back to the bundled demo listing.
          const demo = demoEquipment.find((row) => row._id === params.id);
          if (demo) {
            setItem({
              ...demo,
              title: demo.name,
              image: demo.image || FALLBACK_IMAGE,
            });
          } else {
            setLoadError(
              "The Equiply API is unreachable and this listing is not part of the demo data.",
            );
          }
        } else if (error instanceof ApiError && error.status === 404) {
          setLoadError("This listing does not exist or is no longer available.");
        } else {
          setLoadError(errorMessage(error));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function requestBooking() {
    setMessage("");
    setBooked(false);

    if (!start || !end) {
      setMessage("Please choose both rental dates.");
      return;
    }
    if (start < minStart) {
      setMessage("The start date must be at least tomorrow.");
      return;
    }
    if (end <= start) {
      setMessage("The end date must be after the start date.");
      return;
    }
    if (status === "unauthenticated") {
      router.push(`/login?next=${encodeURIComponent(`/equipment/${params.id}`)}`);
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        equipmentId: params.id,
        startDate: start,
        endDate: end,
      });
      setBooked(true);
      setMessageKind("success");
      setMessage(
        "Booking request sent! Pay to confirm your dates, then the owner approves the rental.",
      );
    } catch (error) {
      setMessageKind("error");
      setMessage(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingPage label="Loading equipment…" />;

  if (loadError || !item) {
    return (
      <div className="wrap section" style={{ maxWidth: 720 }}>
        <div className="card empty">
          <span className="empty-icon">
            <PackageSearch size={30} />
          </span>
          <h1 className="h3">Listing not found</h1>
          <p className="muted" style={{ maxWidth: 460, margin: 0 }}>
            {loadError || "This equipment listing could not be found."}
          </p>
          <Link className="btn" href="/equipment">
            Browse equipment
          </Link>
        </div>
      </div>
    );
  }

  const days = start && end ? daysBetween(start, end) : 0;
  const total = days * item.price;
  const unit = rentalUnit(item.rentalType);

  return (
    <div className="wrap section">
      <Link
        href="/equipment"
        className="muted"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          fontWeight: 650,
          fontSize: 14,
        }}
      >
        <ArrowLeft size={16} /> Back to marketplace
      </Link>

      <div className="detailsgrid" style={{ marginTop: 22 }}>
        <div>
          <img className="detailsimage" src={item.image} alt={item.title} />

          <div className="card card-pad" style={{ marginTop: 22 }}>
            <div className="section-head" style={{ marginBottom: 12 }}>
              <h2 className="h3">About this equipment</h2>
              <span className="badge badge-brand">{item.category}</span>
            </div>
            <p style={{ lineHeight: 1.85, margin: 0, whiteSpace: "pre-line" }}>
              {item.description}
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginTop: 22,
                padding: "14px 16px",
                background: "var(--brand-50)",
                border: "1px solid var(--brand-100)",
                borderRadius: 14,
                color: "var(--brand-700)",
                fontSize: 14,
              }}
            >
              <ShieldCheck size={18} />
              <span>
                Every listing is reviewed by the Equiply team before it goes live on the
                marketplace.
              </span>
            </div>
          </div>

          <div className="card card-pad" style={{ marginTop: 20 }}>
            <h2 className="h3" style={{ marginBottom: 10 }}>
              Listing details
            </h2>
            <div className="spec-row">
              <span>Category</span>
              <strong>{item.category}</strong>
            </div>
            <div className="spec-row">
              <span>Location</span>
              <strong>{item.location}</strong>
            </div>
            <div className="spec-row">
              <span>Rental rate</span>
              <strong>
                {money(item.price)} / {unit}
              </strong>
            </div>
            <div className="spec-row">
              <span>Listed by</span>
              <strong>{item.owner || "Verified Equiply owner"}</strong>
            </div>
            {item.createdAt && (
              <div className="spec-row">
                <span>Listed on</span>
                <strong>{formatDate(item.createdAt)}</strong>
              </div>
            )}
          </div>

          {related.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div className="section-head">
                <div>
                  <div className="eyebrow">You may also like</div>
                  <h2 className="h3" style={{ marginTop: 8 }}>
                    Similar equipment
                  </h2>
                </div>
              </div>
              <div className="grid3">
                {related.map((row) => (
                  <EquipmentCard key={row._id} item={row} />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="eyebrow">{item.category}</div>
          <h1 className="h2" style={{ marginTop: 10 }}>
            {item.title}
          </h1>

          <p
            className="muted"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 14,
              fontSize: 15,
            }}
          >
            <MapPin size={17} /> {item.location}
            {item.rating ? (
              <span>
                · ★ {item.rating} ({item.reviews} reviews)
              </span>
            ) : null}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              margin: "18px 0 4px",
            }}
          >
            <span style={{ fontSize: 40, fontWeight: 850, letterSpacing: "-0.03em" }}>
              {money(item.price)}
            </span>
            <span className="muted">per {unit}</span>
          </div>

          <div className="card card-pad" style={{ marginTop: 20 }}>
            <h2 className="h3" style={{ fontSize: 18 }}>
              Request a rental
            </h2>

            <div className="form-grid" style={{ marginTop: 16 }}>
              <label>
                Start date
                <input
                  className="forminput"
                  type="date"
                  min={minStart}
                  value={start}
                  onChange={(event) => {
                    setStart(event.target.value);
                    setBooked(false);
                    setMessage("");
                  }}
                />
              </label>
              <label>
                End date
                <input
                  className="forminput"
                  type="date"
                  min={start || minStart}
                  value={end}
                  onChange={(event) => {
                    setEnd(event.target.value);
                    setBooked(false);
                    setMessage("");
                  }}
                />
              </label>
            </div>

            {days > 0 && (
              <div className="price-box" style={{ marginTop: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14.5,
                    color: "var(--muted)",
                  }}
                >
                  <span>
                    {days} day{days === 1 ? "" : "s"} × {money(item.price)}
                  </span>
                  <span>Service fee included</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <strong style={{ fontSize: 24, letterSpacing: "-0.02em" }}>
                    {money(total)}
                  </strong>
                  <span className="badge badge-brand">Estimated total</span>
                </div>
              </div>
            )}

            <button
              className="btn btn-block"
              style={{ marginTop: 16 }}
              onClick={requestBooking}
              disabled={submitting || booked}
            >
              {submitting ? (
                <>
                  <Spinner /> Sending request…
                </>
              ) : booked ? (
                <>
                  <CheckCircle2 size={18} /> Request sent
                </>
              ) : (
                <>
                  <CalendarDays size={18} /> Request booking
                </>
              )}
            </button>

            <div style={{ marginTop: 10 }}>
              <FavoriteButton
                item={item}
                withLabel
                className="btn btn-outline btn-block"
              />
            </div>

            {message && (
              <div style={{ marginTop: 14 }}>
                <Notice kind={messageKind === "success" ? "success" : "error"}>
                  {message}
                </Notice>
              </div>
            )}

            {booked && (
              <Link
                className="btn btn-outline btn-block"
                style={{ marginTop: 10 }}
                href="/my-rentals"
              >
                View my rentals
              </Link>
            )}

            <p className="muted" style={{ fontSize: 13, marginTop: 16, lineHeight: 1.6 }}>
              Requests are held for 30 minutes. Complete payment to lock in your dates,
              and the owner confirms the rental.
            </p>
          </div>

          <div
            className="card card-pad"
            style={{ marginTop: 18, display: "flex", gap: 14, alignItems: "center" }}
          >
            <span className="avatar">
              <UserRound size={26} />
            </span>
            <div>
              <strong style={{ display: "block" }}>
                {item.owner || "Verified Equiply owner"}
              </strong>
              <span className="muted" style={{ fontSize: 13.5 }}>
                Usually responds within a few hours
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
