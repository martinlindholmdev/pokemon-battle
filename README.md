# Pokemon Battle

A single-repository full-stack Pokemon battle app for the WBS Coding School project. Trainers can register, log in, browse Pokemon from PokeAPI, build a local roster, run battles, post scores, and view a MongoDB-backed leaderboard.

## Features

- React + Vite Pokemon dashboard with responsive desktop/mobile layout.
- JWT registration and login with bcrypt password hashing.
- PokeAPI list/detail browsing with stable official-artwork cards.
- LocalStorage roster with up to six Pokemon.
- Simple battle simulator with HP bars, turn log, score calculation, and leaderboard posting.
- Express API with MongoDB health check, validation, rate limiting, and production static hosting.

## Stack

- Client: React, TypeScript, React Router, Vite, lucide-react, CSS.
- Server: Express, TypeScript, Mongoose, Zod, JWT, bcryptjs, helmet, express-rate-limit.
- Data: MongoDB local or Atlas.
- Deployment: Render web service.

## Screenshots

- Desktop flow: `docs/screenshots/local-flow-desktop.png`
- Mobile 390x844: `docs/screenshots/local-mobile-390x844.png`
- Tablet 768x1024: `docs/screenshots/local-tablet-768x1024.png`
- Desktop 1440x900: `docs/screenshots/local-desktop-1440x900.png`

## Local Setup

1. Copy `.env.example` to `.env` and fill the local values.
2. Install dependencies:

```powershell
npm install
```

3. Build and run:

```powershell
npm run build
npm start
```

For development:

```powershell
npm run dev
```

## Environment Variables

- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `MONGODB_ATLAS_URI`
- `JWT_SECRET`
- `WBS_LLM_URL`
- `WBS_LLM_MODEL`
- `WBS_LLM_API_KEY`

Secrets are server-only. Do not create `VITE_*` secrets.

## Scripts

- `npm run dev` starts client and server watchers.
- `npm run build` builds client and server.
- `npm start` serves the built app from Express.
- `npm run typecheck` runs TypeScript checks.
- `npm run lint` runs ESLint.
- `npm audit` checks dependency advisories.

## Deployment Notes

Render should use:

- Build command: `npm ci --include=dev && npm run build`
- Start command: `npm start`
- Health check path: `/api/health`

Production should set `MONGODB_URI` to the Atlas connection string, plus `JWT_SECRET` and optional `WBS_LLM_*` values.

## Troubleshooting

- If `/api/health` is degraded, verify MongoDB credentials and Atlas network access.
- If registration fails locally while health is ok, the local MongoDB may allow ping but reject collection reads; the server can fall back to `MONGODB_ATLAS_URI` when configured.
- If PokeAPI is unavailable, the UI shows friendly load errors and auth/leaderboard routes remain available.
