"use client";

// Owner form: submit a new listing to the marketplace for review.

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Send } from "lucide-react";

import { createEquipment, errorMessage } from "@/lib/api";
import { CATEGORIES, FALLBACK_IMAGE, RENTAL_TYPES } from "@/lib/constants";
import { AuthGuard } from "@/components/AuthGuard";
import { Notice, PageHeader, Spinner } from "@/components/ui";

const initialForm = {
  title: "",
  category: "",
  description: "",
  image: "",
  price: "",
  rentalType: "daily",
  location: "",
};

function AddEquipmentContent() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function change(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a rental price greater than zero.");
      return;
    }
    if (form.title.trim().length < 3) {
      setError("The equipment name needs at least 3 characters.");
      return;
    }
    if (form.description.trim().length < 10) {
      setError("Describe the equipment in at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await createEquipment({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: form.location.trim(),
        price,
        rentalType: form.rentalType,
        image: form.image.trim() || FALLBACK_IMAGE,
      });
      router.push("/owner/listings");
    } catch (caught) {
      setError(errorMessage(caught));
      setSubmitting(false);
    }
  }

  return (
    <div className="wrap section">
      <PageHeader
        eyebrow="Owner workspace"
        title="List your equipment"
        description="Fill in the details below. Your listing is sent to the Equiply team for review and appears on the marketplace once approved."
        actions={
          <Link className="btn btn-outline" href="/owner/listings">
            My listings
          </Link>
        }
      />

      <div className="grid2" style={{ alignItems: "start" }}>
        <form className="card card-pad stack" onSubmit={handleSubmit}>
          <label>
            Equipment name
            <input
              required
              maxLength={120}
              value={form.title}
              onChange={(event) => change("title", event.target.value)}
              placeholder="e.g. Compact excavator"
            />
          </label>

          <div className="form-grid">
            <label>
              Category
              <select
                required
                value={form.category}
                onChange={(event) => change("category", event.target.value)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label>
              Location
              <input
                required
                value={form.location}
                onChange={(event) => change("location", event.target.value)}
                placeholder="City or area"
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              required
              minLength={10}
              maxLength={3000}
              rows={5}
              value={form.description}
              onChange={(event) => change("description", event.target.value)}
              placeholder="Describe condition, features, accessories and anything a renter should know…"
            />
          </label>

          <div className="form-grid">
            <label>
              Rental price (USD)
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={form.price}
                onChange={(event) => change("price", event.target.value)}
                placeholder="45"
              />
            </label>

            <label>
              Rental unit
              <select
                value={form.rentalType}
                onChange={(event) => change("rentalType", event.target.value)}
              >
                {RENTAL_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Photo URL{" "}
            <span className="muted" style={{ fontWeight: 400 }}>
              (optional)
            </span>
            <input
              type="url"
              value={form.image}
              onChange={(event) => change("image", event.target.value)}
              placeholder="https://…"
            />
          </label>

          {error && <Notice kind="error">{error}</Notice>}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner /> Submitting…
                </>
              ) : (
                <>
                  <Send size={17} /> Submit for review
                </>
              )}
            </button>
            <Link className="btn btn-outline" href="/owner/listings">
              Cancel
            </Link>
          </div>

          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            Listings are reviewed by an admin before they appear in the public
            marketplace.
          </p>
        </form>

        <div className="stack">
          <div className="card" style={{ padding: 0 }}>
            <div
              style={{
                padding: "16px 22px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>Live preview</strong>
              <span className="badge">How renters will see it</span>
            </div>

            <div className="listing-media">
              <img
                src={form.image || FALLBACK_IMAGE}
                alt="Listing preview"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <span className="badge">{form.category || "Category"}</span>
            </div>

            <div className="listing-body">
              <div className="listing-meta">
                <span>{form.location || "Location"}</span>
              </div>
              <h3>{form.title || "Your equipment name"}</h3>
              <p className="muted" style={{ fontSize: 14, margin: 0 }}>
                {form.description || "A clear description helps renters decide faster."}
              </p>
              <div className="listprice">
                <b>
                  ${form.price || "0"}
                  <small>
                    {" "}
                    /{" "}
                    {RENTAL_TYPES.find(
                      (type) => type.value === form.rentalType,
                    )?.label.replace("Per ", "") || "day"}
                  </small>
                </b>
                <span className="badge badge-brand">
                  <ImagePlus size={13} /> Preview
                </span>
              </div>
            </div>
          </div>

          <div className="notice">
            <strong style={{ display: "block", marginBottom: 4 }}>
              What happens next?
            </strong>
            1. Your listing is saved as <b>pending review</b>. 2. An admin approves or
            rejects it. 3. Approved listings appear in the marketplace and accept booking
            requests.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddEquipmentPage() {
  return (
    <AuthGuard require="owner">
      <AddEquipmentContent />
    </AuthGuard>
  );
}
