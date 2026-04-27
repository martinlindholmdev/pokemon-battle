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
- [x] (2026-04-27) Plan-review session confirmed `RENDER_API_KEY=<set>` without printing the value.
- [x] (2026-04-27) Plan-review session confirmed Render owner ID `tea-d6k0rq75r7bs73a001ag` through `GET /v1/owners`.
- [x] (2026-04-27) Plan-review session found no existing Render service named like `pokemon-battle`.
- [ ] User pre-run task: temporarily allow Atlas Network Access from `0.0.0.0/0` before starting the autonomous implementation run, then remove or tighten it after live verification.
- [ ] Confirm new implementation session can read `RENDER_API_KEY`.
- [x] (2026-04-27) Confirmed implementation session can read `RENDER_API_KEY`.
- [x] (2026-04-27) Scaffolded npm workspace with `client`, `server`, docs, `.env.example`, and Render config.
- [x] (2026-04-27) Implemented backend health, auth, leaderboard, aliases, validation, rate limits, and optional AI recap fallback.
- [x] (2026-04-27) Implemented frontend routes, auth state, PokeAPI fetching, roster persistence, battle simulation, leaderboard UI, and responsive CSS.
- [x] (2026-04-27) Ran local typecheck, build, lint, audit, health, and Playwright browser flow checks successfully.
- [x] (2026-04-27) Committed and pushed implementation commit `d3e1c70637a5b74080f979ace630b76360d75f57` to `main`.
- [ ] Deploy to Render.
- [ ] Verify live deployment.

## Surprises & Discoveries

- Render initially guessed the repo was a Rust app because the app code had not been scaffolded yet. Do not create the Render service until package scripts exist.
- The current planning session could not see `RENDER_API_KEY` after `setx`, which is expected on Windows. A new Codex session must be started so the process inherits the variable.
- A later plan-review session could see `RENDER_API_KEY`, but the implementation session must still re-check its own process environment.
- Local Atlas connectivity does not prove Render-to-Atlas connectivity. Render-hosted services need Atlas network access for Render outbound IP ranges, or Atlas must already allow the relevant network range.
- Local MongoDB ping succeeded but collection reads failed with authentication. The server now verifies an application collection read on startup and falls back to the alternate configured Mongo URI without logging either URI.
- First Render deploy failed because the service had `NODE_ENV=production`, causing `npm ci` to omit dev dependencies needed for TypeScript/Vite build. Build command was updated to `npm ci --include=dev && npm run build`.
- Second Render deploy reached `live` and production `/api/health` returned ok, but the first live root page check returned 404. The server SPA fallback was changed from a regex route to explicit non-API GET handling with client-dist path candidate checks.
- User chose the max-autonomy Atlas strategy: temporarily allow `0.0.0.0/0` in Atlas Network Access for this demo run, then remove or tighten it after Render live verification. This is intentionally temporary and depends on strong database credentials.
- GitHub MCP code search initially failed because the local MCP server was not receiving `GITHUB_PERSONAL_ACCESS_TOKEN`. The token was stored as a Windows user environment variable, `C:\Users\Martin\.codex\config.toml` was updated to whitelist `env_vars = ["GITHUB_PERSONAL_ACCESS_TOKEN"]` for `[mcp_servers.github]`, and a restarted Codex session confirmed GitHub MCP code search works.

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

- Decision: Attempt one autonomous implementation run and use milestone documentation as the context-management mechanism.
  Rationale: The repo starts from an empty scaffold and the task includes full-stack implementation, local browser verification, commit/push, Render service creation, deploy polling, and live verification. The implementation session should continue through compaction/resume by relying on `EXECPLAN.md` and `docs/IMPLEMENTATION_LOG.md`. It should stop only for true external blockers such as missing credentials, paid-plan approval, destructive git action, or Atlas/network access that cannot be changed with available credentials.
  Date/Author: 2026-04-27 / plan-review agent.

