import { prisma } from '../../utils/db';
import { CreateAllocationRunBody } from './types';

export class AllocationRunService {
  async create(data: CreateAllocationRunBody, triggeredBy: string) {
    const { projectId } = data;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: triggeredBy },
    });

    if (!user) {
      throw new Error('Triggering user not found');
    }

    return prisma.allocationRun.create({
      data: {
        projectId,
        triggeredBy,
        status: 'GENERATED',
      },
      include: {
        project: true,
        user: true,
        recommendations: true,
      },
    });
  }

  async getById(id: string) {
    const allocationRun = await prisma.allocationRun.findUnique({
      where: { id },
      include: {
        project: true,
        user: true,
        recommendations: {
          include: {
            task: true,
            employee: true,
          },
          orderBy: {
            score: 'desc',
          },
        },
      },
    });

    if (!allocationRun) {
      throw new Error('Allocation run not found');
    }

    return allocationRun;
  }

  async getByProject(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return prisma.allocationRun.findMany({
      where: { projectId },
      include: {
        user: true,
        recommendations: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

export const allocationRunService = new AllocationRunService();