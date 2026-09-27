import { Request, Response } from "express";
import { extractProjectTasks } from "./llm-task-extraction.service";

export const extractProjectTasksController = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId = String(req.params.projectId);

    const projectDescription =
      req.body?.projectDescription;

    const result = await extractProjectTasks({
      projectId,
      projectDescription,
    });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to extract project tasks";

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