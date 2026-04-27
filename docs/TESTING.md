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
