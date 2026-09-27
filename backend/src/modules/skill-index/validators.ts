import { param } from "express-validator";

export const employeeSkillIndexValidator = [
	param("employeeId")
		.isUUID()
		.withMessage("employeeId must be a valid UUID"),
];

export const departmentSkillIndexValidator = [
	param("departmentId")
		.isUUID()
		.withMessage("departmentId must be a valid UUID"),
];

export const skillIndexValidator = [
	param("skillId")
		.isUUID()
		.withMessage("skillId must be a valid UUID"),
];