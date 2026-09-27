export interface AllocationEngineInput {
  allocationRunId: string;
  projectId: string;
}

export interface SkillEvaluation {
  skillId: string;
  skillName: string;
  requiredRating: number;
  approvedRating: number | null;
  weight: number;
  mandatory: boolean;
  eligible: boolean;
}

export interface EmployeeEvaluation {
  employeeId: string;
  employeeName: string;
  taskId: string;
  eligible: boolean;
  score: number;
  reason: string;
  skillEvaluations: SkillEvaluation[];
  availableHours: number;
  allocatedHours: number;
  remainingHours: number;
}

export interface AllocationEngineResult {
  allocationRunId: string;
  projectId: string;
  recommendationsCreated: number;
  evaluations: EmployeeEvaluation[];
}