import { body, param } from 'express-validator';

export const createTaskSkillRequirementValidator = [
  body('taskId')
    .isUUID()
    .withMessage('taskId must be a valid UUID'),

  body('skillId')
    .isUUID()
    .withMessage('skillId must be a valid UUID'),

  body('requiredRating')
    .isInt({ min: 0, max: 5 })
    .withMessage('requiredRating must be an integer between 0 and 5'),

  body('weight')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('weight must be greater than 0'),

  body('mandatory')
    .optional()
    .isBoolean()
    .withMessage('mandatory must be a boolean'),
];

export const updateTaskSkillRequirementValidator = [
  param('id')
    .isUUID()
    .withMessage('id must be a valid UUID'),

  body('requiredRating')
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage('requiredRating must be an integer between 0 and 5'),

  body('weight')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('weight must be greater than 0'),

  body('mandatory')
    .optional()
    .isBoolean()
    .withMessage('mandatory must be a boolean'),
];

export const taskIdValidator = [
  param('taskId')
    .isUUID()
    .withMessage('taskId must be a valid UUID'),
];

export const taskSkillRequirementIdValidator = [
  param('id')
    .isUUID()
    .withMessage('id must be a valid UUID'),
];