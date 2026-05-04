# Runbook

## Local Development

```powershell
npm install
npm run dev
```

Client dev server: `http://localhost:5173`. Server API: `http://localhost:4000`.

## Production-Style Local Run

```powershell
npm run build
npm start
Invoke-RestMethod http://localhost:4000/api/health
```

## Render Deployment

Use a web service connected to `https://github.com/martinlindholmdev/pokemon-battle` on branch `main`.

Current service URL: `https://pokemon-battle-ffwr.onrender.com`

Latest verified kid-first arena deploy: `dep-d7sirdvcqfis7382gfng` from commit `07c6bf4e7b5e0888f35a811ae3208f172ee15532`.

- Build command: `npm ci --include=dev && npm run build`
- Start command: `npm start`
- Health path: `/api/health`
- Runtime: Node
- Plan: free unless the user explicitly approves a paid plan

Required env vars on Render:

- `NODE_ENV=production`
- `MONGODB_URI` set to the Atlas URI
- `JWT_SECRET`
- Optional `WBS_LLM_URL`, `WBS_LLM_MODEL`, `WBS_LLM_API_KEY`

Render builds need dev dependencies for TypeScript and Vite, so the build command explicitly includes dev dependencies even though runtime uses `NODE_ENV=production`.

## Health Checks

`/api/health` should return `status: "ok"`, Mongo state `connected`, and ping `true`. A degraded result usually points to MongoDB credentials or Atlas network access.

Production health endpoint: `https://pokemon-battle-ffwr.onrender.com/api/health`

After every deploy, verify:

- `/api/health`
- `/`
- `/leaderboard`
- register/login
- roster add
- guest solo practice battle
- same-PC friend battle
- web friend-room create/join
- authenticated solo battle completion
- leaderboard score display

## Logs

Render service logs should be checked after deploy failures. Do not paste secrets into logs or issue reports.

## Atlas Network Access

For the demo deployment, Atlas may temporarily allow `0.0.0.0/0`. Remove or tighten that rule after live verification, preferably replacing it with Render outbound IP ranges if available.

If login/register hangs or `/api/health` stops responding on Render, check service logs for Atlas whitelist errors. The deployed app cannot authenticate users unless Render can reach Atlas.

## Redeploy / Rollback

- Redeploy: push to `main` or trigger a Render deploy for the service.
- Rollback: redeploy a previous known-good commit from Render or revert through a normal Git commit. Do not use destructive local git resets without approval.

## Secret Rotation

Rotate `JWT_SECRET`, MongoDB credentials, and `WBS_LLM_API_KEY` if they are exposed. Update Render env vars and restart the service.

## Cleanup Notes

The repository no longer ships the post-deploy workflow presentation route or `/api/agent-workflow`. Product runtime routes should stay focused on the Pokemon app.
