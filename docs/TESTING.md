# Testing

Date: 2026-05-05

## Automated Checks

Latest local kid-first arena pass:

- `npm run typecheck`: passed.
- `npm run build`: passed.
  - Note: Vite reports the lazy-loaded `BattlePage` chunk is larger than 500 KB because it contains the 3D arena stack. The main route bundle remains code-split from the battle route.
- `npm run lint`: passed.
- `npm audit`: passed with 0 vulnerabilities.
- Secret scan: no committed secret values found; only env names, placeholders, docs, and server env references.
- Unsafe DOM/code scan: no `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `document.write`, or `insertAdjacentHTML` matches in `client` or `server`.
- Request trust-boundary scan: no remaining score/recap write accepts arbitrary client-submitted result fields.

## Local API Verification

- Production server started on port `4000`.
- `GET http://localhost:4000/api/health`: returned HTTP `503`, `status: degraded`, Mongo state `disconnected`, ping `false` in this local session. Guest practice and friend-room flows were still verified because they do not require MongoDB.
- Direct browser navigation to `http://localhost:4000/leaderboard` returned the React leaderboard page.
- Authenticated score, AI recap, and forged score rejection were not rerun in this local session because MongoDB was disconnected. The existing server-side validation code was typechecked, linted, and built.
- `POST /api/friend-battles` created a six-character room code through the browser flow.
- `POST /api/friend-battles/:code/join` joined the same room as Blue through the browser flow.

## Browser Verification

Playwright Chromium verification passed locally after the kid-first arena pass:

- Dashboard loaded Pokemon cards from PokeAPI.
- Desktop, tablet, and mobile screenshots were captured.
- `/battle` loaded for a guest without login.
- Solo practice battle started from starter picks.
- The React Three Fiber arena canvas rendered with a desktop bounding box of about `1100x538`.
- Hit/Block/Power controls were visible as large icon buttons.
- Same-PC friend battle started and advanced from Red turn to Blue turn.
- Web friend room created a valid six-character code and joined as Blue.
- Mobile `/battle` loaded, started, rendered the 3D arena, and captured without obvious text overlap.
- No app console warnings or errors were reported. Headless Chromium emitted expected software WebGL and GPU readback warnings during screenshot capture.

Screenshots:

- `docs/screenshots/local-desktop-1440x900.png`
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
