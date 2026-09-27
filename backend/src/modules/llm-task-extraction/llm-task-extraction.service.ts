import { prisma } from "../../utils/db";
import {
  ExtractProjectTasksInput,
  ExtractedProjectPlan,
  ExtractedTask,
} from "./llm-task-extraction.types";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const GROQ_MODEL =
  process.env.GROQ_MODEL || "openai/gpt-oss-20b";

const GROQ_API_URL =
  "https://api.groq.com/openai/v1/chat/completions";

/**
 * Get the skills that actually exist in the database.
 */
const getDatabaseSkills = async () => {
  const skills = await prisma.skill.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (skills.length === 0) {
    throw new Error(
      "No skills available in the database"
    );
  }

  return skills;
};

/**
 * Build the LLM prompt using ONLY skills
 * that exist in the database.
 */
const buildPrompt = (
  projectName: string,
  projectDescription: string,
  databaseSkills: {
    id: string;
    name: string;
    description: string | null;
  }[]
): string => {
  const skillsList = databaseSkills
    .map(
      (skill, index) =>
        `${index + 1}. ${skill.name}${
          skill.description
            ? ` - ${skill.description}`
            : ""
        }`
    )
    .join("\n");

  return `
You are an enterprise project planning assistant.

Analyze the project below and create a practical implementation-level task plan.

PROJECT NAME:
${projectName}

PROJECT DESCRIPTION:
${projectDescription}

AVAILABLE SKILLS FROM DATABASE:

${skillsList}

==================================================
CRITICAL SKILL RULE
==================================================

You MUST use ONLY skill names from the AVAILABLE SKILLS FROM DATABASE list.

The skillName in your response MUST match a database skill name EXACTLY.

DO NOT invent skills.

DO NOT create new skill names.

DO NOT use synonyms.

DO NOT use technology names that are not present in the database.

For example, if the database contains:

Docker
Kubernetes
AWS

then valid skillName values are ONLY:

"Docker"
"Kubernetes"
"AWS"

If the project mentions:
- Express
- Node.js
- Helm
- EKS
- CI/CD
- Cloud Architecture

but those are NOT in the database, DO NOT use them as skillName values.

Instead, select the closest relevant skill that actually exists in the database.

==================================================
OUTPUT FORMAT
==================================================

Return exactly one JSON object:

{
  "tasks": [
    {
      "title": "Build Docker container",
      "description": "Create the production Docker image for the application.",
      "estimatedHours": 8,
      "priority": 4,
      "skills": [
        {
          "skillName": "Docker",
          "requiredRating": 3,
          "weight": 1,
          "mandatory": true
        }
      ],
      "dependencies": []
    }
  ]
}

==================================================
TASK RULES
==================================================

1. Create exactly 5 practical implementation-level tasks.
2. Each task must have a clear technical title.
3. Each task must have a useful description.
4. Keep each description concise.
5. estimatedHours must be a positive number.
6. priority must be an integer from 1 to 5.
7. requiredRating must be an integer from 1 to 5.
8. weight must be a positive number.
9. mandatory must be true or false.
10. Every task must contain at least one skill.
11. Use at most 2 skills per task.
12. Every skillName MUST exactly match a database skill.
13. Do not generate skill IDs.
14. Do not generate employee IDs.
15. Do not assign employees.

==================================================
DEPENDENCY RULES
==================================================

16. Task indexes are zero-based.
17. Task 0 MUST have:
    "dependencies": []
18. A task can only depend on an EARLIER task.
19. For task N, dependsOnTaskIndex MUST be between 0 and N-1.
20. Never depend on the current task.
21. Never create circular dependencies.
22. If a task has no prerequisite, use:
    "dependencies": []

==================================================
JSON RULES
==================================================

23. Return ONLY JSON.
24. Do not use markdown.
25. Do not use code fences.
26. Do not add explanations.
27. Do not write text before the JSON.
28. Do not write text after the JSON.
29. The response must start with {.
30. The response must end with }.
31. The response must be directly parseable using JSON.parse().

IMPORTANT:
Use the database skill list above as the ONLY source of valid skill names.
`;
};

/**
 * Extract a JSON object from the LLM response.
 */
