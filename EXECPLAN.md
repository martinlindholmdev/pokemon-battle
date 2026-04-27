# Build And Deploy The Pokemon Battle App

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated while implementing. Follow `.agent/PLANS.md`.

## Purpose / Big Picture

Build a polished full-stack Pokemon battle app for the WBS Coding School project. A user should be able to register, log in, browse Pokemon from PokeAPI, inspect details, build a roster, run a simple battle, post a score, and view the leaderboard. The finished app must run locally and be deployed as a Render web service backed by MongoDB Atlas.

The visible proof of completion is:

- local `/api/health` returns HTTP 200,
- the app loads in a browser,
- register/login works,
- a roster can be built,
- a battle can be completed,
- a score appears on the leaderboard,
- the same core checks pass on the Render URL after deployment.

## Progress

- [x] (2026-04-27) Private GitHub repo `martinlindholmdev/pokemon-battle` created and connected.
- [x] (2026-04-27) `.env` ignored by git.
- [x] (2026-04-27) Local MongoDB ping verified.
- [x] (2026-04-27) MongoDB Atlas ping verified through `MONGODB_ATLAS_URI`.
- [x] (2026-04-27) Render can see the private GitHub repo.
- [x] (2026-04-27) Render API key saved with `setx`; new sessions should see `RENDER_API_KEY`.
- [ ] Confirm new implementation session can read `RENDER_API_KEY`.
- [ ] Scaffold app workspace.
- [ ] Implement backend.
- [ ] Implement frontend.
- [ ] Run local checks.
- [ ] Commit and push implementation.
- [ ] Deploy to Render.
- [ ] Verify live deployment.

## Surprises & Discoveries

- Render initially guessed the repo was a Rust app because the app code had not been scaffolded yet. Do not create the Render service until package scripts exist.
- The current planning session could not see `RENDER_API_KEY` after `setx`, which is expected on Windows. A new Codex session must be started so the process inherits the variable.

## Decision Log

- Decision: Use one private full-stack repository instead of three public repositories.
  Rationale: The user explicitly changed direction to a single repo after discussing the WBS three-repo requirement. Implement auth as backend modules/routes while satisfying the behavior.
  Date/Author: 2026-04-27 / planning agent.

- Decision: Use Render for deployment.
  Rationale: The app needs an Express backend plus React static serving. Render web service is a better fit than GitHub Pages and simpler than splitting services.
  Date/Author: 2026-04-27 / planning agent.

- Decision: Keep local and Atlas MongoDB URIs separate.
  Rationale: Local MongoDB supports development; Atlas is needed for Render because Render cannot reach a database running on the user computer.
  Date/Author: 2026-04-27 / planning agent.

- Decision: Store JWT in browser storage for this bootcamp app.
  Rationale: The school requirements explicitly say to store JWT on login. Mitigate risk by avoiding DOM injection, using security headers, and keeping tokens short-lived.
  Date/Author: 2026-04-27 / planning agent.

## Context and Orientation

The repository currently contains planning and requirement files only. The working directory is:

    C:\Users\Martin\dev\projects\wbs-projects\pokemon-battle

Important current files:

- `project-guidelines.md`: WBS requirements.
- `.env`: local secrets and connection strings; ignored by git.
- `.gitignore`: excludes secrets and build artifacts.
- `AGENTS.md`: repo-level agent instructions.
- `.agent/PLANS.md`: execution-plan rules.
- `IMPLEMENTATION_HANDOFF.md`: earlier setup notes; use as supplementary context.
- `EXECPLAN.md`: this authoritative execution plan.

Environment variable names present in `.env`:

- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `MONGODB_ATLAS_URI`
- `JWT_SECRET`
- `WBS_LLM_URL`
- `WBS_LLM_MODEL`
- `WBS_LLM_API_KEY`

Do not print their values.

The GitHub remote is:

    git@github.com:martinlindholmdev/pokemon-battle.git

The GitHub HTTPS URL for Render is:

    https://github.com/martinlindholmdev/pokemon-battle

The Render workspace ID seen in the dashboard was:

    tea-d6k0rq75r7bs73a001ag

Verify this with the Render API instead of assuming it if possible.

## Plan of Work

Create a root npm workspace with `client` and `server` packages. The server is the production entry point: it exposes `/api/*` routes and serves `client/dist` after the Vite build. The frontend calls the backend with same-origin `/api` URLs so no production CORS complexity is needed.

