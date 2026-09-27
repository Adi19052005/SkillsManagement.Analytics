import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password@123";

const HR_EMAIL = process.env.HR_EMAIL || "hr@example.com";
const HR_PASSWORD = process.env.HR_PASSWORD || "password@123";

// Use the provided HR JWT for authenticated API testing.
const PROVIDED_HR_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YzZiZmI2Yy1kYjlmLTQyMjQtYTRlZC1mNDJlYWE4OGE4YTQiLCJyb2xlIjoiSFIiLCJpYXQiOjE3OTA0ODk0MjgsImV4cCI6MTc5MDU3NTgyOH0.emJxNFtOEr-zsuDhgW0JbWJDZB0_676A5QaY4kEG60Q";

type TestResult = {
  name: string;
  method: string;
  path: string;
  status?: number;
  expected?: number[];
  passed: boolean;
  error?: string;
};

const results: TestResult[] = [];

let adminToken = "";
let hrToken = PROVIDED_HR_TOKEN;

let departmentId = "";
let employeeId = "";
let managerId = "";
let skillId = "";
let employeeSkillId = "";

let projectId = "";
let deliverableId = "";

let taskId = "";
let taskSkillRequirementId = "";
let dependencyId = "";

let availabilityId = "";
let workloadId = "";

let assessmentId = "";
let developmentPlanId = "";

let allocationRunId = "";
let recommendationId = "";

let assignmentId = "";

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true,
  timeout: 120000,
});

function auth(token: string): AxiosRequestConfig {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function printHeader(title: string) {
  console.log("\n");
  console.log("════════════════════════════════════════════════════════════");
  console.log(`  ${title}`);
  console.log("════════════════════════════════════════════════════════════");
}

function printResult(result: TestResult) {
  const icon = result.passed ? "✓" : "✗";

  console.log(
    `${icon} ${result.method.padEnd(6)} ${result.path} ${
      result.status ? `→ ${result.status}` : ""
    }`
  );

  if (!result.passed && result.error) {
    console.log(`    ERROR: ${result.error}`);
  }
}

async function request(
  name: string,
  method: string,
  path: string,
  config: AxiosRequestConfig = {},
  expected: number[] = [200]
): Promise<AxiosResponse<any>> {
  const response = await client.request({
    method,
    url: path,
    ...config,
  });

  const passed = expected.includes(response.status);

  const result: TestResult = {
    name,
    method,
    path,
    status: response.status,
    expected,
    passed,
  };

  if (!passed) {
    result.error =
      typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data);
  }

  results.push(result);
  printResult(result);

  return response;
}

function getData(response: AxiosResponse<any>): any {
  return response.data?.data ?? response.data;
}

function getId(response: AxiosResponse<any>): string {
  const data = getData(response);

  if (typeof data === "string") {
    return data;
  }

  return data?.id || "";
}

async function login() {
  printHeader("AUTHENTICATION");

  const adminResponse = await request(
    "Admin login",
    "POST",
    "/api/auth/login",
    {
      data: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
    },
    [200, 201]
  );

  const adminData = getData(adminResponse);

  adminToken =
    adminData?.token ||
    adminData?.accessToken ||
    adminResponse.data?.token ||
    adminResponse.data?.accessToken ||
    "";

  if (!adminToken) {
    console.log("    WARNING: Admin token was not found.");
  }

  const hrResponse = await request(
    "HR login",
    "POST",
    "/api/auth/login",
    {
      data: {
        email: HR_EMAIL,
        password: HR_PASSWORD,
      },
    },
    [200, 201]
  );

  const hrData = getData(hrResponse);

  // Keep using the explicitly provided HR JWT for all HR-authenticated tests.
  // The HR login above is still tested, but its returned token is not required.
  if (!hrToken) {
    hrToken =
      hrData?.token ||
      hrData?.accessToken ||
      hrResponse.data?.token ||
      hrResponse.data?.accessToken ||
      "";
  }
}

