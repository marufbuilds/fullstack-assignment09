"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createAuthClient } from "better-auth/react";
import { API_URL } from "./api";
import type { AuthUser } from "./types";

export const authClient = createAuthClient({
  baseURL: `${API_URL}/auth`,
  fetchOptions: {
    credentials: "include",
  },
});

// Safely handle redirect paths after login or registration.
export function nextPath(value: string | null | undefined): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/dashboard";
  }

  return value;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  role: string;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  status: "loading",
  role: "",
  isAuthenticated: false,
  refresh: async () => {},
  signOut: async () => {},
});

function normalizeRole(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = authClient.useSession();

  const sessionUser = (session.data?.user as unknown as AuthUser | undefined) ?? null;

  const [profileUser, setProfileUser] = useState<AuthUser | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileReloadKey, setProfileReloadKey] = useState(0);

  useEffect(() => {
    if (!sessionUser?.id) {
      setProfileUser(null);
      setProfileLoading(false);
      return;
    }

    const currentSessionUser = sessionUser;
    let cancelled = false;

    async function loadProfile() {
      setProfileLoading(true);

      try {
        // Backend endpoint: GET /api/profile
        const response = await fetch(`${API_URL}/profile`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Profile request failed: ${response.status}`);
        }

        const data = await response.json();
        const fetchedUser = data?.user ?? data?.profile ?? null;

        if (!cancelled && fetchedUser) {
          setProfileUser({
            ...currentSessionUser,
            ...fetchedUser,
            role:
              normalizeRole(fetchedUser.role) ||
              normalizeRole(currentSessionUser.role) ||
              "customer",
          } as AuthUser);
        } else if (!cancelled) {
          setProfileUser(currentSessionUser);
        }
      } catch (error) {
        console.error("Could not load user profile:", error);

        if (!cancelled) {
          setProfileUser(currentSessionUser);
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [sessionUser?.id, sessionUser?.email, sessionUser?.role, profileReloadKey]);

  const user: AuthUser | null = sessionUser
    ? ({
        ...sessionUser,
        ...(profileUser ?? {}),
        role:
          normalizeRole(profileUser?.role) ||
          normalizeRole(sessionUser.role) ||
          "customer",
      } as AuthUser)
    : null;

  const role = normalizeRole(user?.role);

  const status: AuthStatus =
    session.isPending || profileLoading
      ? "loading"
      : sessionUser
        ? "authenticated"
        : "unauthenticated";

  async function refresh() {
    setProfileUser(null);
    await session.refetch();
    setProfileReloadKey((current) => current + 1);
  }

  async function signOut() {
    setProfileUser(null);
    await authClient.signOut();
    await session.refetch();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        role,
        isAuthenticated: status === "authenticated",
        refresh,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
