import "dotenv/config";
import { Role } from "@prisma/client";
import { prisma } from "../utils/db";

const DEPARTMENTS = [
  ["Engineering", "Software engineering and backend development"],
  ["Cloud & Infrastructure", "Cloud and infrastructure engineering"],
  ["Data & Analytics", "Data engineering and analytics"],
  ["Cybersecurity", "Cybersecurity and security operations"],
  ["Product Engineering", "Product and platform engineering"],
  ["Operations", "Business and technical operations"],
  ["Quality & Process", "Quality assurance and process improvement"],
  ["Digital Transformation", "Digital transformation and automation"],
];

const SKILLS = [
  "Node.js",
  "React",
  "TypeScript",
  "Python",
  "Java",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Terraform",
  "Git",
  "Linux",
  "Kafka",
  "Machine Learning",
  "Data Analytics",
];

const FIRST_NAMES = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Arjun",
  "Rohan",
  "Rahul",
  "Karan",
  "Akshay",
  "Nikhil",
  "Siddharth",
  "Ananya",
  "Aditi",
  "Sneha",
  "Priya",
  "Kavya",
  "Isha",
  "Neha",
  "Meera",
  "Riya",
  "Tanvi",
  "Pooja",
  "Shreya",
  "Simran",
  "Nandini",
  "Varun",
  "Yash",
  "Harsh",
  "Manish",
  "Saurabh",
  "Vikas",
  "Abhishek",
  "Ritesh",
  "Mohit",
  "Dev",
  "Pranav",
  "Ayush",
  "Dhruv",
  "Kabir",
  "Ishaan",
  "Raj",
];

const LAST_NAMES = [
  "Sharma",
  "Patil",
  "Kulkarni",
  "Deshmukh",
  "Joshi",
  "Mehta",
  "Shah",
  "Verma",
  "Gupta",
  "Jain",
  "Singh",
  "Pawar",
  "More",
  "Kale",
  "Bhosale",
];

const PROJECTS = [
  "Cloud Infrastructure Modernization",
  "Enterprise Skill Intelligence Platform",
  "Customer Analytics Platform",
  "Digital Operations Transformation",
  "Cybersecurity Monitoring System",
  "AI Workforce Optimization",
  "Cloud Migration Program",
  "Predictive Maintenance Platform",
  "Enterprise Data Lake",
  "Developer Productivity Platform",
  "Zero Trust Security Initiative",
  "Smart Operations Dashboard",
  "Supply Chain Analytics",
  "Automated Quality Management",
  "Digital Engineering Platform",
  "Observability Platform",
  "AI Document Processing",
  "Enterprise API Platform",
  "Business Intelligence Modernization",
  "Workforce Capability Transformation",
];

const DELIVERABLES = [
  "Architecture",
  "Backend Platform",
  "Frontend Application",
  "Cloud Infrastructure",
  "Data Pipeline",
  "Analytics Dashboard",
  "Security Layer",
  "Monitoring",
  "Testing",
  "Deployment",
  "Documentation",
  "Production Rollout",
];

const TASKS = [
  "Design system architecture",
  "Develop backend APIs",
  "Develop frontend module",
  "Design database schema",
  "Implement authentication",
  "Configure Docker containers",
  "Deploy Kubernetes workloads",
  "Configure AWS infrastructure",
  "Build CI/CD pipeline",
  "Implement monitoring",
  "Build analytics pipeline",
  "Create data processing jobs",
  "Implement Redis caching",
  "Implement Kafka event processing",
  "Configure Terraform infrastructure",
  "Perform security assessment",
  "Create automated test suite",
  "Optimize database queries",
  "Build reporting dashboard",
  "Perform production deployment",
];

