import { body, param } from 'express-validator';

export const createAllocationRecommendationValidator = [
  body('allocationRunId')
    .isUUID()
    .withMessage('allocationRunId must be a valid UUID'),

  body('taskId')
    .isUUID()
    .withMessage('taskId must be a valid UUID'),

  body('employeeId')
    .isUUID()
    .withMessage('employeeId must be a valid UUID'),

  body('score')
    .isFloat({ min: 0 })
    .withMessage('score must be a number greater than or equal to 0'),

  body('eligible')
    .isBoolean()
    .withMessage('eligible must be a boolean'),

  body('reason')
    .optional()
    .isString()
    .withMessage('reason must be a string'),
];

export const updateAllocationRecommendationValidator = [
  param('id')
    .isUUID()
    .withMessage('id must be a valid UUID'),

  body('score')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('score must be a number greater than or equal to 0'),

  body('eligible')
    .optional()
    .isBoolean()
    .withMessage('eligible must be a boolean'),

  body('reason')
    .optional()
    .isString()
    .withMessage('reason must be a string'),
];

export const allocationRecommendationIdValidator = [
  param('id')
    .isUUID()
    .withMessage('id must be a valid UUID'),
];

export const allocationRunIdValidator = [
  param('allocationRunId')
    .isUUID()
    .withMessage('allocationRunId must be a valid UUID'),
];

export const taskIdValidator = [
  param('taskId')
    .isUUID()
    .withMessage('taskId must be a valid UUID'),
];

export const employeeIdValidator = [
  param('employeeId')
    .isUUID()
    .withMessage('employeeId must be a valid UUID'),
];