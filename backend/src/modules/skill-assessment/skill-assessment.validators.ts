import { body, param } from "express-validator";

export const createSkillAssessmentValidator = [
  body("employeeId")
    .isUUID()
    .withMessage("employeeId must be a valid UUID"),

  body("skillId")
    .isUUID()
    .withMessage("skillId must be a valid UUID"),

  body("selfRating")
    .isInt({ min: 0, max: 5 })
    .withMessage("selfRating must be between 0 and 5"),

  body("comment")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("comment must be at most 1000 characters"),
];

export const updateSelfAssessmentValidator = [
  param("id")
    .isUUID()
    .withMessage("id must be a valid UUID"),

  body("selfRating")
    .isInt({ min: 0, max: 5 })
    .withMessage("selfRating must be between 0 and 5"),

  body("comment")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("comment must be at most 1000 characters"),
];

export const reviewSkillAssessmentValidator = [
  param("id")
    .isUUID()
    .withMessage("id must be a valid UUID"),

  body("approvedRating")
    .isInt({ min: 0, max: 5 })
    .withMessage("approvedRating must be between 0 and 5"),

  body("status")
    .isIn(["APPROVED", "REJECTED", "PENDING"])
    .withMessage("Invalid assessment status"),

  body("comment")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("comment must be at most 1000 characters"),
];

export const assessmentIdValidator = [
  param("id")
    .isUUID()
    .withMessage("id must be a valid UUID"),
];

export const employeeAssessmentValidator = [
  param("employeeId")
    .isUUID()
    .withMessage("employeeId must be a valid UUID"),
];