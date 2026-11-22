"use client";

// Marketplace: search, filter, sort and paginate live API listings.

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapPin, Search, SlidersHorizontal, PackageSearch } from "lucide-react";

import { ApiError, errorMessage, fetchEquipment, normalizeEquipment } from "@/lib/api";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import { demoEquipment } from "@/lib/demo-equipment";
import type { Equipment, Paginated } from "@/lib/types";
import { EquipmentCard } from "@/components/EquipmentCard";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  Notice,
  PageHeader,
} from "@/components/ui";

const EMPTY: Paginated<Equipment> = { items: [], total: 0, page: 1, pages: 0 };

/** Local demo listings are used only when the API cannot be reached. */
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
        (!location || item.location.toLowerCase().includes(location.toLowerCase())) &&
        (!maxPrice || item.price <= Number(maxPrice)),
    );

  if (sort === "price-low") items.sort((a, b) => a.price - b.price);
  if (sort === "price-high") items.sort((a, b) => b.price - a.price);

  return { items, total: items.length, page: 1, pages: 1 };
}

function EquipmentBrowser() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
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
            setResults(demoResult(q, category, location, maxPrice, sort));
            setDemoMode(true);
          } else {
            setError(errorMessage(caught));
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      },
      q ? 350 : 0,
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
    Boolean(q) || category !== "All" || Boolean(location) || Boolean(maxPrice);

  return (
    <div className="wrap section">
      <PageHeader
        eyebrow="Marketplace"
        title="Find equipment for your next project"
        description="Search verified listings from local owners, compare daily prices and request your rental dates in a couple of clicks."
      />

      <div className="card card-pad" style={{ marginBottom: 26 }}>
        <div className="filterbar">
          <label className="searchbox">
            <Search size={18} />
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search excavators, cameras, tents…"
              aria-label="Search equipment"
            />
          </label>

          <label className="searchbox">
            <MapPin size={18} />
            <input
              value={location}
              onChange={(event) => update({ location: event.target.value })}
              placeholder="Any location"
              aria-label="Filter by location"
            />
          </label>

          <select
            className="filterselect"
            value={category}
            onChange={(event) => update({ category: event.target.value })}
            aria-label="Filter by category"
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>

          <select
            className="filterselect"
            value={sort}
            onChange={(event) => update({ sort: event.target.value })}
            aria-label="Sort listings"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 13.5,
              fontWeight: 650,
              color: "var(--muted)",
            }}
          >
            <SlidersHorizontal size={15} /> Max daily price
          </span>
          <input
            className="priceinput"
            type="number"
            min="0"
            placeholder="Any"
            value={maxPrice}
            onChange={(event) => update({ maxPrice: event.target.value })}
            aria-label="Maximum daily price"
          />
          {hasFilters && (
            <button className="btn btn-outline btn-sm" onClick={clearFilters}>
              Clear filters
            </button>
          )}
          <span className="muted" style={{ marginLeft: "auto", fontSize: 14 }}>
            {loading
              ? "Searching…"
              : `${results.total} listing${results.total === 1 ? "" : "s"} found`}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          <button
            className={`chip${category === "All" ? " active" : ""}`}
            onClick={() => update({ category: "All" })}
          >
            All
          </button>
          {CATEGORIES.map((value) => (
            <button
              key={value}
              className={`chip${category === value ? " active" : ""}`}
              onClick={() => update({ category: value })}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {demoMode && (
        <div style={{ marginBottom: 20 }}>
          <Notice kind="warning">
            The Equiply API could not be reached, so these demo listings are shown
            instead. Start the Express backend on port 5000 to see live data.
          </Notice>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 20 }}>
          <ErrorState message={error} onRetry={() => setReload((value) => value + 1)} />
        </div>
      )}

      {!error && loading && (
        <div className="grid3">
          <CardSkeleton count={6} />
        </div>
      )}

      {!error && !loading && results.items.length === 0 && (
        <EmptyState
          icon={<PackageSearch size={30} />}
          title="No equipment matches those filters"
          description="Try a different search term, category or location. New listings are added by owners every day."
          action={
            <button className="btn" onClick={clearFilters}>
              Reset filters
            </button>
          }
        />
      )}

      {!error && !loading && results.items.length > 0 && (
        <>
          <div className="grid3">
            {results.items.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </div>

          {results.pages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 14,
                marginTop: 34,
              }}
            >
              <button
                className="btn btn-outline"
                disabled={page <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </button>
              <span className="muted" style={{ fontSize: 14 }}>
                Page {results.page} of {results.pages}
              </span>
              <button
                className="btn btn-outline"
                disabled={page >= results.pages}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <div className="cta-panel" style={{ marginTop: 46 }}>
        <div>
          <h2 className="h3" style={{ color: "#fff" }}>
            Own equipment? Put it to work.
          </h2>
          <p style={{ margin: "8px 0 0" }}>
            Create an owner listing and reach thousands of renters in your area.
          </p>
        </div>
        <Link href="/register" className="btn btn-accent">
          Start earning
        </Link>
      </div>
    </div>
  );
}

export default function EquipmentPage() {
  return (
    <Suspense
      fallback={
        <div className="wrap section">
          <div className="grid3">
            <CardSkeleton count={6} />
          </div>
        </div>
      }
    >
      <EquipmentBrowser />
    </Suspense>
  );
}