- Decision: Do not adopt AI Elements Workflow as a required dependency for the MVP.
  Rationale: The AI Elements Workflow example is useful inspiration for visualizing state transitions, but its documented setup targets Next.js, React 19, shadcn/ui, Tailwind CSS 4, AI SDK setup, and `@xyflow/react`. This repository is scoped to a Vite React client plus Express server on Render. Switching stacks or adding a React Flow/shadcn workflow surface would increase implementation and styling risk. If time remains after required flows are verified, the implementation may add a lightweight battle-step visualization using local components. Do not migrate to Next.js or require AI Elements for completion.
  Date/Author: 2026-04-27 / plan-review agent.

- Decision: Defer the Agentic Workflow Dashboard to a separate post-deploy session.
  Rationale: The workflow visualizer is valuable for the user's group presentation because it explains the autonomous build/deploy process, but it is not required for the Pokemon app to be built and deployed. Adding it before the MVP would compete with the app, docs, security review, and deployment verification. After the app is live, run a focused follow-up session from `POST_DEPLOY_AGENT_WORKFLOW_PLAN.md` to evaluate AI Elements/React Flow versus a lightweight local graph, using the completed implementation log and deployment evidence as the data source.
  Date/Author: 2026-04-27 / plan-review agent.

- Decision: Treat Vercel AI SDK Core as optional server-side infrastructure, not a required frontend/UI dependency.
  Rationale: Vercel AI SDK itself supports Node.js and React and can standardize model calls, structured generation, and provider switching. However, this repo already has `WBS_LLM_URL`, `WBS_LLM_MODEL`, and `WBS_LLM_API_KEY`, and the exact compatibility of that endpoint is not documented in the repo. The implementation should keep the AI battle recap optional and backend-only. Use simple server-side `fetch` first unless the WBS endpoint is confirmed OpenAI-compatible; if confirmed and low-risk, `ai` plus `@ai-sdk/openai-compatible` may be used behind `server/src/services/aiCoach.ts`. Never expose AI keys to the client and always fall back to deterministic recap text.
  Date/Author: 2026-04-27 / plan-review agent.

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
- `POST_DEPLOY_AGENT_WORKFLOW_PLAN.md`: follow-up plan for a separate session after the MVP is live.

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

The Render workspace ID was verified by a plan-review session through `GET https://api.render.com/v1/owners`:

    tea-d6k0rq75r7bs73a001ag

The implementation session should still prefer the Render API response over this recorded value if the API returns a different workspace.

## Plan of Work

Create a root npm workspace with `client` and `server` packages. The server is the production entry point: it exposes `/api/*` routes and serves `client/dist` after the Vite build. The frontend calls the backend with same-origin `/api` URLs so no production CORS complexity is needed.

The app should be intentionally polished but not over-engineered. Use TypeScript throughout. Use Mongoose models for users and scores. Use bcrypt for password hashing, JWT for auth, and schema validation at route boundaries. Use React Router, localStorage for roster and token persistence, and PokeAPI for Pokemon data. Keep PokeAPI usage modest: do not bulk-fetch every Pokemon, cache list/detail responses client-side with a simple bounded cache or browser storage, and show friendly errors if PokeAPI is unavailable.

Use a modern battle cockpit / Pokedex dashboard visual style: dark readable base, Pokemon type accents, responsive bento-style sections, animated HP bars, strong loading/error/empty states, and a usable first screen rather than a marketing landing page.

Before implementing the main frontend styling, do a short UX/code-reference research pass and record the result in `docs/UX_RESEARCH.md`. Use official Pokemon/Pokedex references, PokeAPI artwork constraints, modern game/dashboard UI examples, and relevant open-source Pokemon/Pokedex/battle apps on GitHub. The goal is to study concrete component structure, responsive behavior, HP bars, type badges, card grids, battle logs, empty/error states, and CSS organization from real implementations. Do not blindly copy code. For each open-source reference, record the repository URL, license status, relevant files inspected, what was learned, and whether any code was adapted. If a repo has no license or an incompatible license, use it only as behavioral/visual inspiration. If code is adapted from a permissively licensed source, keep the adaptation small, transform it to this app's architecture/style, and add attribution in `docs/UX_RESEARCH.md`.

