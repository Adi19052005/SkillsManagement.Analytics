import { Request, Response } from "express";
import {
  getRecommendationsForRun,
  approveAssignment,
  rejectAssignment,
} from "./assignment-approval.service";

export const getRecommendationsForRunController = async (
  req: Request,
  res: Response
) => {
  try {
    const allocationRunId = String(req.params.allocationRunId);

    const recommendations =
      await getRecommendationsForRun(allocationRunId);

    res.status(200).json({
      data: recommendations,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch recommendations";

    if (message === "Allocation run not found") {
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

export const approveAssignmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const recommendationId = String(
      req.params.recommendationId
    );

    if (!req.user?.userId) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const result = await approveAssignment(
      recommendationId,
      req.user.userId
    );

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to approve assignment";

    if (
      message === "Allocation recommendation not found"
    ) {
      res.status(404).json({
        error: message,
      });
      return;
    }

    if (
      message === "Cannot approve an ineligible recommendation" ||
      message === "Task is already assigned" ||
      message ===
        "Employee no longer satisfies the required skill threshold" ||
      message ===
        "Assignment would exceed employee available workload"
    ) {
      res.status(400).json({
        error: message,
      });
      return;
    }

    res.status(500).json({
      error: message,
    });
  }
};

export const rejectAssignmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const recommendationId = String(
      req.params.recommendationId
    );

    const reason =
      typeof req.body?.reason === "string"
        ? req.body.reason
        : undefined;

    const result = await rejectAssignment(
      recommendationId,
      reason
    );

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to reject assignment";

    if (
      message === "Allocation recommendation not found"
    ) {
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