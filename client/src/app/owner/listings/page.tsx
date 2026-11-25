 
"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  Eye,
  Pencil,
  PlusCircle,
  Trash2,
  Package,
  MapPin,
  ArrowUpRight,
  X,
  Save,
} from "lucide-react";

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

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
    setSaveError("");
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
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
        "Listing updated successfully. Your changes may require admin review before the listing becomes public again."
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
      `Remove "${item.title}" from your listings? This cannot be undone.`
    );

    if (!confirmed) return;

    setRemovingId(item._id);
    setNotice("");

    try {
      await deleteEquipment(item._id);

      setItems((current) =>
        current.filter((row) => row._id !== item._id)
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
    <main className="min-h-screen bg-[#FFFCFA] px-4 py-8 text-[#292723] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1250px]">

        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-[#9A7656]">
              Owner workspace
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              My equipment listings
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#82776D]">
              Manage your equipment, update listing information, track
              approval status and remove items you no longer want to rent out.
            </p>
          </div>

          <Link
            href="/add-equipment"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#79563E] px-5 text-sm font-semibold text-white transition hover:bg-[#62432F]"
          >
            <PlusCircle size={17} />
            Add equipment
          </Link>
        </div>

        {/* Notice */}
        {notice && (
          <div className="mb-6">
            <Notice kind="success">{notice}</Notice>
          </div>
        )}

        {/* Edit form */}
        {editing && (
          <form
            onSubmit={saveEdit}
            className="mb-8 rounded-3xl border border-[#E8DFD6] bg-white p-5 shadow-[0_8px_30px_rgba(60,40,20,0.04)] sm:p-8"
          >
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#9A7656]">
                  Update your equipment
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {editing.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E8DFD6] px-3 text-xs font-semibold text-[#82776D] transition hover:bg-[#F8F3EE] disabled:opacity-50"
              >
                <X size={15} />
                Close
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Equipment name */}
              <div className="sm:col-span-2">
                <label htmlFor="title" className="mb-2 block text-xs font-semibold text-[#463B32]">
                  Equipment name
                </label>

                <input
                  id="title"
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  required
                  minLength={3}
                  maxLength={120}
                  className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 text-sm outline-none focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="mb-2 block text-xs font-semibold text-[#463B32]">
                  Category
                </label>

                <select
                  id="category"
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  required
                  className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 text-sm outline-none focus:border-[#79563E]"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="mb-2 block text-xs font-semibold text-[#463B32]">
                  Location
                </label>

                <input
                  id="location"
                  value={form.location}
                  onChange={(event) =>
                    setForm({ ...form, location: event.target.value })
                  }
                  required
                  className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 text-sm outline-none focus:border-[#79563E]"
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="mb-2 block text-xs font-semibold text-[#463B32]">
                  Price (USD)
                </label>

                <input
                  id="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                  required
                  className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 text-sm outline-none focus:border-[#79563E]"
                />
              </div>

              {/* Rental type */}
              <div>
                <label htmlFor="rentalType" className="mb-2 block text-xs font-semibold text-[#463B32]">
                  Rental unit
                </label>

                <select
                  id="rentalType"
                  value={form.rentalType}
                  onChange={(event) =>
                    setForm({ ...form, rentalType: event.target.value })
                  }
                  required
                  className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 text-sm outline-none focus:border-[#79563E]"
                >
                  {RENTAL_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label htmlFor="description" className="mb-2 block text-xs font-semibold text-[#463B32]">
                  Description
                </label>

                <textarea
                  id="description"
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
                  className="w-full resize-y rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 py-3 text-sm outline-none focus:border-[#79563E]"
                />
              </div>

              {/* Image URL */}
              <div className="sm:col-span-2">
                <label htmlFor="image" className="mb-2 block text-xs font-semibold text-[#463B32]">
                  Photo URL
                </label>

                <input
                  id="image"
                  type="url"
                  value={form.image}
                  onChange={(event) =>
                    setForm({ ...form, image: event.target.value })
                  }
                  placeholder="https://example.com/equipment.jpg"
                  className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 text-sm outline-none focus:border-[#79563E]"
                />
              </div>
            </div>

            {saveError && (
              <div className="mt-5">
                <Notice kind="error">{saveError}</Notice>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#79563E] px-5 text-sm font-semibold text-white transition hover:bg-[#62432F] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Spinner />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save changes
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="h-11 rounded-xl border border-[#E8DFD6] px-5 text-sm font-semibold text-[#82776D] transition hover:bg-[#F8F3EE] disabled:opacity-50"
              >
                Discard
              </button>
            </div>
          </form>
        )}

        {/* Error */}
        {error && (
          <ErrorState
            message={error}
            onRetry={() => void load()}
          />
        )}

        {/* Loading */}
        {!error && loading && (
          <div className="grid gap-4">
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className="h-24 animate-pulse rounded-2xl border border-[#E8DFD6] bg-white"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!error && !loading && items.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#DCCFC2] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8F3EE] text-[#79563E]">
              <Package size={30} />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              You have not listed anything yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#82776D]">
              Add your first piece of equipment and start earning from gear
              that would otherwise sit idle.
            </p>

            <Link
              href="/add-equipment"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#79563E] px-5 text-sm font-semibold text-white transition hover:bg-[#62432F]"
            >
              <PlusCircle size={17} />
              Add your first listing
            </Link>
          </div>
        )}

        {/* Listings */}
        {!error && !loading && items.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-[#E8DFD6] bg-white shadow-[0_8px_30px_rgba(60,40,20,0.035)]">

            {/* Table heading */}
            <div className="hidden grid-cols-[minmax(200px,1.6fr)_1fr_1fr_1fr_auto] gap-4 border-b border-[#E8DFD6] bg-[#F8F3EE] px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#82776D] lg:grid">
              <span>Equipment</span>
              <span>Category</span>
              <span>Price</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {items.map((item) => (
              <div
                key={item._id}
                className="grid gap-4 border-b border-[#F0EAE4] px-5 py-5 last:border-b-0 sm:px-6 lg:grid-cols-[minmax(200px,1.6fr)_1fr_1fr_1fr_auto] lg:items-center"
              >
                {/* Equipment */}
                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8F3EE] text-[#79563E]">
                      <Package size={20} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[#292723]">
                        {item.title}
                      </h3>

                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#82776D]">
                        <MapPin size={12} />
                        {item.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between lg:block">
                  <span className="text-xs text-[#A0968D] lg:hidden">
                    Category
                  </span>
                  <span className="text-sm text-[#463B32]">
                    {item.category}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between lg:block">
                  <span className="text-xs text-[#A0968D] lg:hidden">
                    Price
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-[#292723]">
                      {money(item.price)}
                    </span>

                    <span className="text-xs text-[#82776D]">
                      {" / "}
                      {getRentalUnit(item.rentalType)}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between lg:block">
                  <span className="text-xs text-[#A0968D] lg:hidden">
                    Status
                  </span>

                  <StatusBadge
                    status={item.status || "pending"}
                    label={
                      LISTING_STATUS_LABELS[item.status || "pending"] ||
                      item.status ||
                      "Pending"
                    }
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 border-t border-[#F0EAE4] pt-4 lg:border-0 lg:pt-0">
                  <Link
                    href={`/equipment/${item._id}`}
                    title="View listing"
                    aria-label={`View ${item.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8DFD6] text-[#79563E] transition hover:bg-[#F8F3EE]"
                  >
                    <Eye size={15} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    disabled={Boolean(removingId)}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E8DFD6] px-3 text-xs font-semibold text-[#79563E] transition hover:bg-[#F8F3EE] disabled:opacity-50"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleRemove(item)}
                    disabled={Boolean(removingId)}
                    title="Remove listing"
                    aria-label={`Remove ${item.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8DFD6] text-[#A15D4B] transition hover:border-[#A15D4B] hover:bg-[#FBF2EF] disabled:opacity-50"
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

        {/* Bottom note */}
        {!error && !loading && items.length > 0 && (
          <p className="mt-5 text-xs leading-5 text-[#9A8D81]">
            Listing changes may require administrator review before your
            equipment becomes publicly available again.
          </p>
        )}
      </div>
    </main>
  );
}

export default function OwnerListingsPage() {
  return (
    <AuthGuard require="owner">
      <ListingsContent />
    </AuthGuard>
  );
}
