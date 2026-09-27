import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

import {
  createProjectAssignmentController,
  getProjectAssignmentByIdController,
  getEmployeeProjectAssignmentsController,
  getProjectAssignmentsController,
  releaseProjectAssignmentController,
} from "./employee-project-assignment.controller";

import {
  createProjectAssignmentValidator,
  assignmentIdValidator,
  employeeIdValidator,
  projectIdValidator,
} from "./employee-project-assignment.validators";

const router = Router();

/*
 * Create a project/deliverable assignment.
 * Normally this is triggered after human approval.
 */
router.post(
  "/",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN"),
  createProjectAssignmentValidator,
  createProjectAssignmentController
);

/*
 * Get one assignment.
 */
router.get(
  "/:assignmentId",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN"),
  assignmentIdValidator,
  getProjectAssignmentByIdController
);

/*
 * Get all assignments of an employee.
 */
router.get(
  "/employee/:employeeId",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN"),
  employeeIdValidator,
  getEmployeeProjectAssignmentsController
);

/*
 * Get all assignments for a project.
 */
router.get(
  "/project/:projectId",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN"),
  projectIdValidator,
  getProjectAssignmentsController
);

/*
 * Release an employee from a project/deliverable.
 */
router.delete(
  "/:assignmentId",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN"),
  assignmentIdValidator,
  releaseProjectAssignmentController
);

export default router;