The app should be intentionally polished but not over-engineered. Use TypeScript throughout. Use Mongoose models for users and scores. Use bcrypt for password hashing, JWT for auth, and schema validation at route boundaries. Use React Router, localStorage for roster and token persistence, and PokeAPI for Pokemon data.

Use a modern battle cockpit / Pokedex dashboard visual style: dark readable base, Pokemon type accents, responsive bento-style sections, animated HP bars, strong loading/error/empty states, and a usable first screen rather than a marketing landing page.

## Concrete Steps

Run commands from:

    C:\Users\Martin\dev\projects\wbs-projects\pokemon-battle

First confirm environment and repo:

    git status --short --branch
    node --version
    npm --version
    if ($env:RENDER_API_KEY) { "RENDER_API_KEY=<set>" } else { "RENDER_API_KEY=<missing>" }

If `RENDER_API_KEY` is missing, implementation can continue locally, but autonomous deployment is blocked until a new session sees the variable.

Scaffold files directly in this repo. Suggested structure:

    package.json
    package-lock.json
    .env.example
    render.yaml
    client/package.json
    client/index.html
    client/src/main.tsx
    client/src/App.tsx
    client/src/styles.css
    client/src/api/*
    client/src/auth/*
    client/src/components/*
    client/src/pages/*
    client/src/types/*
    server/package.json
    server/tsconfig.json
    server/src/index.ts
    server/src/config/env.ts
    server/src/config/db.ts
    server/src/middleware/auth.ts
    server/src/middleware/error.ts
    server/src/models/User.ts
    server/src/models/Score.ts
    server/src/routes/auth.ts
    server/src/routes/leaderboard.ts
    server/src/routes/health.ts
    server/src/routes/ai.ts
    server/src/services/aiCoach.ts
    server/src/utils/*

Root scripts must include:

    npm run dev
    npm run build
    npm start
    npm run lint
    npm run typecheck

Render must be able to run:

    npm ci && npm run build
    npm start

## Milestones

### Milestone 1: Workspace and Tooling

Create npm workspaces and install dependencies. Use Vite React TypeScript for `client`. Use Express TypeScript for `server`.

Expected dependencies include:

- root dev: `concurrently`
- client: `@vitejs/plugin-react`, `vite`, `typescript`, `react`, `react-dom`, `react-router-dom`, `lucide-react`
- styling: `tailwindcss` or Vite-compatible Tailwind package, plus PostCSS config if needed
- server: `express`, `mongoose`, `dotenv`, `bcryptjs`, `jsonwebtoken`, `zod`, `helmet`, `express-rate-limit`
- server dev: `tsx`, `typescript`, `@types/*`

Acceptance:

    npm install
    npm run typecheck

Typecheck may initially require app code; finish the milestone with scripts present and no missing package errors.

### Milestone 2: Backend API

Implement Express app. Load `.env` with dotenv. Connect to MongoDB using `MONGODB_ATLAS_URI` in production and `MONGODB_URI` otherwise, with fallback to either variable if only one exists. Add `GET /api/health`.

Implement auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- JWT middleware for protected routes

Implement leaderboard:

- `GET /api/leaderboard`
- `POST /api/leaderboard`

Optional but desired: `POST /api/ai/battle-recap` that uses the WBS LLM env vars server-side and falls back to deterministic text if unavailable.

Acceptance:

    npm run build --workspace server
    npm run typecheck --workspace server

Then run the server and verify:

    Invoke-RestMethod http://localhost:4000/api/health

Expected: JSON with status ok and MongoDB connection state.

### Milestone 3: Frontend App

Implement React routes:

- `/register`
- `/login`
- `/`
- `/pokemon/:id`
- `/roster`
- `/battle`
- `/leaderboard`

Implement:

- auth context with token persistence,
- protected route component,
- PokeAPI list/details fetchers,
- roster localStorage helpers,
- battle simulation,
- leaderboard API client.

Do not expose server secrets. Client environment variables are not needed for this app.

Acceptance:

    npm run build --workspace client
    npm run typecheck --workspace client

### Milestone 4: Integrated Local Verification

Run:

    npm run build
    npm start

Verify in browser:

- app loads at `http://localhost:4000`,
- `/api/health` returns ok,
- register creates an account,
- login returns to app,
- protected pages reject anonymous access,
- Pokemon list and detail pages load,
- roster add/remove works,
- battle completes,
- score appears on leaderboard.

Use Playwright or the in-app browser for at least one desktop and one mobile viewport screenshot/check if available.

### Milestone 5: Security and Review

Run:

    npm run lint
    npm run typecheck
    npm run build
    npm audit
    git status --short --ignored

Search for risky mistakes:

    rg "WBS_LLM_API_KEY|JWT_SECRET|MONGODB_ATLAS_URI|mongodb\\+srv|RENDER_API_KEY" -g "!EXECPLAN.md" -g "!IMPLEMENTATION_HANDOFF.md" -g "!AGENTS.md" -g "!.env"
    rg "dangerouslySetInnerHTML|innerHTML|eval\\(|new Function" client server

Expected:

- no secrets outside ignored `.env`,
- no unsafe DOM/code execution patterns,
- `.env` remains ignored.

### Milestone 6: Commit and Push

Before committing:

    git status --short
    git diff -- . ':!.env'

Commit:

    git add .
    git commit -m "Build Pokemon battle app"
    git push origin main

Acceptance:

    git status --short --branch

Expected: branch up to date with `origin/main`, with `.env` ignored only.

### Milestone 7: Render Deployment

Only attempt autonomous deployment if:

    RENDER_API_KEY=<set>

Use Render REST API. Do not print secret env values.

First list owners:

    $headers = @{ Authorization = "Bearer $env:RENDER_API_KEY"; Accept = "application/json" }
    Invoke-RestMethod -Method Get -Uri "https://api.render.com/v1/owners" -Headers $headers

Select the workspace owner matching the user's workspace. Prefer the returned ID over the dashboard-observed ID if they differ.

Create a Render web service after code is pushed. Use:

- repo: `https://github.com/martinlindholmdev/pokemon-battle`
- branch: `main`
- type: `web_service`
- runtime: `node`
- region: `frankfurt` if accepted, otherwise `oregon`
- plan: `free` if accepted; if Render requires a paid plan, stop and ask for approval
- build command: `npm ci && npm run build`
- start command: `npm start`
- health check path: `/api/health`

Set Render env vars from local `.env` values, mapping:

- `NODE_ENV=production`
- `MONGODB_URI=<value of local MONGODB_ATLAS_URI>`
- `JWT_SECRET=<local JWT_SECRET>`
- `WBS_LLM_URL=<local WBS_LLM_URL>`
- `WBS_LLM_MODEL=<local WBS_LLM_MODEL>`
- `WBS_LLM_API_KEY=<local WBS_LLM_API_KEY>`

If the direct Create Service payload is rejected, fall back to committing `render.yaml` and using Render Blueprint flow only if the API supports it. Otherwise report the precise API error and leave the dashboard-created service settings ready for the user.

### Milestone 8: Live Verification

Poll the Render deploy until live or failed. Retrieve the service URL.

Verify:

    Invoke-RestMethod <service-url>/api/health

Then check in a browser:

- `<service-url>/` loads,
- `<service-url>/leaderboard` loads or redirects appropriately,
- register/login works,
- battle posts score.

Final answer must include:

- commit hash,
- Render URL,
- local verification summary,
- deployment verification summary,
- exact blocker if deployment failed.

## Validation and Acceptance

The implementation is acceptable only if the following are true or explicitly documented as blocked:

- `npm run build` succeeds.
- `npm run typecheck` succeeds.
- `npm run lint` succeeds or has justified non-fatal warnings.
- `npm audit` is run and high/critical findings are addressed or reported.
- Local `/api/health` works.
- User flow register/login/roster/battle/leaderboard works locally.
- GitHub `main` contains the implementation.
- Render deployment either succeeds and is verified, or the exact Render API blocker is reported.

## Idempotence and Recovery

The plan is safe to retry. If package installation fails, fix `package.json` or lockfile and rerun `npm install`. If MongoDB connection fails locally, test both `MONGODB_URI` and `MONGODB_ATLAS_URI` without printing values. If Render service creation succeeds but deploy fails, update code/env settings and trigger another deploy rather than creating duplicate services. Before creating a new Render service, list existing services named `pokemon-battle` and reuse/update where possible.

If a Render API call returns payment-required or plan errors, stop. Do not select a paid plan without user approval.

## Deployment Plan

Autonomous deployment is part of the test. The implementation agent should attempt Render API deployment from the new session. The only expected prerequisite is that the new process can read `RENDER_API_KEY`. If not, explain that Windows environment variables created with `setx` are only available to new processes and ask the user to restart Codex again.

## Outcomes & Retrospective

Not yet completed. The implementation agent must update this section when the app is built and after deployment is attempted.

