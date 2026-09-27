import { prisma } from "../../utils/db";

export const getRecommendationsForRun = async (
  allocationRunId: string
) => {
  const allocationRun = await prisma.allocationRun.findUnique({
    where: {
      id: allocationRunId,
    },
  });

  if (!allocationRun) {
    throw new Error("Allocation run not found");
  }

  return prisma.allocationRecommendation.findMany({
    where: {
      allocationRunId,
    },
    include: {
      task: {
        include: {
          skillRequirements: {
            include: {
              skill: true,
            },
          },
        },
      },
      employee: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          department: true,
          employeeSkills: {
            include: {
              skill: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        taskId: "asc",
      },
      {
        eligible: "desc",
      },
      {
        score: "desc",
      },
    ],
  });
};

export const approveAssignment = async (
  recommendationId: string,
  reviewerId: string
) => {
  const result = await prisma.$transaction(async (tx) => {
    /*
     * Fetch recommendation and all information required
     * for final validation.
     */
    const recommendation =
      await tx.allocationRecommendation.findUnique({
        where: {
          id: recommendationId,
        },
        include: {
          task: {
            include: {
              skillRequirements: true,
            },
          },
          employee: {
            include: {
              employeeSkills: true,
            },
          },
          allocationRun: true,
        },
      });

    if (!recommendation) {
      throw new Error("Allocation recommendation not found");
    }

    /*
     * Only eligible recommendations can be approved.
     */
    if (!recommendation.eligible) {
      throw new Error(
        "Cannot approve an ineligible recommendation"
      );
    }

    /*
     * Task must still be unassigned.
     */
    if (recommendation.task.employeeId) {
      throw new Error("Task is already assigned");
    }

    /*
     * Re-check the HARD skill requirements at approval time.
     *
     * This protects against an employee's approved rating
     * changing after the allocation run was generated.
     */
    for (const requirement of recommendation.task.skillRequirements) {
      const employeeSkill =
        recommendation.employee.employeeSkills.find(
          (skill) => skill.skillId === requirement.skillId
        );

      if (
        requirement.mandatory &&
        (!employeeSkill ||
          employeeSkill.approvedRating === null ||
          employeeSkill.approvedRating <
            requirement.requiredRating)
      ) {
        throw new Error(
          "Employee no longer satisfies the required skill threshold"
        );
      }
    }

    /*
     * Ensure the employee belongs to the project through
     * an EmployeeProjectAssignment.
     *
     * If not already assigned to the project/deliverable,
     * create the project-level assignment.
     */
    let projectAssignment =
      await tx.employeeProjectAssignment.findFirst({
        where: {
          employeeId: recommendation.employeeId,
          projectId: recommendation.task.projectId,
          deliverableId: recommendation.task.deliverableId,
          releasedAt: null,
        },
      });

    if (!projectAssignment) {
      projectAssignment =
        await tx.employeeProjectAssignment.create({
          data: {
            employeeId: recommendation.employeeId,
            projectId: recommendation.task.projectId,
            deliverableId: recommendation.task.deliverableId,
          },
        });
    }

    /*
     * Assign employee to the task.
     */
    const task = await tx.task.update({
      where: {
        id: recommendation.taskId,
      },
      data: {
        employeeId: recommendation.employeeId,
      },
      include: {
        employee: true,
        project: true,
        deliverable: true,
      },
    });

    /*
     * Update workload if the task has estimated hours
     * and has a start date.
     *
     * If no start date exists yet, we don't create a
     * workload record because there is no allocation date.
     */
    if (
      task.startDate &&
      task.estimatedHours !== null
    ) {
      const existingWorkload =
        await tx.employeeWorkload.findUnique({
          where: {
            employeeId_date: {
              employeeId: recommendation.employeeId,
              date: task.startDate,
            },
          },
        });

      if (existingWorkload) {
        const newAllocatedHours =
          existingWorkload.allocatedHours +
          task.estimatedHours;

        if (
          existingWorkload.availableHours > 0 &&
          newAllocatedHours >
            existingWorkload.availableHours
        ) {
          throw new Error(
            "Assignment would exceed employee available workload"
          );
        }

        await tx.employeeWorkload.update({
          where: {
            id: existingWorkload.id,
          },
          data: {
            allocatedHours: newAllocatedHours,
          },
        });
      } else {
        await tx.employeeWorkload.create({
          data: {
            employeeId: recommendation.employeeId,
            date: task.startDate,
            allocatedHours: task.estimatedHours,
            availableHours: 0,
          },
        });
      }
    }

    /*
     * Mark the allocation run as approved.
     */
    await tx.allocationRun.update({
      where: {
        id: recommendation.allocationRunId,
      },
      data: {
        status: "APPROVED",
      },
    });

    return {
      projectAssignment,
      task,
      recommendationId,
    };
  });

  return {
    recommendationId: result.recommendationId,
    taskId: result.task.id,
    employeeId: result.task.employeeId,
    status: "APPROVED",
    message: "Assignment approved successfully",
  };
};

export const rejectAssignment = async (
  recommendationId: string,
  reason?: string
) => {
  const recommendation =
    await prisma.allocationRecommendation.findUnique({
      where: {
        id: recommendationId,
      },
    });

  if (!recommendation) {
    throw new Error("Allocation recommendation not found");
  }

  if (!recommendation.eligible) {
    return {
      recommendationId,
      status: "REJECTED",
      message: "Recommendation was already ineligible",
    };
  }

  /*
   * AllocationRecommendation currently has no status or
   * reviewedBy field in the Prisma schema.
   *
   * Therefore rejection cannot be persisted directly on
   * this model without a schema change.
   *
   * We return the rejection result for now.
   */
  return {
    recommendationId,
    status: "REJECTED",
    reason: reason ?? null,
    message:
      "Recommendation rejected. Persistent rejection tracking requires review fields on AllocationRecommendation.",
  };
};