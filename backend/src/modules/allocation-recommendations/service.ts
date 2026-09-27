import { prisma } from '../../utils/db';
import {
  CreateAllocationRecommendationBody,
  UpdateAllocationRecommendationBody,
} from './types';

export class AllocationRecommendationService {
  async create(data: CreateAllocationRecommendationBody) {
    const {
      allocationRunId,
      taskId,
      employeeId,
      score,
      eligible,
      reason,
    } = data;

    const allocationRun = await prisma.allocationRun.findUnique({
      where: { id: allocationRunId },
    });

    if (!allocationRun) {
      throw new Error('Allocation run not found');
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.projectId !== allocationRun.projectId) {
      throw new Error(
        'Task does not belong to the allocation run project'
      );
    }

    const employee = await prisma.employeeProfile.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const existing = await prisma.allocationRecommendation.findFirst({
      where: {
        allocationRunId,
        taskId,
        employeeId,
      },
    });

    if (existing) {
      throw new Error(
        'Allocation recommendation already exists'
      );
    }

    return prisma.allocationRecommendation.create({
      data: {
        allocationRunId,
        taskId,
        employeeId,
        score,
        eligible,
        reason,
      },
      include: {
        allocationRun: true,
        task: true,
        employee: true,
      },
    });
  }

  async getById(id: string) {
    const recommendation =
      await prisma.allocationRecommendation.findUnique({
        where: { id },
        include: {
          allocationRun: true,
          task: true,
          employee: true,
        },
      });

    if (!recommendation) {
      throw new Error(
        'Allocation recommendation not found'
      );
    }

    return recommendation;
  }

  async getByRun(allocationRunId: string) {
    const allocationRun = await prisma.allocationRun.findUnique({
      where: { id: allocationRunId },
    });

    if (!allocationRun) {
      throw new Error('Allocation run not found');
    }

    return prisma.allocationRecommendation.findMany({
      where: { allocationRunId },
      include: {
        task: true,
        employee: true,
      },
      orderBy: [
        {
          eligible: 'desc',
        },
        {
          score: 'desc',
        },
      ],
    });
  }

  async getByTask(taskId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return prisma.allocationRecommendation.findMany({
      where: { taskId },
      include: {
        allocationRun: true,
        employee: true,
      },
      orderBy: [
        {
          eligible: 'desc',
        },
        {
          score: 'desc',
        },
      ],
    });
  }

  async getByEmployee(employeeId: string) {
    const employee = await prisma.employeeProfile.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    return prisma.allocationRecommendation.findMany({
      where: { employeeId },
      include: {
        allocationRun: true,
        task: true,
      },
      orderBy: {
        score: 'desc',
      },
    });
  }

  async update(
    id: string,
    data: UpdateAllocationRecommendationBody
  ) {
    const existing =
      await prisma.allocationRecommendation.findUnique({
        where: { id },
      });

    if (!existing) {
      throw new Error(
        'Allocation recommendation not found'
      );
    }

    return prisma.allocationRecommendation.update({
      where: { id },
      data,
      include: {
        allocationRun: true,
        task: true,
        employee: true,
      },
    });
  }

  async delete(id: string) {
    const existing =
      await prisma.allocationRecommendation.findUnique({
        where: { id },
      });

    if (!existing) {
      throw new Error(
        'Allocation recommendation not found'
      );
    }

    await prisma.allocationRecommendation.delete({
      where: { id },
    });
  }
}

export const allocationRecommendationService =
  new AllocationRecommendationService();