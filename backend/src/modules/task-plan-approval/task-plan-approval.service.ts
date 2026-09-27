import { prisma } from "../../utils/db";
import {
  ApproveTaskPlanInput,
  ApprovedTask,
} from "./task-plan-approval.types";

export const approveTaskPlan = async (
  projectId: string,
  input: ApproveTaskPlanInput
) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (!input.tasks || input.tasks.length === 0) {
    throw new Error("At least one task is required");
  }

  /*
   * Tasks require a deliverableId in the current Prisma schema.
   * Find an existing deliverable belonging to this project.
   */
  const deliverable = await prisma.deliverable.findFirst({
    where: {
      projectId,
    },
    select: {
      id: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (!deliverable) {
    throw new Error(
      "Project does not have a deliverable. Create a deliverable before approving the task plan."
    );
  }

  /*
   * Validate all referenced skills.
   */
  const skillIds = [
    ...new Set(
      input.tasks.flatMap((task) =>
        task.skills.map((skill) => skill.skillId)
      )
    ),
  ];

  const skills = await prisma.skill.findMany({
    where: {
      id: {
        in: skillIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const skillMap = new Map(
    skills.map((skill) => [skill.id, skill])
  );

  for (const task of input.tasks) {
    for (const skill of task.skills) {
      if (!skillMap.has(skill.skillId)) {
        throw new Error(`Skill not found: ${skill.skillId}`);
      }
    }
  }

  /*
   * Validate task dependencies.
   *
   * Dependencies reference tasks by their index
   * in the approved input.
   */
  input.tasks.forEach((task, taskIndex) => {
    for (const dependency of task.dependencies) {
      if (
        dependency.dependsOnTaskIndex < 0 ||
        dependency.dependsOnTaskIndex >= input.tasks.length
      ) {
        throw new Error(
          `Invalid dependency index ${dependency.dependsOnTaskIndex} for task ${taskIndex}`
        );
      }

      if (dependency.dependsOnTaskIndex === taskIndex) {
        throw new Error(
          `Task ${taskIndex} cannot depend on itself`
        );
      }

      if (dependency.dependsOnTaskIndex > taskIndex) {
        throw new Error(
          `Task ${taskIndex} can only depend on an earlier task`
        );
      }
    }
  });

  /*
   * Create the complete approved plan atomically.
   */
  const createdTasks = await prisma.$transaction(async (tx) => {
    const taskReferences: Array<{
      id: string;
      title: string;
    }> = [];

    for (
      let taskIndex = 0;
      taskIndex < input.tasks.length;
      taskIndex++
    ) {
      const taskInput: ApprovedTask = input.tasks[taskIndex];

      const task = await tx.task.create({
        data: {
          title: taskInput.title,
          description: taskInput.description ?? null,
          estimatedHours: taskInput.estimatedHours,
          priority: taskInput.priority,
          projectId,
          deliverableId: deliverable.id,
          status: "PENDING",
        },
      });

      /*
       * Create skill requirements for the task.
       */
      if (taskInput.skills.length > 0) {
        await tx.taskSkillRequirement.createMany({
          data: taskInput.skills.map((skill) => ({
            taskId: task.id,
            skillId: skill.skillId,
            requiredRating: skill.requiredRating,
            weight: skill.weight,
            mandatory: skill.mandatory,
          })),
        });
      }

      /*
       * Create dependencies.
       */
      for (const dependency of taskInput.dependencies) {
        const dependsOnTask =
          taskReferences[dependency.dependsOnTaskIndex];

        if (!dependsOnTask) {
          throw new Error(
            `Unable to resolve dependency for task ${taskIndex}`
          );
        }

        await tx.taskDependency.create({
          data: {
            taskId: task.id,
            dependsOnTaskId: dependsOnTask.id,
          },
        });
      }

      taskReferences.push({
        id: task.id,
        title: task.title,
      });
    }

    return taskReferences;
  });

  /*
   * Fetch the complete created plan.
   */
  const createdTaskIds = createdTasks.map(
    (task) => task.id
  );

  const tasks = await prisma.task.findMany({
    where: {
      id: {
        in: createdTaskIds,
      },
    },
    include: {
      skillRequirements: {
        include: {
          skill: true,
        },
      },
      dependencies: {
        include: {
          dependsOn: true,
        },
      },
    },
  });

  /*
   * Preserve the original approved task order.
   */
  const taskOrder = new Map(
    createdTaskIds.map((id, index) => [id, index])
  );

  tasks.sort(
    (a, b) =>
      (taskOrder.get(a.id) ?? 0) -
      (taskOrder.get(b.id) ?? 0)
  );

  return {
    projectId,
    deliverableId: deliverable.id,
    tasks,
    message: "Task plan approved and created successfully",
  };
};