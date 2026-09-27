import { Request } from 'express';

export interface CreateTaskDependencyBody {
  taskId: string;
  dependsOnTaskId: string;
}

export interface TaskDependencyParams {
  id: string;
}

export interface TaskParams {
  taskId: string;
}

export type CreateTaskDependencyRequest = Request<
  Record<string, never>,
  unknown,
  CreateTaskDependencyBody
>;

export type GetTaskDependenciesRequest = Request<TaskParams>;

export type DeleteTaskDependencyRequest =
  Request<TaskDependencyParams>;