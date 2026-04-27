# Pokemon Battle App Implementation Handoff

Date: 2026-04-27

This repository is ready for a low-reasoning implementation session. The goal is to build, verify, commit, push, and deploy the app autonomously.

## Confirmed Setup

- Local repo: `C:\Users\Martin\dev\projects\wbs-projects\pokemon-battle`
- GitHub repo: `git@github.com:martinlindholmdev/pokemon-battle.git`
- Branch: `main`
- `.env` exists locally and is ignored by git.
- Local MongoDB is running and accepts `MONGODB_URI`.
- MongoDB Atlas accepts `MONGODB_ATLAS_URI`.
- Render can see the private GitHub repo in the dashboard.
- `RENDER_API_KEY` was saved with `setx`; it is available only in new shells/Codex sessions.

Important: do not commit `.env`, keys, passwords, or connection strings.

## Known Requirement Decision

The WBS brief asks for separate frontend, backend, and auth repositories/services. The user explicitly changed direction to one private repo. Implement the same behavior in one full-stack repo:

- Frontend: React app.
- Backend API: Express app.
- Auth service behavior: implemented as `/api/auth/*` routes/modules inside the backend.

This is a deliberate project-scope decision, not an accidental omission.

## Target Stack

- Vite + React + TypeScript
- React Router
- Tailwind CSS
- Express + TypeScript
- MongoDB + Mongoose
- JWT auth
- bcrypt password hashing
- PokeAPI for Pokemon data
- Render web service deployment

Recommended repo shape:

```txt
client/
  src/
  index.html
  package.json
server/
  src/
    index.ts
    config/
    middleware/
    models/
    routes/
    services/
  package.json
package.json
render.yaml
.env.example
```

Use npm workspaces from the root.

## Root Scripts

Root `package.json` should support:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace client\" \"npm run dev --workspace server\"",
    "build": "npm run build --workspace client && npm run build --workspace server",
    "start": "node server/dist/index.js",
    "lint": "npm run lint --workspace client && npm run lint --workspace server",
    "typecheck": "npm run typecheck --workspace client && npm run typecheck --workspace server"
  }
}
```

Exact tooling can vary, but Render must be able to run:

```txt
Build Command: npm ci && npm run build
Start Command: npm start
```

## Environment Variables

Local `.env` already contains:

```txt
NODE_ENV
PORT
MONGODB_URI
MONGODB_ATLAS_URI
JWT_SECRET
WBS_LLM_URL
WBS_LLM_MODEL
WBS_LLM_API_KEY
```

Server config should use:

- Development: `MONGODB_URI`
- Production/deploy: prefer `MONGODB_ATLAS_URI`, fallback to `MONGODB_URI`
- `PORT`: Render provides this automatically; local can use `.env`
- `JWT_SECRET`: required
- `WBS_LLM_*`: optional backend-only AI recap/coach feature

Never expose `WBS_LLM_API_KEY`, `JWT_SECRET`, or Mongo URIs to client code.

Create `.env.example` with placeholders only.

## Backend Requirements

Implement:

- `GET /api/health`
  - returns server status, MongoDB connection state, timestamp, and environment name
- `POST /api/auth/register`
  - validates email/password/displayName
  - hashes password
  - creates user
  - returns JWT and safe user profile
- `POST /api/auth/login`
  - validates credentials
  - returns JWT and safe user profile
- JWT middleware
  - protects routes except auth and health
- `GET /api/leaderboard`
  - returns top scores sorted descending
- `POST /api/leaderboard`
  - protected
  - validates score payload
  - creates score linked to authenticated user
- Optional: `POST /api/ai/battle-recap`
  - protected
  - calls `WBS_LLM_URL` with `WBS_LLM_MODEL` and `WBS_LLM_API_KEY`
  - fails gracefully with a deterministic local recap if AI service fails

Models:

- `User`
  - email
  - passwordHash
  - displayName
  - createdAt
- `Score`
  - userId ref
  - score required number
  - wins/losses optional
  - pokemon/team metadata optional
  - date default `Date.now`

Security defaults:

- `helmet`
- `cors` only if needed; same-origin production should not require broad CORS
- `express-rate-limit` on auth routes
- `express.json({ limit: "100kb" })`
- central error handler
- no stack traces in production responses
- no secrets in logs

Production server must serve the Vite build:

```txt
client/dist
```

For SPA routing, unknown non-API routes should return `index.html`.

## Frontend Requirements

Routes:

- `/register`
- `/login`
- `/`
- `/pokemon/:id`
- `/roster`
- `/battle`
- `/leaderboard`

Protected frontend routes:

- `/roster`
- `/battle`
- score posting actions

Core UX:

- Register and login forms with validation and clear errors
- Store JWT after login to satisfy bootcamp requirement
- Home fetches PokeAPI list and displays cards
- Pokemon details show artwork, stats, types, abilities, and add-to-roster action
- Roster persists in localStorage and supports remove
- Battle lets user choose roster Pokemon vs random opponent
- Battle shows HP bars, turn log, result, score/XP, win/loss
- Leaderboard fetches `/api/leaderboard`

Design style:

- Modern battle cockpit / Pokedex dashboard
- Dark readable base, Pokemon type color accents
- Bento-style sections, restrained glass/translucency
- Responsive mobile and desktop layout
- Polished cards, buttons, loading states, errors, and empty states
- Use icons where useful, preferably lucide-react
- Do not create a marketing landing page

Frontend security:

- Do not use `dangerouslySetInnerHTML`
- Do not place secrets in `VITE_*`
- Treat localStorage data as untrusted
- Keep API calls same-origin with `/api`

## Verification Before Commit

Run:

```powershell
npm install
npm run build
npm run typecheck
npm run lint
npm audit
```

Then start locally:

```powershell
npm run dev
```

Verify:

- `GET http://localhost:<server-port>/api/health`
- register
- login
- protected route redirect
- Pokemon list
- Pokemon detail
- add/remove roster
- battle
- leaderboard score creation

