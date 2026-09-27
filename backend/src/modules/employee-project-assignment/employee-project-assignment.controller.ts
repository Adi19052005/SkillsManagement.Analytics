import { Request, Response } from "express";
import {
  createProjectAssignment,
  getProjectAssignmentById,
  getEmployeeProjectAssignments,
  getProjectAssignments,
  releaseProjectAssignment,
} from "./employee-project-assignment.service";

export const createProjectAssignmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { employeeId, projectId, deliverableId } = req.body;

    const assignment = await createProjectAssignment(
      employeeId,
      projectId,
      deliverableId
    );

    res.status(201).json({
      data: assignment,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create project assignment";

    if (
      message === "Employee not found" ||
      message === "Project not found" ||
      message === "Deliverable not found for this project"
    ) {
      res.status(404).json({
        error: message,
      });
      return;
    }

    if (
      message === "Employee is already assigned to this deliverable"
    ) {
      res.status(409).json({
        error: message,
      });
      return;
    }

    res.status(500).json({
      error: message,
    });
  }
};

export const getProjectAssignmentByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const assignmentId = String(req.params.assignmentId);

    const assignment =
      await getProjectAssignmentById(assignmentId);

    res.status(200).json({
      data: assignment,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to get project assignment";

    if (message === "Project assignment not found") {
      res.status(404).json({
        error: message,
      });
      return;
    }

    res.status(500).json({
      error: message,
    });
  }
};

export const getEmployeeProjectAssignmentsController = async (
  req: Request,
  res: Response
) => {
  try {
    const employeeId = String(req.params.employeeId);

    const assignments =
      await getEmployeeProjectAssignments(employeeId);

    res.status(200).json({
      data: assignments,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to get employee assignments";

    if (message === "Employee not found") {
      res.status(404).json({
        error: message,
      });
      return;
    }

    res.status(500).json({
      error: message,
    });
  }
};

export const getProjectAssignmentsController = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId = String(req.params.projectId);

    const assignments =
      await getProjectAssignments(projectId);

    res.status(200).json({
      data: assignments,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to get project assignments";

    if (message === "Project not found") {
      res.status(404).json({
        error: message,
      });
      return;
    }

    res.status(500).json({
      error: message,
    });
  }
};

export const releaseProjectAssignmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const assignmentId = String(req.params.assignmentId);

    const releasedAt =
      typeof req.body?.releasedAt === "string"
        ? req.body.releasedAt
        : undefined;

    const assignment = await releaseProjectAssignment(
      assignmentId,
      releasedAt
    );

    res.status(200).json({
      data: assignment,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to release project assignment";

    if (message === "Project assignment not found") {
      res.status(404).json({
        error: message,
      });
      return;
    }

    if (message === "Project assignment is already released") {
      res.status(409).json({
        error: message,
      });
      return;
    }

    res.status(500).json({
      error: message,
    });
  }
};