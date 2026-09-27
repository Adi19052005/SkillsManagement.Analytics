import { Router } from 'express';

import { allocationRunController } from './controller';

import {
  createAllocationRunValidator,
  allocationRunIdValidator,
  projectIdValidator,
} from './validators';

import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  createAllocationRunValidator,
  allocationRunController.create
);

router.get(
  '/project/:projectId',
  authMiddleware,
  projectIdValidator,
  allocationRunController.getByProject
);

router.get(
  '/:id',
  authMiddleware,
  allocationRunIdValidator,
  allocationRunController.getById
);

export default router;