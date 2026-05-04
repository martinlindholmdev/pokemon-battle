# Pokemon Battle

![Pokemon Battle dashboard](docs/screenshots/local-desktop-1440x900.png)

Pokemon Battle is a full-stack browser game where trainers browse the first-generation Pokedex, build a roster, enter a 3D turn-based battle arena, play friend battles, and post verified solo scores to a live trophy board.

The app is intentionally compact: one React client, one Express API, one MongoDB-backed leaderboard, and a production deployment on Render.

## What You Can Do

- Search and browse 151 first-generation Pokemon from PokeAPI.
- Inspect official artwork, type badges, core stats, height, weight, and abilities.
- Save up to six Pokemon in a local roster, or use starter picks immediately.
- Start a solo practice battle without logging in.
- Log in when you want verified solo battle scores saved.
- Use big Hit, Block, and Power buttons while HP pips and arena animations update.
- Play pass-and-play friend battles on one computer.
- Create short web friend-room codes for unscored battles over the deployed app.
- Read the kid-friendly visual rules page.

## Screenshots

| Desktop | Battle Arena |
| --- | --- |
| ![Desktop Pokedex](docs/screenshots/local-desktop-1440x900.png) | ![Battle arena](docs/screenshots/local-battle-arena.png) |

| Tablet | Mobile |
| --- | --- |
| ![Tablet layout](docs/screenshots/local-tablet-768x1024.png) | ![Mobile layout](docs/screenshots/local-mobile-390x844.png) |

## Stack

- Client: React, TypeScript, React Router, Vite, React Three Fiber, Three.js, lucide-react, CSS.
- Server: Express, TypeScript, Mongoose, Zod, JWT, bcryptjs, helmet, express-rate-limit.
- Data: MongoDB local development or MongoDB Atlas production.
- External data: PokeAPI and PokeAPI official artwork URLs.
- Deployment: Render web service.

## Local Setup

Copy `.env.example` to `.env` and fill the local values. Do not commit `.env`.

```powershell
npm install
npm run build
npm start
```

The production-style local app runs at `http://localhost:4000`.

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

Secrets stay server-side. Do not create `VITE_*` variables for secrets.

## Scripts

- `npm run dev`: start client and server watchers.
- `npm run build`: build client and server.
- `npm start`: serve the built app from Express.
- `npm run typecheck`: run TypeScript checks.
- `npm run lint`: run ESLint.
- `npm audit`: check dependency advisories.

## Deployment

Render should use:

- Build command: `npm ci --include=dev && npm run build`
- Start command: `npm start`
- Health check path: `/api/health`

Production should set `MONGODB_URI` to the Atlas connection string, plus `JWT_SECRET` and optional `WBS_LLM_*` values.

Current production URL: https://pokemon-battle-ffwr.onrender.com

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Runbook](docs/RUNBOOK.md)
- [Testing](docs/TESTING.md)
- [Security Report](docs/SECURITY_REPORT.md)
- [UX Research](docs/UX_RESEARCH.md)
- [Game Rules](PLAYBOOK.md)
