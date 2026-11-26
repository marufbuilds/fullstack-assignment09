"use client";

// Favorites work for signed-in users through the API
// and for guests through browser storage.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { addFavorite, fetchFavorites, removeFavorite } from "./api";

import { useAuth } from "./auth";
import type { Equipment } from "./types";

const STORAGE_KEY = "equiply-favorites";

type StoredFavorite = {
  id: string;
  name: string;
  image?: string;
  category?: string;
  price?: number;
};

type FavoritesContextValue = {
  ids: string[];
  loading: boolean;
  has: (id: string) => boolean;
  toggle: (item: Equipment) => Promise<{ saved: boolean; message: string }>;
  remove: (id: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue>({
  ids: [],
  loading: false,
  has: () => false,
  toggle: async () => ({
    saved: false,
    message: "",
  }),
  remove: async () => {},
});

function readStored(): StoredFavorite[] {
  if (typeof window === "undefined") return [];

  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeStored(items: StoredFavorite[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites when authentication changes.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        if (isAuthenticated) {
          const rows = await fetchFavorites();

          if (!cancelled) {
            const favoriteIds = rows.map((row) => String(row.equipmentId));

            setIds([...new Set(favoriteIds)]);
          }
        } else {
          if (!cancelled) {
            const storedIds = readStored().map((row) => row.id);

            setIds([...new Set(storedIds)]);
          }
        }
      } catch {
        if (!cancelled) {
          setIds([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Check whether an item is already a favorite.
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  // Add or remove a favorite using the heart button.
  const toggle = useCallback(
    async (item: Equipment) => {
      const saved = ids.includes(item._id);

      if (isAuthenticated) {
        try {
          if (saved) {
            await removeFavorite(item._id);

            setIds((current) => current.filter((id) => id !== item._id));

            return {
              saved: false,
              message: "Removed from favorites",
            };
          }

          await addFavorite(item._id);

          setIds((current) =>
            current.includes(item._id) ? current : [...current, item._id],
          );

          return {
            saved: true,
            message: "Saved to favorites",
          };
        } catch (error) {
          return {
            saved,
            message:
              error instanceof Error ? error.message : "Could not update favorites",
          };
        }
      }

      // Guest favorites use localStorage.
      const stored = readStored();

      if (saved) {
        writeStored(stored.filter((row) => row.id !== item._id));

        setIds((current) => current.filter((id) => id !== item._id));

        return {
          saved: false,
          message: "Removed from favorites",
        };
      }

      const alreadyStored = stored.some((row) => row.id === item._id);

      if (!alreadyStored) {
        writeStored([
          ...stored,
          {
            id: item._id,
            name: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
          },
        ]);
      }

      setIds((current) =>
        current.includes(item._id) ? current : [...current, item._id],
      );

      return {
        saved: true,
        message: "Saved to favorites",
      };
    },
    [ids, isAuthenticated],
  );

  // Delete a favorite using the trash button.
  const remove = useCallback(
    async (id: string) => {
      if (isAuthenticated) {
        // Do not update local state unless API removal succeeds.
        await removeFavorite(id);
      } else {
        const stored = readStored();

        writeStored(stored.filter((row) => row.id !== id));
      }

      setIds((current) => current.filter((value) => value !== id));
    },
    [isAuthenticated],
  );

  return (
    <FavoritesContext.Provider
      value={{
        ids,
        loading,
        has,
        toggle,
        remove,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
