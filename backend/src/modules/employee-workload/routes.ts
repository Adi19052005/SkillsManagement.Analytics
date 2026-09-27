import { Router } from 'express';

import { employeeWorkloadController } from './controller';

import {
  createEmployeeWorkloadValidator,
  updateEmployeeWorkloadValidator,
  employeeIdValidator,
  employeeWorkloadIdValidator,
} from './validators';

const router = Router();

// Create workload
router.post(
  '/',
  createEmployeeWorkloadValidator,
  employeeWorkloadController.create,
);

// Get all workload records for an employee
router.get(
  '/employee/:employeeId',
  employeeIdValidator,
  employeeWorkloadController.getByEmployee,
);

// Get workload by ID
router.get(
  '/:id',
  employeeWorkloadIdValidator,
  employeeWorkloadController.getById,
);

// Update workload
router.put(
  '/:id',
  updateEmployeeWorkloadValidator,
  employeeWorkloadController.update,
);

// Delete workload
router.delete(
  '/:id',
  employeeWorkloadIdValidator,
  employeeWorkloadController.delete,
);

export default router;