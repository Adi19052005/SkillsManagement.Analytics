-- CreateEnum
CREATE TYPE "AllocationStatus" AS ENUM ('GENERATED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SkillDevelopmentStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SkillDevelopmentPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "description" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "estimatedHours" DOUBLE PRECISION,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "SkillDevelopmentPlan" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "currentRating" INTEGER NOT NULL,
    "targetRating" INTEGER NOT NULL,
    "gap" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "priority" "SkillDevelopmentPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "SkillDevelopmentStatus" NOT NULL DEFAULT 'PLANNED',
    "targetDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillDevelopmentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskSkillRequirement" (
    "id" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "requiredRating" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "mandatory" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskSkillRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeAvailability" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "availableHours" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeWorkload" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "allocatedHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "availableHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeWorkload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskDependency" (
    "id" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "dependsOnTaskId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllocationRun" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "triggeredBy" UUID NOT NULL,
    "status" "AllocationStatus" NOT NULL DEFAULT 'GENERATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllocationRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllocationRecommendation" (
    "id" UUID NOT NULL,
    "allocationRunId" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "eligible" BOOLEAN NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllocationRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SkillDevelopmentPlan_employeeId_idx" ON "SkillDevelopmentPlan"("employeeId");

-- CreateIndex
CREATE INDEX "SkillDevelopmentPlan_skillId_idx" ON "SkillDevelopmentPlan"("skillId");

-- CreateIndex
CREATE INDEX "SkillDevelopmentPlan_status_idx" ON "SkillDevelopmentPlan"("status");

-- CreateIndex
CREATE INDEX "SkillDevelopmentPlan_priority_idx" ON "SkillDevelopmentPlan"("priority");

-- CreateIndex
CREATE INDEX "SkillDevelopmentPlan_targetDate_idx" ON "SkillDevelopmentPlan"("targetDate");

-- CreateIndex
CREATE INDEX "TaskSkillRequirement_taskId_idx" ON "TaskSkillRequirement"("taskId");

-- CreateIndex
CREATE INDEX "TaskSkillRequirement_skillId_idx" ON "TaskSkillRequirement"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskSkillRequirement_taskId_skillId_key" ON "TaskSkillRequirement"("taskId", "skillId");

-- CreateIndex
CREATE INDEX "EmployeeAvailability_employeeId_idx" ON "EmployeeAvailability"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeAvailability_date_idx" ON "EmployeeAvailability"("date");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeAvailability_employeeId_date_key" ON "EmployeeAvailability"("employeeId", "date");

-- CreateIndex
CREATE INDEX "EmployeeWorkload_employeeId_idx" ON "EmployeeWorkload"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeWorkload_date_idx" ON "EmployeeWorkload"("date");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeWorkload_employeeId_date_key" ON "EmployeeWorkload"("employeeId", "date");

-- CreateIndex
CREATE INDEX "TaskDependency_taskId_idx" ON "TaskDependency"("taskId");

-- CreateIndex
CREATE INDEX "TaskDependency_dependsOnTaskId_idx" ON "TaskDependency"("dependsOnTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskDependency_taskId_dependsOnTaskId_key" ON "TaskDependency"("taskId", "dependsOnTaskId");

-- CreateIndex
CREATE INDEX "AllocationRun_projectId_idx" ON "AllocationRun"("projectId");

-- CreateIndex
CREATE INDEX "AllocationRun_triggeredBy_idx" ON "AllocationRun"("triggeredBy");

-- CreateIndex
CREATE INDEX "AllocationRun_status_idx" ON "AllocationRun"("status");

-- CreateIndex
CREATE INDEX "AllocationRun_createdAt_idx" ON "AllocationRun"("createdAt");

-- CreateIndex
CREATE INDEX "AllocationRecommendation_allocationRunId_idx" ON "AllocationRecommendation"("allocationRunId");

-- CreateIndex
CREATE INDEX "AllocationRecommendation_taskId_idx" ON "AllocationRecommendation"("taskId");

-- CreateIndex
CREATE INDEX "AllocationRecommendation_employeeId_idx" ON "AllocationRecommendation"("employeeId");

-- CreateIndex
CREATE INDEX "AllocationRecommendation_eligible_idx" ON "AllocationRecommendation"("eligible");

-- CreateIndex
CREATE INDEX "AllocationRecommendation_score_idx" ON "AllocationRecommendation"("score");

-- CreateIndex
CREATE INDEX "Deliverable_projectId_idx" ON "Deliverable"("projectId");

-- CreateIndex
CREATE INDEX "EmployeeProfile_departmentId_idx" ON "EmployeeProfile"("departmentId");

-- CreateIndex
CREATE INDEX "EmployeeProfile_managerId_idx" ON "EmployeeProfile"("managerId");

-- CreateIndex
CREATE INDEX "EmployeeSkill_skillId_idx" ON "EmployeeSkill"("skillId");

-- CreateIndex
CREATE INDEX "EmployeeSkill_approvedRating_idx" ON "EmployeeSkill"("approvedRating");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_startDate_idx" ON "Project"("startDate");

-- CreateIndex
CREATE INDEX "Project_endDate_idx" ON "Project"("endDate");

-- CreateIndex
CREATE INDEX "Skill_name_idx" ON "Skill"("name");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");

-- AddForeignKey
ALTER TABLE "SkillDevelopmentPlan" ADD CONSTRAINT "SkillDevelopmentPlan_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillDevelopmentPlan" ADD CONSTRAINT "SkillDevelopmentPlan_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSkillRequirement" ADD CONSTRAINT "TaskSkillRequirement_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSkillRequirement" ADD CONSTRAINT "TaskSkillRequirement_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAvailability" ADD CONSTRAINT "EmployeeAvailability_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeWorkload" ADD CONSTRAINT "EmployeeWorkload_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_dependsOnTaskId_fkey" FOREIGN KEY ("dependsOnTaskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationRun" ADD CONSTRAINT "AllocationRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationRun" ADD CONSTRAINT "AllocationRun_triggeredBy_fkey" FOREIGN KEY ("triggeredBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationRecommendation" ADD CONSTRAINT "AllocationRecommendation_allocationRunId_fkey" FOREIGN KEY ("allocationRunId") REFERENCES "AllocationRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationRecommendation" ADD CONSTRAINT "AllocationRecommendation_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationRecommendation" ADD CONSTRAINT "AllocationRecommendation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
