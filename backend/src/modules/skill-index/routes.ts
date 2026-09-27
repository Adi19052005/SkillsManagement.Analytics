import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

import * as skillIndexController from "./controller";

import {
	employeeSkillIndexValidator,
	departmentSkillIndexValidator,
	skillIndexValidator,
} from "./validators";

const router = Router();

// Overall Skill Index
router.get(
	"/",
	authMiddleware,
	requireRole("HR", "ADMIN"),
	skillIndexController.getOverallSkillIndex
);

// Employee Skill Index
router.get(
	"/employee/:employeeId",
	authMiddleware,
	requireRole("HR", "MANAGER", "ADMIN"),
	employeeSkillIndexValidator,
	skillIndexController.getEmployeeSkillIndex
);

// Department Skill Index
router.get(
	"/department/:departmentId",
	authMiddleware,
	requireRole("HR", "ADMIN"),
	departmentSkillIndexValidator,
	skillIndexController.getDepartmentSkillIndex
);

// Skill-wise Skill Index
router.get(
	"/skill/:skillId",
	authMiddleware,
	requireRole("HR", "ADMIN"),
	skillIndexValidator,
	skillIndexController.getSkillIndexBySkill
);

export default router;