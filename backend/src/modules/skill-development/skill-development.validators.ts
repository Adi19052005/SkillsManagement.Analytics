import { body, param } from "express-validator";

export const createSkillDevelopmentValidator = [
  body("employeeId")
    .isUUID()
    .withMessage("employeeId must be a valid UUID"),

  body("skillId")
    .isUUID()
    .withMessage("skillId must be a valid UUID"),

  body("targetRating")
    .isInt({ min: 1, max: 5 })
    .withMessage("targetRating must be between 1 and 5"),

  body("action")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("action is required"),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Invalid priority"),

  body("targetDate")
    .optional()
    .isISO8601()
    .withMessage("targetDate must be a valid date"),
];

export const updateSkillDevelopmentValidator = [
  param("id")
    .isUUID()
    .withMessage("id must be a valid UUID"),

  body("targetRating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("targetRating must be between 1 and 5"),

  body("action")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("action cannot be empty"),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Invalid priority"),

  body("status")
    .optional()
    .isIn(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .withMessage("Invalid status"),

  body("targetDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("targetDate must be a valid date"),
];

export const employeeSkillDevelopmentValidator = [
  param("employeeId")
    .isUUID()
    .withMessage("employeeId must be a valid UUID"),
];

export const skillDevelopmentIdValidator = [
  param("id")
    .isUUID()
    .withMessage("id must be a valid UUID"),
];