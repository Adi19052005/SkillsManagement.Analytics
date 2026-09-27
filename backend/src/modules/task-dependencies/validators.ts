import { body, param } from 'express-validator';

export const createTaskDependencyValidator = [
  body('taskId')
    .isUUID()
    .withMessage('taskId must be a valid UUID'),

  body('dependsOnTaskId')
    .isUUID()
    .withMessage('dependsOnTaskId must be a valid UUID')
    .custom((value, { req }) => {
      if (value === req.body.taskId) {
        throw new Error('A task cannot depend on itself');
      }

      return true;
    }),
];

export const taskDependencyIdValidator = [
  param('id')
    .isUUID()
    .withMessage('id must be a valid UUID'),
];

export const taskIdValidator = [
  param('taskId')
    .isUUID()
    .withMessage('taskId must be a valid UUID'),
];