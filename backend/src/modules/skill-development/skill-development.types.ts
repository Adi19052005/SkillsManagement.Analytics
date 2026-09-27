import {
  SkillDevelopmentPriority,
  SkillDevelopmentStatus,
} from "@prisma/client";

export interface CreateSkillDevelopmentInput {
  employeeId: string;
  skillId: string;
  targetRating: number;
  action: string;
  priority?: SkillDevelopmentPriority;
  targetDate?: Date;
}

export interface UpdateSkillDevelopmentInput {
  targetRating?: number;
  action?: string;
  priority?: SkillDevelopmentPriority;
  status?: SkillDevelopmentStatus;
  targetDate?: Date | null;
}