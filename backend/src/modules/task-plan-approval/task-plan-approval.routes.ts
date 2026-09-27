import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import {
  approveTaskPlanValidator,
} from "./task-plan-approval.validators";
import {
  approveTaskPlanController,
} from "./task-plan-approval.controller";

const router = Router();

router.post(
  "/:projectId",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN"),
  approveTaskPlanValidator,
  approveTaskPlanController
);

export default router;