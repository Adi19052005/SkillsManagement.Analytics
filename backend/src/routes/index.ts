import { Express } from "express";

import authRoutes from "../modules/auth/auth.routes";
import departmentRoutes from "../modules/departments/department.routes";
import employeeRoutes from "../modules/employees/employee.routes";
import projectRoutes from "../modules/projects/project.routes";
import assignmentRoutes from "../modules/assignments/assignment.routes";
import skillRoutes from "../modules/skills/skill.routes";
import employeeSkillRoutes from "../modules/employee-skills/employee-skill.routes";
import deliverableRoutes from "../modules/deliverables/deliverable.routes";
import deliverableSkillRoutes from "../modules/deliverable-skills/deliverable-skill.routes";
import recommendationRoutes from "../modules/recommendations/recommendation.routes";
import analyticsRoutes from "../modules/analytics/analytics.routes";
import assessmentCampaignRoutes from "../modules/assessment-campaigns/assessment-campaign.routes";
import skillsIngestRoutes from "../modules/skills-ingest/skills-ingest.routes";
import managerIngestRoutes from "../modules/manager-ingest/manager-ingest.routes";
import employeeIngestRoutes from "../modules/employee-ingest/employee-ingest.routes";
import taskRoutes from "../modules/tasks/tasks.routes";
import taskSkillRequirementRoutes from "../modules/task-skill-requirements/routes";
import employeeAvailabilityRoutes from "../modules/employee-availability/routes";
import employeeWorkloadRoutes from "../modules/employee-workload/routes";
import taskDependencyRoutes from "../modules/task-dependencies/routes";
import allocationRunRoutes from "../modules/allocation-runs/routes";
import allocationRecommendationRoutes from "../modules/allocation-recommendations/routes";
import allocationEngineRoutes from "../modules/allocation-engine/routes";
import skillIndexRoutes from "../modules/skill-index/routes";
import skillDevelopmentRoutes from "../modules/skill-development/skill-development.routes";
import skillAssessmentRoutes from "../modules/skill-assessment/skill-assessment.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import llmTaskExtractionRoutes from "../modules/llm-task-extraction/llm-task-extraction.routes";
import taskPlanApprovalRoutes from "../modules/task-plan-approval/task-plan-approval.routes";
import assignmentApprovalRoutes from "../modules/assignment-approval/assignment-approval.routes";
import employeeProjectAssignmentRoutes from "../modules/employee-project-assignment/employee-project-assignment.routes";

export const registerRoutes = (app: Express) => {
  app.use("/api/auth", authRoutes);

  app.use("/api/departments", departmentRoutes);

  app.use("/api/employees", employeeRoutes);

  app.use("/api/projects", projectRoutes);

  app.use("/api/skills", skillRoutes);

  app.use("/api/employee-skills", employeeSkillRoutes);

  app.use("/api/skills/ingest", skillsIngestRoutes);

  app.use("/api/managers/ingest", managerIngestRoutes);

  app.use("/api/employees/ingest", employeeIngestRoutes);

  app.use("/api/tasks", taskRoutes);

  app.use("/api/task-skill-requirements", taskSkillRequirementRoutes);

  app.use("/api", deliverableRoutes);

  app.use("/api", deliverableSkillRoutes);

  app.use("/api", recommendationRoutes);

  app.use("/api", assignmentRoutes);

  app.use("/api/analytics", analyticsRoutes);

  app.use("/api/assessment-campaigns", assessmentCampaignRoutes);

  app.use("/api/employee-availability", employeeAvailabilityRoutes);

  app.use("/api/employee-workload", employeeWorkloadRoutes);

  app.use("/api/task-dependencies", taskDependencyRoutes);

  app.use("/api/allocation-runs", allocationRunRoutes);

  app.use(
  "/api/allocation-recommendations",
  allocationRecommendationRoutes
);

app.use(
  "/api/allocation-engine",
  allocationEngineRoutes
);

app.use("/api/skill-index", skillIndexRoutes);

app.use("/api/skill-development", skillDevelopmentRoutes);

app.use("/api/skill-assessment", skillAssessmentRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use(
  "/api/llm-task-extraction",
  llmTaskExtractionRoutes
);

app.use("/api/task-plan-approval", taskPlanApprovalRoutes);

app.use(
  "/api/assignment-approval",
  assignmentApprovalRoutes
);

app.use(
  "/api/employee-project-assignments",
  employeeProjectAssignmentRoutes
);

  app.get("/health", (_, res) => { 
    res.json({ status: "ok" });
  });
};