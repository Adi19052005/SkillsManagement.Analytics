import { Router } from 'express';
import { taskSkillRequirementController } from './contoller';
import {
  createTaskSkillRequirementValidator,
  updateTaskSkillRequirementValidator,
  taskIdValidator,
  taskSkillRequirementIdValidator,
} from './validators';

const router = Router();

/**
 * Create a skill requirement for a task
 * POST /task-skill-requirements
 */
router.post(
  '/',
  createTaskSkillRequirementValidator,
  taskSkillRequirementController.create
);

/**
 * Get all skill requirements for a task
 * GET /task-skill-requirements/task/:taskId
 */
router.get(
  '/task/:taskId',
  taskIdValidator,
  taskSkillRequirementController.getByTask
);

/**
 * Get a single task skill requirement
 * GET /task-skill-requirements/:id
 */
router.get(
  '/:id',
  taskSkillRequirementIdValidator,
  taskSkillRequirementController.getById
);

/**
 * Update a task skill requirement
 * PUT /task-skill-requirements/:id
 */
router.put(
  '/:id',
  updateTaskSkillRequirementValidator,
  taskSkillRequirementController.update
);

/**
 * Delete a task skill requirement
 * DELETE /task-skill-requirements/:id
 */
router.delete(
  '/:id',
  taskSkillRequirementIdValidator,
  taskSkillRequirementController.delete
);

export default router;