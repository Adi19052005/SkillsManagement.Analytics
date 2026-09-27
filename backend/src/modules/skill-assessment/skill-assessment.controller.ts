import { Request, Response } from "express";
import {
  createSkillAssessment,
  getEmployeeAssessments,
  getPendingAssessments,
  getSkillAssessmentById,
  reviewSkillAssessment,
  updateSelfAssessment,
} from "./skill-assessment.service";

export const createAssessment = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createSkillAssessment(req.body);

    res.status(201).json({
      message: "Skill assessment created successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create skill assessment";

    res.status(400).json({
      error: message,
    });
  }
};

export const getEmployeeAssessmentsController = async (
  req: Request,
  res: Response
) => {
  try {
    const employeeId = String(req.params.employeeId);

    const result = await getEmployeeAssessments(employeeId);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch employee assessments";

    res.status(400).json({
      error: message,
    });
  }
};

export const getAssessmentById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const result = await getSkillAssessmentById(id);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch skill assessment";

    if (message === "Skill assessment not found") {
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

export const updateSelfAssessmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const result = await updateSelfAssessment(
      id,
      req.body
    );

    res.status(200).json({
      message: "Self assessment updated successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update self assessment";

    if (message === "Skill assessment not found") {
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

export const reviewAssessment = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    if (!req.user) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const result = await reviewSkillAssessment(
      id,
      req.body,
      req.user.userId
    );

    res.status(200).json({
      message: "Skill assessment reviewed successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to review skill assessment";

    if (message === "Skill assessment not found") {
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

export const getPendingAssessmentsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await getPendingAssessments();

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch pending assessments";

    res.status(400).json({
      error: message,
    });
  }
};