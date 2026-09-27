import "dotenv/config";
import {
  Role,
  ProjectStatus,
  TaskStatus,
  SkillRatingStatus,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { prisma } from "../src/utils/db";

type CsvRow = Record<string, string>;

function readCsv(fileName: string): CsvRow[] {
  const filePath = path.join(process.cwd(), "data", fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf-8");

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];
}

function makeEmployeeEmail(name: string) {
  return `${name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ".")}@4pmyskills.com`;
}

async function main() {
  console.log("========================================");
  console.log("Starting database seed...");
  console.log("========================================");

  const managers = readCsv("managers.csv");
  const skills = readCsv("skills.csv");
  const employees = readCsv("employees.csv");

  const passwordHash = await bcrypt.hash("password@123", 10);

  /*
   * =====================================================
   * 1. ADMIN + HR
   * =====================================================
   */

  console.log("\nCreating Admin and HR...");

  const adminUser = await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {
      role: Role.ADMIN,
      passwordHash,
    },
    create: {
      email: "admin@example.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const hrUser = await prisma.user.upsert({
    where: {
      email: "hr@example.com",
    },
    update: {
      role: Role.HR,
      passwordHash,
    },
    create: {
      email: "hr@example.com",
      passwordHash,
      role: Role.HR,
    },
  });

  console.log(`Admin: ${adminUser.email}`);
  console.log(`HR: ${hrUser.email}`);

  /*
   * =====================================================
   * 2. DEPARTMENTS
   * =====================================================
   */

  console.log("\nCreating departments...");

  const departmentMap = new Map<string, string>();

  const departmentNames = [
    ...new Set([
      ...managers.map((manager) => manager.department.trim()),
      ...employees.map((employee) => employee.department.trim()),
    ]),
  ];

  for (const departmentName of departmentNames) {
    const department = await prisma.department.upsert({
      where: {
        name: departmentName,
      },
      update: {},
      create: {
        name: departmentName,
      },
    });

    departmentMap.set(departmentName, department.id);

    console.log(`Department: ${departmentName}`);
  }

  /*
   * =====================================================
   * 3. SKILLS
   * =====================================================
   */

  console.log("\nCreating skills...");

  const skillMap = new Map<string, string>();

  for (const row of skills) {
    const skillName = row.Skills.trim();

    const skill = await prisma.skill.upsert({
      where: {
        name: skillName,
      },
      update: {},
      create: {
        name: skillName,
      },
    });

    skillMap.set(skillName, skill.id);

    console.log(`Skill: ${skillName}`);
  }

  /*
   * =====================================================
   * 4. MANAGERS
   * =====================================================
   */

  console.log("\nCreating managers...");

  const managerMap = new Map<string, string>();

  const managerEmails: Record<string, string> = {
    "Priya Nair": "priyanairmanager1@gmail.com",
    "Sandeep Rao": "sandeepraomanager1@gmail.com",
    "Meera Iqbal": "meeraiqbalmanager1@gmail.com",
  };

  for (const row of managers) {
    const managerName = row.managerName.trim();
    const departmentName = row.department.trim();

    const email =
      managerEmails[managerName] || makeEmployeeEmail(managerName);

    const departmentId = departmentMap.get(departmentName);

    if (!departmentId) {
      throw new Error(
        `Department not found for manager ${managerName}: ${departmentName}`,
      );
    }

    const user = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        role: Role.MANAGER,
        passwordHash,
      },
      create: {
        email,
        passwordHash,
        role: Role.MANAGER,
      },
    });

    const profile = await prisma.employeeProfile.upsert({
      where: {
        userId: user.id,
      },
      update: {
        fullname: managerName,
        departmentId,
      },
      create: {
        userId: user.id,
        fullname: managerName,
        departmentId,
      },
    });

    managerMap.set(email, profile.id);

    console.log(`${managerName} -> ${email}`);
  }

  /*
   * =====================================================
   * 5. EMPLOYEES
   * =====================================================
   */

  console.log("\nCreating employees...");

  const employeeMap = new Map<string, string>();

  for (const row of employees) {
    const employeeName = row.name.trim();
    const age = Number(row.age);
    const departmentName = row.department.trim();
    const reportsTo = row.reportsTo.trim();

    const departmentId = departmentMap.get(departmentName);

    if (!departmentId) {
      throw new Error(
        `Department not found for employee ${employeeName}: ${departmentName}`,
      );
    }

    const managerId = managerMap.get(reportsTo);

    if (!managerId) {
      throw new Error(
        `Manager not found for ${employeeName}: ${reportsTo}`,
      );
    }

    const email = makeEmployeeEmail(employeeName);

    const user = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        role: Role.EMPLOYEE,
        passwordHash,
      },
      create: {
        email,
        passwordHash,
        role: Role.EMPLOYEE,
      },
    });

    const profile = await prisma.employeeProfile.upsert({
      where: {
        userId: user.id,
      },
      update: {
        fullname: employeeName,
        age,
        departmentId,
        managerId,
      },
      create: {
        userId: user.id,
        fullname: employeeName,
        age,
        departmentId,
        managerId,
      },
    });

    employeeMap.set(employeeName, profile.id);

    console.log(`${employeeName} -> ${email}`);
  }

  /*
   * =====================================================
   * 6. EMPLOYEE SKILLS
   * =====================================================
   */

  console.log("\nCreating employee skills...");

  const skillColumns = [
    "Docker",
    "Kubernetes",
    "AWS",
    "Node.js",
    "PostgreSQL",
  ];

  for (const row of employees) {
    const employeeName = row.name.trim();
    const employeeId = employeeMap.get(employeeName);

    if (!employeeId) {
      throw new Error(`Employee not found: ${employeeName}`);
    }

    for (const skillName of skillColumns) {
      const skillId = skillMap.get(skillName);

      if (!skillId) {
        throw new Error(`Skill not found: ${skillName}`);
      }

      const rating = Number(row[skillName]);

      if (Number.isNaN(rating)) {
        throw new Error(
          `Invalid ${skillName} rating for ${employeeName}`,
        );
      }

      await prisma.employeeSkill.upsert({
        where: {
          employeeId_skillId: {
            employeeId,
            skillId,
          },
        },
        update: {
          selfRating: rating,
          approvedRating: rating,
          status: SkillRatingStatus.APPROVED,
        },
        create: {
          employeeId,
          skillId,
          selfRating: rating,
          approvedRating: rating,
          status: SkillRatingStatus.APPROVED,
        },
      });
    }

    console.log(`Skills added: ${employeeName}`);
  }

  /*
   * =====================================================
   * 7. PROJECTS
   * =====================================================
   */

  console.log(
    "\nCreating projects, deliverables and assignments...",
  );

  for (const row of employees) {
    const employeeName = row.name.trim();
    const projectName = row.project.trim();
    const deliverableName = row.deliverable.trim();

    const employeeId = employeeMap.get(employeeName);

    if (!employeeId) {
      throw new Error(`Employee not found: ${employeeName}`);
    }

    /*
     * Project
     */

    let project = await prisma.project.findFirst({
      where: {
        name: projectName,
      },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          name: projectName,
          status: ProjectStatus.ACTIVE,
        },
      });

      console.log(`Project created: ${projectName}`);
    }

    /*
     * Deliverable
     */

    let deliverable = await prisma.deliverable.findFirst({
      where: {
        projectId: project.id,
        name: deliverableName,
      },
    });

    if (!deliverable) {
      deliverable = await prisma.deliverable.create({
        data: {
          name: deliverableName,
          projectId: project.id,
        },
      });

      console.log(`Deliverable created: ${deliverableName}`);
    }

    /*
     * Employee Project Assignment
     */

    const existingAssignment =
      await prisma.employeeProjectAssignment.findFirst({
        where: {
          employeeId,
          projectId: project.id,
          deliverableId: deliverable.id,
        },
      });

    if (!existingAssignment) {
      await prisma.employeeProjectAssignment.create({
        data: {
          employeeId,
          projectId: project.id,
          deliverableId: deliverable.id,
        },
      });
    }

    /*
     * Tasks
     */

    const tasks = row.tasks
      .split(";")
      .map((task: string) => task.trim())
      .filter(Boolean);

    for (const taskTitle of tasks) {
      const existingTask = await prisma.task.findFirst({
        where: {
          title: taskTitle,
          employeeId,
          projectId: project.id,
          deliverableId: deliverable.id,
        },
      });

      if (!existingTask) {
        await prisma.task.create({
          data: {
            title: taskTitle,
            status: TaskStatus.PENDING,
            employeeId,
            projectId: project.id,
            deliverableId: deliverable.id,
          },
        });
      }
    }

    console.log(
      `${employeeName} -> ${projectName} -> ${deliverableName}`,
    );
  }

  /*
   * =====================================================
   * FINAL SUMMARY
   * =====================================================
   */

  const counts = {
    users: await prisma.user.count(),
    departments: await prisma.department.count(),
    employees: await prisma.employeeProfile.count(),
    skills: await prisma.skill.count(),
    employeeSkills: await prisma.employeeSkill.count(),
    projects: await prisma.project.count(),
    deliverables: await prisma.deliverable.count(),
    assignments: await prisma.employeeProjectAssignment.count(),
    tasks: await prisma.task.count(),
  };

  console.log("\n========================================");
  console.log("SEED COMPLETED SUCCESSFULLY");
  console.log("========================================");

  console.log(counts);

  console.log("\nLogin credentials:");
  console.log("Admin: admin@example.com");
  console.log("HR: hr@example.com");
  console.log("Managers: use their CSV emails");
  console.log("Employees: firstname.lastname@4pmyskills.com");
  console.log("Password: password@123");
}

main()
  .catch((e) => {
    console.error("\n========================================");
    console.error("SEED FAILED");
    console.error("========================================");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });