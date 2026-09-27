import { Request, Response } from 'express';

import { CreateAllocationRunRequest } from './types';
import { allocationRunService } from './service';

export class AllocationRunController {
  async create(req: CreateAllocationRunRequest, res: Response) {
    try {
      const triggeredBy = req.user?.userId;

      if (!triggeredBy) {
        return res.status(401).json({
          success: false,
          message: 'Authenticated user not found',
        });
      }

      const allocationRun = await allocationRunService.create(
        req.body,
        triggeredBy
      );

      return res.status(201).json({
        success: true,
        message: 'Allocation run created successfully',
        data: allocationRun,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create allocation run';

      let statusCode = 400;

      if (
        message === 'Project not found' ||
        message === 'Triggering user not found'
      ) {
        statusCode = 404;
      }

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const allocationRun = await allocationRunService.getById(
        String(req.params.id)
      );

      return res.status(200).json({
        success: true,
        data: allocationRun,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch allocation run';

      const statusCode =
        message === 'Allocation run not found' ? 404 : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getByProject(req: Request, res: Response) {
    try {
      const allocationRuns =
        await allocationRunService.getByProject(
          String(req.params.projectId)
        );

      return res.status(200).json({
        success: true,
        data: allocationRuns,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch allocation runs';

      const statusCode =
        message === 'Project not found' ? 404 : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const allocationRunController =
  new AllocationRunController();