# Repository Instructions

This repository contains the WBS Pokemon battle app project.

## Current Project Goal

Build and deploy a single-repository full-stack Pokemon battle app. The implementation session must read and follow `EXECPLAN.md` before making changes.

## ExecPlans

For this project, an ExecPlan is a self-contained build plan that a coding agent can execute without relying on prior chat history. When implementing this project:

- Read `.agent/PLANS.md`.
- Read `EXECPLAN.md`.
- Keep `EXECPLAN.md` updated as work proceeds, especially `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective`.
- Do not ask the user for next steps unless a required credential, paid plan decision, or destructive action is blocked.
- Proceed milestone by milestone until the app is built, verified, committed, pushed, deployed, and live verification has been attempted.

## Safety Rules

- Never commit `.env`, API keys, JWT secrets, MongoDB URIs, Render API keys, passwords, tokens, or generated secret files.
- Do not print secret values in terminal output summaries or final answers.
- Do not upgrade to a paid Render plan without explicit user approval.
- Do not make destructive git changes such as reset, checkout, or clean unless the user explicitly asks.

## Expected Commands

Use these commands from the repository root when they exist:

- `npm install`
- `npm run build`
- `npm run typecheck`
- `npm run lint`
- `npm audit`
- `npm run dev`

For deployment, use the Render REST API only if `RENDER_API_KEY` is visible in the process environment. If it is missing, report that the session must be restarted after `setx RENDER_API_KEY`.

## Completion Bar

The task is complete only when:

- the app works locally,
- required checks have been run or documented if blocked,
- changes are committed and pushed to `main`,
- Render deployment is created or a precise Render API blocker is reported,
- the live app and `/api/health` are verified when deployment succeeds.

