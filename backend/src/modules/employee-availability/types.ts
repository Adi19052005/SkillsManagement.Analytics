import { Request } from 'express';

export interface CreateEmployeeAvailabilityBody {
  employeeId: string;
  date: string;
  availableHours: number;
}

export interface UpdateEmployeeAvailabilityBody {
  date?: string;
  availableHours?: number;
}

export interface EmployeeAvailabilityParams {
  id: string;
}

export interface EmployeeParams {
  employeeId: string;
}

export type CreateEmployeeAvailabilityRequest = Request<
  Record<string, never>,
  unknown,
  CreateEmployeeAvailabilityBody
>;

export type UpdateEmployeeAvailabilityRequest = Request<
  EmployeeAvailabilityParams,
  unknown,
  UpdateEmployeeAvailabilityBody
>;

export type GetEmployeeAvailabilityRequest = Request<EmployeeParams>;

export type DeleteEmployeeAvailabilityRequest =
  Request<EmployeeAvailabilityParams>;