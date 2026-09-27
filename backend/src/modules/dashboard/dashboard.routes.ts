import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

import { getDashboardController } from "./dashboard.controller";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole("HR", "ADMIN"),
  getDashboardController
);

export default router;