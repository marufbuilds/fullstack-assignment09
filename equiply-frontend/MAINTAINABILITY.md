# Maintainability notes

- Keep page-specific UI in the matching `src/app` route.
- Move reusable UI into `src/components`.
- Keep shared types, API helpers and browser storage utilities in `src/lib`.
- Avoid embedding secrets in client-side files; environment values exposed with `NEXT_PUBLIC_` are public.
- Prefer small components and named types over large inline JSX blocks.
- Format with Prettier (`npm run format`) and check types with `npm run typecheck`.
- The demo `listing-store.ts` uses browser storage and must be replaced by server-side persistence and authorization before production.
