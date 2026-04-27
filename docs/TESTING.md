# Testing

## Automated Checks

Run on 2026-04-27:

- `npm install`: passed, 0 vulnerabilities reported.
- `npm run typecheck`: passed.
- `npm run build --workspace server`: passed.
- `npm run build --workspace client`: passed.
- `npm run build`: passed.
- `npm run lint`: passed after moving localStorage roster reads into lazy state initializers and marking Express error-handler `next` as intentionally unused.
- `npm audit`: passed, 0 vulnerabilities.

## Local API Verification

- Production server started on port `4000`, PID `14972`.
- `GET http://localhost:4000/api/health`: returned `status: ok`, Mongo state `connected`, ping `true`.

## Browser Verification

Playwright Chromium verification passed locally:

- Register created a new user.
- Authenticated roster route loaded.
- Pokemon dashboard loaded from PokeAPI.
- Added a Pokemon to roster.
- Battle completed.
- Score posted to leaderboard.
- Leaderboard displayed the created trainer score.
- No console errors were reported by the verification script.

Screenshots:

- `docs/screenshots/local-flow-desktop.png`
- `docs/screenshots/local-mobile-390x844.png`
- `docs/screenshots/local-tablet-768x1024.png`
- `docs/screenshots/local-desktop-1440x900.png`

## Known Gaps

- No persistent automated test suite is committed yet; current verification is command-based and browser-script based.
- Battle logic is intentionally simple and does not implement full Pokemon type effectiveness.

## Render Verification

- Service `pokemon-battle` was created at `https://pokemon-battle-ffwr.onrender.com`.
- First deploy `dep-d7nkhuqqqhas73fuaro0` failed during build because Render's production environment omitted TypeScript/React type dev dependencies. The build command was updated to include dev dependencies during build.
- Second deploy `dep-d7nkk1beo5us73fc8730` reached live.
- `GET https://pokemon-battle-ffwr.onrender.com/api/health` returned `status: ok`, environment `production`, Mongo state `connected`, ping `true`.
- Live root initially returned 404; local fallback fix was verified with root HTTP 200 and health `ok` before the follow-up commit.
- Follow-up deploy `dep-d7nkn70k1i2s738321bg` reached live from commit `286bee5e0d4e9f3b4f8f373c34934ab8812ccf08`.
- Verified live `GET /api/health`, `/`, and `/leaderboard`; all returned 200-class success.
- Live Playwright verification passed for register, protected roster route, PokeAPI dashboard, roster add, battle, score post, and leaderboard display.
- Live screenshots: `docs/screenshots/live-flow-desktop.png`, `docs/screenshots/live-mobile-390x844.png`, `docs/screenshots/live-tablet-768x1024.png`, `docs/screenshots/live-desktop-1440x900.png`.
- Subsequent live auth checks timed out after Atlas network access blocked Render. This is an external Atlas allowlist issue, not a credential print/debug issue.
- Retro frontend redesign local verification: `npm run typecheck`, `npm run lint`, `npm run build`, and Playwright flow passed. The flow covered register, protected roster route, PokeAPI dashboard, roster add, battle, score post, and leaderboard display.
- Retro frontend redesign live verification: Render deploy `dep-d7nm5tojs32c73d4mdpg` reached live; `/api/health`, `/`, `/playbook`, and the full Playwright auth/roster/battle/leaderboard flow passed.