const TASK_SKILLS: Record<string, string[]> = {
  "Design system architecture": [
    "TypeScript",
    "Node.js",
    "AWS",
    "Docker",
  ],

  "Develop backend APIs": [
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "Redis",
  ],

  "Develop frontend module": [
    "React",
    "TypeScript",
    "Git",
  ],

  "Design database schema": [
    "PostgreSQL",
    "MongoDB",
    "TypeScript",
  ],

  "Implement authentication": [
    "Node.js",
    "TypeScript",
    "PostgreSQL",
  ],

  "Configure Docker containers": [
    "Docker",
    "Linux",
    "Git",
  ],

  "Deploy Kubernetes workloads": [
    "Kubernetes",
    "Docker",
    "Linux",
    "AWS",
  ],

  "Configure AWS infrastructure": [
    "AWS",
    "Terraform",
    "Linux",
  ],

  "Build CI/CD pipeline": [
    "Docker",
    "Git",
    "Linux",
    "Kubernetes",
  ],

  "Implement monitoring": [
    "AWS",
    "Linux",
    "Docker",
    "Kubernetes",
  ],

  "Build analytics pipeline": [
    "Python",
    "Data Analytics",
    "PostgreSQL",
    "Kafka",
  ],

  "Create data processing jobs": [
    "Python",
    "Kafka",
    "PostgreSQL",
    "Data Analytics",
  ],

  "Implement Redis caching": [
    "Redis",
    "Node.js",
    "Docker",
  ],

  "Implement Kafka event processing": [
    "Kafka",
    "Node.js",
    "Docker",
  ],

  "Configure Terraform infrastructure": [
    "Terraform",
    "AWS",
    "Linux",
  ],

  "Perform security assessment": [
    "Linux",
    "Python",
    "AWS",
  ],

  "Create automated test suite": [
    "TypeScript",
    "Python",
    "Git",
  ],

  "Optimize database queries": [
    "PostgreSQL",
    "MongoDB",
    "Redis",
  ],

  "Build reporting dashboard": [
    "React",
    "TypeScript",
    "Data Analytics",
  ],

  "Perform production deployment": [
    "Docker",
    "Kubernetes",
    "AWS",
    "Linux",
  ],
};

const DEPARTMENT_STRENGTH: Record<
  string,
  Record<string, number>
> = {
  Engineering: {
    "Node.js": 5,
    React: 5,
    TypeScript: 5,
    PostgreSQL: 4,
    MongoDB: 4,
    Redis: 4,
    Docker: 4,
    Git: 5,
  },

  "Cloud & Infrastructure": {
    Docker: 5,
    Kubernetes: 5,
    AWS: 5,
    Terraform: 5,
    Linux: 5,
    Git: 4,
    Azure: 4,
  },

  "Data & Analytics": {
    Python: 5,
    "Machine Learning": 5,
    "Data Analytics": 5,
    PostgreSQL: 4,
    Kafka: 4,
    MongoDB: 3,
  },

  Cybersecurity: {
    Linux: 5,
    Python: 4,
    AWS: 4,
    Docker: 3,
    Kubernetes: 3,
    PostgreSQL: 3,
  },

  "Product Engineering": {
    React: 5,
    TypeScript: 5,
    "Node.js": 4,
    PostgreSQL: 4,
    Docker: 4,
    Git: 5,
  },

  Operations: {
    AWS: 3,
    Linux: 3,
    PostgreSQL: 3,
    "Data Analytics": 4,
    Python: 3,
    Git: 3,
  },

  "Quality & Process": {
    Python: 4,
    "Data Analytics": 5,
    PostgreSQL: 4,
    Git: 4,
    TypeScript: 3,
  },

  "Digital Transformation": {
    Python: 4,
    "Machine Learning": 4,
    React: 4,
    TypeScript: 4,
    AWS: 4,
    "Data Analytics": 5,
  },
};

const random = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const clamp = (
  value: number,
  min: number,
  max: number
): number => {
  return Math.max(min, Math.min(max, value));
};

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
};

async function createDepartments() {
  console.log("Creating departments...");

  const departments = [];

  for (const [name] of DEPARTMENTS) {
    const department = await prisma.department.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });

    departments.push(department);
  }

  return departments;
}

async function createSkills() {
  console.log("Creating skills...");

  const skills = [];

  for (const name of SKILLS) {
    const skill = await prisma.skill.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
        description: `${name} professional capability`,
      },
    });

    skills.push(skill);
  }

  return skills;
}

