import { prisma } from '../../utils/db';
import {
  CreateTaskSkillRequirementBody,
  UpdateTaskSkillRequirementBody,
} from './types';

export class TaskSkillRequirementService {
  async create(data: CreateTaskSkillRequirementBody) {
    const { taskId, skillId, requiredRating, weight, mandatory } = data;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    const existing = await prisma.taskSkillRequirement.findUnique({
      where: {
        taskId_skillId: {
          taskId,
          skillId,
        },
      },
    });

    if (existing) {
      throw new Error(
        'This skill requirement already exists for the task'
      );
    }

    return prisma.taskSkillRequirement.create({
      data: {
        taskId,
        skillId,
        requiredRating,
        weight: weight ?? 1,
        mandatory: mandatory ?? true,
      },
      include: {
        skill: true,
        task: true,
      },
    });
  }

  async getByTask(taskId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return prisma.taskSkillRequirement.findMany({
      where: {
        taskId,
      },
      include: {
        skill: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getById(id: string) {
    const requirement =
      await prisma.taskSkillRequirement.findUnique({
        where: { id },
        include: {
          skill: true,
          task: true,
        },
      });

    if (!requirement) {
      throw new Error('Task skill requirement not found');
    }

    return requirement;
  }

  async update(
    id: string,
    data: UpdateTaskSkillRequirementBody
  ) {
    const existing =
      await prisma.taskSkillRequirement.findUnique({
        where: { id },
      });

    if (!existing) {
      throw new Error('Task skill requirement not found');
    }

    return prisma.taskSkillRequirement.update({
      where: { id },
      data,
      include: {
        skill: true,
        task: true,
      },
    });
  }

  async delete(id: string) {
    const existing =
      await prisma.taskSkillRequirement.findUnique({
        where: { id },
      });

    if (!existing) {
      throw new Error('Task skill requirement not found');
    }

    return prisma.taskSkillRequirement.delete({
      where: { id },
    });
  }
}

export const taskSkillRequirementService =
  new TaskSkillRequirementService();