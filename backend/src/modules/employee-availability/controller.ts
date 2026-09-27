import { Response } from 'express';

import {
  CreateEmployeeAvailabilityRequest,
  UpdateEmployeeAvailabilityRequest,
  GetEmployeeAvailabilityRequest,
  DeleteEmployeeAvailabilityRequest,
} from './types';

import { employeeAvailabilityService } from './service';

export class EmployeeAvailabilityController {
  async create(
    req: CreateEmployeeAvailabilityRequest,
    res: Response,
  ) {
    try {
      const availability =
        await employeeAvailabilityService.create(req.body);

      return res.status(201).json({
        success: true,
        message: 'Employee availability created successfully',
        data: availability,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create employee availability';

      let statusCode = 400;

      if (message === 'Employee not found') {
        statusCode = 404;
      }

      if (
        message ===
        'Availability already exists for this employee on this date'
      ) {
        statusCode = 409;
      }

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getByEmployee(
    req: GetEmployeeAvailabilityRequest,
    res: Response,
  ) {
    try {
      const availability =
        await employeeAvailabilityService.getByEmployee(
          req.params.employeeId,
        );

      return res.status(200).json({
        success: true,
        data: availability,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch employee availability';

      const statusCode =
        message === 'Employee not found' ? 404 : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getById(req: any, res: Response) {
    try {
      const availability =
        await employeeAvailabilityService.getById(req.params.id);

      return res.status(200).json({
        success: true,
        data: availability,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch employee availability';

      const statusCode =
        message === 'Employee availability not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async update(
    req: UpdateEmployeeAvailabilityRequest,
    res: Response,
  ) {
    try {
      const availability =
        await employeeAvailabilityService.update(
          req.params.id,
          req.body,
        );

      return res.status(200).json({
        success: true,
        message: 'Employee availability updated successfully',
        data: availability,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update employee availability';

      let statusCode = 400;

      if (message === 'Employee availability not found') {
        statusCode = 404;
      }

      if (
        message ===
        'Availability already exists for this employee on this date'
      ) {
        statusCode = 409;
      }

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async delete(
    req: DeleteEmployeeAvailabilityRequest,
    res: Response,
  ) {
    try {
      await employeeAvailabilityService.delete(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Employee availability deleted successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete employee availability';

      const statusCode =
        message === 'Employee availability not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const employeeAvailabilityController =
  new EmployeeAvailabilityController();