async function createUsersAndEmployees(
  departments: any[],
  passwordHash: string
) {
  console.log("Creating managers and employees...");

  const managers: any[] = [];
  const employees: any[] = [];

  let employeeCounter = 1;

  for (
    let departmentIndex = 0;
    departmentIndex < departments.length;
    departmentIndex++
  ) {
    const department = departments[departmentIndex];

    for (let managerIndex = 0; managerIndex < 2; managerIndex++) {
      const firstName =
        FIRST_NAMES[
          (departmentIndex * 2 + managerIndex) %
            FIRST_NAMES.length
        ];

      const lastName =
        LAST_NAMES[
          (departmentIndex + managerIndex) %
            LAST_NAMES.length
        ];

      const email =
        `manager.${slugify(department.name)}.${managerIndex + 1}@4pmyskills.com`;

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

      const manager =
        await prisma.employeeProfile.upsert({
          where: {
            userId: user.id,
          },
          update: {
            fullname: `${firstName} ${lastName}`,
            departmentId: department.id,
          },
          create: {
            userId: user.id,
            fullname: `${firstName} ${lastName}`,
            departmentId: department.id,
          },
        });

      managers.push(manager);
    }

    for (let employeeIndex = 0; employeeIndex < 10; employeeIndex++) {
      const firstName =
        FIRST_NAMES[
          (departmentIndex * 10 +
            employeeIndex +
            10) %
            FIRST_NAMES.length
        ];

      const lastName =
        LAST_NAMES[
          (departmentIndex +
            employeeIndex +
            3) %
            LAST_NAMES.length
        ];

      const email =
        `${slugify(firstName)}.${slugify(lastName)}.${departmentIndex + 1}.${employeeIndex + 1}@4pmyskills.com`;

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

      const manager =
        managers[departmentIndex * 2];

      const employee =
        await prisma.employeeProfile.upsert({
          where: {
            userId: user.id,
          },
          update: {
            fullname: `${firstName} ${lastName}`,
            departmentId: department.id,
            managerId: manager.id,
          },
          create: {
            userId: user.id,
            fullname: `${firstName} ${lastName}`,
            departmentId: department.id,
            managerId: manager.id,
          },
        });

      employees.push({
        ...employee,
        departmentName: department.name,
        employeeNumber: employeeCounter++,
      });
    }
  }

  return {
    managers,
    employees,
  };
}

async function createEmployeeSkills(
  employees: any[],
  skills: any[]
) {
  console.log("Creating employee skills...");

  let count = 0;

  for (const employee of employees) {
    const strengths =
      DEPARTMENT_STRENGTH[
        employee.departmentName
      ] || {};

    for (const skill of skills) {
      const base =
        strengths[skill.name] ?? 1;

      let approvedRating = base;

      approvedRating +=
        ((employee.employeeNumber +
          skill.name.length) %
          3) -
        1;

      if (employee.employeeNumber % 7 === 0) {
        approvedRating += 1;
      }

      if (employee.employeeNumber % 11 === 0) {
        approvedRating -= 1;
      }

      approvedRating = clamp(
        approvedRating,
        0,
        5
      );

      let selfRating = approvedRating;

      if (employee.employeeNumber % 4 === 0) {
        selfRating = clamp(
          approvedRating + 1,
          0,
          5
        );
      }

      if (employee.employeeNumber % 9 === 0) {
        selfRating = clamp(
          approvedRating - 1,
          0,
          5
        );
      }

      await prisma.employeeSkill.upsert({
        where: {
          employeeId_skillId: {
            employeeId: employee.id,
            skillId: skill.id,
          },
        },
        update: {
          selfRating,
          approvedRating,
          status: "APPROVED",
          reviewComment:
            approvedRating >= 4
              ? "Strong demonstrated capability"
              : approvedRating <= 1
              ? "Training recommended"
              : "Capability meets current planning level",
          reviewedAt: new Date(),
        },
        create: {
          employeeId: employee.id,
          skillId: skill.id,
          selfRating,
          approvedRating,
          status: "APPROVED",
          reviewComment:
            approvedRating >= 4
              ? "Strong demonstrated capability"
              : approvedRating <= 1
              ? "Training recommended"
              : "Capability meets current planning level",
          reviewedAt: new Date(),
        },
      });

      count++;
    }
  }

  console.log(`Employee skills: ${count}`);
}

