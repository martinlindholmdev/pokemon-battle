# Codex Execution Plans

An ExecPlan is a living build plan that a coding agent follows from design through implementation. It must be self-contained: assume the agent has only the current working tree and this plan, not prior chat context.

## Required Sections

Every ExecPlan must include:

- Purpose / Big Picture
- Progress
- Surprises & Discoveries
- Decision Log
- Context and Orientation
- Plan of Work
- Concrete Steps
- Milestones
- Validation and Acceptance
- Idempotence and Recovery
- Deployment Plan
- Outcomes & Retrospective

## Implementation Rules

When implementing an ExecPlan:

- Read the whole plan before editing files.
- Keep the plan current as decisions and discoveries happen.
- Resolve ordinary ambiguities autonomously and record the decision.
- Do not stop after analysis or proposal. Continue to implementation, verification, commit, push, and deployment unless blocked.
- Each milestone must end with a concrete verification command or observable behavior.
- If a command fails, capture the failure briefly, fix what is in scope, and rerun the relevant check.
- If blocked by missing credentials, paid-plan requirements, or external platform limits, stop and report the exact blocker.

## Quality Rules

- Prefer simple, explicit, maintainable code.
- Keep the implementation scoped to the project requirements.
- Use stable libraries for framework behavior, auth hashing, validation, routing, and database access.
- Validate user input on both client and server.
- Include enough tests or scripted checks to prove the critical auth, leaderboard, and health flows.
- For frontend work, verify the UI in a browser and check mobile and desktop layouts.

