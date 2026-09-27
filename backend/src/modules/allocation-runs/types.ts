import { Request } from 'express';

export interface CreateAllocationRunBody {
  projectId: string;
}

export interface AllocationRunParams {
  id: string;
}

export interface ProjectParams {
  projectId: string;
}

export type CreateAllocationRunRequest = Request<
  Record<string, never>,
  unknown,
  CreateAllocationRunBody
>;

export type GetAllocationRunRequest = Request<
  AllocationRunParams
>;

export type GetProjectAllocationRunsRequest = Request<
  ProjectParams
>;