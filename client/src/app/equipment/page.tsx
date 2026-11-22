
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  PackageSearch,
  ArrowRight,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ListFilter,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ApiError,
  errorMessage,
  fetchEquipment,
  normalizeEquipment,
} from "@/lib/api";

import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import { demoEquipment } from "@/lib/demo-equipment";
import type { Equipment, Paginated } from "@/lib/types";

import { EquipmentCard } from "@/components/EquipmentCard";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  Notice,
} from "@/components/ui";

const EMPTY: Paginated<Equipment> = {
  items: [],
  total: 0,
  page: 1,
  pages: 0,
};

function demoResult(
  q: string,
  category: string,
  location: string,
  maxPrice: string,
  sort: string,
): Paginated<Equipment> {
  const term = q.trim().toLowerCase();

  const items = demoEquipment
    .map(normalizeEquipment)
    .filter(
      (item) =>
        (category === "All" || item.category === category) &&
        (!term ||
          `${item.title} ${item.category} ${item.location}`
            .toLowerCase()
            .includes(term)) &&
        (!location ||
          item.location.toLowerCase().includes(location.toLowerCase())) &&
        (!maxPrice || item.price <= Number(maxPrice)),
    );

  if (sort === "price-low") {
    items.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-high") {
    items.sort((a, b) => b.price - a.price);
  }

  return {
    items,
    total: items.length,
    page: 1,
    pages: 1,
  };
}

