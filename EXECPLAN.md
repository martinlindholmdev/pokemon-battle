# Pokemon Battle Kid-First Arena Polish ExecPlan

This ExecPlan is the current self-contained plan for the repository. Follow `.agent/PLANS.md` and keep this file current when making project changes.

## Purpose / Big Picture

Pokemon Battle is a single-repository full-stack app for browsing first-generation Pokemon, building a roster, playing a simple turn-based battle, posting scores, and viewing a leaderboard. The final repository should be clean, reviewable, documented, locally verified, and deployed on Render.

The current polish goal is to keep the app focused on the Pokemon product and make the battle experience clearer and more exciting for a six-year-old, pre-reader or early reader:

- kid-first React UI/UX,
- an actual 3D battle arena,
- picture-forward battle controls with short labels,
- local friend play and lightweight web friend rooms outside verified scoring,
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
- [x] Closed the leaderboard client-trust gap with signed battle tokens and server-side score recomputation.
- [x] Removed email from newly issued browser auth payloads.
- [x] Re-ran local typecheck, build, lint, audit, unsafe sink scans, forged score rejection, and verified battle token replay.
- [x] Committed and pushed security fix commit `4d8b7e61fa9eeda88bd20aabe83ada8e5d1dfdc3` to `main`.
- [x] Render deployed `4d8b7e61fa9eeda88bd20aabe83ada8e5d1dfdc3` as `dep-d7nu8sgpqo0s73812b6g`.
- [x] Verified live `/api/health`, `/leaderboard`, filtered `/api/leaderboard`, and old forged score rejection.
- [ ] Commit and push final verification-doc updates for the security deployment.
- [x] Started kid-first review for a six-year-old target audience on 2026-05-05.
- [x] Reviewed child UX references: large visual targets, low text, recognizable icons, immediate feedback, foreground clarity, and simple prompts.
- [x] Chose React Three Fiber for a scoped React-hosted 3D arena while keeping battle rules outside the renderer.
- [x] Added kid-first battle UI, animation feedback, same-PC friend play, and web friend rooms.
- [x] Re-ran local typecheck, build, lint, audit, secret scan, unsafe sink scan, and browser playtest screenshots.
- [ ] Resolve local MongoDB health or document it as blocked for authenticated local verification.
- [ ] Commit, push, deploy, and live-verify this kid-first polish.

## Surprises & Discoveries

- The most-starred battle simulator repo is `smogon/pokemon-showdown`, but its main repository is the server/simulator, not the frontend.
- The actual Pokemon Showdown client is AGPL-3.0, so its frontend code should not be copied into this app.
- The old compatibility alias for `GET /leaderboard` conflicted with the React `/leaderboard` page on direct browser navigation. The server now serves the React page when the request accepts HTML and leaves JSON APIs under `/api/leaderboard`.
- The live leaderboard contained forged rows because `POST /api/leaderboard` trusted authenticated client-submitted score fields. The app now hides unverifiable legacy rows from public responses without deleting database data.
- The app currently reads like a trainer dashboard for adults. For the six-year-old target, the highest-value changes are visual action buttons, fewer rule words, bigger tap targets, clearer battle state, and animation feedback when something happens.
- Real-time multiplayer is larger than the current app architecture, but a safe first step is local pass-and-play plus short-lived web friend rooms outside the leaderboard path.
- The current local production server starts, but `/api/health` is degraded because MongoDB is disconnected in this session. Guest practice and friend-room flows still verify because they do not require MongoDB.

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

- Decision: Make leaderboard score creation server-verified.
  Rationale: Authenticated clients can forge browser-calculated results. Battle start now returns a signed, short-lived token bound to the user; score creation accepts only that token and a bounded move list, then recomputes score, outcome, team, and opponent on the server.
  Date/Author: 2026-04-28 / Codex.

- Decision: Keep friend battles separate from verified leaderboard scoring.
  Rationale: Friend play should be easy for a child, but public scores must remain server-verified and authenticated. Friend rooms can be lightweight play sessions without score posting.
  Date/Author: 2026-05-05 / Codex.

- Decision: Use React Three Fiber for the arena scene, with DOM controls and battle state still owned by React.
  Rationale: The app is React-first, and the Game Studio guidance recommends React Three Fiber for React-hosted 3D while keeping simulation outside the renderer.
  Date/Author: 2026-05-05 / Codex.

## Context and Orientation

Repository root:

    C:\Users\Martin\dev\projects\wbs-projects\pokemon-battle

Important files:

- `README.md`: GitHub-facing overview with screenshots.
- `client/src`: React app.
- `client/src/components/BattleArena3D.tsx`: React-hosted 3D battle arena scene.
- `server/src`: Express API.
- `server/src/services/battle.ts`: battle token verification, result replay, public leaderboard row filter.
- `server/src/routes/friendBattles.ts`: lightweight friend-room battle API.
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

1. Keep the product scope tight: Pokedex, roster, battle, friend rooms, leaderboard, docs, security, deployment.
2. Preserve the authenticated, signed solo battle and leaderboard path.
3. Add kid-first UI with recognizable symbols, large targets, visual feedback, and reduced dense copy.
4. Keep 3D rendering as presentation only; battle rules remain in ordinary TypeScript state/server services.
5. Run local checks before every commit.
6. Commit and push to `main`.
7. Verify Render live health and browser flow after deployment.

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
- server-mediated battle start,
- battle completion,
- leaderboard row display,
- forged `POST /api/leaderboard` body is rejected,
- desktop/tablet/mobile screenshot check.
- kid-first battle first screen is clear without dense text,
- Strike, Guard, and Focus have visual symbols and feedback,
- local friend mode works on one computer,
- web friend-room create/join flow works or an exact blocker is documented,
- 3D arena canvas renders nonblank on desktop and mobile.

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
- leaderboard writes do not trust client-submitted final score fields,
- docs record residual risks.

### Milestone 4: Commit, Push, Deploy

Commit cleanup changes, push to `main`, let Render deploy, and verify live behavior.

Acceptance:

- `main` is up to date with `origin/main`,
- Render deploy succeeds or the exact blocker is documented,
- live `/api/health` returns ok,
- live app flow works.

### Milestone 5: Kid-First Arena And Friend Play

Add a visually clear battle experience for an early reader.

Acceptance:

- battle screen has an arena scene rather than only panels,
- core moves use icons/symbols and short labels,
- cards and fighters animate on meaningful state changes,
- friend play works locally and via a lightweight web room,
- verified solo leaderboard flow still works,
- desktop/mobile screenshots show no clipped text or blocked playfield.

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

Latest outcome (2026-04-28): the leaderboard integrity issue was reproduced and fixed by replacing client-submitted score fields with signed battle tokens plus server-side result replay. Local typecheck, build, lint, audit, unsafe sink scans, forged score rejection, verified battle token replay, and browser flow passed. Render deploy `dep-d7nu8sgpqo0s73812b6g` is live and live verification passed for health, `/leaderboard`, filtered leaderboard rows, and old forged score rejection.

Current outcome target (2026-05-05): kid-first arena polish and friend play are implemented locally. Typecheck, lint, build, audit, secret scan, unsafe sink scan, and browser playtest passed for guest solo practice, same-PC friend battle, web friend-room create/join, and mobile arena rendering. Authenticated local score verification is blocked by local MongoDB health returning degraded/disconnected.