async function createProjects(
  departments: any[],
  skills: any[]
) {
  console.log(
    "Creating projects, deliverables and tasks..."
  );

  const projects: any[] = [];
  const tasks: any[] = [];

  const skillMap = new Map(
    skills.map((skill) => [
      skill.name,
      skill,
    ])
  );

  for (
    let projectIndex = 0;
    projectIndex < PROJECTS.length;
    projectIndex++
  ) {
    const department =
      departments[
        projectIndex % departments.length
      ];

    const project =
      await prisma.project.create({
        data: {
          name: PROJECTS[projectIndex],
          description:
            `Synthetic enterprise project owned by ${department.name}.`,
        },
      });

    projects.push(project);

    for (
      let deliverableIndex = 0;
      deliverableIndex < 3;
      deliverableIndex++
    ) {
      const deliverableName =
        `${DELIVERABLES[
          (projectIndex +
            deliverableIndex) %
            DELIVERABLES.length
        ]} - ${project.name}`;

      const deliverable =
        await prisma.deliverable.create({
          data: {
            projectId: project.id,
            name: deliverableName,
            description:
              `Major deliverable for ${project.name}.`,
          },
        });

      for (
        let taskIndex = 0;
        taskIndex < 5;
        taskIndex++
      ) {
        const taskName =
          TASKS[
            (projectIndex * 3 +
              deliverableIndex * 5 +
              taskIndex) %
              TASKS.length
          ];

        const task =
          await prisma.task.create({
            data: {
              title:
                `${taskName} - ${projectIndex + 1}.${deliverableIndex + 1}.${taskIndex + 1}`,
              description:
                `Synthetic task for ${project.name}.`,
              projectId: project.id,
              deliverableId:
                deliverable.id,
              estimatedHours:
                randomInt(8, 40),
              priority:
                randomInt(1, 5),
            },
          });

        tasks.push(task);

        const requiredSkills =
          TASK_SKILLS[taskName] || [
            random(SKILLS),
            random(SKILLS),
          ];

        const uniqueSkills = [
          ...new Set(requiredSkills),
        ];

        for (const skillName of uniqueSkills) {
          const skill =
            skillMap.get(skillName);

          if (!skill) {
            continue;
          }

          await prisma.taskSkillRequirement.create({
            data: {
              taskId: task.id,
              skillId: skill.id,
              requiredRating:
                randomInt(2, 4),
              weight:
                randomInt(1, 5),
              mandatory:
                randomInt(0, 10) >= 3,
            },
          });
        }
      }
    }
  }

  for (let i = 1; i < tasks.length; i++) {
    if (i % 3 !== 0) {
      continue;
    }

    try {
      await prisma.taskDependency.create({
        data: {
          taskId: tasks[i].id,
          dependsOnTaskId:
            tasks[i - 1].id,
        },
      });
    } catch {
      // Ignore duplicate dependencies.
    }
  }

  console.log(`Projects: ${projects.length}`);
  console.log(`Tasks: ${tasks.length}`);

  return {
    projects,
    tasks,
  };
}

async function createAvailabilityAndWorkload(
  employees: any[]
) {
  console.log(
    "Creating availability and workload..."
  );

  const today = new Date();

  for (let day = 0; day < 60; day++) {
    const date = new Date(today);

    date.setDate(
      today.getDate() + day
    );

    date.setHours(0, 0, 0, 0);

    for (const employee of employees) {
      const weekend =
        date.getDay() === 0 ||
        date.getDay() === 6;

      const availableHours =
        weekend
          ? 0
          : randomInt(6, 8);

      const allocatedHours =
        weekend
          ? 0
          : randomInt(
              0,
              availableHours
            );

      await prisma.employeeAvailability.upsert({
        where: {
          employeeId_date: {
            employeeId: employee.id,
            date,
          },
        },
        update: {
          availableHours,
        },
        create: {
          employeeId: employee.id,
          date,
          availableHours,
        },
      });

      await prisma.employeeWorkload.upsert({
        where: {
          employeeId_date: {
            employeeId: employee.id,
            date,
          },
        },
        update: {
          allocatedHours,
          availableHours,
        },
        create: {
          employeeId: employee.id,
          date,
          allocatedHours,
          availableHours,
        },
      });
    }
  }

  console.log(
    "60 days of availability/workload generated."
  );
}

