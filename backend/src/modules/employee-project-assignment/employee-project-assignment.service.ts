import { prisma } from "../../utils/db";

export const createProjectAssignment = async (
  employeeId: string,
  projectId: string,
  deliverableId: string
) => {
  const employee = await prisma.employeeProfile.findUnique({
    where: {
      id: employeeId,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const deliverable = await prisma.deliverable.findFirst({
    where: {
      id: deliverableId,
      projectId,
    },
  });

  if (!deliverable) {
    throw new Error("Deliverable not found for this project");
  }

  const existingAssignment =
    await prisma.employeeProjectAssignment.findFirst({
      where: {
        employeeId,
        projectId,
        deliverableId,
        releasedAt: null,
      },
    });

  if (existingAssignment) {
    throw new Error("Employee is already assigned to this deliverable");
  }

  return prisma.employeeProjectAssignment.create({
    data: {
      employeeId,
      projectId,
      deliverableId,
    },
    include: {
      employee: true,
      project: true,
      deliverable: true,
    },
  });
};

export const getProjectAssignmentById = async (
  assignmentId: string
) => {
  const assignment =
    await prisma.employeeProjectAssignment.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        employee: true,
        project: true,
        deliverable: true,
      },
    });

  if (!assignment) {
    throw new Error("Project assignment not found");
  }

  return assignment;
};

export const getEmployeeProjectAssignments = async (
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

  return prisma.employeeProjectAssignment.findMany({
    where: {
      employeeId,
    },
    include: {
      project: true,
      deliverable: true,
    },
    orderBy: {
      assignedAt: "desc",
    },
  });
};

export const getProjectAssignments = async (
  projectId: string
) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return prisma.employeeProjectAssignment.findMany({
    where: {
      projectId,
    },
    include: {
      employee: true,
      deliverable: true,
    },
    orderBy: {
      assignedAt: "desc",
    },
  });
};

export const releaseProjectAssignment = async (
  assignmentId: string,
  releasedAt?: string
) => {
  const assignment =
    await prisma.employeeProjectAssignment.findUnique({
      where: {
        id: assignmentId,
      },
    });

  if (!assignment) {
    throw new Error("Project assignment not found");
  }

  if (assignment.releasedAt) {
    throw new Error("Project assignment is already released");
  }

  return prisma.employeeProjectAssignment.update({
    where: {
      id: assignmentId,
    },
    data: {
      releasedAt: releasedAt
        ? new Date(releasedAt)
        : new Date(),
    },
    include: {
      employee: true,
      project: true,
      deliverable: true,
    },
  });
};