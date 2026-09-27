import { Request, Response } from "express";
import { approveTaskPlan } from "./task-plan-approval.service";

export const approveTaskPlanController = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId = String(req.params.projectId);

    const input = req.body;

    if (!input || typeof input !== "object") {
      res.status(400).json({
        error: "Request body is required",
      });
      return;
    }

    if (!Array.isArray(input.tasks)) {
      res.status(400).json({
        error: "tasks must be an array",
      });
      return;
    }

    const result = await approveTaskPlan(projectId, input);

    res.status(201).json({
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to approve task plan";

    if (message === "Project not found") {
      res.status(404).json({
        error: message,
      });
      return;
    }

    res.status(400).json({
      error: message,
    });
  }
};