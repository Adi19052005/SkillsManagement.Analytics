import { body, param } from "express-validator";

export const extractProjectTasksValidator = [
  param("projectId")
    .isUUID()
    .withMessage("projectId must be a valid UUID"),

  body("projectDescription")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 10, max: 10000 })
    .withMessage(
      "projectDescription must be between 10 and 10000 characters"
    ),
];