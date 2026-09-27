import { body, param } from "express-validator";

export const createProjectAssignmentValidator = [
  body("employeeId")
    .isUUID()
    .withMessage("employeeId must be a valid UUID"),

  body("projectId")
    .isUUID()
    .withMessage("projectId must be a valid UUID"),

  body("deliverableId")
    .isUUID()
    .withMessage("deliverableId must be a valid UUID"),
];

export const assignmentIdValidator = [
  param("assignmentId")
    .isUUID()
    .withMessage("assignmentId must be a valid UUID"),
];

export const employeeIdValidator = [
  param("employeeId")
    .isUUID()
    .withMessage("employeeId must be a valid UUID"),
];

export const projectIdValidator = [
  param("projectId")
    .isUUID()
    .withMessage("projectId must be a valid UUID"),
];