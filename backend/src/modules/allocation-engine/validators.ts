import { body } from 'express-validator';

export const generateAllocationValidator = [
  body('allocationRunId')
    .isUUID()
    .withMessage('allocationRunId must be a valid UUID'),

  body('projectId')
    .isUUID()
    .withMessage('projectId must be a valid UUID'),
];