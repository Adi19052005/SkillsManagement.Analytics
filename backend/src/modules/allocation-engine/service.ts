import { prisma } from '../../utils/db';

import {
  AllocationEngineInput,
  AllocationEngineResult,
  EmployeeEvaluation,
  SkillEvaluation,
} from './types';

export class AllocationEngineService {
  async generate(
    input: AllocationEngineInput
  ): Promise<AllocationEngineResult> {
    const { allocationRunId, projectId } = input;

    const allocationRun = await prisma.allocationRun.findUnique({
      where: { id: allocationRunId },
    });

    if (!allocationRun) {
      throw new Error('Allocation run not found');
    }

    if (allocationRun.projectId !== projectId) {
      throw new Error(
        'Allocation run does not belong to the project'
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        status: {
          not: 'COMPLETED',
        },
      },
      include: {
        skillRequirements: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: [
        {
          priority: 'desc',
        },
        {
          dueDate: 'asc',
        },
      ],
    });

    const employees = await prisma.employeeProfile.findMany({
      include: {
        employeeSkills: {
          include: {
            skill: true,
          },
        },
        availability: true,
        workload: true,
      },
    });

    if (tasks.length === 0) {
      return {
        allocationRunId,
        projectId,
        recommendationsCreated: 0,
        evaluations: [],
      };
    }

    const evaluations: EmployeeEvaluation[] = [];

    for (const task of tasks) {
      for (const employee of employees) {
        const skillEvaluations: SkillEvaluation[] = [];

        let hardEligible = true;
        let weightedScore = 0;
        let totalWeight = 0;

        for (const requirement of task.skillRequirements) {
          const employeeSkill = employee.employeeSkills.find(
            (skill) => skill.skillId === requirement.skillId
          );

          const approvedRating =
            employeeSkill?.approvedRating ?? null;

          const skillEligible =
            approvedRating !== null &&
            approvedRating >= requirement.requiredRating;

          skillEvaluations.push({
            skillId: requirement.skillId,
            skillName: requirement.skill.name,
            requiredRating: requirement.requiredRating,
            approvedRating,
            weight: requirement.weight,
            mandatory: requirement.mandatory,
            eligible: skillEligible,
          });

          if (requirement.mandatory && !skillEligible) {
            hardEligible = false;
          }

          if (approvedRating !== null) {
            weightedScore +=
              approvedRating * requirement.weight;

            totalWeight += requirement.weight;
          }
        }

        const skillScore =
          totalWeight > 0
            ? weightedScore / totalWeight
            : 0;

        const taskHours = task.estimatedHours ?? 0;

        const workloadRecords = employee.workload.filter(
          (record) => {
            if (!task.startDate) {
              return true;
            }

            const taskDate = new Date(task.startDate);
            const recordDate = new Date(record.date);

            return (
              taskDate.toISOString().slice(0, 10) ===
              recordDate.toISOString().slice(0, 10)
            );
          }
        );

        const availabilityRecords =
          employee.availability.filter((record) => {
            if (!task.startDate) {
              return true;
            }

            const taskDate = new Date(task.startDate);
            const recordDate = new Date(record.date);

            return (
              taskDate.toISOString().slice(0, 10) ===
              recordDate.toISOString().slice(0, 10)
            );
          });

        const availableHours = availabilityRecords.reduce(
          (total, record) =>
            total + record.availableHours,
          0
        );

        const allocatedHours = workloadRecords.reduce(
          (total, record) =>
            total + record.allocatedHours,
          0
        );

        const remainingHours =
          Math.max(availableHours - allocatedHours, 0);

        const workloadEligible =
          taskHours <= 0 ||
          remainingHours >= taskHours;

        const eligible =
          hardEligible && workloadEligible;

        let reason = 'Eligible';

        if (!hardEligible) {
          const failedSkills = skillEvaluations
            .filter(
              (skill) =>
                skill.mandatory && !skill.eligible
            )
            .map(
              (skill) =>
                `${skill.skillName}: required ${skill.requiredRating}, approved ${skill.approvedRating ?? 'N/A'}`
            );

          reason =
            `Mandatory skill requirement failed: ${failedSkills.join(
              ', '
            )}`;
        } else if (!workloadEligible) {
          reason =
            `Insufficient availability: required ${taskHours}h, remaining ${remainingHours}h`;
        }

        evaluations.push({
          employeeId: employee.id,
          employeeName: employee.fullname,
          taskId: task.id,
          eligible,
          score: skillScore,
          reason,
          skillEvaluations,
          availableHours,
          allocatedHours,
          remainingHours,
        });
      }
    }

    await prisma.allocationRecommendation.deleteMany({
      where: {
        allocationRunId,
      },
    });

    if (evaluations.length > 0) {
      await prisma.allocationRecommendation.createMany({
        data: evaluations.map((evaluation) => ({
          allocationRunId,
          taskId: evaluation.taskId,
          employeeId: evaluation.employeeId,
          score: evaluation.score,
          eligible: evaluation.eligible,
          reason: evaluation.reason,
        })),
      });
    }

    return {
      allocationRunId,
      projectId,
      recommendationsCreated: evaluations.length,
      evaluations,
    };
  }
}

export const allocationEngineService =
  new AllocationEngineService();