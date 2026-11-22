# Equiply Client

Frontend for **Equiply**, an equipment-rental marketplace built with Next.js (App Router), React, TypeScript and Tailwind CSS v4. The UI talks to the Express API in `Equiply-server/assignment9/server`.

## Requirements

- Node.js (current LTS)
- npm
- The Equiply Express API running on `http://localhost:5000`

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set the API origin (defaults are fine for local development):

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. Install dependencies: `npm install`
4. Start the frontend: `npm run dev` (it must run on `http://localhost:3000` so the API CORS allowlist accepts it).
5. Start the backend in its own terminal: `npm run dev` inside `Equiply-server/assignment9/server`.

## Demo accounts

These accounts exist in the seeded development database:

| Role     | Email                | Password       |
| -------- | -------------------- | -------------- |
| Admin    | `admin@equiply.dev`  | `Admin12345!`  |
| Owner    | `owner@equiply.dev`  | `Owner12345!`  |
| Customer | `renter@equiply.dev` | `Renter12345!` |

## Features

- **Marketplace** — live listings with search, category chips, location and price filters, sorting and pagination.
- **Equipment details** — gallery, listing specs, owner card, date picker with a live total and a booking request flow.
- **Authentication** — email/password sign-in and sign-up plus Google sign-in through Better Auth (cookies, `credentials: 'include'`).
- **Customer dashboard** — active rentals, favorites, completed rentals and recent bookings.
- **My rentals** — booking statuses, payment state and Stripe checkout (`Pay now`).
- **Favorites** — synced with the API for signed-in users, browser storage for guests.
- **Owner workspace** — analytics, earnings chart, incoming requests with approve/reject/complete actions.
- **My listings** — create, edit and delete equipment (owner role required).
- **Admin panel** — platform stats, listing moderation, all bookings and user role management.
- **Profile** — view and update account details.
- Payment result pages at `/payment/success` and `/payment/cancel` (Stripe redirects).

## Commands

| Command                | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the local development server      |
| `npm run build`        | Build for production                    |
| `npm run start`        | Start the production server             |
| `npm run typecheck`    | Run TypeScript checking                 |
| `npm run format`       | Format project files with Prettier      |
| `npm run format:check` | Check formatting without changing files |

## Structure

- `src/app/` — routes and page components (App Router)
- `src/components/` — shared UI: `Shell`, `Navbar`, `Sidebar`, `Footer`, `EquipmentCard`, `AuthGuard`, `ui.tsx`
- `src/lib/api.ts` — typed Express API client
- `src/lib/auth.tsx` — Better Auth client and `useAuth()` context
- `src/lib/favorites.tsx` — favorites context (API for members, storage for guests)
- `src/lib/types.ts`, `src/lib/format.ts`, `src/lib/constants.ts` — shared types, formatters and options
- `src/lib/demo-equipment.ts` — offline fallback data used only when the API is unreachable
- `.env.example` — environment-variable names only; no secrets

## Notes

- Roles are controlled by the server: new accounts are `customers`, an `admin` promotes users to `owner` from the Admin panel.
- Booking requests start as `pending`; payment through Stripe is required before an owner can confirm.
- If the API is unreachable the marketplace shows the bundled demo listings with a warning instead of an empty screen.

## Formatting

Prettier configuration is included. Run `npm run format` after dependency installation to apply consistent formatting across the full codebase.
