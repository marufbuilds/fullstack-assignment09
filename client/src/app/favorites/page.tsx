"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, Loader2, LogIn, PackageOpen, Trash2 } from "lucide-react";

import { fetchEquipmentById, normalizeEquipment } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useFavorites } from "@/lib/favorites";
import type { Equipment } from "@/lib/types";
import { EquipmentCard } from "@/components/EquipmentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "equiply-favorites";

type StoredFavorite = {
  id: string;
  name: string;
  image?: string;
  category?: string;
  price?: number;
};

function readStored(): StoredFavorite[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const { ids, remove } = useFavorites();

  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const cache = useRef<Map<string, Equipment>>(new Map());

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      if (!isAuthenticated) {
        const stored = readStored().map((row) =>
          normalizeEquipment({
            _id: row.id,
            title: row.name,
            image: row.image,
            category: row.category,
            price: row.price,
            description: "Saved from the Equiply marketplace.",
            location: "—",
            rentalType: "daily",
          }),
        );

        if (!cancelled) {
          setItems(stored);
          setLoading(false);
        }

        return;
      }

      try {
        const missing = ids.filter((id) => !cache.current.has(id));

        const fetched = await Promise.all(
          missing.map((id) => fetchEquipmentById(id).catch(() => null)),
        );

        fetched.forEach((item, index) => {
          if (item) cache.current.set(missing[index], item);
        });

        if (!cancelled) {
          setItems(
            ids
              .map((id) => cache.current.get(id))
              .filter((item): item is Equipment => Boolean(item)),
          );
          setLoading(false);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "We couldn't load your saved equipment.",
          );
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [ids, isAuthenticated]);

  async function handleRemove(id: string) {
    if (removingIds.includes(id)) return;

    setRemovingIds((current) => [...current, id]);

    try {
      await remove(id);
      setItems((current) => current.filter((item) => item._id !== id));
    } finally {
      setRemovingIds((current) => current.filter((value) => value !== id));
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Page header */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Your personal collection
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your favorites
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Keep the equipment you love close. Your saved listings are always here when
              you need them.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => (window.location.href = "/equipment")}
            className="h-11 rounded-full bg-primary px-6 text-primary-foreground shadow-none hover:bg-primary-hover"
          >
            Explore equipment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Guest notice */}
        {!isAuthenticated && (
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-secondary p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-primary">
                <Heart className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-medium text-foreground">
                  Your favorites are saved in this browser
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Sign in to access your saved equipment across your devices.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => (window.location.href = "/login?next=/favorites")}
              className="h-10 shrink-0 rounded-full border-primary bg-transparent px-5 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign in
            </Button>
          </div>
        )}

        {/* Saved equipment heading */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Saved equipment</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Equipment you've bookmarked for later.
            </p>
          </div>

          {!loading && !error && items.length > 0 && (
            <Badge className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-primary hover:bg-secondary">
              {items.length} {items.length === 1 ? "item" : "items"}
            </Badge>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-800">Something went wrong</h3>

            <p className="mt-2 text-sm text-red-700">{error}</p>

            <Button
              type="button"
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4 rounded-full border-red-300 text-red-800 hover:bg-red-100"
            >
              Try again
            </Button>
          </div>
        )}

        {/* Loading state */}
        {!error && loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="aspect-[4/3] animate-pulse bg-secondary" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
                  <div className="h-8 w-full animate-pulse rounded-lg bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!error && !loading && items.length === 0 && (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <PackageOpen className="h-9 w-9 text-primary" />
            </div>

            <h2 className="text-2xl font-semibold text-foreground">
              Nothing saved just yet
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              Found something you like? Tap the heart on any equipment listing and it will
              appear here for your next rental.
            </p>

            <Button
              type="button"
              onClick={() => (window.location.href = "/equipment")}
              className="mt-7 h-11 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary-hover"
            >
              Discover equipment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Favorites grid */}
        {!error && !loading && items.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const isRemoving = removingIds.includes(item._id);

              return (
                <div
                  key={item._id}
                  className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-md"
                >
                  <EquipmentCard item={item} />

                  {/* Separate delete action */}
                  <div className="flex items-center justify-between border-t border-border bg-background px-4 py-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      Saved to your favorites
                    </span>

                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      disabled={isRemoving}
                      onClick={() => handleRemove(item._id)}
                      aria-label={`Remove ${item.title} from favorites`}
                      title="Remove from favorites"
                      className="h-10 w-10 rounded-full border-border bg-card text-primary shadow-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {isRemoving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
