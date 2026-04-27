# Security Report

Date: 2026-04-27

## Dependency Audit

`npm audit` passed with 0 vulnerabilities.

## Secret Scan

Command:

```powershell
rg "WBS_LLM_API_KEY|JWT_SECRET|MONGODB_ATLAS_URI|mongodb\\+srv|RENDER_API_KEY" -g "!EXECPLAN.md" -g "!IMPLEMENTATION_HANDOFF.md" -g "!AGENTS.md" -g "!.env"
```

Result: only placeholder variable names, `.env.example` placeholders, documentation notes, and server-side env references were found. No secret values were printed or committed.

`.env` remains ignored by git.

## Unsafe DOM / Code Execution Scan

Command:

```powershell
rg "dangerouslySetInnerHTML|innerHTML|eval\\(|new Function" client server
```

Result: no matches.

## Auth Controls

- Passwords are hashed with bcrypt.
- JWTs are signed server-side and expire after two hours.
- Protected API routes require bearer tokens.
- Auth routes are rate-limited.
- Request bodies are limited to 100 KB.
- Zod validates auth, leaderboard, and AI recap payloads.

## Browser Token Tradeoff

The app stores JWTs in localStorage to satisfy the WBS requirement. Residual risk: XSS would expose tokens. Mitigations include no HTML injection, no unsafe eval patterns, React escaping, short token lifetime, and keeping secrets out of the client bundle.

## CORS and Headers

Production is same-origin: Express serves the SPA and `/api` routes. Helmet is enabled. CORS is not broadly opened.

## Residual Risks

- Atlas temporary `0.0.0.0/0` access should be removed or tightened after deployment verification.
- The optional WBS LLM endpoint is isolated server-side and falls back locally, but its availability is not required.
- Battle simulation is game logic, not a security boundary.