The AI Elements Workflow example was reviewed as visual inspiration only. A full AI Elements/React Flow workflow canvas is not required for the MVP and should not drive a framework change. The separate post-deploy workflow visualizer is documented in `POST_DEPLOY_AGENT_WORKFLOW_PLAN.md`. If an MVP workflow-like visual is useful, prefer only a lightweight battle progression strip or turn timeline implemented with ordinary React/CSS.

Execution control: prefer one continuous implementation run and do not stop merely because context is getting long. Treat `EXECPLAN.md` and the documentation files as the durable memory that survives compaction/resume. Update `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` after each milestone or whenever a material blocker is discovered. Stop only for true external blockers: missing `RENDER_API_KEY` at deployment time, paid Render requirement, destructive git action requiring approval, unavailable required credentials, or an Atlas/network action that cannot be performed with available credentials.

## Target Architecture

Use a single repository with npm workspaces:

- `client`: Vite React TypeScript SPA.
- `server`: Express TypeScript API and production static-file host.
- `docs`: human-readable project documentation created during implementation.

Production request flow:

1. Browser requests the Render web service.
2. Express serves `client/dist` for non-API routes and handles SPA fallback.
3. React calls same-origin API routes under `/api`.
4. Express validates requests with Zod, authenticates JWTs, reads/writes MongoDB Atlas through Mongoose, and calls PokeAPI only from the client unless a server-side feature explicitly needs otherwise.

Backend structure should separate concerns without over-engineering:

- `server/src/index.ts`: process entry, port binding on `0.0.0.0`, graceful shutdown.
- `server/src/app.ts`: Express app composition, middleware, routes, static serving.
- `server/src/config/*`: env parsing and database connection.
- `server/src/routes/*`: route handlers.
- `server/src/models/*`: Mongoose models.
- `server/src/middleware/*`: auth, validation errors, rate limits, centralized error handling.
- `server/src/services/*`: optional AI recap and external service helpers.

Frontend structure should support human debugging:

- `client/src/api/*`: API and PokeAPI clients.
- `client/src/auth/*`: auth context, token helpers, protected route.
- `client/src/components/*`: shared UI primitives and Pokemon/battle components.
- `client/src/pages/*`: route-level views.
- `client/src/types/*`: shared frontend types.

Canonical backend routes are `/api/auth/register`, `/api/auth/login`, `/api/leaderboard`, and `/api/health`. To satisfy the WBS wording and make instructor testing easier, add simple compatibility aliases for `/auth/register`, `/auth/login`, `GET /leaderboard`, and `POST /leaderboard` that reuse the same handlers if doing so stays low-risk.

## Tool, Skill, and Agent Use

Use the available Codex tools deliberately:

- Use shell commands for install/build/test/git/Render API checks.
- Use `apply_patch` for manual file edits.
- Use Browser Use or Playwright for local desktop/mobile UI verification after the frontend is functional.
- Use `gh` or the GitHub connector only for read-only repo verification or if normal git commands need GitHub context.
- Use official docs or current primary sources only when a current external assumption is uncertain.
- Use GitHub MCP code search, repo search, or `gh` for open-source UX/code-reference research before frontend styling. A plan-review session confirmed `mcp__github__.search_code` works after the GitHub MCP env-var whitelist fix. If generic code search becomes unavailable again, search repositories first, then inspect selected public repos through the GitHub app, `gh api`, or a shallow clone outside the project workspace. Do not vendor reference repositories into this repo.

Skills that may apply during implementation:

- `browser-use:browser` or `playwright` for browser verification.
- `develop-web-game` for the battle interaction test loop if it helps verify gameplay behavior.
- `github:github` or normal `git`/`gh` for repository status and push verification.
- `security-best-practices` only if doing an explicit security pass/report; keep fixes scoped.

Subagents are optional, not required. The primary implementation agent owns the codebase and should not delegate core blocking work. If subagents are available and useful, use them only for bounded sidecar work such as:

- read-only review of security/report completeness,
- independent UI verification after the app runs,
- focused inspection of deployment logs or Render API errors.

Do not split overlapping file edits across subagents. Do not rely on automations to continue this run. Automations are not a substitute for an active implementation session and should only be created if the user explicitly asks for scheduled follow-up.

## Post-Deploy Follow-Up

