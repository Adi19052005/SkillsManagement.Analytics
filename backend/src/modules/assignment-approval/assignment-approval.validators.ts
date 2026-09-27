import { body, param } from "express-validator";

export const recommendationIdValidator = [
  param("recommendationId")
    .isUUID()
    .withMessage("recommendationId must be a valid UUID"),
];

export const rejectAssignmentValidator = [
  param("recommendationId")
    .isUUID()
    .withMessage("recommendationId must be a valid UUID"),

  body("reason")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("reason must be at most 500 characters"),
];

export const allocationRunIdValidator = [
  param("allocationRunId")
    .isUUID()
    .withMessage("allocationRunId must be a valid UUID"),
];