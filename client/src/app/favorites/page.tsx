"use client";

// Favorites: synced with the API for signed-in users, stored in the
// browser for guests so demo saves are never lost.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Heart, LogIn } from "lucide-react";

import { fetchEquipmentById, normalizeEquipment } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useFavorites } from "@/lib/favorites";
import type { Equipment } from "@/lib/types";
import { EquipmentCard } from "@/components/EquipmentCard";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  Notice,
  PageHeader,
} from "@/components/ui";

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
  const { ids } = useFavorites();

  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
            description: "Saved from the demo marketplace.",
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
            caught instanceof Error ? caught.message : "Could not load your favorites.",
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

  return (
    <div className="wrap section">
      <PageHeader
        eyebrow="Saved listings"
        title="Your favorites"
        description="Keep the equipment you like in one place and come back when your dates are free."
        actions={
          <Link className="btn" href="/equipment">
            Browse equipment
          </Link>
        }
      />

      {!isAuthenticated && (
        <div style={{ marginBottom: 22 }}>
          <Notice kind="info">
            You are viewing favorites saved in this browser.{" "}
            <Link href="/login?next=/favorites" style={{ fontWeight: 700 }}>
              Sign in
            </Link>{" "}
            to sync them with your account on every device.
          </Notice>
        </div>
      )}

      {error && <ErrorState message={error} />}

      {!error && loading && (
        <div className="grid3">
          <CardSkeleton count={3} />
        </div>
      )}

      {!error && !loading && items.length === 0 && (
        <EmptyState
          icon={<Heart size={30} />}
          title="No favorites yet"
          description="Tap the heart on any listing to save it here for later."
          action={
            <Link className="btn" href="/equipment">
              Explore equipment
            </Link>
          }
        />
      )}

      {!error && !loading && items.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <span className="badge badge-brand">
              {items.length} saved item{items.length === 1 ? "" : "s"}
            </span>
            {!isAuthenticated && (
              <Link href="/login?next=/favorites" className="btn btn-outline btn-sm">
                <LogIn size={15} /> Sign in to sync
              </Link>
            )}
          </div>

          <div className="grid3">
            {items.map((item) => (
              <div key={item._id} style={{ position: "relative" }}>
                <EquipmentCard item={item} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
