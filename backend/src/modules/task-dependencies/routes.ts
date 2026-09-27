import { Router } from 'express';

import { taskDependencyController } from './controller';

import {
  createTaskDependencyValidator,
  taskDependencyIdValidator,
  taskIdValidator,
} from './validators';

const router = Router();

router.post(
  '/',
  createTaskDependencyValidator,
  taskDependencyController.create
);

router.get(
  '/task/:taskId',
  taskIdValidator,
  taskDependencyController.getByTask
);

router.get(
  '/:id',
  taskDependencyIdValidator,
  taskDependencyController.getById
);

router.delete(
  '/:id',
  taskDependencyIdValidator,
  taskDependencyController.delete
);

export default router;