async function testDepartments() {
  printHeader("DEPARTMENTS");

  const response = await request(
    "Get departments",
    "GET",
    "/api/departments",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  if (Array.isArray(data) && data.length > 0) {
    departmentId = data[0].id;
  } else if (data?.items?.length) {
    departmentId = data.items[0].id;
  }

  if (departmentId) {
    await request(
      "Get department",
      "GET",
      `/api/departments/${departmentId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testEmployees() {
  printHeader("EMPLOYEES");

  const response = await request(
    "Get employees",
    "GET",
    "/api/employees",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let employees: any[] = [];

  if (Array.isArray(data)) {
    employees = data;
  } else if (Array.isArray(data?.items)) {
    employees = data.items;
  }

  if (employees.length > 0) {
    const employee =
      employees.find(
        (e) =>
          e?.user?.role === "EMPLOYEE" ||
          e?.role === "EMPLOYEE"
      ) || employees[0];

    employeeId = employee.id;
  }

  if (employeeId) {
    await request(
      "Get employee",
      "GET",
      `/api/employees/${employeeId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testSkills() {
  printHeader("SKILLS");

  const response = await request(
    "Get skills",
    "GET",
    "/api/skills",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let skills: any[] = [];

  if (Array.isArray(data)) {
    skills = data;
  } else if (Array.isArray(data?.items)) {
    skills = data.items;
  }

  if (skills.length > 0) {
    skillId = skills[0].id;
  }

  if (skillId) {
    await request(
      "Get skill",
      "GET",
      `/api/skills/${skillId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testEmployeeSkills() {
  printHeader("EMPLOYEE SKILLS");

  const response = await request(
    "Get employee skills",
    "GET",
    "/api/employee-skills",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let skills: any[] = [];

  if (Array.isArray(data)) {
    skills = data;
  } else if (Array.isArray(data?.items)) {
    skills = data.items;
  }

  if (skills.length > 0) {
    employeeSkillId = skills[0].id;

    if (!employeeId && skills[0].employeeId) {
      employeeId = skills[0].employeeId;
    }

    if (!skillId && skills[0].skillId) {
      skillId = skills[0].skillId;
    }
  }

  if (employeeSkillId) {
    await request(
      "Get employee skill",
      "GET",
      `/api/employee-skills/${employeeSkillId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testProjects() {
  printHeader("PROJECTS");

  const response = await request(
    "Get projects",
    "GET",
    "/api/projects",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let projects: any[] = [];

  if (Array.isArray(data)) {
    projects = data;
  } else if (Array.isArray(data?.items)) {
    projects = data.items;
  }

  if (projects.length > 0) {
    projectId = projects[0].id;
  }

  if (!projectId) {
    console.log("    WARNING: No project found.");
    return;
  }

  await request(
    "Get project",
    "GET",
    `/api/projects/${projectId}`,
    auth(adminToken),
    [200]
  );
}

async function testDeliverables() {
  printHeader("DELIVERABLES");

  if (!projectId) {
    console.log("    SKIPPED: No project ID.");
    return;
  }

  const response = await request(
    "Get project deliverables",
    "GET",
    `/api/projects/${projectId}/deliverables`,
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let deliverables: any[] = [];

  if (Array.isArray(data)) {
    deliverables = data;
  } else if (Array.isArray(data?.items)) {
    deliverables = data.items;
  }

  if (deliverables.length > 0) {
    deliverableId = deliverables[0].id;
  }
}

async function testTasks() {
  printHeader("TASKS");

  const response = await request(
    "Get tasks",
    "GET",
    "/api/tasks",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let tasks: any[] = [];

  if (Array.isArray(data)) {
    tasks = data;
  } else if (Array.isArray(data?.items)) {
    tasks = data.items;
  }

  if (tasks.length > 0) {
    taskId = tasks[0].id;
  }

  if (taskId) {
    await request(
      "Get task",
      "GET",
      `/api/tasks/${taskId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testTaskSkillRequirements() {
  printHeader("TASK SKILL REQUIREMENTS");

  const response = await request(
    "Get task skill requirements",
    "GET",
    "/api/task-skill-requirements",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let requirements: any[] = [];

  if (Array.isArray(data)) {
    requirements = data;
  } else if (Array.isArray(data?.items)) {
    requirements = data.items;
  }

  if (requirements.length > 0) {
    taskSkillRequirementId = requirements[0].id;
  }

  if (taskSkillRequirementId) {
    await request(
      "Get task skill requirement",
      "GET",
      `/api/task-skill-requirements/${taskSkillRequirementId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testTaskDependencies() {
  printHeader("TASK DEPENDENCIES");

  const response = await request(
    "Get task dependencies",
    "GET",
    "/api/task-dependencies",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let dependencies: any[] = [];

  if (Array.isArray(data)) {
    dependencies = data;
  } else if (Array.isArray(data?.items)) {
    dependencies = data.items;
  }

  if (dependencies.length > 0) {
    dependencyId = dependencies[0].id;
  }

  if (dependencyId) {
    await request(
      "Get task dependency",
      "GET",
      `/api/task-dependencies/${dependencyId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testAvailability() {
  printHeader("EMPLOYEE AVAILABILITY");

  const response = await request(
    "Get employee availability",
    "GET",
    "/api/employee-availability",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let items: any[] = [];

  if (Array.isArray(data)) {
    items = data;
  } else if (Array.isArray(data?.items)) {
    items = data.items;
  }

  if (items.length > 0) {
    availabilityId = items[0].id;
  }

  if (availabilityId) {
    await request(
      "Get availability",
      "GET",
      `/api/employee-availability/${availabilityId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testWorkload() {
  printHeader("EMPLOYEE WORKLOAD");

  const response = await request(
    "Get employee workload",
    "GET",
    "/api/employee-workload",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let items: any[] = [];

  if (Array.isArray(data)) {
    items = data;
  } else if (Array.isArray(data?.items)) {
    items = data.items;
  }

  if (items.length > 0) {
    workloadId = items[0].id;
  }

  if (workloadId) {
    await request(
      "Get workload",
      "GET",
      `/api/employee-workload/${workloadId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testSkillIndex() {
  printHeader("SKILL INDEX");

  await request(
    "Get overall skill index",
    "GET",
    "/api/skill-index",
    auth(adminToken),
    [200]
  );

  if (employeeId) {
    await request(
      "Get employee skill index",
      "GET",
      `/api/skill-index/employee/${employeeId}`,
      auth(adminToken),
      [200]
    );
  }

  if (departmentId) {
    await request(
      "Get department skill index",
      "GET",
      `/api/skill-index/department/${departmentId}`,
      auth(adminToken),
      [200]
    );
  }

  if (skillId) {
    await request(
      "Get skill index by skill",
      "GET",
      `/api/skill-index/skill/${skillId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testSkillAssessment() {
  printHeader("SKILL ASSESSMENT");

  const response = await request(
    "Get pending assessments",
    "GET",
    "/api/skill-assessment/pending",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let items: any[] = [];

  if (Array.isArray(data)) {
    items = data;
  } else if (Array.isArray(data?.items)) {
    items = data.items;
  }

  if (items.length > 0) {
    assessmentId = items[0].id;
  }

  if (assessmentId) {
    await request(
      "Get assessment",
      "GET",
      `/api/skill-assessment/${assessmentId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testSkillDevelopment() {
  printHeader("SKILL DEVELOPMENT");

  if (!employeeId) {
    console.log("    SKIPPED: No employee ID.");
    return;
  }

  await request(
    "Get employee development plans",
    "GET",
    `/api/skill-development/employee/${employeeId}`,
    auth(adminToken),
    [200]
  );
}

async function testDashboard() {
  printHeader("DASHBOARD");

  await request(
    "Get dashboard",
    "GET",
    "/api/dashboard",
    auth(adminToken),
    [200]
  );
}

async function testAnalytics() {
  printHeader("ANALYTICS");

  const endpoints = [
    "/api/analytics/dashboard-stats",
    "/api/analytics/skill-gaps",
    "/api/analytics/training-needs",
    "/api/analytics/skill-spectrum",
    "/api/analytics/skill-progress",
  ];

  for (const endpoint of endpoints) {
    await request(
      `GET ${endpoint}`,
      "GET",
      endpoint,
      auth(adminToken),
      [200]
    );
  }
}

async function testLLMExtraction() {
  printHeader("LLM TASK EXTRACTION");

  if (!projectId) {
    console.log("    SKIPPED: No project ID.");
    return;
  }

  await request(
    "Extract project tasks using LLM",
    "POST",
    `/api/llm-task-extraction/project/${projectId}`,
    {
      ...auth(hrToken || adminToken),
      data: {
        projectId,
      },
    },
    [200, 201]
  );
}

async function testTaskPlanApproval() {
  printHeader("TASK PLAN APPROVAL");

  if (!projectId) {
    console.log("    SKIPPED: No project ID.");
    return;
  }

  /*
   * IMPORTANT:
   * This endpoint creates real tasks.
   *
   * We therefore do NOT blindly call it again on an existing project.
   *
   * It is tested only when:
   * - TEST_CREATE_TASK_PLAN=true
   *
   * Example:
   * TEST_CREATE_TASK_PLAN=true npx tsx scripts/test-all-endpoints.ts
   */

  if (process.env.TEST_CREATE_TASK_PLAN !== "true") {
    console.log(
      "    SKIPPED: Set TEST_CREATE_TASK_PLAN=true to execute task-plan approval."
    );
    return;
  }

  if (!skillId) {
    console.log("    SKIPPED: No skill ID.");
    return;
  }

  const response = await request(
    "Approve task plan",
    "POST",
    `/api/task-plan-approval/${projectId}`,
    {
      ...auth(hrToken || adminToken),
      data: {
        tasks: [
          {
            title: "API Integration Test Task",
            description: "Task created by automated integration test.",
            estimatedHours: 2,
            priority: 1,
            skills: [
              {
                skillId,
                requiredRating: 1,
                weight: 1,
                mandatory: true,
              },
            ],
            dependencies: [],
          },
        ],
      },
    },
    [201]
  );

  const data = getData(response);

  if (Array.isArray(data) && data.length > 0) {
    taskId = data[0].id;
  } else if (data?.tasks?.length > 0) {
    taskId = data.tasks[0].id;
  }
}

async function testAllocationRuns() {
  printHeader("ALLOCATION RUNS");

  const response = await request(
    "Get allocation runs",
    "GET",
    "/api/allocation-runs",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let runs: any[] = [];

  if (Array.isArray(data)) {
    runs = data;
  } else if (Array.isArray(data?.items)) {
    runs = data.items;
  }

  if (runs.length > 0) {
    allocationRunId = runs[0].id;
  }

  if (allocationRunId) {
    await request(
      "Get allocation run",
      "GET",
      `/api/allocation-runs/${allocationRunId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testAllocationEngine() {
  printHeader("ALLOCATION ENGINE");

  if (!projectId) {
    console.log("    SKIPPED: No project ID.");
    return;
  }

  /*
   * Allocation creates recommendations.
   *
   * Enable explicitly:
   *
   * TEST_ALLOCATION=true
   */

  if (process.env.TEST_ALLOCATION !== "true") {
    console.log(
      "    SKIPPED: Set TEST_ALLOCATION=true to execute allocation."
    );
    return;
  }

  const response = await request(
    "Run allocation engine",
    "POST",
    `/api/allocation-engine/${projectId}`,
    auth(hrToken || adminToken),
    [200, 201]
  );

  const data = getData(response);

  allocationRunId =
    data?.allocationRunId ||
    data?.runId ||
    data?.allocationRun?.id ||
    allocationRunId;
}

async function testRecommendations() {
  printHeader("ALLOCATION RECOMMENDATIONS");

  if (!allocationRunId) {
    console.log("    SKIPPED: No allocation run ID.");
    return;
  }

  const response = await request(
    "Get allocation recommendations",
    "GET",
    `/api/allocation-recommendations/run/${allocationRunId}`,
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let recommendations: any[] = [];

  if (Array.isArray(data)) {
    recommendations = data;
  } else if (Array.isArray(data?.items)) {
    recommendations = data.items;
  }

  if (recommendations.length > 0) {
    recommendationId = recommendations[0].id;
  }
}

async function testAssignmentApproval() {
  printHeader("ASSIGNMENT APPROVAL");

  if (!allocationRunId) {
    console.log("    SKIPPED: No allocation run ID.");
    return;
  }

  await request(
    "Get recommendations for approval",
    "GET",
    `/api/assignment-approval/run/${allocationRunId}`,
    auth(hrToken || adminToken),
    [200]
  );

  /*
   * Approving an assignment changes database state.
   *
   * Enable explicitly:
   *
   * TEST_APPROVE_ASSIGNMENT=true
   */

  if (process.env.TEST_APPROVE_ASSIGNMENT !== "true") {
    console.log(
      "    SKIPPED: Set TEST_APPROVE_ASSIGNMENT=true to approve an assignment."
    );
    return;
  }

  if (!recommendationId) {
    console.log("    SKIPPED: No recommendation ID.");
    return;
  }

  await request(
    "Approve assignment",
    "POST",
    `/api/assignment-approval/${recommendationId}/approve`,
    {
      ...auth(hrToken || adminToken),
    },
    [200]
  );
}

async function testEmployeeProjectAssignments() {
  printHeader("EMPLOYEE PROJECT ASSIGNMENTS");

  const response = await request(
    "Get employee project assignments",
    "GET",
    "/api/employee-project-assignments",
    auth(adminToken),
    [200]
  );

  const data = getData(response);

  let assignments: any[] = [];

  if (Array.isArray(data)) {
    assignments = data;
  } else if (Array.isArray(data?.items)) {
    assignments = data.items;
  }

  if (assignments.length > 0) {
    assignmentId = assignments[0].id;
  }

  if (assignmentId) {
    await request(
      "Get project assignment",
      "GET",
      `/api/employee-project-assignments/${assignmentId}`,
      auth(adminToken),
      [200]
    );
  }

  if (employeeId) {
    await request(
      "Get employee assignments",
      "GET",
      `/api/employee-project-assignments/employee/${employeeId}`,
      auth(adminToken),
      [200]
    );
  }

  if (projectId) {
    await request(
      "Get project assignments",
      "GET",
      `/api/employee-project-assignments/project/${projectId}`,
      auth(adminToken),
      [200]
    );
  }
}

async function testAuthProtection() {
  printHeader("AUTH / RBAC NEGATIVE TESTS");

  const response = await request(
    "Unauthorized request",
    "GET",
    "/api/projects",
    {},
    [401]
  );

  if (response.status !== 401) {
    console.log("    WARNING: Protected endpoint did not reject unauthenticated request.");
  }
}

function printSummary() {
  printHeader("FINAL RESULT");

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`Total tests : ${results.length}`);
  console.log(`Passed      : ${passed}`);
  console.log(`Failed      : ${failed}`);

  console.log("\n");

  if (failed > 0) {
    console.log("FAILED TESTS");
    console.log("────────────────────────────────────────────────────────────");

    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(
          `✗ ${r.method} ${r.path} → ${r.status} (expected ${r.expected?.join(
            " / "
          )})`
        );

        if (r.error) {
          console.log(`  ${r.error}`);
        }
      });
  }

  console.log("\n════════════════════════════════════════════════════════════");

  if (failed === 0) {
    console.log("ALL TESTS PASSED");
  } else {
    console.log(`${failed} TEST(S) FAILED`);
  }

  console.log("════════════════════════════════════════════════════════════");
}

async function main() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║              4P MYSKILLS API TEST SUITE                  ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log(`\nBase URL: ${BASE_URL}`);

  try {
    await login();

    if (!adminToken && !hrToken) {
      console.log("\nNo authentication token received.");
      console.log("Make sure the backend is running and credentials are correct.");
      process.exitCode = 1;
      return;
    }

    await testAuthProtection();

    await testDepartments();
    await testEmployees();
    await testSkills();
    await testEmployeeSkills();

    await testProjects();
    await testDeliverables();

    await testTasks();
    await testTaskSkillRequirements();
    await testTaskDependencies();

    await testAvailability();
    await testWorkload();

    await testSkillIndex();
    await testSkillAssessment();
    await testSkillDevelopment();

    await testDashboard();
    await testAnalytics();

    await testLLMExtraction();
    await testTaskPlanApproval();

    await testAllocationRuns();
    await testAllocationEngine();
    await testRecommendations();

    await testAssignmentApproval();
    await testEmployeeProjectAssignments();
  } catch (error: any) {
    console.error("\nTEST RUNNER ERROR");
    console.error(error?.message || error);
  }

  printSummary();

  const failed = results.filter((r) => !r.passed).length;

  process.exitCode = failed > 0 ? 1 : 0;
}

main();