async function createProjectAssignments(
  employees: any[],
  projects: any[]
) {
  console.log(
    "Creating project assignments..."
  );

  let count = 0;

  for (let i = 0; i < projects.length; i++) {
    const project =
      projects[i];

    const deliverables =
      await prisma.deliverable.findMany({
        where: {
          projectId: project.id,
        },
      });

    const numberOfEmployees =
      randomInt(5, 8);

    for (
      let j = 0;
      j < numberOfEmployees;
      j++
    ) {
      const employee =
        employees[
          (i * 7 + j) %
            employees.length
        ];

      const deliverable =
        deliverables[
          j % deliverables.length
        ];

      const existing =
        await prisma.employeeProjectAssignment.findFirst(
          {
            where: {
              employeeId:
                employee.id,
              projectId:
                project.id,
              deliverableId:
                deliverable.id,
              releasedAt: null,
            },
          }
        );

      if (existing) {
        continue;
      }

      await prisma.employeeProjectAssignment.create({
        data: {
          employeeId:
            employee.id,
          projectId:
            project.id,
          deliverableId:
            deliverable.id,
        },
      });

      count++;
    }
  }

  console.log(
    `Project assignments: ${count}`
  );
}

async function printStatistics() {
  console.log("\n");
  console.log(
    "══════════════════════════════════════════════"
  );
  console.log(
    "          DATASET STATISTICS"
  );
  console.log(
    "══════════════════════════════════════════════"
  );

  const [
    users,
    departments,
    employees,
    skills,
    employeeSkills,
    projects,
    deliverables,
    tasks,
    requirements,
    dependencies,
    availability,
    workload,
    assignments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.department.count(),
    prisma.employeeProfile.count(),
    prisma.skill.count(),
    prisma.employeeSkill.count(),
    prisma.project.count(),
    prisma.deliverable.count(),
    prisma.task.count(),
    prisma.taskSkillRequirement.count(),
    prisma.taskDependency.count(),
    prisma.employeeAvailability.count(),
    prisma.employeeWorkload.count(),
    prisma.employeeProjectAssignment.count(),
  ]);

  console.log(
    `Users                   : ${users}`
  );

  console.log(
    `Departments             : ${departments}`
  );

  console.log(
    `Employees               : ${employees}`
  );

  console.log(
    `Skills                  : ${skills}`
  );

  console.log(
    `Employee Skills         : ${employeeSkills}`
  );

  console.log(
    `Projects                : ${projects}`
  );

  console.log(
    `Deliverables            : ${deliverables}`
  );

  console.log(
    `Tasks                   : ${tasks}`
  );

  console.log(
    `Task Skill Requirements : ${requirements}`
  );

  console.log(
    `Task Dependencies       : ${dependencies}`
  );

  console.log(
    `Availability            : ${availability}`
  );

  console.log(
    `Workload                : ${workload}`
  );

  console.log(
    `Project Assignments     : ${assignments}`
  );

  console.log(
    "══════════════════════════════════════════════"
  );
}

async function main() {
  console.log("\n");
  console.log(
    "╔══════════════════════════════════════════════╗"
  );
  console.log(
    "║       4P MYSKILLS ANALYTICS DATASET         ║"
  );
  console.log(
    "╚══════════════════════════════════════════════╝"
  );

  const admin =
    await prisma.user.findUnique({
      where: {
        email: "admin@example.com",
      },
    });

  if (!admin) {
    throw new Error(
      "admin@example.com not found. Run your normal seed first."
    );
  }

  console.log(
    "\nUsing existing database password hash..."
  );

  const departments =
    await createDepartments();

  const skills =
    await createSkills();

  const {
    managers,
    employees,
  } =
    await createUsersAndEmployees(
      departments,
      admin.passwordHash
    );

  console.log(
    `Managers: ${managers.length}`
  );

  console.log(
    `Employees: ${employees.length}`
  );

  await createEmployeeSkills(
    employees,
    skills
  );

  const {
    projects,
    tasks,
  } =
    await createProjects(
      departments,
      skills
    );

  await createAvailabilityAndWorkload(
    employees
  );

  await createProjectAssignments(
    employees,
    projects
  );

  console.log(
    "\nSkipping direct task assignment."
  );

  console.log(
    "Use the Allocation Engine for task allocation."
  );

  console.log(
    `Generated task pool: ${tasks.length}`
  );

  await printStatistics();

  console.log(
    "\nDATA GENERATION COMPLETE\n"
  );
}

main()
  .catch((error) => {
    console.error(
      "\nDATA GENERATION FAILED\n"
    );
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });