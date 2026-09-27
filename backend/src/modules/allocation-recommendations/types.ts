import { Request } from 'express';

export interface CreateAllocationRecommendationBody {
  allocationRunId: string;
  taskId: string;
  employeeId: string;
  score: number;
  eligible: boolean;
  reason?: string;
}

export interface UpdateAllocationRecommendationBody {
  score?: number;
  eligible?: boolean;
  reason?: string;
}

export interface AllocationRecommendationParams {
  id: string;
}

export interface AllocationRunParams {
  allocationRunId: string;
}

export interface TaskParams {
  taskId: string;
}

export interface EmployeeParams {
  employeeId: string;
}

export type CreateAllocationRecommendationRequest = Request<
  Record<string, never>,
  unknown,
  CreateAllocationRecommendationBody
>;

export type UpdateAllocationRecommendationRequest = Request<
  AllocationRecommendationParams,
  unknown,
  UpdateAllocationRecommendationBody
>;

export type GetAllocationRecommendationRequest = Request<
  AllocationRecommendationParams
>;

export type GetRunRecommendationsRequest = Request<
  AllocationRunParams
>;

export type GetTaskRecommendationsRequest = Request<
  TaskParams
>;

export type GetEmployeeRecommendationsRequest = Request<
  EmployeeParams
>;

export type DeleteAllocationRecommendationRequest = Request<
  AllocationRecommendationParams
>;