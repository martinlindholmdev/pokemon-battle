# Post-Deploy Agentic Workflow Dashboard Plan

This is a follow-up plan for a fresh session after the Pokemon app has been built, pushed, deployed, and live-verified. It is intentionally not part of the MVP completion bar.

## Purpose

Build a presentation-quality view that makes the autonomous build/deploy workflow visible to humans. The Pokemon app remains the proof artifact; this dashboard explains how the agentic coding run moved from plan to deployed system, where evidence was collected, and where human intervention was required.

## Preconditions

Start only after the MVP session has produced:

- a working local app,
- a pushed implementation commit on `main`,
- a Render service URL and `/api/health` result,
- completed `README.md`,
- completed `docs/ARCHITECTURE.md`,
- completed `docs/RUNBOOK.md`,
- completed `docs/TESTING.md`,
- completed `docs/SECURITY_REPORT.md`,
- completed `docs/UX_RESEARCH.md`,
- completed `docs/IMPLEMENTATION_LOG.md`,
- final reminder status for Atlas `0.0.0.0/0` cleanup.

## Scope

Create an agentic workflow visualization that can show:

- Preflight and credential checks.
- Scaffold and dependency setup.
- Backend implementation.
- Frontend and UX implementation.
- Local build, lint, typecheck, audit, and browser verification.
- Documentation and security review.
- Commit and push.
- Render service creation/deploy polling.
- Live verification.
- Human handoff tasks, especially Atlas allowlist cleanup.

Each step should expose concise evidence: command names, status, timestamp where known, related doc link, deploy URL, screenshot path, or blocker summary. Do not display secrets or secret-like values.

## Technical Direction

First inspect the completed app before choosing the implementation. Preferred order:

1. Lightweight local React route, for example `/agent-workflow`, using local components and static workflow data.
2. `@xyflow/react` or a small graph library if a node canvas adds clear value without changing the app stack.
3. AI Elements Workflow only if the current official docs and the completed app make adoption low-risk. Do not migrate the repo to Next.js just to use AI Elements.

The current AI Elements docs describe AI Elements as a shadcn/ui-based component library and the setup docs list React 19, Next.js 14+, AI SDK setup, shadcn/ui, and Tailwind CSS 4 as prerequisites. That makes it a candidate for a separate experiment, not a dependency for the original Vite/Express MVP.

Useful current docs to re-check in the follow-up session:

- AI Elements: https://elements.ai-sdk.dev/
- AI Elements Workflow example: https://elements.ai-sdk.dev/examples/workflow
- AI Elements setup: https://elements.ai-sdk.dev/docs/setup
- AI SDK agents/workflows: https://ai-sdk.dev/docs/agents/workflows

## Suggested Data Model

Represent the workflow as data first:

```ts
type WorkflowStatus = "pending" | "running" | "passed" | "failed" | "blocked" | "manual";

interface WorkflowNode {
  id: string;
  label: string;
  status: WorkflowStatus;
  summary: string;
  evidence?: Array<{
    label: string;
    kind: "command" | "doc" | "url" | "screenshot" | "decision" | "blocker";
    value: string;
  }>;
}

interface WorkflowEdge {
  from: string;
  to: string;
  label?: string;
  kind?: "normal" | "fallback" | "manual";
}
```

The first version can use static data derived manually from `docs/IMPLEMENTATION_LOG.md`. Avoid building a parser unless the log format is already stable.

## UX Requirements

- Make the workflow understandable within the first viewport.
- Use status color, icons, and labels; do not rely on color alone.
- Provide a details panel or drawer for evidence.
- Include failure/fallback paths without making the graph unreadable.
- Include a final "Human cleanup" node for Atlas network access.
- Work on mobile, tablet, and desktop.
- Do not expose env values, JWTs, connection strings, API keys, or raw logs.

## Verification

Run the same quality bar as the MVP frontend:

- `npm run build`
- `npm run typecheck`
- `npm run lint`
- browser verification at `390x844`, `768x1024`, and `1440x900`
- console check for errors
- no text overlap/clipping
- no secrets visible in rendered data or committed files

Update `README.md` and `docs/ARCHITECTURE.md` to mention the dashboard only after it exists.
