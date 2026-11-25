 
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
import {
  CATEGORIES,
  FALLBACK_IMAGE,
  RENTAL_TYPES,
} from "@/lib/constants";

import { AuthGuard } from "@/components/AuthGuard";
import { Notice, Spinner } from "@/components/ui";

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

  const rentalLabel =
    RENTAL_TYPES.find((type) => type.value === form.rentalType)
      ?.label.replace("Per ", "") || "day";

  const previewPrice = form.price
    ? Number(form.price).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : "0";

  return (
    <main className="min-h-screen bg-[#FFFCFA] px-4 py-8 text-[#292723] sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-[1160px]">

        {/* Header */}
        <div className="mb-9 border-b border-[#E8DFD6] pb-7">
          <Link
            href="/owner/listings"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#82776D] transition hover:text-[#79563E]"
          >
            <ArrowLeft size={16} />
            Back to my listings
          </Link>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A7656]">
                Owner workspace
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-[#292723] sm:text-4xl">
                List your equipment
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#82776D] sm:text-base">
                Share your equipment with people who need it.
                Add the details below and submit your listing for review.
              </p>
            </div>

            <Link
              href="/owner/listings"
              className="inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-[#E8DFD6] bg-white px-5 text-sm font-semibold text-[#79563E] transition hover:border-[#79563E] hover:bg-[#F8F3EE]"
            >
              My listings
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">

          {/* Equipment form */}
          <section className="overflow-hidden rounded-2xl border border-[#E8DFD6] bg-white shadow-[0_4px_24px_rgba(60,40,20,0.035)]">

            <div className="border-b border-[#E8DFD6] px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EEE8] text-[#79563E]">
                  <Package size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#292723]">
                    Equipment details
                  </h2>

                  <p className="mt-1 text-xs text-[#82776D]">
                    Complete the information about your listing.
                  </p>
                </div>
              </div>
            </div>

            <form
              className="space-y-6 p-6 sm:p-8"
              onSubmit={handleSubmit}
            >
              {/* Equipment name */}
              <div>
                <label
                  htmlFor="equipment-title"
                  className="mb-2 block text-sm font-medium text-[#443B34]"
                >
                  Equipment name <span className="text-[#A46D50]">*</span>
                </label>

                <input
                  id="equipment-title"
                  required
                  minLength={3}
                  maxLength={120}
                  value={form.title}
                  onChange={(event) =>
                    change("title", event.target.value)
                  }
                  placeholder="e.g. Compact excavator"
                  className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 text-sm text-[#292723] outline-none transition placeholder:text-[#A99D92] focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
                />
              </div>

              {/* Category and location */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="equipment-category"
                    className="mb-2 block text-sm font-medium text-[#443B34]"
                  >
                    Category <span className="text-[#A46D50]">*</span>
                  </label>

                  <div className="relative">
                    <Tag
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8D80]"
                    />

                    <select
                      id="equipment-category"
                      required
                      value={form.category}
                      onChange={(event) =>
                        change("category", event.target.value)
                      }
                      className="h-12 w-full appearance-none rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] pl-11 pr-4 text-sm text-[#443B34] outline-none transition focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
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
                  <label
                    htmlFor="equipment-location"
                    className="mb-2 block text-sm font-medium text-[#443B34]"
                  >
                    Location <span className="text-[#A46D50]">*</span>
                  </label>

                  <div className="relative">
                    <MapPin
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8D80]"
                    />

                    <input
                      id="equipment-location"
                      required
                      value={form.location}
                      onChange={(event) =>
                        change("location", event.target.value)
                      }
                      placeholder="City or area"
                      className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] pl-11 pr-4 text-sm text-[#292723] outline-none transition placeholder:text-[#A99D92] focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="equipment-description"
                    className="block text-sm font-medium text-[#443B34]"
                  >
                    Description <span className="text-[#A46D50]">*</span>
                  </label>

                  <span className="text-xs text-[#A99D92]">
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
                  onChange={(event) =>
                    change("description", event.target.value)
                  }
                  placeholder="Describe condition, features, accessories and anything a renter should know..."
                  className="w-full resize-y rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 py-3 text-sm leading-6 text-[#292723] outline-none transition placeholder:text-[#A99D92] focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
                />
              </div>

              {/* Price and rental unit */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="equipment-price"
                    className="mb-2 block text-sm font-medium text-[#443B34]"
                  >
                    Rental price (USD){" "}
                    <span className="text-[#A46D50]">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#9A8D80]">
                      $
                    </span>

                    <input
                      id="equipment-price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={form.price}
                      onChange={(event) =>
                        change("price", event.target.value)
                      }
                      placeholder="45"
                      className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] pl-9 pr-4 text-sm text-[#292723] outline-none transition placeholder:text-[#A99D92] focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="equipment-rental-type"
                    className="mb-2 block text-sm font-medium text-[#443B34]"
                  >
                    Rental unit
                  </label>

                  <select
                    id="equipment-rental-type"
                    value={form.rentalType}
                    onChange={(event) =>
                      change("rentalType", event.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] px-4 text-sm text-[#443B34] outline-none transition focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
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
                <label
                  htmlFor="equipment-image"
                  className="mb-2 block text-sm font-medium text-[#443B34]"
                >
                  Equipment photo URL{" "}
                  <span className="font-normal text-[#9A8D80]">
                    (optional)
                  </span>
                </label>

                <div className="relative">
                  <ImagePlus
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8D80]"
                  />

                  <input
                    id="equipment-image"
                    type="url"
                    value={form.image}
                    onChange={(event) =>
                      change("image", event.target.value)
                    }
                    placeholder="https://example.com/equipment.jpg"
                    className="h-12 w-full rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] pl-11 pr-4 text-sm text-[#292723] outline-none transition placeholder:text-[#A99D92] focus:border-[#79563E] focus:ring-2 focus:ring-[#79563E]/10"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-[#9A8D80]">
                  Add a direct image URL. If you leave this empty,
                  Equiply will use its default equipment image.
                </p>
              </div>

              {/* Error */}
              {error && (
                <Notice kind="error">{error}</Notice>
              )}

              {/* Submit */}
              <div className="flex flex-col gap-3 border-t border-[#E8DFD6] pt-6 sm:flex-row">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#79563E] px-6 text-sm font-semibold text-white transition hover:bg-[#62432F] disabled:cursor-not-allowed disabled:opacity-60"
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
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-[#E8DFD6] bg-white px-6 text-sm font-semibold text-[#79563E] transition hover:border-[#79563E] hover:bg-[#F8F3EE]"
                >
                  Cancel
                </Link>
              </div>

              <p className="text-xs leading-5 text-[#9A8D80]">
                Your listing will be reviewed by an administrator
                before appearing in the public marketplace.
              </p>
            </form>
          </section>

          {/* Right column */}
          <aside className="space-y-6 lg:sticky lg:top-6">

            {/* Live preview */}
            <section className="overflow-hidden rounded-2xl border border-[#E8DFD6] bg-white shadow-[0_4px_24px_rgba(60,40,20,0.035)]">

              <div className="flex items-center justify-between gap-3 border-b border-[#E8DFD6] px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-semibold text-[#292723]">
                    Live preview
                  </h2>

                  <p className="mt-1 text-xs text-[#82776D]">
                    Your listing appearance
                  </p>
                </div>

                <span className="rounded-full bg-[#F5EEE8] px-3 py-1 text-[11px] font-semibold text-[#79563E]">
                  Preview
                </span>
              </div>

              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F5EEE8]">
                <img
                  src={form.image.trim() || FALLBACK_IMAGE}
                  alt="Equipment listing preview"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-full w-full object-cover"
                />

                <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#79563E] backdrop-blur">
                  {form.category || "Category"}
                </span>
              </div>

              {/* Preview content */}
              <div className="p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-1.5 text-xs text-[#82776D]">
                  <MapPin size={14} />
                  {form.location || "Equipment location"}
                </div>

                <h3 className="text-xl font-semibold leading-snug text-[#292723]">
                  {form.title || "Your equipment name"}
                </h3>

                <p className="mt-3 line-clamp-4 text-sm leading-6 text-[#82776D]">
                  {form.description ||
                    "A clear description helps renters understand your equipment and decide faster."}
                </p>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-[#E8DFD6] pt-5">
                  <div>
                    <p className="text-xs text-[#9A8D80]">
                      Rental price
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-[#79563E]">
                      ${previewPrice}
                      <span className="ml-1 text-xs font-normal text-[#82776D]">
                        / {rentalLabel}
                      </span>
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5EEE8] px-3 py-1.5 text-xs font-medium text-[#79563E]">
                    <ImagePlus size={13} />
                    Listing preview
                  </span>
                </div>
              </div>
            </section>

            {/* Review process */}
            <section className="rounded-2xl border border-[#E8DFD6] bg-white p-6 shadow-[0_4px_24px_rgba(60,40,20,0.035)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EEE8] text-[#79563E]">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-[#292723]">
                    What happens next?
                  </h3>

                  <p className="mt-1 text-xs text-[#82776D]">
                    Your listing approval process
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F5EEE8] text-xs font-semibold text-[#79563E]">
                    1
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#443B34]">
                      Submit your listing
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#82776D]">
                      Your equipment details are sent to Equiply.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F5EEE8] text-xs font-semibold text-[#79563E]">
                    2
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#443B34]">
                      Admin reviews it
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#82776D]">
                      An administrator approves or rejects the listing.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F5EEE8] text-xs font-semibold text-[#79563E]">
                    3
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#443B34]">
                      Start receiving bookings
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#82776D]">
                      Approved equipment appears in the marketplace.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2 rounded-xl border border-[#E8DFD6] bg-[#F8F3EE] p-4">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-[#79563E]"
                />

                <p className="text-xs leading-5 text-[#82776D]">
                  Your listing starts as pending review. It will
                  become visible to renters after approval.
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