function EquipmentBrowser() {
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [results, setResults] = useState<Paginated<Equipment>>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(
      async () => {
        setLoading(true);
        setError("");

        try {
          const data = await fetchEquipment({
            search: q || undefined,
            category: category === "All" ? undefined : category,
            location: location || undefined,
            maxPrice: maxPrice || undefined,
            sort,
            page,
            limit: 12,
          });

          if (cancelled) return;

          setResults(data);
          setDemoMode(false);
        } catch (caught) {
          if (cancelled) return;

          if (caught instanceof ApiError && caught.status === 0) {
            setResults(
              demoResult(q, category, location, maxPrice, sort),
            );
            setDemoMode(true);
          } else {
            setError(errorMessage(caught));
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      },
      q || location || maxPrice ? 350 : 0,
    );

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [q, category, location, maxPrice, sort, page, reload]);

  function update(patch: Record<string, string>) {
    if ("category" in patch) setCategory(patch.category);
    if ("location" in patch) setLocation(patch.location);
    if ("maxPrice" in patch) setMaxPrice(patch.maxPrice);
    if ("sort" in patch) setSort(patch.sort);

    setPage(1);
  }

  function clearFilters() {
    setQ("");
    setCategory("All");
    setLocation("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  }

  const hasFilters =
    Boolean(q) ||
    category !== "All" ||
    Boolean(location) ||
    Boolean(maxPrice);

  const activeFilterCount = [
    Boolean(q),
    category !== "All",
    Boolean(location),
    Boolean(maxPrice),
  ].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-[#fffdfb] text-[#292723]">
      {/* Marketplace hero */}

      <section className="relative overflow-hidden bg-[#eee7df]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000&q=85"
            alt="Construction equipment at work"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#211b16]/75" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[2.5px] text-[#e7cdb2]">
              <Sparkles className="h-4 w-4" />
              The Equiply Marketplace
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Find the right equipment.
              <br />
              <span className="text-[#e5cdb3]">
                Get more done.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
              Explore equipment from local owners, compare rental
              prices and find what your next project needs.
            </p>

            <div className="mt-8 flex flex-wrap gap-5 text-xs text-white/80">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#e5cdb3]" />
                Trusted marketplace
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#e5cdb3]" />
                Local equipment owners
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main marketplace content */}

      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 md:px-12 lg:px-16">
        {/* Page heading */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-[#94765b]">
              Explore our collection
            </p>

            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
              Browse equipment
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#81796f]">
              Find equipment for construction, transportation,
              photography, outdoor activities and more.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#79563e] transition hover:text-[#4f3829]"
          >
            Back to home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Search bar */}

        <div className="mb-8 border border-[#e9e1d8] bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94765b]" />

              <Input
                value={q}
                onChange={(event) => {
                  setQ(event.target.value);
                  setPage(1);
                }}
                placeholder="Search excavators, cameras, tents..."
                aria-label="Search equipment"
                className="h-12 rounded-none border-[#eee7df] bg-[#fffdfb] pl-11 text-sm shadow-none focus-visible:ring-[#94765b]"
              />
            </div>

            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94765b]" />

              <Input
                value={location}
                onChange={(event) =>
                  update({ location: event.target.value })
                }
                placeholder="Enter city or location"
                aria-label="Filter by location"
                className="h-12 rounded-none border-[#eee7df] bg-[#fffdfb] pl-11 text-sm shadow-none focus-visible:ring-[#94765b]"
              />
            </div>

            <Button
              type="button"
              onClick={() => setReload((value) => value + 1)}
              className="h-12 rounded-none bg-[#79563e] px-8 text-xs font-semibold text-white hover:bg-[#5d402e]"
            >
              <Search className="mr-2 h-4 w-4" />
              Search equipment
            </Button>
          </div>
        </div>

        {/* Category shortcuts */}

        <div className="mb-9">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              Explore categories
            </h3>

            <span className="text-[10px] text-[#8b837a]">
              {CATEGORIES.length} categories
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => update({ category: "All" })}
              className={`shrink-0 border px-5 py-2.5 text-xs font-medium transition ${
                category === "All"
                  ? "border-[#79563e] bg-[#79563e] text-white"
                  : "border-[#e9e1d8] bg-white text-[#665b50] hover:border-[#79563e]"
              }`}
            >
              All equipment
            </button>

            {CATEGORIES.map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => update({ category: value })}
                className={`shrink-0 border px-5 py-2.5 text-xs font-medium transition ${
                  category === value
                    ? "border-[#79563e] bg-[#79563e] text-white"
                    : "border-[#e9e1d8] bg-white text-[#665b50] hover:border-[#79563e]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Results and filters */}

        <div className="grid items-start gap-8 lg:grid-cols-[250px_1fr]">
          {/* Filter sidebar */}

          <aside className="border border-[#e9e1d8] bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#79563e]" />
                <h3 className="text-sm font-semibold">Filters</h3>
              </div>

              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#79563e] px-1.5 text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>

            {/* Category filter */}

            <div className="border-b border-[#eee7df] pb-6">
              <h4 className="mb-4 text-xs font-semibold">
                Category
              </h4>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-between text-xs text-[#665b50]">
                  <span>All categories</span>
                  <input
                    type="radio"
                    name="category"
                    checked={category === "All"}
                    onChange={() => update({ category: "All" })}
                    className="accent-[#79563e]"
                  />
                </label>

                {CATEGORIES.map((value) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center justify-between gap-2 text-xs text-[#665b50]"
                  >
                    <span>{value}</span>

                    <input
                      type="radio"
                      name="category"
                      checked={category === value}
                      onChange={() => update({ category: value })}
                      className="accent-[#79563e]"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Price filter */}

            <div className="border-b border-[#eee7df] py-6">
              <h4 className="mb-3 text-xs font-semibold">
                Maximum daily price
              </h4>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8b837a]">
                  ৳
                </span>

                <Input
                  type="number"
                  min="0"
                  placeholder="Any price"
                  value={maxPrice}
                  onChange={(event) =>
                    update({ maxPrice: event.target.value })
                  }
                  aria-label="Maximum daily price"
                  className="h-10 rounded-none border-[#e9e1d8] pl-7 text-xs shadow-none focus-visible:ring-[#94765b]"
                />
              </div>
            </div>

            {/* Sort filter */}

            <div className="pt-6">
              <h4 className="mb-3 text-xs font-semibold">
                Sort equipment
              </h4>

              <select
                value={sort}
                onChange={(event) => update({ sort: event.target.value })}
                aria-label="Sort listings"
                className="h-10 w-full border border-[#e9e1d8] bg-white px-3 text-xs text-[#665b50] outline-none focus:border-[#94765b]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {hasFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                className="mt-6 h-10 w-full rounded-none border-[#d9c9b8] text-xs text-[#79563e] hover:bg-[#f7f1eb]"
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                Clear all filters
              </Button>
            )}
          </aside>

          {/* Listing results */}

          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#e9e1d8] pb-4">
              <div>
                <h3 className="text-base font-semibold">
                  Available equipment
                </h3>

                <p className="mt-1 text-xs text-[#8b837a]">
                  {loading
                    ? "Finding equipment..."
                    : `${results.total} listing${results.total === 1 ? "" : "s"} found`}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-[#8b837a]">
                <LayoutGrid className="h-4 w-4" />
                Showing up to 12 per page
              </div>
            </div>

            {demoMode && (
              <div className="mb-5">
                <Notice kind="warning">
                  The Equiply API could not be reached, so these demo
                  listings are shown instead. Start the Express backend
                  on port 5000 to see live data.
                </Notice>
              </div>
            )}

            {error && (
              <ErrorState
                message={error}
                onRetry={() => setReload((value) => value + 1)}
              />
            )}

            {!error && loading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <CardSkeleton count={6} />
              </div>
            )}

            {!error && !loading && results.items.length === 0 && (
              <div className="border border-[#e9e1d8] bg-white px-5 py-16">
                <EmptyState
                  icon={<PackageSearch size={30} />}
                  title="No equipment found"
                  description="Try another search term or remove some filters. New equipment listings are added by owners regularly."
                  action={
                    <Button
                      type="button"
                      onClick={clearFilters}
                      className="rounded-none bg-[#79563e] text-xs text-white hover:bg-[#5d402e]"
                    >
                      Reset filters
                    </Button>
                  }
                />
              </div>
            )}

            {!error && !loading && results.items.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {results.items.map((item) => (
                    <EquipmentCard key={item._id} item={item} />
                  ))}
                </div>

                {/* Pagination */}

                {results.pages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() =>
                        setPage((value) => Math.max(1, value - 1))
                      }
                      className="h-10 rounded-none border-[#e9e1d8] text-xs"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Button>

                    <span className="text-xs text-[#665b50]">
                      Page {results.page} of {results.pages}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={page >= results.pages}
                      onClick={() => setPage((value) => value + 1)}
                      className="h-10 rounded-none border-[#e9e1d8] text-xs"
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Owner CTA */}

        <section className="relative mt-16 overflow-hidden bg-[#6c665c] px-7 py-10 sm:px-10 md:flex md:items-center md:justify-between md:gap-8">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-12 h-48 w-48 rounded-full border border-white/10" />

          <div className="relative">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-[#e5cdb3]">
              For equipment owners
            </p>

            <h2 className="text-2xl font-medium text-white sm:text-3xl">
              Own equipment? Put it to work.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
              Create a listing, connect with renters and make your
              equipment useful to more people.
            </p>
          </div>

          <Link
            href="/register"
            className="relative mt-7 inline-flex h-12 shrink-0 items-center justify-center bg-[#f5f0e9] px-7 text-xs font-semibold text-[#46372c] transition hover:bg-white md:mt-0"
          >
            Start earning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </section>
      </section>
    </main>
  );
}

export default function EquipmentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fffdfb]">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:px-12">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <CardSkeleton count={6} />
            </div>
          </div>
        </main>
      }
    >
      <EquipmentBrowser />
    </Suspense>
  );
}
