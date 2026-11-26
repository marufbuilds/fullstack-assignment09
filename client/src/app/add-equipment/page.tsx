"use client";

// Owner form: submit a new listing to the marketplace for review.

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ImagePlus,
  MapPin,
  Package,
  Send,
  ShieldCheck,
  Tag,
} from "lucide-react";

import { createEquipment, errorMessage } from "@/lib/api";
import { CATEGORIES, FALLBACK_IMAGE, RENTAL_TYPES } from "@/lib/constants";

import { AuthGuard } from "@/components/AuthGuard";
import { Spinner } from "@/components/ui";
import { useToast } from "@/lib/toast";

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
  const { showToast } = useToast();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function change(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const price = Number(form.price);

    if (!Number.isFinite(price) || price <= 0) {
      const message = "Enter a rental price greater than zero.";
      setError(message);
      showToast(message, "error");
      return;
    }

    if (form.title.trim().length < 3) {
      const message = "The equipment name needs at least 3 characters.";
      setError(message);
      showToast(message, "error");
      return;
    }

    if (form.description.trim().length < 10) {
      const message = "Describe the equipment in at least 10 characters.";
      setError(message);
      showToast(message, "error");
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

      showToast("Your equipment listing was submitted successfully.", "success");

      window.setTimeout(() => {
        router.push("/owner/listings");
      }, 1200);
    } catch (caught) {
      const message = errorMessage(caught);
      setError(message);
      showToast(message, "error");
      setSubmitting(false);
    }
  }

  const rentalLabel =
    RENTAL_TYPES.find((type) => type.value === form.rentalType)?.label.replace(
      "Per ",
      "",
    ) || "day";

  const previewPrice = form.price
    ? Number(form.price).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : "0";

  const inputClass =
    "h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20";

  const labelClass = "mb-2 block text-sm font-medium text-foreground";

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-[1160px]">
        {/* Header */}
        <div className="mb-9 border-b border-border pb-7">
          <Link
            href="/owner/listings"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to my listings
          </Link>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Owner workspace
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                List your equipment
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Share your equipment with people who need it. Add the details below and
                submit your listing for review.
              </p>
            </div>

            <Link
              href="/owner/listings"
              className="inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-primary transition hover:border-primary hover:bg-accent"
            >
              My listings
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Equipment form */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <Package size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-card-foreground">
                    Equipment details
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete the information about your listing.
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-6 p-6 sm:p-8" onSubmit={handleSubmit}>
              {/* Equipment name */}
              <div>
                <label htmlFor="equipment-title" className={labelClass}>
                  Equipment name <span className="text-destructive">*</span>
                </label>

                <input
                  id="equipment-title"
                  required
                  minLength={3}
                  maxLength={120}
                  value={form.title}
                  onChange={(event) => change("title", event.target.value)}
                  placeholder="e.g. Compact excavator"
                  className={inputClass}
                />
              </div>

              {/* Category and location */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="equipment-category" className={labelClass}>
                    Category <span className="text-destructive">*</span>
                  </label>

                  <div className="relative">
                    <Tag
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <select
                      id="equipment-category"
                      required
                      value={form.category}
                      onChange={(event) => change("category", event.target.value)}
                      className={`${inputClass} appearance-none pl-11`}
                    >
                      <option value="">Select category</option>

                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="equipment-location" className={labelClass}>
                    Location <span className="text-destructive">*</span>
                  </label>

                  <div className="relative">
                    <MapPin
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <input
                      id="equipment-location"
                      required
                      value={form.location}
                      onChange={(event) => change("location", event.target.value)}
                      placeholder="City or area"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="equipment-description" className={labelClass}>
                    Description <span className="text-destructive">*</span>
                  </label>

                  <span className="text-xs text-muted-foreground">
                    {form.description.length}/3000
                  </span>
                </div>

                <textarea
                  id="equipment-description"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={5}
                  value={form.description}
                  onChange={(event) => change("description", event.target.value)}
                  placeholder="Describe condition, features, accessories and anything a renter should know..."
                  className="w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </div>

              {/* Price and rental unit */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="equipment-price" className={labelClass}>
                    Rental price (USD) <span className="text-destructive">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      $
                    </span>

                    <input
                      id="equipment-price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={form.price}
                      onChange={(event) => change("price", event.target.value)}
                      placeholder="45"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="equipment-rental-type" className={labelClass}>
                    Rental unit
                  </label>

                  <select
                    id="equipment-rental-type"
                    value={form.rentalType}
                    onChange={(event) => change("rentalType", event.target.value)}
                    className={inputClass}
                  >
                    {RENTAL_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="equipment-image" className={labelClass}>
                  Equipment photo URL{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </label>

                <div className="relative">
                  <ImagePlus
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    id="equipment-image"
                    type="url"
                    value={form.image}
                    onChange={(event) => change("image", event.target.value)}
                    placeholder="https://example.com/equipment.jpg"
                    className={`${inputClass} pl-11`}
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Add a direct image URL. If you leave this empty, Equiply will use its
                  default equipment image.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Spinner />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Submit for review
                    </>
                  )}
                </button>

                <Link
                  href="/owner/listings"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-semibold text-primary transition hover:border-primary hover:bg-accent"
                >
                  Cancel
                </Link>
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                Your listing will be reviewed by an administrator before appearing in the
                public marketplace.
              </p>
            </form>
          </section>

          {/* Right column */}
          <aside className="space-y-6 lg:sticky lg:top-6">
            {/* Live preview */}
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-semibold text-card-foreground">Live preview</h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Your listing appearance
                  </p>
                </div>

                <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground">
                  Preview
                </span>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={form.image.trim() || FALLBACK_IMAGE}
                  alt="Equipment listing preview"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-full w-full object-cover"
                />

                <span className="absolute left-4 top-4 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur">
                  {form.category || "Category"}
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={14} />
                  {form.location || "Equipment location"}
                </div>

                <h3 className="text-xl font-semibold leading-snug text-card-foreground">
                  {form.title || "Your equipment name"}
                </h3>

                <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {form.description ||
                    "A clear description helps renters understand your equipment and decide faster."}
                </p>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-5">
                  <div>
                    <p className="text-xs text-muted-foreground">Rental price</p>

                    <p className="mt-1 text-2xl font-semibold text-primary">
                      ${previewPrice}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        / {rentalLabel}
                      </span>
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                    <ImagePlus size={13} />
                    Listing preview
                  </span>
                </div>
              </div>
            </section>

            {/* Review process */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-card-foreground">
                    What happens next?
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Your listing approval process
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                    1
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-card-foreground">
                      Submit your listing
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Your equipment details are sent to Equiply.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                    2
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-card-foreground">
                      Admin reviews it
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      An administrator approves or rejects the listing.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                    3
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-card-foreground">
                      Start receiving bookings
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Approved equipment appears in the marketplace.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2 rounded-xl border border-border bg-muted p-4">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary" />

                <p className="text-xs leading-5 text-muted-foreground">
                  Your listing starts as pending review. It will become visible to renters
                  after approval.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function AddEquipmentPage() {
  return (
    <AuthGuard require="owner">
      <AddEquipmentContent />
    </AuthGuard>
  );
}
