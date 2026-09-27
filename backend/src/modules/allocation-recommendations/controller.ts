import { Request, Response } from 'express';

import {
  CreateAllocationRecommendationRequest,
  UpdateAllocationRecommendationRequest,
  AllocationRecommendationParams,
  AllocationRunParams,
  TaskParams,
  EmployeeParams,
} from './types';

import { allocationRecommendationService } from './service';

export class AllocationRecommendationController {
  async create(
    req: CreateAllocationRecommendationRequest,
    res: Response
  ) {
    try {
      const recommendation =
        await allocationRecommendationService.create(req.body);

      return res.status(201).json({
        success: true,
        message: 'Allocation recommendation created successfully',
        data: recommendation,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create allocation recommendation';

      let statusCode = 400;

      if (
        message === 'Allocation run not found' ||
        message === 'Task not found' ||
        message === 'Employee not found'
      ) {
        statusCode = 404;
      }

      if (
        message ===
        'Task does not belong to the allocation run project'
      ) {
        statusCode = 400;
      }

      if (
        message ===
        'Allocation recommendation already exists'
      ) {
        statusCode = 409;
      }

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getById(
    req: Request<AllocationRecommendationParams>,
    res: Response
  ) {
    try {
      const recommendation =
        await allocationRecommendationService.getById(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        data: recommendation,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch allocation recommendation';

      const statusCode =
        message === 'Allocation recommendation not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getByRun(
    req: Request<AllocationRunParams>,
    res: Response
  ) {
    try {
      const recommendations =
        await allocationRecommendationService.getByRun(
          req.params.allocationRunId
        );

      return res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch recommendations';

      const statusCode =
        message === 'Allocation run not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getByTask(
    req: Request<TaskParams>,
    res: Response
  ) {
    try {
      const recommendations =
        await allocationRecommendationService.getByTask(
          req.params.taskId
        );

      return res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch task recommendations';

      const statusCode =
        message === 'Task not found' ? 404 : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getByEmployee(
    req: Request<EmployeeParams>,
    res: Response
  ) {
    try {
      const recommendations =
        await allocationRecommendationService.getByEmployee(
          req.params.employeeId
        );

      return res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch employee recommendations';

      const statusCode =
        message === 'Employee not found' ? 404 : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async update(
    req: UpdateAllocationRecommendationRequest,
    res: Response
  ) {
    try {
      const recommendation =
        await allocationRecommendationService.update(
          req.params.id,
          req.body
        );

      return res.status(200).json({
        success: true,
        message: 'Allocation recommendation updated successfully',
        data: recommendation,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update allocation recommendation';

      const statusCode =
        message === 'Allocation recommendation not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async delete(
    req: Request<AllocationRecommendationParams>,
    res: Response
  ) {
    try {
      await allocationRecommendationService.delete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message: 'Allocation recommendation deleted successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete allocation recommendation';

      const statusCode =
        message === 'Allocation recommendation not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const allocationRecommendationController =
  new AllocationRecommendationController();