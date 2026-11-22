// Shared types used across the Equiply frontend.
// These mirror what the Express API returns.

export type Role = "customer" | "owner" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
};

export type EquipmentStatus = "pending" | "approved" | "rejected";

export type Equipment = {
  _id: string;
  /** Server field. Older demo data uses `name` instead. */
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: string;
  image: string;
  ownerId?: string;
  status?: EquipmentStatus;
  createdAt?: string;
  /** Demo-data only fields, optional. */
  name?: string;
  owner?: string;
  rating?: number;
  reviews?: number;
  quantity?: number;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pages: number;
};

export type BookingStatus =
  "pending" | "confirmed" | "rejected" | "completed" | "cancelled";

export type Booking = {
  _id: string;
  equipmentId: string;
  equipmentTitle?: string;
  ownerId?: string;
  renterId?: string;
  startDate: string;
  endDate: string;
  phone: string;
  days: number;
  amount: number;
  status: BookingStatus;
  paymentStatus?: string;
  createdAt?: string;
  expiresAt?: string;
};

export type Favorite = {
  _id: string;
  userId?: string;
  equipmentId: string;
  createdAt?: string;
};

export type AdminStats = {
  users: number;
  equipment: number;
  bookings: number;
  paidPayments: number;
};

export type OwnerAnalytics = {
  listingCount: number;
  completedRentals: number;
  paidRentals: number;
  totalEarnings: number;
  monthlyEarnings: {
    year: number;
    month: number;
    earnings: number;
    rentals: number;
  }[];
};

export type ListingDraft = {
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: string;
  image: string;
};
