import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

import {
  extractProjectTasksController,
} from "./llm-task-extraction.controller";

import {
  extractProjectTasksValidator,
} from "./llm-task-extraction.validators";

const router = Router();

router.post(
  "/project/:projectId",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN"),
  extractProjectTasksValidator,
  extractProjectTasksController
);

export default router;