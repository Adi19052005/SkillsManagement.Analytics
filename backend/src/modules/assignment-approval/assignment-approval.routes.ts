import { Router } from "express";
import { requireRole } from "../../middlewares/role.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  getRecommendationsForRunController,
  approveAssignmentController,
  rejectAssignmentController,
} from "./assignment-approval.controller";

import {
  allocationRunIdValidator,
  recommendationIdValidator,
  rejectAssignmentValidator,
} from "./assignment-approval.validators";

const router = Router();

/*
 * Get all recommendations for an allocation run.
 * HR, Manager and Admin can review recommendations.
 */
router.get(
  "/run/:allocationRunId",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN"),
  allocationRunIdValidator,
  getRecommendationsForRunController
);

/*
 * Approve a recommendation and perform the actual
 * task assignment.
 */
router.post(
  "/:recommendationId/approve",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN"),
  recommendationIdValidator,
  approveAssignmentController
);

/*
 * Reject a recommendation.
 */
router.post(
  "/:recommendationId/reject",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN"),
  rejectAssignmentValidator,
  rejectAssignmentController
);

export default router;