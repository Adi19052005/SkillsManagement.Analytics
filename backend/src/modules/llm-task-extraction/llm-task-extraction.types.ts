export interface ExtractProjectTasksInput {
  projectId: string;
  projectDescription?: string;
}

export interface ExtractedSkillRequirement {
  skillName: string;
  requiredRating: number;
  weight: number;
  mandatory: boolean;
}

export interface ExtractedTaskDependency {
  dependsOnTaskIndex: number;
}

export interface ExtractedTask {
  title: string;
  description: string;
  estimatedHours: number;
  priority: number;
  skills: ExtractedSkillRequirement[];
  dependencies: ExtractedTaskDependency[];
}

export interface ExtractedProjectPlan {
  projectId: string;
  tasks: ExtractedTask[];
}