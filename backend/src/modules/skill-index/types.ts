export interface SkillIndexResult {
	overallSkillIndex: number;
	totalEmployees: number;
	employeesWithApprovedSkills: number;
	totalApprovedSkills: number;
}

export interface EmployeeSkillIndex {
	employeeId: string;
	employeeName: string;
	departmentId: string | null;
	departmentName: string;
	approvedSkillCount: number;
	skillIndex: number;
}

export interface DepartmentSkillIndex {
	departmentId: string | null;
	departmentName: string;
	employeeCount: number;
	employeesWithApprovedSkills: number;
	approvedSkillCount: number;
	skillIndex: number;
}