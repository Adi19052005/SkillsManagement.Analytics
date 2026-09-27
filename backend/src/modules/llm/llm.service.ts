import { TaskStatus } from "@prisma/client";
import { ENV } from "../../config/env";
import { prisma } from "../../utils/db";
import { createDeliverable } from "../deliverables/deliverable.service";
import { addSkillToDeliverable } from "../deliverable-skills/deliverable-skill.service";

interface DeliverableWithSkills {
	name: string;
	description: string;
	tasks: string[];
	skills: {
		skillName: string;
		weight: number;
	}[];
}

interface LLMResponse {
	deliverables: DeliverableWithSkills[];
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export const analyzeProjectWithLLM = async (
	projectId: string,
	projectName: string,
	projectDescription: string,
	userPrompt?: string
) => {
	const project = await prisma.project.findUnique({
		where: { id: projectId }
	});

	if (!project) {
		throw new Error("Project not found");
	}

	const availableSkills = await prisma.skill.findMany({
		select: {
			name: true,
			description: true
		}
	});

	if (availableSkills.length === 0) {
		throw new Error(
			"No skills available in the system. Please create skills first."
		);
	}

	const skillsList = availableSkills
		.map(
			(s) =>
				`- ${s.name}${s.description ? `: ${s.description}` : ""}`
		)
		.join("\n");

	const extraContext = userPrompt?.trim()
		? `\nAdditional Context from HR:\n${userPrompt.trim()}\n`
		: "";

	const prompt = `You are a project management assistant.

Analyze the following project and break it down into deliverables, tasks, and skill requirements.

Project Name:
${projectName}

Project Description:
${projectDescription}

${extraContext}

Available Skills in System:
${skillsList}

Instructions:
1. Break the project into 3-5 major deliverables.
2. For each deliverable, generate exactly 3 concrete tasks.
3. For each deliverable, assign 2-4 skills.
4. You MUST use only skills from the AVAILABLE SKILLS LIST.
5. Use the skill names exactly as provided.
6. Assign a weight between 0.0 and 1.0 based on importance.
7. 1.0 means the skill is extremely important.
8. Do not invent skills.
9. Return ONLY valid JSON.
10. Do not include markdown or explanations.

Return exactly this structure:

{
  "deliverables": [
    {
      "name": "Deliverable Name",
      "description": "Brief description",
      "tasks": [
        "Task 1",
        "Task 2",
        "Task 3"
      ],
      "skills": [
        {
          "skillName": "Exact Skill Name",
          "weight": 0.9
        }
      ]
    }
  ]
}`;

	try {
		const response = await fetch(GROQ_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${ENV.GROQ_API_KEY}`
			},
			body: JSON.stringify({
	model: GROQ_MODEL,
	messages: [
		{
			role: "system",
			content:
				"You are a project planning assistant. Return ONLY valid JSON. Do not use markdown, code fences, comments, or explanations."
		},
		{
			role: "user",
			content: prompt
		}
	],
	temperature: 0.1
})
		});

		if (!response.ok) {
			const errorText = await response.text();

			console.error("Groq API Error:", {
				status: response.status,
				body: errorText
			});

			throw new Error(
				`Groq API request failed with status ${response.status}`
			);
		}

		const result = (await response.json()) as {
			choices?: Array<{
				message?: {
					content?: string;
				};
			}>;
		};

		const text = result.choices?.[0]?.message?.content;

		if (!text) {
			throw new Error("Groq returned an empty response");
		}

		let cleanedText = text.trim();

		if (cleanedText.startsWith("```json")) {
			cleanedText = cleanedText
				.replace(/^```json\s*/i, "")
				.replace(/\s*```$/i, "");
		} else if (cleanedText.startsWith("```")) {
			cleanedText = cleanedText
				.replace(/^```\s*/i, "")
				.replace(/\s*```$/i, "");
		}

		const llmResponse = JSON.parse(cleanedText) as LLMResponse;

		if (
			!llmResponse.deliverables ||
			!Array.isArray(llmResponse.deliverables)
		) {
			throw new Error("Invalid response from Groq");
		}

		const createdDeliverables = [];

		for (const deliverable of llmResponse.deliverables) {
			const createdDeliverable = await createDeliverable(
				projectId,
				deliverable.name,
				deliverable.description
			);

			const taskTitles = Array.isArray(deliverable.tasks)
				? deliverable.tasks
						.map((task) => task.trim())
						.filter((task) => task.length > 0)
				: [];

			const normalizedTasks =
				taskTitles.length > 0
					? taskTitles.slice(0, 3)
					: [
							`Plan ${deliverable.name}`,
							`Implement ${deliverable.name}`,
							`QA ${deliverable.name}`
						];

			const assignedSkills = [];

			for (const skillReq of deliverable.skills || []) {
				const skill = availableSkills.find(
					(s) =>
						s.name.toLowerCase() ===
						skillReq.skillName.toLowerCase()
				);

				if (!skill) {
					console.warn(
						`Skill "${skillReq.skillName}" was not found in the database`
					);
					continue;
				}

				const fullSkill = await prisma.skill.findUnique({
					where: {
						name: skill.name
					}
				});

				if (!fullSkill) {
					continue;
				}

				try {
					await addSkillToDeliverable(
						createdDeliverable.id,
						fullSkill.id,
						skillReq.weight
					);

					assignedSkills.push({
						skillName: skill.name,
						weight: skillReq.weight
					});
				} catch (error) {
					console.warn(
						`Could not add skill ${skill.name}:`,
						error
					);
				}
			}

			await prisma.task.createMany({
				data: normalizedTasks.map((title) => ({
					title,
					status: TaskStatus.PENDING,
					projectId,
					deliverableId: createdDeliverable.id
				}))
			});

			createdDeliverables.push({
				...createdDeliverable,
				assignedSkills,
				tasks: normalizedTasks
			});
		}

		return {
			projectId,
			deliverablesCreated: createdDeliverables.length,
			deliverables: createdDeliverables
		};
	} catch (error) {
		console.error("LLM Analysis Error:", error);

		if (
			error instanceof Error &&
			error.message !== "Failed to analyze project with AI. Please try again."
		) {
			throw error;
		}

		throw new Error(
			"Failed to analyze project with AI. Please try again."
		);
	}
};