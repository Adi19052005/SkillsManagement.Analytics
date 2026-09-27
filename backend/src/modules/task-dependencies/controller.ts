import { Request, Response } from 'express';

import {
  CreateTaskDependencyRequest,
  GetTaskDependenciesRequest,
  DeleteTaskDependencyRequest,
  TaskDependencyParams,
} from './types';

import { taskDependencyService } from './service';

export class TaskDependencyController {
  async create(
    req: CreateTaskDependencyRequest,
    res: Response,
  ) {
    try {
      const dependency = await taskDependencyService.create(
        req.body,
      );

      return res.status(201).json({
        success: true,
        message: 'Task dependency created successfully',
        data: dependency,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create task dependency';

      let statusCode = 400;

      if (
        message === 'Task not found' ||
        message === 'Dependency task not found'
      ) {
        statusCode = 404;
      }

      if (
        message === 'This task dependency already exists'
      ) {
        statusCode = 409;
      }

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getByTask(
    req: GetTaskDependenciesRequest,
    res: Response,
  ) {
    try {
      const dependencies =
        await taskDependencyService.getByTask(
          req.params.taskId,
        );

      return res.status(200).json({
        success: true,
        data: dependencies,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch task dependencies';

      const statusCode =
        message === 'Task not found' ? 404 : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getById(
    req: Request<TaskDependencyParams>,
    res: Response,
  ) {
    try {
      const dependency =
        await taskDependencyService.getById(
          req.params.id,
        );

      return res.status(200).json({
        success: true,
        data: dependency,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch task dependency';

      const statusCode =
        message === 'Task dependency not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async delete(
    req: DeleteTaskDependencyRequest,
    res: Response,
  ) {
    try {
      await taskDependencyService.delete(
        req.params.id,
      );

      return res.status(200).json({
        success: true,
        message: 'Task dependency deleted successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete task dependency';

      const statusCode =
        message === 'Task dependency not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const taskDependencyController =
  new TaskDependencyController();