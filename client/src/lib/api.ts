// Equiply API client.
// Everything the frontend sends to the Express backend goes through here.

import { FALLBACK_IMAGE } from "./constants";
import type {
  AdminStats,
  AuthUser,
  Booking,
  Equipment,
  Favorite,
  ListingDraft,
  OwnerAnalytics,
  Paginated,
} from "./types";

/** Base URL of the Express API. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Perform a JSON request against the API. */
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      `Could not reach the Equiply API at ${API_URL}. Start the backend and try again.`,
      0,
    );
  }

  const text = await response.text();
  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data as { message?: string } | null)?.message ||
      `Request failed (${response.status})`;

    throw new ApiError(message, response.status);
  }

  return data as T;
}

export const http = {
  get: <T>(path: string) => api<T>(path),

  post: <T>(path: string, body?: unknown) =>
    api<T>(path, {
      method: "POST",
      body: JSON.stringify(body ?? {}),
    }),

  patch: <T>(path: string, body?: unknown) =>
    api<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body ?? {}),
    }),

  del: <T>(path: string) =>
    api<T>(path, {
      method: "DELETE",
    }),
};

export function isAuthError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

/** Try several paths in order and return the first success. */
async function firstOf<T>(...paths: string[]): Promise<T> {
  let lastError: unknown = null;

  for (const path of paths) {
    try {
      return await http.get<T>(path);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  throw lastError || new ApiError("Endpoint not found", 404);
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

/** Normalise API or demo data into one Equipment shape. */
export function normalizeEquipment(raw: Partial<Equipment>): Equipment {
  return {
    ...(raw as Equipment),
    _id: raw._id || "unknown",
    title: raw.title || raw.name || "Untitled equipment",
    description: raw.description || "",
    category: raw.category || "Other",
    location: raw.location || "Location not set",
    price: Number(raw.price || 0),
    rentalType: raw.rentalType || "daily",
    image: raw.image || FALLBACK_IMAGE,
  };
}

export type EquipmentQuery = {
  search?: string;
  category?: string;
  location?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  type?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

function buildQuery(query: EquipmentQuery): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** GET /equipment — approved marketplace listings. */
export async function fetchEquipment(
  query: EquipmentQuery = {},
): Promise<Paginated<Equipment>> {
  const data = await http.get<Paginated<Equipment>>(`/equipment${buildQuery(query)}`);

  return {
    ...data,
    items: (data.items || []).map(normalizeEquipment),
  };
}

/** GET /equipment/:id */
export async function fetchEquipmentById(id: string): Promise<Equipment> {
  const data = await http.get<Equipment>(`/equipment/${id}`);
  return normalizeEquipment(data);
}

/** POST /equipment */
export async function createEquipment(draft: ListingDraft) {
  return http.post<{ message: string; equipment: Equipment }>("/equipment", draft);
}

/** GET /equipment/owner/mine */
export async function fetchMyListings(): Promise<Equipment[]> {
  const data = await firstOf<Equipment[]>(
    "/equipment/owner/mine",
    "/equipment/mine/list",
  );

  return (data || []).map(normalizeEquipment);
}

/** PATCH /equipment/:id */
export async function updateEquipment(id: string, updates: Partial<ListingDraft>) {
  return http.patch<{ message: string }>(`/equipment/${id}`, updates);
}

/** DELETE /equipment/:id */
export async function deleteEquipment(id: string) {
  return http.del<{ message: string }>(`/equipment/${id}`);
}

/** POST /bookings */
export async function createBooking(input: {
  equipmentId: string;
  startDate: string;
  endDate: string;
  phone: string;
}): Promise<Booking> {
  return http.post<Booking>("/bookings", input);
}

/** GET /bookings/mine */
export async function fetchMyBookings(): Promise<Booking[]> {
  return (await http.get<Booking[]>("/bookings/mine")) || [];
}

/** GET /bookings/owner */
export async function fetchOwnerBookings(): Promise<Booking[]> {
  return (await http.get<Booking[]>("/bookings/owner")) || [];
}

/** PATCH /bookings/:id/status */
export async function updateBookingStatus(
  id: string,
  status: string,
): Promise<{ message: string }> {
  return http.patch<{ message: string }>(`/bookings/${id}/status`, {
    status,
  });
}

/** POST /payments/checkout/:bookingId */
export async function startCheckout(bookingId: string): Promise<string> {
  const data = await http.post<{ url: string }>(`/payments/checkout/${bookingId}`);

  return data.url;
}

/** GET /favorites */
export async function fetchFavorites(): Promise<Favorite[]> {
  return (await http.get<Favorite[]>("/favorites")) || [];
}

/** POST /favorites/:equipmentId */
export async function addFavorite(equipmentId: string) {
  return http.post<{ message: string }>(`/favorites/${equipmentId}`);
}

/** DELETE /favorites/:equipmentId */
export async function removeFavorite(equipmentId: string) {
  return http.del<{ message: string }>(`/favorites/${equipmentId}`);
}

/** GET /profile */
export async function fetchProfile(): Promise<AuthUser> {
  const data = await http.get<{ user: AuthUser }>("/profile");
  return data.user;
}

/** PATCH /profile */
export async function updateProfile(name: string) {
  return http.patch<{ message: string; name: string }>("/profile", {
    name,
  });
}

/** GET /owner/analytics */
export async function fetchOwnerAnalytics(): Promise<OwnerAnalytics> {
  return http.get<OwnerAnalytics>("/owner/analytics");
}

/* =========================================
   ADMIN API
========================================= */

/** GET /admin/stats */
export async function fetchAdminStats(): Promise<AdminStats> {
  const data = await http.get<{ stats: AdminStats }>("/admin/stats");

  return data.stats;
}

/** GET /admin/equipment */
export async function fetchAdminEquipment(): Promise<Equipment[]> {
  const data = await http.get<{
    equipment: Equipment[];
    pagination?: unknown;
  }>("/admin/equipment?limit=100");

  return (data.equipment || []).map(normalizeEquipment);
}

/** PATCH /admin/equipment/:id/status */
export async function setEquipmentStatus(
  id: string,
  status: "approved" | "rejected" | "pending",
) {
  return http.patch<{ message: string }>(`/admin/equipment/${id}/status`, { status });
}

/** GET /admin/bookings */
export async function fetchAdminBookings(): Promise<Booking[]> {
  const data = await http.get<{
    bookings: Booking[];
    pagination?: unknown;
  }>("/admin/bookings?limit=100");

  return data.bookings || [];
}

/** GET /admin/users */
export async function fetchAdminUsers(): Promise<(AuthUser & { _id: string })[]> {
  const data = await http.get<{
    users: (AuthUser & { _id: string })[];
    pagination?: unknown;
  }>("/admin/users?limit=100");

  return data.users || [];
}

/** PATCH /admin/users/:id/role */
export async function setUserRole(id: string, role: string) {
  return http.patch<{ message: string }>(`/admin/users/${id}/role`, {
    role,
  });
}