After the MVP is built, pushed, deployed, and live-verified, run a separate session for the agentic workflow visualizer. Use `POST_DEPLOY_AGENT_WORKFLOW_PLAN.md` as the starting prompt/context. This follow-up should present the autonomous build/deploy workflow itself: milestones, evidence, fallbacks, security checks, deployment status, and human cleanup tasks. It should not block MVP completion.

## Context and Human Debugging Protocol

Create and maintain human-readable artifacts as part of the implementation, not afterthoughts:

- `README.md`: polished GitHub-facing overview with features, stack, screenshots or screenshot placeholders, local setup, scripts, environment variable names, deployment notes, and troubleshooting.
- `docs/ARCHITECTURE.md`: component diagram, request/data flow, data models, route map, environment-variable flow, and key design decisions.
- `docs/RUNBOOK.md`: local dev, production start, Render deployment, health checks, logs, common failures, rollback/redeploy, secret rotation, and maintenance checklist.
- `docs/TESTING.md`: automated checks, manual browser flow checklist, desktop/mobile verification notes, and known test gaps.
- `docs/SECURITY_REPORT.md`: dependency audit summary, secret-scan summary, auth/token controls, validation/rate-limit/CORS posture, localStorage JWT tradeoff, residual risks, and remediation notes.
- `docs/UX_RESEARCH.md`: official visual references, open-source code references with license status, relevant files inspected, design decisions, component inventory, responsive acceptance criteria, screenshot checklist, and any explicit tradeoffs made to keep the app shippable.
- `docs/IMPLEMENTATION_LOG.md`: concise chronological log of important commands, outcomes, ports/PIDs used, deploy IDs, service URL, blockers, and decisions. Summarize command results; do not paste secrets or huge logs.

Before and after context-heavy phases, write the current state to `EXECPLAN.md` and `docs/IMPLEMENTATION_LOG.md`. If the session resumes after compaction, continue from those files instead of restarting or re-inspecting everything.

Fallback rules:

- Missing `RENDER_API_KEY`: finish local build/checks/commit/push, then report deployment blocked.
- Package install or `npm ci` failure: fix package/lock mismatch; if registry/network outage persists, document exact command/error.
- Lint/type/build failure: fix in scope and rerun the failed check.
- `npm audit` high/critical findings: fix when a non-breaking update exists; otherwise document advisory, affected package, exploit path, and why it remains.
- Local MongoDB failure: try Atlas URI locally without printing values; document which path is used.
- Render service create `409`: list existing services and reuse/update instead of creating duplicates.
- Render API `402` or paid-plan requirement: stop and ask for user approval.
- Render deploy succeeds but `/api/health` fails MongoDB ping: report Atlas network-access blocker and needed Render outbound IP/Atlas allowlist action.
- PokeAPI outage: app must show a friendly error and keep roster/auth/leaderboard flows understandable; do not fake successful PokeAPI data.

User pre-run Atlas task:

1. Open MongoDB Atlas.
2. Select the project that owns the cluster used by `MONGODB_ATLAS_URI`.
3. Go to `Security` -> `Network Access`.
4. Click `Add IP Address`.
5. Choose `Allow Access From Anywhere` or enter `0.0.0.0/0`.
6. Add a clear comment such as `Temporary Render demo access - remove after Pokemon deployment`.
7. Save and wait until the entry is active.
8. After the Render app is live and verified, remove this broad entry or replace it with the Render service's outbound IP ranges.

Do not print or paste the Atlas connection string while doing this. The implementation session should remind the user in its final answer to remove or tighten `0.0.0.0/0` after deployment.

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
    README.md
    docs/ARCHITECTURE.md
    docs/RUNBOOK.md
    docs/TESTING.md
    docs/SECURITY_REPORT.md
    docs/UX_RESEARCH.md
    docs/IMPLEMENTATION_LOG.md

Root scripts must include:

    npm run dev
    npm run build
    npm start
    npm run lint
    npm run typecheck

Render must be able to run:

    npm ci && npm run build
    npm start

The root `package.json` must include a bounded Node engine compatible with this local environment and Render:

    "engines": {
      "node": ">=24 <25"
    }

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

