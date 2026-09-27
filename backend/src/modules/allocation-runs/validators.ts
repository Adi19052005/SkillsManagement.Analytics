import { body, param } from 'express-validator';

export const createAllocationRunValidator = [
  body('projectId')
    .isUUID()
    .withMessage('projectId must be a valid UUID'),
];

export const allocationRunIdValidator = [
  param('id')
    .isUUID()
    .withMessage('id must be a valid UUID'),
];

export const projectIdValidator = [
  param('projectId')
    .isUUID()
    .withMessage('projectId must be a valid UUID'),
];