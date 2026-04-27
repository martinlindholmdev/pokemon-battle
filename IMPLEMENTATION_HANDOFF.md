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
- A plan-review session later confirmed `RENDER_API_KEY=<set>` and verified Render workspace ID `tea-d6k0rq75r7bs73a001ag` through the Render API without printing the key.
- The same review found no existing Render service named like `pokemon-battle`.
- User chose the max-autonomy Atlas strategy: temporarily allow Atlas Network Access from `0.0.0.0/0` for the demo deployment, then remove or tighten it after live verification.

Important: do not commit `.env`, keys, passwords, or connection strings.

Manual task for the user before starting the autonomous run:

1. Open MongoDB Atlas.
2. Select the project/cluster used by `MONGODB_ATLAS_URI`.
3. Go to `Security` -> `Network Access`.
4. Click `Add IP Address`.
5. Choose `Allow Access From Anywhere` or enter `0.0.0.0/0`.
6. Add a comment like `Temporary Render demo access - remove after Pokemon deployment`.
7. Save and wait until Atlas marks the entry active.
8. After live Render verification, remove the broad entry or replace it with Render outbound IP ranges.

## Execution Structure

Attempt one autonomous implementation run. Do not stop merely because context is getting long; use `EXECPLAN.md` and `docs/IMPLEMENTATION_LOG.md` as durable state through compaction/resume. Stop only for true external blockers: missing `RENDER_API_KEY` at deployment time, paid Render requirement, destructive git action requiring approval, unavailable required credentials, or Atlas/network access that cannot be changed with available credentials.

Subagents are optional sidecar tools, not co-owners of the implementation. The primary implementation agent owns the codebase. Use subagents only for bounded review or verification tasks if available, such as security-report review, UI verification, or Render-log inspection. Do not split overlapping file edits across subagents. Do not rely on automations to continue this run; automations are only for explicit user-requested scheduled follow-up.

Use available Codex capabilities where they directly reduce risk:

- shell for install/build/test/git/Render API commands,
- `apply_patch` for manual file edits,
- Browser Use or Playwright for desktop/mobile UI checks,
- GitHub MCP/code search, GitHub connector, or `gh` for open-source UX/code-reference research and repo/push verification,
- security review tooling or a reviewer subagent only after required local checks.

Do not use every tool just because it exists; use the smallest reliable tool for each checkpoint.

GitHub MCP code search was fixed and verified before the implementation run. The user created a public-repositories-only token as `GITHUB_PERSONAL_ACCESS_TOKEN`, and `C:\Users\Martin\.codex\config.toml` whitelists that env var for `[mcp_servers.github]`. If MCP code search fails again, fall back to `gh search code` and the Codex GitHub app; do not block frontend work solely on that tool.

## Known Requirement Decision

The WBS brief asks for separate frontend, backend, and auth repositories/services. The user explicitly changed direction to one private repo. Implement the same behavior in one full-stack repo:

- Frontend: React app.
- Backend API: Express app.
- Auth service behavior: implemented as `/api/auth/*` routes/modules inside the backend.

This is a deliberate project-scope decision, not an accidental omission.

## AI Elements Workflow Exploration

The AI Elements Workflow example was reviewed before implementation. Treat it as visual inspiration only, not a required dependency. The documented setup targets Next.js, React 19, shadcn/ui, Tailwind CSS 4, AI SDK setup, and `@xyflow/react`; this project is intentionally Vite + React + Express on Render. Do not migrate to Next.js or require AI Elements for completion. If time remains after the required app flows are verified, a lightweight local battle-step timeline can borrow the idea of nodes/active paths without adding React Flow/shadcn complexity.

The agentic workflow visualizer is a separate post-deploy session, not MVP scope. After the Pokemon app is built, deployed, verified, and documented, start a fresh session from `POST_DEPLOY_AGENT_WORKFLOW_PLAN.md`. That session can decide whether to add an `/agent-workflow` dashboard using AI Elements/React Flow or a lighter local graph. The data source should be the completed `docs/IMPLEMENTATION_LOG.md`, verification docs, commit hash, deployment URL, screenshots, and security report.

