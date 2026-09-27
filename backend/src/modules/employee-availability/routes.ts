import { Router } from 'express';

import { employeeAvailabilityController } from './controller';

import {
  createEmployeeAvailabilityValidator,
  updateEmployeeAvailabilityValidator,
  employeeIdValidator,
  employeeAvailabilityIdValidator,
} from './validators';

const router = Router();

// Create availability
router.post(
  '/',
  createEmployeeAvailabilityValidator,
  employeeAvailabilityController.create,
);

// Get all availability for an employee
router.get(
  '/employee/:employeeId',
  employeeIdValidator,
  employeeAvailabilityController.getByEmployee,
);

// Get availability by ID
router.get(
  '/:id',
  employeeAvailabilityIdValidator,
  employeeAvailabilityController.getById,
);

// Update availability
router.put(
  '/:id',
  updateEmployeeAvailabilityValidator,
  employeeAvailabilityController.update,
);

// Delete availability
router.delete(
  '/:id',
  employeeAvailabilityIdValidator,
  employeeAvailabilityController.delete,
);

export default router;