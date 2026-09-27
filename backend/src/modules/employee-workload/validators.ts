import { body, param } from 'express-validator';

export const createEmployeeWorkloadValidator = [
  body('employeeId')
    .isUUID()
    .withMessage('employeeId must be a valid UUID'),

  body('date')
    .isISO8601()
    .withMessage('date must be a valid ISO 8601 date'),

  body('allocatedHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('allocatedHours must be between 0 and 24'),

  body('availableHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('availableHours must be between 0 and 24'),
];

export const updateEmployeeWorkloadValidator = [
  param('id')
    .isUUID()
    .withMessage('id must be a valid UUID'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('date must be a valid ISO 8601 date'),

  body('allocatedHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('allocatedHours must be between 0 and 24'),

  body('availableHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('availableHours must be between 0 and 24'),
];

export const employeeIdValidator = [
  param('employeeId')
    .isUUID()
    .withMessage('employeeId must be a valid UUID'),
];

export const employeeWorkloadIdValidator = [
  param('id')
    .isUUID()
    .withMessage('id must be a valid UUID'),
];