import { Request, Response } from 'express';
import {
  CreateTaskSkillRequirementRequest,
  UpdateTaskSkillRequirementRequest,
  GetTaskSkillRequirementsRequest,
  DeleteTaskSkillRequirementRequest,
} from './types';
import { taskSkillRequirementService } from './service';

export class TaskSkillRequirementController {
  async create(
    req: CreateTaskSkillRequirementRequest,
    res: Response
  ) {
    try {
      const requirement =
        await taskSkillRequirementService.create(req.body);

      return res.status(201).json({
        success: true,
        message: 'Task skill requirement created successfully',
        data: requirement,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create task skill requirement';

      const statusCode =
        message === 'Task not found' ||
        message === 'Skill not found'
          ? 404
          : message.includes('already exists')
            ? 409
            : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getByTask(
    req: GetTaskSkillRequirementsRequest,
    res: Response
  ) {
    try {
      const requirements =
        await taskSkillRequirementService.getByTask(
          req.params.taskId
        );

      return res.status(200).json({
        success: true,
        data: requirements,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch task skill requirements';

      const statusCode =
        message === 'Task not found' ? 404 : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getById(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const requirement =
        await taskSkillRequirementService.getById(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        data: requirement,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch task skill requirement';

      const statusCode =
        message === 'Task skill requirement not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async update(
    req: UpdateTaskSkillRequirementRequest,
    res: Response
  ) {
    try {
      const requirement =
        await taskSkillRequirementService.update(
          req.params.id,
          req.body
        );

      return res.status(200).json({
        success: true,
        message: 'Task skill requirement updated successfully',
        data: requirement,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update task skill requirement';

      const statusCode =
        message === 'Task skill requirement not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async delete(
    req: DeleteTaskSkillRequirementRequest,
    res: Response
  ) {
    try {
      await taskSkillRequirementService.delete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message: 'Task skill requirement deleted successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete task skill requirement';

      const statusCode =
        message === 'Task skill requirement not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const taskSkillRequirementController =
  new TaskSkillRequirementController();