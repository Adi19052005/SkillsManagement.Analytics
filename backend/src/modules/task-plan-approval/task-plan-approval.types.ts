export interface ApprovedTaskSkill {
  skillId: string;
  requiredRating: number;
  weight: number;
  mandatory: boolean;
}

export interface ApprovedTaskDependency {
  dependsOnTaskIndex: number;
}

export interface ApprovedTask {
  title: string;
  description?: string;
  estimatedHours: number;
  priority: number;
  skills: ApprovedTaskSkill[];
  dependencies: ApprovedTaskDependency[];
}

export interface ApproveTaskPlanInput {
  tasks: ApprovedTask[];
}