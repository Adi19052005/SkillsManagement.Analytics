import { Request, Response } from 'express';

import { allocationEngineService } from './service';
import { AllocationEngineInput } from './types';

export class AllocationEngineController {
  async generate(req: Request, res: Response) {
    try {
      const input: AllocationEngineInput = {
        allocationRunId: req.body.allocationRunId,
        projectId: req.body.projectId,
      };

      const result = await allocationEngineService.generate(input);

      return res.status(200).json({
        success: true,
        message: 'Allocation recommendations generated successfully',
        data: result,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to generate allocation recommendations';

      let statusCode = 400;

      if (
        message === 'Allocation run not found'
      ) {
        statusCode = 404;
      }

      if (
        message ===
        'Allocation run does not belong to the project'
      ) {
        statusCode = 400;
      }

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const allocationEngineController =
  new AllocationEngineController();