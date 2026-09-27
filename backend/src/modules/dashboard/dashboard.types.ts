export interface DashboardSummary {
  totalEmployees: number;
  overallSkillIndex: number;
  pendingAssessments: number;
  employeesWithSkillGaps: number;
  trainingAreas: number;
  activeDevelopmentPlans: number;
}

export interface DashboardResponse {
  summary: DashboardSummary;

  skillIndex: {
    overallSkillIndex: number;
    totalEmployees: number;
    employeesWithApprovedSkills: number;
    totalApprovedSkills: number;
  };

  skillGaps: {
    summary: {
      totalGaps: number;
      totalGapPoints: number;
      employeesAffected: number;
      skillsAffected: number;
    };
    skillSummary: unknown[];
    departmentSummary: unknown[];
  };

  trainingNeeds: {
    summary: {
      trainingAreas: number;
      totalGapPoints: number;
      employeesAffected: number;
      skillsAffected: number;
    };
    trainingNeeds: unknown[];
    departmentTrainingNeeds: unknown[];
  };

  departments: unknown[];

  developmentPlans: {
    active: number;
    completed: number;
    planned: number;
    inProgress: number;
  };
}