Use browser/Playwright screenshots if making substantial UI changes.

## Git Checkpoint

Before commit:

```powershell
git status --short
git diff -- . ':!.env'
```

Commit and push:

```powershell
git add .
git commit -m "Build Pokemon battle app"
git push origin main
```

Confirm `.env` is still ignored and not staged.

## Render Deployment Plan

Preferred autonomous path: Render REST API.

Render API docs:

- API auth: `Authorization: Bearer <RENDER_API_KEY>`
- List workspaces: `GET https://api.render.com/v1/owners`
- Create service: `POST https://api.render.com/v1/services`
- Trigger deploy: `POST https://api.render.com/v1/services/{serviceId}/deploys`
- Retrieve service: `GET https://api.render.com/v1/services/{serviceId}`

First verify the new Codex session can see:

```powershell
if ($env:RENDER_API_KEY) { "RENDER_API_KEY=<set>" } else { "missing" }
```

Then call:

```powershell
$headers = @{ Authorization = "Bearer $env:RENDER_API_KEY"; Accept = "application/json" }
Invoke-RestMethod -Method Get -Uri "https://api.render.com/v1/owners" -Headers $headers
```

Use the returned workspace owner ID. The dashboard previously showed workspace ID:

```txt
tea-d6k0rq75r7bs73a001ag
```

Create one Render `web_service` after code is pushed. Use the GitHub HTTPS repo URL:

```txt
https://github.com/martinlindholmdev/pokemon-battle
```

Expected service settings:

```txt
name: pokemon-battle
type: web_service
runtime: node
region: frankfurt preferred, oregon acceptable
plan: free if accepted by API/dashboard, otherwise starter only with user approval
branch: main
buildCommand: npm ci && npm run build
startCommand: npm start
healthCheckPath: /api/health
```

Render env vars to set:

```txt
NODE_ENV=production
MONGODB_URI=<local MONGODB_ATLAS_URI value>
JWT_SECRET=<local JWT_SECRET value>
WBS_LLM_URL=<local value>
WBS_LLM_MODEL=<local value>
WBS_LLM_API_KEY=<local value>
```

Do not print secret values in logs or final answers.

If API service creation fails because free services are not allowed via API or payment is required, stop and report the exact Render error. Do not upgrade the plan without user approval.

## Deployment Verification

After Render deploys:

- Poll deploy status until live or failed.
- Retrieve service URL.
- Check:

```txt
GET <service-url>/api/health
GET <service-url>/
GET <service-url>/leaderboard
```

Then run browser verification:

- app loads
- register works
- login works
- protected pages work
- battle posts a leaderboard score
- no obvious console errors

Final answer should include:

- GitHub commit hash
- Render URL
- verification results
- any skipped checks or limitations

