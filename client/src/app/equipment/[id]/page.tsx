 
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Heart,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Navigation,
  PackageSearch,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";

import {
  ApiError,
  createBooking,
  errorMessage,
  fetchEquipment,
  fetchEquipmentById,
  startCheckout,
} from "@/lib/api";

import { FALLBACK_IMAGE } from "@/lib/constants";
import { demoEquipment } from "@/lib/demo-equipment";
import { useAuth } from "@/lib/auth";
import { daysBetween, formatDate, money, rentalUnit } from "@/lib/format";

import type { Equipment } from "@/lib/types";

import { FavoriteButton } from "@/components/FavoriteButton";
import { EquipmentCard } from "@/components/EquipmentCard";
import { LoadingPage } from "@/components/ui";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

type EquipmentWithContact = Equipment & {
  ownerPhone?: string;
  contactPhone?: string;
  phone?: string;
  address?: string;
  ownerAddress?: string;
  images?: string[];
  gallery?: string[];
  imageUrls?: string[];
};

function getTomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getEquipmentImages(item: EquipmentWithContact) {
  const images = [
    item.image,
    ...(item.images || []),
    ...(item.gallery || []),
    ...(item.imageUrls || []),
  ].filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0
  );

  return [...new Set(images)].slice(0, 3);
}

