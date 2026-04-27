import { Router } from "express";
import { getAgentWorkflow } from "../services/agentWorkflow.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(getAgentWorkflow());
});

export { router as agentWorkflowRouter };
