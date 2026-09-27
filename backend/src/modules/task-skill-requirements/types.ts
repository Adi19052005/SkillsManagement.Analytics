import { Request } from 'express';

export interface CreateTaskSkillRequirementBody {
  taskId: string;
  skillId: string;
  requiredRating: number;
  weight?: number;
  mandatory?: boolean;
}

export interface UpdateTaskSkillRequirementBody {
  requiredRating?: number;
  weight?: number;
  mandatory?: boolean;
}

export interface TaskSkillRequirementParams {
  id: string;
}

export interface TaskParams {
  taskId: string;
}

export type CreateTaskSkillRequirementRequest =
  Request<
    Record<string, never>,
    unknown,
    CreateTaskSkillRequirementBody
  >;

export type UpdateTaskSkillRequirementRequest =
  Request<
    TaskSkillRequirementParams,
    unknown,
    UpdateTaskSkillRequirementBody
  >;

export type GetTaskSkillRequirementsRequest =
  Request<TaskParams>;

export type DeleteTaskSkillRequirementRequest =
  Request<TaskSkillRequirementParams>;