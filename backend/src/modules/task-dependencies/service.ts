import { prisma } from '../../utils/db';
import { CreateTaskDependencyBody } from './types';

export class TaskDependencyService {
  async create(data: CreateTaskDependencyBody) {
    const { taskId, dependsOnTaskId } = data;

    if (taskId === dependsOnTaskId) {
      throw new Error('A task cannot depend on itself');
    }

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const dependencyTask = await prisma.task.findUnique({
      where: {
        id: dependsOnTaskId,
      },
    });

    if (!dependencyTask) {
      throw new Error('Dependency task not found');
    }

    const existing = await prisma.taskDependency.findUnique({
      where: {
        taskId_dependsOnTaskId: {
          taskId,
          dependsOnTaskId,
        },
      },
    });

    if (existing) {
      throw new Error('This task dependency already exists');
    }

    return prisma.taskDependency.create({
      data: {
        taskId,
        dependsOnTaskId,
      },
      include: {
        task: true,
        dependsOn: true,
      },
    });
  }

  async getByTask(taskId: string) {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return prisma.taskDependency.findMany({
      where: {
        taskId,
      },
      include: {
        dependsOn: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getById(id: string) {
    const dependency = await prisma.taskDependency.findUnique({
      where: {
        id,
      },
      include: {
        task: true,
        dependsOn: true,
      },
    });

    if (!dependency) {
      throw new Error('Task dependency not found');
    }

    return dependency;
  }

  async delete(id: string) {
    const existing = await prisma.taskDependency.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new Error('Task dependency not found');
    }

    await prisma.taskDependency.delete({
      where: {
        id,
      },
    });
  }
}

export const taskDependencyService =
  new TaskDependencyService();