import { prisma } from "../../utils/db";

import {
  CreateSkillDevelopmentInput,
  UpdateSkillDevelopmentInput,
} from "./skill-development.types";

export const createSkillDevelopmentPlan = async (
  data: CreateSkillDevelopmentInput
) => {
  const employeeSkill = await prisma.employeeSkill.findUnique({
    where: {
      employeeId_skillId: {
        employeeId: data.employeeId,
        skillId: data.skillId,
      },
    },
  });

  if (!employeeSkill) {
    throw new Error("Employee skill record not found");
  }

  if (employeeSkill.approvedRating === null) {
    throw new Error("Skill does not have an approved rating");
  }

  if (data.targetRating <= employeeSkill.approvedRating) {
    throw new Error(
      "Target rating must be greater than the current approved rating"
    );
  }

  const gap = data.targetRating - employeeSkill.approvedRating;

  const existingPlan = await prisma.skillDevelopmentPlan.findFirst({
    where: {
      employeeId: data.employeeId,
      skillId: data.skillId,
      status: {
        in: ["PLANNED", "IN_PROGRESS"],
      },
    },
  });

  if (existingPlan) {
    throw new Error(
      "An active development plan already exists for this skill"
    );
  }

  return prisma.skillDevelopmentPlan.create({
    data: {
      employeeId: data.employeeId,
      skillId: data.skillId,
      currentRating: employeeSkill.approvedRating,
      targetRating: data.targetRating,
      gap,
      action: data.action,
      priority: data.priority ?? "MEDIUM",
      targetDate: data.targetDate,
    },
    include: {
      employee: {
        select: {
          id: true,
          fullname: true,
        },
      },
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getEmployeeSkillDevelopmentPlans = async (
  employeeId: string
) => {
  return prisma.skillDevelopmentPlan.findMany({
    where: {
      employeeId,
    },
    include: {
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [
      {
        priority: "desc",
      },
      {
        targetDate: "asc",
      },
    ],
  });
};

export const getSkillDevelopmentPlanById = async (id: string) => {
  return prisma.skillDevelopmentPlan.findUnique({
    where: {
      id,
    },
    include: {
      employee: {
        select: {
          id: true,
          fullname: true,
        },
      },
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const updateSkillDevelopmentPlan = async (
  id: string,
  data: UpdateSkillDevelopmentInput
) => {
  const existingPlan = await prisma.skillDevelopmentPlan.findUnique({
    where: { id },
  });

  if (!existingPlan) {
    throw new Error("Skill development plan not found");
  }

  const targetRating = data.targetRating ?? existingPlan.targetRating;

  let currentRating = existingPlan.currentRating;

  const employeeSkill = await prisma.employeeSkill.findUnique({
    where: {
      employeeId_skillId: {
        employeeId: existingPlan.employeeId,
        skillId: existingPlan.skillId,
      },
    },
  });

  if (
    employeeSkill?.approvedRating !== null &&
    employeeSkill?.approvedRating !== undefined
  ) {
    currentRating = employeeSkill.approvedRating;
  }

  if (targetRating <= currentRating) {
    throw new Error(
      "Target rating must be greater than the current approved rating"
    );
  }

  const gap = targetRating - currentRating;

  return prisma.skillDevelopmentPlan.update({
    where: { id },
    data: {
      currentRating,
      targetRating,
      gap,
      action: data.action,
      priority: data.priority,
      status: data.status,
      targetDate: data.targetDate,
    },
    include: {
      employee: {
        select: {
          id: true,
          fullname: true,
        },
      },
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const deleteSkillDevelopmentPlan = async (id: string) => {
  const existingPlan = await prisma.skillDevelopmentPlan.findUnique({
    where: { id },
  });

  if (!existingPlan) {
    throw new Error("Skill development plan not found");
  }

  await prisma.skillDevelopmentPlan.delete({
    where: { id },
  });

  return {
    message: "Skill development plan deleted successfully",
  };
};