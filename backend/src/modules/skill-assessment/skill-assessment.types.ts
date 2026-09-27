export interface CreateSkillAssessmentInput {
  employeeId: string;
  skillId: string;
  selfRating: number;
}

export interface ReviewSkillAssessmentInput {
  approvedRating: number;
  status: "APPROVED" | "REJECTED" | "PENDING";
}

export interface UpdateSelfAssessmentInput {
  selfRating: number;
}