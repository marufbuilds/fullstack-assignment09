"use client";

// Better Auth client + a tiny React context so every page can read
// the signed-in user and their role.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createAuthClient } from "better-auth/react";

import { API_URL } from "./api";
import type { AuthUser } from "./types";

/** Talks to the Express backend at /api/auth/* with cookies included. */
export const authClient = createAuthClient({
  baseURL: `${API_URL}/auth`,
  fetchOptions: { credentials: "include" },
});

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = authClient.useSession();
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    if (session.isPending) {
      setStatus("loading");
      return;
    }
    setStatus(session.data?.user ? "authenticated" : "unauthenticated");
  }, [session.isPending, session.data]);

  const user = (session.data?.user as unknown as AuthUser | undefined) ?? null;

  async function refresh() {
    await session.refetch();
  }

  async function signOut() {
    await authClient.signOut();
    await session.refetch();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        role: user?.role || "",
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

/** Read the ?next= redirect target from the current URL. */
export function nextPath(): string {
  if (typeof window === "undefined") return "/dashboard";
  const value = new URLSearchParams(window.location.search).get("next");
  if (!value || !value.startsWith("/")) return "/dashboard";
  return value;
}
