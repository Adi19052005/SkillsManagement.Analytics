import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

import {
  createAssessment,
  getEmployeeAssessmentsController,
  getAssessmentById,
  updateSelfAssessmentController,
  reviewAssessment,
  getPendingAssessmentsController,
} from "./skill-assessment.controller";

import {
  createSkillAssessmentValidator,
  updateSelfAssessmentValidator,
  reviewSkillAssessmentValidator,
  assessmentIdValidator,
  employeeAssessmentValidator,
} from "./skill-assessment.validators";

const router = Router();

/*
 * Employee creates their skill assessment
 */
router.post(
  "/",
  authMiddleware,
  requireRole("EMPLOYEE", "MANAGER", "HR", "ADMIN"),
  createSkillAssessmentValidator,
  createAssessment
);

/*
 * Get all assessments for an employee
 */
router.get(
  "/employee/:employeeId",
  authMiddleware,
  requireRole("EMPLOYEE", "MANAGER", "HR", "ADMIN"),
  employeeAssessmentValidator,
  getEmployeeAssessmentsController
);

/*
 * Get all pending assessments
 * Must be placed before /:id
 */
router.get(
  "/pending",
  authMiddleware,
  requireRole("MANAGER", "HR", "ADMIN"),
  getPendingAssessmentsController
);

/*
 * Get assessment by ID
 */
router.get(
  "/:id",
  authMiddleware,
  requireRole("EMPLOYEE", "MANAGER", "HR", "ADMIN"),
  assessmentIdValidator,
  getAssessmentById
);

/*
 * Employee updates their self assessment
 */
router.put(
  "/:id",
  authMiddleware,
  requireRole("EMPLOYEE", "MANAGER", "HR", "ADMIN"),
  updateSelfAssessmentValidator,
  updateSelfAssessmentController
);

/*
 * Manager / HR / Admin reviews the assessment
 */
router.put(
  "/:id/review",
  authMiddleware,
  requireRole("MANAGER", "HR", "ADMIN"),
  reviewSkillAssessmentValidator,
  reviewAssessment
);

export default router;