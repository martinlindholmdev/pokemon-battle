# Post-Deploy Agent Workflow With Vercel AI SDK

This document is presentation material and an implementation blueprint. It does not add runtime dependencies to the Pokemon app. The current app remains deployed on Render; this workflow explains how the same post-deploy agent process can be formalized with Vercel AI SDK concepts.

Current official references checked on 2026-04-27:

- Vercel guide: [How to build AI Agents with Vercel and the AI SDK](https://vercel.com/docs/agents/)
- Vercel Workflow SDK repository: [vercel/workflow](https://github.com/vercel/workflow)

Relevant current points from those references:

- The AI SDK supports LLM calls through `generateText`.
- Tools can be defined with descriptions, Zod input schemas, and `execute` functions.
- Multi-step agents can continue through tool calls with bounded stopping conditions such as `stopWhen` and step-count limits.
- Agent responses can expose `steps`, which is useful for audit trails and presentation evidence.
- Vercel's Workflow SDK is a separate durability/observability layer for async JavaScript and AI agents. It is useful future infrastructure, but not required for this presentation artifact.

## Goal

Build an agent workflow that can explain and optionally re-run the post-deploy evidence process:

1. Inspect project state.
2. Read implementation logs and verification docs.
3. Extract build decisions from private notes without exposing secrets.
4. Check live health endpoints.
5. Summarize deployment status.
6. Produce a presenter-ready workflow narrative.
7. Stop for human approval before risky actions.

## Safety Boundaries

The workflow must not:

- print `.env` values,
- expose MongoDB URIs, JWT secrets, Render API keys, GitHub tokens, or LLM keys,
- make paid-plan decisions,
- perform destructive git operations,
- change Atlas network rules automatically without explicit credentials and approval,
- treat preference feedback as a build decision unless it changed architecture, security, deployment, validation, product behavior, or demo readiness.

## Workflow State

```ts
type WorkflowStatus = "pending" | "running" | "passed" | "failed" | "blocked" | "manual";

interface EvidenceItem {
  label: string;
  kind: "command" | "doc" | "url" | "screenshot" | "decision" | "blocker";
  value: string;
  safeToShow: boolean;
}

interface WorkflowNode {
  id: string;
  label: string;
  status: WorkflowStatus;
  summary: string;
  evidence: EvidenceItem[];
}

interface BuildDecision {
  session: "Session 1" | "Session 2" | "Session 3" | "Session 4";
  category: "architecture" | "deployment" | "security" | "workflow" | "ux" | "demo";
  decision: string;
  whyItWasBuildRelevant: string;
}
```

## AI SDK Tool Skeleton

```ts
import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";

const inspectRepo = tool({
  description: "Read safe repository status and known documentation files without exposing secrets.",
  inputSchema: z.object({
    includePrivateDecisionSummary: z.boolean().default(false),
  }),
  execute: async ({ includePrivateDecisionSummary }) => {
    return {
      branch: "main",
      docs: [
        "EXECPLAN.md",
        "docs/IMPLEMENTATION_LOG.md",
        "docs/TESTING.md",
        "docs/SECURITY_REPORT.md",
      ],
      privateSummaryAllowed: includePrivateDecisionSummary,
    };
  },
});

const checkHealthEndpoint = tool({
  description: "Check a deployed application's health endpoint and return only non-secret status data.",
  inputSchema: z.object({
    url: z.string().url(),
  }),
  execute: async ({ url }) => {
    const response = await fetch(url);
    return {
      ok: response.ok,
      status: response.status,
      body: await response.json().catch(() => null),
    };
  },
});

const classifySteering = tool({
  description:
    "Classify steering notes into actual build decisions versus preference or confirmation.",
  inputSchema: z.object({
    notes: z.string(),
  }),
  execute: async ({ notes }) => {
    // In a real implementation, parse local notes and return only safe summaries.
    // Do not return secret values or raw private text.
    return {
      totalMeaningfulSteeringInterventions: 58,
      actualBuildDecisions: 25,
      rule:
        "Count only steering that changed architecture, deployment, security, validation, product behavior, or demo readiness.",
    };
  },
});

export async function buildPostDeployNarrative() {
  const result = await generateText({
    model: "openai/gpt-5",
    system:
      "You are a careful software engineering workflow agent. Produce concise, presentation-safe output. Never reveal secrets.",
    prompt:
      "Create a WBS presentation narrative for the Pokemon Battle post-deploy workflow.",
    tools: {
      inspectRepo,
      checkHealthEndpoint,
      classifySteering,
    },
    stopWhen: stepCountIs(6),
  });

  return {
    finalText: result.text,
    steps: result.steps,
  };
}
```

## Recommended Workflow Nodes

| Node | Status | Evidence |
| --- | --- | --- |
| Plan and constraints | Passed | `EXECPLAN.md`, `.agent/PLANS.md`, `AGENTS.md` |
| Environment check | Passed | Node/npm versions, Render key presence check without value |
| Backend implementation | Passed | Express routes, Mongo models, health endpoint |
| Frontend implementation | Passed | React routes, roster, battle arena, leaderboard |
| Local verification | Passed | build, typecheck, lint, audit, browser flow |
| Commit and push | Passed | commit hashes in implementation log |
| Render deployment | Passed | service URL, deploy IDs |
| Live verification | Passed | `/api/health`, root, leaderboard, browser flow |
| Production recovery | Passed | Atlas CIDR allowlist fix, SPA fallback fix |
| Presentation rescue | Passed | UX improvements, LLM recap, roster counter |
| Human cleanup | Manual | keep Atlas allowlist least-privilege |

## Actual Build Decisions From Personal Notes

The private notes record 58 meaningful steering interventions. I count 25 as actual build decisions because they changed architecture, deployment, security, validation, product behavior, or demo readiness.

Architecture:

1. Use one private full-stack repository instead of multiple public repos.
2. Create and use a private GitHub repository.
3. Use a single-repo workspace structure.
4. Implement WBS auth behavior inside backend routes for the MVP.
5. Plan a future `auth-server` package for a stricter auth-service interpretation.

Deployment:

6. Use Render Web Service instead of GitHub Pages.
7. Use MongoDB Atlas for production database access.
8. Do not create the Render service until package scripts exist.
9. Use the Render API key for autonomous deployment.
10. Keep `/api/health` as the production health gate.
11. Update Render build behavior after production install omitted build dependencies.
12. Fix Express SPA fallback after live root route returned 404.

Security:

13. Keep secrets out of git and summaries.
14. Use temporary Atlas `0.0.0.0/0` only for the deployment window.
15. Replace broad Atlas access with Render outbound CIDR allowlisting.
16. Keep LLM keys server-only with deterministic fallback.
17. Avoid broad GitHub MCP permissions and use narrow public-repo research access.

Workflow and validation:

18. Move planning into durable repo files instead of chat memory.
19. Require `EXECPLAN.md` and `docs/IMPLEMENTATION_LOG.md` as context recovery mechanisms.
20. Require local build/typecheck/lint/audit and browser verification.
21. Require live verification after deploy.
22. Separate the post-deploy workflow visualizer from the MVP.

UX and demo behavior:

23. Require UX/code-reference research before final frontend styling.
24. Replace the generic first UI with a retro Pokedex/Game Boy direction.
25. Change the battle from one-click simulation to an interactive turn-by-turn arena with visible coach recap.

## Presenter Summary

Use this wording if time is short:

> We used an agentic workflow, but the important part was not just automation. The agent handled implementation and verification, while I steered architecture, deployment, security, and demo-readiness decisions. The post-deploy Vercel AI SDK workflow would formalize this as tools, schemas, bounded steps, and evidence output, so the same process becomes repeatable and reviewable.

