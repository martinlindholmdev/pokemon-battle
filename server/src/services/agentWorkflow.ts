import { tool } from "ai";
import { z } from "zod";

type WorkflowStatus = "passed" | "manual";

interface WorkflowNode {
  id: string;
  label: string;
  status: WorkflowStatus;
  summary: string;
  evidence: Array<{
    label: string;
    kind: "command" | "doc" | "url" | "screenshot" | "decision" | "blocker";
    value: string;
  }>;
}

const workflowNodes: WorkflowNode[] = [
  {
    id: "plan",
    label: "Plan and constraints",
    status: "passed",
    summary: "Repo instructions, ExecPlan, safety rules, and completion bar became the operating contract.",
    evidence: [
      { label: "Execution plan", kind: "doc", value: "EXECPLAN.md" },
      { label: "Agent rules", kind: "doc", value: "AGENTS.md" }
    ]
  },
  {
    id: "preflight",
    label: "Preflight checks",
    status: "passed",
    summary: "Confirmed toolchain, branch state, and deployment credential presence without exposing secret values.",
    evidence: [
      { label: "Node/npm check", kind: "command", value: "node --version && npm --version" },
      { label: "Render key presence", kind: "command", value: "RENDER_API_KEY=<set>" }
    ]
  },
  {
    id: "backend",
    label: "Backend implementation",
    status: "passed",
    summary: "Express API, MongoDB models, JWT auth, health checks, leaderboard, and coach recap endpoint were implemented.",
    evidence: [
      { label: "Health route", kind: "doc", value: "server/src/routes/health.ts" },
      { label: "AI recap service", kind: "doc", value: "server/src/services/aiCoach.ts" }
    ]
  },
  {
    id: "frontend",
    label: "Frontend implementation",
    status: "passed",
    summary: "React routes, PokeAPI browsing, roster state, battle arena, rules page, and leaderboard UI were built.",
    evidence: [
      { label: "App routes", kind: "doc", value: "client/src/App.tsx" },
      { label: "Battle arena", kind: "doc", value: "client/src/pages/BattlePage.tsx" }
    ]
  },
  {
    id: "verification",
    label: "Local verification",
    status: "passed",
    summary: "Build, typecheck, lint, audit, health, and browser-flow checks were run before deployment.",
    evidence: [
      { label: "Build", kind: "command", value: "npm run build" },
      { label: "Typecheck", kind: "command", value: "npm run typecheck" },
      { label: "Lint", kind: "command", value: "npm run lint" },
      { label: "Testing log", kind: "doc", value: "docs/TESTING.md" }
    ]
  },
  {
    id: "deploy",
    label: "Deploy and live checks",
    status: "passed",
    summary: "The app was pushed to main, deployed to Render, and checked through live routes and browser flow.",
    evidence: [
      { label: "Live app", kind: "url", value: "https://pokemon-battle-ffwr.onrender.com" },
      { label: "Health endpoint", kind: "url", value: "https://pokemon-battle-ffwr.onrender.com/api/health" }
    ]
  },
  {
    id: "recovery",
    label: "Production recovery",
    status: "passed",
    summary: "Render build, SPA fallback, and Atlas network-access issues were diagnosed and corrected.",
    evidence: [
      { label: "Implementation log", kind: "doc", value: "docs/IMPLEMENTATION_LOG.md" },
      { label: "Atlas decision", kind: "decision", value: "Use Render outbound CIDR allowlisting instead of broad 0.0.0.0/0 access." }
    ]
  },
  {
    id: "presentation",
    label: "Presentation handoff",
    status: "passed",
    summary: "The collaboration story, build decisions, demo flow, and Vercel AI SDK workflow model were packaged for WBS.",
    evidence: [
      { label: "Presentation", kind: "doc", value: "docs/WBS_AGENT_COLLAB_PRESENTATION.md" },
      { label: "Workflow blueprint", kind: "doc", value: "docs/POST_DEPLOY_VERCEL_AI_SDK_WORKFLOW.md" }
    ]
  },
  {
    id: "human-cleanup",
    label: "Human cleanup",
    status: "manual",
    summary: "Keep infrastructure least-privilege: do not reintroduce broad Atlas access and rotate secrets if they are exposed.",
    evidence: [
      { label: "Security runbook", kind: "doc", value: "docs/SECURITY_REPORT.md" }
    ]
  }
];

const buildDecisions = [
  "Use one private full-stack repository instead of multiple public repos.",
  "Use Render Web Service because the app needs an Express backend.",
  "Use MongoDB Atlas for production data.",
  "Delay Render service creation until package scripts existed.",
  "Use Render API deployment and live health checks.",
  "Keep secrets server-side and out of committed files.",
  "Replace temporary broad Atlas access with Render outbound CIDR allowlisting.",
  "Keep LLM recap server-side with deterministic fallback.",
  "Use durable repo docs as the agent memory layer.",
  "Separate post-deploy workflow presentation from MVP delivery.",
  "Reject the generic UI and move to a retro Pokedex/Game Boy direction.",
  "Change battle from one-click simulation to an interactive turn-by-turn arena."
];

export const summarizeWorkflowTool = tool({
  description: "Return presentation-safe workflow evidence for the Pokemon Battle post-deploy agent workflow.",
  inputSchema: z.object({
    includeBuildDecisions: z.boolean().default(true)
  }),
  execute: async ({ includeBuildDecisions }) => ({
    nodes: workflowNodes,
    buildDecisions: includeBuildDecisions ? buildDecisions : [],
    steeringSummary: {
      meaningfulInterventions: 58,
      actualBuildDecisions: 25,
      countingRule: "Only steering that changed architecture, deployment, security, validation, product behavior, or demo readiness was counted as a build decision."
    }
  })
});

export function getAgentWorkflow() {
  return {
    title: "Pokemon Battle Post-Deploy Agent Workflow",
    sdk: {
      package: "ai",
      concepts: ["generateText", "tool", "Zod input schemas", "bounded multi-step execution", "steps as evidence"]
    },
    nodes: workflowNodes,
    buildDecisions,
    steeringSummary: {
      meaningfulInterventions: 58,
      actualBuildDecisions: 25,
      sessions: [
        { label: "Session 1", count: 18 },
        { label: "Session 2", count: 18 },
        { label: "Session 3", count: 16 },
        { label: "Session 4", count: 6 }
      ]
    },
    toolContract: {
      name: "summarizeWorkflowTool",
      input: { includeBuildDecisions: "boolean" },
      output: ["nodes", "buildDecisions", "steeringSummary"]
    }
  };
}
