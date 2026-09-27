import { prisma } from "../../utils/db";
import {
  CreateSkillAssessmentInput,
  ReviewSkillAssessmentInput,
  UpdateSelfAssessmentInput,
} from "./skill-assessment.types";

export const createSkillAssessment = async (
  data: CreateSkillAssessmentInput
) => {
  const employee = await prisma.employeeProfile.findUnique({
    where: {
      id: data.employeeId,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const skill = await prisma.skill.findUnique({
    where: {
      id: data.skillId,
    },
  });

  if (!skill) {
    throw new Error("Skill not found");
  }

  const existingAssessment = await prisma.employeeSkill.findUnique({
    where: {
      employeeId_skillId: {
        employeeId: data.employeeId,
        skillId: data.skillId,
      },
    },
  });

  if (existingAssessment) {
    throw new Error(
      "Skill assessment already exists for this employee"
    );
  }

  return prisma.employeeSkill.create({
    data: {
      employeeId: data.employeeId,
      skillId: data.skillId,
      selfRating: data.selfRating,
      approvedRating: null,
      status: "PENDING",
    },
    include: {
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
      employee: {
        select: {
          id: true,
          fullname: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const getEmployeeAssessments = async (
  employeeId: string
) => {
  const employee = await prisma.employeeProfile.findUnique({
    where: {
      id: employeeId,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  return prisma.employeeSkill.findMany({
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
      reviewer: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: {
      skill: {
        name: "asc",
      },
    },
  });
};

export const getSkillAssessmentById = async (id: string) => {
  const assessment = await prisma.employeeSkill.findUnique({
    where: {
      id,
    },
    include: {
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
      employee: {
        select: {
          id: true,
          fullname: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!assessment) {
    throw new Error("Skill assessment not found");
  }

  return assessment;
};

export const updateSelfAssessment = async (
  id: string,
  data: UpdateSelfAssessmentInput
) => {
  const assessment = await prisma.employeeSkill.findUnique({
    where: {
      id,
    },
  });

  if (!assessment) {
    throw new Error("Skill assessment not found");
  }

  if (assessment.status === "APPROVED") {
    throw new Error(
      "Approved assessment cannot be modified directly"
    );
  }

  return prisma.employeeSkill.update({
    where: {
      id,
    },
    data: {
      selfRating: data.selfRating,
      status: "PENDING",
      approvedRating: null,
      reviewer: {
        disconnect: true,
      },
      reviewedAt: null,
    },
    include: {
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const reviewSkillAssessment = async (
  id: string,
  data: ReviewSkillAssessmentInput,
  reviewerId: string
) => {
  const assessment = await prisma.employeeSkill.findUnique({
    where: {
      id,
    },
  });

  if (!assessment) {
    throw new Error("Skill assessment not found");
  }

  // REJECTED
  if (data.status === "REJECTED") {
    return prisma.employeeSkill.update({
      where: {
        id,
      },
      data: {
        approvedRating: null,
        status: "REJECTED",
        reviewer: {
          connect: {
            id: reviewerId,
          },
        },
        reviewedAt: new Date(),
      },
      include: {
        skill: {
          select: {
            id: true,
            name: true,
          },
        },
        employee: {
          select: {
            id: true,
            fullname: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  // PENDING
  if (data.status === "PENDING") {
    return prisma.employeeSkill.update({
      where: {
        id,
      },
      data: {
        approvedRating: null,
        status: "PENDING",
        reviewer: {
          disconnect: true,
        },
        reviewedAt: null,
      },
      include: {
        skill: {
          select: {
            id: true,
            name: true,
          },
        },
        employee: {
          select: {
            id: true,
            fullname: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  // APPROVED
  return prisma.employeeSkill.update({
    where: {
      id,
    },
    data: {
      approvedRating: data.approvedRating,
      status: "APPROVED",
      reviewer: {
        connect: {
          id: reviewerId,
        },
      },
      reviewedAt: new Date(),
    },
    include: {
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
      employee: {
        select: {
          id: true,
          fullname: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const getPendingAssessments = async () => {
  return prisma.employeeSkill.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      employee: {
        select: {
          id: true,
          fullname: true,
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: {
      reviewedAt: "asc",
    },
  });
};