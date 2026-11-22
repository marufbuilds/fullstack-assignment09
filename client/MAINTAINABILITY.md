# Maintainability notes

- Keep page-specific UI in the matching `src/app` route.
- Move reusable UI into `src/components` (`ui.tsx` holds the small shared pieces such as `Notice`, `EmptyState`, `StatCard` and `StatusBadge`).
- Keep shared types, API helpers and browser storage utilities in `src/lib`:
  - `api.ts` is the only place that talks to the Express API.
  - `auth.tsx` is the only place that talks to Better Auth.
  - `favorites.tsx` owns favorites state for every page.
- Avoid embedding secrets in client-side files; environment values exposed with `NEXT_PUBLIC_` are public.
- Prefer small components and named types over large inline JSX blocks.
- Format with Prettier (`npm run format`) and check types with `npm run typecheck`.
- `src/lib/listing-store.ts` is legacy browser-storage demo data from the frontend-only phase. Listing creation, editing and approval now go through the API (`src/lib/api.ts`); keep the file only as a reference and do not use it in new pages.
- `src/lib/demo-equipment.ts` is an offline fallback shown only when the API cannot be reached.