export default function EquipmentDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useAuth();

  const [item, setItem] = useState<EquipmentWithContact | null>(null);
  const [related, setRelated] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedImage, setSelectedImage] = useState("");

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"success" | "error">("error");

  const [bookingId, setBookingId] = useState("");

  const minStart = getTomorrowDate();

  useEffect(() => {
    let cancelled = false;

    async function loadEquipment() {
      setLoading(true);
      setLoadError("");

      try {
        const data = await fetchEquipmentById(params.id);

        if (cancelled) return;

        const equipment = data as EquipmentWithContact;

        setItem(equipment);
        setSelectedImage(equipment.image || FALLBACK_IMAGE);

        const similar = await fetchEquipment({
          category: data.category,
          limit: 6,
        });

        if (cancelled) return;

        setRelated(
          similar.items
            .filter((row) => row._id !== data._id)
            .slice(0, 3)
        );
      } catch (error) {
        if (cancelled) return;

        if (error instanceof ApiError && error.status === 0) {
          const demo = demoEquipment.find((row) => row._id === params.id);

          if (demo) {
            const demoItem = {
              ...demo,
              title: demo.name,
              image: demo.image || FALLBACK_IMAGE,
            } as EquipmentWithContact;

            setItem(demoItem);
            setSelectedImage(demoItem.image || FALLBACK_IMAGE);
          } else {
            setLoadError(
              "The Equiply API is unreachable and this listing is not part of the demo data."
            );
          }
        } else if (error instanceof ApiError && error.status === 404) {
          setLoadError(
            "This listing does not exist or is no longer available."
          );
        } else {
          setLoadError(errorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadEquipment();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function requestBooking() {
    setMessage("");

    if (!start || !end) {
      setMessage("Please choose both rental dates.");
      setMessageKind("error");
      return;
    }

    if (start < minStart) {
      setMessage("The start date must be at least tomorrow.");
      setMessageKind("error");
      return;
    }

    if (end <= start) {
      setMessage("The end date must be after the start date.");
      setMessageKind("error");
      return;
    }

    const cleanedPhone = customerPhone.trim();
    const phoneDigits = cleanedPhone.replace(/\D/g, "");

    if (!cleanedPhone) {
      setMessage("Please enter your phone number.");
      setMessageKind("error");
      return;
    }

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setMessage("Please enter a valid phone number.");
      setMessageKind("error");
      return;
    }

    if (status === "unauthenticated") {
      router.push(
        `/login?next=${encodeURIComponent(`/equipment/${params.id}`)}`
      );
      return;
    }

    if (status === "loading") {
      setMessage("Please wait while we check your account.");
      setMessageKind("error");
      return;
    }

    setSubmitting(true);

    try {
      let currentBookingId = bookingId;

      if (!currentBookingId) {
        const booking = await createBooking({
          equipmentId: params.id,
          startDate: start,
          endDate: end,
          phone: cleanedPhone,
        });

        if (!booking?._id) {
          throw new Error(
            "The server did not return a booking ID. Please check your rentals before trying again."
          );
        }

        currentBookingId = booking._id;
        setBookingId(currentBookingId);
      }

      setMessage("Booking created. Preparing secure payment...");
      setMessageKind("success");

      const checkoutUrl = await startCheckout(currentBookingId);

      if (!checkoutUrl) {
        throw new Error(
          "The payment service did not return a checkout URL."
        );
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      setMessageKind("error");

      if (bookingId) {
        setMessage(
          `Your booking has been created, but payment could not start. You can retry payment. ${errorMessage(error)}`
        );
      } else {
        setMessage(errorMessage(error));
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingPage label="Loading equipment..." />;
  }

  if (loadError || !item) {
    return (
      <main className="min-h-screen bg-[#FFFCFA] px-4 py-16">
        <div className="mx-auto max-w-xl">
          <Card className="rounded-2xl border-[#E8DFD6] shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
              <div className="rounded-full bg-[#F5EEE8] p-5">
                <PackageSearch className="h-9 w-9 text-[#79563E]" />
              </div>

              <h1 className="text-2xl font-semibold text-[#292723]">
                Listing not found
              </h1>

              <p className="max-w-md text-sm leading-6 text-[#82776D]">
                {loadError || "This equipment listing could not be found."}
              </p>

              <Link
                href="/equipment"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#79563E] px-5 text-sm font-semibold text-white transition hover:bg-[#62432F]"
              >
                Browse equipment
                <ArrowRight size={16} />
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const galleryImages = getEquipmentImages(item);
  const mainImage = selectedImage || galleryImages[0] || FALLBACK_IMAGE;

  const days =
    start && end && end > start ? daysBetween(start, end) : 0;

  const total = days * item.price;
  const unit = rentalUnit(item.rentalType);

  const contactPhone =
    item.ownerPhone || item.contactPhone || item.phone;

  const location =
    item.address || item.ownerAddress || item.location;

  const mapUrl = location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    : null;

  return (
    <main className="min-h-screen bg-[#FFFCFA] text-[#292723]">
      <div className="mx-auto max-w-[1280px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">

        {/* Breadcrumb */}
        <Link
          href="/equipment"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#82776D] transition hover:text-[#79563E]"
        >
          <ArrowLeft size={17} />
          Back to marketplace
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">

          {/* Main content */}
          <div className="min-w-0 space-y-7">

            {/* Equipment gallery */}
            <section className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.65fr_1fr]">
                <div className="group relative min-h-[280px] overflow-hidden rounded-2xl bg-[#F5EEE8] sm:min-h-[440px]">
                  <img
                    src={mainImage}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />

                  <div className="absolute left-4 top-4">
                    <Badge className="border-0 bg-white px-3 py-1.5 text-[#79563E] shadow-sm hover:bg-white">
                      {item.category}
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                      Main equipment photo
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                  {[1, 2].map((slot) => {
                    const image = galleryImages[slot];

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={!image}
                        onClick={() => image && setSelectedImage(image)}
                        className={`group relative min-h-[135px] overflow-hidden rounded-2xl bg-[#F5EEE8] text-left sm:min-h-0 ${
                          image ? "cursor-pointer" : "cursor-default"
                        }`}
                        aria-label={
                          image
                            ? `Show equipment photo ${slot + 1}`
                            : `Equipment photo ${slot + 1} unavailable`
                        }
                      >
                        {image ? (
                          <>
                            <img
                              src={image}
                              alt={`${item.title} photo ${slot + 1}`}
                              className={`absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
                                mainImage === image
                                  ? "ring-4 ring-inset ring-[#79563E]"
                                  : ""
                              }`}
                            />
                            <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                              Photo {slot + 1}
                            </span>
                          </>
                        ) : (
                          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#9A8D80]">
                            <ImageIcon size={27} />
                            <span className="text-xs font-medium">
                              No additional photo
                            </span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        mainImage === image
                          ? "border-[#79563E] opacity-100"
                          : "border-transparent opacity-65 hover:opacity-100"
                      }`}
                      aria-label={`Select equipment image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${item.title} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Equipment title */}
            <section className="rounded-2xl border border-[#E8DFD6] bg-white p-5 shadow-[0_4px_24px_rgba(60,40,20,0.035)] sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-3">
                  <Badge className="border-0 bg-[#F5EEE8] text-[#79563E] hover:bg-[#F5EEE8]">
                    Equipment rental
                  </Badge>

                  <h1 className="text-2xl font-semibold tracking-tight text-[#292723] sm:text-4xl">
                    {item.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#82776D]">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-[#9A7656]" />
                      {location || "Location not provided"}
                    </span>

                    {item.rating ? (
                      <span className="flex items-center gap-1.5">
                        <Star size={15} className="fill-amber-400 text-amber-400" />
                        <strong className="text-[#292723]">
                          {item.rating}
                        </strong>
                        <span>({item.reviews || 0} reviews)</span>
                      </span>
                    ) : null}
                  </div>
                </div>

                <FavoriteButton
                  item={item}
                  withLabel
                  className="shrink-0"
                />
              </div>

              <Separator className="my-6 bg-[#E8DFD6]" />

              <div className="flex flex-wrap items-end gap-2">
                <span className="text-3xl font-semibold tracking-tight text-[#79563E] sm:text-4xl">
                  {money(item.price)}
                </span>
                <span className="pb-1 text-sm text-[#82776D]">
                  / {unit}
                </span>
              </div>
            </section>

            {/* Description */}
            <Card className="rounded-2xl border-[#E8DFD6] shadow-[0_4px_24px_rgba(60,40,20,0.035)]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#292723]">
                  About this equipment
                </CardTitle>
                <CardDescription className="text-[#82776D]">
                  Everything you need to know before renting.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="whitespace-pre-line text-sm leading-7 text-[#82776D] sm:text-base">
                  {item.description ||
                    "No description has been provided for this equipment."}
                </p>
              </CardContent>
            </Card>

            {/* Equipment information */}
            <Card className="rounded-2xl border-[#E8DFD6] shadow-[0_4px_24px_rgba(60,40,20,0.035)]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#292723]">
                  Equipment information
                </CardTitle>
                <CardDescription className="text-[#82776D]">
                  Important details about this listing.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    label: "Category",
                    value: item.category,
                    icon: PackageSearch,
                  },
                  {
                    label: "Location",
                    value: location || "Not provided",
                    icon: MapPin,
                  },
                  {
                    label: "Rental type",
                    value: unit,
                    icon: CalendarDays,
                  },
                  {
                    label: "Listed by",
                    value: item.owner || "Equiply owner",
                    icon: UserRound,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="rounded-xl bg-[#F5EEE8] p-3 text-[#79563E]">
                      <Icon size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-[#9A8D80]">{label}</p>
                      <p className="mt-1 font-semibold text-[#443B34]">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}

                {item.createdAt && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="rounded-xl bg-[#F5EEE8] p-3 text-[#79563E]">
                      <Clock3 size={19} />
                    </div>
                    <div>
                      <p className="text-sm text-[#9A8D80]">Listed on</p>
                      <p className="mt-1 font-semibold text-[#443B34]">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="rounded-2xl border-[#E8DFD6] shadow-[0_4px_24px_rgba(60,40,20,0.035)]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#292723]">
                  Equipment location
                </CardTitle>
                <CardDescription className="text-[#82776D]">
                  Find out where this equipment is available.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl bg-[#F8F3EE] p-4">
                  <MapPin size={19} className="mt-0.5 shrink-0 text-[#79563E]" />
                  <div className="min-w-0">
                    <p className="font-medium text-[#443B34]">
                      {location || "Location not provided"}
                    </p>
                    <p className="mt-1 text-sm text-[#82776D]">
                      Contact the owner to confirm the exact pickup location.
                    </p>
                  </div>
                </div>

                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E8DFD6] bg-white px-4 text-sm font-semibold text-[#79563E] transition hover:bg-[#F8F3EE]"
                  >
                    <Navigation size={16} />
                    View on Google Maps
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Owner contact */}
            <Card className="rounded-2xl border-[#E8DFD6] shadow-[0_4px_24px_rgba(60,40,20,0.035)]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#292723]">
                  Contact the owner
                </CardTitle>
                <CardDescription className="text-[#82776D]">
                  Have questions? Contact the equipment owner.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5EEE8] text-[#79563E]">
                      <UserRound size={22} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#443B34]">
                        {item.owner || "Equipment owner"}
                      </p>
                      <p className="text-sm text-[#82776D]">
                        Equipment provider
                      </p>
                    </div>
                  </div>

                  {contactPhone ? (
                    <a
                      href={`tel:${contactPhone}`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#79563E] px-4 text-sm font-semibold text-white transition hover:bg-[#62432F]"
                    >
                      <Phone size={16} />
                      Call owner
                    </a>
                  ) : (
                    <p className="text-sm text-[#82776D]">
                      Phone number unavailable
                    </p>
                  )}
                </div>

                {contactPhone && (
                  <p className="mt-4 text-sm text-[#82776D]">
                    Contact number:{" "}
                    <a
                      href={`tel:${contactPhone}`}
                      className="font-semibold text-[#79563E] hover:underline"
                    >
                      {contactPhone}
                    </a>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Safety note */}
            <Alert className="border-[#E8DFD6] bg-[#F8F3EE] text-[#79563E]">
              <ShieldCheck size={19} className="text-[#79563E]" />
              <AlertDescription className="ml-2 text-sm leading-6 text-[#82776D]">
                Before renting, confirm the equipment condition, pickup
                location, and rental terms with the owner.
              </AlertDescription>
            </Alert>

            {/* Related equipment */}
            {related.length > 0 && (
              <section className="space-y-5 pt-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7656]">
                    More to explore
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#292723]">
                    Similar equipment
                  </h2>
                  <p className="mt-1 text-sm text-[#82776D]">
                    You might also be interested in these listings.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {related.map((row) => (
                    <EquipmentCard key={row._id} item={row} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Booking sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-6">
            <Card className="overflow-hidden rounded-2xl border-[#E8DFD6] shadow-[0_8px_32px_rgba(60,40,20,0.07)]">
              <div className="h-1.5 bg-[#79563E]" />

              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <Badge className="border-0 bg-[#F5EEE8] text-[#79563E] hover:bg-[#F5EEE8]">
                    Book this equipment
                  </Badge>

                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#82776D]">
                    <span className="h-2 w-2 rounded-full bg-[#9A7656]" />
                    Request available
                  </span>
                </div>

                <CardTitle className="pt-2 text-2xl font-semibold text-[#292723]">
                  Rental details
                </CardTitle>

                <CardDescription className="text-[#82776D]">
                  Choose your dates and enter your contact details.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-[#79563E]">
                    {money(item.price)}
                  </span>
                  <span className="pb-1 text-sm text-[#82776D]">
                    / {unit}
                  </span>
                </div>

                <Separator className="bg-[#E8DFD6]" />

                {/* Start date */}
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-[#443B34]">
                    Start rental date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    min={minStart}
                    value={start}
                    onChange={(event) => {
                      setStart(event.target.value);
                      setMessage("");
                    }}
                    className="h-11 rounded-xl border-[#E8DFD6] focus-visible:ring-[#79563E]"
                  />
                </div>

                {/* End date */}
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-[#443B34]">
                    End rental date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    min={start || minStart}
                    value={end}
                    onChange={(event) => {
                      setEnd(event.target.value);
                      setMessage("");
                    }}
                    className="h-11 rounded-xl border-[#E8DFD6] focus-visible:ring-[#79563E]"
                  />
                </div>

                {/* Customer information */}
                <div className="space-y-4 rounded-xl border border-[#E8DFD6] bg-[#FFFCFA] p-4">
                  <div>
                    <h3 className="font-semibold text-[#443B34]">
                      Customer information
                    </h3>
                    <p className="mt-1 text-xs text-[#82776D]">
                      Enter your contact details for this rental request.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer-phone" className="text-[#443B34]">
                      Your phone number
                      <span className="text-red-500"> *</span>
                    </Label>

                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8D80]"
                      />
                      <Input
                        id="customer-phone"
                        type="tel"
                        placeholder="+880 1XXXXXXXXX"
                        value={customerPhone}
                        onChange={(event) => {
                          setCustomerPhone(event.target.value);
                          setMessage("");
                        }}
                        className="h-11 rounded-xl border-[#E8DFD6] pl-10 focus-visible:ring-[#79563E]"
                        autoComplete="tel"
                        required
                      />
                    </div>

                    <p className="text-xs leading-5 text-[#9A8D80]">
                      The equipment owner can use this number to contact you.
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 rounded-xl bg-[#F8F3EE] p-4">
                  <MapPin size={19} className="mt-0.5 shrink-0 text-[#79563E]" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#9A8D80]">
                      Equipment location
                    </p>
                    <p className="mt-1 font-semibold text-[#443B34]">
                      {location || "Location not provided"}
                    </p>

                    {mapUrl && (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#79563E] hover:underline"
                      >
                        <Navigation size={14} />
                        View on Google Maps
                      </a>
                    )}
                  </div>
                </div>

                {/* Estimated total */}
                {days > 0 && (
                  <div className="space-y-3 rounded-xl bg-[#F5EEE8] p-4">
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-[#82776D]">
                        {days} day{days === 1 ? "" : "s"} × {money(item.price)}
                      </span>
                      <span className="font-medium text-[#443B34]">
                        {money(total)}
                      </span>
                    </div>

                    <Separator className="bg-[#E8DFD6]" />

                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-[#443B34]">
                        Estimated total
                      </span>
                      <span className="text-xl font-semibold text-[#79563E]">
                        {money(total)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Booking button */}
                <Button
                  className="h-12 w-full gap-2 rounded-xl bg-[#79563E] text-base font-semibold text-white hover:bg-[#62432F]"
                  onClick={requestBooking}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      {bookingId
                        ? "Preparing payment..."
                        : "Creating booking..."}
                    </>
                  ) : bookingId ? (
                    <>
                      <CreditCard size={17} />
                      Retry payment
                    </>
                  ) : (
                    <>
                      <CalendarDays size={17} />
                      Book and pay
                    </>
                  )}
                </Button>

                {/* Booking feedback */}
                {message && (
                  <Alert
                    variant={
                      messageKind === "success" ? "default" : "destructive"
                    }
                    className={
                      messageKind === "success"
                        ? "border-[#E8DFD6] bg-[#F8F3EE] text-[#79563E]"
                        : ""
                    }
                  >
                    {messageKind === "success" && (
                      <CheckCircle2 size={16} />
                    )}
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                {bookingId && (
                  <Link
                    href="/my-rentals"
                    className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#E8DFD6] bg-white px-4 text-sm font-semibold text-[#79563E] transition hover:bg-[#F8F3EE]"
                  >
                    View my rentals
                  </Link>
                )}

                <Separator className="bg-[#E8DFD6]" />

                <div className="space-y-3 text-sm text-[#82776D]">
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#79563E]" />
                    <span>Submit your rental request through Equiply.</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <CreditCard size={16} className="mt-0.5 shrink-0 text-[#79563E]" />
                    <span>
                      Secure payment is handled through Stripe Checkout.
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock3 size={16} className="mt-0.5 shrink-0 text-[#79563E]" />
                    <span>
                      The owner can confirm the requested rental dates.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner summary */}
            <Card className="rounded-2xl border-[#E8DFD6] shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5EEE8] text-[#79563E]">
                  <UserRound size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#443B34]">
                    {item.owner || "Equipment owner"}
                  </p>
                  <p className="text-xs text-[#82776D]">
                    Equipment provider
                  </p>
                </div>

                {contactPhone && (
                  <a
                    href={`tel:${contactPhone}`}
                    aria-label="Call equipment owner"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8DFD6] bg-white text-[#79563E] transition hover:bg-[#F8F3EE]"
                  >
                    <Phone size={16} />
                  </a>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
