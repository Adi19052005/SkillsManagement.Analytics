import { prisma } from '../../utils/db';
import {
  CreateEmployeeAvailabilityBody,
  UpdateEmployeeAvailabilityBody,
} from './types';

export class EmployeeAvailabilityService {
  async create(data: CreateEmployeeAvailabilityBody) {
    const { employeeId, date, availableHours } = data;

    const employee = await prisma.employeeProfile.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const availabilityDate = new Date(date);

    const existing = await prisma.employeeAvailability.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: availabilityDate,
        },
      },
    });

    if (existing) {
      throw new Error(
        'Availability already exists for this employee on this date',
      );
    }

    return prisma.employeeAvailability.create({
      data: {
        employeeId,
        date: availabilityDate,
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

    return prisma.employeeAvailability.findMany({
      where: {
        employeeId,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async getById(id: string) {
    const availability = await prisma.employeeAvailability.findUnique({
      where: {
        id,
      },
      include: {
        employee: true,
      },
    });

    if (!availability) {
      throw new Error('Employee availability not found');
    }

    return availability;
  }

  async update(
    id: string,
    data: UpdateEmployeeAvailabilityBody,
  ) {
    const existing = await prisma.employeeAvailability.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new Error('Employee availability not found');
    }

    let updateData: {
      date?: Date;
      availableHours?: number;
    } = {};

    if (data.date !== undefined) {
      updateData.date = new Date(data.date);
    }

    if (data.availableHours !== undefined) {
      updateData.availableHours = data.availableHours;
    }

    if (updateData.date) {
      const duplicate = await prisma.employeeAvailability.findUnique({
        where: {
          employeeId_date: {
            employeeId: existing.employeeId,
            date: updateData.date,
          },
        },
      });

      if (duplicate && duplicate.id !== id) {
        throw new Error(
          'Availability already exists for this employee on this date',
        );
      }
    }

    return prisma.employeeAvailability.update({
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
    const existing = await prisma.employeeAvailability.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new Error('Employee availability not found');
    }

    await prisma.employeeAvailability.delete({
      where: {
        id,
      },
    });
  }
}

export const employeeAvailabilityService =
  new EmployeeAvailabilityService();