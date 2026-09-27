import { body, param } from "express-validator";

export const approveTaskPlanValidator = [
  param("projectId")
    .isUUID()
    .withMessage("projectId must be a valid UUID"),

  body("tasks")
    .isArray({ min: 1 })
    .withMessage("tasks must be a non-empty array"),

  body("tasks.*.title")
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Task title is required and must be at most 200 characters"),

  body("tasks.*.description")
    .optional()
    .isString()
    .withMessage("Task description must be a string"),

  body("tasks.*.estimatedHours")
    .isFloat({ min: 0 })
    .withMessage("estimatedHours must be a non-negative number"),

  body("tasks.*.priority")
    .isInt({ min: 1, max: 5 })
    .withMessage("priority must be between 1 and 5"),

  body("tasks.*.skills")
    .isArray()
    .withMessage("skills must be an array"),

  body("tasks.*.skills.*.skillId")
    .isUUID()
    .withMessage("skillId must be a valid UUID"),

  body("tasks.*.skills.*.requiredRating")
    .isInt({ min: 0, max: 5 })
    .withMessage("requiredRating must be between 0 and 5"),

  body("tasks.*.skills.*.weight")
    .isFloat({ min: 0 })
    .withMessage("weight must be a non-negative number"),

  body("tasks.*.skills.*.mandatory")
    .isBoolean()
    .withMessage("mandatory must be a boolean"),

  body("tasks.*.dependencies")
    .isArray()
    .withMessage("dependencies must be an array"),

  body("tasks.*.dependencies.*.dependsOnTaskIndex")
    .isInt({ min: 0 })
    .withMessage("dependsOnTaskIndex must be a non-negative integer"),
];