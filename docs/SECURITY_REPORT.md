# Security Report

Date: 2026-04-28

## Executive Summary

No critical or high-severity issues are open from the current local pass. The app now rejects arbitrary client-submitted leaderboard scores: battles start with a server-signed token, and score creation recomputes the result from that token plus a bounded move list. The cleanup also removed unnecessary workflow/API surface, added a strict Helmet CSP, stopped leaderboard email exposure, and rate-limited score/recap writes.

## Critical Findings

None found.

## High Findings

None open.

## Medium Findings

1. JWT storage remains in `localStorage`.
   - Location: `client/src/auth/AuthContext.tsx`.
   - Impact: any future XSS could expose bearer tokens.
   - Current mitigation: React escaping, no unsafe DOM sinks, strict CSP in `server/src/app.ts:25-44`, two-hour JWT expiry in `server/src/middleware/auth.ts`, and no client-side secrets.
   - Reason accepted: the WBS project brief required browser JWT persistence.

## Fixed In This Pass

1. Closed the client-trusted leaderboard score gap.
   - Location: `server/src/routes/battles.ts`, `server/src/services/battle.ts`, `server/src/routes/leaderboard.ts`, `server/src/models/Score.ts`.
   - Impact: logged-in users could previously forge `score`, `wins`, `team`, and `opponent` in the `POST /api/leaderboard` body.
   - Change: the server now issues a signed battle token, accepts only `battleToken` and up to eight validated moves for score posting, verifies the token belongs to the authenticated user, computes score/win/loss/team/opponent server-side, and caps new `Score` documents at server-verified bounds.

2. Filtered unverifiable legacy leaderboard rows from public responses.
   - Location: `server/src/routes/leaderboard.ts` and `server/src/services/battle.ts`.
   - Change: `GET /api/leaderboard` only returns rows within the server-computable score range, with one win/loss result and first-generation Pokemon names.
   - Note: existing forged rows were not deleted from the database.

3. Restricted AI battle recap input to verified battles.
   - Location: `server/src/routes/ai.ts`.
   - Change: the recap route no longer accepts arbitrary player/opponent/score/turn text; it verifies the same signed battle token and move list before generating a recap.

4. Removed email from newly issued JWT/profile payloads.
   - Location: `server/src/routes/auth.ts`, `server/src/middleware/auth.ts`, `client/src/api/http.ts`.
   - Change: new auth sessions store only `id` and `displayName` in the browser-side auth payload.

## Previously Fixed

1. Removed public email disclosure from leaderboard responses.
   - Location: `server/src/routes/leaderboard.ts:26-44`.
   - Change: leaderboard population now selects `displayName` only and response mapping omits email.

2. Added write throttling to score posting.
   - Location: `server/src/routes/leaderboard.ts:9-14` and `server/src/routes/leaderboard.ts:52`.
   - Change: score creation is rate-limited before auth and validation.

3. Added write throttling to the optional AI recap route.
   - Location: `server/src/routes/ai.ts:9-14` and `server/src/routes/ai.ts:24`.
   - Change: recap generation is rate-limited to reduce abuse of the server-side LLM key.

4. Enabled a restrictive Content Security Policy.
   - Location: `server/src/app.ts:25-44`.
   - Change: CSP allows same-origin app assets, PokeAPI requests, and official artwork from `raw.githubusercontent.com`; it blocks object embeds and framing.

5. Replaced inline HP width styling with a native progress element.
   - Location: `client/src/components/HpBar.tsx:1-12`.
   - Change: dynamic HP display no longer depends on inline style attributes, keeping the UI compatible with the stricter CSP.

6. Removed the standalone workflow/API surface and unused AI SDK dependency.
   - Locations: deleted `client/src/pages/AgentWorkflowPage.tsx`, deleted `server/src/routes/agentWorkflow.ts`, deleted `server/src/services/agentWorkflow.ts`, removed `ai` from `server/package.json`.
   - Change: the app exposes only Pokemon product routes and APIs.

## Dependency Audit

`npm audit` passed with 0 vulnerabilities.

## Secret Scan

Command:

```powershell
rg "WBS_LLM_API_KEY|JWT_SECRET|MONGODB_ATLAS_URI|mongodb\\+srv|RENDER_API_KEY" -g "!EXECPLAN.md" -g "!AGENTS.md" -g "!.env"
```

Result: only placeholder variable names, `.env.example` placeholders, documentation notes, and server-side env references were found. No secret values were printed or committed.

`.env` remains ignored by git.

## Unsafe DOM / Code Execution Scan

Command:

```powershell
rg "dangerouslySetInnerHTML|innerHTML|eval\\(|new Function|document\\.write|insertAdjacentHTML" client server
```

Result: no matches.

## Residual Risks

- If Atlas still has temporary `0.0.0.0/0` access, remove or tighten it after deployment verification.
- The optional WBS LLM endpoint is server-side and has a deterministic fallback, but it still depends on external availability when configured.
- JWT storage remains in `localStorage` by project requirement, so continued XSS prevention remains important.
- The server verifies battle tokens and recomputes results, but the battle is still a simple game, not a fraud-resistant anti-cheat system.
- Friend rooms are unauthenticated and in-memory by design for easy child-friendly play. They are rate-limited, short-lived, not persisted, and never write leaderboard scores.