Vercel AI SDK Core is a separate consideration from AI Elements. It can work in Node.js/React projects, but it is optional here. The repo already has `WBS_LLM_URL`, `WBS_LLM_MODEL`, and `WBS_LLM_API_KEY`; unless that endpoint is confirmed OpenAI-compatible, use a small backend-only `fetch` integration for the optional battle recap. If compatibility is confirmed and the dependency cost stays small, `ai` plus `@ai-sdk/openai-compatible` may be used inside `server/src/services/aiCoach.ts`. AI availability must not be required for the app to work.

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

## Target Architecture

Use one npm-workspace repository:

- `client`: Vite React TypeScript SPA.
- `server`: Express TypeScript API and production static-file host.
- `docs`: concise human-readable documentation created during implementation.

Production flow:

1. Browser hits the Render web service.
2. Express serves `client/dist` for non-API routes and SPA fallback.
3. React calls same-origin API routes under `/api`.
4. Express validates inputs, authenticates JWTs, reads/writes MongoDB Atlas through Mongoose, and returns JSON.

Canonical routes are `/api/auth/register`, `/api/auth/login`, `/api/leaderboard`, and `/api/health`. Add simple compatibility aliases for `/auth/register`, `/auth/login`, `GET /leaderboard`, and `POST /leaderboard` if it stays low-risk, because the WBS brief names those paths without `/api`.

Recommended repo shape:

```txt
client/
  src/
  index.html
  package.json
server/
  src/
    index.ts
    app.ts
    config/
    middleware/
    models/
    routes/
    services/
  package.json
package.json
render.yaml
.env.example
README.md
docs/
  ARCHITECTURE.md
  RUNBOOK.md
  TESTING.md
  SECURITY_REPORT.md
  UX_RESEARCH.md
  IMPLEMENTATION_LOG.md
```

Use npm workspaces from the root.

## Required Documentation

Create documentation that helps humans and future agents operate the app:

- `README.md`: appealing GitHub-facing overview with feature list, stack, setup, env variable names, scripts, deployment notes, screenshots or screenshot placeholders, and troubleshooting.
- `docs/ARCHITECTURE.md`: component diagram, request/data flow, route map, data models, env flow, and key design decisions.
- `docs/RUNBOOK.md`: local dev, production start, Render deployment/redeploy, health checks, logs, common failures, secret rotation, Atlas network access, and maintenance checklist.
- `docs/TESTING.md`: commands run, manual browser checklist, desktop/mobile verification notes, and known gaps.
- `docs/SECURITY_REPORT.md`: npm audit summary, secret-scan summary, auth/token controls, validation/rate-limit/CORS posture, localStorage JWT tradeoff, residual risks, and remediation notes.
- `docs/UX_RESEARCH.md`: official visual references, open-source code references with license status, relevant files inspected, design decisions, component/state checklist, responsive acceptance criteria, and final screenshot notes.
- `docs/IMPLEMENTATION_LOG.md`: concise chronological log of important commands/outcomes, ports/PIDs, deploy IDs, service URL, blockers, and decisions. Do not paste secrets or huge logs.

Keep these docs useful and concise. They are maintenance/debugging artifacts, not a second implementation project.

## Root Scripts

Root `package.json` should support:

