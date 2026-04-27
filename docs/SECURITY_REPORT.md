# Security Report

Date: 2026-04-27

## Executive Summary

No critical or high-severity issues are open from the current local pass. The cleanup removed an unnecessary workflow/API surface, removed the unused AI SDK dependency, added a strict Helmet CSP, stopped leaderboard email exposure, and added rate limits to score and recap writes.

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
- Battle simulation is game logic, not a security boundary.
