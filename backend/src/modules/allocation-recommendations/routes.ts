import { Router } from 'express';

import { allocationRecommendationController } from './controller';

import {
  createAllocationRecommendationValidator,
  updateAllocationRecommendationValidator,
  allocationRecommendationIdValidator,
  allocationRunIdValidator,
  taskIdValidator,
  employeeIdValidator,
} from './validators';

const router = Router();

router.post(
  '/',
  createAllocationRecommendationValidator,
  allocationRecommendationController.create
);

router.get(
  '/run/:allocationRunId',
  allocationRunIdValidator,
  allocationRecommendationController.getByRun
);

router.get(
  '/task/:taskId',
  taskIdValidator,
  allocationRecommendationController.getByTask
);

router.get(
  '/employee/:employeeId',
  employeeIdValidator,
  allocationRecommendationController.getByEmployee
);

router.get(
  '/:id',
  allocationRecommendationIdValidator,
  allocationRecommendationController.getById
);

router.put(
  '/:id',
  updateAllocationRecommendationValidator,
  allocationRecommendationController.update
);

router.delete(
  '/:id',
  allocationRecommendationIdValidator,
  allocationRecommendationController.delete
);

export default router;