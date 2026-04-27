# Testing

Date: 2026-04-28

## Automated Checks

Latest local cleanup pass:

- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run lint`: passed.
- `npm audit`: passed with 0 vulnerabilities.
- Secret scan: no committed secret values found; only env names, placeholders, docs, and server env references.
- Unsafe DOM/code scan: no `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `document.write`, or `insertAdjacentHTML` matches in `client` or `server`.
- Request trust-boundary scan: no remaining score/recap write accepts arbitrary client-submitted result fields.

## Local API Verification

- Production server started on port `4000`.
- `GET http://localhost:4000/api/health`: returned `status: ok`, Mongo state `connected`, ping `true`.
- Direct browser navigation to `http://localhost:4000/leaderboard` returned the React leaderboard page.
- Forged score body with valid local JWT returned HTTP `400` validation failure.
- `POST /api/battles/start` returned a signed battle token without printing token contents.
- Server replay of an eight-move battle token produced a verified score result.
- Old arbitrary AI recap request shape returned HTTP `400` validation failure.

## Browser Verification

Playwright Chromium verification passed locally after the UI cleanup:

- Dashboard loaded Pokemon cards from PokeAPI.
- Desktop, tablet, and mobile screenshots were captured.
- Register created a new user.
- Authenticated roster route loaded.
- Added a Pokemon to roster.
- Started a battle from the selected lead Pokemon.
- Played Strike turns until a win/loss result.
- Score posted through server-verified battle token replay.
- Leaderboard displayed the created trainer score and hid forged high-score rows.
- Removed `/workflow` route shows the not-found screen instead of the deleted workflow page.
- No browser console warnings or errors were reported.

Screenshots:

- `docs/screenshots/local-desktop-1440x900.png`
- `docs/screenshots/local-tablet-768x1024.png`
- `docs/screenshots/local-mobile-390x844.png`
- `docs/screenshots/local-battle-arena.png`
- `docs/screenshots/local-flow-desktop.png`

## Known Gaps

- No persistent automated test suite is committed yet; verification is command-based and browser-script based.
- Battle logic is intentionally simple and does not implement full Pokemon type effectiveness.
- PokeAPI availability is external. The UI has friendly error states, but browsing depends on PokeAPI being reachable.

## Production Verification

Render deploy `dep-d7nu8sgpqo0s73812b6g` from commit `4d8b7e61fa9eeda88bd20aabe83ada8e5d1dfdc3` reached `live`.

Verified live:

- `GET https://pokemon-battle-ffwr.onrender.com/api/health`: `status: ok`, environment `production`, Mongo state `connected`, ping `true`.
- `GET /`: HTTP 200 HTML.
- `GET /leaderboard` with `Accept: text/html`: HTTP 200 HTML.
- `GET /api/leaderboard`: returned 25 public rows and did not include forged high-score rows such as `999999`, `Hacked!`, or `The System`.
- Forged `POST /api/leaderboard` body with a valid JWT and arbitrary `score/wins/team/opponent` fields returned HTTP `400`.
- `GET /api/agent-workflow`: HTTP 404, confirming the deleted workflow API is no longer exposed.
- Playwright browser flow passed for dashboard load, direct `/leaderboard`, removed `/workflow` not-found route, register, roster add, battle completion, score post, and leaderboard display.
- Browser console: no warnings or errors during the live verification script.
