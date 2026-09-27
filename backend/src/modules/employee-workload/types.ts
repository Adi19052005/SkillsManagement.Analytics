import { Request } from 'express';

export interface CreateEmployeeWorkloadBody {
  employeeId: string;
  date: string;
  allocatedHours?: number;
  availableHours?: number;
}

export interface UpdateEmployeeWorkloadBody {
  date?: string;
  allocatedHours?: number;
  availableHours?: number;
}

export interface EmployeeWorkloadParams {
  id: string;
}

export interface EmployeeParams {
  employeeId: string;
}

export type CreateEmployeeWorkloadRequest = Request<
  Record<string, never>,
  unknown,
  CreateEmployeeWorkloadBody
>;

export type UpdateEmployeeWorkloadRequest = Request<
  EmployeeWorkloadParams,
  unknown,
  UpdateEmployeeWorkloadBody
>;

export type GetEmployeeWorkloadRequest = Request<EmployeeParams>;

export type GetEmployeeWorkloadByIdRequest =
  Request<EmployeeWorkloadParams>;

export type DeleteEmployeeWorkloadRequest =
  Request<EmployeeWorkloadParams>;