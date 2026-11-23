 
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Pencil, PlusCircle, Trash2 } from "lucide-react";

import {
  deleteEquipment,
  errorMessage,
  fetchMyListings,
  updateEquipment,
} from "@/lib/api";
import { CATEGORIES, RENTAL_TYPES } from "@/lib/constants";
import { LISTING_STATUS_LABELS, money } from "@/lib/format";
import type { Equipment } from "@/lib/types";
import { AuthGuard } from "@/components/AuthGuard";
import {
  EmptyState,
  ErrorState,
  Notice,
  PageHeader,
  Spinner,
  StatusBadge,
} from "@/components/ui";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  location: "",
  price: "",
  rentalType: "daily",
  image: "",
};

function getRentalUnit(rentalType: string) {
  const rental = RENTAL_TYPES.find((type) => type.value === rentalType);
  return rental?.label || rentalType;
}

function ListingsContent() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [editing, setEditing] = useState<Equipment | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [removingId, setRemovingId] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const listings = await fetchMyListings();
      setItems(listings);
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

  function startEdit(item: Equipment) {
    setEditing(item);
    setSaveError("");
    setNotice("");

    setForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "",
      location: item.location || "",
      price: String(item.price ?? ""),
      rentalType: item.rentalType || "daily",
      image: item.image || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
    setSaveError("");
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editing || saving) return;

    setSaveError("");

    const title = form.title.trim();
    const description = form.description.trim();
    const location = form.location.trim();
    const price = Number(form.price);

    if (title.length < 3) {
      setSaveError("Equipment name must contain at least 3 characters.");
      return;
    }

    if (description.length < 10) {
      setSaveError("Description must contain at least 10 characters.");
      return;
    }

    if (!location) {
      setSaveError("Please enter an equipment location.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setSaveError("Price must be greater than zero.");
      return;
    }

    setSaving(true);

    try {
      await updateEquipment(editing._id, {
        ...form,
        title,
        description,
        location,
        price,
        image: form.image.trim(),
      });

      setEditing(null);
      setForm(emptyForm);

      setNotice(
        "Listing updated successfully. Your changes may require admin review before the listing becomes public again.",
      );

      await load();
    } catch (caught) {
      setSaveError(errorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(item: Equipment) {
    if (removingId) return;

    const confirmed = window.confirm(
      `Remove "${item.title}" from your listings? This cannot be undone.`,
    );

    if (!confirmed) return;

    setRemovingId(item._id);
    setNotice("");

    try {
      await deleteEquipment(item._id);

      setItems((current) =>
        current.filter((row) => row._id !== item._id),
      );

      if (editing?._id === item._id) {
        cancelEdit();
      }

      setNotice(`"${item.title}" was removed successfully.`);
    } catch (caught) {
      setNotice(errorMessage(caught));
    } finally {
      setRemovingId("");
    }
  }

  return (
    <div className="wrap section">
      <PageHeader
        eyebrow="Owner workspace"
        title="My equipment listings"
        description="Manage your equipment, update listing information, track approval status and remove items you no longer want to rent out."
        actions={
          <Link className="btn" href="/add-equipment">
            <PlusCircle size={17} />
            Add equipment
          </Link>
        }
      />

      {notice && (
        <div style={{ marginBottom: 20 }}>
          <Notice kind="success">{notice}</Notice>
        </div>
      )}

      {editing && (
        <form
          className="card card-pad stack"
          style={{ marginBottom: 26 }}
          onSubmit={saveEdit}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <div className="eyebrow">Editing listing</div>

              <h2 className="h3" style={{ marginTop: 6 }}>
                {editing.title}
              </h2>
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={cancelEdit}
              disabled={saving}
            >
              Cancel
            </button>
          </div>

          <div className="form-grid">
            <label className="full">
              Equipment name

              <input
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                required
                minLength={3}
                maxLength={120}
              />
            </label>

            <label>
              Category

              <select
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
                required
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Location

              <input
                value={form.location}
                onChange={(event) =>
                  setForm({ ...form, location: event.target.value })
                }
                required
              />
            </label>

            <label>
              Price (USD)

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                required
              />
            </label>

            <label>
              Rental unit

              <select
                value={form.rentalType}
                onChange={(event) =>
                  setForm({ ...form, rentalType: event.target.value })
                }
                required
              >
                {RENTAL_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="full">
              Description

              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm({
                    ...form,
                    description: event.target.value,
                  })
                }
                required
                minLength={10}
              />
            </label>

            <label className="full">
              Photo URL

              <input
                type="url"
                value={form.image}
                onChange={(event) =>
                  setForm({ ...form, image: event.target.value })
                }
                placeholder="https://example.com/equipment.jpg"
              />
            </label>
          </div>

          {saveError && <Notice kind="error">{saveError}</Notice>}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={cancelEdit}
              disabled={saving}
            >
              Discard
            </button>
          </div>
        </form>
      )}

      {error && (
        <ErrorState
          message={error}
          onRetry={() => void load()}
        />
      )}

      {!error && loading && (
        <div className="stack">
          {[0, 1, 2].map((row) => (
            <div
              className="skeleton"
              key={row}
              style={{ height: 74 }}
            />
          ))}
        </div>
      )}

      {!error && !loading && items.length === 0 && (
        <EmptyState
          icon={<PlusCircle size={30} />}
          title="You have not listed anything yet"
          description="Add your first piece of equipment and start earning from gear that would otherwise sit idle."
          action={
            <Link className="btn" href="/add-equipment">
              Add equipment
            </Link>
          }
        />
      )}

      {!error && !loading && items.length > 0 && (
        <div className="card listingtable">
          <div className="listinghead">
            <span>Equipment</span>
            <span>Category</span>
            <span>Price</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {items.map((item) => (
            <div className="listingrow" key={item._id}>
              <div>
                <strong>{item.title}</strong>

                <small
                  className="muted"
                  style={{
                    display: "block",
                    fontWeight: 400,
                  }}
                >
                  {item.location}
                </small>
              </div>

              <span>{item.category}</span>

              <span>
                {money(item.price)}
                <small className="muted">
                  {" / "}
                  {getRentalUnit(item.rentalType)}
                </small>
              </span>

              <StatusBadge
                status={item.status || "pending"}
                label={
                  LISTING_STATUS_LABELS[item.status || "pending"] ||
                  item.status ||
                  "Pending"
                }
              />

              <div className="adminbuttons">
                <Link
                  className="btn btn-ghost btn-sm"
                  href={`/equipment/${item._id}`}
                  title="View listing"
                  aria-label={`View ${item.title}`}
                >
                  <Eye size={15} />
                </Link>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => startEdit(item)}
                  disabled={Boolean(removingId)}
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => void handleRemove(item)}
                  disabled={Boolean(removingId)}
                  title="Remove listing"
                  aria-label={`Remove ${item.title}`}
                >
                  {removingId === item._id ? (
                    <Spinner />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OwnerListingsPage() {
  return (
    <AuthGuard require="owner">
      <ListingsContent />
    </AuthGuard>
  );
}
