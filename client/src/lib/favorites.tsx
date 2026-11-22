"use client";

// Favorites work for signed-in users through the API and for guests
// through browser storage, so nothing is ever lost in demo mode.

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
  toggle: async () => ({ saved: false, message: "" }),
  remove: async () => {},
});

function readStored(): StoredFavorite[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeStored(items: StoredFavorite[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      if (isAuthenticated) {
        try {
          const rows = await fetchFavorites();
          if (!cancelled) setIds(rows.map((row) => String(row.equipmentId)));
        } catch {
          if (!cancelled) setIds([]);
        }
      } else {
        if (!cancelled) setIds(readStored().map((row) => row.id));
      }
      if (!cancelled) setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    async (item: Equipment) => {
      const saved = ids.includes(item._id);

      if (isAuthenticated) {
        try {
          if (saved) {
            await removeFavorite(item._id);
            setIds((current) => current.filter((id) => id !== item._id));
            return { saved: false, message: "Removed from favorites" };
          }
          await addFavorite(item._id);
          setIds((current) => [...current, item._id]);
          return { saved: true, message: "Saved to favorites" };
        } catch (error) {
          return {
            saved,
            message:
              error instanceof Error ? error.message : "Could not update favorites",
          };
        }
      }

      const stored = readStored();
      if (saved) {
        writeStored(stored.filter((row) => row.id !== item._id));
        setIds((current) => current.filter((id) => id !== item._id));
        return { saved: false, message: "Removed from favorites" };
      }
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
      setIds((current) => [...current, item._id]);
      return { saved: true, message: "Saved to favorites" };
    },
    [ids, isAuthenticated],
  );

  const remove = useCallback(
    async (id: string) => {
      if (isAuthenticated) {
        try {
          await removeFavorite(id);
        } catch {
          // Ignore: the item may already be gone.
        }
      } else {
        writeStored(readStored().filter((row) => row.id !== id));
      }
      setIds((current) => current.filter((value) => value !== id));
    },
    [isAuthenticated],
  );

  return (
    <FavoritesContext.Provider value={{ ids, loading, has, toggle, remove }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
