import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Bot, CheckCircle2, FileText, GitBranch, ShieldCheck, Sparkles } from "lucide-react";

interface WorkflowNode {
  id: string;
  label: string;
  status: "passed" | "manual";
  summary: string;
  evidence: Array<{
    label: string;
    kind: "command" | "doc" | "url" | "screenshot" | "decision" | "blocker";
    value: string;
  }>;
}

interface WorkflowResponse {
  title: string;
  sdk: {
    package: string;
    concepts: string[];
  };
  nodes: WorkflowNode[];
  buildDecisions: string[];
  steeringSummary: {
    meaningfulInterventions: number;
    actualBuildDecisions: number;
    sessions: Array<{ label: string; count: number }>;
  };
  toolContract: {
    name: string;
    input: Record<string, string>;
    output: string[];
  };
}

const fallbackWorkflow: WorkflowResponse = {
  title: "Pokemon Battle Post-Deploy Agent Workflow",
  sdk: {
    package: "ai",
    concepts: ["generateText", "tool", "Zod input schemas", "bounded multi-step execution", "steps as evidence"]
  },
  nodes: [],
  buildDecisions: [],
  steeringSummary: {
    meaningfulInterventions: 58,
    actualBuildDecisions: 25,
    sessions: []
  },
  toolContract: {
    name: "summarizeWorkflowTool",
    input: { includeBuildDecisions: "boolean" },
    output: ["nodes", "buildDecisions", "steeringSummary"]
  }
};

export function AgentWorkflowPage() {
  const [workflow, setWorkflow] = useState<WorkflowResponse>(fallbackWorkflow);
  const [activeId, setActiveId] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/agent-workflow")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Workflow endpoint unavailable");
        }
        return response.json() as Promise<WorkflowResponse>;
      })
      .then((data) => {
        setWorkflow(data);
        setActiveId(data.nodes[0]?.id ?? "");
      })
      .catch((caught: unknown) => {
        setError(caught instanceof Error ? caught.message : "Workflow endpoint unavailable");
      });
  }, []);

  const activeNode = useMemo(
    () => workflow.nodes.find((node) => node.id === activeId) ?? workflow.nodes[0],
    [activeId, workflow.nodes]
  );

  return (
    <section className="workflow-page">
      <div className="workflow-hero">
        <div>
          <p className="eyebrow">Post-deploy agent workflow</p>
          <h1>{workflow.title}</h1>
          <p>
            A live presentation surface for the collaboration process: evidence gates, build decisions, recovery loops,
            and the Vercel AI SDK tool contract behind the workflow model.
          </p>
        </div>
        <div className="workflow-metrics" aria-label="Steering summary">
          <span>
            <strong>{workflow.steeringSummary.meaningfulInterventions}</strong>
            meaningful steers
          </span>
          <span>
            <strong>{workflow.steeringSummary.actualBuildDecisions}</strong>
            build decisions
          </span>
          <span>
            <strong>{workflow.nodes.length}</strong>
            workflow nodes
          </span>
        </div>
      </div>

      {error && <p className="error">{error}. Showing local fallback metadata.</p>}

      <div className="workflow-sdk-strip">
        <div>
          <Bot size={26} />
          <strong>Installed SDK package</strong>
          <code>{workflow.sdk.package}</code>
        </div>
        {workflow.sdk.concepts.map((concept) => (
          <span key={concept}>
            <Sparkles size={16} /> {concept}
          </span>
        ))}
      </div>

      <div className="workflow-layout">
        <div className="workflow-map" aria-label="Workflow nodes">
          {workflow.nodes.map((node, index) => (
            <button
              className={node.id === activeNode?.id ? "workflow-node active" : "workflow-node"}
              key={node.id}
              onClick={() => setActiveId(node.id)}
              type="button"
            >
              <span className={node.status === "passed" ? "node-status passed" : "node-status manual"}>
                {node.status === "passed" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              </span>
              <span>
                <small>Step {index + 1}</small>
                <strong>{node.label}</strong>
              </span>
            </button>
          ))}
        </div>

        <article className="workflow-detail panel">
          {activeNode ? (
            <>
              <div className="workflow-detail__title">
                <Activity size={28} />
                <div>
                  <p className="eyebrow">Selected evidence gate</p>
                  <h2>{activeNode.label}</h2>
                </div>
              </div>
              <p>{activeNode.summary}</p>
              <div className="evidence-list">
                {activeNode.evidence.map((item) => (
                  <div className="evidence-item" key={`${item.label}-${item.value}`}>
                    <FileText size={18} />
                    <span>
                      <strong>{item.label}</strong>
                      {item.kind === "url" ? (
                        <a href={item.value} rel="noreferrer" target="_blank">
                          {item.value}
                        </a>
                      ) : (
                        <code>{item.value}</code>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No workflow nodes loaded.</p>
          )}
        </article>
      </div>

      <div className="workflow-bottom">
        <section className="panel">
          <div className="workflow-detail__title">
            <GitBranch size={26} />
            <div>
              <p className="eyebrow">Actual shared build decisions</p>
              <h2>Not just preferences</h2>
            </div>
          </div>
          <ol className="decision-list">
            {workflow.buildDecisions.map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ol>
        </section>

        <section className="panel">
          <div className="workflow-detail__title">
            <ShieldCheck size={26} />
            <div>
              <p className="eyebrow">AI SDK tool contract</p>
              <h2>{workflow.toolContract.name}</h2>
            </div>
          </div>
          <div className="contract-box">
            <span>Input</span>
            <code>{JSON.stringify(workflow.toolContract.input, null, 2)}</code>
            <span>Output</span>
            <code>{workflow.toolContract.output.join(", ")}</code>
          </div>
          <p className="muted">
            The live route is intentionally presentation-safe: no raw private notes, `.env` values, tokens, database URIs,
            or secret-like data are returned.
          </p>
        </section>
      </div>
    </section>
  );
}