```json
{
  "engines": {
    "node": ">=24 <25"
  },
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
  - performs a lightweight database ping when connected so Render health checks catch Atlas access failures
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
  - signs tokens with an explicit short expiration such as `expiresIn: "2h"`
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

Before building the main frontend styling, do a bounded UX/code-reference research pass and document it in `docs/UX_RESEARCH.md`. Use official Pokemon/Pokedex references, PokeAPI artwork constraints, a small set of modern game/dashboard UI references, and at least three relevant open-source Pokemon/Pokedex/battle apps on GitHub. Study concrete component structure, responsive behavior, HP bars, type badges, card grids, battle logs, loading/empty/error states, and CSS organization from real implementations. Convert the research into local decisions: page hierarchy, component inventory, color/type tokens, responsive breakpoints, card density, battle-state layout, loading/empty/error states, and mobile navigation.

Use GitHub MCP code search/repo search, `gh`, or shallow public-repo inspection for the open-source references. If generic code search is unavailable, search repositories first and then inspect selected repos. For every repo inspected, record the URL, license status, files inspected, patterns learned, and rejected ideas. Do not vendor reference repos into this repo. Do not copy code from unlicensed or incompatible projects. If a small permissively licensed code idea is adapted, transform it to this app's architecture/style and attribute it in `docs/UX_RESEARCH.md`.

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
- PokeAPI usage stays modest: do not bulk-fetch every Pokemon; cache list/detail responses with a simple bounded cache or browser storage; show friendly errors if PokeAPI is unavailable
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
- First screen should be the usable Pokemon dashboard, not a hero section
- Stable image/card dimensions so artwork loading does not shift layouts
- Explicit states for empty roster, PokeAPI failure, auth failure, battle in progress, win/loss, and empty/error leaderboard
- Verify no text clipping, overlap, or inaccessible tap targets at `390x844`, `768x1024`, and `1440x900`

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

Security/review checkpoint:

- Run the secret scans from `EXECPLAN.md` and summarize results in `docs/SECURITY_REPORT.md`.
- Fix high/critical `npm audit` findings when a non-breaking fix exists; otherwise document the advisory and residual risk.
- Check auth validation, JWT expiration, rate limits, CORS/same-origin behavior, safe error handling, and absence of `dangerouslySetInnerHTML`, `innerHTML`, `eval`, and `new Function`.
- If a Codex review tool, CodeRabbit plugin, or subagent reviewer is available, it may be used after local checks as an additional review pass. It is not a substitute for the required commands.

Then start locally:

```powershell
npm run dev
```

Use a background job or hidden process for long-running dev/prod servers and record the PID so it can be stopped after verification. If the expected port is occupied, choose another local port and record that in `EXECPLAN.md`.

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
- UI checked at `390x844`, `768x1024`, and `1440x900`
- `docs/UX_RESEARCH.md` and `docs/TESTING.md` record the design and viewport evidence

Use browser/Playwright screenshots for desktop and mobile UI evidence.

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

For the direct Create Service API, build and start commands must be nested under `serviceDetails.envSpecificDetails`:

```powershell
@{
  type = "web_service"
  name = "pokemon-battle"
  ownerId = "<owner id from /v1/owners>"
  repo = "https://github.com/martinlindholmdev/pokemon-battle"
  branch = "main"
  autoDeploy = "yes"
  envVars = @(
    @{ key = "NODE_ENV"; value = "production" },
    @{ key = "MONGODB_URI"; value = "<local MONGODB_ATLAS_URI>" },
    @{ key = "JWT_SECRET"; value = "<local JWT_SECRET>" },
    @{ key = "WBS_LLM_URL"; value = "<local WBS_LLM_URL>" },
    @{ key = "WBS_LLM_MODEL"; value = "<local WBS_LLM_MODEL>" },
    @{ key = "WBS_LLM_API_KEY"; value = "<local WBS_LLM_API_KEY>" }
  )
  serviceDetails = @{
    runtime = "node"
    plan = "free"
    region = "frankfurt"
    healthCheckPath = "/api/health"
    envSpecificDetails = @{
      buildCommand = "npm ci && npm run build"
      startCommand = "npm start"
    }
  }
} | ConvertTo-Json -Depth 10
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

Atlas network access checkpoint: a local Atlas ping does not prove the deployed Render service can reach Atlas. If Render deploys but `/api/health` reports MongoDB connection failure, report a precise Atlas network-access blocker. Render services use region-based outbound IP ranges that may need to be added to the Atlas IP access list; do not claim to update Atlas allowlists unless Atlas credentials are actually available.

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
