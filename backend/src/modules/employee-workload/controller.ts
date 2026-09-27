import { Response } from 'express';

import {
  CreateEmployeeWorkloadRequest,
  UpdateEmployeeWorkloadRequest,
  GetEmployeeWorkloadRequest,
  GetEmployeeWorkloadByIdRequest,
  DeleteEmployeeWorkloadRequest,
} from './types';

import { employeeWorkloadService } from './service';

export class EmployeeWorkloadController {
  async create(
    req: CreateEmployeeWorkloadRequest,
    res: Response,
  ) {
    try {
      const workload = await employeeWorkloadService.create(
        req.body,
      );

      return res.status(201).json({
        success: true,
        message: 'Employee workload created successfully',
        data: workload,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create employee workload';

      let statusCode = 400;

      if (message === 'Employee not found') {
        statusCode = 404;
      }

      if (
        message ===
        'Workload already exists for this employee on this date'
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
    req: GetEmployeeWorkloadRequest,
    res: Response,
  ) {
    try {
      const workload =
        await employeeWorkloadService.getByEmployee(
          req.params.employeeId,
        );

      return res.status(200).json({
        success: true,
        data: workload,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch employee workload';

      const statusCode =
        message === 'Employee not found' ? 404 : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getById(
    req: GetEmployeeWorkloadByIdRequest,
    res: Response,
  ) {
    try {
      const workload =
        await employeeWorkloadService.getById(
          req.params.id,
        );

      return res.status(200).json({
        success: true,
        data: workload,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch employee workload';

      const statusCode =
        message === 'Employee workload not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async update(
    req: UpdateEmployeeWorkloadRequest,
    res: Response,
  ) {
    try {
      const workload =
        await employeeWorkloadService.update(
          req.params.id,
          req.body,
        );

      return res.status(200).json({
        success: true,
        message: 'Employee workload updated successfully',
        data: workload,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update employee workload';

      let statusCode = 400;

      if (message === 'Employee workload not found') {
        statusCode = 404;
      }

      if (
        message ===
        'Workload already exists for this employee on this date'
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
    req: DeleteEmployeeWorkloadRequest,
    res: Response,
  ) {
    try {
      await employeeWorkloadService.delete(
        req.params.id,
      );

      return res.status(200).json({
        success: true,
        message: 'Employee workload deleted successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete employee workload';

      const statusCode =
        message === 'Employee workload not found'
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const employeeWorkloadController =
  new EmployeeWorkloadController();