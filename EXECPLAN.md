# Pokemon Battle Final Polish ExecPlan

This ExecPlan is the current self-contained plan for the repository. Follow `.agent/PLANS.md` and keep this file current when making project changes.

## Purpose / Big Picture

Pokemon Battle is a single-repository full-stack app for browsing first-generation Pokemon, building a roster, playing a simple turn-based battle, posting scores, and viewing a leaderboard. The final repository should be clean, reviewable, documented, locally verified, and deployed on Render.

The current cleanup goal is to keep the app focused on the Pokemon product:

- polished React UI/UX,
- secure Express/MongoDB API,
- clear README and docs,
- no post-deploy workflow presentation surface,
- passing local checks,
- committed, pushed, deployed, and live-verified.

## Progress

- [x] Read `.agent/PLANS.md` and this ExecPlan.
- [x] Confirmed `RENDER_API_KEY=<set>` in the current session without printing the value.
- [x] Found the highest-starred battle/frontend references and documented the license-safe decision in `docs/UX_RESEARCH.md`.
- [x] Removed the standalone workflow page, `/api/agent-workflow`, workflow docs, and unused `ai` dependency.
- [x] Reworked the frontend into a cleaner trainer command-center UI.
- [x] Added a not-found page for removed/invalid routes.
- [x] Added stricter security headers, removed leaderboard email exposure, and rate-limited score/recap writes.
- [x] Refreshed screenshots and GitHub-facing docs.
- [x] Local `typecheck`, `build`, `lint`, `audit`, secret scan, unsafe DOM scan, health check, and Playwright flow passed.
- [x] Committed and pushed cleanup commit `d3cc0210ef72fc218d585b17ce5fdbf58a47b21f` to `main`.
- [x] Render deployed `d3cc0210ef72fc218d585b17ce5fdbf58a47b21f` as `dep-d7noct4m0tmc73baa0lg`.
- [x] Verified live `/api/health`, `/`, `/leaderboard`, removed `/api/agent-workflow`, and a full browser flow.
- [ ] Commit and push final verification-doc updates.
- [ ] Let Render deploy the final docs commit and re-check live health.

## Surprises & Discoveries

- The most-starred battle simulator repo is `smogon/pokemon-showdown`, but its main repository is the server/simulator, not the frontend.
- The actual Pokemon Showdown client is AGPL-3.0, so its frontend code should not be copied into this app.
- The old compatibility alias for `GET /leaderboard` conflicted with the React `/leaderboard` page on direct browser navigation. The server now serves the React page when the request accepts HTML and leaves JSON APIs under `/api/leaderboard`.

## Decision Log

- Decision: Do not copy third-party frontend source.
  Rationale: Pokemon Showdown Client is AGPL-3.0, and other references do not match this app's architecture. The UI is original React/CSS with documented UX inspiration only.
  Date/Author: 2026-04-27 / Codex.

- Decision: Remove the workflow presentation feature from runtime and docs.
  Rationale: The user wants the repo and app focused on the Pokemon product, not the autonomous build workflow experiment.
  Date/Author: 2026-04-27 / Codex.

- Decision: Keep JWT localStorage persistence documented as a tradeoff.
  Rationale: The WBS brief required browser JWT persistence. Mitigate with short token lifetime, no unsafe DOM sinks, CSP, and server-side secrets only.
  Date/Author: 2026-04-27 / Codex.

- Decision: Use Render as the deployment target.
  Rationale: The app needs an Express backend plus static React hosting.
  Date/Author: 2026-04-27 / project.

## Context and Orientation

Repository root:

    C:\Users\Martin\dev\projects\wbs-projects\pokemon-battle

Important files:

- `README.md`: GitHub-facing overview with screenshots.
- `client/src`: React app.
- `server/src`: Express API.
- `docs/ARCHITECTURE.md`: architecture and routes.
- `docs/RUNBOOK.md`: local/deploy operations.
- `docs/TESTING.md`: checks and verification notes.
- `docs/SECURITY_REPORT.md`: security pass and residual risks.
- `docs/UX_RESEARCH.md`: reference/license decisions.
- `docs/IMPLEMENTATION_LOG.md`: concise implementation and verification log.

