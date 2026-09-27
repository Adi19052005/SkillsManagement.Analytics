import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

import * as analyticsController from "./analytics.controller";

const router = Router();

// Get all employees overview (HR or ADMIN)
router.get(
	"/employees/overview",
	authMiddleware,
	requireRole("HR", "ADMIN"),
	analyticsController.getAllEmployeesOverview
);

// Get employee skill progress (HR, MANAGER, or ADMIN)
router.get(
	"/employees/:employeeId/skill-progress",
	authMiddleware,
	requireRole("HR", "MANAGER", "ADMIN"),
	analyticsController.getEmployeeSkillProgress
);

// Get specific skill timeline for employee
router.get(
	"/employees/:employeeId/skills/:skillId/timeline",
	authMiddleware,
	requireRole("HR", "MANAGER", "ADMIN"),
	analyticsController.getSkillProgressTimeline
);

// Dashboard statistics
router.get(
	"/dashboard-stats",
	authMiddleware,
	requireRole("HR", "ADMIN"),
	analyticsController.getDashboardStats
);

// Skill spectrum by department
router.get(
	"/skill-spectrum",
	authMiddleware,
	requireRole("HR", "ADMIN"),
	analyticsController.getSkillSpectrumByDepartment
);

// Employee learning speed
router.get(
	"/learning-speed",
	authMiddleware,
	requireRole("HR", "ADMIN"),
	analyticsController.getLearningSpeed
);

// Skill gap analysis
router.get(
	"/skill-gaps",
	authMiddleware,
	requireRole("HR", "ADMIN"),
	analyticsController.getSkillGaps
);

// Training needs analysis
router.get(
	"/training-needs",
	authMiddleware,
	requireRole("HR", "ADMIN"),
	analyticsController.getTrainingNeeds
);

export default router;