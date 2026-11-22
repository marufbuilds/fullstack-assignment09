# Equiply Frontend handoff

This folder contains the frontend project source for Equiply, arranged under `equiply-frontend/server` as requested.

## Run it

1. Install Node.js (compatible with the Next.js version in `package.json`).
2. Open a terminal in this folder (`server`).
3. Copy `.env.example` to `.env.local` and adjust the API URL if needed.
4. Run `npm install`.
5. Run `npm run dev` and open http://localhost:3000.

Keep the Express backend running separately at http://localhost:5000. This folder is the frontend app, not the Express backend.

## Checks

- Frontend API client updated to trim a trailing slash from the configured API base URL.
- API client only sets JSON Content-Type when a request body exists, and handles empty 204 responses.
- The original app routes/components and package manifest are preserved.
- A full TypeScript/build check could not be completed in this environment because dependency installation timed out.