Production URL:

    https://pokemon-battle-ffwr.onrender.com

Do not print or commit `.env`, API keys, JWT secrets, MongoDB URIs, Render API keys, or other secrets.

## Plan of Work

1. Keep the product scope tight: Pokedex, roster, battle, leaderboard, docs, security, deployment.
2. Prefer minimal, readable changes that follow the existing React/Vite/Express structure.
3. Run local checks before every commit.
4. Commit and push to `main`.
5. Verify Render live health and browser flow after deployment.

## Concrete Steps

Run from the repository root:

```powershell
npm run typecheck
npm run build
npm run lint
npm audit
rg "WBS_LLM_API_KEY|JWT_SECRET|MONGODB_ATLAS_URI|mongodb\\+srv|RENDER_API_KEY" -g "!EXECPLAN.md" -g "!AGENTS.md" -g "!.env"
rg "dangerouslySetInnerHTML|innerHTML|eval\\(|new Function|document\\.write|insertAdjacentHTML" client server
```

Production-style local verification:

```powershell
npm start
Invoke-RestMethod http://localhost:4000/api/health
```

Browser verification must cover:

- `/` loads Pokemon cards,
- `/leaderboard` loads the React page on direct navigation,
- register/login,
- roster add,
- battle completion,
- leaderboard row display,
- desktop/tablet/mobile screenshot check.

## Milestones

### Milestone 1: Cleanup

Remove non-product workflow runtime and docs.

Acceptance:

- no `AgentWorkflowPage`,
- no `/api/agent-workflow`,
- no `ai` package unless another production feature requires it,
- docs no longer present workflow as part of the app.

### Milestone 2: Product Polish

Improve the frontend while preserving current behavior.

Acceptance:

- app remains a usable product on the first screen,
- no clipped/overlapping text in desktop/tablet/mobile screenshots,
- battle flow still works.

### Milestone 3: Security And Diagnosis

Run security scans and fix high-value issues.

Acceptance:

- no committed secrets,
- no unsafe DOM/code execution sinks,
- dependency audit is clean or documented,
- public API responses do not expose unnecessary private data,
- docs record residual risks.

### Milestone 4: Commit, Push, Deploy

Commit cleanup changes, push to `main`, let Render deploy, and verify live behavior.

Acceptance:

- `main` is up to date with `origin/main`,
- Render deploy succeeds or the exact blocker is documented,
- live `/api/health` returns ok,
- live app flow works.

## Validation and Acceptance

The repository is acceptable only if these are true or explicitly documented as blocked:

- `npm run typecheck` succeeds.
- `npm run build` succeeds.
- `npm run lint` succeeds.
- `npm audit` succeeds or remaining advisories are documented.
- local `/api/health` works.
- local browser flow works.
- changes are committed and pushed.
- Render deploy succeeds and live health/browser flow are verified.

## Idempotence and Recovery

This plan is safe to retry. If a command fails, fix the scoped issue and rerun the failed command. If Render deployment fails, inspect Render service logs and redeploy from a normal commit. Do not use destructive git commands without explicit approval.

If Atlas blocks Render network access, report it as an external Atlas allowlist blocker. Do not print connection strings.

## Deployment Plan

Render web service:

- repo: `https://github.com/martinlindholmdev/pokemon-battle`
- branch: `main`
- build command: `npm ci --include=dev && npm run build`
- start command: `npm start`
- health path: `/api/health`
- service URL: `https://pokemon-battle-ffwr.onrender.com`

Use the Render API only if `RENDER_API_KEY` is present in the process environment. Do not select a paid plan without explicit approval.

## Outcomes & Retrospective

Latest outcome (2026-04-27): cleanup, UI polish, security tightening, docs refresh, local verification, push, Render deploy, and live browser verification have been completed for commit `d3cc0210ef72fc218d585b17ce5fdbf58a47b21f`. Final verification docs are being committed as the last repository update.