const extractJson = (
  responseText: string
): string => {
  let cleaned = responseText.trim();

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace =
    cleaned.indexOf("{");

  if (firstBrace === -1) {
    throw new Error(
      `Groq did not return a JSON object. Response: ${responseText}`
    );
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  let endIndex = -1;

  for (
    let i = firstBrace;
    i < cleaned.length;
    i++
  ) {
    const char = cleaned[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (
      char === "\\" &&
      inString
    ) {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      depth++;
    }

    if (char === "}") {
      depth--;

      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex === -1) {
    throw new Error(
      `Groq returned incomplete JSON. Response: ${responseText}`
    );
  }

  return cleaned.slice(
    firstBrace,
    endIndex + 1
  );
};

/**
 * Validate the structure generated by Groq.
 */
const validateExtractedPlan = (
  plan: ExtractedProjectPlan,
  databaseSkills: {
    id: string;
    name: string;
    description: string | null;
  }[]
): void => {
  if (
    !plan ||
    !Array.isArray(plan.tasks)
  ) {
    throw new Error(
      "Invalid task plan returned by Groq"
    );
  }

  if (plan.tasks.length === 0) {
    throw new Error(
      "Groq returned no tasks"
    );
  }

  const validSkillNames =
    new Set(
      databaseSkills.map(
        (skill) =>
          skill.name
            .toLowerCase()
            .trim()
      )
    );

  plan.tasks.forEach(
    (
      task: ExtractedTask,
      taskIndex: number
    ) => {
      if (
        !task.title ||
        typeof task.title !== "string"
      ) {
        throw new Error(
          `Task ${taskIndex} has an invalid title`
        );
      }

      if (
        !task.description ||
        typeof task.description !==
          "string"
      ) {
        throw new Error(
          `Task ${taskIndex} has an invalid description`
        );
      }

      if (
        typeof task.estimatedHours !==
          "number" ||
        !Number.isFinite(
          task.estimatedHours
        ) ||
        task.estimatedHours <= 0
      ) {
        throw new Error(
          `Task ${taskIndex} has invalid estimatedHours`
        );
      }

      if (
        !Number.isInteger(
          task.priority
        ) ||
        task.priority < 1 ||
        task.priority > 5
      ) {
        throw new Error(
          `Task ${taskIndex} has invalid priority`
        );
      }

      if (
        !Array.isArray(task.skills)
      ) {
        throw new Error(
          `Task ${taskIndex} has invalid skills`
        );
      }

      if (task.skills.length === 0) {
        throw new Error(
          `Task ${taskIndex} must have at least one skill`
        );
      }

      task.skills.forEach(
        (skill, skillIndex) => {
          if (
            !skill.skillName ||
            typeof skill.skillName !==
              "string"
          ) {
            throw new Error(
              `Task ${taskIndex}, skill ${skillIndex} has invalid skillName`
            );
          }

          const normalizedSkillName =
            skill.skillName
              .toLowerCase()
              .trim();

          if (
            !validSkillNames.has(
              normalizedSkillName
            )
          ) {
            throw new Error(
              `Skill "${skill.skillName}" does not exist in the database`
            );
          }

          if (
            !Number.isInteger(
              skill.requiredRating
            ) ||
            skill.requiredRating < 1 ||
            skill.requiredRating > 5
          ) {
            throw new Error(
              `Task ${taskIndex}, skill ${skillIndex} has invalid requiredRating`
            );
          }

          if (
            typeof skill.weight !==
              "number" ||
            !Number.isFinite(
              skill.weight
            ) ||
            skill.weight <= 0
          ) {
            throw new Error(
              `Task ${taskIndex}, skill ${skillIndex} has invalid weight`
            );
          }

          if (
            typeof skill.mandatory !==
              "boolean"
          ) {
            throw new Error(
              `Task ${taskIndex}, skill ${skillIndex} has invalid mandatory value`
            );
          }
        }
      );

      if (
        !Array.isArray(
          task.dependencies
        )
      ) {
        task.dependencies = [];
      }

      /*
       * Only allow dependencies on earlier tasks.
       */
      task.dependencies =
        task.dependencies.filter(
          (dependency) => {
            const index =
              dependency?.dependsOnTaskIndex;

            if (
              !Number.isInteger(index)
            ) {
              return false;
            }

            if (
              index < 0 ||
              index >= taskIndex
            ) {
              return false;
            }

            return true;
          }
        );

      /*
       * Remove duplicate dependencies.
       */
      const unique =
        new Set<number>();

      task.dependencies =
        task.dependencies.filter(
          (dependency) => {
            const index =
              dependency.dependsOnTaskIndex;

            if (
              unique.has(index)
            ) {
              return false;
            }

            unique.add(index);

            return true;
          }
        );
    }
  );
};

/**
 * Resolve the LLM skill names to actual
 * database Skill records.
 */
const resolveSkills = async (
  tasks: ExtractedTask[]
) => {
  const skills =
    await prisma.skill.findMany({
      select: {
        id: true,
        name: true,
      },
    });

  const skillMap =
    new Map(
      skills.map((skill) => [
        skill.name
          .toLowerCase()
          .trim(),
        skill,
      ])
    );

  return tasks.map(
    (task) => ({
      ...task,

      skills: task.skills.map(
        (requiredSkill) => {
          const normalizedName =
            requiredSkill.skillName
              .toLowerCase()
              .trim();

          const skill =
            skillMap.get(
              normalizedName
            );

          if (!skill) {
            throw new Error(
              `Skill "${requiredSkill.skillName}" does not exist in the database`
            );
          }

          return {
            skillId: skill.id,
            skillName: skill.name,
            requiredRating:
              requiredSkill.requiredRating,
            weight:
              requiredSkill.weight,
            mandatory:
              requiredSkill.mandatory,
          };
        }
      ),
    })
  );
};

/**
 * Call Groq.
 */
const callGroq = async (
  prompt: string
): Promise<string> => {
  if (!GROQ_API_KEY) {
    throw new Error(
      "GROQ_API_KEY is not configured"
    );
  }

  const maxAttempts = 3;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    const response =
      await fetch(
        GROQ_API_URL,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${GROQ_API_KEY}`,
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            model: GROQ_MODEL,

            messages: [
              {
                role: "system",
                content:
                  "You are an enterprise project planning assistant. Use ONLY the database skills provided in the prompt. Return exactly one valid JSON object and nothing else.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],

            temperature: 0,
          }),
        }
      );

    if (response.ok) {
      const result =
        await response.json();

      const content =
        result?.choices?.[0]
          ?.message?.content;

      if (
        typeof content !==
          "string" ||
        !content.trim()
      ) {
        throw new Error(
          "Groq response did not contain usable content"
        );
      }

      return content;
    }

    const errorText =
      await response.text();

    if (
      (
        response.status === 429 ||
        response.status === 500 ||
        response.status === 502 ||
        response.status === 503
      ) &&
      attempt < maxAttempts
    ) {
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            attempt * 2000
          )
      );

      continue;
    }

    throw new Error(
      `Groq request failed: ${response.status} ${errorText}`
    );
  }

  throw new Error(
    "Groq request failed after retries"
  );
};

export const extractProjectTasks =
  async (
    data: ExtractProjectTasksInput
  ) => {
    const project =
      await prisma.project.findUnique({
        where: {
          id: data.projectId,
        },

        select: {
          id: true,
          name: true,
          description: true,
        },
      });

    if (!project) {
      throw new Error(
        "Project not found"
      );
    }

    const description =
      data.projectDescription?.trim() ||
      project.description;

    if (!description) {
      throw new Error(
        "Project description is required for task extraction"
      );
    }

    /*
     * IMPORTANT:
     * Fetch skills BEFORE calling Groq.
     */
    const databaseSkills =
      await getDatabaseSkills();

    const prompt =
      buildPrompt(
        project.name,
        description,
        databaseSkills
      );

    const responseText =
      await callGroq(prompt);

    let jsonText: string;

    try {
      jsonText =
        extractJson(
          responseText
        );
    } catch (error) {
      console.error(
        "GROQ RAW RESPONSE:",
        responseText
      );

      throw error;
    }

    let plan: ExtractedProjectPlan;

    try {
      plan = JSON.parse(
        jsonText
      ) as ExtractedProjectPlan;
    } catch (error) {
      console.error(
        "GROQ RAW RESPONSE:",
        responseText
      );

      console.error(
        "EXTRACTED JSON:",
        jsonText
      );

      console.error(
        "JSON PARSE ERROR:",
        error
      );

      throw new Error(
        "Groq returned invalid JSON"
      );
    }

    plan.projectId =
      project.id;

    /*
     * Validate against the actual
     * database skill list.
     */
    validateExtractedPlan(
      plan,
      databaseSkills
    );

    /*
     * Convert skill names to actual
     * database Skill IDs.
     */
    const resolvedTasks =
      await resolveSkills(
        plan.tasks
      );

    return {
      project: {
        id: project.id,
        name: project.name,
        description,
      },

      availableSkills:
        databaseSkills.map(
          (skill) => ({
            id: skill.id,
            name: skill.name,
          })
        ),

      tasks: resolvedTasks,

      message:
        "Task extraction completed successfully. Review the generated plan before creating database tasks.",
    };
  };