Implement Express app. Load `.env` with dotenv. Connect to MongoDB using `MONGODB_ATLAS_URI` in production and `MONGODB_URI` otherwise, with fallback to either variable if only one exists. Add `GET /api/health`. The health endpoint should return status, timestamp, environment name, MongoDB connection state, and should attempt a lightweight database ping when connected so Render health checks catch broken Atlas access.

Implement auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- JWT middleware for protected routes
- signed JWTs with an explicit short expiration, for example `expiresIn: "2h"`

Implement leaderboard:

- `GET /api/leaderboard`
- `POST /api/leaderboard`

Optional but desired: `POST /api/ai/battle-recap` that uses the WBS LLM env vars server-side and falls back to deterministic text if unavailable.

For the optional AI recap, keep all model calls in `server/src/services/aiCoach.ts`. Default to a small direct `fetch` integration against `WBS_LLM_URL` because that is the known local contract. If inspection confirms the endpoint is OpenAI-compatible and the dependency cost stays small, the server may instead use Vercel AI SDK Core with `@ai-sdk/openai-compatible`. This must remain optional; app completion must not depend on AI provider availability.

Acceptance:

    npm run build --workspace server
    npm run typecheck --workspace server

Then run the server and verify:

    Invoke-RestMethod http://localhost:4000/api/health

Expected: JSON with status ok and MongoDB connection state.

### Milestone 3: Frontend App

Start with a bounded UX research and design brief before building the interface:

- review official Pokemon/Pokedex visual references and PokeAPI artwork availability,
- use GitHub MCP/repo search, `gh`, or shallow public-repo inspection to review at least three open-source Pokemon/Pokedex/battle apps with relevant frontend code,
- inspect each selected repo's license before using source code as more than reference,
- review a small number of modern game/dashboard UI references for layout and state handling,
- record links, licenses, files inspected, observations, source-code patterns learned, rejected patterns, and final local design choices in `docs/UX_RESEARCH.md`,
- define reusable CSS/Tailwind tokens for colors, surfaces, spacing, type scale, focus states, and Pokemon type badges,
- explicitly avoid copying third-party source code or proprietary assets unless a small, permissively licensed adaptation is intentional and attributed.

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
- small PokeAPI response cache and clear loading/error states,
- roster localStorage helpers,
- battle simulation,
- leaderboard API client.

Do not expose server secrets. Client environment variables are not needed for this app.

Acceptance:

    npm run build --workspace client
    npm run typecheck --workspace client

Visual acceptance:

- no marketing landing page; the first screen is the usable Pokemon dashboard,
- no text overlap or clipped labels at mobile, tablet, and desktop widths,
- all primary states are designed: loading, empty roster, auth error, PokeAPI error, battle in progress, win/loss, leaderboard empty/error,
- Pokemon artwork has stable layout dimensions so cards and battle panels do not jump while images load.

### Milestone 4: Integrated Local Verification

Run:

    npm run build

Start the production server without leaving the terminal blocked indefinitely. On Windows, use a background PowerShell job or `Start-Process -WindowStyle Hidden` and record the PID so it can be stopped after verification. If port `4000` is occupied, use another local port and record it in `Surprises & Discoveries`.

Verify in browser:

- app loads at the chosen local URL, normally `http://localhost:4000`,
- `/api/health` returns ok,
- register creates an account,
- login returns to app,
- protected pages reject anonymous access,
- Pokemon list and detail pages load,
- roster add/remove works,
- battle completes,
- score appears on leaderboard.

Use Playwright or the in-app browser for desktop and mobile checks if available. Minimum viewport checks: `390x844`, `768x1024`, and `1440x900`. Capture or record evidence in `docs/TESTING.md`, including any console errors, overlap/clipping issues, mobile navigation issues, and screenshot paths if screenshots are saved.

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

Create or update:

- `README.md` with a polished GitHub overview, setup, scripts, env variable names, screenshots or screenshot placeholders, deployment notes, and troubleshooting.
- `docs/ARCHITECTURE.md` with architecture/data-flow/route/model notes.
- `docs/RUNBOOK.md` with local and Render operations, health checks, logs, rollback/redeploy, secret rotation, Atlas network access, and maintenance.
- `docs/TESTING.md` with command results and manual browser verification.
- `docs/SECURITY_REPORT.md` with npm audit, secret scans, auth/token, validation, rate-limit, CORS, localStorage JWT tradeoff, and residual risks.
- `docs/UX_RESEARCH.md` with visual references, design tokens, component/state checklist, responsive notes, and final screenshots or screenshot paths if available.
- `docs/IMPLEMENTATION_LOG.md` with concise chronological implementation/debugging notes.

If CodeRabbit, Codex review, or a subagent reviewer is available, it may be used as an additional pass after these checks. Treat P0/P1 findings as blockers before commit. For lower-priority findings, fix what is in scope and document any deferrals.

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

For the direct Create Service API, the build and start commands belong under `serviceDetails.envSpecificDetails`, not at the top level. Shape the payload like this, filling env values from local `.env` without printing them:

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

Set Render env vars from local `.env` values, mapping:

- `NODE_ENV=production`
- `MONGODB_URI=<value of local MONGODB_ATLAS_URI>`
- `JWT_SECRET=<local JWT_SECRET>`
- `WBS_LLM_URL=<local WBS_LLM_URL>`
- `WBS_LLM_MODEL=<local WBS_LLM_MODEL>`
- `WBS_LLM_API_KEY=<local WBS_LLM_API_KEY>`

If the direct Create Service payload is rejected, fall back to committing `render.yaml` and using Render Blueprint flow only if the API supports it. Otherwise report the precise API error and leave the dashboard-created service settings ready for the user.

Atlas network access checkpoint: if Render deploys but `/api/health` fails because MongoDB cannot be reached, report this as an Atlas network-access blocker. Render services use region-based outbound IP ranges that may need to be added to the Atlas IP access list. This session does not have Atlas API credentials, so do not claim to have changed the Atlas allowlist unless that is actually done through available credentials.

### Milestone 8: Live Verification

Poll the Render deploy until live or failed. Retrieve the service URL.

Verify:

    Invoke-RestMethod <service-url>/api/health

Then check in a browser:

- `<service-url>/` loads,
- `<service-url>/leaderboard` loads or redirects appropriately,
- register/login works,
- battle posts score.

Update operational docs after live verification:

- add Render service URL, health endpoint, and deploy ID/status to `docs/IMPLEMENTATION_LOG.md`,
- add any Render free-plan caveats observed to `docs/RUNBOOK.md`,
- add live verification results and known limitations to `docs/TESTING.md`,
- add deployment/security residual risks to `docs/SECURITY_REPORT.md`.

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

The plan is safe to retry. If package installation fails, fix `package.json` or lockfile and rerun `npm install`. If MongoDB connection fails locally, test both `MONGODB_URI` and `MONGODB_ATLAS_URI` without printing values. If Render service creation succeeds but deploy fails, update code/env settings and trigger another deploy rather than creating duplicate services. Before creating a new Render service, list existing services named `pokemon-battle` and reuse/update where possible. If updating env vars on an existing Render service, remember the API replacement endpoint replaces the full env-var list; fetch existing names first and avoid deleting unrelated settings accidentally.

If a Render API call returns payment-required or plan errors, stop. Do not select a paid plan without user approval.

## Deployment Plan

Autonomous deployment is part of the test. The implementation agent should attempt Render API deployment from the new session. The expected prerequisite is that the new process can read `RENDER_API_KEY`; Render/GitHub private-repo access and Atlas network access must still be verified during deployment. If `RENDER_API_KEY` is missing, explain that Windows environment variables created with `setx` are only available to new processes and ask the user to restart Codex again.

Subagents and automations are not required for this implementation. Do not rely on automatic session triggering. If a true external blocker forces a pause, write a manual restart prompt in `Outcomes & Retrospective`. Subagents are optional only for non-blocking review or focused code inspection if the implementation environment supports them; the main implementation should stay owned by one session to avoid merge conflicts.

## Outcomes & Retrospective

Plan-review update (2026-04-27): The plan is realistic only with the execution-control and deployment clarifications above. The implementation agent must update this section when the app is built, if a handoff is needed, and after deployment is attempted.
