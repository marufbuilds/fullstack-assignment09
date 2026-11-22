# Equiply Client

Frontend for Equiply, an equipment-rental marketplace built with Next.js App Router, React, TypeScript and Tailwind CSS.

## Requirements

- Node.js (use a current LTS release)
- npm

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in the local environment values. Do not commit `.env.local`.
3. Install dependencies: `npm install`.
4. Run the dev server: `npm run dev`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run typecheck` | Run TypeScript checking |
| `npm run format` | Format project files with Prettier |
| `npm run format:check` | Check formatting without changing files |

## Structure

- `src/app/` — routes and page components (App Router)
- `src/components/` — shared UI components
- `src/lib/` — API helpers, demo data and local demo listing storage
- `.env.example` — environment-variable names only; no secrets

## Current limitations

This is a frontend demo. Some interactions use browser local storage or demo data. Authentication, booking, approval, persistence and payment actions are not secured or connected to a production API yet.

## Formatting

Prettier configuration is included. Run `npm run format` after dependency installation to apply consistent formatting across the full codebase.
