import { Role } from "@prisma/client";
import { prisma } from "../../utils/db";

export const getOverallSkillIndex = async () => {
	const employees = await prisma.employeeProfile.findMany({
		where: {
			user: {
				role: Role.EMPLOYEE,
			},
		},
		select: {
			id: true,
			employeeSkills: {
				where: {
					approvedRating: {
						not: null,
					},
				},
				select: {
					approvedRating: true,
				},
			},
		},
	});

	let totalApprovedRatings = 0;
	let totalApprovedSkills = 0;
	let employeesWithApprovedSkills = 0;

	for (const employee of employees) {
		const ratings = employee.employeeSkills
			.map((skill) => skill.approvedRating)
			.filter((rating): rating is number => rating !== null);

		if (ratings.length === 0) {
			continue;
		}

		employeesWithApprovedSkills += 1;
		totalApprovedSkills += ratings.length;

		totalApprovedRatings += ratings.reduce(
			(sum, rating) => sum + rating,
			0
		);
	}

	const overallSkillIndex =
		totalApprovedSkills > 0
			? totalApprovedRatings / totalApprovedSkills
			: 0;

	return {
		overallSkillIndex: Number(
			overallSkillIndex.toFixed(2)
		),
		totalEmployees: employees.length,
		employeesWithApprovedSkills,
		totalApprovedSkills,
	};
};

export const getEmployeeSkillIndex = async (
	employeeId: string
) => {
	const employee = await prisma.employeeProfile.findUnique({
		where: {
			id: employeeId,
		},
		select: {
			id: true,
			fullname: true,
			department: {
				select: {
					id: true,
					name: true,
				},
			},
			employeeSkills: {
				where: {
					approvedRating: {
						not: null,
					},
				},
				select: {
					skillId: true,
					approvedRating: true,
					skill: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});

	if (!employee) {
		throw new Error("Employee not found");
	}

	const ratings = employee.employeeSkills
		.map((skill) => skill.approvedRating)
		.filter((rating): rating is number => rating !== null);

	const skillIndex =
		ratings.length > 0
			? ratings.reduce(
					(sum, rating) => sum + rating,
					0
				) / ratings.length
			: 0;

	return {
		employeeId: employee.id,
		employeeName: employee.fullname,
		departmentId: employee.department?.id ?? null,
		departmentName:
			employee.department?.name ?? "Unassigned",
		approvedSkillCount: ratings.length,
		skillIndex: Number(skillIndex.toFixed(2)),
		skills: employee.employeeSkills.map((skill) => ({
			skillId: skill.skillId,
			skillName: skill.skill.name,
			approvedRating: skill.approvedRating,
		})),
	};
};

export const getDepartmentSkillIndex = async (
	departmentId: string
) => {
	const department = await prisma.department.findUnique({
		where: {
			id: departmentId,
		},
		select: {
			id: true,
			name: true,
		},
	});

	if (!department) {
		throw new Error("Department not found");
	}

	const employees = await prisma.employeeProfile.findMany({
		where: {
			departmentId,
			user: {
				role: Role.EMPLOYEE,
			},
		},
		select: {
			id: true,
			employeeSkills: {
				where: {
					approvedRating: {
						not: null,
					},
				},
				select: {
					approvedRating: true,
				},
			},
		},
	});

	let totalApprovedRatings = 0;
	let totalApprovedSkills = 0;
	let employeesWithApprovedSkills = 0;

	for (const employee of employees) {
		const ratings = employee.employeeSkills
			.map((skill) => skill.approvedRating)
			.filter((rating): rating is number => rating !== null);

		if (ratings.length === 0) {
			continue;
		}

		employeesWithApprovedSkills += 1;
		totalApprovedSkills += ratings.length;

		totalApprovedRatings += ratings.reduce(
			(sum, rating) => sum + rating,
			0
		);
	}

	const skillIndex =
		totalApprovedSkills > 0
			? totalApprovedRatings / totalApprovedSkills
			: 0;

	return {
		departmentId: department.id,
		departmentName: department.name,
		employeeCount: employees.length,
		employeesWithApprovedSkills,
		approvedSkillCount: totalApprovedSkills,
		skillIndex: Number(skillIndex.toFixed(2)),
	};
};

export const getSkillIndexBySkill = async (
	skillId: string
) => {
	const skill = await prisma.skill.findUnique({
		where: {
			id: skillId,
		},
		select: {
			id: true,
			name: true,
		},
	});

	if (!skill) {
		throw new Error("Skill not found");
	}

	const employeeSkills = await prisma.employeeSkill.findMany({
		where: {
			skillId,
			approvedRating: {
				not: null,
			},
			employee: {
				user: {
					role: Role.EMPLOYEE,
				},
			},
		},
		select: {
			approvedRating: true,
		},
	});

	const ratings = employeeSkills
		.map((employeeSkill) => employeeSkill.approvedRating)
		.filter((rating): rating is number => rating !== null);

	const skillIndex =
		ratings.length > 0
			? ratings.reduce(
					(sum, rating) => sum + rating,
					0
				) / ratings.length
			: 0;

	return {
		skillId: skill.id,
		skillName: skill.name,
		employeesWithApprovedRating: ratings.length,
		skillIndex: Number(skillIndex.toFixed(2)),
	};
};