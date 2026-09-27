import { prisma } from "../../utils/db";
import { getDashboardStats } from "../analytics/analytics.service";
import { getSkillGaps } from "../analytics/analytics.service";
import { getTrainingNeeds } from "../analytics/analytics.service";
import { getOverallSkillIndex } from "../skill-index/service";

export const getDashboard = async () => {
  const [
    dashboardStats,
    skillGaps,
    trainingNeeds,
    skillIndex,
    pendingAssessments,
    activeDevelopmentPlans,
    completedDevelopmentPlans,
    plannedDevelopmentPlans,
    inProgressDevelopmentPlans,
    departments,
  ] = await Promise.all([
    getDashboardStats(),
    getSkillGaps(),
    getTrainingNeeds(),
    getOverallSkillIndex(),

    prisma.employeeSkill.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.skillDevelopmentPlan.count({
      where: {
        status: "PLANNED",
      },
    }),

    prisma.skillDevelopmentPlan.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.skillDevelopmentPlan.count({
      where: {
        status: "PLANNED",
      },
    }),

    prisma.skillDevelopmentPlan.count({
      where: {
        status: "IN_PROGRESS",
      },
    }),

    prisma.department.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return {
    summary: {
      totalEmployees: skillIndex.totalEmployees,

      overallSkillIndex: skillIndex.overallSkillIndex,

      pendingAssessments,

      employeesWithSkillGaps:
        skillGaps.summary.employeesAffected,

      trainingAreas:
        trainingNeeds.summary.trainingAreas,

      activeDevelopmentPlans:
        activeDevelopmentPlans +
        inProgressDevelopmentPlans,
    },

    skillIndex: {
      overallSkillIndex:
        skillIndex.overallSkillIndex,

      totalEmployees:
        skillIndex.totalEmployees,

      employeesWithApprovedSkills:
        skillIndex.employeesWithApprovedSkills,

      totalApprovedSkills:
        skillIndex.totalApprovedSkills,
    },

    skillGaps: {
      summary: skillGaps.summary,
      skillSummary: skillGaps.skillSummary,
      departmentSummary: skillGaps.departmentSummary,
    },

    trainingNeeds: {
      summary: trainingNeeds.summary,
      trainingNeeds: trainingNeeds.trainingNeeds,
      departmentTrainingNeeds:
        trainingNeeds.departmentTrainingNeeds,
    },

    departments,

    developmentPlans: {
      active:
        activeDevelopmentPlans +
        inProgressDevelopmentPlans,

      completed:
        completedDevelopmentPlans,

      planned:
        plannedDevelopmentPlans,

      inProgress:
        inProgressDevelopmentPlans,
    },

    analytics: dashboardStats,
  };
};