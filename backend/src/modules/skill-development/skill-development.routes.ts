import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

import * as controller from "./skill-development.controller";

import {
  createSkillDevelopmentValidator,
  updateSkillDevelopmentValidator,
  employeeSkillDevelopmentValidator,
  skillDevelopmentIdValidator,
} from "./skill-development.validators";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN"),
  createSkillDevelopmentValidator,
  controller.createPlan
);

router.get(
  "/employee/:employeeId",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN", "EMPLOYEE"),
  employeeSkillDevelopmentValidator,
  controller.getEmployeePlans
);

router.get(
  "/:id",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN", "EMPLOYEE"),
  skillDevelopmentIdValidator,
  controller.getPlanById
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("HR", "MANAGER", "ADMIN"),
  updateSkillDevelopmentValidator,
  controller.updatePlan
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("HR", "ADMIN"),
  skillDevelopmentIdValidator,
  controller.deletePlan
);

export default router;