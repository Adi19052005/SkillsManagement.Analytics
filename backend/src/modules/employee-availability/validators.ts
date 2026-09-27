import { body, param } from 'express-validator';

export const createEmployeeAvailabilityValidator = [
  body('employeeId')
    .isUUID()
    .withMessage('employeeId must be a valid UUID'),

  body('date')
    .isISO8601()
    .withMessage('date must be a valid ISO 8601 date'),

  body('availableHours')
    .isFloat({ min: 0, max: 24 })
    .withMessage('availableHours must be between 0 and 24'),
];

export const updateEmployeeAvailabilityValidator = [
  param('id')
    .isUUID()
    .withMessage('id must be a valid UUID'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('date must be a valid ISO 8601 date'),

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

export const employeeAvailabilityIdValidator = [
  param('id')
    .isUUID()
    .withMessage('id must be a valid UUID'),
];