import { Request, Response } from "express";
import * as skillIndexService from "./service";

export const getOverallSkillIndex = async (
	req: Request,
	res: Response
) => {
	try {
		const data =
			await skillIndexService.getOverallSkillIndex();

		res.status(200).json({
			success: true,
			data,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			error:
				error?.message ||
				"Failed to fetch overall skill index",
		});
	}
};

export const getEmployeeSkillIndex = async (
	req: Request,
	res: Response
) => {
	try {
		const employeeId = req.params.employeeId as string;

		const data =
			await skillIndexService.getEmployeeSkillIndex(
				employeeId
			);

		res.status(200).json({
			success: true,
			data,
		});
	} catch (error: any) {
		const statusCode =
			error?.message === "Employee not found"
				? 404
				: 500;

		res.status(statusCode).json({
			success: false,
			error:
				error?.message ||
				"Failed to fetch employee skill index",
		});
	}
};

export const getDepartmentSkillIndex = async (
	req: Request,
	res: Response
) => {
	try {
		const departmentId =
			req.params.departmentId as string;

		const data =
			await skillIndexService.getDepartmentSkillIndex(
				departmentId
			);

		res.status(200).json({
			success: true,
			data,
		});
	} catch (error: any) {
		const statusCode =
			error?.message === "Department not found"
				? 404
				: 500;

		res.status(statusCode).json({
			success: false,
			error:
				error?.message ||
				"Failed to fetch department skill index",
		});
	}
};

export const getSkillIndexBySkill = async (
	req: Request,
	res: Response
) => {
	try {
		const skillId = req.params.skillId as string;

		const data =
			await skillIndexService.getSkillIndexBySkill(
				skillId
			);

		res.status(200).json({
			success: true,
			data,
		});
	} catch (error: any) {
		const statusCode =
			error?.message === "Skill not found"
				? 404
				: 500;

		res.status(statusCode).json({
			success: false,
			error:
				error?.message ||
				"Failed to fetch skill index",
		});
	}
};