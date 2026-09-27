import { prisma } from '../../utils/db';
import {
  CreateEmployeeWorkloadBody,
  UpdateEmployeeWorkloadBody,
} from './types';

export class EmployeeWorkloadService {
  async create(data: CreateEmployeeWorkloadBody) {
    const {
      employeeId,
      date,
      allocatedHours = 0,
      availableHours = 0,
    } = data;

    const employee = await prisma.employeeProfile.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const workloadDate = new Date(date);

    const existing = await prisma.employeeWorkload.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: workloadDate,
        },
      },
    });

    if (existing) {
      throw new Error(
        'Workload already exists for this employee on this date',
      );
    }

    if (allocatedHours > availableHours) {
      throw new Error(
        'Allocated hours cannot exceed available hours',
      );
    }

    return prisma.employeeWorkload.create({
      data: {
        employeeId,
        date: workloadDate,
        allocatedHours,
        availableHours,
      },
      include: {
        employee: true,
      },
    });
  }

  async getByEmployee(employeeId: string) {
    const employee = await prisma.employeeProfile.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    return prisma.employeeWorkload.findMany({
      where: {
        employeeId,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async getById(id: string) {
    const workload = await prisma.employeeWorkload.findUnique({
      where: {
        id,
      },
      include: {
        employee: true,
      },
    });

    if (!workload) {
      throw new Error('Employee workload not found');
    }

    return workload;
  }

  async update(
    id: string,
    data: UpdateEmployeeWorkloadBody,
  ) {
    const existing = await prisma.employeeWorkload.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new Error('Employee workload not found');
    }

    const allocatedHours =
      data.allocatedHours ?? existing.allocatedHours;

    const availableHours =
      data.availableHours ?? existing.availableHours;

    if (allocatedHours > availableHours) {
      throw new Error(
        'Allocated hours cannot exceed available hours',
      );
    }

    const updateData: {
      date?: Date;
      allocatedHours?: number;
      availableHours?: number;
    } = {};

    if (data.date !== undefined) {
      updateData.date = new Date(data.date);
    }

    if (data.allocatedHours !== undefined) {
      updateData.allocatedHours = data.allocatedHours;
    }

    if (data.availableHours !== undefined) {
      updateData.availableHours = data.availableHours;
    }

    if (updateData.date) {
      const duplicate = await prisma.employeeWorkload.findUnique({
        where: {
          employeeId_date: {
            employeeId: existing.employeeId,
            date: updateData.date,
          },
        },
      });

      if (duplicate && duplicate.id !== id) {
        throw new Error(
          'Workload already exists for this employee on this date',
        );
      }
    }

    return prisma.employeeWorkload.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        employee: true,
      },
    });
  }

  async delete(id: string) {
    const existing = await prisma.employeeWorkload.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new Error('Employee workload not found');
    }

    await prisma.employeeWorkload.delete({
      where: {
        id,
      },
    });
  }
}

export const employeeWorkloadService =
  new EmployeeWorkloadService();